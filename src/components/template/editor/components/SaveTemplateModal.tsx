"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Save, Loader2, Check, AlertCircle, Tag, FileText, FolderOpen } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SaveTemplateModalProps {
  children: React.ReactNode;
  templateConfig: any;
  templateHtml: string;
  onSave?: (templateData: SaveTemplateData) => Promise<boolean>;
  initialName?: string;
  initialDescription?: string;
}

export interface SaveTemplateData {
  name: string;
  description: string;
  category: string;
  tags: string[];
  config: any;
  html: string;
  isPublic: boolean;
}

const categories = [
  "Académico",
  "Profesional", 
  "Reconocimiento",
  "Participación",
  "Empresarial",
  "Deportivo",
  "Otro"
];

const suggestedTags = [
  "curso", "diploma", "certificado", "logro", "graduación",
  "empresa", "profesional", "evento", "conferencia", "taller",
  "competencia", "premio", "reconocimiento", "participación"
];

export function SaveTemplateModal({ children, templateConfig, templateHtml, onSave, initialName, initialDescription }: SaveTemplateModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: initialName || "",
    description: initialDescription || "",
    category: "",
    tags: [] as string[],
    isPublic: false
  });

  const [newTag, setNewTag] = useState("");

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError("El nombre de la plantilla es requerido");
      return;
    }

    if (!formData.category) {
      setError("Selecciona una categoría");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const templateData: SaveTemplateData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        tags: formData.tags,
        config: templateConfig,
        html: templateHtml,
        isPublic: formData.isPublic
      };

      const success = onSave ? await onSave(templateData) : true;
      
      if (success) {
        setSaved(true);
        setTimeout(() => {
          setOpen(false);
          setSaved(false);
          setFormData({
            name: "",
            description: "",
            category: "",
            tags: [],
            isPublic: false
          });
        }, 2000);
      } else {
        setError("Error al guardar la plantilla. Inténtalo de nuevo.");
      }
    } catch (err) {
      setError("Error inesperado al guardar la plantilla");
    } finally {
      setSaving(false);
    }
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag]
      }));
    }
    setNewTag("");
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const addSuggestedTag = (tag: string) => {
    addTag(tag);
  };

  if (saved) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-md bg-background">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">¡Plantilla Guardada!</h3>
            <p className="text-muted-foreground">
              Tu plantilla "{formData.name}" se ha guardado exitosamente.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto bg-background">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            Guardar Plantilla
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Basic Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Nombre de la Plantilla *
                  </Label>
                  <Input
                    id="name"
                    placeholder="Ej: Certificado de Curso Profesional"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Descripción
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe para qué se usará esta plantilla..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="mt-2"
                    rows={3}
                  />
                </div>

                <div>
                  <Label className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4" />
                    Categoría *
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Label className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Etiquetas
                </Label>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Agregar etiqueta..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag(newTag);
                      }
                    }}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addTag(newTag)}
                    disabled={!newTag.trim()}
                  >
                    Agregar
                  </Button>
                </div>

                {/* Current Tags */}
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => removeTag(tag)}
                      >
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Suggested Tags */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Etiquetas sugeridas:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedTags
                      .filter(tag => !formData.tags.includes(tag))
                      .slice(0, 8)
                      .map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="cursor-pointer hover:bg-muted"
                          onClick={() => addSuggestedTag(tag)}
                        >
                          + {tag}
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <h4 className="font-medium">Información de la plantilla:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div>
                    <p><strong>Formato:</strong> {templateConfig?.certificateSize === "landscape" ? "Horizontal" : "Cuadrado"}</p>
                    <p><strong>Logo:</strong> {templateConfig?.logoUrl ? "Incluido" : "Sin logo"}</p>
                  </div>
                  <div>
                    <p><strong>Fondo:</strong> {templateConfig?.backgroundUrl ? "Imagen personalizada" : "Color sólido"}</p>
                    <p><strong>Tamaño:</strong> ~{Math.round(templateHtml.length / 1024)}KB</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            className="flex-1"
            onClick={handleSave}
            disabled={loading || !formData.name.trim() || !formData.category}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Guardar Plantilla
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}