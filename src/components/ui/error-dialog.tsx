'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./button";

interface ErrorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description: string;
  onClose?: () => void;
}

export function ErrorDialog({
  open,
  onOpenChange,
  title = "Error",
  description,
  onClose,
}: ErrorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-red-600">{title}</DialogTitle>
          <DialogDescription className="text-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end pt-4">
          <Button
            onClick={() => {
              onOpenChange(false);
              onClose?.();
            }}
          >
            Entendido
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
