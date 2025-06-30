"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, GraduationCap, Award, FileText, Briefcase } from "lucide-react";

export interface TemplateBase {
  id: string;
  name: string;
  description: string;
  category: string;
  preview: string;
  icon: React.ComponentType<any>;
  config: {
    certificateSize: "landscape" | "square";
    defaultTitle: string;
    defaultBody1: string;
    defaultBody2: string;
    overlayColor: string;
    orientation: string;
  };
}

const templateBases: TemplateBase[] = [
  {
    id: "academic-classic",
    name: "Académico Clásico",
    description: "Diseño tradicional para certificados de cursos y diplomas académicos",
    category: "Académico",
    preview: "/api/templates/preview/academic-classic.jpg",
    icon: GraduationCap,
    config: {
      certificateSize: "landscape",
      defaultTitle: "Certificado de Finalización",
      defaultBody1: "Se otorga el presente certificado a:",
      defaultBody2: "Por haber completado exitosamente el curso",
      overlayColor: "rgba(0, 0, 0, 0.1)",
      orientation: "landscape"
    }
  },
  {
    id: "professional-modern",
    name: "Profesional Moderno",
    description: "Diseño contemporáneo para certificaciones profesionales y empresariales",
    category: "Profesional",
    preview: "/api/templates/preview/professional-modern.jpg", 
    icon: Briefcase,
    config: {
      certificateSize: "landscape",
      defaultTitle: "Certificación Profesional",
      defaultBody1: "Certificamos que:",
      defaultBody2: "Ha demostrado competencia en",
      overlayColor: "rgba(59, 130, 246, 0.1)",
      orientation: "landscape"
    }
  },
  {
    id: "achievement-award",
    name: "Premio de Logro",
    description: "Plantilla elegante para reconocimientos y premios especiales",
    category: "Reconocimiento",
    preview: "/api/templates/preview/achievement-award.jpg",
    icon: Award,
    config: {
      certificateSize: "square",
      defaultTitle: "Premio de Excelencia",
      defaultBody1: "En reconocimiento a:",
      defaultBody2: "Por su destacado desempeño en",
      overlayColor: "rgba(245, 158, 11, 0.1)",
      orientation: "square"
    }
  },
  {
    id: "participation-simple",
    name: "Participación Simple",
    description: "Diseño minimalista para certificados de participación en eventos",
    category: "Participación",
    preview: "/api/templates/preview/participation-simple.jpg",
    icon: FileText,
    config: {
      certificateSize: "landscape",
      defaultTitle: "Certificado de Participación",
      defaultBody1: "Se reconoce la participación de:",
      defaultBody2: "En el evento",
      overlayColor: "rgba(16, 185, 129, 0.1)",
      orientation: "landscape"
    }
  }
];

interface TemplateBaseSelectorProps {
  onSelect: (template: TemplateBase) => void;
  onSkip: () => void;
  isUpdating?: boolean;
}

export function TemplateBaseSelector({ onSelect, onSkip, isUpdating = false }: TemplateBaseSelectorProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [category, setCategory] = useState<string>("Todos");

  const categories = ["Todos", ...Array.from(new Set(templateBases.map(t => t.category)))];
  const filteredTemplates = category === "Todos" 
    ? templateBases 
    : templateBases.filter(t => t.category === category);

  const handleContinue = () => {
    const selectedTemplate = templateBases.find(t => t.id === selected);
    if (selectedTemplate) {
      onSelect(selectedTemplate);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Crear Nueva Plantilla</h1>
          <p className="text-muted-foreground text-lg">
            Elige una plantilla base para comenzar o crea desde cero
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={category === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setCategory(cat)}
              className="rounded-full"
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredTemplates.map((template) => {
            const IconComponent = template.icon;
            const isSelected = selected === template.id;
            
            return (
              <Card 
                key={template.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  isSelected ? 'ring-2 ring-primary border-primary' : ''
                }`}
                onClick={() => setSelected(template.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          {template.category}
                        </Badge>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle className="h-5 w-5 text-primary" />
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <CardDescription className="mb-4">
                    {template.description}
                  </CardDescription>
                  
                  {/* Preview placeholder */}
                  <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center">
                      <IconComponent className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Vista previa</p>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p><strong>Formato:</strong> {template.config.certificateSize === "landscape" ? "Horizontal" : "Cuadrado"}</p>
                    <p><strong>Título:</strong> {template.config.defaultTitle}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={onSkip}
            disabled={isUpdating}
          >
            Crear desde cero
          </Button>
          
          <Button
            size="lg"
            disabled={!selected || isUpdating}
            onClick={handleContinue}
            className="min-w-32"
          >
            {isUpdating ? "Aplicando plantilla..." : "Continuar con plantilla"}
          </Button>
        </div>
      </div>
    </div>
  );
}