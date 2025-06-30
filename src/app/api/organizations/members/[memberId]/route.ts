import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ memberId: string }> }
) {
  try {
    const { memberId } = await params;
    const { organizationId } = await request.json();
    
    if (!memberId || !organizationId) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verificar la sesión del usuario
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autorizado. Debes iniciar sesión primero.' },
        { status: 401 }
      );
    }

    // Verificar que el usuario que realiza la acción es administrador
    const { data: currentUserMembership, error: membershipError } = await supabase
      .from('organization_members')
      .select('role')
      .eq('user_id', user.id)
      .eq('organization_id', organizationId)
      .single();

    if (membershipError || !currentUserMembership) {
      return NextResponse.json(
        { error: 'No tienes permisos para realizar esta acción' },
        { status: 403 }
      );
    }

    // No permitir que los miembros regulares eliminen a otros miembros
    if (currentUserMembership.role === 'member') {
      return NextResponse.json(
        { error: 'No tienes permisos para eliminar miembros' },
        { status: 403 }
      );
    }

    // Verificar que el miembro a eliminar existe
    const { data: memberToDelete, error: memberError } = await supabase
      .from('organization_members')
      .select('*')
      .eq('user_id', memberId)
      .eq('organization_id', organizationId)
      .single();

    if (memberError || !memberToDelete) {
      return NextResponse.json(
        { error: 'Miembro no encontrado' },
        { status: 404 }
      );
    }

    // No permitir eliminar al propietario de la organización
    if (memberToDelete.role === 'owner') {
      return NextResponse.json(
        { error: 'No se puede eliminar al propietario de la organización' },
        { status: 403 }
      );
    }

    // No permitir que los administradores eliminen a otros administradores
    if (memberToDelete.role === 'admin' && currentUserMembership.role !== 'owner') {
      return NextResponse.json(
        { error: 'Solo el propietario puede eliminar a otros administradores' },
        { status: 403 }
      );
    }

    // Eliminar al miembro
    const { error: deleteError } = await supabase
      .from('organization_members')
      .delete()
      .eq('user_id', memberId)
      .eq('organization_id', organizationId);

    if (deleteError) {
      throw deleteError;
    }

    // Registrar la acción en el historial de auditoría
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      organization_id: organizationId,
      action: 'member_removed',
      target_id: memberId,
      details: {
        removed_user_id: memberId,
        removed_by: user.id,
        role: memberToDelete.role,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar miembro:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
