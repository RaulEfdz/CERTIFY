"use client";

import { useState, useEffect } from "react";
import { TemplateBaseSelector, TemplateBase } from "./editor/components/TemplateBaseSelector";
import { DynamicTemplateEditor } from "./DynamicTemplateEditor";
import { createClient } from "@/lib/supabase/client";
import { mockDatabase } from "@/lib/mock-db";
import { toast } from "sonner";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  config: any;
  html: string;
  status: string;
  is_public: boolean;
  created_by: string;
  organization_id: string | null;
  auto_save_data: any;
  version: number;
  created_at: string;
  updated_at: string;
  last_saved_at: string;
}

interface TemplateInitializerProps {
  templateId: string;
  initialTemplate: Template;
  onTemplateUpdate?: (template: Template) => void;
}

export function TemplateInitializer({ 
  templateId, 
  initialTemplate, 
  onTemplateUpdate 
}: TemplateInitializerProps) {
  const [showBaseSelector, setShowBaseSelector] = useState(true);
  const [template, setTemplate] = useState<Template>(initialTemplate);
  const [updating, setUpdating] = useState(false);

  // Si la plantilla ya tiene configuración personalizada, saltar el selector
  useEffect(() => {
    if (initialTemplate.config && 
        (initialTemplate.config.logoUrl || 
         initialTemplate.config.backgroundUrl || 
         initialTemplate.config.title !== 'Certificado de Finalización')) {
      setShowBaseSelector(false);
    }
  }, [initialTemplate]);

  const handleTemplateSelect = async (templateBase: TemplateBase) => {
    try {
      setUpdating(true);
      const supabase = createClient();

      // Actualizar la plantilla con la configuración base seleccionada
      const updatedConfig = {
        ...templateBase.config,
        // Preservar algunos campos existentes
        studentName: initialTemplate.config?.studentName || templateBase.config.defaultStudentName || 'Nombre del Estudiante',
        courseName: initialTemplate.config?.courseName || templateBase.config.defaultCourseName || 'Desarrollo Web Avanzado',
        directorName: initialTemplate.config?.directorName || 'Firma del Director',
        date: initialTemplate.config?.date || new Date().toISOString(),
        dateLocale: initialTemplate.config?.dateLocale || 'es-ES'
      };

      const { data, error } = await mockDatabase.updateTemplate(templateId, {
        name: templateBase.name,
        description: templateBase.description,
        category: templateBase.category,
        config: updatedConfig
      });

      if (error) throw error;

      const updatedTemplate = { ...template, ...data };
      setTemplate(updatedTemplate);
      
      if (onTemplateUpdate) {
        onTemplateUpdate(updatedTemplate);
      }

      setShowBaseSelector(false);
      toast.success(`Plantilla "${templateBase.name}" aplicada exitosamente`);

    } catch (error) {
      console.error('Error updating template:', error);
      toast.error("Error al aplicar la plantilla base");
    } finally {
      setUpdating(false);
    }
  };

  const handleSkipTemplate = () => {
    setShowBaseSelector(false);
  };

  if (showBaseSelector) {
    return (
      <TemplateBaseSelector
        onSelect={handleTemplateSelect}
        onSkip={handleSkipTemplate}
        isUpdating={updating}
      />
    );
  }

  return (
    <DynamicTemplateEditor 
      templateId={templateId}
      initialTemplate={template}
      onTemplateUpdate={(updatedTemplate) => {
        setTemplate(updatedTemplate);
        if (onTemplateUpdate) {
          onTemplateUpdate(updatedTemplate);
        }
      }}
    />
  );
}