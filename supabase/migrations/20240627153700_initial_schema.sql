--------------------------------------------------------------------------------
-- ESQUEMA DE BASE DE DATOS PARA PLATAFORMA EDUCATIVA (LMS)
-- Versión: 1.1 (Corregido)
-- Descripción: Estructura completa de la base de datos, con tipos, tablas,
-- funciones, triggers, políticas RLS e índices.
--------------------------------------------------------------------------------

/*
----------------------------------------
-- SECCIÓN 1: TIPOS PERSONALIZADOS (ENUMS)
----------------------------------------
*/
DO $$
BEGIN
  CREATE TYPE IF NOT EXISTS public.user_role AS ENUM
    ('super_admin', 'admin', 'instructor', 'student', 'institution', 'guest');
  CREATE TYPE IF NOT EXISTS public.organization_role AS ENUM
    ('owner', 'admin', 'member', 'guest');
  CREATE TYPE IF NOT EXISTS public.subscription_plan AS ENUM
    ('free', 'basic', 'premium', 'enterprise');
  CREATE TYPE IF NOT EXISTS public.subscription_status AS ENUM
    ('active', 'trial', 'past_due', 'canceled', 'unpaid', 'incomplete', 'incomplete_expired', 'paused');
  CREATE TYPE IF NOT EXISTS public.certificate_status AS ENUM
    ('draft', 'pending', 'issued', 'revoked');
  CREATE TYPE IF NOT EXISTS public.payment_status AS ENUM
    ('pending', 'paid', 'failed', 'refunded', 'disputed', 'partially_refunded');
  CREATE TYPE IF NOT EXISTS public.payment_method_type AS ENUM
    ('card', 'bank_transfer', 'paypal', 'crypto', 'other');
  CREATE TYPE IF NOT EXISTS public.billing_cycle AS ENUM
    ('monthly', 'quarterly', 'yearly', 'one_time');
EXCEPTION
  WHEN duplicate_object THEN
    NULL;
END;
$$ LANGUAGE plpgsql;

/*
----------------------------------------
-- SECCIÓN 2: DEFINICIÓN DE TABLAS
----------------------------------------
*/

-- Métodos de pago
CREATE TABLE IF NOT EXISTS public.payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type payment_method_type NOT NULL,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- Descuentos y códigos promocionales
CREATE TABLE IF NOT EXISTS public.discounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage','fixed_amount')),
  discount_value DECIMAL(10,2) NOT NULL,
  max_discount_amount DECIMAL(10,2),
  min_purchase_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  max_uses INTEGER,
  uses INTEGER NOT NULL DEFAULT 0,
  valid_from TIMESTAMPTZ NOT NULL,
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Planes de suscripción
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10,2) NOT NULL,
  price_quarterly DECIMAL(10,2),
  price_yearly DECIMAL(10,2),
  currency CHAR(3) NOT NULL DEFAULT 'USD',
  billing_cycles billing_cycle[] NOT NULL DEFAULT ARRAY['monthly','yearly']::billing_cycle[],
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

-- Organizaciones
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
  metadata JSONB NOT NULL DEFAULT '{"storage_provider":"cloudinary"}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT valid_slug CHECK (slug ~* '^[a-z0-9\-]+$'),
  CONSTRAINT logo_complete CHECK (
    (logo_public_id IS NULL AND logo_url IS NULL AND logo_version IS NULL AND logo_format IS NULL)
    OR (logo_public_id IS NOT NULL AND logo_url IS NOT NULL AND logo_version IS NOT NULL AND logo_format IS NOT NULL)
  )
);

-- Miembros de organización
CREATE TABLE IF NOT EXISTS public.organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role organization_role NOT NULL DEFAULT 'member',
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, user_id)
);

-- Perfil de usuario
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  full_name VARCHAR(200) GENERATED ALWAYS AS (
    trim(coalesce(first_name,'') || ' ' || coalesce(last_name,''))
  ) STORED,
  avatar_url TEXT,
  bio TEXT,
  website TEXT,
  phone VARCHAR(20),
  country VARCHAR(100),
  timezone VARCHAR(100) NOT NULL DEFAULT 'UTC',
  role user_role NOT NULL DEFAULT 'student',
  current_organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  active_subscription_id UUID REFERENCES public.user_subscriptions(id) ON DELETE SET NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT valid_username CHECK (
    username ~* '^[A-Za-z0-9_.]+$' AND length(username) >= 3
  )
);

-- Cursos
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

-- Inscripciones
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  progress JSONB NOT NULL DEFAULT '{}'::jsonb,
  UNIQUE (user_id, course_id)
);

-- Invitaciones
CREATE TABLE IF NOT EXISTS public.organization_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  role organization_role NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, email)
);

-- Certificados
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  issued_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  verification_code VARCHAR(50) UNIQUE NOT NULL,
  status certificate_status NOT NULL DEFAULT 'pending',
  pdf_url TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Logs de actividad
CREATE TABLE IF NOT EXISTS public.user_activity_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Suscripciones de usuario
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id) ON DELETE RESTRICT,
  status subscription_status NOT NULL DEFAULT 'active',
  billing_cycle billing_cycle NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'USD',
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  paypal_subscription_id TEXT,
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT FALSE,
  canceled_at TIMESTAMPTZ,
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  payment_method_id UUID REFERENCES public.payment_methods(id) ON DELETE SET NULL,
  discount_id UUID REFERENCES public.discounts(id) ON DELETE SET NULL,
  billing_email VARCHAR(255),
  billing_address JSONB,
  tax_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT chk_billing_cycle_valid CHECK (
    (billing_cycle = 'one_time' AND current_period_end IS NULL) OR
    (billing_cycle <> 'one_time' AND current_period_end IS NOT NULL)
  )
);

-- Facturas
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.user_subscriptions(id) ON DELETE SET NULL,
  issue_date TIMESTAMPTZ NOT NULL,
  due_date TIMESTAMPTZ,
  paid_date TIMESTAMPTZ,
  status payment_status NOT NULL DEFAULT 'pending',
  subtotal_amount DECIMAL(10,2) NOT NULL,
  tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'USD',
  notes TEXT,
  terms TEXT,
  footer TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- Ítems de factura
CREATE TABLE IF NOT EXISTS public.invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  tax_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Pagos
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'USD',
  payment_method_id UUID REFERENCES public.payment_methods(id) ON DELETE SET NULL,
  payment_method_type payment_method_type NOT NULL,
  transaction_id VARCHAR(255),
  status payment_status NOT NULL DEFAULT 'pending',
  error_message TEXT,
  refunded_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  refund_reason TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Permisos por rol
CREATE TABLE IF NOT EXISTS public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role user_role NOT NULL UNIQUE,
  permissions TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


/*
----------------------------------------
-- SECCIÓN 3: FUNCIONES Y TRIGGERS
----------------------------------------
*/

-- Función genérica para actualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a todas las tablas con columna updated_at
DO $$
BEGIN
  FOR tbl IN ARRAY[
    'payment_methods','discounts','subscription_plans',
    'user_subscriptions','organizations','organization_members',
    'profiles','courses','enrollments','organization_invitations',
    'certificates','user_activity_logs','invoices','invoice_items','payments'
  ] LOOP
    EXECUTE format('
      DROP TRIGGER IF EXISTS trg_%1$s_updated_at ON public.%1$s;
      CREATE TRIGGER trg_%1$s_updated_at
      BEFORE UPDATE ON public.%1$s
      FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
    ', tbl);
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Generar perfil al crear auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  username_base TEXT;
  username_suffix INT := 0;
  new_username TEXT;
  exists_user BOOLEAN;
  org_to_accept UUID;
BEGIN
  -- Nombre de usuario base
  username_base := lower(regexp_replace(split_part(NEW.email,'@',1),'[^a-z0-9_.]','','g'));
  new_username := username_base;

  LOOP
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE username=new_username)
      INTO exists_user;
    EXIT WHEN NOT exists_user;
    username_suffix := username_suffix + 1;
    new_username := username_base || username_suffix;
  END LOOP;

  INSERT INTO public.profiles (
    id, username, first_name, last_name, avatar_url, metadata
  ) VALUES (
    NEW.id,
    new_username,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'avatar_url',
    jsonb_build_object('provider', NEW.raw_app_meta_data->>'provider')
  );

  -- Aceptar invitaciones pendientes
  FOR org_to_accept IN
    SELECT organization_id
    FROM public.organization_invitations
    WHERE email=NEW.email AND accepted_at IS NULL AND expires_at>now()
  LOOP
    INSERT INTO public.organization_members (
      organization_id, user_id, role, is_primary
    ) VALUES (
      org_to_accept,
      NEW.id,
      (SELECT role FROM public.organization_invitations
         WHERE organization_id=org_to_accept AND email=NEW.email
         ORDER BY created_at DESC LIMIT 1),
      FALSE
    ) ON CONFLICT DO NOTHING;

    UPDATE public.organization_invitations
    SET accepted_at=now(), updated_at=now()
    WHERE organization_id=org_to_accept AND email=NEW.email;
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Generar código de verificación para certificados
CREATE OR REPLACE FUNCTION public.generate_verification_code()
RETURNS TRIGGER AS $$
BEGIN
  NEW.verification_code := 'CERT-' ||
    substr(md5(random()::text || clock_timestamp()::text),1,12);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_certificates_verify_code ON public.certificates;
CREATE TRIGGER trg_certificates_verify_code
  BEFORE INSERT ON public.certificates
  FOR EACH ROW EXECUTE FUNCTION public.generate_verification_code();

-- Generar número de factura secuencial
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TRIGGER AS $$
DECLARE
  seq_num INT;
  y TEXT := to_char(NEW.issue_date,'YYYY');
  m TEXT := to_char(NEW.issue_date,'MM');
  prefix TEXT := 'INV-' || y || m || '-';
BEGIN
  SELECT coalesce(max(substring(invoice_number,length(prefix)+1)::int),0) + 1
    INTO seq_num
    FROM public.invoices
    WHERE invoice_number LIKE prefix || '%';

  NEW.invoice_number := prefix || lpad(seq_num::text,5,'0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_invoices_number ON public.invoices;
CREATE TRIGGER trg_invoices_number
  BEFORE INSERT ON public.invoices
  FOR EACH ROW
  WHEN (NEW.invoice_number IS NULL)
  EXECUTE FUNCTION public.generate_invoice_number();

/*
----------------------------------------
-- SECCIÓN 4: SEGURIDAD A NIVEL DE FILA (RLS)
----------------------------------------
*/

-- Habilitar RLS
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Ejemplos de políticas (ajusta según necesidad):
CREATE POLICY IF NOT EXISTS pm_own_policy
  ON public.payment_methods FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS discounts_select_active
  ON public.discounts FOR SELECT
  USING (is_active AND (valid_until IS NULL OR valid_until > now()));

CREATE POLICY IF NOT EXISTS subs_plans_admin
  ON public.subscription_plans FOR ALL
  USING ((SELECT role FROM public.profiles WHERE id=auth.uid()) = 'super_admin');

CREATE POLICY IF NOT EXISTS orgs_member_select
  ON public.organizations FOR SELECT
  USING (id IN (
    SELECT organization_id FROM public.organization_members WHERE user_id=auth.uid()
  ));

CREATE POLICY IF NOT EXISTS profiles_select
  ON public.profiles FOR SELECT
  USING (
    id = auth.uid()
    OR (SELECT role FROM public.profiles WHERE id=auth.uid()) = 'super_admin'
  );

CREATE POLICY IF NOT EXISTS courses_select
  ON public.courses FOR SELECT
  USING (
    is_published
    OR organization_id IN (
      SELECT organization_id FROM public.organization_members WHERE user_id=auth.uid()
    )
    OR (SELECT role FROM public.profiles WHERE id=auth.uid()) = 'super_admin'
  );

-- Añade tus demás políticas aquí.

/*
----------------------------------------
-- SECCIÓN 5: ÍNDICES PARA RENDIMIENTO
----------------------------------------
*/
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_subscriptions_active_unique
  ON public.user_subscriptions(user_id)
  WHERE status IN ('active','trial');

CREATE INDEX IF NOT EXISTS idx_profiles_role
  ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_org
  ON public.profiles(current_organization_id);

CREATE INDEX IF NOT EXISTS idx_courses_org
  ON public.courses(organization_id);
CREATE INDEX IF NOT EXISTS idx_courses_published
  ON public.courses(is_published);

CREATE INDEX IF NOT EXISTS idx_enrollments_uc
  ON public.enrollments(user_id, course_id);

CREATE INDEX IF NOT EXISTS idx_certificates_uc
  ON public.certificates(user_id, course_id);

CREATE INDEX IF NOT EXISTS idx_invoices_org
  ON public.invoices(organization_id);

CREATE INDEX IF NOT EXISTS idx_payments_org
  ON public.payments(organization_id);

-- Índice parcial para un sólo miembro primario por organización
CREATE UNIQUE INDEX IF NOT EXISTS idx_org_members_one_primary
  ON public.organization_members (organization_id)
  WHERE is_primary = true;

/*
----------------------------------------
-- SECCIÓN 6: DATOS INICIALES (SEEDING)
----------------------------------------
*/
-- Planes por defecto
INSERT INTO public.subscription_plans (
  name, description, price_monthly, price_quarterly, price_yearly,
  currency, billing_cycles, trial_period_days, max_users, max_storage_mb, features
) VALUES
  ('Free', 'Plan gratuito con funcionalidad básica.', 0, NULL, 0,
    'USD', ARRAY['monthly'], 0, 1, 100,
    '{"max_courses":3,"support":"community","features":["Plantillas básicas","10 certificados/mes"]}'),
  ('Basic', 'Ideal para creadores independientes.', 9.99, 26.97, 99.99,
    'USD', ARRAY['monthly','yearly'], 7, 3, 1024,
    '{"max_courses":10,"analytics":true,"support":"email"}'),
  ('Premium', 'Para profesionales y PYMEs.', 29.99, 80.97, 299.99,
    'USD', ARRAY['monthly','quarterly','yearly'], 14, 10, 5120,
    '{"api_access":true,"support":"24/7"}'),
  ('Enterprise', 'Solución para grandes empresas.', 99.99, 269.97, 999.99,
    'USD', ARRAY['monthly','quarterly','yearly'], 30, NULL, 10240,
    '{"sso":true,"dedicated_support":true}')
ON CONFLICT (name) DO UPDATE
  SET description=EXCLUDED.description,
      price_monthly=EXCLUDED.price_monthly,
      price_quarterly=EXCLUDED.price_quarterly,
      price_yearly=EXCLUDED.price_yearly,
      billing_cycles=EXCLUDED.billing_cycles,
      trial_period_days=EXCLUDED.trial_period_days,
      max_users=EXCLUDED.max_users,
      max_storage_mb=EXCLUDED.max_storage_mb,
      features=EXCLUDED.features,
      updated_at=now();

-- Permisos por rol por defecto
INSERT INTO public.role_permissions (role, permissions)
VALUES
  ('super_admin', ARRAY['*:*']),
  ('admin',       ARRAY['users:read','users:update','courses:*','certificates:*']),
  ('instructor',  ARRAY['courses:create','courses:read:own','certificates:create:own']),
  ('student',     ARRAY['courses:read:enrolled','certificates:read:own']),
  ('guest',       ARRAY['courses:read:public'])
ON CONFLICT (role) DO UPDATE
  SET permissions=EXCLUDED.permissions,
      updated_at=now();
