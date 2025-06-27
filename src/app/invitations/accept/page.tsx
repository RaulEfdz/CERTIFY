
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AcceptInvitationClient } from "./client";

export default async function AcceptInvitationPage({ 
  searchParams 
}: { 
  searchParams: { token?: string }
}) {
  const { token } = searchParams;

  if (!token) {
    return <div>Token de invitación no válido o no proporcionado.</div>;
  }

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // 1. Validar el token en el servidor
  const { data: invitation, error } = await supabase
    .from("organization_invitations")
    .select("*, organizations (*)")
    .eq("token", token)
    .single();

  if (error || !invitation) {
    return <div>Esta invitación no es válida o ha expirado.</div>;
  }

  if (new Date(invitation.expires_at) < new Date()) {
    return <div>Esta invitación ha expirado.</div>;
  }

  if (invitation.accepted_at) {
    return <div>Esta invitación ya ha sido aceptada.</div>;
  }

  // 2. Verificar si el usuario está logueado
  const { data: { user } } = await supabase.auth.getUser();

  // Pasamos los datos al componente de cliente para que maneje la acción
  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen">
      <AcceptInvitationClient 
        user={user}
        invitation={invitation}
        organizationName={invitation.organizations?.name || "una organización"}
      />
    </div>
  );
}
