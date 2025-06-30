// Tipos mínimos para Supabase generados por CLI o a mano. Modifica según tus tablas reales.
export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          website: string | null;
          logo_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["organizations"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["organizations"]["Row"]>;
      };
      organization_members: {
        Row: {
          id: string;
          user_id: string;
          organization_id: string;
          role: string;
        };
        Insert: Partial<Database["public"]["Tables"]["organization_members"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["organization_members"]["Row"]>;
      };
      profiles: {
        Row: {
          id: string;
          current_organization_id: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
      };
    };
  };
}
