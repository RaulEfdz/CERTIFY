
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Settings2, ImageIcon, TypeIcon, ImagePlus } from "lucide-react";
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


export const TemplateSidebar = ({ state, setters }: TemplateSidebarProps) => (
    <div className="w-full h-full">
        <Accordion type="multiple" defaultValue={['size']} className="px-3">
                <AccordionItem value="size" className="border-b-0">
                    <AccordionTrigger className="py-3 text-sm">
                        <div className="flex items-center">
                            <Settings2 className="h-4 w-4 mr-2" />
                            <span>Tamaño del Certificado</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="pb-3">
                            <SizeToggle 
                                value={state.certificateSize} 
                                onChange={setters.setCertificateSize} 
                            />
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="logo" className="border-b-0">
                    <AccordionTrigger className="py-3 text-sm">
                        <div className="flex items-center">
                            <ImageIcon className="h-4 w-4 mr-2" />
                            <span>Logo</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="pb-3">
                            <LogoSettings state={state} setters={setters} />
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="content" className="border-b-0">
                    <AccordionTrigger className="py-3 text-sm">
                        <div className="flex items-center">
                            <TypeIcon className="h-4 w-4 mr-2" />
                            <span>Contenido</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="pb-3">
                            <ContentSettings state={state} setters={setters} />
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="background" className="border-b-0">
                    <AccordionTrigger className="py-3 text-sm">
                        <div className="flex items-center">
                            <ImagePlus className="h-4 w-4 mr-2" />
                            <span>Fondo</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="pb-3">
                            <BackgroundSettings state={state} setters={setters} />
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
    </div>
);
