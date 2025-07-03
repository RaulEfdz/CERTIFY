"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Settings2,
  X,
  Save,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Layers,
  Palette,
  Type,
  Image,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

import { useTemplateState } from "./editor/hooks/useTemplateState";
import { TemplateSidebar } from "./editor/components/TemplateSidebar";
import { SaveTemplateModal, SaveTemplateData } from "./editor/components/SaveTemplateModal";
import { ExportDropdown } from "./editor/components/ExportDropdown";
import { getTemplateHtml } from "./editor/templates/defaultTemplate";
import { TemplateConfig } from "./editor/types";
import { mockDatabase } from "@/lib/mock-db";

interface Template {
  id: string;
  name: string;
  description: string;
  config: TemplateConfig;
  html: string;
  status: "draft" | "published" | "archived";
  is_public: boolean;
  created_by: string;
  organization_id: string | null;
  auto_save_data: AutoSaveData | null;
  version: number;
  created_at: string;
  updated_at: string;
  last_saved_at: string;
}

interface AutoSaveData {
  config: TemplateConfig;
  html: string;
  timestamp: string;
}

interface DynamicTemplateEditorProps {
  templateId: string;
  initialTemplate: Template;
  onTemplateUpdate?: (template: Template) => void;
}

const TemplatePreview = ({ templateHtml, certificateSize, zoom = 1 }: any) => {
  const dimensions = certificateSize === 'square' 
    ? { width: 800, height: 800 }
    : { width: 1000, height: 707 };
    
  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-auto p-4">
      <div
        className="bg-white dark:bg-slate-950 rounded-2xl shadow-2xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden transition-all duration-300 hover:shadow-3xl my-4"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "center center",
          width: dimensions.width,
          height: dimensions.height,
          minWidth: certificateSize === 'square' ? '300px' : '400px',
          minHeight: certificateSize === 'square' ? '300px' : '283px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        }}
        dangerouslySetInnerHTML={{ __html: templateHtml }}
      />
    </div>
  );
};

export function DynamicTemplateEditor({
  templateId,
  initialTemplate,
  onTemplateUpdate,
}: DynamicTemplateEditorProps) {
  const state = useTemplateState();
  const [template, setTemplate] = useState<Template>(initialTemplate);
  const [zoom, setZoom] = useState(1);
  // Removed activeTab state - only preview mode now
  const [showSidebar, setShowSidebar] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const templateHtml = useMemo(() => getTemplateHtml(state), [state]);

  useEffect(() => {
    if (initialTemplate.config) {
      const config = initialTemplate.config;
      state.setCertificateSize(config.certificateSize || 'landscape');
      state.setTitle(config.title || 'Certificado de Finalización');
      state.setBody1(config.body1 || '');
      state.setBody2(config.body2 || '');
      state.setOverlayColor(config.overlayColor || '#000000');
      state.setOrientation(config.orientation || 'landscape');
      state.setLogoUrl(config.logoUrl || '');
      state.setLogoWidth(config.logoWidth || 150);
      state.setLogoHeight(config.logoHeight || 150);
      state.setBackgroundUrl(config.backgroundUrl || null);
      state.setCourseName(config.courseName || '');
      state.setStudentName(config.studentName || '');
      if (state.setDirectorName) {
        state.setDirectorName(config.directorName || '');
      }
      if (state.setDate) {
        state.setDate(config.date || '');
      }
      if (state.setDateLocale) {
        state.setDateLocale(config.dateLocale || '');
      }
      state.setTitleColor(config.titleColor || '#1a1a1a');
      state.setBodyColor(config.bodyColor || '#666666');
      state.setCustomCss(config.customCss || '');
      state.setCustomJs(config.customJs || '');
      
      if (config.signatures) {
        state.setSignatures(config.signatures);
      }
    }
  }, [initialTemplate]);

  const handleSaveTemplate = async (templateData: SaveTemplateData): Promise<boolean> => {
    try {
      const data = await mockDatabase.saveTemplate(
        templateId,
        state,
        templateHtml,
        templateData.name,
        templateData.description
      );

      if (data.success) {
        const updatedTemplate = {
          ...template,
          name: templateData.name,
          description: templateData.description,
          config: state,
          html: templateHtml,
          version: data.version || template.version,
          last_saved_at: data.saved_at || template.last_saved_at,
        };
        setTemplate(updatedTemplate);
        
        if (onTemplateUpdate) {
          onTemplateUpdate(updatedTemplate);
        }
        
        toast.success("Plantilla guardada exitosamente!");
        return true;
      } else {
        toast.error("Error al guardar la plantilla");
        return false;
      }
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error("Error al guardar la plantilla");
      return false;
    }
  };

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 0.25, 0.25));
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
        {/* Animated Sidebar */}
        <aside
          className={`relative transition-all duration-500 ease-in-out transform bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-r border-slate-200/80 dark:border-slate-700/80 backdrop-blur-xl ${
            showSidebar ? "w-80 opacity-100 translate-x-0" : "w-0 opacity-0 -translate-x-full"
          } shadow-2xl shadow-slate-200/50 dark:shadow-slate-900/50`}
        >
          <div className="h-full flex flex-col">
            {/* Elegant Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                  <Layers className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                    Editor de Plantilla
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Personaliza tu certificado</p>
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setShowSidebar(false)}
                className="h-8 w-8 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Sidebar Content with Scroll */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="p-6">
                <TemplateSidebar 
                  state={{
                    certificateSize: state.certificateSize,
                    logoUrl: state.logoUrl,
                    logoWidth: state.logoWidth,
                    logoHeight: state.logoHeight,
                    title: state.title,
                    body1: state.body1,
                    body2: state.body2,
                    courseName: state.courseName,
                    studentName: state.studentName,
                    orientation: state.orientation,
                    backgroundUrl: state.backgroundUrl,
                    overlayColor: state.overlayColor,
                    titleColor: state.titleColor,
                    bodyColor: state.bodyColor,
                  }}
                  setters={{
                    setCertificateSize: state.setCertificateSize,
                    setLogoUrl: state.setLogoUrl,
                    setLogoWidth: state.setLogoWidth,
                    setLogoHeight: state.setLogoHeight,
                    setTitle: state.setTitle,
                    setBody1: state.setBody1,
                    setBody2: state.setBody2,
                    setCourseName: state.setCourseName,
                    setStudentName: state.setStudentName,
                    setOrientation: state.setOrientation,
                    setBackgroundUrl: state.setBackgroundUrl,
                    setOverlayColor: state.setOverlayColor,
                    setTitleColor: state.setTitleColor,
                    setBodyColor: state.setBodyColor,
                  }}
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex flex-col flex-1 min-w-0">
          {/* Modern Header with Actions */}
          <header className="h-16 flex items-center justify-between px-6 border-b border-slate-200/60 dark:border-slate-700/60 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-sm">
            <div className="flex items-center gap-4">
              {!showSidebar && (
                <Button
                  onClick={() => setShowSidebar(true)}
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="rounded-full px-3 py-1 text-xs font-medium">
                  {template.status === "draft" ? "Borrador" : template.status === "published" ? "Publicado" : "Archivado"}
                </Badge>
                <h1 className="text-sm font-semibold text-slate-900 dark:text-white truncate max-w-xs">
                  {template.name}
                </h1>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Removed Tab Switcher - only preview mode now */}

              {/* Zoom Controls */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleZoomOut}
                      disabled={zoom <= 0.25}
                      className="h-8 w-8 p-0 rounded-lg"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Alejar</TooltipContent>
                </Tooltip>
                
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400 min-w-[3rem] text-center">
                  {Math.round(zoom * 100)}%
                </span>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleZoomIn}
                      disabled={zoom >= 3}
                      className="h-8 w-8 p-0 rounded-lg"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Acercar</TooltipContent>
                </Tooltip>
              </div>

              {/* Action Buttons */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={toggleFullscreen}
                    className="h-9 w-9 p-0 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Pantalla Completa</TooltipContent>
              </Tooltip>

              <SaveTemplateModal
                templateConfig={state}
                templateHtml={templateHtml}
                onSave={handleSaveTemplate}
                initialName={template.name}
                initialDescription={template.description}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      className="h-9 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg transition-all duration-200"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Guardar
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Guardar Plantilla</TooltipContent>
                </Tooltip>
              </SaveTemplateModal>
            </div>
          </header>

          {/* Content Area - Preview Only */}
          <div className="flex-1 overflow-hidden relative">
            <TemplatePreview
              templateHtml={templateHtml}
              certificateSize={state.certificateSize}
              zoom={zoom}
            />
          </div>
        </main>

      </div>
    </TooltipProvider>
  );
}

export { TemplatePreview };