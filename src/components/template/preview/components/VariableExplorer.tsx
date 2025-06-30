
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Variable, AlertCircle } from "lucide-react";

interface VariableExplorerProps {
  detectedVariables: string[];
  groupedVariables: Record<string, string[]>;
  missingVariables: string[];
}

export const VariableExplorer = ({ detectedVariables, groupedVariables, missingVariables }: VariableExplorerProps) => (
    <div className="flex flex-col gap-2 flex-1 min-h-0">
        <h3 className="text-sm font-medium flex items-center gap-2"><Variable className="h-4 w-4"/> Variables Detectadas</h3>
        {missingVariables.length > 0 && (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Variables Faltantes</AlertTitle>
                <AlertDescription>
                Tu JSON no incluye: {missingVariables.slice(0, 2).join(', ')}
                {missingVariables.length > 2 && `, y ${missingVariables.length - 2} más...`}
                </AlertDescription>
            </Alert>
        )}
        {detectedVariables.length > 0 ? (
            <div className="overflow-y-auto pr-2 -mr-2">
                <Accordion type="multiple" defaultValue={Object.keys(groupedVariables)} className="w-full">
                {Object.entries(groupedVariables).map(([groupName, vars]) => (
                    <AccordionItem value={groupName} key={groupName}>
                        <AccordionTrigger className="text-sm">{groupName.charAt(0).toUpperCase() + groupName.slice(1)} ({vars.length})</AccordionTrigger>
                        <AccordionContent>
                            <div className="flex flex-wrap gap-1.5">
                            {vars.map(v => <Badge key={v} variant="secondary" className="font-code">{`{{${v}}}`}</Badge>)}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
                </Accordion>
            </div>
        ) : (
            <p className="text-sm text-muted-foreground">No se detectaron variables (ej. <code className="font-code bg-muted px-1 py-0.5 rounded-sm">{`{{name}}`}</code>).</p>
        )}
    </div>
);
