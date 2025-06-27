import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { invitationId: string } }
) {
  try {
    const { invitationId } = params;
    
    if (!invitationId) {
      return NextResponse.json(
        { error: "ID de invitación no proporcionado" },
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

    // Obtener la invitación para verificar la organización
    const { data: invitation, error: invitationError } = await supabase
      .from("organization_invitations")
      .select("organization_id")
      .eq("id", invitationId)
      .single();

    if (invitationError || !invitation) {
      return NextResponse.json(
        { error: "Invitación no encontrada" },
        { status: 404 }
      );
    }

    // Verificar que el usuario tiene permisos para eliminar invitaciones
    const { data: membership, error: membershipError } = await supabase
      .from("organization_members")
      .select("role")
      .eq("user_id", user.id)
      .eq("organization_id", invitation.organization_id)
      .single();

    if (membershipError || !membership) {
      return NextResponse.json(
        { error: "No tienes permisos para revocar esta invitación" },
        { status: 403 }
      );
    }

    // Eliminar la invitación
    const { error: deleteError } = await supabase
      .from("organization_invitations")
      .delete()
      .eq("id", invitationId);

    if (deleteError) {
      console.error("Error deleting invitation:", deleteError);
      throw new Error("Error al eliminar la invitación");
    }

    return NextResponse.json({
      success: true,
      message: "Invitación revocada con éxito",
    });

  } catch (error) {
    console.error("Error in delete invitation:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
