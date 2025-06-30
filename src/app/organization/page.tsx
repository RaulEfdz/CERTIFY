
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Organization, OrganizationMember, Profile } from "@/lib/db/types";

// Placeholder para los componentes que crearemos
const OrganizationDetailsForm = ({ organization }: { organization: Organization }) => (
  <div>{/* Formulario para editar nombre, logo, etc. */}</div>
);

const InviteMemberForm = ({ organizationId }: { organizationId: string }) => (
  <div>{/* Formulario para invitar nuevos miembros */}</div>
);

const MembersList = ({ members   }: { members: (OrganizationMember & { profiles: Profile | null })[] }) => (
  <div>{/* Tabla con la lista de miembros */}</div>
);

export default async function OrganizationPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  // 1. Obtener la organización actual del perfil del usuario
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("current_organization_id")
    .eq("id", user.id)
    .single();

  if (profileError || !profile || !profile.current_organization_id) {
    // TODO: Mejorar este manejo de error. Quizás redirigir a una página para crear/seleccionar organización.
    return <div>Error: No se pudo encontrar una organización activa.</div>;
  }

  const orgId = profile.current_organization_id;

  // 2. Obtener los detalles de la organización
  const { data: organization, error: orgError } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", orgId)
    .single();

  // 3. Obtener los miembros de la organización y sus perfiles
  const { data: members, error: membersError } = await supabase
    .from("organization_members")
    .select(`
      *,
      profiles (*)
    `)
    .eq("organization_id", orgId);

  if (orgError || membersError || !organization) {
    return <div>Error al cargar los datos de la organización.</div>;
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <h1 className="text-2xl font-bold">Gestionar Organización</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>{organization.name}</CardTitle>
          <CardDescription>Edita los detalles de tu organización.</CardDescription>
        </CardHeader>
        <CardContent>
          <OrganizationDetailsForm organization={organization} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Miembros del Equipo</CardTitle>
          <CardDescription>Invita y gestiona los miembros de tu organización.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <InviteMemberForm organizationId={organization.id} />
          <MembersList members={members || []} />
        </CardContent>
      </Card>
    </div>
  );
}
