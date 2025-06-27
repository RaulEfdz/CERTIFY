// ============== ENUMS ==============
// Estos tipos deben coincidir con los ENUMs definidos en tu SQL

export type UserRole = "super_admin" | "admin" | "instructor" | "student" | "institution" | "guest";
export type OrganizationRole = "owner" | "admin" | "member" | "guest";
export type SubscriptionPlan = "free" | "basic" | "premium" | "enterprise";
export type SubscriptionStatus = "active" | "trial" | "past_due" | "canceled" | "unpaid" | "incomplete" | "incomplete_expired" | "paused";
export type CertificateStatus = "draft" | "pending" | "issued" | "revoked";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded" | "disputed" | "partially_refunded";
export type PaymentMethodType = "card" | "bank_transfer" | "paypal" | "crypto" | "other";
export type BillingCycle = "monthly" | "quarterly" | "yearly" | "one_time";


// ============== TABLES ==============
// Interfaces basadas en las tablas de tu base de datos

export interface Organization {
  id: string; // UUID
  name: string;
  slug: string;
  logo_url?: string | null;
  website?: string | null;
  is_active: boolean;
  metadata?: Record<string, any> | null; // JSONB
  created_at: string; // TIMESTAMP WITH TIME ZONE
  updated_at: string; // TIMESTAMP WITH TIME ZONE
}

export interface OrganizationMember {
  id: string; // UUID
  organization_id: string; // UUID
  user_id: string; // UUID
  role: OrganizationRole;
  is_primary: boolean;
  created_at: string; // TIMESTAMP WITH TIME ZONE
  updated_at: string; // TIMESTAMP WITH TIME ZONE
}

export interface OrganizationInvitation {
  id: string; // UUID
  organization_id: string; // UUID
  email: string;
  role: OrganizationRole;
  token: string;
  expires_at: string; // TIMESTAMP WITH TIME ZONE
  accepted_at?: string | null; // TIMESTAMP WITH TIME ZONE
  created_by?: string | null; // UUID
  created_at: string; // TIMESTAMP WITH TIME ZONE
  updated_at: string; // TIMESTAMP WITH TIME ZONE
}

export interface Profile {
  id: string; // UUID
  username: string;
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string | null; // Generated column
  avatar_url?: string | null;
  bio?: string | null;
  website?: string | null;
  phone?: string | null;
  current_organization_id?: string | null; // UUID
  job_title?: string | null;
  country?: string | null;
  timezone: string;
  role: UserRole;
  active_subscription_id?: string | null; // UUID
  is_active: boolean;
  metadata?: Record<string, any> | null; // JSONB
  created_at: string; // TIMESTAMP WITH TIME ZONE
  updated_at: string; // TIMESTAMP WITH TIME ZONE
}

// Puedes añadir aquí el resto de interfaces para tus tablas
// (Courses, Enrollments, Certificates, etc.) si las necesitas.