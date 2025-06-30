
import { Card } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { ImagePlus, X, RectangleHorizontal, Square } from "lucide-react";
import { FormField } from "../FormField";
import ImageUpload from "@/components/template/image-upload";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { SegmentedControl } from "@/components/ui/segmented-control";

interface BackgroundSettingsProps {
    state: {
        orientation: string;
        backgroundUrl: string | null;
        overlayColor: string;
    };
    setters: {
        setOrientation: (value: string) => void;
        setBackgroundUrl: (url: string | null) => void;
        setOverlayColor: (color: string) => void;
    };
}

export const BackgroundSettings = ({ state, setters }: BackgroundSettingsProps) => (
    <Card>
        <Accordion type="single" collapsible>
            <AccordionItem value="background" className="border-b-0">
                <AccordionTrigger className="p-4 hover:no-underline">
                    <div className="flex items-center">
                        <ImagePlus className="h-4 w-4 mr-2" />
                        <span>Fondo</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-0">
                    <div className="space-y-4">
                        <FormField label="Orientación">
                            <SegmentedControl
                                options={[
                                    { 
                                        value: "landscape", 
                                        label: "Horizontal", 
                                        icon: <RectangleHorizontal className="h-4 w-4" /> 
                                    },
                                    { 
                                        value: "square", 
                                        label: "Cuadrado", 
                                        icon: <Square className="h-4 w-4" /> 
                                    },
                                ]}
                                value={state.orientation}
                                onChange={setters.setOrientation}
                                className="w-full"
                            />
                        </FormField>

                        <FormField label="Imagen de Fondo">
                            <ImageUpload 
                                onUpload={setters.setBackgroundUrl}
                                label="Subir imagen de fondo"
                                className="w-full bg-muted text-foreground"
                            />
                            {state.backgroundUrl && (
                                <div className="mt-2 text-xs text-muted-foreground flex items-center">
                                    <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                                    <span>Fondo cargado</span>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-6 ml-auto"
                                        onClick={() => setters.setBackgroundUrl(null)}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            )}
                        </FormField>
                        
                        <FormField 
                            label="Color del Contenedor" 
                            description="Controla el color y transparencia del área principal del certificado"
                        >
                            <div className="space-y-3">
                                {/* Selector de color + transparencia */}
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="color" 
                                        value={(() => {
                                            // Extraer color de RGBA o usar el valor directo
                                            if (state.overlayColor.startsWith('rgba')) {
                                                const match = state.overlayColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+),/);
                                                if (match) {
                                                    const r = parseInt(match[1]).toString(16).padStart(2, '0');
                                                    const g = parseInt(match[2]).toString(16).padStart(2, '0');
                                                    const b = parseInt(match[3]).toString(16).padStart(2, '0');
                                                    return `#${r}${g}${b}`;
                                                }
                                            }
                                            return state.overlayColor.startsWith('#') ? state.overlayColor : '#ffffff';
                                        })()} 
                                        onChange={(e) => {
                                            const hex = e.target.value;
                                            // Convertir hex a rgba manteniendo la transparencia actual
                                            const r = parseInt(hex.slice(1, 3), 16);
                                            const g = parseInt(hex.slice(3, 5), 16);
                                            const b = parseInt(hex.slice(5, 7), 16);
                                            
                                            // Extraer alpha actual o usar 0.95 por defecto
                                            let alpha = 0.95;
                                            if (state.overlayColor.startsWith('rgba')) {
                                                const match = state.overlayColor.match(/rgba\([^,]+,[^,]+,[^,]+,\s*([^)]+)\)/);
                                                if (match) alpha = parseFloat(match[1]);
                                            }
                                            
                                            setters.setOverlayColor(`rgba(${r}, ${g}, ${b}, ${alpha})`);
                                        }}
                                        className="h-10 w-10 rounded border bg-muted text-foreground"
                                    />
                                    
                                    {/* Slider de transparencia */}
                                    <div className="flex-1">
                                        <label className="text-xs text-muted-foreground mb-1 block">
                                            Transparencia: {(() => {
                                                if (state.overlayColor.startsWith('rgba')) {
                                                    const match = state.overlayColor.match(/rgba\([^,]+,[^,]+,[^,]+,\s*([^)]+)\)/);
                                                    if (match) return Math.round(parseFloat(match[1]) * 100) + '%';
                                                }
                                                return '95%';
                                            })()}
                                        </label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.05"
                                            value={(() => {
                                                if (state.overlayColor.startsWith('rgba')) {
                                                    const match = state.overlayColor.match(/rgba\([^,]+,[^,]+,[^,]+,\s*([^)]+)\)/);
                                                    if (match) return parseFloat(match[1]);
                                                }
                                                return 0.95;
                                            })()}
                                            onChange={(e) => {
                                                const alpha = parseFloat(e.target.value);
                                                
                                                // Extraer RGB actual
                                                let r = 255, g = 255, b = 255;
                                                if (state.overlayColor.startsWith('rgba')) {
                                                    const match = state.overlayColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+),/);
                                                    if (match) {
                                                        r = parseInt(match[1]);
                                                        g = parseInt(match[2]);
                                                        b = parseInt(match[3]);
                                                    }
                                                }
                                                
                                                setters.setOverlayColor(`rgba(${r}, ${g}, ${b}, ${alpha})`);
                                            }}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>
                                </div>
                                
                                {/* Input manual para casos avanzados */}
                                <div>
                                    <label className="text-xs text-muted-foreground mb-1 block">Valor manual (opcional):</label>
                                    <Input 
                                        value={state.overlayColor} 
                                        onChange={(e) => setters.setOverlayColor(e.target.value)}
                                        className="bg-muted text-foreground text-xs"
                                        placeholder="rgba(255, 255, 255, 0.95)"
                                    />
                                </div>
                            </div>
                            
                            {/* Presets rápidos */}
                            <div className="mt-3">
                                <label className="text-xs text-muted-foreground mb-2 block">Presets rápidos:</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {[
                                        { name: 'Blanco', color: 'rgba(255, 255, 255, 0.95)' },
                                        { name: 'Negro', color: 'rgba(0, 0, 0, 0.8)' },
                                        { name: 'Azul', color: 'rgba(59, 130, 246, 0.9)' },
                                        { name: 'Verde', color: 'rgba(16, 185, 129, 0.85)' },
                                    ].map((preset) => (
                                        <Button
                                            key={preset.name}
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setters.setOverlayColor(preset.color)}
                                            className="text-xs h-8 p-1"
                                        >
                                            {preset.name}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </FormField>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </Card>
);
