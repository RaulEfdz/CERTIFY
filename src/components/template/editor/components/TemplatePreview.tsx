
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Maximize2, Minimize2, ZoomIn, ZoomOut, Minus, Maximize } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface TemplatePreviewProps {
    templateHtml: string;
    certificateSize: 'landscape' | 'square';
    hideControls?: boolean;
    onControlsChange?: (controls: PreviewControls) => void;
}

export interface PreviewControls {
    zoomLevel: number;
    fitTo: 'width' | 'page' | 'auto';
    isFullscreen: boolean;
    handleZoomIn: () => void;
    handleZoomOut: () => void;
    handleFullscreen: () => void;
    setFitTo: (value: 'width' | 'page' | 'auto') => void;
}

export const TemplatePreview = ({ templateHtml, certificateSize, hideControls = false, onControlsChange }: TemplatePreviewProps) => {
    const [isPreviewFullscreen, setIsPreviewFullscreen] = useState<boolean>(false);
    const [zoomLevel, setZoomLevel] = useState<number>(100);
    const [fitTo, setFitTo] = useState<'width' | 'page' | 'auto'>('width');
    const previewContainerRef = useRef<HTMLDivElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Ajustar el zoom según la opción seleccionada
    useEffect(() => {
        if (!previewContainerRef.current || !iframeRef.current) return;
        
        const container = previewContainerRef.current;
        const iframe = iframeRef.current;
        
        const updateZoom = () => {
            if (!container || !iframe) return;
            
            const containerRect = container.getBoundingClientRect();
            const containerAspect = containerRect.width / containerRect.height;
            const targetAspect = certificateSize === 'landscape' ? 4/3 : 1;
            
            let scale = 1;
            
            if (fitTo === 'width') {
                // Ajustar al ancho del contenedor
                scale = (containerRect.width * 0.8) / (certificateSize === 'landscape' ? 800 : 600);
            } else if (fitTo === 'page') {
                // Ajustar a la página (manteniendo la relación de aspecto)
                if (containerAspect > targetAspect) {
                    // Contenedor más ancho que el certificado
                    scale = (containerRect.height * 0.8) / 600;
                } else {
                    // Contenedor más alto que el certificado
                    scale = (containerRect.width * 0.8) / (certificateSize === 'landscape' ? 800 : 600);
                }
            } else {
                // Zoom personalizado
                scale = zoomLevel / 100;
            }
            
            // Aplicar la escala al contenedor del iframe
            const iframeContainer = iframe.parentElement;
            if (iframeContainer) {
                iframeContainer.style.transform = `scale(${scale})`;
                iframeContainer.style.transformOrigin = 'center center';
                iframeContainer.style.width = certificateSize === 'landscape' ? '1200px' : '900px';
                iframeContainer.style.height = '900px';
                iframe.style.transform = 'none';
            }
        };
        
        updateZoom();
        
        const resizeObserver = new ResizeObserver(updateZoom);
        resizeObserver.observe(container);
        
        // Forzar un reflow para asegurar que los estilos se apliquen correctamente
        if (iframe.contentDocument) {
            iframe.contentDocument.body.style.overflow = 'hidden';
        }
        
        return () => {
            resizeObserver.disconnect();
        };
    }, [zoomLevel, fitTo, certificateSize]);
    
    const handleZoomIn = () => {
        setZoomLevel(prev => Math.min(prev + 10, 200));
        setFitTo('auto');
    };
    
    const handleZoomOut = () => {
        setZoomLevel(prev => Math.max(prev - 10, 30));
        setFitTo('auto');
    };
    
    const handleFitToWidth = () => {
        setFitTo('width');
    };
    
    const handleFitToPage = () => {
        setFitTo('page');
    };
    
    const handleFullscreen = () => {
        const element = document.documentElement;
        
        if (!document.fullscreenElement) {
            if (element.requestFullscreen) {
                element.requestFullscreen();
            }
            setIsPreviewFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            setIsPreviewFullscreen(false);
        }
    };

    // Exposer los controles al componente padre si se requiere
    useEffect(() => {
        if (onControlsChange) {
            onControlsChange({
                zoomLevel,
                fitTo,
                isFullscreen: isPreviewFullscreen,
                handleZoomIn,
                handleZoomOut,
                handleFullscreen,
                setFitTo: (value: 'width' | 'page' | 'auto') => {
                    setFitTo(value);
                    if (value === 'auto') {
                        toast.success('Modo zoom manual activado');
                    }
                }
            });
        }
    }, [zoomLevel, fitTo, isPreviewFullscreen, onControlsChange]);

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-muted/30 min-w-0">
            {!hideControls && (
                <div className="border-b bg-background p-2 flex justify-between items-center shadow-sm">
                    <Tabs defaultValue="preview" className="w-full">
                        <div className="flex justify-between items-center w-full">
                            <TabsList>
                                <TabsTrigger value="preview" className="px-4">
                                    Vista Previa
                                </TabsTrigger>
                                <TabsTrigger value="code" className="px-4">
                                    Código HTML
                                </TabsTrigger>
                            </TabsList>
                            
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 bg-muted/80 rounded-md p-1 border">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={handleZoomOut}
                                                    className="h-8 w-8"
                                                    disabled={fitTo !== 'auto'}
                                                >
                                                    <ZoomOut className="h-4 w-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Alejar (Ctrl + -)</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    
                                    <Select 
                                        value={fitTo}
                                        onValueChange={(value) => {
                                            setFitTo(value as 'width' | 'page' | 'auto');
                                            if (value === 'auto') {
                                                toast.success('Modo zoom manual activado');
                                            }
                                        }}
                                    >
                                        <SelectTrigger className="w-32 h-8 text-xs">
                                            <SelectValue placeholder="Ajustar a..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-background">
                                            <SelectItem value="width">Ajustar al ancho</SelectItem>
                                            <SelectItem value="page">Ajustar a la página</SelectItem>
                                            <SelectItem value="auto">Zoom personalizado ({zoomLevel}%)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={handleZoomIn}
                                                    className="h-8 w-8"
                                                    disabled={fitTo !== 'auto'}
                                                >
                                                    <ZoomIn className="h-4 w-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Acercar (Ctrl + +)</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={handleFullscreen}
                                                className="h-8 w-8"
                                            >
                                                {isPreviewFullscreen ? (
                                                    <Minimize2 className="h-4 w-4" />
                                                ) : (
                                                    <Maximize2 className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            {isPreviewFullscreen ? 'Salir de pantalla completa (F11)' : 'Pantalla completa (F11)'}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                    </Tabs>
                </div>
            )}
            
            {/* Vista previa del certificado - siempre visible */}
            <div className="flex-1 overflow-hidden">
                <div
                    ref={previewContainerRef}
                    className={cn(
                        'h-full overflow-auto bg-gradient-to-br from-muted/20 to-muted/30 p-4',
                        isPreviewFullscreen ? 'fixed inset-0 z-50 bg-background' : '',
                        'flex items-center justify-center',
                        'min-w-0'
                    )}
                >
                    <div className="relative w-full h-full flex items-center justify-center min-w-0">
                        <div
                            className={cn(
                                'bg-white shadow-xl rounded-lg overflow-hidden border border-border/50',
                                'transition-transform duration-200',
                                'flex items-center justify-center',
                                'origin-center',
                                {
                                    'aspect-[4/3]': certificateSize === 'landscape',
                                    'aspect-square': certificateSize === 'square',
                                }
                            )}
                            style={{
                                width: certificateSize === 'landscape' ? '800px' : '600px',
                                height: '600px',
                                maxWidth: '90%',
                                maxHeight: '70vh',
                                transform: 'none',
                                transformOrigin: 'center center'
                            }}
                        >
                            <iframe
                                ref={iframeRef}
                                srcDoc={templateHtml}
                                className="border-0 w-full h-full rounded-lg"
                                title="Vista Previa del Certificado"
                                sandbox="allow-same-origin allow-scripts"
                                style={{
                                    backgroundColor: 'white'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
