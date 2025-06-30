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
            <div className="flex h-screen bg-background">
                {/* Sidebar lateral fijo, scrollable si es necesario */}
                <aside className="hidden md:flex flex-shrink-0 w-64 bg-card border-r overflow-y-auto flex-col">
                    <TemplateSidebar state={state} setters={state} />
                </aside>
                {/* Panel central de configuración y vista previa */}
                <main className="flex flex-1 overflow-hidden">
                    {/* Panel de configuración central, scrollable */}
                    <section className="flex-1 p-0 md:p-6 overflow-y-auto flex flex-col">
                        <TemplateHeader />
                        {/* Aquí puedes poner más contenido de configuración central si lo necesitas */}
                    </section>
                    {/* Panel de vista previa a la derecha, siempre visible */}
                    <div className="flex-1 p-0 md:p-6 flex items-center justify-center bg-muted/40 min-w-0 max-w-4xl">
                        <TemplatePreview templateHtml={templateHtml} certificateSize={state.certificateSize} />
                    </div>
                </main>
            </div>
        </TooltipProvider>
    );
}