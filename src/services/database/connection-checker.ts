import { createClient } from '@/lib/supabase/client'
import { Database, ConnectionStatus } from '@/types/supabase'



export class DatabaseConnectionChecker {
  private static instance: DatabaseConnectionChecker
  private supabase = createClient()
  private lastCheck: Date | null = null
  private status: ConnectionStatus = {
    connected: false,
    timestamp: new Date().toISOString(),
  }

  private constructor() {}

  public static getInstance(): DatabaseConnectionChecker {
    if (!DatabaseConnectionChecker.instance) {
      DatabaseConnectionChecker.instance = new DatabaseConnectionChecker()
    }
    return DatabaseConnectionChecker.instance
  }

  public async checkConnection(): Promise<ConnectionStatus> {
    try {
      this.lastCheck = new Date()
      
      // Verificar conexión básica
      const { data, error } = await this.supabase.rpc('version')
      
      if (error) throw error

      // Obtener lista de tablas
      const { data: tablesData, error: tablesError } = await this.supabase
        .from('pg_tables')
        .select('tablename')
        .eq('schemaname', 'public')

      if (tablesError) throw tablesError

      this.status = {
        connected: true,
        timestamp: this.lastCheck.toISOString(),
        version: data,
        tables: tablesData.map(item => item.tablename).filter(Boolean) as string[],
      }

      return this.status
    } catch (error: any) {
      this.status = {
        connected: false,
        error: error.message || 'Error desconocido al conectar con la base de datos',
        timestamp: new Date().toISOString(),
      }
      return this.status
    }
  }

  public getStatus(): ConnectionStatus {
    return this.status
  }

  public async isConnected(): Promise<boolean> {
    if (!this.lastCheck || (Date.now() - this.lastCheck.getTime() > 5 * 60 * 1000)) {
      await this.checkConnection()
    }
    return this.status.connected
  }

  public async getTables(): Promise<string[] | undefined> {
    if (!this.lastCheck || !this.status.tables) {
      await this.checkConnection()
    }
    return this.status.tables
  }
}

export const dbConnectionChecker = DatabaseConnectionChecker.getInstance()
