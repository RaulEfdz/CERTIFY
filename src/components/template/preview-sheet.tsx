"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { usePreviewState } from "./preview/hooks/usePreviewState";
import { JsonEditor } from "./preview/components/JsonEditor";
import { VariableExplorer } from "./preview/components/VariableExplorer";
import { RenderedPreview } from "./preview/components/RenderedPreview";
import { renderTemplate } from "./preview/utils";
import { useEffect, useState } from "react";

interface PreviewSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templateHtml: string;
}

export default function PreviewSheet({ open, onOpenChange, templateHtml }: PreviewSheetProps) {
    const {
        jsonData, setJsonData,
        generating,
        detectedVariables,
        groupedVariables,
        missingVariables,
        handleGenerateData,
        handleFormatJson,
        handleCopyJson,
    } = usePreviewState(templateHtml);

    const [renderedHtml, setRenderedHtml] = useState("");

    useEffect(() => {
        setRenderedHtml(renderTemplate(templateHtml, jsonData));
    }, [templateHtml, jsonData]);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-none sm:w-5/6 lg:w-4/5 flex flex-col p-0">
                <SheetHeader className="p-6 pb-4">
                    <SheetTitle>Vista Previa en Vivo y Mapeo de Variables</SheetTitle>
                    <SheetDescription>
                        Prueba tu plantilla con datos JSON y revisa las variables detectadas.
                    </SheetDescription>
                </SheetHeader>
                <div className="flex-1 grid md:grid-cols-3 gap-x-6 min-h-0">
                    <div className="md:col-span-1 flex flex-col gap-4 p-6 pt-0 min-h-0">
                        <JsonEditor 
                            jsonData={jsonData} 
                            setJsonData={setJsonData} 
                            generating={generating} 
                            detectedVariables={detectedVariables} 
                            onGenerate={handleGenerateData} 
                            onFormat={handleFormatJson} 
                            onCopy={handleCopyJson} 
                        />
                        <Separator />
                        <VariableExplorer 
                            detectedVariables={detectedVariables} 
                            groupedVariables={groupedVariables} 
                            missingVariables={missingVariables} 
                        />
                    </div>
                    <RenderedPreview renderedHtml={renderedHtml} />
                </div>
            </SheetContent>
        </Sheet>
    );
}