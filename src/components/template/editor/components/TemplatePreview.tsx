
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Maximize2, Minimize2 } from 'lucide-react';

interface TemplatePreviewProps {
    templateHtml: string;
    certificateSize: 'landscape' | 'square';
}

export const TemplatePreview = ({ templateHtml, certificateSize }: TemplatePreviewProps) => {
    const [isPreviewFullscreen, setIsPreviewFullscreen] = useState<boolean>(false);

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-muted/50">
            <div className="border-b bg-card p-2 flex justify-between items-center">
                <TabsList>
                    <TabsTrigger value="preview" className="px-4">
                        Vista Previa
                    </TabsTrigger>
                    <TabsTrigger value="code" className="px-4">
                        Código HTML
                    </TabsTrigger>
                </TabsList>
                
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => setIsPreviewFullscreen(!isPreviewFullscreen)}
                                className="h-8 w-8"
                            >
                                {isPreviewFullscreen ? (
                                    <Minimize2 className="h-4 w-4" />
                                ) : (
                                    <Maximize2 className="h-4 w-4" />
                                )}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            {isPreviewFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            
            <div className={`flex-1 overflow-auto p-8 ${isPreviewFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
                <div className="h-full flex items-center justify-center">
                    <div 
                        className={`bg-white shadow-lg rounded-lg overflow-hidden ${certificateSize === 'landscape' ? 'aspect-[4/3]' : 'aspect-square'} w-full max-w-4xl`}
                    >
                        <iframe 
                            srcDoc={templateHtml}
                            className="w-full h-full border-0"
                            title="Vista Previa del Certificado"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
