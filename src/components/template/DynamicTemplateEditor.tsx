"use client";

import { useState, useEffect, useRef } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Settings2, X } from "lucide-react";
import { toast } from "sonner";

import { useTemplateState } from "./editor/hooks/useTemplateState";
import { TemplateHeader } from "./editor/components/TemplateHeader";
import { TemplateSidebar } from "./editor/components/TemplateSidebar";
import { TemplatePreview, PreviewControls } from "./editor/components/TemplatePreview";
import { ConfigurationModal } from "./editor/components/ConfigurationModal";
import { SaveTemplateModal, SaveTemplateData } from "./editor/components/SaveTemplateModal";
import { getTemplateHtml } from "./editor/templates/defaultTemplate";
import { TemplateConfig } from "./editor/types";
import { createClient } from "@/lib/supabase/client";
import { mockDatabase } from "@/lib/mock-db";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  config: TemplateConfig;
  html: string;
  status: string;
  is_public: boolean;
  created_by: string;
  organization_id: string | null;
  auto_save_data: any;
  version: number;
  created_at: string;
  updated_at: string;
  last_saved_at: string;
}

interface DynamicTemplateEditorProps {
  templateId: string;
  initialTemplate: Template;
  onTemplateUpdate?: (template: Template) => void;
}

export function DynamicTemplateEditor({ 
  templateId, 
  initialTemplate, 
  onTemplateUpdate 
}: DynamicTemplateEditorProps) {
  const state = useTemplateState();
  const [template, setTemplate] = useState<Template>(initialTemplate);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date>(new Date(initialTemplate.last_saved_at));
  
  // Auto-save timer
  const autoSaveTimer = useRef<NodeJS.Timeout>();
  const AUTO_SAVE_INTERVAL = 30000; // 30 segundos

  // UI State
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState("preview");
  const [previewControls, setPreviewControls] = useState<PreviewControls | null>(null);

  // Inicializar el estado del editor con los datos de la plantilla
  useEffect(() => {
    if (initialTemplate.config) {
      // Aplicar la configuración de la plantilla al estado
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

    // Verificar si hay datos de auto-guardado más recientes
    if (initialTemplate.auto_save_data) {
      const autoSaveTime = new Date(initialTemplate.auto_save_data.timestamp);
      const lastSaveTime = new Date(initialTemplate.last_saved_at);
      
      if (autoSaveTime > lastSaveTime) {
        toast.info(
          "Auto-saved changes detected. Would you like to restore them?",
          {
            action: {
              label: "Restore",
              onClick: () => restoreAutoSavedData(initialTemplate.auto_save_data)
            },
            duration: 10000
          }
        );
      }
    }
  }, [initialTemplate]);

  // Generar HTML actualizado cuando cambia el estado
  const templateHtml = getTemplateHtml(state as TemplateConfig);

  // Detectar cambios y marcar como no guardado
  useEffect(() => {
    const currentConfig = state as TemplateConfig;
    const hasChanged = JSON.stringify(currentConfig) !== JSON.stringify(template.config);
    
    if (hasChanged) {
      setHasUnsavedChanges(true);
      scheduleAutoSave();
    }
  }, [state, template.config]);

  // Auto-save programado
  const scheduleAutoSave = () => {
    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
    }

    autoSaveTimer.current = setTimeout(() => {
      performAutoSave();
    }, AUTO_SAVE_INTERVAL);
  };

  // Realizar auto-guardado
  const performAutoSave = async () => {
    if (!hasUnsavedChanges || autoSaving) return;

    try {
      setAutoSaving(true);
      const data = await mockDatabase.autoSave(templateId, state as any, templateHtml);

      if (data.success) {
        setLastSaved(new Date());
        toast.success("Auto-saved", { duration: 2000 });
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
      toast.error("Auto-save failed", { duration: 3000 });
    } finally {
      setAutoSaving(false);
    }
  };

  // Restaurar datos auto-guardados
  const restoreAutoSavedData = (autoSaveData: any) => {
    if (autoSaveData.config) {
      const config = autoSaveData.config;
      // Aplicar configuración restaurada
      Object.keys(config).forEach(key => {
        const setterName = `set${key.charAt(0).toUpperCase() + key.slice(1)}` as keyof typeof state;
        const setter = state[setterName];
        if (typeof setter === 'function') {
          (setter as any)(config[key]);
        }
      });
      
      setHasUnsavedChanges(true);
      toast.success("Auto-saved changes restored");
    }
  };

  // Guardar cambios permanentes
  const handleSaveTemplate = async (templateData: SaveTemplateData): Promise<boolean> => {
    try {
      const data = await mockDatabase.saveTemplate(
        templateId,
        state as any,
        templateHtml,
        templateData.name,
        templateData.description
      );

      if (data.success) {
        // Actualizar el estado local
        const updatedTemplate = {
          ...template,
          name: templateData.name,
          description: templateData.description,
          config: state as TemplateConfig,
          html: templateHtml,
          version: data.version || template.version,
          last_saved_at: data.saved_at || template.last_saved_at
        };

        setTemplate(updatedTemplate);
        setHasUnsavedChanges(false);
        setLastSaved(new Date(data.saved_at || new Date().toISOString()));
        
        if (onTemplateUpdate) {
          onTemplateUpdate(updatedTemplate);
        }

        // Limpiar timer de auto-save
        if (autoSaveTimer.current) {
          clearTimeout(autoSaveTimer.current);
        }

        toast.success("Template saved successfully!");
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error("Failed to save template");
      return false;
    }
  };

  // Limpiar timer al desmontar
  useEffect(() => {
    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
    };
  }, []);

  // Manejar ESC para cerrar sidebar
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showSidebar) {
        setShowSidebar(false);
      }
      
      // Ctrl+S para guardar
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        if (hasUnsavedChanges) {
          // Abrir modal de guardado
          const saveButton = document.querySelector('[data-save-trigger]') as HTMLElement;
          saveButton?.click();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSidebar, hasUnsavedChanges]);

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-background">
        
        {/* Overlay cuando el sidebar está abierto */}
        {showSidebar && (
          <div 
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setShowSidebar(false)}
          />
        )}

        {/* Sidebar como drawer */}
        <aside className={`
          fixed top-0 left-0 h-full w-80 max-w-[90vw] bg-background border-r shadow-xl z-50
          transform transition-transform duration-300 ease-in-out
          ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="h-full flex flex-col">
            {/* Header del drawer */}
            <div className="p-3 border-b flex items-center justify-between bg-muted/50">
              <div className="flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold">Configuración</h2>
                {hasUnsavedChanges && (
                  <span className="h-2 w-2 bg-orange-500 rounded-full" title="Unsaved changes" />
                )}
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  ESC para cerrar
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowSidebar(false)}
                  className="h-6 w-6 p-0 hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Contenido del sidebar */}
            <div className="flex-1 overflow-y-auto">
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
                }}
                setters={{
                  setCertificateSize: state.setCertificateSize,
                  setLogoUrl: (url: string | null) => state.setLogoUrl(url || ''),
                  setLogoWidth: state.setLogoWidth,
                  setLogoHeight: state.setLogoHeight,
                  setTitle: state.setTitle,
                  setBody1: state.setBody1,
                  setBody2: state.setBody2,
                  setCourseName: state.setCourseName,
                  setStudentName: state.setStudentName,
                  setOrientation: state.setOrientation,
                  setBackgroundUrl: (url: string | null) => state.setBackgroundUrl(url || ''),
                  setOverlayColor: state.setOverlayColor,
                }}
              />
            </div>
            
            {/* Footer del drawer */}
            <div className="p-3 border-t bg-muted/50">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowSidebar(false)}
                  className="flex-1"
                >
                  Cerrar
                </Button>
                <ConfigurationModal 
                  state={state} 
                  setters={state} 
                  templateHtml={templateHtml}
                >
                  <Button variant="default" size="sm" className="flex-1">
                    Avanzado
                  </Button>
                </ConfigurationModal>
              </div>
            </div>
          </div>
        </aside>

        {/* Panel central */}
        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-shrink-0">
            <TemplateHeader 
              templateConfig={state}
              templateHtml={templateHtml}
              onSave={handleSaveTemplate}
              showSidebar={showSidebar}
              onToggleSidebar={() => setShowSidebar(!showSidebar)}
              previewControls={previewControls}
              activeTab={activeTab}
              onTabChange={(tab: string) => setActiveTab(tab)}
              templateName={template.name}
              hasUnsavedChanges={hasUnsavedChanges}
              lastSaved={lastSaved}
              autoSaving={autoSaving}
            />
          </div>

          <div className="flex-1 overflow-hidden">
            {activeTab === "preview" && (
              <TemplatePreview
                templateHtml={templateHtml}
                certificateSize={state.certificateSize}
                hideControls={true}
              />
            )}
            {activeTab === "code" && (
              <div className="h-full overflow-auto bg-background p-4">
                <pre className="bg-muted p-4 rounded-md overflow-auto h-full">
                  <code className="text-sm">
                    {templateHtml}
                  </code>
                </pre>
              </div>
            )}
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}