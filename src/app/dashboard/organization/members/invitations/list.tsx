"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Copy, Trash2, RefreshCw } from "lucide-react";

const ROLE_LABELS = {
  admin: "Administrador",
  member: "Miembro",
  guest: "Invitado",
} as const;

const ROLE_COLORS = {
  admin: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  member: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  guest: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
} as const;

interface Invitation {
  id: string;
  email: string;
  role: keyof typeof ROLE_LABELS;
  created_at: string;
  expires_at: string;
  invited_by: {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
  } | null;
}

interface InvitationsListProps {
  invitations: Invitation[];
  organizationId: string;
}

export function InvitationsList({ invitations, organizationId }: InvitationsListProps) {
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  const [isResending, setIsResending] = useState<Record<string, boolean>>({});
  
  const handleCopyInviteLink = async (token: string) => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/invitations/accept?token=${token}`
      );
      toast.success("Enlace copiado al portapapeles");
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      toast.error("No se pudo copiar el enlace");
    }
  };
  
  const handleResendInvitation = async (invitationId: string) => {
    setIsResending(prev => ({ ...prev, [invitationId]: true }));
    
    try {
      const response = await fetch(`/api/organizations/invitations/${invitationId}/resend`, {
        method: "POST",
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Error al reenviar la invitación");
      }
      
      toast.success("Invitación reenviada con éxito");
    } catch (error) {
      console.error("Error resending invitation:", error);
      toast.error(
        error instanceof Error ? error.message : "Error al reenviar la invitación"
      );
    } finally {
      setIsResending(prev => ({ ...prev, [invitationId]: false }));
    }
  };
  
  const handleRevokeInvitation = async (invitationId: string) => {
    if (!confirm("¿Estás seguro de que deseas revocar esta invitación?")) {
      return;
    }
    
    setIsLoading(prev => ({ ...prev, [invitationId]: true }));
    
    try {
      const response = await fetch(`/api/organizations/invitations/${invitationId}`, {
        method: "DELETE",
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Error al revocar la invitación");
      }
      
      toast.success("Invitación revocada con éxito");
      // Recargar la página para reflejar los cambios
      window.location.reload();
    } catch (error) {
      console.error("Error revoking invitation:", error);
      toast.error(
        error instanceof Error ? error.message : "Error al revocar la invitación"
      );
    } finally {
      setIsLoading(prev => ({ ...prev, [invitationId]: false }));
    }
  };
  
  if (invitations.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        No hay invitaciones pendientes.
      </div>
    );
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Correo electrónico</TableHead>
          <TableHead>Rol</TableHead>
          <TableHead>Invitado por</TableHead>
          <TableHead>Fecha de envío</TableHead>
          <TableHead>Vence el</TableHead>
          <TableHead className="w-12"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invitations.map((invitation) => {
          const expiresAt = new Date(invitation.expires_at);
          const isExpiringSoon = 
            expiresAt.getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000; // 3 días
          
          return (
            <TableRow key={invitation.id}>
              <TableCell className="font-medium">{invitation.email}</TableCell>
              <TableCell>
                <Badge className={ROLE_COLORS[invitation.role]}>
                  {ROLE_LABELS[invitation.role]}
                </Badge>
              </TableCell>
              <TableCell>
                {invitation.invited_by ? (
                  <span>
                    {invitation.invited_by.first_name || invitation.invited_by.email}
                    {invitation.invited_by.last_name ? ` ${invitation.invited_by.last_name}` : ''}
                  </span>
                ) : (
                  <span className="text-gray-400">Sistema</span>
                )}
              </TableCell>
              <TableCell>
                {format(new Date(invitation.created_at), 'PP', { locale: es })}
              </TableCell>
              <TableCell className={isExpiringSoon ? "text-amber-500 font-medium" : ""}>
                {format(expiresAt, 'PP', { locale: es })}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Acciones</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleCopyInviteLink(invitation.id)}>
                      <Copy className="mr-2 h-4 w-4" />
                      <span>Copiar enlace</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleResendInvitation(invitation.id)}
                      disabled={isResending[invitation.id]}
                    >
                      <RefreshCw className={`mr-2 h-4 w-4 ${isResending[invitation.id] ? 'animate-spin' : ''}`} />
                      <span>Reenviar invitación</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                      onClick={() => handleRevokeInvitation(invitation.id)}
                      disabled={isLoading[invitation.id]}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Revocar invitación</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
