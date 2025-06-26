import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const auditLogs = [
    { user: 'Admin', avatar: 'https://placehold.co/40x40.png', dataAiHint:'person avatar', action: 'Plantilla Actualizada', target: 'Empleado del Mes', date: 'hace 3 días' },
    { user: 'Admin', avatar: 'https://placehold.co/40x40.png', dataAiHint:'person avatar', action: 'Plantilla Creada', target: 'Fundamentos de Ciencia de Datos', date: 'hace 5 días' },
    { user: 'Diseñador', avatar: 'https://placehold.co/40x40.png', dataAiHint:'person avatar', action: 'Plantilla Clonada', target: 'Bootcamp de Desarrollo Web', date: 'hace 1 semana' },
    { user: 'Admin', avatar: 'https://placehold.co/40x40.png', dataAiHint:'person avatar', action: 'Plantilla Actualizada', target: 'Certificado de Finalización', date: 'hace 2 semanas' },
    { user: 'Admin', avatar: 'https://placehold.co/40x40.png', dataAiHint:'person avatar', action: 'Clave API Revocada', target: 'dev_sk_...', date: 'hace 1 mes' },
];

export default function AuditLogPage() {
    return (
        <div className="flex flex-col gap-6">
            <Card className="rounded-lg shadow-sm">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Usuario</TableHead>
                                <TableHead>Acción</TableHead>
                                <TableHead>Objetivo</TableHead>
                                <TableHead>Fecha</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {auditLogs.map((log, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={log.avatar} alt={log.user} data-ai-hint={log.dataAiHint} />
                                                <AvatarFallback>{log.user.substring(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{log.user}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{log.action}</Badge>
                                    </TableCell>
                                    <TableCell>{log.target}</TableCell>
                                    <TableCell>{log.date}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
