import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, PlusCircle, FileText } from "lucide-react";
import Link from "next/link";

export default function TemplatesPage() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center mb-6">
          <img src="/logo.png" alt="Certify Logo" className="h-full w-full object-contain" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
          No hay plantillas aún
        </h1>
        <p className="text-lg text-white mb-8">
          Crea tu primera plantilla de certificado personalizado para empezar a emitir certificados digitales.
        </p>
        
        <div className="mt-10">
          <h2 className="text-lg font-medium text-white mb-4">¿Listo para crear tu primera plantilla?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link href="/templates/new">
                <PlusCircle className="mr-2 h-5 w-5" /> Crear plantilla
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="bg-white/10 hover:bg-white/20 border-white/20 text-white hover:text-white">
              <Link href="#">
                <FileText className="mr-2 h-5 w-5" /> Ver ejemplos
              </Link>
            </Button>
          </div>
        </div>
        

      </div>
    </div>
  );
}
