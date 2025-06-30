import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { InviteMemberForm } from "./form";

export default async function InviteMemberPage() {
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
          <p className="mb-4">Debes ser miembro de una organización para invitar a otros usuarios.</p>
        </div>
      </div>
    );
  }
  
  // Verificar que el usuario tenga permisos para invitar miembros
  const { data: membership } = await supabase
    .from('organization_members')
    .select('role')
    .eq('user_id', user.id)
    .eq('organization_id', profile.current_organization_id)
    .single();
    
  const canInvite = membership?.role === 'owner' || membership?.role === 'admin';
  
  if (!canInvite) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-4">Acceso denegado</h1>
          <p>No tienes permisos para invitar miembros a esta organización.</p>
        </div>
      </div>
    );
  }
  
  // Obtener la información de la organización
  const { data: organization } = await supabase
    .from('organizations')
    .select('name')
    .eq('id', profile.current_organization_id)
    .single();
  
  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Invitar a {organization?.name || 'la organización'}</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <InviteMemberForm 
            organizationId={profile.current_organization_id} 
            organizationName={organization?.name || 'la organización'}
          />
        </div>
      </div>
    </div>
  );
}
