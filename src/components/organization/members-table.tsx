'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { CancelInvitationDialog } from './cancel-invitation-dialog';
import { RemoveMemberDialog } from './remove-member-dialog';
import { ResendInvitationDialog } from './resend-invitation-dialog';

interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  avatar_url: string | null;
}

interface Member {
  id: string;
  role: string;
  created_at: string;
  user_id: string;
  profiles: Profile;
}

interface Invitation {
  id: string;
  email: string;
  role: string;
  created_at: string;
  expires_at: string;
}

interface MembersTableProps {
  members: Member[];
  pendingInvitations: Invitation[];
  currentUserId: string;
  organizationId: string;
}

export function MembersTable({
  members,
  pendingInvitations,
  currentUserId,
  organizationId,
}: MembersTableProps) {
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PP', { locale: es });
  };

  const getInitials = (name: string | null) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'owner':
        return <Badge variant="secondary">Propietario</Badge>;
      case 'admin':
        return <Badge>Administrador</Badge>;
      case 'member':
      default:
        return <Badge variant="outline">Miembro</Badge>;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Miembro</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Fecha de ingreso</TableHead>
            <TableHead className="w-[100px] text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.profiles.avatar_url || ''} alt={member.profiles.full_name || ''} />
                    <AvatarFallback>
                      {getInitials(member.profiles.full_name || member.profiles.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">
                      {member.profiles.full_name || 'Usuario sin nombre'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {member.profiles.email}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{getRoleBadge(member.role)}</TableCell>
              <TableCell>{formatDate(member.created_at)}</TableCell>
              <TableCell className="text-right">
                {member.user_id !== currentUserId && (
                  <RemoveMemberDialog
                    memberId={member.user_id}
                    memberName={member.profiles.full_name || member.profiles.email}
                    organizationId={organizationId}
                    disabled={member.role === 'owner'}
                  />
                )}
              </TableCell>
            </TableRow>
          ))}

          {pendingInvitations.map((invitation) => (
            <TableRow key={invitation.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <Icons.mail className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-medium">
                      {invitation.email}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Invitación pendiente
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>{getRoleBadge(invitation.role)}</TableCell>
              <TableCell>Invitado el {formatDate(invitation.created_at)}</TableCell>
              <TableCell className="flex justify-end space-x-2">
                <ResendInvitationDialog
                  invitationId={invitation.id}
                  email={invitation.email}
                  organizationId={organizationId}
                />
                <CancelInvitationDialog
                  invitationId={invitation.id}
                  email={invitation.email}
                  organizationId={organizationId}
                />
              </TableCell>
            </TableRow>
          ))}

          {members.length === 0 && pendingInvitations.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Icons.users className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No hay miembros en esta organización
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
