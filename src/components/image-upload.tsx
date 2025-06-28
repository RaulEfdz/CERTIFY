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
  maxSize = 5 * 1024 * 1024, // 5MB por defecto
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
        <div className="relative w-[500px] h-[500px] rounded-md overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-50">
          <img
            src={value}
            alt="Vista previa del logo"
            className="object-contain max-w-[90%] max-h-[90%]"
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
        'border-2 border-dashed rounded-md p-8 text-center transition-colors w-[500px] h-[500px] flex items-center justify-center',
        isDragging
          ? 'border-primary bg-primary/10'
          : 'border-gray-300 hover:border-primary/50',
        disabled && 'opacity-50 cursor-not-allowed',
        'cursor-pointer'
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-4 p-4">
        <Icons.upload className="h-16 w-16 text-gray-400" />
        <div className="space-y-2">
          <p className="font-medium text-gray-900">Sin archivo seleccionado</p>
          <p className="text-sm text-gray-600">
            {isDragActive ? (
              'Suelta el logo aquí...'
            ) : (
              <>
                Arrastra una imagen o haz clic para seleccionar
              </>
            )}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            PNG, JPG, GIF hasta 5MB
          </p>
        </div>
      </div>
    </div>
  );
}
