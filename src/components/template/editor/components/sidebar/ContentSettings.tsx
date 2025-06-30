
import { Card } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { TypeIcon } from "lucide-react";
import { FormField } from "../FormField";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const MAX_COURSE_NAME_LENGTH = 100; // Maximum allowed characters for course name

// Simple character counter component
const CharacterCounter = ({ value, max, className = '' }: { value: number; max: number; className?: string }) => (
    <div className={`text-xs text-muted-foreground ${className}`}>
        {value} / {max} caracteres
    </div>
);

interface ContentSettingsProps {
    state: {
        title: string;
        body1: string;
        body2: string;
        courseName: string;
        studentName: string;
    };
    setters: {
        setTitle: (value: string) => void;
        setBody1: (value: string) => void;
        setBody2: (value: string) => void;
        setCourseName: (value: string) => void;
        setStudentName: (value: string) => void;
    };
}

export const ContentSettings = ({ state, setters }: ContentSettingsProps) => (
    <Card>
        <Accordion type="single" collapsible defaultValue="content">
            <AccordionItem value="content" className="border-b-0">
                <AccordionTrigger className="p-4 hover:no-underline">
                    <div className="flex items-center">
                        <TypeIcon className="h-4 w-4 mr-2" />
                        <span>Contenido</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-0">
                    <div className="space-y-4">
                        <FormField label="Título">
                            <Input 
                            className="bg-white"
                                value={state.title} 
                                onChange={(e) => setters.setTitle(e.target.value)}
                                placeholder="Ej: Certificado de Participación"
                            />
                        </FormField>
                        
                        <FormField label="Texto Principal">
                            <Textarea 
                            className="bg-white"
                                value={state.body1} 
                                onChange={(e) => setters.setBody1(e.target.value)}
                                placeholder="Ej: Se otorga el presente certificado a:"
                                rows={2}
                            />
                        </FormField>
                        
                        <FormField label="Texto Secundario">
                            <Textarea 
                            className="bg-white"
                                value={state.body2} 
                                onChange={(e) => setters.setBody2(e.target.value)}
                                placeholder="Ej: Por haber completado exitosamente el curso de..."
                                rows={3}
                            />
                        </FormField>

                        <FormField label="Nombre del Estudiante">
                            <Input 
                            className="bg-white"
                                value={state.studentName} 
                                onChange={(e) => setters.setStudentName(e.target.value)}
                                placeholder="Ej: Ada Lovelace"
                            />
                        </FormField>
                        
                        <FormField label="Nombre del Curso">
                            <Input 
                            className="bg-white"
                                value={state.courseName} 
                                onChange={(e) => setters.setCourseName(e.target.value)}
                                placeholder="Ej: Introducción a la Programación"
                                maxLength={MAX_COURSE_NAME_LENGTH}
                            />
                            <CharacterCounter 
                                value={state.courseName.length} 
                                max={MAX_COURSE_NAME_LENGTH} 
                                className="mt-1" 
                            />
                        </FormField>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </Card>
);
