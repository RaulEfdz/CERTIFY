-- Crear la función que maneja la lógica de aceptación de invitaciones
CREATE OR REPLACE FUNCTION public.accept_organization_invitation(
  p_invitation_id uuid
) RETURNS jsonb
LANGUAGE plpgsql
-- SECURITY DEFINER es crucial aquí para poder modificar tablas protegidas
-- como 'organization_members' con los permisos del creador de la función.
SECURITY DEFINER
AS $$
DECLARE
  v_invitation_record record;
  v_user_id uuid := auth.uid(); -- Obtenemos el ID del usuario autenticado directamente. Es más seguro.
  v_user_email text;
  v_membership_exists boolean;
  v_result jsonb;
BEGIN
  -- 1. Obtener los datos del usuario que llama a la función
  SELECT email INTO v_user_email FROM auth.users WHERE id = v_user_id;
  IF v_user_email IS NULL THEN
    RETURN jsonb_build_object('error', 'Usuario no encontrado');
  END IF;

  -- 2. Bloquear la fila de la invitación para evitar condiciones de carrera
  --    y obtener sus datos de forma segura.
  SELECT * INTO v_invitation_record
  FROM public.organization_invitations
  WHERE id = p_invitation_id
  FOR UPDATE;

  -- 3. Realizar todas las validaciones sobre la invitación
  IF v_invitation_record IS NULL THEN
    RETURN jsonb_build_object('error', 'Invitación no encontrada');
  END IF;

  IF v_invitation_record.expires_at < NOW() THEN
    RETURN jsonb_build_object('error', 'La invitación ha expirado');
  END IF;

  IF v_invitation_record.accepted_at IS NOT NULL THEN
    RETURN jsonb_build_object('error', 'Esta invitación ya ha sido aceptada');
  END IF;

  -- La validación más importante: el correo debe coincidir.
  IF v_invitation_record.email IS NOT NULL AND v_invitation_record.email != v_user_email THEN
    RETURN jsonb_build_object('error', 'Esta invitación pertenece a otro usuario');
  END IF;

  -- 4. Verificar si el usuario ya es miembro de la organización
  --    Usamos los datos de la invitación, no los parámetros de entrada.
  SELECT EXISTS(
    SELECT 1 FROM public.organization_members
    WHERE user_id = v_user_id AND organization_id = v_invitation_record.organization_id
  ) INTO v_membership_exists;

  -- 5. Insertar o actualizar la membresía del usuario
  --    Se usan los datos de 'v_invitation_record' para máxima seguridad.
  IF v_membership_exists THEN
    -- Si ya es miembro, se actualiza el rol
    UPDATE public.organization_members
    SET
      role = v_invitation_record.role, -- Usar el rol de la invitación
      updated_at = NOW()
    WHERE user_id = v_user_id
      AND organization_id = v_invitation_record.organization_id -- Usar el org_id de la invitación
    RETURNING jsonb_build_object(
      'status', 'existing_member_updated',
      'user_id', user_id,
      'organization_id', organization_id,
      'role', role
    ) INTO v_result;
  ELSE
    -- Si no es miembro, se crea el nuevo registro
    INSERT INTO public.organization_members (user_id, organization_id, role)
    VALUES (v_user_id, v_invitation_record.organization_id, v_invitation_record.role)
    RETURNING jsonb_build_object(
      'status', 'new_member_added',
      'user_id', user_id,
      'organization_id', organization_id,
      'role', role
    ) INTO v_result;
  END IF;

  -- 6. Marcar la invitación como aceptada
  UPDATE public.organization_invitations
  SET
    accepted_at = NOW(),
    updated_at = NOW()
  WHERE id = p_invitation_id;

  -- 7. Registrar la acción en el historial de auditoría
  INSERT INTO public.audit_logs (
    user_id,
    organization_id,
    action,
    target_id,
    details
  ) VALUES (
    v_user_id,
    v_invitation_record.organization_id, -- Usar el org_id de la invitación
    'invitation_accepted',
    p_invitation_id,
    jsonb_build_object(
      'invitation_id', p_invitation_id,
      'role_assigned', v_invitation_record.role -- Usar el rol de la invitación
    )
  );

  -- 8. Devolver el resultado de la operación
  RETURN v_result;

EXCEPTION
  WHEN OTHERS THEN
    -- En caso de un error inesperado, se registra en los logs del servidor
    -- y se devuelve un mensaje genérico al cliente.
    RAISE WARNING 'Error en accept_organization_invitation: %. SQLSTATE: %', SQLERRM, SQLSTATE;
    RETURN jsonb_build_object('error', 'Error interno al procesar la invitación');
END;
$$;

-- Otorgar permisos a la función
-- El único parámetro ahora es p_invitation_id (uuid)
GRANT EXECUTE ON FUNCTION public.accept_organization_invitation(uuid) TO authenticated, service_role;