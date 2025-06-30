"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { useTemplateState } from "./editor/hooks/useTemplateState";
import { TemplateHeader } from "./editor/components/TemplateHeader";
import { TemplateSidebar } from "./editor/components/TemplateSidebar";
import { TemplatePreview } from "./editor/components/TemplatePreview";
import { getTemplateHtml } from "./editor/templates/defaultTemplate";
import { TemplateConfig } from "./editor/types";

export function ImprovedTemplateEditor() {
    const state = useTemplateState();
    const templateHtml = getTemplateHtml(state as TemplateConfig);

    return (
        <TooltipProvider>
            <div className="flex flex-col h-screen bg-background">
                <TemplateHeader />
                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar: oculta en pantallas chicas, visible en md+ */}
                    <div className="hidden md:block h-full">
                        <TemplateSidebar state={state} setters={state} />
                    </div>
                    {/* Preview: ocupa todo el ancho en móvil, comparte espacio en desktop */}
                    <div className="flex-1 min-w-0 w-full h-full overflow-auto flex items-center justify-center">
                        <TemplatePreview templateHtml={templateHtml} certificateSize={state.certificateSize} />
                    </div>
                </div>
                {/* Sidebar móvil: abajo, sticky, visible solo en pantallas chicas */}
                <div className="block md:hidden w-full max-h-[60vh] overflow-y-auto border-t bg-card sticky bottom-0 z-20">
                    <TemplateSidebar state={state} setters={state} />
                </div>
            </div>
        </TooltipProvider>
    );
}