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
                    <TemplateSidebar state={state} setters={state} />
                    <TemplatePreview templateHtml={templateHtml} certificateSize={state.certificateSize} />
                </div>
            </div>
        </TooltipProvider>
    );
}