import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Clock, FileText, RefreshCw } from "lucide-react";

export default function AuditLogPage() {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-3xl text-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center mb-6">
                    <img src="/logo.png" alt="Certify Logo" className="h-full w-full object-contain" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
                    No hay registros de auditoría
                </h1>
                <p className="text-lg text-white mb-8">
                    El registro de auditoría mostrará un historial completo de todas las acciones realizadas en tu cuenta.
                </p>
                
                <div className="mt-10">
                    <h2 className="text-lg font-medium text-white mb-4">¿Qué puedes esperar ver aquí?</h2>
                    <div className="grid gap-6 md:grid-cols-3 mt-8">
                        <div className="flex flex-col items-center text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                                <FileText className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-medium text-white">Acciones de plantillas</h3>
                            <p className="text-sm mt-1 text-gray-400">Creaciones, actualizaciones y eliminaciones</p>
                        </div>  
                        <div className="flex flex-col items-center text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                                <RefreshCw className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-medium text-white">Actividad de la API</h3>
                            <p className="text-sm mt-1 text-gray-400">Uso y gestión de claves de API</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                                <Clock className="text-sm mt-1 text-gray-400" />
                            </div>
                            <h3 className="font-medium text-white">Registro temporal</h3>
                            <p className="text-sm mt-1 text-gray-400">Historial de acciones realizadas</p>
                        </div>
                    </div>
                </div>
                
               
            </div>
        </div>
    );
}
