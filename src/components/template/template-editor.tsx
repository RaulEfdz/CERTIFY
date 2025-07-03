"use client";

import { useState, useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings2, X } from "lucide-react";

import { useTemplateState } from "./editor/hooks/useTemplateState";
import { TemplateHeader } from "./editor/components/TemplateHeader";
import { TemplateSidebar } from "./editor/components/TemplateSidebar";
import { TemplatePreview, PreviewControls } from "./editor/components/TemplatePreview";
import { TemplateBaseSelector, TemplateBase } from "./editor/components/TemplateBaseSelector";
import { ConfigurationModal } from "./editor/components/ConfigurationModal";
import { SaveTemplateModal, SaveTemplateData } from "./editor/components/SaveTemplateModal";
import { getTemplateHtml } from "./editor/templates/defaultTemplate";
import { TemplateConfig } from "./editor/types";

export function ImprovedTemplateEditor() {
  const state = useTemplateState();
  const templateHtml = getTemplateHtml(state as TemplateConfig);

  const [open, setOpen] = useState(false);
  const [showBaseSelector, setShowBaseSelector] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  // Removed activeTab - only preview mode now
  const [previewControls, setPreviewControls] = useState<PreviewControls | null>(null);

  const handleTemplateSelect = (template: TemplateBase) => {
    // Apply template configuration to state
    state.setCertificateSize(template.config.certificateSize);
    state.setTitle(template.config.defaultTitle);
    state.setBody1(template.config.defaultBody1);
    state.setBody2(template.config.defaultBody2);
    state.setOverlayColor(template.config.overlayColor);
    state.setOrientation(template.config.orientation);
    
    setShowBaseSelector(false);
  };

  const handleSkipTemplate = () => {
    setShowBaseSelector(false);
  };

  const handleSaveTemplate = async (templateData: SaveTemplateData): Promise<boolean> => {
    setSaving(true);
    try {
      // TODO: Implement actual save to database
      console.log('Saving template:', templateData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return true;
    } catch (error) {
      console.error('Error saving template:', error);
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Handle ESC key to close sidebar
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showSidebar) {
        setShowSidebar(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSidebar]);

  // Show base selector first
  if (showBaseSelector) {
    return (
      <TemplateBaseSelector
        onSelect={handleTemplateSelect}
        onSkip={handleSkipTemplate}
      />
    );
  }

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-background">

        {/* Overlay cuando el sidebar está abierto */}
        {showSidebar && (
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setShowSidebar(false)}
          />
        )}

        {/* Sidebar como drawer */}
        <aside className={`
          fixed top-0 left-0 h-full w-80 max-w-[90vw] bg-background border-r shadow-xl z-50
          transform transition-transform duration-300 ease-in-out
          ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="h-full flex flex-col">
            {/* Header del drawer */}
            <div className="p-3 border-b flex items-center justify-between bg-muted/50">
              <div className="flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold">Configuración</h2>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  ESC para cerrar
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowSidebar(false)}
                  className="h-6 w-6 p-0 hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Contenido del sidebar */}
            <div className="flex-1 overflow-y-auto">
              <TemplateSidebar 
                state={{
                  certificateSize: state.certificateSize,
                  logoUrl: state.logoUrl,
                  logoWidth: state.logoWidth,
                  logoHeight: state.logoHeight,
                  title: state.title,
                  body1: state.body1,
                  body2: state.body2,
                  courseName: state.courseName,
                  studentName: state.studentName,
                  orientation: state.orientation,
                  backgroundUrl: state.backgroundUrl,
                  overlayColor: state.overlayColor,
                  titleColor: state.titleColor,
                  bodyColor: state.bodyColor,
                }}
                setters={{
                  setCertificateSize: state.setCertificateSize,
                  setLogoUrl: (url: string | null) => state.setLogoUrl(url || ''),
                  setLogoWidth: state.setLogoWidth,
                  setLogoHeight: state.setLogoHeight,
                  setTitle: state.setTitle,
                  setBody1: state.setBody1,
                  setBody2: state.setBody2,
                  setCourseName: state.setCourseName,
                  setStudentName: state.setStudentName,
                  setOrientation: state.setOrientation,
                  setBackgroundUrl: (url: string | null) => state.setBackgroundUrl(url || ''),
                  setOverlayColor: state.setOverlayColor,
                  setTitleColor: state.setTitleColor,
                  setBodyColor: state.setBodyColor,
                }}
              />
            </div>
            
            {/* Footer del drawer */}
            <div className="p-3 border-t bg-muted/50">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowSidebar(false)}
                  className="flex-1"
                >
                  Cerrar
                </Button>
                <ConfigurationModal 
                  state={state} 
                  setters={state} 
                  templateHtml={templateHtml}
                >
                  <Button variant="default" size="sm" className="flex-1">
                    Avanzado
                  </Button>
                </ConfigurationModal>
              </div>
            </div>
          </div>
        </aside>

        {/* Panel central */}
        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-shrink-0">
            <TemplateHeader 
              templateConfig={state}
              templateHtml={templateHtml}
              onSave={handleSaveTemplate}
              showSidebar={showSidebar}
              onToggleSidebar={() => setShowSidebar(!showSidebar)}
              previewControls={previewControls}
              certificateSize={state.certificateSize}
            />
          </div>

          <div className="flex-1 overflow-hidden">
            <TemplatePreview
              templateHtml={templateHtml}
              certificateSize={state.certificateSize}
              hideControls={true}
            />
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
