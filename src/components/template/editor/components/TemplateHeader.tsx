import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  ArrowLeft, 
  Save, 
  Settings2, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2, 
  Sidebar,
  Clock,
  CheckCircle2,
  Loader2,
  Sparkles
} from "lucide-react";
import { SaveTemplateModal, SaveTemplateData } from "./SaveTemplateModal";
import { ConfigurationModal } from "./ConfigurationModal";
import { ExportDropdown } from "./ExportDropdown";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { PreviewControls } from "./TemplatePreview";
import { useMemo, useCallback } from "react";

interface TemplateHeaderProps {
  templateConfig?: any;
  templateHtml?: string;
  onSave?: (data: SaveTemplateData) => Promise<boolean>;
  showSidebar?: boolean;
  onToggleSidebar?: () => void;
  previewControls?: PreviewControls | null;
  templateName?: string;
  hasUnsavedChanges?: boolean;
  lastSaved?: Date;
  autoSaving?: boolean;
  certificateSize?: 'landscape' | 'square';
}

// Removed TABS - only preview mode now

const ZOOM_OPTIONS = [
  { value: "width", label: "Ajustar ancho" },
  { value: "height", label: "Ajustar alto" },
  { value: "auto", label: "Zoom manual" }
] as const;

export const TemplateHeader = ({
  templateConfig,
  templateHtml = '',
  onSave,
  showSidebar = false,
  onToggleSidebar,
  previewControls,
  templateName,
  hasUnsavedChanges = false,
  lastSaved,
  autoSaving = false,
  certificateSize = 'landscape'
}: TemplateHeaderProps) => {
  
  // Memoized time formatting for better performance
  const lastSavedText = useMemo(() => {
    if (!lastSaved) return '';
    
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - lastSaved.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Guardado hace unos segundos';
    if (diffInMinutes === 1) return 'Guardado hace 1 minuto';
    if (diffInMinutes < 60) return `Guardado hace ${diffInMinutes} minutos`;
    
    return `Guardado ${lastSaved.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`;
  }, [lastSaved]);

  // Status badge component with enhanced styling
  const StatusBadge = useCallback(() => {
    if (autoSaving) {
      return (
        <Badge className="gap-2 text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-lg animate-pulse">
          <Loader2 className="h-3 w-3 animate-spin" />
          Guardando...
        </Badge>
      );
    }
    
    if (hasUnsavedChanges) {
      return (
        <Badge className="gap-2 text-xs bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 shadow-md">
          <Clock className="h-3 w-3" />
          Sin guardar
        </Badge>
      );
    }
    
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className="gap-2 text-xs bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 shadow-md">
            <CheckCircle2 className="h-3 w-3" />
            Guardado
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-slate-900 text-white border-slate-700">
          {lastSavedText}
        </TooltipContent>
      </Tooltip>
    );
  }, [autoSaving, hasUnsavedChanges, lastSavedText]);

  // Navigation section with enhanced styling
  const NavigationSection = () => (
    <div className="flex items-center gap-3">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            asChild 
            className="h-9 w-9 p-0 rounded-xl hover:bg-gradient-to-br hover:from-slate-100 hover:to-slate-200 hover:shadow-md transition-all duration-200 group"
          >
            <a href="/templates" aria-label="Volver a plantillas">
              <ArrowLeft className="h-4 w-4 text-slate-600 group-hover:text-slate-800 transition-colors" />
            </a>
          </Button>
        </TooltipTrigger>
        <TooltipContent className="bg-slate-900 text-white border-slate-700">
          Volver a plantillas
        </TooltipContent>
      </Tooltip>
      
      <div className="h-6 w-px bg-gradient-to-b from-slate-200 via-slate-300 to-slate-200"></div>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggleSidebar}
            className={`h-9 w-9 p-0 rounded-xl transition-all duration-200 group ${
              showSidebar 
                ? 'bg-gradient-to-br from-blue-50 to-indigo-100 shadow-md text-blue-700' 
                : 'hover:bg-gradient-to-br hover:from-slate-100 hover:to-slate-200 hover:shadow-md text-slate-600'
            }`}
            aria-label={showSidebar ? 'Ocultar panel lateral' : 'Mostrar panel lateral'}
          >
            <Sidebar className="h-4 w-4 transition-colors" />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="bg-slate-900 text-white border-slate-700">
          {showSidebar ? 'Ocultar panel' : 'Mostrar panel'}
        </TooltipContent>
      </Tooltip>
    </div>
  );

  // Title section with enhanced typography
  const TitleSection = () => (
    <div className="flex-1 flex items-center gap-4 min-w-0">
      {templateName && (
        <>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-500" />
            <h1 className="text-sm font-bold truncate bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent max-w-64">
              {templateName}
            </h1>
          </div>
          <StatusBadge />
        </>
      )}
    </div>
  );

  // Enhanced zoom controls
  const ZoomControls = () => {
    if (!previewControls) return null;

    return (
      <div className="flex items-center gap-1 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-1.5 border border-slate-200 shadow-sm">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={previewControls.handleZoomOut}
              className="h-7 w-7 p-0 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-150"
              disabled={previewControls.fitTo !== 'auto'}
              aria-label="Alejar zoom"
            >
              <ZoomOut className="h-3.5 w-3.5 text-slate-600" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-slate-900 text-white border-slate-700">
            Alejar (Ctrl + -)
          </TooltipContent>
        </Tooltip>
        
        <Select 
          value={previewControls.fitTo}
          onValueChange={previewControls.setFitTo}
        >
          <SelectTrigger className="w-28 h-7 text-xs border-0 bg-white/80 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500/20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="min-w-36 bg-white/95 backdrop-blur border-slate-200 shadow-xl">
            {ZOOM_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value} className="hover:bg-slate-50">
                {option.value === 'auto' ? (
                  <div className="flex items-center gap-2">
                    <ZoomIn className="h-3 w-3 text-indigo-500" />
                    <span className="font-medium">{Math.round(previewControls.zoomLevel)}%</span>
                  </div>
                ) : (
                  option.label
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={previewControls.handleZoomIn}
              className="h-7 w-7 p-0 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-150"
              disabled={previewControls.fitTo !== 'auto'}
              aria-label="Acercar zoom"
            >
              <ZoomIn className="h-3.5 w-3.5 text-slate-600" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-slate-900 text-white border-slate-700">
            Acercar (Ctrl + +)
          </TooltipContent>
        </Tooltip>
        
        <div className="h-5 w-px bg-gradient-to-b from-slate-200 via-slate-300 to-slate-200 mx-1"></div>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={previewControls.handleFullscreen}
              className="h-7 w-7 p-0 rounded-lg hover:bg-white hover:shadow-sm transition-all duration-150"
              aria-label={previewControls.isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            >
              {previewControls.isFullscreen ? 
                <Minimize2 className="h-3.5 w-3.5 text-slate-600" /> : 
                <Maximize2 className="h-3.5 w-3.5 text-slate-600" />
              }
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-slate-900 text-white border-slate-700">
            {previewControls.isFullscreen ? 'Salir pantalla completa (F11)' : 'Pantalla completa (F11)'}
          </TooltipContent>
        </Tooltip>
      </div>
    );
  };

  // Enhanced actions section
  const ActionsSection = () => (
    <div className="flex items-center gap-3">
      {/* Removed View Tabs - only preview mode now *}

      <ZoomControls />

      {previewControls && (
        <div className="h-6 w-px bg-gradient-to-b from-slate-200 via-slate-300 to-slate-200"></div>
      )}

      {/* Enhanced Primary Actions */}
      <div className="flex items-center gap-2 z-0">
        <ConfigurationModal 
          state={templateConfig} 
          setters={templateConfig} 
          templateHtml={templateHtml}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 px-4 rounded-xl border-slate-300 bg-gradient-to-b from-white to-slate-50 hover:from-slate-50 hover:to-slate-100 hover:shadow-md transition-all duration-200 text-slate-700 font-medium"
              >
                <Settings2 className="h-3.5 w-3.5 mr-2" />
                Config
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-slate-900 text-white border-slate-700">
              Configuración avanzada
            </TooltipContent>
          </Tooltip>
        </ConfigurationModal>

        

        <ExportDropdown
          templateHtml={templateHtml}
          certificateSize={certificateSize}
          templateName={templateName}
          buttonVariant="outline"
          buttonSize="sm"
          className="h-9 px-4 rounded-xl border-slate-300 bg-gradient-to-b from-white to-slate-50 hover:from-slate-50 hover:to-slate-100 hover:shadow-md transition-all duration-200 text-slate-700 font-medium"
        />

        <SaveTemplateModal 
          templateConfig={templateConfig}
          templateHtml={templateHtml} 
          onSave={onSave}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                size="sm" 
                className={`h-9 px-4 rounded-xl font-semibold transition-all duration-200 ${
                  hasUnsavedChanges 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25 text-white' 
                    : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-md shadow-blue-500/20 text-white'
                }`}
                disabled={autoSaving}
              >
                <Save className="h-3.5 w-3.5 mr-2" />
                Guardar
              </Button>
            </TooltipTrigger>

            <TooltipContent className="bg-slate-900 text-white border-slate-700">
              Guardar plantilla (Ctrl + S)
            </TooltipContent>
          </Tooltip>
        </SaveTemplateModal>
      </div>
    </div>
  );

  return (
    <TooltipProvider delayDuration={300}>
      <header className="border-b border-slate-200/60 bg-gradient-to-b from-white via-slate-50/50 to-white backdrop-blur-xl supports-[backdrop-filter]:bg-white/90 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center h-16 px-6 gap-6 max-w-full">
          <NavigationSection />
          <TitleSection />
          <ActionsSection />
        </div>
        {/* Subtle gradient line at bottom */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-300/50 to-transparent"></div>
      </header>
    </TooltipProvider>
  );
};