import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ invitationId: string }> }
) {
  try {
    const { invitationId } = await params;
    
    if (!invitationId) {
      return NextResponse.json(
        { error: "ID de invitación no proporcionado" },
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

    // Obtener la invitación
    const { data: invitation, error: invitationError } = await supabase
      .from("organization_invitations")
      .select(`
        *,
        organizations(*)
      `)
      .eq("id", invitationId)
      .single();

    if (invitationError || !invitation) {
      return NextResponse.json(
        { error: "Invitación no encontrada" },
        { status: 404 }
      );
    }

    // Verificar que el usuario tiene permisos para reenviar invitaciones
    const { data: membership, error: membershipError } = await supabase
      .from("organization_members")
      .select("role")
      .eq("user_id", user.id)
      .eq("organization_id", invitation.organization_id)
      .single();

    if (membershipError || !membership) {
      return NextResponse.json(
        { error: "No tienes permisos para reenviar esta invitación" },
        { status: 403 }
      );
    }

    // Verificar que la invitación no haya expirado
    if (new Date(invitation.expires_at) < new Date()) {
      return NextResponse.json(
        { error: "Esta invitación ha expirado" },
        { status: 400 }
      );
    }

    // Verificar que la invitación no haya sido aceptada
    if (invitation.accepted_at) {
      return NextResponse.json(
        { error: "Esta invitación ya ha sido aceptada" },
        { status: 400 }
      );
    }

    // Actualizar la fecha de expiración (opcional: extender el plazo)
    const newExpiresAt = new Date();
    newExpiresAt.setDate(newExpiresAt.getDate() + 7); // Extender por 7 días más

    const { error: updateError } = await supabase
      .from("organization_invitations")
      .update({
        expires_at: newExpiresAt.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", invitationId);

    if (updateError) {
      console.error("Error updating invitation:", updateError);
      throw new Error("Error al actualizar la invitación");
    }

    // Aquí iría la lógica para enviar el correo electrónico
    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/invitations/accept?token=${invitation.token}`;
    console.log("Reenviando invitación a:", invitation.email);
    console.log("Nuevo enlace de invitación:", inviteLink);

    return NextResponse.json({
      success: true,
      message: "Invitación reenviada con éxito",
    });

  } catch (error) {
    console.error("Error in resend invitation:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
