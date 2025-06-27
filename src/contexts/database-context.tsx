'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { dbConnectionChecker } from '@/services/database/connection-checker'
import { ConnectionStatus } from '@/types/supabase'

interface DatabaseContextType {
  status: ConnectionStatus
  checkConnection: () => Promise<boolean>
  isConnected: () => Promise<boolean>
  getTables: () => Promise<string[] | undefined>
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined)

export function DatabaseProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = React.useState<ConnectionStatus>({
    connected: false,
    timestamp: new Date().toISOString(),
  })

  const checkConnection = async () => {
    try {
      const result = await dbConnectionChecker.checkConnection()
      setStatus(result)
      return result.connected
    } catch (error) {
      console.error('Error checking database connection:', error)
      setStatus({
        connected: false,
        error: 'Error al verificar la conexión',
        timestamp: new Date().toISOString(),
      })
      return false
    }
  }

  const isConnected = async () => {
    return dbConnectionChecker.isConnected()
  }

  const getTables = async () => {
    return dbConnectionChecker.getTables()
  }

  // Verificar la conexión al montar el proveedor
  React.useEffect(() => {
    checkConnection()
  }, [])

  return (
    <DatabaseContext.Provider value={{ status, checkConnection, isConnected, getTables }}>
      {children}
    </DatabaseContext.Provider>
  )
}

export function useDatabase() {
  const context = useContext(DatabaseContext)
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider')
  }
  return context
}
