"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from "lucide-react";

interface CertificatePreviewProps {
  templateHtml: string;
  certificateSize: 'landscape' | 'square';
  className?: string;
  showControls?: boolean;
  initialZoom?: number | 'auto';
}

export function CertificatePreview({ 
  templateHtml, 
  certificateSize, 
  className = "",
  showControls = true,
  initialZoom = 1
}: CertificatePreviewProps) {
  const [zoom, setZoom] = useState(typeof initialZoom === 'number' ? initialZoom : 1);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Get dimensions based on certificate size
  const dimensions = certificateSize === 'square' 
    ? { width: 800, height: 800, aspectRatio: '1/1' }
    : { width: 1000, height: 707, aspectRatio: '1000/707' };

  // Auto-fit zoom calculation
  const calculateFitZoom = () => {
    if (!containerRef.current) return 1;
    
    const container = containerRef.current;
    const containerWidth = container.clientWidth - 32; // padding
    const containerHeight = container.clientHeight - 32; // padding
    
    const scaleX = containerWidth / dimensions.width;
    const scaleY = containerHeight / dimensions.height;
    
    return Math.min(scaleX, scaleY, 1); // Never zoom in beyond 100%
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.1));
  };

  const handleFitToContainer = () => {
    const fitZoom = calculateFitZoom();
    setZoom(fitZoom);
  };

  const handleReset = () => {
    setZoom(1);
  };

  // Auto-fit on container resize
  useEffect(() => {
    if (initialZoom === 'auto') {
      const resizeObserver = new ResizeObserver(() => {
        handleFitToContainer();
      });
      
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }
      
      return () => resizeObserver.disconnect();
    }
  }, [initialZoom]);

  return (
    <div 
      ref={containerRef}
      className={`relative h-full w-full overflow-auto bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 ${className}`}
    >
      {/* Zoom Controls */}
      {showControls && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg border border-slate-200 dark:border-slate-700 p-1 shadow-lg">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            disabled={zoom <= 0.1}
            className="h-8 w-8 p-0"
            title="Alejar"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <span className="text-xs text-foreground min-w-[45px] text-center font-mono px-1">
            {Math.round(zoom * 100)}%
          </span>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            disabled={zoom >= 3}
            className="h-8 w-8 p-0"
            title="Acercar"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          
          <div className="h-4 w-px bg-slate-300 dark:bg-slate-600 mx-1" />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFitToContainer}
            className="h-8 w-8 p-0"
            title="Ajustar al contenedor"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-8 w-8 p-0"
            title="Tamaño real (100%)"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          
        </div>
      )}
      
      {/* Certificate Preview */}
      <div className="flex items-center justify-center min-h-full p-4">
        <div 
          className="bg-white shadow-2xl border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden transition-transform duration-200"
          style={{ 
            transform: `scale(${zoom})`,
            transformOrigin: "center center",
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
            aspectRatio: dimensions.aspectRatio,
            // Ensure minimum margin around scaled certificate
            margin: `${Math.max(20, 20 / zoom)}px auto`,
            boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          }}
          dangerouslySetInnerHTML={{ __html: templateHtml }}
        />
      </div>
    </div>
  );
}