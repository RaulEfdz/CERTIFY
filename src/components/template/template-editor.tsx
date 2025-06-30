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
        {/* Sidebar lateral fijo, visible desde md en adelante */}
        <aside className="hidden md:flex w-auto flex-shrink-0 flex-col border-r bg-card overflow-y-auto">
          <TemplateSidebar state={state} setters={state} />
        </aside>

        {/* Panel central: header + preview */}
        <main className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <div className="p-0 md:p-6 pb-0">
            <TemplateHeader />
          </div>

          {/* Contenido central: preview */}
          <div className="flex flex-1 overflow-hidden">
              <TemplatePreview
                templateHtml={templateHtml}
                certificateSize={state.certificateSize}
              />
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
