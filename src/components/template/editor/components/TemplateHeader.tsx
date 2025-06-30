
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, FileDown, Wand2, Settings2, ZoomIn, ZoomOut, Maximize2, Minimize2 } from "lucide-react";
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

export const TemplateHeader = ({ templateConfig, templateHtml, onSave, showSidebar, onToggleSidebar, previewControls, activeTab, onTabChange, templateName, hasUnsavedChanges, lastSaved, autoSaving }: TemplateHeaderProps) => (
    <header className="border-b bg-background flex-shrink-0 shadow-sm">
        <div className="px-4 py-2 space-y-3">
            {/* Primera fila: Navegación, título y estado */}
            <div className="flex items-center justify-between">
                {/* Navegación y título */}
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <Button variant="ghost" size="sm" asChild className="flex-shrink-0">
                        <a href="/templates">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Volver
                        </a>
                    </Button>
                    
                    <Separator orientation="vertical" className="h-5" />
                    
                    {/* Título y estado */}
                    {templateName && (
                        <div className="flex items-center gap-3 min-w-0">
                            <h1 className="text-base font-semibold truncate">{templateName}</h1>
                            
                            {/* Estado con mejores indicadores */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                                {autoSaving && (
                                    <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                        Auto-guardando...
                                    </div>
                                )}
                                {hasUnsavedChanges && !autoSaving && (
                                    <div className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                                        <div className="w-2 h-2 bg-orange-500 rounded-full" />
                                        Cambios sin guardar
                                    </div>
                                )}
                                {lastSaved && !hasUnsavedChanges && !autoSaving && (
                                    <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                                        Guardado {lastSaved.toLocaleTimeString()}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Acciones principales */}
                <div className="flex items-center space-x-2 flex-shrink-0">
                    <SaveTemplateModal
                        templateConfig={templateConfig}
                        templateHtml={templateHtml || ""}
                        onSave={onSave}
                        initialName={templateName}
                    >
                        <Button 
                            variant={hasUnsavedChanges ? "default" : "outline"}
                            size="sm"
                            className={hasUnsavedChanges ? "bg-orange-600 hover:bg-orange-700" : ""}
                            data-save-trigger
                        >
                            <Save className="h-4 w-4 mr-2" />
                            {hasUnsavedChanges ? "Guardar cambios" : "Guardar"}
                        </Button>
                    </SaveTemplateModal>
                    
                    <Button size="sm" variant="outline">
                        <FileDown className="h-4 w-4 mr-2" />
                        Exportar
                    </Button>
                    
                    <Button variant="secondary" size="sm">
                        <Wand2 className="h-4 w-4 mr-2" />
                        IA
                    </Button>
                </div>
            </div>

            {/* Segunda fila: Vista y controles */}
            <div className="flex items-center justify-between">
                {/* Lado izquierdo: Configuración */}
                <div className="flex items-center space-x-3">
                    {onToggleSidebar && (
                        <Button 
                            size="sm" 
                            onClick={onToggleSidebar}
                            variant={showSidebar ? "default" : "outline"}
                            className="relative"
                        >
                            <Settings2 className="h-4 w-4 mr-2" />
                            {showSidebar ? "Ocultar panel" : "Configurar"}
                            {/* Indicadores de estado */}
                            {(templateConfig?.logoUrl || templateConfig?.backgroundUrl || templateConfig?.title !== "Certificado de Finalización") && (
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                            {hasUnsavedChanges && (
                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full" />
                            )}
                        </Button>
                    )}
                </div>

                {/* Centro: Tabs de vista */}
                <div className="flex items-center">
                    <Tabs value={activeTab || "preview"} onValueChange={onTabChange}>
                        <TabsList className="grid grid-cols-2 bg-muted/50">
                            <TabsTrigger value="preview" className="px-4 py-2 data-[state=active]:bg-background">
                                <Eye className="h-4 w-4 mr-2" />
                                Vista Previa
                            </TabsTrigger>
                            <TabsTrigger value="code" className="px-4 py-2 data-[state=active]:bg-background">
                                <FileText className="h-4 w-4 mr-2" />
                                Código HTML
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
                
                {/* Lado derecho: Controles de zoom */}
                <div className="flex items-center space-x-2">
                    {previewControls && activeTab === "preview" && (
                        <div className="flex items-center bg-muted/50 rounded-lg p-1 border">
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={previewControls.handleZoomOut}
                                className="h-7 w-7"
                                disabled={previewControls.fitTo !== 'auto'}
                                title="Alejar (Ctrl + -)"
                            >
                                <ZoomOut className="h-3 w-3" />
                            </Button>
                            
                            <Select 
                                value={previewControls.fitTo}
                                onValueChange={previewControls.setFitTo}
                            >
                                <SelectTrigger className="w-24 h-7 text-xs border-0 bg-transparent focus:ring-0">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-background border shadow-lg">
                                    <SelectItem value="width">
                                        <div className="flex items-center gap-2">
                                            <RectangleHorizontal className="h-3 w-3" />
                                            Al ancho
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="page">
                                        <div className="flex items-center gap-2">
                                            <Maximize className="h-3 w-3" />
                                            A la página
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="auto">
                                        <div className="flex items-center gap-2">
                                            <ZoomIn className="h-3 w-3" />
                                            {previewControls.zoomLevel}%
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={previewControls.handleZoomIn}
                                className="h-7 w-7"
                                disabled={previewControls.fitTo !== 'auto'}
                                title="Acercar (Ctrl + +)"
                            >
                                <ZoomIn className="h-3 w-3" />
                            </Button>
                            
                            <Separator orientation="vertical" className="h-4 mx-1" />
                            
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={previewControls.handleFullscreen}
                                className="h-7 w-7"
                                title={previewControls.isFullscreen ? 'Salir de pantalla completa (F11)' : 'Pantalla completa (F11)'}
                            >
                                {previewControls.isFullscreen ? (
                                    <Minimize2 className="h-3 w-3" />
                                ) : (
                                    <Maximize2 className="h-3 w-3" />
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </header>
);
