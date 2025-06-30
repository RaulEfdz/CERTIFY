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
        <div className="mx-auto flex h-24 w-24 items-center justify-center mb-6">
          <img src="/logo.png" alt="Certify Logo" className="h-full w-full object-contain" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-4">
          Bienvenido a Certify
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Tu plataforma para crear y gestionar certificados digitales de manera sencilla y profesional.
        </p>
        
        <div className="mt-10">
          <h2 className="text-lg font-medium text-white mb-4">¿Listo para comenzar?</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link href="/templates/new">
                <PlusCircle className="mr-2 h-5 w-5" /> Crear tu primera plantilla
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-foreground border-border hover:bg-muted/10 hover:text-foreground">
              <Link href="/templates">
                <FileText className="mr-2 h-5 w-5" /> Ver documentación
              </Link>
            </Button>
          </div>
        </div>
        
      
      </div>


    </div>
  );
}
