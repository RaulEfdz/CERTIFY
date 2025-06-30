'use client';

import { useState } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { ColorPicker } from '@/components/ui/color-picker';

type FontFamily = 'Arial' | 'Times New Roman' | 'Courier New' | 'Georgia' | 'Verdana';

type Template = {
  title: string;
  recipientName: string;
  description: string;
  date: string;
  signature: string;
  styles: {
    fontFamily: FontFamily;
    fontSize: number;
    textColor: string;
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    padding: number;
  };
};

export function CertificateEditor() {
  const [template, setTemplate] = useState<Template>({
    title: 'Certificado de Participación',
    recipientName: 'Nombre del Participante',
    description: 'Por haber completado exitosamente el curso de...',
    date: new Date().toLocaleDateString(),
    signature: 'Firma del Director',
    styles: {
      fontFamily: 'Arial' as FontFamily,
      fontSize: 16,
      textColor: '#000000',
      backgroundColor: '#ffffff',
      borderColor: '#000000',
      borderWidth: 2,
      padding: 40,
    },
  });

  const handleChange = <K extends keyof Omit<Template, 'styles'>>(
    field: K,
    value: Template[K]
  ) => {
    setTemplate(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStyleChange = <K extends keyof Template['styles']>(
    field: K,
    value: Template['styles'][K]
  ) => {
    setTemplate(prev => ({
      ...prev,
      styles: {
        ...prev.styles,
        [field]: value
      }
    }));
  };

  const handleColorSelect = (color: string, field: 'textColor' | 'backgroundColor' | 'borderColor') => {
    handleStyleChange(field, color);
  };

  // Helper function to handle color picker changes with proper typing
  const handleColorChange = (color: string, field: 'textColor' | 'backgroundColor' | 'borderColor') => {
    handleStyleChange(field, color);
  };

  // Type guard for color string
  const isColorString = (value: unknown): value is string => {
    return typeof value === 'string' && /^#([0-9A-F]{3}){1,2}$/i.test(value);
  };

  return (
    <div className="flex h-full">
      {/* Sidebar de propiedades */}
      <div className="w-80 border-r h-[calc(100vh-4rem)]">
        <ScrollArea className="h-full p-4">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="content">Contenido</TabsTrigger>
              <TabsTrigger value="design">Diseño</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título del Certificado</Label>
                <Input
                  id="title"
                  value={template.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <textarea
                  id="description"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={template.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signature">Firma</Label>
                <Input
                  id="signature"
                  value={template.signature}
                  onChange={(e) => handleChange('signature', e.target.value)}
                />
              </div>
            </TabsContent>

            <TabsContent value="design" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Fuente</Label>
                <select
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={template.styles.fontFamily}
                  onChange={(e) => handleStyleChange('fontFamily', e.target.value as FontFamily)}
                >
                  <option value="Arial">Arial</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Verdana">Verdana</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Tamaño de fuente: {template.styles.fontSize}px</Label>
                <Slider
                  min={12}
                  max={48}
                  step={1}
                  value={[template.styles.fontSize]}
                  onValueChange={([value]) => handleStyleChange('fontSize', value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Color del texto</Label>
                <ColorPicker
                  color={template.styles.textColor}
                  onChange={(color: string) => handleColorChange(color, 'textColor')}
                />
              </div>

              <div className="space-y-2">
                <Label>Color de fondo</Label>
                <ColorPicker
                  color={template.styles.backgroundColor}
                  onChange={(color: string) => handleColorChange(color, 'backgroundColor')}
                />
              </div>

              <div className="space-y-2">
                <Label>Borde: {template.styles.borderWidth}px</Label>
                <Slider
                  min={0}
                  max={10}
                  step={1}
                  value={[template.styles.borderWidth]}
                  onValueChange={([value]) => handleStyleChange('borderWidth', value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Color del borde</Label>
                <ColorPicker
                  color={template.styles.borderColor}
                  onChange={(color: string) => handleColorSelect(color, 'borderColor')}
                />
              </div>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </div>

      {/* Vista previa del certificado */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div 
          className="relative w-full max-w-3xl aspect-[1.41/1] bg-muted shadow-lg flex flex-col items-center justify-center p-12 text-center"
          style={{
            backgroundColor: template.styles.backgroundColor,
            border: `${template.styles.borderWidth}px solid ${template.styles.borderColor}`,
            padding: `${template.styles.padding}px`,
            fontFamily: template.styles.fontFamily,
            color: template.styles.textColor,
          }}
        >
          <h1 
            className="text-4xl font-bold mb-6"
            style={{ fontSize: `${template.styles.fontSize * 1.5}px` }}
          >
            {template.title}
          </h1>
          
          <p className="text-xl mb-8">Se otorga el presente certificado a:</p>
          
          <div 
            className="border-b-2 border-gray-300 w-3/4 mb-8 py-2"
            style={{ borderColor: template.styles.textColor }}
          >
            <p className="text-2xl font-semibold">{template.recipientName}</p>
          </div>
          
          <p className="mb-8" style={{ fontSize: `${template.styles.fontSize}px` }}>
            {template.description}
          </p>
          
          <div className="mt-12 w-full flex justify-between">
            <div className="w-1/3">
              <div className="h-20 border-t-2 border-gray-400 mt-2" style={{ borderColor: template.styles.textColor }}></div>
              <p className="mt-2">{template.signature}</p>
            </div>
            <div className="w-1/3">
              <p className="mt-2">Fecha: {template.date}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
