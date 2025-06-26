import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
    return (
        <div className="flex flex-col gap-6">
            <Card className="rounded-lg shadow-sm">
                <CardHeader>
                    <CardTitle className="font-headline">Espacio de Trabajo</CardTitle>
                    <CardDescription>La configuración del espacio de trabajo estará disponible aquí.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Próximamente...</p>
                </CardContent>
            </Card>
            <Card className="rounded-lg shadow-sm">
                <CardHeader>
                    <CardTitle className="font-headline">Usuarios y Roles</CardTitle>
                    <CardDescription>La gestión de usuarios y roles estará disponible aquí.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Próximamente...</p>
                </CardContent>
            </Card>
        </div>
    );
}
