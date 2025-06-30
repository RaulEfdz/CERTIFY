
import { useState, useMemo, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { generateSampleData } from '@/ai/flows/generate-sample-data';
import { flattenObject } from '../utils';

const sampleJson = `{
  "recipient": {
    "name": "Jane Doe"
  },
  "firma_1": {
    "nombre": "John Smith",
    "puesto": "Lead Instructor"
  },
  "firma_2": {
    "nombre": "Alice Brown",
    "puesto": "Curriculum Developer"
  }
}`;

export const usePreviewState = (templateHtml: string) => {
    const [jsonData, setJsonData] = useState(sampleJson);
    const [generating, setGenerating] = useState(false);
    const { toast } = useToast();

    const detectedVariables = useMemo(() => {
        const regex = /{{\s*([\w.]+)\s*}}/g;
        const matches = templateHtml.matchAll(regex);
        const uniqueVariables = new Set(Array.from(matches, m => m[1]));
        return Array.from(uniqueVariables);
    }, [templateHtml]);

    const memoized = useMemo((): { groupedVariables: Record<string, string[]>; missingVariables: string[] } => {
        const groups: { [key: string]: string[] } = {};
        let parsedData = {};
        try {
            parsedData = JSON.parse(jsonData);
        } catch {
            // Ignore
        }

        const dataKeys = new Set(Object.keys(flattenObject(parsedData)));
        const missing: string[] = [];
        
        detectedVariables.forEach(variable => {
            const parts = variable.split('.');
            const groupName = parts.length > 1 ? parts[0] : 'general';
            if (!groups[groupName]) {
                groups[groupName] = [];
            }
            groups[groupName].push(variable);

            if (!dataKeys.has(variable)) {
                missing.push(variable);
            }
        });

        return { groupedVariables: groups, missingVariables: missing };
    }, [jsonData, detectedVariables]);

    const groupedVariables: Record<string, string[]> = memoized.groupedVariables;
    const missingVariables: string[] = memoized.missingVariables;

    const handleGenerateData = useCallback(async () => {
        if (detectedVariables.length === 0) {
            toast({ title: "No hay variables", description: "No se detectaron variables en la plantilla." });
            return;
        }

        setGenerating(true);
        try {
            const result = await generateSampleData({ variables: detectedVariables });
            const formattedJson = JSON.stringify(JSON.parse(result.jsonData), null, 2);
            setJsonData(formattedJson);
            toast({ title: "Datos de muestra generados", description: "La vista previa ha sido actualizada." });
        } catch (error) {
            console.error("Error generating sample data:", error);
            toast({ variant: "destructive", title: "Error de Generación", description: "No se pudieron generar los datos." });
        } finally {
            setGenerating(false);
        }
    }, [detectedVariables, toast]);

    const handleFormatJson = useCallback(() => {
        try {
            const parsed = JSON.parse(jsonData);
            setJsonData(JSON.stringify(parsed, null, 2));
            toast({ title: "JSON Formateado" });
        } catch (error) {
            toast({ variant: "destructive", title: "Error de Formato", description: "El JSON no es válido." });
        }
    }, [jsonData, toast]);

    const handleCopyJson = useCallback(() => {
        navigator.clipboard.writeText(jsonData);
        toast({ title: "JSON Copiado" });
    }, [jsonData, toast]);

    return {
        jsonData, setJsonData,
        generating,
        detectedVariables,
        groupedVariables,
        missingVariables,
        handleGenerateData,
        handleFormatJson,
        handleCopyJson,
    };
};
