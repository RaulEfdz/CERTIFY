"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Download, 
  FileText, 
  Image, 
  Camera,
  Copy,
  ChevronDown,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { exportToPDF, exportToImage, copyToClipboard, generateExportFilename } from "../utils/exportUtils";

interface ExportDropdownProps {
  templateHtml: string;
  certificateSize: 'landscape' | 'square';
  templateName?: string;
  buttonVariant?: "default" | "ghost" | "outline";
  buttonSize?: "sm" | "lg";
  className?: string;
}

export function ExportDropdown({ 
  templateHtml, 
  certificateSize,
  templateName = "certificado",
  buttonVariant = "ghost",
  buttonSize = "sm",
  className = ""
}: ExportDropdownProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportingFormat, setExportingFormat] = useState<string | null>(null);

  // Simplified - we're always in preview mode now
  const ensurePreviewMode = async (): Promise<boolean> => {
    return true;
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    setExportingFormat('pdf');
    
    try {
      // Always in preview mode now
      
      // Check if certificate element exists
      const certificateElement = document.querySelector('.certificate-container') as HTMLElement;
      
      if (!certificateElement) {
        throw new Error('No se encontró el elemento del certificado. Intenta refrescar la página.');
      }

      const filename = generateExportFilename(templateName, 'pdf');
      await exportToPDF(templateHtml, { filename });
      toast.success("PDF exportado exitosamente");
    } catch (error) {
      console.error('Export PDF error:', error);
      toast.error(error instanceof Error ? error.message : "Error al exportar PDF");
    } finally {
      setIsExporting(false);
      setExportingFormat(null);
    }
  };

  const handleExportPNG = async () => {
    setIsExporting(true);
    setExportingFormat('png');
    
    try {
      // Always in preview mode now
      
      // Find the certificate element in the DOM
      const certificateElement = document.querySelector('.certificate-container') as HTMLElement;
      
      if (!certificateElement) {
        throw new Error('No se encontró el elemento del certificado. Intenta refrescar la página.');
      }

      // Temporarily remove transform to capture at original size
      const originalTransform = certificateElement.style.transform;
      certificateElement.style.transform = 'scale(1)';

      const filename = generateExportFilename(templateName, 'png');
      await exportToImage(certificateElement, certificateSize, { 
        format: 'png',
        filename 
      });

      // Restore original transform
      certificateElement.style.transform = originalTransform;

      toast.success("Imagen PNG exportada exitosamente");
    } catch (error) {
      console.error('Export PNG error:', error);
      toast.error(error instanceof Error ? error.message : "Error al exportar imagen PNG");
    } finally {
      setIsExporting(false);
      setExportingFormat(null);
    }
  };

  const handleExportJPEG = async () => {
    setIsExporting(true);
    setExportingFormat('jpeg');
    
    try {
      // Always in preview mode now
      
      // Find the certificate element in the DOM
      const certificateElement = document.querySelector('.certificate-container') as HTMLElement;
      
      if (!certificateElement) {
        throw new Error('No se encontró el elemento del certificado. Intenta refrescar la página.');
      }

      // Temporarily remove transform to capture at original size
      const originalTransform = certificateElement.style.transform;
      certificateElement.style.transform = 'scale(1)';

      const filename = generateExportFilename(templateName, 'jpg');
      await exportToImage(certificateElement, certificateSize, { 
        format: 'jpeg',
        filename,
        quality: 0.9
      });

      // Restore original transform
      certificateElement.style.transform = originalTransform;

      toast.success("Imagen JPEG exportada exitosamente");
    } catch (error) {
      console.error('Export JPEG error:', error);
      toast.error(error instanceof Error ? error.message : "Error al exportar imagen JPEG");
    } finally {
      setIsExporting(false);
      setExportingFormat(null);
    }
  };

  const handleCopyHTML = async () => {
    try {
      await copyToClipboard(templateHtml);
      toast.success("Código HTML copiado al portapapeles");
    } catch (error) {
      console.error('Copy HTML error:', error);
      toast.error("Error al copiar código HTML");
    }
  };

  const getLoadingIcon = (format: string) => {
    return exportingFormat === format ? (
      <Loader2 className="h-4 w-4 animate-spin" />
    ) : null;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={buttonVariant} 
          size={buttonSize}
          disabled={isExporting}
          className={`gap-1.5 ${className} bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700`}
        >
          {isExporting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Download className="h-3.5 w-3.5" />
          )}
          Exportar
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem 
          onClick={handleExportPDF}
          disabled={isExporting}
          className="flex items-center gap-2"
        >
          {getLoadingIcon('pdf') || <FileText className="h-4 w-4" />}
          <span>Exportar como PDF</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleExportPNG}
          disabled={isExporting}
          className="flex items-center gap-2"
        >
          {getLoadingIcon('png') || <Image className="h-4 w-4" />}
          <span>Exportar como PNG</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={handleExportJPEG}
          disabled={isExporting}
          className="flex items-center gap-2"
        >
          {getLoadingIcon('jpeg') || <Camera className="h-4 w-4" />}
          <span>Exportar como JPEG</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleCopyHTML}
          className="flex items-center gap-2"
        >
          <Copy className="h-4 w-4" />
          <span>Copiar código HTML</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}