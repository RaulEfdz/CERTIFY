'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  value?: string | null;
  onChange: (file: File) => void;
  onRemove: () => void;
  disabled?: boolean;
  maxSize?: number; // en bytes (por defecto 2MB)
  accept?: Record<string, string[]>; // Tipos de archivo aceptados
}

export function ImageUpload({
  value,
  onChange,
  onRemove,
  disabled = false,
  maxSize = 2 * 1024 * 1024, // 2MB por defecto
  accept = {
    'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
  },
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        if (file.size > maxSize) {
          // Mostrar error de tamaño máximo
          return;
        }
        onChange(file);
      }
    },
    [onChange, maxSize]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    maxSize,
    disabled,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false),
    onDropAccepted: () => setIsDragging(false),
    onDropRejected: () => setIsDragging(false),
  });

  if (value) {
    return (
      <div className="relative group">
        <div className="relative aspect-square w-full h-64 rounded-md overflow-hidden">
          <img
            src={value}
            alt="Preview"
            className="object-cover w-full h-full"
          />
        </div>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={onRemove}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          disabled={disabled}
        >
          <Icons.trash className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed rounded-md p-8 text-center transition-colors',
        isDragging
          ? 'border-primary bg-primary/10'
          : 'border-muted-foreground/25 hover:border-primary/50',
        disabled && 'opacity-50 cursor-not-allowed',
        'cursor-pointer'
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-2">
        <Icons.upload className="h-10 w-10 text-muted-foreground" />
        <div className="text-sm text-muted-foreground">
          {isDragActive ? (
            <p>Suelta la imagen aquí...</p>
          ) : (
            <div className="text-center">
              <p className="font-medium">
                Arrastra una imagen o haz clic para seleccionar
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG, GIF hasta {maxSize / (1024 * 1024)}MB
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
