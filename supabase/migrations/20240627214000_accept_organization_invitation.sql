-- Crear la función que maneja la lógica de aceptación de invitaciones
CREATE OR REPLACE FUNCTION public.accept_organization_invitation(
  p_invitation_id uuid,
  p_user_id uuid,
  p_organization_id uuid,
  p_role text
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_invitation_record RECORD;
  v_membership_exists boolean;
  v_result jsonb;
BEGIN
  -- Bloquear la fila de la invitación para evitar condiciones de carrera
  SELECT * INTO v_invitation_record
  FROM organization_invitations
  WHERE id = p_invitation_id
  FOR UPDATE;

  -- Verificar que la invitación existe
  IF v_invitation_record IS NULL THEN
    RETURN jsonb_build_object('error', 'Invitación no encontrada');
  END IF;

  -- Verificar que la invitación no haya expirado
  IF v_invitation_record.expires_at < NOW() THEN
    RETURN jsonb_build_object('error', 'La invitación ha expirado');
  END IF;

  -- Verificar que la invitación no haya sido aceptada
  IF v_invitation_record.accepted_at IS NOT NULL THEN
    RETURN jsonb_build_object('error', 'Esta invitación ya ha sido aceptada');
  END IF;

  -- Verificar que el correo coincida si está especificado
  IF v_invitation_record.email IS NOT NULL AND 
     v_invitation_record.email != (SELECT email FROM auth.users WHERE id = p_user_id) THEN
    RETURN jsonb_build_object('error', 'Esta invitación es para otro correo electrónico');
  END IF;

  -- Verificar si el usuario ya es miembro de la organización
  SELECT EXISTS(
    SELECT 1 FROM organization_members
    WHERE user_id = p_user_id AND organization_id = p_organization_id
  ) INTO v_membership_exists;

  -- Si ya es miembro, actualizar el rol si es necesario
  IF v_membership_exists THEN
    UPDATE organization_members
    SET role = p_role,
        updated_at = NOW()
    WHERE user_id = p_user_id 
    AND organization_id = p_organization_id
    RETURNING jsonb_build_object(
      'status', 'existing_member_updated',
      'user_id', user_id,
      'organization_id', organization_id,
      'role', role
    ) INTO v_result;
  ELSE
    -- Si no es miembro, agregarlo a la organización
    INSERT INTO organization_members (user_id, organization_id, role)
    VALUES (p_user_id, p_organization_id, p_role)
    RETURNING jsonb_build_object(
      'status', 'new_member_added',
      'user_id', user_id,
      'organization_id', organization_id,
      'role', role
    ) INTO v_result;
  END IF;

  -- Marcar la invitación como aceptada
  UPDATE organization_invitations
  SET 
    accepted_at = NOW(),
    updated_at = NOW()
  WHERE id = p_invitation_id;

  -- Registrar la acción en el historial de auditoría
  INSERT INTO audit_logs (
    user_id, 
    organization_id, 
    action, 
    target_id, 
    details
  ) VALUES (
    p_user_id,
    p_organization_id,
    'invitation_accepted',
    p_invitation_id,
    jsonb_build_object(
      'invitation_id', p_invitation_id,
      'role', p_role
    )
  );

  RETURN v_result;
EXCEPTION
  WHEN OTHERS THEN
    -- Registrar el error
    RAISE LOG 'Error en accept_organization_invitation: %', SQLERRM;
    RETURN jsonb_build_object('error', 'Error al procesar la invitación');
END;
$$;

-- Otorgar permisos a la función
GRANTE EXECUTE ON FUNCTION public.accept_organization_invitation(uuid, uuid, uuid, text) TO authenticated, service_role;
