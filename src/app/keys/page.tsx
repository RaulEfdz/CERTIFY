import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, MoreVertical, Copy, RotateCw, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const apiKeys = [
    { id: 'prod_sk_...', name: 'Clave de Producción', created: 'hace 2 meses', lastUsed: 'hace 3 horas', status: 'Activa' },
    { id: 'staging_sk_...', name: 'Clave de Staging', created: 'hace 2 meses', lastUsed: 'hace 1 día', status: 'Activa' },
    { id: 'dev_sk_...', name: 'Clave de Desarrollo', created: 'hace 1 semana', lastUsed: 'hace 5 días', status: 'Revocada' },
];

export default function ApiKeysPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    {/* El título y la descripción estarán en el componente Header */}
                </div>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90"><PlusCircle className="mr-2 h-4 w-4" /> Crear Clave</Button>
            </div>
            <Card className="rounded-lg shadow-sm">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Clave (prefijo)</TableHead>
                                <TableHead>Creado</TableHead>
                                <TableHead>Último Uso</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead><span className="sr-only">Acciones</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {apiKeys.map(key => (
                                <TableRow key={key.id}>
                                    <TableCell className="font-medium">{key.name}</TableCell>
                                    <TableCell className="font-code">{key.id}</TableCell>
                                    <TableCell>{key.created}</TableCell>
                                    <TableCell>{key.lastUsed}</TableCell>
                                    <TableCell>
                                        <Badge variant={key.status === 'Activa' ? 'default' : 'destructive'}>
                                            {key.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem><Copy className="mr-2 h-4 w-4" /> Copiar Clave</DropdownMenuItem>
                                                <DropdownMenuItem><RotateCw className="mr-2 h-4 w-4" /> Rotar Clave</DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive focus:text-destructive-foreground"><Trash2 className="mr-2 h-4 w-4" /> Revocar Clave</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
