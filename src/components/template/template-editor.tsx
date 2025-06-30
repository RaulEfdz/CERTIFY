"use client";

import { useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useTemplateState } from "./editor/hooks/useTemplateState";
import { TemplateHeader } from "./editor/components/TemplateHeader";
import { TemplateSidebar } from "./editor/components/TemplateSidebar";
import { TemplatePreview } from "./editor/components/TemplatePreview";
import { getTemplateHtml } from "./editor/templates/defaultTemplate";
import { TemplateConfig } from "./editor/types";

export function ImprovedTemplateEditor() {
  const state = useTemplateState();
  const templateHtml = getTemplateHtml(state as TemplateConfig);

  const [open, setOpen] = useState(false);

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-background">
        {/* Modal Sidebar para móvil o pantallas pequeñas */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="absolute top-4 left-4 z-50 md:hidden">Configurar</Button>
          </DialogTrigger>
          <DialogContent className="p-0 max-w-md h-screen overflow-y-auto">
            <TemplateSidebar state={state} setters={state} />
          </DialogContent>
        </Dialog>

        {/* Sidebar solo visible en pantallas medianas o más grandes */}
        <aside className="hidden md:flex w-auto flex-shrink-0 flex-col border-r bg-card overflow-y-auto">
          <TemplateSidebar state={state} setters={state} />
        </aside>

        {/* Panel central */}
        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="p-0 md:p-6 pb-0">
            <TemplateHeader />
          </div>

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
