// Tipos generados por Supabase
// Estos tipos se generan automáticamente basados en tu esquema de base de datos
// Puedes generarlos usando el CLI de Supabase: npx supabase gen types typescript --project-id your-project-id > src/types/supabase.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      // Ejemplo de definición de tabla - reemplaza con tus tablas reales
      profiles: {
        Row: {
          id: string
          updated_at?: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          website: string | null
        }
        Insert: {
          id: string
          updated_at?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
        }
        Update: {
          id?: string
          updated_at?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
        }
      }
      // Agrega más tablas según sea necesario
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      // Ejemplo de función - reemplaza con tus funciones reales
      version: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Tipo para el estado de conexión
export interface ConnectionStatus {
  connected: boolean;
  error?: string;
  timestamp: string;
  tables?: string[];
  version?: string;
}
