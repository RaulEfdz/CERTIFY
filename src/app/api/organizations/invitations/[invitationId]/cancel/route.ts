import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase/client";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ invitationId: string; organizationId: string }> }
) {
  try {
    const { invitationId, organizationId } = await params;

    // Validación de parámetros
    if (!invitationId || !organizationId) {
      return NextResponse.json(
        { error: 'Invitación inválida' },
        { status: 400 }
      );
    }

    // Verificar la sesión del usuario
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autorizado. Debes iniciar sesión primero.' },
        { status: 401 }
      );
    }

    // Verificar permisos en la organización
    const { data: membership, error: membershipError } = await supabase
      .from('organization_members')
      .select('role')
      .eq('user_id', user.id)
      .eq('organization_id', organizationId)
      .single();

    if (membershipError || !membership) {
      return NextResponse.json(
        { error: 'No tienes permisos para cancelar invitaciones en esta organización' },
        { status: 403 }
      );
    }

    // Obtener la invitación
    const { data: invitation, error: invitationError } = await supabase
      .from('organization_invitations')
      .select('*')
      .eq('id', invitationId)
      .eq('organization_id', organizationId)
      .single();

    if (invitationError || !invitation) {
      return NextResponse.json(
        { error: 'Invitación no encontrada' },
        { status: 404 }
      );
    }

    // Cancelar la invitación
    const { error: updateError } = await supabase
      .from('organization_invitations')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        cancelled_by: user.id
      })
      .eq('id', invitationId);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al cancelar invitación:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
