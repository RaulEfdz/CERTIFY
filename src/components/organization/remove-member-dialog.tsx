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

interface RemoveMemberDialogProps {
  memberId: string;
  memberName: string;
  organizationId: string;
  disabled?: boolean;
  onRemove?: () => void;
}

export function RemoveMemberDialog({
  memberId,
  memberName,
  organizationId,
  disabled = false,
  onRemove,
}: RemoveMemberDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRemoveMember = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/organizations/members/${memberId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ organizationId }),
      });

      if (!response.ok) {
        throw new Error('Error al eliminar al miembro');
      }

      toast.success('Miembro eliminado correctamente');
      setOpen(false);
      onRemove?.();
    } catch (error) {
      console.error('Error al eliminar miembro:', error);
      toast.error('Error al eliminar al miembro. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 text-red-600 hover:text-red-800 hover:bg-red-50"
          disabled={disabled}
        >
          <Icons.users className="h-4 w-4" />
          <span className="sr-only">Eliminar miembro</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar miembro</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar a <span className="font-medium">{memberName}</span> de la organización?
            Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleRemoveMember}
            disabled={isLoading}
          >
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.trash className="mr-2 h-4 w-4" />
            )}
            Eliminar miembro
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
