"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Wand2, Check, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { refineTemplateText, RefineTemplateTextOutput } from "@/ai/flows/template-refinement";
import { Skeleton } from "../ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface AiRefinementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentText: string;
  onTextUpdate: (newText: string) => void;
}

export default function AiRefinementModal({ open, onOpenChange, currentText, onTextUpdate }: AiRefinementModalProps) {
  const [text, setText] = useState(currentText);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RefineTemplateTextOutput | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setText(currentText);
      setResult(null);
    }
  }, [open, currentText]);

  const handleRefine = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await refineTemplateText({ templateText: text });
      setResult(response);
    } catch (error) {
      console.error("Falló el refinamiento con IA:", error);
      toast({
        variant: "destructive",
        title: "Falló el Refinamiento con IA",
        description: "No se pudieron obtener sugerencias. Por favor, inténtalo de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const applySuggestion = () => {
    if (result) {
        onTextUpdate(result.refinedText);
        toast({
          title: "Sugerencia Aplicada",
          description: "El texto de la plantilla ha sido actualizado.",
        });
        onOpenChange(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent"/> Refinamiento con IA
          </DialogTitle>
          <DialogDescription>
            Mejora el texto o HTML de tu plantilla. Pega tu contenido, obtén sugerencias y aplícalas directamente.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 flex-1 min-h-0">
          <Textarea 
              placeholder="Introduce texto o HTML para refinar..." 
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1"
          />
          <Button onClick={handleRefine} disabled={loading || !text} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              {loading ? 'Refinando...' : <><Wand2 className="mr-2 h-4 w-4" /> Refinar Texto</>}
          </Button>
          <div className="space-y-4 overflow-y-auto">
              {loading && (
                  <div className="space-y-2 p-4 border rounded-lg">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                  </div>
              )}
              {result && (
                  <Card className="bg-secondary">
                      <CardHeader className="pb-2">
                          <CardTitle className="text-base font-medium">Sugerencia</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <p className="mb-2 font-semibold">&quot;{result.refinedText}&quot;</p>
                          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                              {result.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                          </ul>
                          <Button onClick={applySuggestion} size="sm" className="mt-4 w-full"><Check className="mr-2 h-4 w-4" /> Aplicar Sugerencia</Button>
                      </CardContent>
                  </Card>
              )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
