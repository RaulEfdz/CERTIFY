
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Code, Copy } from "lucide-react";

export const JsonEditor = ({ jsonData, setJsonData, generating, detectedVariables, onGenerate, onFormat, onCopy }) => (
    <div>
        <Label htmlFor="json-data" className="text-sm">Datos de Muestra (JSON)</Label>
        <div className="flex items-center gap-2 mt-2 mb-1 flex-wrap">
            <Button
                variant="outline"
                size="sm"
                onClick={onGenerate}
                disabled={generating || detectedVariables.length === 0}
            >
                {generating ? (
                    <><Sparkles className="mr-2 h-4 w-4 animate-spin" />Generando...</>
                ) : (
                    <><Sparkles className="mr-2 h-4 w-4" />Generar con IA</>
                )}
            </Button>
            <Button variant="outline" size="sm" onClick={onFormat}>
                <Code className="mr-2 h-4 w-4" /> Formatear
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onCopy}>
                <Copy className="h-4 w-4" />
            </Button>
        </div>
        <Textarea
            id="json-data"
            placeholder="Introduce datos JSON o genéralos con IA..."
            value={jsonData}
            onChange={(e) => setJsonData(e.target.value)}
            className="font-code flex-1 text-xs min-h-[150px] mt-1"
            disabled={generating}
        />
    </div>
);
