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
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <style>
            /* Estilos generales */
            body, html {
                margin: 0;
                padding: 0;
                width: 100%;
                height: 100%;
                font-family: Arial, sans-serif;
                color: #1f2937;
            }
            
            /* Estructura del certificado */
            .certificate {
                position: relative;
                width: 100%;
                min-height: 100%;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 2rem;
                box-sizing: border-box;
            }
            
            /* Fondo y superposición */
            .background {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-size: cover;
                background-position: center;
                z-index: 1;
            }
            
            .overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 2;
            }
            
            /* Contenido principal */
            .content {
                position: relative;
                z-index: 3;
                max-width: 800px;
                width: 100%;
                text-align: center;
                padding: 2rem;
                background-color: rgba(255, 255, 255, 0.9);
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            
            /* Elementos del certificado */
            .logo {
                margin: 0 auto 1.5rem;
                display: block;
                object-fit: contain;
            }
            h1 {
                font-size: 2rem;
                margin-bottom: 1.5rem;
            }
            .body-text {
                margin: 2rem 0;
                line-height: 1.6;
            }
            .course-name {
                font-weight: bold;
                font-size: 1.2rem;
                margin: 1rem 0;
            }
            .signatures {
                display: flex;
                justify-content: space-around;
                flex-wrap: wrap;
                margin: 2rem 0;
                gap: 1rem;
            }
            .signature {
                flex: 1;
                min-width: 150px;
                max-width: 200px;
                margin: 0.5rem;
            }
            .signature-image {
                max-width: 100%;
                height: auto;
                max-height: 100px;
                object-fit: contain;
                margin: 0 auto;
                display: block;
            }
            .date {
                margin-top: 2rem;
                font-style: italic;
            }
            ${customCss}
        </style>
    </head>
    <body>
        <div class="certificate">
            ${backgroundUrl ? `<div class="background" style="background-image: url('${backgroundUrl}');"></div>` : ''}
            <div class="overlay" style="background-color: ${overlayColor};"></div>
            <div class="content">
                <img src="${logoUrl}" alt="Logo" class="logo" style="width: ${logoWidth}px; height: ${logoHeight}px;">
                <h1 style="color: ${titleColor};">${title}</h1>
                <div class="body-text" style="color: ${bodyColor};">
                    <p>${body1}</p>
                    <p class="course-name">${courseName}</p>
                    <p>${body2}</p>
                </div>
                <div class="signatures">
                    ${signatures.map(sig => `
                        <div class="signature">
                            <img src="${sig.imageUrl}" alt="Signature" class="signature-image">
                        </div>
                    `).join('')}
                </div>
                <div class="date">
                    ${new Date().toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </div>
            </div>
        </div>
        <script>
            ${customJs}
        </script>
    </body>
    </html>`;
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

    // Update signatures when numSignatures changes
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

    // Update template HTML when any property changes
    useEffect(() => {
        const rgb = hexToRgb(overlayColorHex);
        const overlayRgba = backgroundUrl && rgb ? 
            `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${overlayOpacity})` : 'transparent';
        
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
    }, [
        logoUrl, logoWidth, logoHeight, backgroundUrl, title, body1, body2, 
        courseName, signatures, overlayColorHex, overlayOpacity, certificateSize, 
        titleColor, bodyColor, customCss, customJs
    ]);

    const panelStyles = `
        .properties-panel {
            background-color: #f9fafb;
            color: #1f2937;
            padding: 1rem;
            height: 100%;
            overflow-y: auto;
        }
        
        .properties-panel input[type="text"],
        .properties-panel input[type="number"],
        .properties-panel input[type="color"],
        .properties-panel textarea,
        .properties-panel select {
            background-color: white !important;
            color: #1f2937 !important;
            border: 1px solid #d1d5db !important;
            border-radius: 0.375rem !important;
            padding: 0.5rem 0.75rem !important;
            width: 100% !important;
        }
        
        .properties-panel input::placeholder,
        .properties-panel textarea::placeholder {
            color: #9ca3af !important;
            opacity: 1 !important;
        }
        
        .properties-panel button {
            background-color: white !important;
            color: #1f2937 !important;
            border: 1px solid #d1d5db !important;
            border-radius: 0.375rem !important;
            padding: 0.5rem 1rem !important;
            cursor: pointer !important;
            transition: all 0.2s !important;
        }
        
        .properties-panel button:hover {
            background-color: #f3f4f6 !important;
        }
        
        .properties-panel h3 {
            color: #1f2937 !important;
            font-weight: 600 !important;
            margin: 1.5rem 0 0.75rem 0 !important;
        }
        
        .properties-panel label {
            color: #4b5563 !important;
            font-weight: 500 !important;
            margin-bottom: 0.25rem !important;
            display: block !important;
        }
        
        .control-group {
            margin-bottom: 1rem !important;
        }
    `;

    return (
        <TooltipProvider>
            <style>{panelStyles}</style>
            <div className="flex flex-col h-full max-h-[calc(100vh-8rem)]">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                    <Button variant="outline" className="bg-white hover:bg-gray-100 text-gray-800 border-gray-300" asChild>
                        <Link href="/templates">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver
                        </Link>
                    </Button>

                    <div className="flex items-center gap-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="bg-white hover:bg-gray-100 text-gray-800" disabled>
                                    <Undo className="h-4 w-4" />
                                    <span className="sr-only">Deshacer (Ctrl+Z)</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Deshacer (Ctrl+Z)</p></TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="bg-white hover:bg-gray-100 text-gray-800" disabled>
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
                                <Button variant="outline" className="bg-white hover:bg-gray-100 text-gray-800 border-gray-300">
                                    <FileDown className="mr-2 h-4 w-4" /> Exportar
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>Exportar a PDF</DropdownMenuItem>
                                <DropdownMenuItem>Exportar a PNG</DropdownMenuItem>
                                <DropdownMenuItem>Exportar a HTML + JSON</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button 
                            variant="outline" 
                            className="bg-white hover:bg-gray-100 text-gray-800 border-gray-300"
                            onClick={() => setAiModalOpen(true)}
                        >
                            <Wand2 className="mr-2 h-4 w-4" />
                            Refinamiento IA
                        </Button>
                        <Button 
                            variant="default" 
                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                            onClick={() => setPreviewSheetOpen(true)}
                        >
                            <Eye className="mr-2 h-4 w-4" />
                            Vista Previa
                        </Button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
                    {/* Properties Panel */}
                    <Card className="lg:w-96 xl:w-[28rem] flex flex-col overflow-hidden">
                        <CardHeader className="border-b">
                            <CardTitle className="text-lg font-headline flex items-center gap-2">
                                <Settings className="h-5 w-5 text-muted-foreground" />
                                Propiedades de la Plantilla
                            </CardTitle>
                            <CardDescription className="text-sm">
                                Personaliza el diseño y contenido de tu certificado
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="properties-panel flex-1 overflow-y-auto p-4">
                                <Accordion type="multiple" defaultValue={['tamano', 'logo', 'fondo', 'colores', 'contenido', 'firmas', 'avanzada']}>
                                {/* Tamaño */}
                                <AccordionItem value="tamano">
                                    <AccordionTrigger>Tamaño del Certificado</AccordionTrigger>
                                    <AccordionContent className="pt-4">
                                        <RadioGroup 
                                            value={certificateSize} 
                                            onValueChange={(value: 'square' | 'landscape') => setCertificateSize(value)}
                                            className="space-y-2"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="landscape" id="landscape" />
                                                <Label htmlFor="landscape" className="text-sm font-medium">Horizontal (8.5" x 11")</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="square" id="square" />
                                                <Label htmlFor="square" className="text-sm font-medium">Cuadrado (8.5" x 8.5")</Label>
                                            </div>
                                        </RadioGroup>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* Logo */}
                                <AccordionItem value="logo">
                                    <AccordionTrigger>Logo</AccordionTrigger>
                                    <AccordionContent className="pt-4 space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-24 h-16 rounded-md border flex items-center justify-center bg-muted overflow-hidden">
                                                <img 
                                                    src={logoUrl} 
                                                    alt="Logo de la organización" 
                                                    className="max-w-full max-h-full object-contain" 
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <ImageUpload
                                                    label="Subir Logo"
                                                    onUpload={setLogoUrl}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="logoWidth">Ancho (px)</Label>
                                                <Input 
                                                    id="logoWidth" 
                                                    type="number" 
                                                    value={logoWidth}
                                                    onChange={(e) => setLogoWidth(parseInt(e.target.value) || 0)}
                                                    min={10}
                                                    max={500}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="logoHeight">Alto (px)</Label>
                                                <Input 
                                                    id="logoHeight" 
                                                    type="number" 
                                                    value={logoHeight}
                                                    onChange={(e) => setLogoHeight(parseInt(e.target.value) || 0)}
                                                    min={10}
                                                    max={500}
                                                />
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* Fondo */}
                                <AccordionItem value="fondo">
                                    <AccordionTrigger>Fondo</AccordionTrigger>
                                    <AccordionContent className="pt-4 space-y-4">
                                        <div>
                                            <Label>Imagen de Fondo</Label>
                                            {backgroundUrl ? (
                                                <div className="mt-2 relative group">
                                                    <div className="aspect-video rounded-md overflow-hidden border">
                                                        <img 
                                                            src={backgroundUrl} 
                                                            alt="Fondo del certificado" 
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <Button 
                                                        variant="destructive" 
                                                        size="icon" 
                                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => setBackgroundUrl(null)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <ImageUpload
                                                    label="Subir Imagen de Fondo"
                                                    onUpload={setBackgroundUrl}
                                                    className="mt-2"
                                                />
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label htmlFor="overlayColor">Color de Superposición</Label>
                                                {backgroundUrl && (
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="text-xs h-7"
                                                        onClick={handleSuggestColor}
                                                        disabled={suggestingColor}
                                                    >
                                                        {suggestingColor ? (
                                                            <>
                                                                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                                                Sugiriendo...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Sparkles className="mr-2 h-3 w-3" />
                                                                Sugerir Color
                                                            </>
                                                        )}
                                                    </Button>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input 
                                                    type="color" 
                                                    id="overlayColor" 
                                                    value={overlayColorHex}
                                                    onChange={(e) => setOverlayColorHex(e.target.value)}
                                                    className="h-9 w-9 p-1 rounded cursor-pointer"
                                                />
                                                <Input 
                                                    type="text" 
                                                    value={overlayColorHex} 
                                                    onChange={(e) => setOverlayColorHex(e.target.value)} 
                                                    className="h-9 text-xs font-mono"
                                                    maxLength={7}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="overlayOpacity">Opacidad de Superposición: {Math.round(overlayOpacity * 100)}%</Label>
                                            <div className="flex items-center gap-3">
                                                <Minus className="h-4 w-4 text-muted-foreground" />
                                                <Slider 
                                                    id="overlayOpacity"
                                                    min={0} 
                                                    max={1} 
                                                    step={0.01}
                                                    value={[overlayOpacity]} 
                                                    onValueChange={([value]) => setOverlayOpacity(value)}
                                                    className="flex-1"
                                                />
                                                <Plus className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* Colores */}
                                <AccordionItem value="colores">
                                    <AccordionTrigger>Colores del Texto</AccordionTrigger>
                                    <AccordionContent className="pt-4 space-y-4">
                                        <div className="space-y-2">
                                            <Label>Color del Título</Label>
                                            <div className="flex items-center gap-2">
                                                <input 
                                                    type="color" 
                                                    value={titleColor}
                                                    onChange={(e) => setTitleColor(e.target.value)}
                                                    className="h-9 w-9 p-1 rounded cursor-pointer"
                                                />
                                                <Input 
                                                    type="text" 
                                                    value={titleColor} 
                                                    onChange={(e) => setTitleColor(e.target.value)} 
                                                    className="h-9 text-xs font-mono"
                                                    maxLength={7}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Color del Texto</Label>
                                            <div className="flex items-center gap-2">
                                                <input 
                                                    type="color" 
                                                    value={bodyColor}
                                                    onChange={(e) => setBodyColor(e.target.value)}
                                                    className="h-9 w-9 p-1 rounded cursor-pointer"
                                                />
                                                <Input 
                                                    type="text" 
                                                    value={bodyColor} 
                                                    onChange={(e) => setBodyColor(e.target.value)} 
                                                    className="h-9 text-xs font-mono"
                                                    maxLength={7}
                                                />
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
                                    </AccordionContent>
                                </AccordionItem>

                                {/* Contenido */}
                                <AccordionItem value="contenido">
                                    <AccordionTrigger>Contenido del Texto</AccordionTrigger>
                                    <AccordionContent className="pt-4 space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="title">Título</Label>
                                            <Input 
                                                id="title" 
                                                value={title} 
                                                onChange={(e) => setTitle(e.target.value)} 
                                                placeholder="Ej: Certificado de Finalización"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="body1">Texto Superior</Label>
                                            <Textarea 
                                                id="body1" 
                                                value={body1} 
                                                onChange={(e) => setBody1(e.target.value)} 
                                                rows={2} 
                                                placeholder="Ej: Se otorga el presente certificado a:"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="courseName">Nombre del Curso</Label>
                                            <Input 
                                                id="courseName" 
                                                value={courseName} 
                                                onChange={(e) => setCourseName(e.target.value)} 
                                                placeholder="Ej: Desarrollo Web Avanzado"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="body2">Texto Inferior</Label>
                                            <Textarea 
                                                id="body2" 
                                                value={body2} 
                                                onChange={(e) => setBody2(e.target.value)} 
                                                rows={2} 
                                                placeholder="Ej: Por haber completado exitosamente el curso de"
                                            />
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* Firmas */}
                                <AccordionItem value="firmas">
                                    <AccordionTrigger>Firmas</AccordionTrigger>
                                    <AccordionContent className="pt-4 space-y-4">
                                        <div className="space-y-2">
                                            <Label>Número de Firmas</Label>
                                            <div className="flex items-center gap-3">
                                                <Button 
                                                    variant="outline" 
                                                    size="icon" 
                                                    className="h-8 w-8"
                                                    onClick={() => setNumSignatures(prev => Math.max(0, prev - 1))}
                                                    disabled={numSignatures <= 0}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>
                                                <div className="w-10 text-center">
                                                    {numSignatures}
                                                </div>
                                                <Button 
                                                    variant="outline" 
                                                    size="icon" 
                                                    className="h-8 w-8"
                                                    onClick={() => setNumSignatures(prev => prev + 1)}
                                                    disabled={numSignatures >= 4}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                        
                                        {numSignatures > 0 && <Separator />}
                                        
                                        {signatures.map((sig, index) => (
                                            <div key={index} className="space-y-2">
                                                <Label className="font-medium">Firma {index + 1}</Label>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-24 h-16 rounded-md border flex items-center justify-center bg-muted overflow-hidden">
                                                        <img 
                                                            src={sig.imageUrl} 
                                                            alt={`Firma ${index + 1}`} 
                                                            className="max-w-full max-h-full object-contain"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <ImageUpload
                                                            label="Subir Firma"
                                                            onUpload={(dataUrl) => handleSignatureUpload(index, dataUrl)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </AccordionContent>
                                </AccordionItem>

                                {/* Configuración Avanzada */}
                                <AccordionItem value="avanzada">
                                    <AccordionTrigger>Configuración Avanzada</AccordionTrigger>
                                    <AccordionContent className="pt-4 space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="customCss">CSS Personalizado</Label>
                                            <Textarea
                                                id="customCss"
                                                value={customCss}
                                                onChange={(e) => setCustomCss(e.target.value)}
                                                placeholder="/* Escribe tu CSS personalizado aquí */"
                                                className="font-mono text-xs h-32"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="customJs">JavaScript Personalizado</Label>
                                            <Textarea
                                                id="customJs"
                                                value={customJs}
                                                onChange={(e) => setCustomJs(e.target.value)}
                                                placeholder="// Escribe tu JavaScript personalizado aquí"
                                                className="font-mono text-xs h-32"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Nota: El JavaScript se ejecutará en el contexto de la vista previa del certificado.
                                            </p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                                </Accordion>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Preview Panel */}
                    <div className="flex-1 flex flex-col">
                        <Tabs defaultValue="preview" className="flex-1 flex flex-col">
                            <TabsList className="w-full justify-start rounded-b-none border-b bg-transparent p-0 h-10">
                                <TabsTrigger 
                                    value="preview" 
                                    className="relative h-10 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-4 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                                >
                                    Vista Previa
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="code" 
                                    className="relative h-10 rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-4 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                                >
                                    Código HTML
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="preview" className="flex-1 mt-0">
                                <div className="h-full border rounded-lg overflow-hidden">
                                    <iframe 
                                        srcDoc={templateHtml}
                                        className="w-full h-full border-0"
                                        title="Vista Previa del Certificado"
                                    />
                                </div>
                            </TabsContent>
                            <TabsContent value="code" className="flex-1 mt-0">
                                <Textarea
                                    value={templateHtml}
                                    onChange={(e) => setTemplateHtml(e.target.value)}
                                    className="h-full font-mono text-xs"
                                    placeholder="El HTML aparecerá aquí..."
                                />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>

                {/* Modals */}
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
