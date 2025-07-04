"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Upload } from "lucide-react";
import React, { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ImageUploadProps {
  onUpload: (dataUrl: string) => void;
  label: string;
  className?: string;
  tooltip?: string;
}

export default function ImageUpload({ onUpload, label, className = '', tooltip }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [showResizeModal, setShowResizeModal] = useState(false);
  const [oversizedFile, setOversizedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const readFileAsDataUrl = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onUpload(e.target.result as string);
        toast({
          title: "Imagen Subida",
          description: "La imagen ha sido añadida a la plantilla.",
        });
      }
    };
    reader.onerror = () => {
      toast({
        variant: "destructive",
        title: "Error de Lectura",
        description: "No se pudo leer el archivo de imagen.",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setOversizedFile(file);
        setShowResizeModal(true);
        if (inputRef.current) {
          inputRef.current.value = "";
        }
        return;
      }
      readFileAsDataUrl(file);
    }
  };

  const handleCompressAndUpload = () => {
    if (!oversizedFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 1080;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const dataUrl = canvas.toDataURL(oversizedFile.type, 0.8);
            onUpload(dataUrl);
            setPreview(dataUrl);
            toast({
              title: "Imagen Comprimida y Subida",
              description: "La imagen ha sido redimensionada y añadida.",
            });
        }
        setShowResizeModal(false);
        setOversizedFile(null);
      };
      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };
    reader.readAsDataURL(oversizedFile);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <TooltipProvider>
      <div className={cn("flex flex-col gap-4", className)}>
        <Input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-2 bg-gradient-to-br from-white to-slate-50 dark:from-slate-50 dark:to-white p-3 rounded-xl border border-slate-200 dark:border-slate-300">
          {preview && (
            <div className="relative w-24 h-24 border rounded-md overflow-hidden mb-2">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {tooltip ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => inputRef.current?.click()}
                  className="w-full bg-white dark:bg-slate-100 text-slate-700 dark:text-slate-800 border-slate-300 dark:border-slate-400 hover:bg-slate-50 dark:hover:bg-slate-200 transition-colors text-xs py-2 h-auto min-h-[2.5rem]"
                >
                  <Upload className="mr-2 h-4 w-4 flex-shrink-0" /> 
                  <span className="truncate leading-tight">{label}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => inputRef.current?.click()}
              className="w-full bg-white dark:bg-slate-100 text-slate-700 dark:text-slate-800 border-slate-300 dark:border-slate-400 hover:bg-slate-50 dark:hover:bg-slate-200 transition-colors text-xs py-2 h-auto min-h-[2.5rem]"
            >
              <Upload className="mr-2 h-4 w-4 flex-shrink-0" /> 
              <span className="truncate leading-tight">{label}</span>
            </Button>
          )}
        </div>
        <AlertDialog open={showResizeModal} onOpenChange={setShowResizeModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Imagen Demasiado Grande</AlertDialogTitle>
            <AlertDialogDescription>
              La imagen que seleccionaste supera el límite de 2MB. Podemos
              intentar comprimirla y redimensionarla para que se ajuste.
              ¿Quieres continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOversizedFile(null)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleCompressAndUpload}>
              Comprimir y Subir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </TooltipProvider>
  );
}
