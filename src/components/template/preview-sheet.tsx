
"use client";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Variable, Sparkles, AlertCircle, Copy, Code, ZoomIn, ZoomOut, RefreshCw } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { generateSampleData } from "@/ai/flows/generate-sample-data";
import { useToast } from "@/hooks/use-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";


interface PreviewSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templateHtml: string;
}

const sampleJson = `{
  "recipient": {
    "name": "Jane Doe"
  },
  "firma_1": {
    "nombre": "John Smith",
    "puesto": "Lead Instructor"
  },
  "firma_2": {
    "nombre": "Alice Brown",
    "puesto": "Curriculum Developer"
  }
}`;

function renderTemplate(template: string, data: string): string {
    let rendered = template;
    try {
        const jsonData = JSON.parse(data);
        const regex = /{{\s*([\w.]+)\s*}}/g;
        rendered = template.replace(regex, (match, key) => {
            const keys = key.split('.');
            let value = jsonData;
            for (const k of keys) {
                value = value?.[k];
            }
            return value !== undefined ? String(value) : match;
        });
    } catch (e) {
        // Ignorar errores de parseo de JSON para la edición en vivo
    }
    return rendered;
}

// Helper para aplanar un objeto JSON y obtener todas sus claves anidadas.
function flattenObject(obj: any, parentKey = '', res: {[key:string]: any} = {}) {
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const propName = parentKey ? `${parentKey}.${key}` : key;
            if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                flattenObject(obj[key], propName, res);
            } else {
                res[propName] = obj[key];
            }
        }
    }
    return res;
}


export default function PreviewSheet({ open, onOpenChange, templateHtml }: PreviewSheetProps) {
  const [jsonData, setJsonData] = useState(sampleJson);
  const [renderedHtml, setRenderedHtml] = useState("");
  const [generating, setGenerating] = useState(false);
  const [zoom, setZoom] = useState(0.7);
  const { toast } = useToast();

  const detectedVariables = useMemo(() => {
    const regex = /{{\s*([\w.]+)\s*}}/g;
    const matches = templateHtml.matchAll(regex);
    const uniqueVariables = new Set(Array.from(matches, m => m[1]));
    return Array.from(uniqueVariables);
  }, [templateHtml]);

  const { groupedVariables, missingVariables } = useMemo(() => {
    const groups: { [key: string]: string[] } = {};
    let parsedData = {};
    try {
      parsedData = JSON.parse(jsonData);
    } catch {
      // Los errores de JSON se manejarán explícitamente, así que aquí lo ignoramos.
    }

    const dataKeys = new Set(Object.keys(flattenObject(parsedData)));
    const missing: string[] = [];
    
    detectedVariables.forEach(variable => {
      const parts = variable.split('.');
      const groupName = parts.length > 1 ? parts[0] : 'general';
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(variable);

      if (!dataKeys.has(variable)) {
        missing.push(variable);
      }
    });

    return { groupedVariables: groups, missingVariables: missing };
  }, [detectedVariables, jsonData]);


  const handleGenerateData = async () => {
    if (detectedVariables.length === 0) {
      toast({
        title: "No hay variables",
        description: "No se detectaron variables en la plantilla para generar datos.",
      });
      return;
    }

    setGenerating(true);
    try {
      const result = await generateSampleData({ variables: detectedVariables });
      const formattedJson = JSON.stringify(JSON.parse(result.jsonData), null, 2);
      setJsonData(formattedJson);
      toast({
        title: "Datos y Vista Previa Actualizados",
        description: "Se han generado datos de muestra con IA y la vista previa ha sido actualizada.",
      });
    } catch (error) {
      console.error("Error generating sample data with AI:", error);
      toast({
        variant: "destructive",
        title: "Error de Generación",
        description: "No se pudieron generar los datos de muestra. Por favor, inténtalo de nuevo.",
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(jsonData);
      setJsonData(JSON.stringify(parsed, null, 2));
      toast({
        title: "JSON Formateado",
        description: "Los datos de muestra han sido formateados.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error de Formato",
        description: "El JSON que introdujiste no es válido.",
      });
    }
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonData);
    toast({ title: "JSON Copiado", description: "Los datos de muestra se han copiado al portapapeles." });
  };

  useEffect(() => {
    setRenderedHtml(renderTemplate(templateHtml, jsonData));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateHtml, jsonData]);

  return (
    <TooltipProvider>
        <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-none sm:w-5/6 lg:w-4/5 flex flex-col p-0">
            <SheetHeader className="p-6 pb-4">
            <SheetTitle>Vista Previa en Vivo y Mapeo de Variables</SheetTitle>
            <SheetDescription>
                Prueba tu plantilla con datos JSON y revisa las variables detectadas.
            </SheetDescription>
            </SheetHeader>
            <div className="flex-1 grid md:grid-cols-3 gap-x-6 min-h-0">
                <div className="md:col-span-1 flex flex-col gap-4 p-6 pt-0 min-h-0">
                    <div>
                        <Label htmlFor="json-data" className="text-sm">Datos de Muestra (JSON)</Label>
                        <div className="flex items-center gap-2 mt-2 mb-1 flex-wrap">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleGenerateData}
                                disabled={generating || detectedVariables.length === 0}
                            >
                                {generating ? (
                                    <><Sparkles className="mr-2 h-4 w-4 animate-spin" />Generando...</>
                                ) : (
                                    <><Sparkles className="mr-2 h-4 w-4" />Generar con IA</>
                                )}
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleFormatJson}>
                                <Code className="mr-2 h-4 w-4" /> Formatear
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopyJson}>
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                        <Textarea
                            id="json-data"
                            placeholder="Introduce datos JSON o genéralos con IA..."
                            value={jsonData}
                            onChange={(e) => setJsonData(e.target.value)}
                            className="font-code flex-1 text-xs min-h-[150px] mt-1"
                            disabled={generating}
                        />
                    </div>
                    <Separator />
                    <div className="flex flex-col gap-2 flex-1 min-h-0">
                        <h3 className="text-sm font-medium flex items-center gap-2"><Variable className="h-4 w-4"/> Variables Detectadas</h3>
                        {missingVariables.length > 0 && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Variables Faltantes</AlertTitle>
                                <AlertDescription>
                                Tu JSON no incluye: {missingVariables.slice(0, 2).join(', ')}
                                {missingVariables.length > 2 && `, y ${missingVariables.length - 2} más...`}
                                </AlertDescription>
                            </Alert>
                        )}
                        {detectedVariables.length > 0 ? (
                            <div className="overflow-y-auto pr-2 -mr-2">
                                <Accordion type="multiple" defaultValue={Object.keys(groupedVariables)} className="w-full">
                                {Object.entries(groupedVariables).map(([groupName, vars]) => (
                                    <AccordionItem value={groupName} key={groupName}>
                                        <AccordionTrigger className="text-sm">{groupName.charAt(0).toUpperCase() + groupName.slice(1)} ({vars.length})</AccordionTrigger>
                                        <AccordionContent>
                                            <div className="flex flex-wrap gap-1.5">
                                            {vars.map(v => <Badge key={v} variant="secondary" className="font-code">{`{{${v}}}`}</Badge>)}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                                </Accordion>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">No se detectaron variables (ej. <code className="font-code bg-muted px-1 py-0.5 rounded-sm">{`{{name}}`}</code>).</p>
                        )}
                    </div>
                </div>
                <div className="md:col-span-2 flex flex-col bg-secondary border-l">
                    <div className="p-3 border-b flex justify-center items-center gap-2 bg-background">
                        <h3 className="text-sm font-medium text-center">Resultado</h3>
                        <div className="flex-1" />
                        <Tooltip><TooltipTrigger asChild><Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setZoom(z => z + 0.1)}><ZoomIn className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent><p>Acercar</p></TooltipContent></Tooltip>
                        <Tooltip><TooltipTrigger asChild><Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setZoom(z => Math.max(0.1, z - 0.1))}><ZoomOut className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent><p>Alejar</p></TooltipContent></Tooltip>
                        <Tooltip><TooltipTrigger asChild><Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setZoom(0.7)}><RefreshCw className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent><p>Restablecer Zoom</p></TooltipContent></Tooltip>
                    </div>
                    <div className="flex-1 overflow-auto p-8">
                        <div
                            className="shadow-lg mx-auto bg-white"
                            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
                            dangerouslySetInnerHTML={{ __html: renderedHtml }}
                        />
                    </div>
                </div>
            </div>
        </SheetContent>
        </Sheet>
    </TooltipProvider>
  );
}
