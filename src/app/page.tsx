import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Download, FileText, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-lg shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Plantillas Totales</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">+5 desde el mes pasado</p>
          </CardContent>
        </Card>
        <Card className="rounded-lg shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Certificados Emitidos</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,345</div>
            <p className="text-xs text-muted-foreground">+1,200 este mes</p>
          </CardContent>
        </Card>
        <Card className="rounded-lg shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Uso de API</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">La cuota se reinicia en 12 días</p>
          </CardContent>
        </Card>
        <Card className="rounded-lg shadow-sm bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg font-headline">Crear Nuevo Certificado</CardTitle>
            <CardDescription>Empieza desde una plantilla o créala desde cero.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/templates/new">
                <PlusCircle className="mr-2 h-4 w-4" /> Nueva Plantilla
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-lg shadow-sm">
        <CardHeader>
          <CardTitle className="font-headline">Actividad Reciente</CardTitle>
          <CardDescription>Un resumen de los últimos certificados generados.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Destinatario</TableHead>
                <TableHead>Plantilla</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>John Doe</TableCell>
                <TableCell>Certificado de Finalización</TableCell>
                <TableCell><Badge variant="outline" className="text-green-600 border-green-600">Emitido</Badge></TableCell>
                <TableCell>2024-07-20</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Jane Smith</TableCell>
                <TableCell>Bootcamp de Desarrollo Web</TableCell>
                <TableCell><Badge variant="outline" className="text-green-600 border-green-600">Emitido</Badge></TableCell>
                <TableCell>2024-07-19</TableCell>
              </TableRow>
               <TableRow>
                <TableCell>Sam Wilson</TableCell>
                <TableCell>Fundamentos de Ciencia de Datos</TableCell>
                <TableCell><Badge variant="outline" className="text-yellow-600 border-yellow-600">Pendiente</Badge></TableCell>
                <TableCell>2024-07-21</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
