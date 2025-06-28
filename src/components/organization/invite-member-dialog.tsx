'use client';

import { useState } from 'react';
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
import { InviteMemberForm } from './invite-member-form';

interface InviteMemberDialogProps {
  organizationId: string;
  onInviteSent?: () => void;
  trigger?: React.ReactNode;
}

export function InviteMemberDialog({ 
  organizationId, 
  onInviteSent,
  trigger 
}: InviteMemberDialogProps) {
  const [open, setOpen] = useState(false);

  const handleInviteSent = () => {
    setOpen(false);
    onInviteSent?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Icons.userPlus className="mr-2 h-4 w-4" />
            Invitar miembro
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invitar a un miembro</DialogTitle>
          <DialogDescription>
            Invita a un nuevo miembro a unirse a tu organización. Se les enviará un correo electrónico con las instrucciones.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <InviteMemberForm 
            organizationId={organizationId}
            onSuccess={handleInviteSent}
            onCancel={() => setOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
