import { supabase } from '@/lib/supabase/client';
import { Database } from './config';

type TableName = Extract<keyof Database['public']['Tables'], string>;
type TableRow<T extends TableName> = Database['public']['Tables'][T]['Row'];
type TableInsert<T extends TableName> = Database['public']['Tables'][T]['Insert'];
type TableUpdate<T extends TableName> = Database['public']['Tables'][T]['Update']; // Ya definidos correctamente según los tipos de Supabase

export class DatabaseService {
  // Obtener todos los registros de una tabla
  static async findAll<T extends TableName>(
    table: T,
    columns = '*'
  ): Promise<TableRow<T>[]> {
    const { data, error } = await supabase
      .from(table)
      .select(columns);

    if (error) throw error;
    if (!Array.isArray(data)) {
      throw new Error('Supabase returned an unexpected response (not an array).');
    }
    return data as unknown as TableRow<T>[];
  }

  // Obtener un registro por ID
  static async findById<T extends TableName>(
    table: T,
    id: string,
    columns = '*'
  ): Promise<TableRow<T> | null> {
    const { data, error } = await supabase
      .from(table)
      .select(columns)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (data === null) return null;
    if (typeof data !== 'object' || Array.isArray(data)) {
      throw new Error('Supabase returned an unexpected response (not an object).');
    }
    return data as TableRow<T>;
  }

  // Crear un nuevo registro
  static async create<T extends TableName>(
    table: T,
    data: Omit<TableInsert<T>, 'id' | 'created_at' | 'updated_at'>
  ): Promise<TableRow<T>> {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data as any)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  // Actualizar un registro existente
  static async update<T extends TableName>(
    table: T,
    id: string,
    data: Partial<TableUpdate<T>>
  ): Promise<TableRow<T>> {
    const { data: result, error } = await supabase
      .from(table)
      .update(data as any)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  // Eliminar un registro
  static async delete<T extends TableName>(
    table: T,
    id: string
  ): Promise<void> {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Ejecutar consultas personalizadas
  static async query<T = any>(
    query: string,
    params?: any[]
  ): Promise<T[]> {
    const { data, error } = await supabase.rpc('query', {
      query,
      params: params || [],
    });

    if (error) throw error;
    return data;
  }
}
