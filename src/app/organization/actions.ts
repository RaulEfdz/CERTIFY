
"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { OrganizationRole } from "@/lib/db/types";
import { randomBytes } from "crypto";

export async function inviteUserToOrganization(
  organizationId: string,
  email: string,
  role: OrganizationRole
): Promise<{ success: boolean; error?: string }> {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    // 1. Verificar si el usuario actual tiene permiso para invitar
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("No autenticado.");
    }

    const { data: member, error: memberError } = await supabase
      .from("organization_members")
      .select("role")
      .eq("user_id", user.id)
      .eq("organization_id", organizationId)
      .single();

    if (memberError || !["admin", "owner"].includes(member.role)) {
      throw new Error("No tienes permiso para invitar a miembros a esta organización.");
    }

    // 2. Verificar si el usuario ya es miembro o si ya tiene una invitación pendiente
    // (Esta lógica se puede añadir para más robustez)

    // 3. Generar un token de invitación seguro
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // La invitación expira en 7 días

    // 4. Insertar la invitación en la base de datos
    const { error: inviteError } = await supabase
      .from("organization_invitations")
      .insert({
        organization_id: organizationId,
        email,
        role,
        token,
        expires_at: expiresAt.toISOString(),
        created_by: user.id,
      });

    if (inviteError) {
      // Manejar errores específicos, como una invitación duplicada (unique constraint)
      if (inviteError.code === "23505") { // unique_violation
        throw new Error("Ya existe una invitación pendiente para este email en esta organización.");
      }
      throw new Error(inviteError.message);
    }

    // 5. TODO: Enviar email de invitación
    // Aquí iría la lógica para enviar un email al `email` proporcionado.
    // El email debería contener un enlace como: `https://[tu-dominio]/invitations/accept?token=${token}`
    console.log(`Email de invitación para ${email} con token: ${token}`);

    return { success: true };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
    console.error("Error al invitar usuario:", errorMessage);
    return { success: false, error: errorMessage };
  }
}
