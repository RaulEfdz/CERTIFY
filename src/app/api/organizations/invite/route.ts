import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
  try {
    const { email, role, message, organizationId } = await request.json();
    
    if (!email || !role || !organizationId) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
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

    // Verificar que el usuario tiene permisos para invitar miembros
    const { data: membership, error: membershipError } = await supabase
      .from("organization_members")
      .select("role")
      .eq("user_id", user.id)
      .eq("organization_id", organizationId)
      .single();

    if (membershipError || !membership) {
      return NextResponse.json(
        { error: "No tienes permisos para invitar miembros a esta organización" },
        { status: 403 }
      );
    }

    // Solo los administradores pueden invitar a otros administradores
    if (role === "admin" && membership.role !== "owner" && membership.role !== "admin") {
      return NextResponse.json(
        { error: "Solo los administradores pueden invitar a otros administradores" },
        { status: 403 }
      );
    }

    // Verificar si el usuario ya es miembro de la organización
    if (email) {
      const { data: existingUser } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email)
        .single();

      if (existingUser) {
        const { data: existingMember } = await supabase
          .from("organization_members")
          .select("id")
          .eq("user_id", existingUser.id)
          .eq("organization_id", organizationId)
          .single();

        if (existingMember) {
          return NextResponse.json(
            { error: "Este usuario ya es miembro de la organización" },
            { status: 400 }
          );
        }
      }
    }

    // Verificar si ya existe una invitación pendiente para este correo
    const { data: existingInvitation } = await supabase
      .from("organization_invitations")
      .select("id")
      .eq("email", email)
      .eq("organization_id", organizationId)
      .is("accepted_at", null)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (existingInvitation) {
      return NextResponse.json(
        { error: "Ya existe una invitación pendiente para este correo electrónico" },
        { status: 400 }
      );
    }

    // Generar un token único para la invitación
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Expira en 7 días

    // Crear la invitación
    const { data: invitation, error: inviteError } = await supabase
      .from("organization_invitations")
      .insert([
        {
          organization_id: organizationId,
          email,
          role,
          token,
          message: message || null,
          invited_by: user.id,
          expires_at: expiresAt.toISOString(),
        },
      ])
      .select()
      .single();

    if (inviteError) {
      console.error("Error creating invitation:", inviteError);
      throw new Error("Error al crear la invitación");
    }

    // Enviar correo electrónico con la invitación
    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL}/invitations/accept?token=${token}`;
    
    // Aquí iría la lógica para enviar el correo electrónico
    // Por ejemplo, usando Resend, SendGrid, etc.
    console.log("Invitación creada. Enviar correo a:", email);
    console.log("Enlace de invitación:", inviteLink);

    return NextResponse.json({
      success: true,
      invitationId: invitation.id,
      message: "Invitación enviada con éxito",
    });

  } catch (error) {
    console.error("Error in invite member:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
