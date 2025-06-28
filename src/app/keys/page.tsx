import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, Key, FileText, Code } from "lucide-react";
import Link from "next/link";

export default function ApiKeysPage() {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-3xl text-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center mb-6">
                    <img src="/logo.png" alt="Certify Logo" className="h-full w-full object-contain" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
                    No hay claves de API
                </h1>
                <p className="text-lg text-white mb-8">
                    Las claves de API te permiten autenticarte con nuestra API y acceder a tus certificados y plantillas de forma programática.
                </p>
                
                <div className="mt-10">
                    <h2 className="text-lg font-medium text-white mb-4">¿Listo para crear tu primera clave de API?</h2>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                            <div>
                                <PlusCircle className="mr-2 h-5 w-5" /> Crear clave de API
                            </div>
                        </Button>
                        <Button asChild size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10 hover:text-white">
                            <Link href="#">
                                <Code className="mr-2 h-5 w-5" /> Ver documentación
                            </Link>
                        </Button>
                    </div>
                </div>
                
            </div>
        </div>
    );
}
