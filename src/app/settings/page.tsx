import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrganizationSection } from "./organization-section";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Configuración</h2>
        <p className="text-muted-foreground">
          Gestiona la configuración de tu cuenta y organización
        </p>
      </div>

      <Card className="overflow-hidden border border-gray-200 shadow-sm">
        <CardHeader className="border-b bg-muted">
          <CardTitle className="text-foreground">Organización</CardTitle>
        </CardHeader>
        <CardContent className="p-6 bg-background">
          <OrganizationSection />
        </CardContent>
      </Card>
    </div>
  );
}
