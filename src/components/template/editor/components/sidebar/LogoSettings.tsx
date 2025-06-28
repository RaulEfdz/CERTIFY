
import { Card, Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui";
import { ImageIcon } from "lucide-react";
import { FormField } from "../FormField";
import ImageUpload from "../../image-upload";
import { Input } from "@/components/ui/input";
import { CheckCircle2 } from "lucide-react";

export const LogoSettings = ({ state, setters }) => (
    <Card>
        <Accordion type="single" collapsible defaultValue="logo">
            <AccordionItem value="logo" className="border-b-0">
                <AccordionTrigger className="p-4 hover:no-underline">
                    <div className="flex items-center">
                        <ImageIcon className="h-4 w-4 mr-2" />
                        <span>Logo</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                    <div className="space-y-4">
                        <FormField label="Subir Logo">
                            <ImageUpload 
                                onUpload={setters.setLogoUrl}
                                label="Subir logo"
                                className="w-full"
                            />
                            {state.logoUrl && (
                                <div className="mt-2 text-xs text-muted-foreground flex items-center">
                                    <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                                    <span>Logo cargado</span>
                                </div>
                            )}
                        </FormField>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Ancho (px)">
                                <Input 
                                    type="number" 
                                    min="10" 
                                    max="500"
                                    value={state.logoWidth}
                                    onChange={(e) => setters.setLogoWidth(parseInt(e.target.value, 10))}
                                    className="w-full"
                                />
                            </FormField>
                            
                            <FormField label="Alto (px)">
                                <Input 
                                    type="number" 
                                    min="10" 
                                    max="500"
                                    value={state.logoHeight}
                                    onChange={(e) => setters.setLogoHeight(parseInt(e.target.value, 10))}
                                    className="w-full"
                                />
                            </FormField>
                        </div>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </Card>
);
