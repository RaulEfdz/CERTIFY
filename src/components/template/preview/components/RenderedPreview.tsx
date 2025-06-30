
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';

interface RenderedPreviewProps {
  renderedHtml: string;
}

export const RenderedPreview = ({ renderedHtml }: RenderedPreviewProps) => {
    const [zoom, setZoom] = useState(0.7);

    return (
        <div className="md:col-span-2 flex flex-col bg-secondary border-l">
            <div className="p-3 border-b flex justify-center items-center gap-2 bg-background">
                <h3 className="text-sm font-medium text-center">Resultado</h3>
                <div className="flex-1" />
                <TooltipProvider>
                    <Tooltip><TooltipTrigger asChild><Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setZoom(z => z + 0.1)}><ZoomIn className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent><p>Acercar</p></TooltipContent></Tooltip>
                    <Tooltip><TooltipTrigger asChild><Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setZoom(z => Math.max(0.1, z - 0.1))}><ZoomOut className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent><p>Alejar</p></TooltipContent></Tooltip>
                    <Tooltip><TooltipTrigger asChild><Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setZoom(0.7)}><RefreshCw className="h-4 w-4" /></Button></TooltipTrigger><TooltipContent><p>Restablecer Zoom</p></TooltipContent></Tooltip>
                </TooltipProvider>
            </div>
            <div className="flex-1 overflow-auto p-8">
                <div
                    className="shadow-lg mx-auto bg-muted"
                    style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
                    dangerouslySetInnerHTML={{ __html: renderedHtml }}
                />
            </div>
        </div>
    );
};
