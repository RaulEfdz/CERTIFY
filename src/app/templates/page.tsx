import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tag, Search, PlusCircle, MoreVertical, Filter, Copy, Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const templates = [
  { id: 1, name: 'Certificado de Finalización', description: 'Un diseño clásico para la finalización de cursos.', tags: ['Curso', 'Oficial'], lastUpdated: 'hace 2 semanas', imageUrl: 'https://placehold.co/600x400', dataAiHint: 'certificate completion' },
  { id: 2, name: 'Bootcamp de Desarrollo Web', description: 'Diseño moderno para bootcamps tecnológicos.', tags: ['Tecnología', 'Bootcamp'], lastUpdated: 'hace 1 mes', imageUrl: 'https://placehold.co/600x400', dataAiHint: 'web development' },
  { id: 3, name: 'Empleado del Mes', description: 'Reconoce a los empleados destacados.', tags: ['Corporativo', 'Reconocimiento'], lastUpdated: 'hace 3 días', imageUrl: 'https://placehold.co/600x400', dataAiHint: 'employee award' },
  { id: 4, name: 'Fundamentos de Ciencia de Datos', description: 'Para cursos de ciencia de datos y analítica.', tags: ['Datos', 'Ciencia'], lastUpdated: 'hace 5 días', imageUrl: 'https://placehold.co/600x400', dataAiHint: 'data science' },
  { id: 5, name: 'Participación en Taller', description: 'Un certificado simple para los asistentes al taller.', tags: ['Taller', 'Simple'], lastUpdated: 'hace 1 semana', imageUrl: 'https://placehold.co/600x400', dataAiHint: 'workshop certificate' },
  { id: 6, name: 'Capacitación en Liderazgo', description: 'Certificado formal para programas de liderazgo.', tags: ['Liderazgo', 'Capacitación'], lastUpdated: 'hace 2 meses', imageUrl: 'https://placehold.co/600x400', dataAiHint: 'leadership training' },
];

export default function TemplatesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-auto flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Buscar plantillas..." className="pl-10 w-full md:w-80 rounded-md" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2"><Filter className="h-4 w-4" /> Filtrar</Button>
          <Button variant="outline" className="gap-2"><Tag className="h-4 w-4" /> Etiquetas</Button>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/templates/new"><PlusCircle className="mr-2 h-4 w-4" /> Crear Plantilla</Link>
          </Button>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map(template => (
          <Card key={template.id} className="rounded-lg shadow-sm overflow-hidden group">
            <CardHeader className="p-0 relative">
              <Image src={`${template.imageUrl}.png`} alt={template.name} width={600} height={400} className="w-full h-48 object-cover" data-ai-hint={template.dataAiHint} />
              <div className="absolute top-4 right-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full bg-background/70 backdrop-blur-sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Editar</DropdownMenuItem>
                    <DropdownMenuItem><Copy className="mr-2 h-4 w-4" /> Clonar</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive focus:text-destructive-foreground"><Trash2 className="mr-2 h-4 w-4" /> Eliminar</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="font-headline text-lg">{template.name}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
              <div className="flex gap-2 mt-2">
                {template.tags.map(tag => (
                  <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{tag}</span>
                ))}
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">
              Última actualización {template.lastUpdated}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
