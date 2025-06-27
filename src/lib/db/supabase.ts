import { createClient } from '@supabase/supabase-js';
import { Database } from './types/database.types';

// Tipos de la base de datos
type Tables = Database['public']['Tables'];
type TableName = keyof Tables;

export type DbResult<T> = T extends PromiseLike<infer U> ? U : never;

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// Helper para tipar las consultas
export const from = <T extends TableName>(table: T) => {
  return supabase.from<T, Tables[T]['Row']>(table);
};

// Tipos de operaciones
export type SelectOptions = {
  columns?: string;
  filter?: Record<string, unknown>;
  orderBy?: { column: string; ascending: boolean };
  limit?: number;
  range?: { from: number; to: number };
};

// Funciones de utilidad para consultas comunes
export const db = {
  // Obtener un registro por ID
  async findById<T extends TableName>(
    table: T,
    id: string
  ): Promise<Tables[T]['Row'] | null> {
    const { data, error } = await from(table).select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  },

  // Obtener todos los registros
  async findAll<T extends TableName>(
    table: T,
    options?: SelectOptions
  ): Promise<Tables[T]['Row'][]> {
    let query = from(table).select(options?.columns || '*');

    if (options?.filter) {
      Object.entries(options.filter).forEach(([key, value]) => {
        if (value !== undefined) {
          query = query.eq(key, value);
        }
      });
    }

    if (options?.orderBy) {
      query = query.order(options.orderBy.column, {
        ascending: options.orderBy.ascending,
      });
    }

    if (options?.range) {
      query = query.range(options.range.from, options.range.to);
    } else if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  // Crear un nuevo registro
  async create<T extends TableName>(
    table: T,
    data: Omit<Tables[T]['Insert'], 'id' | 'created_at' | 'updated_at'>
  ): Promise<Tables[T]['Row']> {
    const { data: result, error } = await from(table)
      .insert(data as any)
      .select()
      .single();
    if (error) throw error;
    return result;
  },

  // Actualizar un registro
  async update<T extends TableName>(
    table: T,
    id: string,
    data: Partial<Tables[T]['Update']>
  ): Promise<Tables[T]['Row']> {
    const { data: result, error } = await from(table)
      .update(data as any)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return result;
  },

  // Eliminar un registro
  async delete<T extends TableName>(table: T, id: string): Promise<void> {
    const { error } = await from(table).delete().eq('id', id);
    if (error) throw error;
  },
};

// Tipos útiles para las respuestas
export type DbResultOk<T> = { data: T; error: null };
export type DbResultErr = { data: null; error: Error };
export type DbResult<T> = DbResultOk<T> | DbResultErr;
