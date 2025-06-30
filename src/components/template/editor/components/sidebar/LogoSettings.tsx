
import React, { useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { ImageIcon, Lock, Unlock, Info } from "lucide-react";
import ImageUpload from "@/components/template/image-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

interface LogoSettingsProps {
    state: {
        logoUrl: string | null;
        logoWidth: number;
        logoHeight: number;
    };
    setters: {
        setLogoUrl: (url: string | null) => void;
        setLogoWidth: (width: number) => void;
        setLogoHeight: (height: number) => void;
    };
}

export const LogoSettings = ({ state, setters }: LogoSettingsProps) => {
    const [isLocked, setIsLocked] = React.useState(true);
    const aspectRatio = state.logoWidth / state.logoHeight;
    const prevLogoUrl = React.useRef<string | null>(null);
    
    // Efecto para mostrar notificación cuando se carga un logo
    useEffect(() => {
        if (state.logoUrl && state.logoUrl !== prevLogoUrl.current) {
            toast.success('Logo cargado correctamente');
            prevLogoUrl.current = state.logoUrl;
        }
    }, [state.logoUrl]);

    const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newWidth = parseInt(e.target.value, 10);
        setters.setLogoWidth(newWidth);
        if (isLocked && state.logoHeight > 0) {
            setters.setLogoHeight(Math.round(newWidth / aspectRatio));
        }
    };

    const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newHeight = parseInt(e.target.value, 10);
        setters.setLogoHeight(newHeight);
        if (isLocked && state.logoWidth > 0) {
            setters.setLogoWidth(Math.round(newHeight * aspectRatio));
        }
    };

    return (
        <Card className="overflow-hidden">
            <Accordion type="single" collapsible defaultValue="logo">
                <AccordionItem value="logo" className="border-b-0">
                    <AccordionTrigger className="p-4 hover:no-underline group">
                        <div className="flex items-center">
                            <div className="p-1.5 mr-2 rounded-md bg-primary/10 text-primary">
                                <ImageIcon className="h-4 w-4" />
                            </div>
                            <span className="font-medium">Configuración del Logo</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Label className="text-sm font-medium">Subir Logo</Label>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Info className="h-3.5 w-3.5 text-muted-foreground" />
                                            </TooltipTrigger>
                                            <TooltipContent className="max-w-[250px] text-xs">
                                                <p>Sube el logo que aparecerá en el certificado. Formatos soportados: JPG, PNG, SVG.</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                                <ImageUpload 
                                    onUpload={(url) => {
                                        setters.setLogoUrl(url);
                                        // Establecer un tamaño predeterminado al cargar una nueva imagen
                                        if (url && !state.logoUrl) {
                                            setters.setLogoWidth(120);
                                            setters.setLogoHeight(120);
                                        }
                                    }}
                                    label="Haz clic para subir o arrastra una imagen"
                                    className="w-full border-2 border-dashed hover:border-primary/50 transition-colors"
                                />
                                {state.logoUrl && (
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <div className="flex items-center">
                                            <CheckCircle2 className="h-3 w-3 mr-1.5 text-green-500 flex-shrink-0" />
                                            <span className="truncate max-w-[180px]">Logo cargado</span>
                                        </div>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-6 px-2 text-xs text-destructive hover:text-destructive"
                                            onClick={() => {
                                                setters.setLogoUrl(null);
                                                toast.info('Logo eliminado');
                                            }}
                                        >
                                            Eliminar
                                        </Button>
                                    </div>
                                )}
                            </div>
                            
                            <div className="space-y-4 pt-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Label className="text-sm font-medium">Mantener proporción</Label>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Info className="h-3.5 w-3.5 text-muted-foreground" />
                                                </TooltipTrigger>
                                                <TooltipContent className="max-w-[250px] text-xs">
                                                    <p>Cuando está activado, el ancho y alto se ajustarán automáticamente para mantener la proporción original de la imagen.</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="h-8 w-8 p-0"
                                        onClick={() => setIsLocked(!isLocked)}
                                        aria-label={isLocked ? "Desbloquear proporción" : "Bloquear proporción"}
                                    >
                                        {isLocked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
                                    </Button>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-sm font-medium">Ancho</Label>
                                            <span className="text-xs text-muted-foreground">px</span>
                                        </div>
                                        <div className="relative">
                                            <Input 
                                                type="number" 
                                                min="10" 
                                                max="1000"
                                                value={state.logoWidth}
                                                onChange={handleWidthChange}
                                                className="w-full bg-background pr-8"
                                                aria-label="Ancho del logo en píxeles"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-sm font-medium">Alto</Label>
                                            <span className="text-xs text-muted-foreground">px</span>
                                        </div>
                                        <Input 
                                            type="number" 
                                            min="10" 
                                            max="1000"
                                            value={state.logoHeight}
                                            onChange={handleHeightChange}
                                            className="w-full bg-background pr-8"
                                            aria-label="Alto del logo en píxeles"
                                        />
                                    </div>
                                </div>
                                
                                <div className="flex items-center justify-center gap-2 pt-2">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="text-xs h-8"
                                        onClick={() => {
                                            setters.setLogoWidth(100);
                                            setters.setLogoHeight(100);
                                            toast.success('Tamaño del logo restablecido');
                                        }}
                                    >
                                        Tamaño predeterminado
                                    </Button>
                                </div>
                            </div>
                        </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </Card>
    )
};
