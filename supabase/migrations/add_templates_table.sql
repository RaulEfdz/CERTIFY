-- Migration: Add templates table for dynamic template editing
-- Author: Claude Code
-- Description: Adds templates table to support dynamic template editing with auto-save functionality

-- SECCIÓN 1: ENUMS para templates
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'template_status') THEN
        CREATE TYPE public.template_status AS ENUM ('draft', 'published', 'archived');
    END IF;
END;
$$ LANGUAGE plpgsql;

-- SECCIÓN 2: Tabla de plantillas
CREATE TABLE IF NOT EXISTS public.templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
    
    -- Template configuration (JSON object containing all template settings)
    config JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- Generated HTML content
    html TEXT NOT NULL DEFAULT '',
    
    -- Status and visibility
    status public.template_status NOT NULL DEFAULT 'draft',
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Template metadata
    thumbnail_url TEXT,
    preview_image_url TEXT,
    
    -- Ownership and organization
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    
    -- Auto-save support
    last_saved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    auto_save_data JSONB, -- Stores unsaved changes for auto-recovery
    
    -- Version control
    version INTEGER NOT NULL DEFAULT 1,
    
    -- Usage statistics
    usage_count INTEGER NOT NULL DEFAULT 0,
    last_used_at TIMESTAMPTZ,
    
    -- Standard audit fields
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ,
    
    -- Constraints
    CONSTRAINT templates_name_length CHECK (length(name) >= 3),
    CONSTRAINT templates_category_valid CHECK (category IN (
        'Académico', 'Profesional', 'Reconocimiento', 'Participación', 
        'Empresarial', 'Deportivo', 'Otro'
    ))
);

-- SECCIÓN 3: Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_templates_created_by ON public.templates(created_by);
CREATE INDEX IF NOT EXISTS idx_templates_organization ON public.templates(organization_id);
CREATE INDEX IF NOT EXISTS idx_templates_status ON public.templates(status);
CREATE INDEX IF NOT EXISTS idx_templates_category ON public.templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_public ON public.templates(is_public) WHERE is_public = TRUE;
CREATE INDEX IF NOT EXISTS idx_templates_tags ON public.templates USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_templates_config ON public.templates USING GIN(config);
CREATE INDEX IF NOT EXISTS idx_templates_last_saved ON public.templates(last_saved_at DESC);
CREATE INDEX IF NOT EXISTS idx_templates_usage ON public.templates(usage_count DESC, last_used_at DESC);

-- SECCIÓN 4: Triggers
-- Trigger para actualizar updated_at
DROP TRIGGER IF EXISTS trg_templates_updated_at ON public.templates;
CREATE TRIGGER trg_templates_updated_at
BEFORE UPDATE ON public.templates
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para actualizar last_saved_at cuando cambia el contenido
CREATE OR REPLACE FUNCTION public.update_template_last_saved()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo actualizar last_saved_at si cambió el config o html
    IF (OLD.config IS DISTINCT FROM NEW.config) OR (OLD.html IS DISTINCT FROM NEW.html) THEN
        NEW.last_saved_at = now();
        -- Limpiar auto_save_data cuando se guarda
        NEW.auto_save_data = NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_templates_last_saved ON public.templates;
CREATE TRIGGER trg_templates_last_saved
BEFORE UPDATE ON public.templates
FOR EACH ROW EXECUTE FUNCTION public.update_template_last_saved();

-- Trigger para incrementar usage_count
CREATE OR REPLACE FUNCTION public.increment_template_usage()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.templates 
    SET 
        usage_count = usage_count + 1,
        last_used_at = now(),
        updated_at = now()
    WHERE id = NEW.template_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- SECCIÓN 5: RLS (Row Level Security)
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver plantillas públicas y sus propias plantillas
DROP POLICY IF EXISTS "Allow users to view public and own templates" ON public.templates;
CREATE POLICY "Allow users to view public and own templates"
ON public.templates FOR SELECT
USING (
    is_public = TRUE 
    OR created_by = auth.uid()
    OR organization_id IN (
        SELECT organization_id 
        FROM public.organization_members 
        WHERE user_id = auth.uid()
    )
);

-- Política: Los usuarios solo pueden crear plantillas para sí mismos
DROP POLICY IF EXISTS "Allow users to create own templates" ON public.templates;
CREATE POLICY "Allow users to create own templates"
ON public.templates FOR INSERT
WITH CHECK (created_by = auth.uid());

-- Política: Los usuarios solo pueden editar sus propias plantillas
DROP POLICY IF EXISTS "Allow users to update own templates" ON public.templates;
CREATE POLICY "Allow users to update own templates"
ON public.templates FOR UPDATE
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

-- Política: Los usuarios solo pueden eliminar sus propias plantillas
DROP POLICY IF EXISTS "Allow users to delete own templates" ON public.templates;
CREATE POLICY "Allow users to delete own templates"
ON public.templates FOR DELETE
USING (created_by = auth.uid());

-- SECCIÓN 6: Función para auto-save
CREATE OR REPLACE FUNCTION public.auto_save_template(
    template_id UUID,
    config_data JSONB,
    html_content TEXT
)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    -- Verificar que el usuario tiene permisos para editar esta plantilla
    IF NOT EXISTS (
        SELECT 1 FROM public.templates 
        WHERE id = template_id AND created_by = auth.uid()
    ) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Permission denied');
    END IF;

    -- Guardar los datos temporales en auto_save_data
    UPDATE public.templates 
    SET 
        auto_save_data = jsonb_build_object(
            'config', config_data,
            'html', html_content,
            'timestamp', now()
        ),
        updated_at = now()
    WHERE id = template_id;

    RETURN jsonb_build_object(
        'success', true, 
        'saved_at', now(),
        'message', 'Auto-saved successfully'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- SECCIÓN 7: Función para guardar cambios permanentes
CREATE OR REPLACE FUNCTION public.save_template_changes(
    template_id UUID,
    config_data JSONB,
    html_content TEXT,
    template_name VARCHAR(255) DEFAULT NULL,
    template_description TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    -- Verificar permisos
    IF NOT EXISTS (
        SELECT 1 FROM public.templates 
        WHERE id = template_id AND created_by = auth.uid()
    ) THEN
        RETURN jsonb_build_object('success', false, 'error', 'Permission denied');
    END IF;

    -- Guardar cambios permanentes
    UPDATE public.templates 
    SET 
        config = config_data,
        html = html_content,
        name = COALESCE(template_name, name),
        description = COALESCE(template_description, description),
        auto_save_data = NULL, -- Limpiar auto-save data
        version = version + 1,
        last_saved_at = now(),
        updated_at = now()
    WHERE id = template_id;

    RETURN jsonb_build_object(
        'success', true, 
        'saved_at', now(),
        'version', (SELECT version FROM public.templates WHERE id = template_id),
        'message', 'Template saved successfully'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;