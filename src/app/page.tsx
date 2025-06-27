import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Download, FileText, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
          <FileText className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
          Bienvenido a Certify
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Tu plataforma para crear y gestionar certificados digitales de manera sencilla y profesional.
        </p>
        
        <div className="mt-10">
          <h2 className="text-lg font-medium text-foreground mb-4">¿Listo para comenzar?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link href="/templates/new">
                <PlusCircle className="mr-2 h-5 w-5" /> Crear tu primera plantilla
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/templates">
                <FileText className="mr-2 h-5 w-5" /> Ver documentación
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">¿Neitas ayuda para comenzar?</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="#">Documentación</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="#">Soporte</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="#">Ejemplos</Link>
            </Button>
          </div>
        </div>
      </div>

      <Card className="rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle className="font-headline">Actividad Reciente</CardTitle>
          <CardDescription>Un resumen de los últimos certificados generados.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-12">
            <h2 className="text-lg font-medium text-foreground mb-4">No hay actividad reciente</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Comienza a crear y gestionar certificados digitales para ver tu actividad reciente aquí.
            </p>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link href="/templates/new">
                <PlusCircle className="mr-2 h-5 w-5" /> Crear tu primera plantilla
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
