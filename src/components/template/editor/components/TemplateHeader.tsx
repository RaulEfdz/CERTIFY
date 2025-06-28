
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, FileDown, Wand2 } from "lucide-react";

export const TemplateHeader = () => (
    <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" asChild>
                    <a href="/dashboard/templates">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver
                    </a>
                </Button>
                <h1 className="text-xl font-semibold">Editor de Plantilla</h1>
            </div>
            
            <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Guardar borrador
                </Button>
                <Button size="sm">
                    <FileDown className="h-4 w-4 mr-2" />
                    Exportar
                </Button>
                <Button variant="secondary" size="sm">
                    <Wand2 className="h-4 w-4 mr-2" />
                    Refinamiento IA
                </Button>
            </div>
        </div>
    </header>
);
