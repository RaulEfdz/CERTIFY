import { useEffect, useState } from 'react'
import { dbConnectionChecker } from '@/services/database/connection-checker'
import { ConnectionStatus } from '@/types/supabase'

export function useDatabaseConnection() {
  const [status, setStatus] = useState<ConnectionStatus>({
    connected: false,
    timestamp: new Date().toISOString(),
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const checkConnection = async () => {
    try {
      setLoading(true)
      setError(null)
      const connectionStatus = await dbConnectionChecker.checkConnection()
      setStatus(connectionStatus)
      return connectionStatus.connected
    } catch (err: any) {
      setError(err.message || 'Error al verificar la conexión a la base de datos')
      return false
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkConnection()

    // Opcional: Verificar periódicamente la conexión
    const interval = setInterval(checkConnection, 5 * 60 * 1000) // Cada 5 minutos
    
    return () => clearInterval(interval)
  }, [])

  return {
    ...status,
    loading,
    error,
    checkConnection,
  }
}
