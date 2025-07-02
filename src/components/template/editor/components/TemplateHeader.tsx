
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  ArrowLeft, 
  Save, 
  FileDown, 
  Wand2, 
  Settings2, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2, 
  Eye, 
  FileText, 
  RectangleHorizontal, 
  Maximize,
  Sidebar,
  Clock,
  CheckCircle2,
  Loader2,
  MoreHorizontal
} from "lucide-react";
import { SaveTemplateModal, SaveTemplateData } from "./SaveTemplateModal";
import { ConfigurationModal } from "./ConfigurationModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { PreviewControls } from "./TemplatePreview";

interface TemplateHeaderProps {
  templateConfig?: any;
  templateHtml?: string;
  onSave?: (data: SaveTemplateData) => Promise<boolean>;
  showSidebar?: boolean;
  onToggleSidebar?: () => void;
  previewControls?: PreviewControls | null;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  templateName?: string;
  hasUnsavedChanges?: boolean;
  lastSaved?: Date;
  autoSaving?: boolean;
}

export const TemplateHeader = ({ templateConfig, templateHtml, onSave, showSidebar, onToggleSidebar, previewControls, activeTab, onTabChange, templateName, hasUnsavedChanges, lastSaved, autoSaving }: TemplateHeaderProps) => {
  const formatLastSaved = (date?: Date) => {
    if (!date) return '';
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Guardado hace unos segundos';
    if (diffInMinutes === 1) return 'Guardado hace 1 minuto';
    if (diffInMinutes < 60) return `Guardado hace ${diffInMinutes} minutos`;
    
    return `Guardado ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <TooltipProvider>
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        {/* Main Header Bar */}
        <div className="flex items-center h-14 px-4 gap-4">
          {/* Left Section - Navigation */}
          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
                  <a href="/templates">
                    <ArrowLeft className="h-4 w-4" />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Volver a plantillas</TooltipContent>
            </Tooltip>
            
            <Separator orientation="vertical" className="h-4" />
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onToggleSidebar}
                  className={`h-8 w-8 p-0 ${showSidebar ? 'bg-accent' : ''}`}
                >
                  <Sidebar className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {showSidebar ? 'Ocultar panel' : 'Mostrar panel'}
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Center Section - Title and Status */}
          <div className="flex-1 flex items-center gap-3 min-w-0">
            {templateName && (
              <>
                <h1 className="text-sm font-semibold truncate text-foreground/90">
                  {templateName}
                </h1>
                
                {/* Status Indicator */}
                <div className="flex items-center gap-2">
                  {autoSaving ? (
                    <Badge variant="secondary" className="gap-1 text-xs">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Guardando...
                    </Badge>
                  ) : hasUnsavedChanges ? (
                    <Badge variant="outline" className="gap-1 text-xs border-amber-200 text-amber-700">
                      <Clock className="h-3 w-3" />
                      Sin guardar
                    </Badge>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge variant="secondary" className="gap-1 text-xs">
                          <CheckCircle2 className="h-3 w-3" />
                          Guardado
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        {formatLastSaved(lastSaved)}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <Tabs value={activeTab} onValueChange={onTabChange} className="w-auto">
              <TabsList className="grid w-full grid-cols-2 h-8">
                <TabsTrigger value="preview" className="text-xs h-6 px-3">
                  <Eye className="h-3 w-3 mr-1" />
                  Vista
                </TabsTrigger>
                <TabsTrigger value="code" className="text-xs h-6 px-3">
                  <FileText className="h-3 w-3 mr-1" />
                  Código
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Separator orientation="vertical" className="h-4" />

            {/* Zoom Controls - Only show in preview mode */}
            {activeTab === "preview" && previewControls && (
              <div className="flex items-center gap-1 bg-muted/40 rounded-md p-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={previewControls.handleZoomOut}
                      className="h-6 w-6 p-0"
                      disabled={previewControls.fitTo !== 'auto'}
                    >
                      <ZoomOut className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Alejar (Ctrl + -)</TooltipContent>
                </Tooltip>
                
                <Select 
                  value={previewControls.fitTo}
                  onValueChange={previewControls.setFitTo}
                >
                  <SelectTrigger className="w-20 h-6 text-xs border-0 bg-transparent focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="min-w-28">
                    <SelectItem value="width">Ajustar ancho</SelectItem>
                    <SelectItem value="height">Ajustar alto</SelectItem>
                    <SelectItem value="auto">
                      <div className="flex items-center gap-2">
                        <ZoomIn className="h-3 w-3" />
                        {Math.round(previewControls.zoomLevel)}%
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={previewControls.handleZoomIn}
                      className="h-6 w-6 p-0"
                      disabled={previewControls.fitTo !== 'auto'}
                    >
                      <ZoomIn className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Acercar (Ctrl + +)</TooltipContent>
                </Tooltip>
                
                <Separator orientation="vertical" className="h-4 mx-1" />
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={previewControls.handleFullscreen}
                      className="h-6 w-6 p-0"
                    >
                      {previewControls.isFullscreen ? 
                        <Minimize2 className="h-3 w-3" /> : 
                        <Maximize2 className="h-3 w-3" />
                      }
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {previewControls.isFullscreen ? 'Salir pantalla completa (F11)' : 'Pantalla completa (F11)'}
                  </TooltipContent>
                </Tooltip>
              </div>
            )}

            <Separator orientation="vertical" className="h-4" />

            {/* Primary Actions */}
            <div className="flex items-center gap-2">
              <ConfigurationModal 
                state={templateConfig} 
                setters={templateConfig} 
                templateHtml={templateHtml || ''}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 px-3">
                      <Settings2 className="h-3 w-3 mr-1" />
                      Config
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Configuración avanzada</TooltipContent>
                </Tooltip>
              </ConfigurationModal>

              <SaveTemplateModal 
                templateConfig={templateConfig}
                templateHtml={templateHtml || ''} 
                onSave={onSave}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      size="sm" 
                      className={`h-8 px-3 ${hasUnsavedChanges ? 'bg-primary hover:bg-primary/90' : ''}`}
                    >
                      <Save className="h-3 w-3 mr-1" />
                      Guardar
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Guardar plantilla (Ctrl + S)</TooltipContent>
                </Tooltip>
              </SaveTemplateModal>
            </div>
          </div>
        </div>
      </header>
    </TooltipProvider>
  );
};
