
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  RectangleHorizontal, 
  Square, 
  Image, 
  Type, 
  Palette,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { SizeToggle } from "./SizeToggle";
import { LogoSettings } from "./sidebar/LogoSettings";
import { ContentSettings } from "./sidebar/ContentSettings";
import { BackgroundSettings } from "./sidebar/BackgroundSettings";

import { CertificateSize } from "../types";

interface TemplateSidebarProps {
  state: {
    certificateSize: CertificateSize;
    // LogoSettings
    logoUrl: string | null;
    logoWidth: number;
    logoHeight: number;
    // ContentSettings
    title: string;
    body1: string;
    body2: string;
    courseName: string;
    studentName: string;
    // BackgroundSettings
    orientation: string;
    backgroundUrl: string | null;
    overlayColor: string;
  };
  setters: {
    setCertificateSize: (size: CertificateSize) => void;
    // LogoSettings
    setLogoUrl: (url: string | null) => void;
    setLogoWidth: (width: number) => void;
    setLogoHeight: (height: number) => void;
    // ContentSettings
    setTitle: (value: string) => void;
    setBody1: (value: string) => void;
    setBody2: (value: string) => void;
    setCourseName: (value: string) => void;
    setStudentName: (value: string) => void;
    // BackgroundSettings
    setOrientation: (value: string) => void;
    setBackgroundUrl: (url: string | null) => void;
    setOverlayColor: (color: string) => void;
  };
}


export const TemplateSidebar = ({ state, setters }: TemplateSidebarProps) => {
  const getSizeIcon = (size: CertificateSize, className = "h-4 w-4") => {
    const IconComponent = size === 'landscape' ? RectangleHorizontal : Square;
    return <IconComponent className={className} />;
  };

  const getSizeBadge = (size: CertificateSize) => {
    return size === 'landscape' ? 'Horizontal' : 'Cuadrado';
  };

  return (
    <div className="w-full h-full bg-background/50 backdrop-blur-sm">
      {/* Header */}
      <div className="p-4 border-b border-border/40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Personalización</h3>
            <p className="text-xs text-muted-foreground">Configurar certificado</p>
          </div>
        </div>
      </div>

      {/* Quick Status */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getSizeIcon(state.certificateSize, "h-4 w-4 text-muted-foreground")}
            <span className="text-sm font-medium">Formato</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {getSizeBadge(state.certificateSize)}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Logo</span>
          </div>
          <Badge variant={state.logoUrl ? "default" : "outline"} className="text-xs">
            {state.logoUrl ? "Configurado" : "Sin logo"}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Fondo</span>
          </div>
          <Badge variant={state.backgroundUrl ? "default" : "outline"} className="text-xs">
            {state.backgroundUrl ? "Personalizado" : "Predeterminado"}
          </Badge>
        </div>
      </div>

      <Separator />

      {/* Configuration Sections */}
      <div className="flex-1 overflow-y-auto">
        <Accordion type="multiple" defaultValue={['size', 'content']} className="p-4 space-y-3">
          {/* Size Configuration */}
          <AccordionItem value="size" className="border border-border/40 rounded-lg px-4 py-2 shadow-sm">
            <AccordionTrigger className="py-3 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-blue-500/10 flex items-center justify-center">
                  {getSizeIcon(state.certificateSize, "h-4 w-4 text-blue-600")}
                </div>
                <div className="text-left">
                  <div className="font-medium text-sm">Tamaño del Certificado</div>
                  <div className="text-xs text-muted-foreground">Formato y orientación</div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <SizeToggle 
                value={state.certificateSize} 
                onChange={setters.setCertificateSize} 
              />
            </AccordionContent>
          </AccordionItem>

          {/* Logo Configuration */}
          <AccordionItem value="logo" className="border border-border/40 rounded-lg px-4 py-2 shadow-sm">
            <AccordionTrigger className="py-3 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-emerald-500/10 flex items-center justify-center">
                  <Image className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-sm">Logo</div>
                  <div className="text-xs text-muted-foreground">Imagen institucional</div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <LogoSettings state={state} setters={setters} />
            </AccordionContent>
          </AccordionItem>

          {/* Content Configuration */}
          <AccordionItem value="content" className="border border-border/40 rounded-lg px-4 py-2 shadow-sm">
            <AccordionTrigger className="py-3 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-purple-500/10 flex items-center justify-center">
                  <Type className="h-4 w-4 text-purple-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-sm">Contenido</div>
                  <div className="text-xs text-muted-foreground">Texto y datos</div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <ContentSettings state={state} setters={setters} />
            </AccordionContent>
          </AccordionItem>

          {/* Background Configuration */}
          <AccordionItem value="background" className="border border-border/40 rounded-lg px-4 py-2 shadow-sm">
            <AccordionTrigger className="py-3 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-orange-500/10 flex items-center justify-center">
                  <Palette className="h-4 w-4 text-orange-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-sm">Fondo</div>
                  <div className="text-xs text-muted-foreground">Colores e imágenes</div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-4">
              <BackgroundSettings state={state} setters={setters} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};
