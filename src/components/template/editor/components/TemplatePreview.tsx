"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Settings2, 
  X, 
  Save, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2,
  Eye,
  Code2,
  Layers,
  Palette,
  Type,
  Image,
  Download
} from "lucide-react";
import { toast } from "sonner";

// Simple debounce implementation with cancel method
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
) => {
  let timeoutId: NodeJS.Timeout;
  
  const debouncedFunc = (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
  
  debouncedFunc.cancel = () => {
    clearTimeout(timeoutId);
  };
  
  return debouncedFunc;
};

import { useTemplateState } from "../hooks/useTemplateState";
import { TemplateHeader } from "./TemplateHeader";
import { TemplateSidebar } from "./TemplateSidebar";
import { ConfigurationModal } from "./ConfigurationModal";
import { getTemplateHtml } from "../templates/defaultTemplate";
import { TemplateConfig } from "../types";
import { mockDatabase } from "@/lib/mock-db";
import { SaveTemplateData } from "./SaveTemplateModal";

// Tipos mejorados con validación
interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  config: TemplateConfig;
  html: string;
  status: 'draft' | 'published' | 'archived';
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

interface PreviewControls {
  currentTab: "preview" | "code";
  onTabChange: (tab: "preview" | "code") => void;
  handleZoomOut: () => void;
  handleZoomIn: () => void;
  fitTo: string;
  setFitTo: (value: string) => void;
  zoom: number;
  zoomLevel: number;
  handleFullscreen: () => void;
  isFullscreen: boolean;
}

interface DynamicTemplateEditorProps {
  templateId: string;
  initialTemplate: Template;
  onTemplateUpdate?: (template: Template) => void;
}

// Constantes de configuración
const AUTO_SAVE_CONFIG = {
  INTERVAL: 30000, // 30 segundos
  DEBOUNCE_DELAY: 2000, // 2 segundos de debounce
  MAX_RETRIES: 3
} as const;

// Hook personalizado para manejo de auto-guardado
const useAutoSave = (
  templateId: string,
  hasUnsavedChanges: boolean,
  state: TemplateConfig,
  templateHtml: string
) => {
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const autoSaveTimer = useRef<NodeJS.Timeout>();
  const retryCount = useRef(0);

  const performAutoSave = useCallback(async () => {
    if (!hasUnsavedChanges || autoSaving) return;

    try {
      setAutoSaving(true);
      const data = await mockDatabase.autoSave(templateId, state, templateHtml);

      if (data.success) {
        setLastSaved(new Date());
        retryCount.current = 0;
        toast.success("Auto-guardado exitoso", { duration: 2000 });
      }
    } catch (error) {
      console.error('Auto-save failed:', error);
      retryCount.current++;
      
      if (retryCount.current < AUTO_SAVE_CONFIG.MAX_RETRIES) {
        setTimeout(performAutoSave, 5000);
        toast.warning(`Auto-guardado falló, reintentando... (${retryCount.current}/${AUTO_SAVE_CONFIG.MAX_RETRIES})`);
      } else {
        toast.error("Auto-guardado falló después de múltiples intentos");
        retryCount.current = 0;
      }
    } finally {
      setAutoSaving(false);
    }
  }, [templateId, hasUnsavedChanges, autoSaving, state, templateHtml]);

  const debouncedAutoSave = useMemo(
    () => debounce(performAutoSave, AUTO_SAVE_CONFIG.DEBOUNCE_DELAY),
    [performAutoSave]
  );

  const scheduleAutoSave = useCallback(() => {
    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
    }

    autoSaveTimer.current = setTimeout(() => {
      debouncedAutoSave();
    }, AUTO_SAVE_CONFIG.INTERVAL);
  }, [debouncedAutoSave]);

  useEffect(() => {
    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
      debouncedAutoSave.cancel();
    };
  }, [debouncedAutoSave]);

  return {
    autoSaving,
    lastSaved,
    scheduleAutoSave,
    performAutoSave: debouncedAutoSave
  };
};

// Hook para manejo de estado de la plantilla
const useTemplateManager = (initialTemplate: Template, onTemplateUpdate?: (template: Template) => void) => {
  const [template, setTemplate] = useState<Template>(initialTemplate);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const updateTemplate = useCallback((updates: Partial<Template>) => {
    setTemplate(prev => {
      const updated = { ...prev, ...updates };
      onTemplateUpdate?.(updated);
      return updated;
    });
  }, [onTemplateUpdate]);

  const markAsChanged = useCallback(() => {
    setHasUnsavedChanges(true);
  }, []);

  const markAsSaved = useCallback(() => {
    setHasUnsavedChanges(false);
  }, []);

  return {
    template,
    hasUnsavedChanges,
    setSaving: () => {}, // Placeholder
    updateTemplate,
    markAsChanged,
    markAsSaved
  };
};

// Hook para atajos de teclado
const useKeyboardShortcuts = (
  showSidebar: boolean,
  setShowSidebar: (show: boolean) => void,
  hasUnsavedChanges: boolean,
  onSave: () => void
) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isCtrlOrCmd = event.ctrlKey || event.metaKey;

      if (event.key === 'Escape' && showSidebar) {
        event.preventDefault();
        setShowSidebar(false);
        return;
      }

      if (isCtrlOrCmd) {
        switch (event.key.toLowerCase()) {
          case 's':
            event.preventDefault();
            if (hasUnsavedChanges) {
              onSave();
            }
            break;
          case 'b':
            event.preventDefault();
            setShowSidebar(!showSidebar);
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSidebar, setShowSidebar, hasUnsavedChanges, onSave]);
};

// Simple TemplatePreview component
interface TemplatePreviewProps {
  templateHtml: string;
  certificateSize: any;
  hideControls?: boolean;
  currentTab?: "preview" | "code";
  zoom?: number;
  onZoomChange?: (zoom: number) => void;
}

const TemplatePreview = ({ 
  templateHtml, 
  certificateSize, 
  hideControls = false,
  currentTab = "preview",
  zoom = 1,
  onZoomChange
}: TemplatePreviewProps) => {

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 relative">
      <div className="flex-1 overflow-auto p-2">
        {currentTab === "preview" ? (
          <div className="flex items-center justify-center min-h-full relative overflow-auto">
            {/* Controles de zoom flotantes */}
            {onZoomChange && (
              <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-slate-700 p-2 shadow-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onZoomChange(Math.max(0.25, zoom - 0.25))}
                  disabled={zoom <= 0.25}
                  className="h-8 w-8 p-0"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm text-foreground min-w-[50px] text-center font-mono">
                  {Math.round(zoom * 100)}%
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onZoomChange(Math.min(2, zoom + 0.25))}
                  disabled={zoom >= 2}
                  className="h-8 w-8 p-0"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <div className="h-4 w-px bg-slate-300 dark:bg-slate-600" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onZoomChange(1)}
                  className="h-8 w-8 p-0"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            <div 
              className="certificate-container bg-white shadow-2xl border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden transition-transform duration-200 my-4"
              style={{ 
                transform: `scale(${zoom})`,
                width: certificateSize === 'square' ? '800px' : '1000px',
                height: certificateSize === 'square' ? '800px' : '707px',
                minWidth: certificateSize === 'square' ? '300px' : '400px',
                minHeight: certificateSize === 'square' ? '300px' : '283px'
              }}
              dangerouslySetInnerHTML={{ __html: templateHtml }}
            />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <pre className="text-sm bg-slate-900 dark:bg-slate-950 text-slate-100 p-6 rounded-lg overflow-auto border border-slate-700 font-mono leading-relaxed">
              <code>{templateHtml}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente principal rediseñado
export function DynamicTemplateEditor({ 
  templateId, 
  initialTemplate, 
  onTemplateUpdate
}: DynamicTemplateEditorProps) {
  const state = useTemplateState();
  
  // Hooks personalizados
  const templateManager = useTemplateManager(initialTemplate, onTemplateUpdate);
  const { 
    template, 
    hasUnsavedChanges, 
    updateTemplate, 
    markAsChanged, 
    markAsSaved 
  } = templateManager;

  // Estados de UI
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [zoom, setZoom] = useState(1);
  const [activeSidebarTab, setActiveSidebarTab] = useState("design");

  // Generar HTML memoizado
  const templateHtml = useMemo(() => getTemplateHtml(state as TemplateConfig), [state]);

  // Auto-save
  const { autoSaving, scheduleAutoSave } = useAutoSave(
    templateId,
    hasUnsavedChanges,
    state as TemplateConfig,
    templateHtml
  );

  // Inicializar el estado del editor
  useEffect(() => {
    if (initialTemplate.config) {
      initializeEditorState(initialTemplate.config, state);
    }

    if (initialTemplate.auto_save_data) {
      checkAutoSavedData(initialTemplate);
    }
  }, [initialTemplate, state]);

  // Detectar cambios en el estado
  useEffect(() => {
    const currentConfig = state as TemplateConfig;
    const hasChanged = JSON.stringify(currentConfig) !== JSON.stringify(template.config);
    
    if (hasChanged && !hasUnsavedChanges) {
      markAsChanged();
      scheduleAutoSave();
    }
  }, [state, template.config, hasUnsavedChanges, markAsChanged, scheduleAutoSave]);

  const initializeEditorState = useCallback((config: TemplateConfig, editorState: any) => {
    Object.entries(config).forEach(([key, value]) => {
      const setter = editorState[`set${key.charAt(0).toUpperCase() + key.slice(1)}`];
      if (typeof setter === 'function') {
        setter(value);
      }
    });
  }, []);

  const checkAutoSavedData = useCallback((template: Template) => {
    if (!template.auto_save_data) return;

    const autoSaveTime = new Date(template.auto_save_data.timestamp);
    const lastSaveTime = new Date(template.last_saved_at);
    
    if (autoSaveTime > lastSaveTime) {
      toast.info(
        "Se detectaron cambios auto-guardados. ¿Deseas restaurarlos?",
        {
          action: {
            label: "Restaurar",
            onClick: () => restoreAutoSavedData(template.auto_save_data!)
          },
          duration: 10000
        }
      );
    }
  }, []);

  const restoreAutoSavedData = useCallback((autoSaveData: AutoSaveData) => {
    if (autoSaveData.config) {
      initializeEditorState(autoSaveData.config, state);
      markAsChanged();
      toast.success("Cambios auto-guardados restaurados");
    }
  }, [initializeEditorState, state, markAsChanged]);

  const handleSaveTemplate = useCallback(async (templateData: SaveTemplateData): Promise<boolean> => {
    try {
      const data = await mockDatabase.saveTemplate(
        templateId,
        state as TemplateConfig,
        templateHtml,
        templateData.name,
        templateData.description
      );

      if (data.success) {
        const updatedTemplate = {
          ...template,
          name: templateData.name,
          description: templateData.description,
          config: state as TemplateConfig,
          html: templateHtml,
          version: data.version || template.version,
          last_saved_at: data.saved_at || template.last_saved_at
        };

        updateTemplate(updatedTemplate);
        markAsSaved();
        
        toast.success("Plantilla guardada exitosamente!");
        return true;
      }

      throw new Error('Save operation failed');
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error("Error al guardar la plantilla");
      return false;
    }
  }, [templateId, state, templateHtml, template, updateTemplate, markAsSaved]);

  useKeyboardShortcuts(showSidebar, setShowSidebar, hasUnsavedChanges, () => {});

  // Sidebar tabs
  const sidebarTabs = [
    { id: "design", label: "Diseño", icon: Palette },
    { id: "content", label: "Contenido", icon: Type },
    { id: "media", label: "Media", icon: Image },
    { id: "layers", label: "Capas", icon: Layers },
  ];

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
        
        {/* Sidebar moderno */}
        <aside className={`
          flex flex-col bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 
          transition-all duration-300 ease-in-out z-50
          ${showSidebar ? 'w-80' : 'w-0 overflow-hidden'}
        `}>
          {/* Header del sidebar */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Settings2 className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-foreground">Editor</h2>
                <div className="flex items-center gap-2 mt-1">
                  {autoSaving && (
                    <div className="flex items-center gap-1">
                      <div className="animate-spin h-2 w-2 border border-blue-500 border-t-transparent rounded-full" />
                      <span className="text-xs text-blue-600">Guardando...</span>
                    </div>
                  )}
                  {hasUnsavedChanges && !autoSaving && (
                    <Badge variant="secondary" className="text-xs">
                      Sin guardar
                    </Badge>
                  )}
                  {!hasUnsavedChanges && !autoSaving && (
                    <Badge variant="outline" className="text-xs">
                      Guardado
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowSidebar(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Tabs del sidebar */}
          <div className="flex border-b border-slate-200 dark:border-slate-700">
            {sidebarTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSidebarTab(tab.id)}
                  className={`
                    flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors
                    ${activeSidebarTab === tab.id 
                      ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/50 border-b-2 border-blue-600 dark:border-blue-400' 
                      : 'text-muted-foreground hover:text-foreground'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
          
          {/* Contenido del sidebar */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
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
                  setTitleColor: state.setTitleColor,
                  setBodyColor: state.setBodyColor,
                }}
              />
            </div>
          </div>
        </aside>

        {/* Área principal */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Barra de herramientas verdaderamente unificada */}
          <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center h-12 px-4">
              {/* Grupo: Navegación y título */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                  asChild
                >
                  <a href="/templates">← Volver</a>
                </Button>
                
                <div className="h-4 w-px bg-slate-300 dark:bg-slate-600" />
                
                <h1 className="text-sm font-medium text-foreground truncate">
                  {template.name}
                </h1>
                
                {/* Estado compacto */}
                {autoSaving && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/50 rounded text-xs text-blue-700 dark:text-blue-300">
                    <div className="animate-spin h-2 w-2 border border-blue-500 border-t-transparent rounded-full" />
                    Guardando
                  </div>
                )}
                {hasUnsavedChanges && !autoSaving && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/50 rounded text-xs text-orange-700 dark:text-orange-300">
                    <div className="h-1.5 w-1.5 bg-orange-500 rounded-full" />
                    Sin guardar
                  </div>
                )}
              </div>

              {/* Barra central de acciones - Todo en una línea */}
              <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
                {/* Guardar button removed - now handled by TemplateHeader */}
                
                {/* IA */}
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 px-3 text-xs gap-1.5 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                >
                  <div className="h-3.5 w-3.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-sm" />
                  IA
                </Button>
                
                {/* Configurar */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="h-8 px-3 text-xs gap-1.5 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                >
                  <Settings2 className="h-3.5 w-3.5" />
                  Configurar
                </Button>
                
                <div className="h-4 w-px bg-slate-300 dark:bg-slate-600" />
                
                {/* Vista Previa / Código */}
                <Button
                  variant={activeTab === "preview" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("preview")}
                  className={`h-8 px-3 text-xs gap-1.5 ${
                    activeTab === "preview" 
                      ? "bg-blue-600 text-white hover:bg-blue-700" 
                      : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" />
                  Vista Previa
                </Button>
                
                <Button
                  variant={activeTab === "code" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("code")}
                  className={`h-8 px-3 text-xs gap-1.5 ${
                    activeTab === "code" 
                      ? "bg-blue-600 text-white hover:bg-blue-700" 
                      : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                  }`}
                >
                  <Code2 className="h-3.5 w-3.5" />
                  Código HTML
                </Button>
              </div>
              
              {/* Acciones del lado derecho */}
              <div className="flex items-center gap-2">
                {/* Espacio reservado para futuras acciones */}
              </div>
            </div>
          </header>

          {/* Área de preview */}
          <div className="flex-1 overflow-hidden">
            <TemplatePreview
              templateHtml={templateHtml}
              certificateSize={state.certificateSize}
              hideControls={true}
              currentTab={activeTab}
              zoom={zoom}
              onZoomChange={setZoom}
            />
          </div>
        </main>

        {/* Save modal is now handled by TemplateHeader */}
      </div>
    </TooltipProvider>
  );
}

// Export the components and types
export { TemplatePreview };
export type { PreviewControls };