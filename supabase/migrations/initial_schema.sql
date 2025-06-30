-- Versión 1.2
-- Corregido y optimizado para Supabase
-- Autor de la corrección: Modelo de IA

-- SECCIÓN 1: ENUMS
-- (Se definen primero, ya que las tablas dependen de ellos)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('super_admin', 'admin', 'instructor', 'student', 'institution', 'guest');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'organization_role') THEN
        CREATE TYPE public.organization_role AS ENUM ('owner', 'admin', 'member', 'guest');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_plan') THEN
        CREATE TYPE public.subscription_plan AS ENUM ('free', 'basic', 'premium', 'enterprise');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status') THEN
        CREATE TYPE public.subscription_status AS ENUM ('active', 'trial', 'past_due', 'canceled', 'unpaid', 'incomplete', 'incomplete_expired', 'paused');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'certificate_status') THEN
        CREATE TYPE public.certificate_status AS ENUM ('draft', 'pending', 'issued', 'revoked');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
        CREATE TYPE public.payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded', 'disputed', 'partially_refunded');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_method_type') THEN
        CREATE TYPE public.payment_method_type AS ENUM ('efectivo', 'payment_mobile', 'tarjeta');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'billing_cycle') THEN
        CREATE TYPE public.billing_cycle AS ENUM ('monthly', 'quarterly', 'yearly', 'one_time');
    END IF;
END;
$$ LANGUAGE plpgsql;


-- SECCIÓN 2: TABLAS (ordenadas para respetar las Foreign Keys)

-- 2.1 Métodos de pago
CREATE TABLE IF NOT EXISTS public.payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type public.payment_method_type NOT NULL,
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

-- 2.2 Descuentos y códigos promocionales
CREATE TABLE IF NOT EXISTS public.discounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed_amount')),
    discount_value DECIMAL(10, 2) NOT NULL,
    max_discount_amount DECIMAL(10, 2),
    min_purchase_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    max_uses INTEGER,
    uses INTEGER NOT NULL DEFAULT 0,
    valid_from TIMESTAMPTZ NOT NULL,
    valid_until TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.3 Planes de suscripción
CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    price_monthly DECIMAL(10, 2) NOT NULL,
    price_quarterly DECIMAL(10, 2),
    price_yearly DECIMAL(10, 2),
    currency CHAR(3) NOT NULL DEFAULT 'USD',
    billing_cycles public.billing_cycle [] NOT NULL DEFAULT ARRAY['monthly', 'yearly']::public.billing_cycle[],
    trial_period_days INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    max_users INTEGER,
    max_storage_mb INTEGER,
    features JSONB NOT NULL DEFAULT '{}'::jsonb,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

-- 2.4 Organizaciones
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    website TEXT,
    logo_public_id TEXT,
    logo_url TEXT,
    logo_version VARCHAR(50),
    logo_format VARCHAR(10),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    metadata JSONB NOT NULL DEFAULT '{"storage_provider":"cloudinary"}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT valid_slug CHECK (slug ~* '^[a-z0-9\-]+$'),
    CONSTRAINT logo_complete CHECK (
        (logo_public_id IS NULL AND logo_url IS NULL AND logo_version IS NULL AND logo_format IS NULL) OR
        (logo_public_id IS NOT NULL AND logo_url IS NOT NULL AND logo_version IS NOT NULL AND logo_format IS NOT NULL)
    )
);

-- 2.5 Suscripciones de usuario
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES public.subscription_plans(id) ON DELETE RESTRICT,
    status public.subscription_status NOT NULL DEFAULT 'active',
    billing_cycle public.billing_cycle NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'USD',
    stripe_subscription_id TEXT,
    stripe_customer_id TEXT,
    paypal_subscription_id TEXT,
    current_period_start TIMESTAMPTZ NOT NULL DEFAULT now(),
    current_period_end TIMESTAMPTZ, -- Se permite NULL para 'one_time'
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
    canceled_at TIMESTAMPTZ,
    trial_start TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,
    payment_method_id UUID REFERENCES public.payment_methods(id) ON DELETE SET NULL,
    discount_id UUID REFERENCES public.discounts(id) ON DELETE SET NULL,
    billing_email VARCHAR(255),
    billing_address JSONB,
    tax_rate DECIMAL(5, 2) NOT NULL DEFAULT 0,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ,
    CONSTRAINT chk_period_end_for_recurring CHECK (
        (billing_cycle = 'one_time') OR (billing_cycle <> 'one_time' AND current_period_end IS NOT NULL)
    )
);

-- 2.6 Miembros de organización
CREATE TABLE IF NOT EXISTS public.organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role public.organization_role NOT NULL DEFAULT 'member',
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (organization_id, user_id)
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_org_members_one_primary ON public.organization_members(organization_id) WHERE is_primary = TRUE;

-- 2.7 Perfiles de usuario
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    full_name VARCHAR(200) GENERATED ALWAYS AS (trim(coalesce(first_name, '') || ' ' || coalesce(last_name, ''))) STORED,
    avatar_url TEXT,
    bio TEXT,
    website TEXT,
    phone VARCHAR(20),
    country VARCHAR(100),
    timezone VARCHAR(100) NOT NULL DEFAULT 'UTC',
    role public.user_role NOT NULL DEFAULT 'student',
    current_organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    active_subscription_id UUID REFERENCES public.user_subscriptions(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT valid_username CHECK (username ~* '^[A-Za-z0-9_.]+$' AND length(username) >= 3)
);

-- 2.8 Cursos
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    instructor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    thumbnail_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.9 Inscripciones
CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ,
    progress JSONB NOT NULL DEFAULT '{}'::jsonb,
    UNIQUE (user_id, course_id)
);

-- 2.10 Invitaciones
CREATE TABLE IF NOT EXISTS public.organization_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    role public.organization_role NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    accepted_at TIMESTAMPTZ,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (organization_id, email)
);

-- 2.11 Certificados
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    issued_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    verification_code VARCHAR(50) UNIQUE, -- El trigger lo genera
    status public.certificate_status NOT NULL DEFAULT 'pending',
    pdf_url TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.12 Logs de actividad
CREATE TABLE IF NOT EXISTS public.user_activity_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.13 Facturas
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(50) UNIQUE, -- El trigger lo genera
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES public.user_subscriptions(id) ON DELETE SET NULL,
    issue_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    due_date TIMESTAMPTZ,
    paid_date TIMESTAMPTZ,
    status public.payment_status NOT NULL DEFAULT 'pending',
    subtotal_amount DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'USD',
    notes TEXT,
    terms TEXT,
    footer TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

-- 2.14 Ítems de factura
CREATE TABLE IF NOT EXISTS public.invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL DEFAULT 1,
    unit_price DECIMAL(10, 2) NOT NULL,
    tax_rate DECIMAL(5, 2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.15 Pagos
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'USD',
    payment_method_id UUID REFERENCES public.payment_methods(id) ON DELETE SET NULL,
    payment_method_type public.payment_method_type NOT NULL,
    transaction_id VARCHAR(255),
    status public.payment_status NOT NULL DEFAULT 'pending',
    error_message TEXT,
    refunded_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    refund_reason TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.16 Permisos por rol
CREATE TABLE IF NOT EXISTS public.role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role public.user_role NOT NULL UNIQUE,
    permissions TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- SECCIÓN 3: FUNCIONES Y TRIGGERS

-- 3.1 Trigger genérico para actualizar 'updated_at'
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Bucle para aplicar el trigger a todas las tablas con la columna 'updated_at'
DO $$
DECLARE
    tbl_name TEXT;
BEGIN
    FOR tbl_name IN
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name IN (
            'payment_methods', 'discounts', 'subscription_plans', 'organizations',
            'user_subscriptions', 'organization_members', 'profiles', 'courses',
            'enrollments', 'organization_invitations', 'certificates',
            'invoices', 'invoice_items', 'payments', 'role_permissions'
        )
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS trg_%s_updated_at ON public.%I;', tbl_name, tbl_name);
        EXECUTE format('
            CREATE TRIGGER trg_%s_updated_at
            BEFORE UPDATE ON public.%I
            FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
        ', tbl_name, tbl_name);
    END LOOP;
END;
$$ LANGUAGE plpgsql;


-- 3.2 Crear perfil de usuario y procesar invitaciones automáticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    base_username TEXT;
    final_username TEXT;
    suffix INT := 0;
    inv_org_id UUID;
    inv_role public.organization_role;
BEGIN
    -- Generar un nombre de usuario único
    base_username := lower(regexp_replace(split_part(NEW.email, '@', 1), '[^a-z0-9_.]', '', 'g'));
    final_username := base_username;
    LOOP
        IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) THEN
            EXIT;
        END IF;
        suffix := suffix + 1;
        final_username := base_username || suffix;
    END LOOP;

    -- Insertar el nuevo perfil
    INSERT INTO public.profiles (id, username, first_name, last_name, avatar_url, metadata)
    VALUES (
        NEW.id,
        final_username,
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name',
        NEW.raw_user_meta_data->>'avatar_url',
        jsonb_build_object('provider', NEW.raw_app_meta_data->>'provider')
    );

    -- Procesar invitaciones pendientes para este email
    FOR inv_org_id, inv_role IN
        SELECT organization_id, role
        FROM public.organization_invitations
        WHERE email = NEW.email AND accepted_at IS NULL AND expires_at > now()
    LOOP
        INSERT INTO public.organization_members (organization_id, user_id, role, is_primary)
        VALUES (inv_org_id, NEW.id, inv_role, FALSE)
        ON CONFLICT (organization_id, user_id) DO NOTHING;

        UPDATE public.organization_invitations
        SET accepted_at = now(), updated_at = now()
        WHERE organization_id = inv_org_id AND email = NEW.email;
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Aplicar el trigger a la tabla auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3.3 Generar código de verificación para certificados
CREATE OR REPLACE FUNCTION public.generate_verification_code()
RETURNS TRIGGER AS $$
BEGIN
    NEW.verification_code := 'CERT-' || substr(md5(random()::text || clock_timestamp()::text), 1, 12);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_certificates_verify_code ON public.certificates;
CREATE TRIGGER trg_certificates_verify_code
BEFORE INSERT ON public.certificates
FOR EACH ROW EXECUTE FUNCTION public.generate_verification_code();

-- 3.4 Generar número de factura secuencial
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TRIGGER AS $$
DECLARE
    seq_val INT;
    year_month_prefix TEXT;
BEGIN
    year_month_prefix := 'INV-' || to_char(NEW.issue_date, 'YYYYMM') || '-';
    
    SELECT COALESCE(MAX(SUBSTRING(invoice_number FROM (LENGTH(year_month_prefix) + 1))::INT), 0) + 1
    INTO seq_val
    FROM public.invoices
    WHERE invoice_number LIKE year_month_prefix || '%';

    NEW.invoice_number := year_month_prefix || LPAD(seq_val::TEXT, 5, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_invoices_number ON public.invoices;
CREATE TRIGGER trg_invoices_number
BEFORE INSERT ON public.invoices
FOR EACH ROW WHEN (NEW.invoice_number IS NULL)
EXECUTE FUNCTION public.generate_invoice_number();

-- SECCIÓN 4: RLS (Row Level Security)

-- Habilitar RLS en todas las tablas necesarias
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY; -- CORREGIDO: ROW LEVEL SECURITY
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- Políticas de ejemplo (ajusta según tu lógica de negocio)

-- El usuario solo puede ver y gestionar sus propios métodos de pago.
DROP POLICY IF EXISTS "Allow owner access" ON public.payment_methods;
CREATE POLICY "Allow owner access"
ON public.payment_methods FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Todos los usuarios autenticados pueden ver los descuentos activos.
DROP POLICY IF EXISTS "Allow read access to active discounts" ON public.discounts;
CREATE POLICY "Allow read access to active discounts"
ON public.discounts FOR SELECT
USING (is_active = TRUE AND (valid_until IS NULL OR valid_until > now()));

-- Solo un 'super_admin' puede gestionar los planes de suscripción.
DROP POLICY IF EXISTS "Allow super_admin to manage plans" ON public.subscription_plans;
CREATE POLICY "Allow super_admin to manage plans"
ON public.subscription_plans FOR ALL
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin')
WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin');

-- Los usuarios pueden ver las organizaciones de las que son miembros.
DROP POLICY IF EXISTS "Allow members to view their organizations" ON public.organizations;
CREATE POLICY "Allow members to view their organizations"
ON public.organizations FOR SELECT
USING (id IN (SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()));

-- Un usuario puede ver y actualizar su propio perfil. Los 'super_admin' pueden ver todos.
DROP POLICY IF EXISTS "Allow users to view/update their own profile" ON public.profiles;
CREATE POLICY "Allow users to view/update their own profile"
ON public.profiles FOR ALL
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "Allow super_admin to view all profiles" ON public.profiles;
CREATE POLICY "Allow super_admin to view all profiles"
ON public.profiles FOR SELECT
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'super_admin');


-- SECCIÓN 5: ÍNDICES ADICIONALES PARA MEJORAR RENDIMIENTO

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_subscriptions_active_unique ON public.user_subscriptions(user_id) WHERE status IN ('active', 'trial');
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_org ON public.profiles(current_organization_id);
CREATE INDEX IF NOT EXISTS idx_courses_org ON public.courses(organization_id);
CREATE INDEX IF NOT EXISTS idx_courses_published ON public.courses(is_published);
CREATE INDEX IF NOT EXISTS idx_enrollments_user_course ON public.enrollments(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_certificates_user_course ON public.certificates(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_invoices_org ON public.invoices(organization_id);
CREATE INDEX IF NOT EXISTS idx_payments_org ON public.payments(organization_id);
-- SECCIÓN 6: DATOS INICIALES (SEEDING)

-- 6.1 Planes de suscripción por defecto
INSERT INTO public.subscription_plans (name, description, price_monthly, price_quarterly, price_yearly, currency, billing_cycles, trial_period_days, max_users, max_storage_mb, features)
VALUES
('Free', 'Plan gratuito básico.', 0, NULL, 0, 'USD', ARRAY['monthly']::public.billing_cycle[], 0, 1, 100, '{"max_courses": 3, "support": "community"}'),
('Basic', 'Ideal para independientes.', 9.99, 26.97, 99.99, 'USD', ARRAY['monthly', 'yearly']::public.billing_cycle[], 7, 3, 1024, '{"analytics": true, "support": "email"}'),
('Premium', 'Para profesionales.', 29.99, 80.97, 299.99, 'USD', ARRAY['monthly', 'quarterly', 'yearly']::public.billing_cycle[], 14, 10, 5120, '{"api_access": true}'),
('Enterprise', 'Solución empresarial.', 99.99, 269.97, 999.99, 'USD', ARRAY['monthly', 'quarterly', 'yearly']::public.billing_cycle[], 30, NULL, 10240, '{"sso": true}')
ON CONFLICT (name) DO UPDATE SET
    description = EXCLUDED.description,
    price_monthly = EXCLUDED.price_monthly,
    price_quarterly = EXCLUDED.price_quarterly,
    price_yearly = EXCLUDED.price_yearly,
    billing_cycles = EXCLUDED.billing_cycles, -- No es necesario castear aquí
    trial_period_days = EXCLUDED.trial_period_days,
    max_users = EXCLUDED.max_users,
    max_storage_mb = EXCLUDED.max_storage_mb,
    features = EXCLUDED.features,
    updated_at = now();