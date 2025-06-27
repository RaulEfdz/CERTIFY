import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, Key, FileText, Code } from "lucide-react";
import Link from "next/link";

export default function ApiKeysPage() {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-3xl text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
                    <Key className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
                    No hay claves de API
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                    Las claves de API te permiten autenticarte con nuestra API y acceder a tus certificados y plantillas de forma programática.
                </p>
                
                <div className="mt-10">
                    <h2 className="text-lg font-medium text-foreground mb-4">¿Listo para crear tu primera clave de API?</h2>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                            <div>
                                <PlusCircle className="mr-2 h-5 w-5" /> Crear clave de API
                            </div>
                        </Button>
                        <Button asChild size="lg" variant="outline">
                            <Link href="#">
                                <Code className="mr-2 h-5 w-5" /> Ver documentación
                            </Link>
                        </Button>
                    </div>
                </div>
                
                <div className="mt-16 pt-8 border-t border-border">
                    <h3 className="text-sm font-medium text-muted-foreground mb-4">¿Neitas ayuda para comenzar?</h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="#">Guía de la API</Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="#">Soporte técnico</Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="#">Ver ejemplos de código</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
