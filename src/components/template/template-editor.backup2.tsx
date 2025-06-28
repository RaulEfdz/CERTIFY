"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Save, Eye, ArrowLeft, FileDown, Wand2, Undo, Redo, Image as ImageIcon, Palette, Type, FileSignature, Settings, X, Sparkles, Loader2, Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageUpload from "./image-upload";
import AiRefinementModal from "./ai-refinement-modal";
import PreviewSheet from "./preview-sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { suggestOverlayColor } from "@/ai/flows/suggest-overlay-color";

interface SignatureData {
    imageUrl: string;
    dataAiHint?: string;
}

const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
};

const buildTemplateHtml = ({
    logoUrl,
    logoWidth,
    logoHeight,
    backgroundUrl,
    title,
    body1,
    body2,
    courseName,
    signatures,
    overlayColor,
    certificateSize,
    titleColor,
    bodyColor,
    customCss,
    customJs,
}: {
    logoUrl: string;
    logoWidth: number;
    logoHeight: number;
    backgroundUrl: string | null;
    title: string;
    body1: string;
    body2: string;
    courseName: string;
    signatures: SignatureData[];
    overlayColor: string;
    certificateSize: 'square' | 'landscape';
    titleColor: string;
    bodyColor: string;
    customCss: string;
    customJs: string;
}) => {
    const generateSignatures = (sigs: SignatureData[]) => {
        if (sigs.length === 0) return '';
        let signaturesHtml = '';
        sigs.forEach((sig, index) => {
            const i = index + 1;
            signaturesHtml += `
            <div style="width: 250px; text-align: center;">
              <img src="${sig.imageUrl}" alt="Firma ${i}" style="height: 50px; margin: 0 auto 10px; object-fit: contain;"/>
              <p style="border-top: 1px solid #999; padding-top: 10px; margin: 0 auto; font-family: 'Georgia', serif; color: ${bodyColor};">{{firma_${i}.nombre}}</p>
              <p style="font-size: 12px; margin-top: 5px; color: ${bodyColor};">{{firma_${i}.puesto}}</p>
            </div>
          `;
        });
        return `<div data-element="signatures-container" style="display: flex; justify-content: center; align-items: flex-start; gap: 80px; margin-top: 50px; font-size: 14px; color: ${bodyColor};">
            ${signaturesHtml}
        </div>`;
    };

    const backgroundStyle = backgroundUrl ? `background-image: url('${backgroundUrl}'); background-size: cover; background-position: center;` : 'background: white;';
    const sizeStyles = {
        square: 'width: 800px; height: 800px;',
        landscape: 'width: 1000px; height: 707px;',
    };
    const containerStyle = sizeStyles[certificateSize];

    return `
<div data-element="container" style="position: relative; font-family: 'Inter', sans-serif; text-align: center; border: 1px solid #e5e7eb; margin: auto; ${containerStyle} ${backgroundStyle} box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden; display: flex; flex-direction: column; justify-content: center;">
  <style>
    ${customCss}
  </style>
  <div data-element="overlay" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: ${overlayColor}; z-index: 0;"></div>
  <div data-element="content-wrapper" style="position: relative; z-index: 1; padding: 40px;">
      <div style="text-align: center;">
        <img data-element="logo" src="${logoUrl}" alt="Logo" style="width: ${logoWidth}px; height: ${logoHeight}px; margin-bottom: 20px; object-fit: contain;"/>
      </div>
      <h1 style="font-family: 'Space Grotesk', sans-serif; font-size: 36px; color: ${titleColor}; margin-top: 20px; padding-bottom: 20px; border-bottom: 1px solid #DDD; margin-bottom: 30px;">
        ${title}
      </h1>
      <p style="font-size: 16px; color: ${bodyColor}; line-height: 1.5;">
        ${body1}
      </p>
      <p style="font-family: 'Georgia', serif; font-size: 30px; font-style: italic; color: ${titleColor}; margin: 20px 0;">
        {{recipient.name}}
      </p>
      <p style="font-size: 16px; color: ${bodyColor}; line-height: 1.5;">
        ${body2}
      </p>
      <p style="font-family: 'Space Grotesk', sans-serif; font-size: 22px; font-weight: bold; color: ${titleColor}; margin: 10px 0 40px 0;">
        "${courseName}"
      </p>
      ${generateSignatures(signatures)}
  </div>
  <script>
    try {
      ${customJs}
    } catch(e) {
      console.error("Error executing custom JS:", e);
    }
  </script>
</div>`.trim();
};


export default function TemplateEditor() {
    const [templateHtml, setTemplateHtml] = useState('');
    const [aiModalOpen, setAiModalOpen] = useState(false);
    const [previewSheetOpen, setPreviewSheetOpen] = useState(false);
    const { toast } = useToast();
    const [suggestingColor, setSuggestingColor] = useState(false);

    // State for template properties
    const [certificateSize, setCertificateSize] = useState<'square' | 'landscape'>('landscape');
    const [logoUrl, setLogoUrl] = useState('https://placehold.co/80x80.png');
    const [logoWidth, setLogoWidth] = useState(80);
    const [logoHeight, setLogoHeight] = useState(80);
    const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
    const [title, setTitle] = useState('Certificado de Finalización');
    const [body1, setBody1] = useState('Este certificado se presenta con orgullo a');
    const [body2, setBody2] = useState('por haber completado exitosamente el curso');
    const [courseName, setCourseName] = useState('Desarrollo Web Avanzado');
    const [numSignatures, setNumSignatures] = useState(2);
    const [signatures, setSignatures] = useState<SignatureData[]>([
        { imageUrl: 'https://placehold.co/150x50.png', dataAiHint: 'signature autograph' },
        { imageUrl: 'https://placehold.co/150x50.png', dataAiHint: 'signature autograph' },
    ]);
    const [overlayColorHex, setOverlayColorHex] = useState('#ffffff');
    const [overlayOpacity, setOverlayOpacity] = useState(0.5);
    const [titleColor, setTitleColor] = useState('#111827');
    const [bodyColor, setBodyColor] = useState('#374151');
    const [customCss, setCustomCss] = useState('');
    const [customJs, setCustomJs] = useState('');

    useEffect(() => {
        setSignatures(currentSignatures => {
            const newSignatures = [...currentSignatures];
            const diff = numSignatures - newSignatures.length;

            if (diff > 0) {
                for (let i = 0; i < diff; i++) {
                    newSignatures.push({ imageUrl: 'https://placehold.co/150x50.png', dataAiHint: 'signature autograph' });
                }
            } else if (diff < 0) {
                newSignatures.length = numSignatures;
            }
            return newSignatures;
        });
    }, [numSignatures]);

    const handleSignatureUpload = (index: number, dataUrl: string) => {
        setSignatures(currentSignatures => {
            const newSignatures = [...currentSignatures];
            newSignatures[index] = { ...newSignatures[index], imageUrl: dataUrl };
            return newSignatures;
        });
    };

    const handleSuggestColor = async () => {
        if (!backgroundUrl) {
            toast({
                variant: "destructive",
                title: "No hay imagen de fondo",
                description: "Por favor, sube una imagen de fondo primero.",
            });
            return;
        }
        
        setSuggestingColor(true);
        try {
            const result = await suggestOverlayColor({ photoDataUri: backgroundUrl });
            if (result.overlayHexColor) {
                setOverlayColorHex(result.overlayHexColor);
                setTitleColor(result.titleHexColor);
                setBodyColor(result.bodyHexColor);
                toast({
                    title: "Paleta de Colores Sugerida",
                    description: `Se han aplicado nuevos colores para la superposición y el texto.`,
                });
            }
        } catch (error) {
            console.error("Error suggesting color:", error);
            toast({
                variant: "destructive",
                title: "Error de Sugerencia",
                description: "No se pudo sugerir una paleta de colores. Por favor, inténtalo de nuevo.",
            });
        } finally {
            setSuggestingColor(false);
        }
    };


    useEffect(() => {
        const rgb = hexToRgb(overlayColorHex);
        const overlayRgba = backgroundUrl && rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${overlayOpacity})` : 'transparent';
        
        const newHtml = buildTemplateHtml({
            logoUrl,
            logoWidth,
            logoHeight,
            backgroundUrl,
            title,
            body1,
            body2,
            courseName,
            signatures,
            overlayColor: overlayRgba,
            certificateSize,
            titleColor,
            bodyColor,
            customCss,
            customJs,
        });
        setTemplateHtml(newHtml);
    }, [logoUrl, logoWidth, logoHeight, backgroundUrl, title, body1, body2, courseName, signatures, overlayColorHex, overlayOpacity, certificateSize, titleColor, bodyColor, customCss, customJs]);


    return (
        <TooltipProvider>
            <div className="flex flex-col h-full max-h-[calc(100vh - 8rem)]">
                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                    <Button variant="outline" className="bg-background hover:bg-accent/90 hover:text-accent-foreground" asChild>
                        <Link href="/templates">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver
                        </Link>
                    </Button>

                    <div className="flex items-center gap-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" disabled>
                                    <Undo className="h-4 w-4" />
                                    <span className="sr-only">Deshacer (Ctrl+Z)</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Deshacer (Ctrl+Z)</p></TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" disabled>
                                    <Redo className="h-4 w-4" />
                                    <span className="sr-only">Rehacer (Ctrl+Y)</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Rehacer (Ctrl+Y)</p></TooltipContent>
                        </Tooltip>
                        <Separator orientation="vertical" className="h-6 mx-2" />
                        <div className="text-sm text-foreground/80">Guardado</div>
                    </div>

                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="bg-background hover:bg-accent/90 hover:text-accent-foreground">
                                    <FileDown className="mr-2 h-4 w-4" /> Exportar
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>Exportar a PDF</DropdownMenuItem>
                                <DropdownMenuItem>Exportar a PNG</DropdownMenuItem>
                                <DropdownMenuItem>Exportar a HTML + JSON</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button 
                                    variant="outline" 
                                    className="bg-background hover:bg-accent/90 hover:text-accent-foreground" 
                                    onClick={() => setAiModalOpen(true)}
                                >
                                    <Wand2 className="mr-2 h-4 w-4" /> Refinamiento IA
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Mejorar con IA</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button 
                                    variant="outline" 
                                    className="bg-background hover:bg-accent/90 hover:text-accent-foreground"
                                    onClick={() => setPreviewSheetOpen(true)}
                                >
                                    <Eye className="mr-2 h-4 w-4" /> Vista Previa
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Vista Previa en Vivo</TooltipContent>
                        </Tooltip>
                        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                            <Save className="mr-2 h-4 w-4" /> Guardar
                        </Button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-6 flex-1 min-h-0">
                    {/* Panel de Propiedades */}
                    <Card className="lg:col-span-4 xl:col-span-3 rounded-lg flex flex-col shadow-sm border overflow-hidden">
                        <CardHeader className="border-b sticky top-0 bg-background z-10">
                            <CardTitle className="text-lg font-headline flex items-center gap-2">
                                <Settings className="h-5 w-5 text-muted-foreground" />
                                Propiedades de la Plantilla
                            </CardTitle>
                            <CardDescription className="text-sm">
                                Personaliza el diseño y contenido de tu certificado
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto p-4 [&_input]:bg-white [&_input]:text-foreground [&_input]:border-input [&_input]:placeholder-muted-foreground/50 [&_textarea]:bg-white [&_textarea]:text-foreground [&_textarea]:border-input">
                            <Accordion 
                                type="multiple" 
                                defaultValue={['apariencia', 'contenido', 'firmas', 'avanzado']}
                                className="space-y-4"
                            >
                                {/* Sección de Apariencia */}
                                <AccordionItem value="apariencia" className="border rounded-lg overflow-hidden">
                                    <AccordionTrigger className="px-4 py-3 hover:no-underline">
                                        <div className="flex items-center gap-2">
                                            <Palette className="h-4 w-4" />
                                            <span className="font-medium">Apariencia y Diseño</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="px-4 pb-4 space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">Tamaño del Certificado</Label>
                                            <RadioGroup
                                                value={certificateSize}
                                                onValueChange={(value) => setCertificateSize(value as 'square' | 'landscape')}
                                                className="grid grid-cols-2 gap-2"
                                            >
                                                <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-accent/50 cursor-pointer">
                                                    <RadioGroupItem value="landscape" id="size-landscape" className="h-4 w-4" />
                                                    <Label htmlFor="size-landscape" className="font-normal">Panorámico</Label>
                                                </div>
                                                <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-accent/50 cursor-pointer">
                                                    <RadioGroupItem value="square" id="size-square" className="h-4 w-4" />
                                                    <Label htmlFor="size-square" className="font-normal">1:1 (Cuadrado)</Label>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                        <Separator />
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-sm font-medium">Logo de la Organización</Label>
                                                {logoUrl && (
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="h-7 text-xs text-destructive hover:text-destructive"
                                                        onClick={() => setLogoUrl('')}
                                                    >
                                                        Eliminar
                                                    </Button>
                                                )}
                                            </div>
                                            
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 border-2 border-dashed rounded-lg flex items-center justify-center bg-muted/30">
                                                    {logoUrl ? (
                                                        <img 
                                                            src={logoUrl} 
                                                            alt="Logo de la organización" 
                                                            className="max-w-full max-h-full object-contain p-1"
                                                        />
                                                    ) : (
                                                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <ImageUpload 
                                                        onUpload={setLogoUrl}
                                                        label={logoUrl ? 'Cambiar Logo' : 'Subir Logo'}
                                                    />
                                                    {logoUrl && (
                                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                                            <div>
                                                                <Label className="text-xs text-muted-foreground">Ancho (px)</Label>
                                                                <Input 
                                                                    type="number" 
                                                                    value={logoWidth} 
                                                                    onChange={(e) => setLogoWidth(Number(e.target.value))} 
                                                                    className="h-8 text-xs"
                                                                    min={10}
                                                                    max={500}
                                                                />
                                                            </div>
                                                            <div>
                                                                <Label className="text-xs text-muted-foreground">Alto (px)</Label>
                                                                <Input 
                                                                    type="number" 
                                                                    value={logoHeight} 
                                                                    onChange={(e) => setLogoHeight(Number(e.target.value))} 
                                                                    className="h-8 text-xs"
                                                                    min={10}
                                                                    max={500}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <Separator />
                                        {/* Sección de Fondo */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <Label className="text-sm font-medium">Imagen de Fondo</Label>
                                                {backgroundUrl && (
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="h-7 text-xs text-destructive hover:text-destructive"
                                                        onClick={() => setBackgroundUrl(null)}
                                                    >
                                                        Eliminar
                                                    </Button>
                                                )}
                                            </div>
                                            
                                            <div className="border-2 border-dashed rounded-lg p-4 bg-muted/20 flex flex-col items-center justify-center gap-3">
                                                {backgroundUrl ? (
                                                    <div className="relative w-full h-32 rounded-md overflow-hidden">
                                                        <img 
                                                            src={backgroundUrl} 
                                                            alt="Fondo del certificado" 
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center text-center p-4">
                                                        <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                                                        <p className="text-sm text-muted-foreground mb-2">Arrastra una imagen o haz clic para subir</p>
                                                        <p className="text-xs text-muted-foreground">Recomendado: 1200x800px o similar</p>
                                                    </div>
                                                )}
                                                <div className="w-full">
                                                    <ImageUpload 
                                                        onUpload={setBackgroundUrl}
                                                        label={backgroundUrl ? 'Cambiar Fondo' : 'Seleccionar Imagen'}
                                                    />
                                                </div>
                                            </div>

                                            {backgroundUrl && (
                                                <div className="space-y-3 pt-2">
                                                    <div className="flex items-center justify-between">
                                                        <Label className="text-sm font-medium">Capa de Color</Label>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button 
                                                                    variant="ghost" 
                                                                    size="sm" 
                                                                    className="h-7 text-xs flex items-center gap-1"
                                                                    onClick={handleSuggestColor}
                                                                    disabled={suggestingColor}
                                                                >
                                                                    {suggestingColor ? (
                                                                        <>
                                                                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                                                            Generando...
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Sparkles className="h-3 w-3" />
                                                                            Sugerir Color
                                                                        </>
                                                                    )}
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Generar automáticamente una combinación de colores basada en la imagen de fondo</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <Label className="text-xs text-muted-foreground block mb-1">Color</Label>
                                                            <div className="relative">
                                                                <Input 
                                                                    type="color" 
                                                                    value={overlayColorHex}
                                                                    onChange={(e) => setOverlayColorHex(e.target.value)}
                                                                    className="h-10 w-full p-1 rounded cursor-pointer"
                                                                />
                                                                <div 
                                                                    className="absolute inset-0 pointer-events-none rounded-md border"
                                                                    style={{
                                                                        background: `linear-gradient(90deg, ${overlayColorHex}00 0%, ${overlayColorHex}ff 100%)`
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <Label className="text-xs text-muted-foreground block mb-1">
                                                                Opacidad: {Math.round(overlayOpacity * 100)}%
                                                            </Label>
                                                            <div className="flex items-center gap-2">
                                                                <Slider
                                                                    value={[overlayOpacity * 100]}
                                                                    onValueChange={([value]) => setOverlayOpacity(value / 100)}
                                                                    max={100}
                                                                    step={1}
                                                                    className="flex-1"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <Separator/>
                                        <div className="space-y-3">
                                            <h4 className="text-sm font-medium">Colores del Texto</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label className="text-xs text-muted-foreground block mb-1">Título</Label>
                                                    <div className="flex items-center gap-2">
                                                        <div className="relative">
                                                            <Input 
                                                                type="color" 
                                                                value={titleColor}
                                                                onChange={(e) => setTitleColor(e.target.value)}
                                                                className="h-9 w-9 p-1 rounded cursor-pointer"
                                                            />
                                                        </div>
                                                        <Input 
                                                            type="text" 
                                                            value={titleColor} 
                                                            onChange={(e) => setTitleColor(e.target.value)} 
                                                            className="h-9 text-xs font-mono"
                                                            maxLength={7}
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label className="text-xs text-muted-foreground block mb-1">Cuerpo</Label>
                                                    <div className="flex items-center gap-2">
                                                        <div className="relative">
                                                            <Input 
                                                                type="color" 
                                                                value={bodyColor}
                                                                onChange={(e) => setBodyColor(e.target.value)}
                                                                className="h-9 w-9 p-1 rounded cursor-pointer"
                                                            />
                                                        </div>
                                                        <Input 
                                                            type="text" 
                                                            value={bodyColor} 
                                                            onChange={(e) => setBodyColor(e.target.value)} 
                                                            className="h-9 text-xs font-mono"
                                                            maxLength={7}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between pt-1">
                                                <span className="text-xs text-muted-foreground">Previsualización:</span>
                                                <div className="flex items-center gap-2">
                                                    <span 
                                                        className="text-xs px-2 py-1 rounded border"
                                                        style={{ color: titleColor, borderColor: `${titleColor}50` }}
                                                    >
                                                        Título
                                                    </span>
                                                    <span 
                                                        className="text-xs px-2 py-1 rounded border"
                                                        style={{ color: bodyColor, borderColor: `${bodyColor}50` }}
                                                    >
                                                        Texto
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="contenido">
                                    <AccordionTrigger>Contenido del Texto</AccordionTrigger>
                                    <AccordionContent className="space-y-4 pt-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="title">Título</Label>
                                            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="body1">Texto Superior</Label>
                                            <Textarea id="body1" value={body1} onChange={(e) => setBody1(e.target.value)} rows={2} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="body2">Texto Inferior</Label>
                                            <Textarea id="body2" value={body2} onChange={(e) => setBody2(e.target.value)} rows={2} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="courseName">Nombre del Curso</Label>
                                            <Input id="courseName" value={courseName} onChange={(e) => setCourseName(e.target.value)} />
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="firmas">
                                    <AccordionTrigger>Firmas</AccordionTrigger>
                                    <AccordionContent className="space-y-4 pt-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="numSignatures">Número de Firmas</Label>
                                            <Input
                                                id="numSignatures"
                                                type="number"
                                                value={numSignatures}
                                                onChange={(e) => {
                                                    const value = parseInt(e.target.value, 10);
                                                    if (!isNaN(value) && value >= 0 && value <= 4) {
                                                        setNumSignatures(value);
                                                    } else if (e.target.value === '') {
                                                        setNumSignatures(0);
                                                    }
                                                }}
                                                min="0"
                                                max="4"
                                                className="w-24"
                                            />
                                        </div>
                                        {numSignatures > 0 && <Separator />}
                                        {signatures.map((sig, index) => (
                                            <div key={index} className="space-y-2">
                                                <Label className="font-medium">Firma {index + 1}</Label>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-24 h-16 rounded-md border flex items-center justify-center bg-muted overflow-hidden">
                                                        <img 
                                                            src={sig.imageUrl} 
                                                            alt={`Preview Firma ${index + 1}`} 
                                                            className="max-w-full max-h-full object-contain" 
                                                            data-ai-hint={sig.dataAiHint}
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <ImageUpload
                                                            label="Subir Imagen"
                                                            onUpload={(dataUrl) => handleSignatureUpload(index, dataUrl)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="avanzada">
                                    <AccordionTrigger>Configuración Avanzada</AccordionTrigger>
                                    <AccordionContent className="space-y-4 pt-4">
                                       <div className="space-y-2">
                                           <Label htmlFor="customCss">CSS Personalizado</Label>
                                           <Textarea
                                               id="customCss"
                                               value={customCss}
                                               onChange={(e) => setCustomCss(e.target.value)}
                                               placeholder="/* Escribe tu CSS aquí */&#10;.mi-clase-personalizada {&#10;  font-weight: bold;&#10;}"
                                               className="font-code text-xs"
                                               rows={5}
                                           />
                                       </div>
                                       <div className="space-y-2">
                                           <Label htmlFor="customJs">JavaScript Personalizado</Label>
                                           <Textarea
                                               id="customJs"
                                               value={customJs}
                                               onChange={(e) => setCustomJs(e.target.value)}
                                               placeholder="// Escribe tu JavaScript aquí&#10;console.log('Certificado cargado');"
                                               className="font-code text-xs"
                                               rows={5}
                                           />
                                           <p className="text-xs text-muted-foreground">Nota: El JS podría no ejecutarse en todas las vistas previas o exportaciones por razones de seguridad.</p>
                                       </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </CardContent>
                    </Card>

                    <div className="lg:col-span-6 flex flex-col min-h-0">
                        <Tabs defaultValue="visual" className="flex-1 flex flex-col min-h-0">
                            <Card className="rounded-lg flex-1 flex flex-col shadow-sm">
                                <CardHeader className="flex-row items-center justify-between">
                                    <CardTitle className="font-headline">Lienzo</CardTitle>
                                    <TabsList>
                                        <TabsTrigger value="visual">Visual</TabsTrigger>
                                        <TabsTrigger value="code">Código</TabsTrigger>
                                    </TabsList>
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col p-0">
                                    <TabsContent value="visual" className="flex-1 mt-0 bg-secondary rounded-b-lg">
                                        <div className="w-full h-full flex justify-center items-start p-8 overflow-auto">
                                            <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
                                                <div 
                                                    className="relative"
                                                    style={{
                                                        aspectRatio: certificateSize === 'landscape' ? '16/9' : '1/1',
                                                        backgroundColor: '#f8fafc',
                                                        backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : 'none',
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center',
                                                        position: 'relative',
                                                        overflow: 'hidden'
                                                    }}
                                                >
                                                    {backgroundUrl && (
                                                        <div 
                                                            className="absolute inset-0"
                                                            style={{
                                                                backgroundColor: overlayColorHex,
                                                                opacity: overlayOpacity,
                                                                mixBlendMode: 'multiply'
                                                            }}
                                                        />
                                                    )}
                                                    <div className="relative z-10 p-8 h-full flex flex-col">
                                                        {/* Logo */}
                                                        {logoUrl && (
                                                            <div className="flex justify-center mb-6">
                                                                <img 
                                                                    src={logoUrl} 
                                                                    alt="Logo de la organización"
                                                                    style={{
                                                                        width: `${logoWidth}px`,
                                                                        height: `${logoHeight}px`,
                                                                        objectFit: 'contain'
                                                                    }}
                                                                />
                                                            </div>
                                                        )}
                                                        
                                                        {/* Contenido */}
                                                        <div className="flex-1 flex flex-col justify-center text-center">
                                                            <h1 
                                                                className="text-4xl font-bold mb-6"
                                                                style={{ color: titleColor }}
                                                            >
                                                                {title}
                                                            </h1>
                                                            
                                                            <div className="text-lg mb-8" style={{ color: bodyColor }}>
                                                                <p className="mb-2">{body1}</p>
                                                                <p className="text-2xl font-semibold my-4">[NOMBRE DEL ESTUDIANTE]</p>
                                                                <p>{body2}</p>
                                                                <p className="text-xl font-semibold my-2">{courseName}</p>
                                                            </div>
                                                            
                                                            {/* Firmas */}
                                                            {signatures.length > 0 && (
                                                                <div 
                                                                    className={`mt-8 pt-6 border-t grid gap-4`}
                                                                    style={{
                                                                        gridTemplateColumns: `repeat(${Math.min(signatures.length, 4)}, 1fr)`
                                                                    }}
                                                                >
                                                                    {signatures.map((sig, i) => (
                                                                        <div key={i} className="flex flex-col items-center">
                                                                            <div className="h-16 mb-2">
                                                                                <img 
                                                                                    src={sig.imageUrl} 
                                                                                    alt={`Firma ${i + 1}`} 
                                                                                    className="h-full object-contain"
                                                                                />
                                                                            </div>
                                                                            <div className="w-full h-px bg-gray-300 my-2"></div>
                                                                            <span className="text-sm text-gray-600">Firma {i + 1}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                        
                                                        {/* Fecha */}
                                                        <div className="mt-8 text-center text-sm text-gray-500">
                                                            Emitido el {new Date().toLocaleDateString('es-ES', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="code" className="flex-1 flex flex-col mt-0">
                                        <Textarea
                                            value={templateHtml}
                                            onChange={(e) => setTemplateHtml(e.target.value)}
                                            className="flex-1 font-code text-xs rounded-t-none rounded-b-lg border-0"
                                            placeholder="Escribe tu HTML aquí..."
                                        />
                                    </TabsContent>
                                </CardContent>
                            </Card>
                        </Tabs>
                    </div>
                </div>
                <AiRefinementModal
                    open={aiModalOpen}
                    onOpenChange={setAiModalOpen}
                    currentText={templateHtml}
                    onTextUpdate={setTemplateHtml}
                />
                <PreviewSheet
                    open={previewSheetOpen}
                    onOpenChange={setPreviewSheetOpen}
                    templateHtml={templateHtml}
                />
            </div>
        </TooltipProvider>
    );
}
