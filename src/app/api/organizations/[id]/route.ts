import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { name, description, website, logo_url } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { error: "ID de organización no proporcionado" },
        { status: 400 }
      );
    }

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    // Verificar la sesión del usuario
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "No autorizado. Debes iniciar sesión primero." },
        { status: 401 }
      );
    }

    // Verificar que el usuario es administrador de la organización
    const { data: membership, error: membershipError } = await supabase
      .from('organization_members')
      .select('role')
      .eq('user_id', user.id)
      .eq('organization_id', id)
      .single();

    if (membershipError || !membership) {
      return NextResponse.json(
        { error: "No tienes permisos para editar esta organización" },
        { status: 403 }
      );
    }

    // Solo los propietarios y administradores pueden editar la organización
    if (membership.role !== 'owner' && membership.role !== 'admin') {
      return NextResponse.json(
        { error: "No tienes permisos suficientes para editar esta organización" },
        { status: 403 }
      );
    }

    // Actualizar la organización
    const { data: organization, error: updateError } = await supabase
      .from('organizations')
      .update({
        name,
        description: description || null,
        website: website || null,
        logo_url: logo_url || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating organization:", updateError);
      throw new Error("Error al actualizar la organización");
    }

    return NextResponse.json({
      success: true,
      organization,
      message: "Organización actualizada exitosamente",
    });

  } catch (error) {
    console.error("Error in update organization:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: "ID de organización no proporcionado" },
        { status: 400 }
      );
    }

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    // Verificar la sesión del usuario
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "No autorizado. Debes iniciar sesión primero." },
        { status: 401 }
      );
    }

    // Verificar que el usuario es propietario de la organización
    const { data: membership, error: membershipError } = await supabase
      .from('organization_members')
      .select('role')
      .eq('user_id', user.id)
      .eq('organization_id', id)
      .single();

    if (membershipError || !membership || membership.role !== 'owner') {
      return NextResponse.json(
        { error: "Solo el propietario puede eliminar la organización" },
        { status: 403 }
      );
    }

    // Obtener todos los miembros para actualizar sus perfiles después
    const { data: members } = await supabase
      .from('organization_members')
      .select('user_id')
      .eq('organization_id', id);

    // Iniciar transacción
    const { error: deleteError } = await supabase
      .from('organizations')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error("Error deleting organization:", deleteError);
      throw new Error("Error al eliminar la organización");
    }

    // Actualizar el current_organization_id de los perfiles afectados
    if (members && members.length > 0) {
      const userIds = members.map(m => m.user_id);
      
      // Buscar otra organización para cada usuario
      for (const userId of userIds) {
        const { data: otherOrg } = await supabase
          .from('organization_members')
          .select('organization_id')
          .eq('user_id', userId)
          .neq('organization_id', id)
          .limit(1)
          .single();
        
        // Actualizar el perfil con la nueva organización o null
        await supabase
          .from('profiles')
          .update({ 
            current_organization_id: otherOrg?.organization_id || null 
          })
          .eq('id', userId);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Organización eliminada exitosamente",
    });

  } catch (error) {
    console.error("Error in delete organization:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
