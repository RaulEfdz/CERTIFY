
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
                                className="w-full bg-white"
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
                        
                        <FormField label="Color de Superposición">
                            <div className="flex items-center gap-2">
                                <input 
                                    type="color" 
                                    value={state.overlayColor} 
                                    onChange={(e) => setters.setOverlayColor(e.target.value)}
                                    className="h-10 w-10 rounded border bg-white"
                                />
                                <Input 
                                    value={state.overlayColor} 
                                    onChange={(e) => setters.setOverlayColor(e.target.value)}
                                    className="flex-1 bg-white"
                                />
                            </div>
                        </FormField>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </Card>
);
