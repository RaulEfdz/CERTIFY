import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

type LogoData = {
  publicId: string;
  url: string;
  version: string;
  format: string;
} | null;

type CreateOrganizationData = {
  name: string;
  website?: string | null;
  logo?: LogoData;
};

export async function POST(request: Request) {
  try {
    const { name, website, logo }: CreateOrganizationData = await request.json();
    
    if (!name) {
      return NextResponse.json(
        { error: "El nombre de la organización es requerido" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verificar la sesión del usuario
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "No autorizado. Debes iniciar sesión primero." },
        { status: 401 }
      );
    }

    // Usar la función create_organization para manejar la creación de la organización
    const { data: organization, error: orgError } = await supabase
      .rpc('create_organization', {
        p_name: name,
        p_website: website || null,
        p_logo_public_id: logo?.publicId || null,
        p_logo_url: logo?.url || null,
        p_logo_version: logo?.version || null,
        p_logo_format: logo?.format || null,
      })
      .select()
      .single();

    if (orgError) {
      console.error("Error creating organization:", orgError);
      throw new Error(orgError.message || "Error al crear la organización");
    }

    // El trigger ya se encarga de hacer al usuario miembro propietario
    // Solo necesitamos verificar que todo salió bien
    const { data: memberCheck, error: memberError } = await supabase
      .from('organization_members')
      .select('id')
      .eq('organization_id', organization.id)
      .eq('user_id', user.id)
      .single();

    if (memberError || !memberCheck) {
      console.error("Error verifying organization membership:", memberError);
      // No revertimos la creación de la organización, pero registramos el error
      console.warn("Organization was created but user was not added as owner");
      
      // Intentar eliminar la organización si no se pudo agregar el miembro
      await supabase
        .from('organizations')
        .delete()
        .eq('id', organization.id);
      
      throw new Error("Error al configurar la organización");
    }

    // Actualizar el perfil del usuario para establecer la organización actual
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ current_organization_id: organization.id })
      .eq('id', user.id);

    if (profileError) {
      console.error("Error updating user profile:", profileError);
      // No revertimos la creación de la organización si falla esto
    }

    return NextResponse.json({
      success: true,
      organization,
      message: "Organización creada exitosamente",
    });
  } catch (error) {
    console.error("Error in create organization:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error al crear la organización" },
      { status: 500 }
    );
  }
}
