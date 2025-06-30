'use client';

import { useState } from 'react';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { ColorPicker } from '@/components/ui/color-picker';
import { ChevronDown, ChevronUp, Eye, EyeOff, ChevronLeft, ChevronRight, Settings } from 'lucide-react';

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

  // UI state for collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    typography: true,
    colors: true,
    border: true,
  });

  // State for hiding/showing slider controls
  const [showSliderControls, setShowSliderControls] = useState(true);
  
  // State for hiding/showing entire sidebar
  const [showSidebar, setShowSidebar] = useState(true);

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

  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Enhanced slider component with better UX
  const EnhancedSlider = ({ 
    label, 
    value, 
    min, 
    max, 
    step = 1, 
    unit = '', 
    onChange,
    showValue = true 
  }: {
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    unit?: string;
    onChange: (value: number) => void;
    showValue?: boolean;
  }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        {showValue && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              {value}{unit}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => onChange(min + (max - min) / 2)}
              title="Restablecer a valor medio"
            >
              ↺
            </Button>
          </div>
        )}
      </div>
      <div className="relative">
        <Slider
          min={min}
          max={max}
          step={step}
          value={[value]}
          onValueChange={([newValue]) => onChange(newValue)}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{min}{unit}</span>
          <span>{max}{unit}</span>
        </div>
      </div>
    </div>
  );

  // Collapsible section component
  const CollapsibleSection = ({ 
    title, 
    isExpanded, 
    onToggle, 
    children 
  }: {
    title: string;
    isExpanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
  }) => (
    <div className="border border-border rounded-lg">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-muted/50 transition-colors"
      >
        <span className="font-medium text-sm">{title}</span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>
      {isExpanded && (
        <div className="p-3 pt-0 space-y-4">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-full relative">
      {/* Sidebar de propiedades */}
      <div className={`${showSidebar ? 'w-80' : 'w-0'} border-r h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out overflow-hidden`}>
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
              {/* Toggle button for slider controls */}
              <div className="flex items-center justify-between mb-4">
                <Label className="text-sm font-medium">Controles de diseño</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSliderControls(!showSliderControls)}
                  className="h-8 px-2"
                >
                  {showSliderControls ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-1" />
                      Ocultar
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-1" />
                      Mostrar
                    </>
                  )}
                </Button>
              </div>

              {showSliderControls && (
                <div className="space-y-4">
                  {/* Typography Section */}
                  <CollapsibleSection
                    title="Tipografía"
                    isExpanded={expandedSections.typography}
                    onToggle={() => toggleSection('typography')}
                  >
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

                    <EnhancedSlider
                      label="Tamaño de fuente"
                      value={template.styles.fontSize}
                      min={12}
                      max={48}
                      step={1}
                      unit="px"
                      onChange={(value) => handleStyleChange('fontSize', value)}
                    />
                  </CollapsibleSection>

                  {/* Colors Section */}
                  <CollapsibleSection
                    title="Colores"
                    isExpanded={expandedSections.colors}
                    onToggle={() => toggleSection('colors')}
                  >
                    <div className="space-y-4">
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
                    </div>
                  </CollapsibleSection>

                  {/* Border Section */}
                  <CollapsibleSection
                    title="Borde"
                    isExpanded={expandedSections.border}
                    onToggle={() => toggleSection('border')}
                  >
                    <div className="space-y-4">
                      <EnhancedSlider
                        label="Grosor del borde"
                        value={template.styles.borderWidth}
                        min={0}
                        max={10}
                        step={1}
                        unit="px"
                        onChange={(value) => handleStyleChange('borderWidth', value)}
                      />
                      
                      <div className="space-y-2">
                        <Label>Color del borde</Label>
                        <ColorPicker
                          color={template.styles.borderColor}
                          onChange={(color: string) => handleColorSelect(color, 'borderColor')}
                        />
                      </div>
                    </div>
                  </CollapsibleSection>
                </div>
              )}

              {!showSliderControls && (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground mb-2">
                    Los controles de diseño están ocultos
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSliderControls(true)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Mostrar controles
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </div>

      {/* Toggle button for sidebar */}
      <div className="absolute top-4 left-4 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSidebar(!showSidebar)}
          className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border shadow-lg"
        >
          {showSidebar ? (
            <>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Ocultar Panel
            </>
          ) : (
            <>
              <Settings className="h-4 w-4 mr-1" />
              Mostrar Panel
            </>
          )}
        </Button>
      </div>

      {/* Floating toggle button when sidebar is hidden */}
      {!showSidebar && (
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowSidebar(true)}
            className="w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 border-2 border-background"
            title="Mostrar panel de propiedades"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Vista previa del certificado */}
      <div className={`flex-1 flex items-center justify-center p-8 transition-all duration-300 ease-in-out ${!showSidebar ? 'pl-20' : ''}`}>
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
