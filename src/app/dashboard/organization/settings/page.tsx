import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { OrganizationForm } from "./organization-form";
import { PageHeader } from "@/components/organization/page-header";

export default async function OrganizationSettingsPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  
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
          <p className="mb-4">Crea una nueva organización o acepta una invitación para comenzar.</p>
          <OrganizationForm />
        </div>
      </div>
    );
  }
  
  // Obtener la información de la organización
  const { data: organization } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', profile.current_organization_id)
    .single();
    
  // Verificar si el usuario es propietario o administrador
  const { data: membership } = await supabase
    .from('organization_members')
    .select('role')
    .eq('user_id', user.id)
    .eq('organization_id', profile.current_organization_id)
    .single();
    
  const isAdmin = membership?.role === 'owner' || membership?.role === 'admin';

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Configuración del Espacio de Trabajo</h1>
        
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Información de la Organización</h2>
            <OrganizationForm organization={organization} isAdmin={isAdmin} />
          </div>
          
          {isAdmin && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-medium mb-4">Configuración Avanzada</h2>
              <div className="space-y-4">
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h3 className="font-medium">Zona de Peligro</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Esta acción no se puede deshacer. Esto eliminará permanentemente la organización y todos sus datos.
                  </p>
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                    Eliminar Organización
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
