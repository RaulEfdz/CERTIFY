'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./button";

import React from "react";

interface ErrorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  onClose?: () => void;
  children?: React.ReactNode;
}

export function ErrorDialog({
  open,
  onOpenChange,
  title = "Error",
  description,
  onClose,
  children,
}: ErrorDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-red-600">{title}</DialogTitle>
          {children ? (
            children
          ) : (
            <DialogDescription className="text-foreground">
              {description}
            </DialogDescription>
          )}
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
