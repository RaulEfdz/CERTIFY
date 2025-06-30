'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Icons } from '@/components/icons';

interface CancelInvitationDialogProps {
  invitationId: string;
  email: string;
  organizationId: string;
  onCancel?: () => void;
}

export function CancelInvitationDialog({
  invitationId,
  email,
  organizationId,
  onCancel,
}: CancelInvitationDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCancelInvitation = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/organizations/invitations/${invitationId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ organizationId }),
      });

      if (!response.ok) {
        throw new Error('Error al cancelar la invitación');
      }

      toast.success('Invitación cancelada correctamente');
      setOpen(false);
      onCancel?.();
    } catch (error) {
      console.error('Error al cancelar invitación:', error);
      toast.error('Error al cancelar la invitación. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8">
          <Icons.logo className="h-4 w-4" />
          <span className="sr-only">Cancelar invitación</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancelar invitación</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas cancelar la invitación a <span className="font-medium">{email}</span>?
            Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            No, mantener
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleCancelInvitation}
            disabled={isLoading}
          >
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.trash className="mr-2 h-4 w-4" />
            )}
            Sí, cancelar invitación
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
