'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

interface ResendInvitationDialogProps {
  invitationId: string;
  email: string;
  organizationId: string;
  onResend?: () => void;
}

export function ResendInvitationDialog({
  invitationId,
  email,
  organizationId,
  onResend,
}: ResendInvitationDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleResendInvitation = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/organizations/invitations/${invitationId}/resend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ organizationId }),
      });

      if (!response.ok) {
        throw new Error('Error al reenviar la invitación');
      }

      toast.success('Invitación reenviada correctamente');
      onResend?.();
    } catch (error) {
      console.error('Error al reenviar invitación:', error);
      toast.error('Error al reenviar la invitación. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="h-8"
      onClick={handleResendInvitation}
      disabled={isLoading}
    >
      {isLoading ? (
        <Icons.spinner className="h-4 w-4 animate-spin" />
      ) : (
        <Icons.logo className="h-4 w-4" />
      )}
      <span className="sr-only">Reenviar invitación</span>
    </Button>
  );
}
