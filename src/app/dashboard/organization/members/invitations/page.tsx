import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { InvitationsList } from "./list";

export default async function OrganizationInvitationsPage() {
  const supabase = await createClient();
  
  // Verificar que el usuario esté autenticado
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    redirect('/login');
  }
  
  // Obtener la organización actual del usuario
  const { data: profile } = await supabase
    .from('profiles')
    .select('current_organization_id')
    .eq('id', user.id)
    .single();
    
  if (!profile?.current_organization_id) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-4">No perteneces a ninguna organización</h1>
        </div>
      </div>
    );
  }
  
  // Verificar que el usuario tenga permisos para ver invitaciones
  const { data: membership } = await supabase
    .from('organization_members')
    .select('role')
    .eq('user_id', user.id)
    .eq('organization_id', profile.current_organization_id)
    .single();
    
  const canViewInvitations = membership?.role === 'owner' || membership?.role === 'admin';
  
  if (!canViewInvitations) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-4">Acceso denegado</h1>
          <p>No tienes permisos para ver las invitaciones de esta organización.</p>
        </div>
      </div>
    );
  }
  
  // Obtener las invitaciones pendientes
  const { data: invitations } = await supabase
    .from('organization_invitations')
    .select(`
      id,
      email,
      role,
      created_at,
      expires_at,
      invited_by:profiles(
        id,
        email,
        first_name,
        last_name
      )
    `)
    .eq('organization_id', profile.current_organization_id)
    .is('accepted_at', null)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false });
  
  // Obtener la información de la organización
  const { data: organization } = await supabase
    .from('organizations')
    .select('name')
    .eq('id', profile.current_organization_id)
    .single();
  
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Invitaciones pendientes - {organization?.name}</h1>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <InvitationsList 
            invitations={(invitations || []).map(inv => ({
              ...inv,
              invited_by: Array.isArray(inv.invited_by) ? inv.invited_by[0] : inv.invited_by,
            }))} 
            organizationId={profile.current_organization_id}
          />
        </div>
      </div>
    </div>
  );
}
