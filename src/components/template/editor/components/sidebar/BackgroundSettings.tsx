
import { Card, Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui";
import { ImagePlus, X } from "lucide-react";
import { FormField } from "../FormField";
import ImageUpload from "../../image-upload";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export const BackgroundSettings = ({ state, setters }) => (
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
                        <FormField label="Imagen de Fondo">
                            <ImageUpload 
                                onUpload={setters.setBackgroundUrl}
                                label="Subir imagen de fondo"
                                className="w-full"
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
                                    className="h-10 w-10 rounded border"
                                />
                                <Input 
                                    value={state.overlayColor} 
                                    onChange={(e) => setters.setOverlayColor(e.target.value)}
                                    className="flex-1"
                                />
                            </div>
                        </FormField>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </Card>
);
