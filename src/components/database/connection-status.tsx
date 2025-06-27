import { Database, Loader2, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useDatabaseConnection } from '@/hooks/use-db-connection'
import { cn } from '@/lib/utils'

export function DatabaseConnectionStatus() {
  const { connected, loading, error, timestamp, checkConnection, tables } = useDatabaseConnection()
  
  const lastChecked = timestamp ? new Date(timestamp).toLocaleTimeString() : 'Nunca'
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                'relative',
                connected ? 'bg-green-100 hover:bg-green-200' : 'bg-red-100 hover:bg-red-200',
                'transition-colors duration-200'
              )}
              onClick={checkConnection}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : connected ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              <span className="sr-only">Estado de la base de datos</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="w-80 p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Database className="h-4 w-4" />
                  <span className="font-medium">Estado de la base de datos</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6" 
                  onClick={(e) => {
                    e.stopPropagation()
                    checkConnection()
                  }}
                  disabled={loading}
                >
                  <RefreshCw className={cn('h-3 w-3', loading && 'animate-spin')} />
                </Button>
              </div>
              
              <div className="pt-2 space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estado:</span>
                  <span className={cn('font-medium', connected ? 'text-green-600' : 'text-red-600')}>
                    {connected ? 'Conectado' : 'Desconectado'}
                  </span>
                </div>
                
                {error && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Error:</span>
                    <span className="text-red-600 text-right">{error}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Última verificación:</span>
                  <span>{lastChecked}</span>
                </div>
                
                {tables && tables.length > 0 && (
                  <div className="pt-2">
                    <div className="text-muted-foreground text-sm mb-1">Tablas disponibles:</div>
                    <div className="max-h-32 overflow-y-auto text-sm bg-muted/50 p-2 rounded">
                      {tables.map((table) => (
                        <div key={table} className="truncate">• {table}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
