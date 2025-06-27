import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { token, email } = await request.json();
    
    if (!token) {
      return NextResponse.json(
        { error: "Token de invitación no proporcionado" },
        { status: 400 }
      );
    }

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    // 1. Verificar la sesión del usuario
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: "No autorizado. Debes iniciar sesión primero." },
        { status: 401 }
      );
    }

    // 2. Verificar que el correo coincida con la invitación si se proporciona
    if (email && user.email !== email) {
      return NextResponse.json(
        { error: "Esta invitación es para otro correo electrónico" },
        { status: 403 }
      );
    }

    // 3. Obtener la invitación
    const { data: invitation, error: invitationError } = await supabase
      .from("organization_invitations")
      .select("*, organizations(*)")
      .eq("token", token)
      .single();

    if (invitationError || !invitation) {
      return NextResponse.json(
        { error: "Invitación no encontrada o inválida" },
        { status: 404 }
      );
    }

    // 4. Verificar que la invitación no haya expirado
    if (new Date(invitation.expires_at) < new Date()) {
      return NextResponse.json(
        { error: "Esta invitación ha expirado" },
        { status: 400 }
      );
    }

    // 5. Verificar que la invitación no haya sido aceptada
    if (invitation.accepted_at) {
      return NextResponse.json(
        { error: "Esta invitación ya ha sido aceptada" },
        { status: 400 }
      );
    }

    // 6. Verificar que el correo coincida si está especificado en la invitación
    if (invitation.email && invitation.email !== user.email) {
      return NextResponse.json(
        { error: "Esta invitación es para otro correo electrónico" },
        { status: 403 }
      );
    }

    // 7. Usar una transacción para evitar condiciones de carrera
    const { data: result, error: upsertError } = await supabase.rpc(
      'accept_organization_invitation',
      {
        p_invitation_id: invitation.id,
        p_user_id: user.id,
        p_organization_id: invitation.organization_id,
        p_role: invitation.role
      }
    );

    if (upsertError) {
      console.error("Error accepting invitation:", upsertError);
      return NextResponse.json(
        { error: "Error al procesar la invitación" },
        { status: 500 }
      );
    }

    // 8. Limpiar el token de invitación si existe en localStorage
    // Esto se manejará en el frontend después de una redirección exitosa

    return NextResponse.json({
      success: true,
      organizationId: invitation.organization_id,
      role: invitation.role
    });

  } catch (error) {
    console.error("Error in accept invitation:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
