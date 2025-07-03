
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  RectangleHorizontal, 
  Square, 
  Image, 
  Type, 
  Palette,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Upload,
  X,
  Zap,
  Settings,
  Eye,
  EyeOff,
  Hash
} from "lucide-react";
import { cn } from "@/lib/utils";
import ImageUpload from "@/components/template/image-upload";
import { toast } from "sonner";

import { CertificateSize } from "../types";

interface TemplateSidebarProps {
  state: {
    certificateSize: CertificateSize;
    // LogoSettings
    logoUrl: string | null;
    logoWidth: number;
    logoHeight: number;
    // ContentSettings
    title: string;
    body1: string;
    body2: string;
    courseName: string;
    studentName: string;
    // BackgroundSettings
    orientation: string;
    backgroundUrl: string | null;
    overlayColor: string;
    // ColorSettings
    titleColor: string;
    bodyColor: string;
  };
  setters: {
    setCertificateSize: (size: CertificateSize) => void;
    // LogoSettings
    setLogoUrl: (url: string | null) => void;
    setLogoWidth: (width: number) => void;
    setLogoHeight: (height: number) => void;
    // ContentSettings
    setTitle: (value: string) => void;
    setBody1: (value: string) => void;
    setBody2: (value: string) => void;
    setCourseName: (value: string) => void;
    setStudentName: (value: string) => void;
    // BackgroundSettings
    setOrientation: (value: string) => void;
    setBackgroundUrl: (url: string | null) => void;
    setOverlayColor: (color: string) => void;
    // ColorSettings
    setTitleColor: (color: string) => void;
    setBodyColor: (color: string) => void;
  };
}


interface ConfigSection {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  isExpanded: boolean;
}

export const TemplateSidebar = ({ state, setters }: TemplateSidebarProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['format', 'content', 'colors']);
  const [logoLocked, setLogoLocked] = useState(true);

  const sections: ConfigSection[] = [
    {
      id: 'format',
      title: 'Formato del Certificado',
      description: 'Tamaño y orientación',
      icon: Square,
      color: 'blue',
      isExpanded: expandedSections.includes('format')
    },
    {
      id: 'content',
      title: 'Contenido y Texto',
      description: 'Títulos y textos principales',
      icon: Type,
      color: 'purple',
      isExpanded: expandedSections.includes('content')
    },
    {
      id: 'logo',
      title: 'Logo Institucional',
      description: 'Imagen y configuración',
      icon: Image,
      color: 'emerald',
      isExpanded: expandedSections.includes('logo')
    },
    {
      id: 'background',
      title: 'Fondo y Estilo',
      description: 'Colores e imagen de fondo',
      icon: Palette,
      color: 'orange',
      isExpanded: expandedSections.includes('background')
    },
    {
      id: 'colors',
      title: 'Colores del Texto',
      description: 'Personaliza los colores',
      icon: Type,
      color: 'violet',
      isExpanded: expandedSections.includes('colors')
    }
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const getSizeBadge = (size: CertificateSize) => {
    return size === 'landscape' ? 'Horizontal' : 'Cuadrado';
  };

  const handleLogoUpload = (url: string | null) => {
    setters.setLogoUrl(url);
    if (url) {
      // Set default size when uploading new logo
      setters.setLogoWidth(120);
      setters.setLogoHeight(120);
      toast.success('Logo cargado correctamente');
    }
  };

  const handleLogoSizeChange = (width: number, height: number) => {
    setters.setLogoWidth(width);
    if (logoLocked && width > 0) {
      const aspectRatio = state.logoWidth / state.logoHeight;
      setters.setLogoHeight(Math.round(width / aspectRatio));
    } else {
      setters.setLogoHeight(height);
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-slate-900 dark:via-slate-800/50 dark:to-slate-900">
      {/* Modern Status Overview */}
      <div className="p-4 space-y-3">
        <div className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-2xl p-4 border border-slate-200/60 dark:border-slate-700/60">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
              <Eye className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Estado Actual</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Configuración del certificado</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-slate-950 rounded-xl p-3 border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center gap-2 mb-1">
                {state.certificateSize === 'landscape' ? (
                  <RectangleHorizontal className="h-3 w-3 text-blue-600" />
                ) : (
                  <Square className="h-3 w-3 text-blue-600" />
                )}
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Formato</span>
              </div>
              <Badge variant="secondary" className="text-xs px-2 py-0.5">
                {getSizeBadge(state.certificateSize)}
              </Badge>
            </div>
            
            <div className="bg-white dark:bg-slate-950 rounded-xl p-3 border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center gap-2 mb-1">
                <Image className="h-3 w-3 text-emerald-600" />
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Logo</span>
              </div>
              <Badge 
                variant={state.logoUrl ? "default" : "outline"} 
                className="text-xs px-2 py-0.5"
              >
                {state.logoUrl ? "✓ Activo" : "Sin configurar"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <Separator className="mx-4" />

      {/* Modern Configuration Sections */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Certificate Format */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl border border-blue-200/60 dark:border-blue-700/60 overflow-hidden">
          <button
            onClick={() => toggleSection('format')}
            className="w-full p-4 flex items-center justify-between hover:bg-blue-100/50 dark:hover:bg-blue-900/20 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                {state.certificateSize === 'landscape' ? (
                  <RectangleHorizontal className="w-4 h-4 text-white" />
                ) : (
                  <Square className="w-4 h-4 text-white" />
                )}
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Formato del Certificado</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">Tamaño y orientación</p>
              </div>
            </div>
            {expandedSections.includes('format') ? (
              <ChevronDown className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            )}
          </button>
          
          {expandedSections.includes('format') && (
            <div className="p-4 pt-0 space-y-4">
              <div className="space-y-3">
                {[
                  { value: 'landscape', label: 'Horizontal', icon: RectangleHorizontal, desc: 'Formato apaisado' },
                  { value: 'square', label: 'Cuadrado', icon: Square, desc: 'Formato 1:1' }
                ].map((format) => {
                  const isSelected = state.certificateSize === format.value;
                  return (
                    <button
                      key={format.value}
                      onClick={() => setters.setCertificateSize(format.value as CertificateSize)}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02]",
                        isSelected
                          ? "bg-white dark:bg-slate-950 border-blue-500 shadow-lg ring-2 ring-blue-500/20"
                          : "bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 hover:border-blue-300"
                      )}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className={cn(
                          "p-2 rounded-lg",
                          isSelected ? "bg-blue-100 dark:bg-blue-900" : "bg-slate-100 dark:bg-slate-800"
                        )}>
                          <format.icon className={cn(
                            "w-5 h-5",
                            isSelected ? "text-blue-600" : "text-slate-600 dark:text-slate-400"
                          )} />
                        </div>
                        <div className="text-center">
                          <div className={cn(
                            "text-xs font-medium",
                            isSelected ? "text-blue-900 dark:text-blue-100" : "text-slate-700 dark:text-slate-300"
                          )}>
                            {format.label}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {format.desc}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-2xl border border-purple-200/60 dark:border-purple-700/60 overflow-hidden">
          <button
            onClick={() => toggleSection('content')}
            className="w-full p-4 flex items-center justify-between hover:bg-purple-100/50 dark:hover:bg-purple-900/20 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                <Type className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Contenido y Texto</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">Títulos y textos principales</p>
              </div>
            </div>
            {expandedSections.includes('content') ? (
              <ChevronDown className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            )}
          </button>
          
          {expandedSections.includes('content') && (
            <div className="p-4 pt-0 space-y-4">
              <div className="space-y-3">
                <div>
                  <Label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Título Principal
                  </Label>
                  <Input
                    value={state.title}
                    onChange={(e) => setters.setTitle(e.target.value)}
                    placeholder="Ej: Certificado de Participación"
                    className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                
                <div>
                  <Label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Texto Principal
                  </Label>
                  <Textarea
                    value={state.body1}
                    onChange={(e) => setters.setBody1(e.target.value)}
                    placeholder="Ej: Se otorga el presente certificado a:"
                    rows={2}
                    className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                
                <div>
                  <Label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Texto Secundario
                  </Label>
                  <Textarea
                    value={state.body2}
                    onChange={(e) => setters.setBody2(e.target.value)}
                    placeholder="Ej: Por haber completado exitosamente el curso de..."
                    rows={2}
                    className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                
                <div>
                  <Label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Estudiante
                  </Label>
                  <Input
                    value={state.studentName}
                    onChange={(e) => setters.setStudentName(e.target.value)}
                    placeholder="Ada Lovelace"
                    className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                
                <div>
                  <Label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Curso
                  </Label>
                  <Input
                    value={state.courseName}
                    onChange={(e) => setters.setCourseName(e.target.value)}
                    placeholder="Programación"
                    className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Logo Section */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-2xl border border-emerald-200/60 dark:border-emerald-700/60 overflow-hidden">
          <button
            onClick={() => toggleSection('logo')}
            className="w-full p-4 flex items-center justify-between hover:bg-emerald-100/50 dark:hover:bg-emerald-900/20 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg">
                <Image className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Logo Institucional</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">Imagen y configuración</p>
              </div>
            </div>
            {expandedSections.includes('logo') ? (
              <ChevronDown className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            )}
          </button>
          
          {expandedSections.includes('logo') && (
            <div className="p-4 pt-0 space-y-4">
              <div className="space-y-3">
                <div>
                  <Label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Subir Logo
                  </Label>
                  <ImageUpload
                    onUpload={handleLogoUpload}
                    label="Subir Logo"
                    tooltip="Arrastra tu logo aquí o haz clic para seleccionar un archivo"
                    className="bg-white dark:bg-slate-100 border-2 border-dashed border-emerald-300 dark:border-emerald-400 hover:border-emerald-500"
                  />
                  
                  {state.logoUrl && (
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-emerald-600">
                        <Zap className="w-3 h-3" />
                        Logo cargado correctamente
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setters.setLogoUrl(null);
                          toast.info('Logo eliminado');
                        }}
                        className="h-6 px-2 text-red-600 hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
                
                {state.logoUrl && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                        Tamaño del logo
                      </Label>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setLogoLocked(!logoLocked)}
                        className="h-6 px-2"
                      >
                        {logoLocked ? (
                          <Settings className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Hash className="w-3 h-3 text-slate-500" />
                        )}
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                          Ancho (px)
                        </Label>
                        <Input
                          type="number"
                          min="10"
                          max="500"
                          value={state.logoWidth}
                          onChange={(e) => handleLogoSizeChange(parseInt(e.target.value) || 0, state.logoHeight)}
                          className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">
                          Alto (px)
                        </Label>
                        <Input
                          type="number"
                          min="10"
                          max="500"
                          value={state.logoHeight}
                          onChange={(e) => handleLogoSizeChange(state.logoWidth, parseInt(e.target.value) || 0)}
                          className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700"
                          disabled={logoLocked}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Background Section */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 rounded-2xl border border-orange-200/60 dark:border-orange-700/60 overflow-hidden">
          <button
            onClick={() => toggleSection('background')}
            className="w-full p-4 flex items-center justify-between hover:bg-orange-100/50 dark:hover:bg-orange-900/20 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg">
                <Palette className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Fondo y Estilo</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">Colores e imagen de fondo</p>
              </div>
            </div>
            {expandedSections.includes('background') ? (
              <ChevronDown className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            )}
          </button>
          
          {expandedSections.includes('background') && (
            <div className="p-4 pt-0 space-y-4">
              <div className="space-y-3">
                <div>
                  <Label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Imagen de Fondo
                  </Label>
                  <ImageUpload
                    onUpload={setters.setBackgroundUrl}
                    label="Subir Fondo"
                    tooltip="Sube una imagen de fondo para tu certificado"
                    className="bg-white dark:bg-slate-100 border-2 border-dashed border-orange-300 dark:border-orange-400 hover:border-orange-500"
                  />
                  
                  {state.backgroundUrl && (
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-orange-600">
                        <Zap className="w-3 h-3" />
                        Fondo personalizado activo
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setters.setBackgroundUrl(null)}
                        className="h-6 px-2 text-red-600 hover:text-red-700"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
                
                <div>
                  <Label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Color del Contenedor
                  </Label>
                  
                  {/* Color Picker y Input Manual */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={(() => {
                          if (state.overlayColor.startsWith('rgba')) {
                            const match = state.overlayColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+),/);
                            if (match) {
                              const r = parseInt(match[1]).toString(16).padStart(2, '0');
                              const g = parseInt(match[2]).toString(16).padStart(2, '0');
                              const b = parseInt(match[3]).toString(16).padStart(2, '0');
                              return `#${r}${g}${b}`;
                            }
                          }
                          if (state.overlayColor.startsWith('#')) {
                            return state.overlayColor;
                          }
                          return '#ffffff';
                        })()}
                        onChange={(e) => {
                          const hex = e.target.value;
                          const r = parseInt(hex.slice(1, 3), 16);
                          const g = parseInt(hex.slice(3, 5), 16);
                          const b = parseInt(hex.slice(5, 7), 16);
                          
                          // Mantener el alpha actual o usar 0.95 por defecto
                          let alpha = 0.95;
                          if (state.overlayColor.startsWith('rgba')) {
                            const match = state.overlayColor.match(/rgba\([^,]+,[^,]+,[^,]+,\s*([^)]+)\)/);
                            if (match) alpha = parseFloat(match[1]);
                          }
                          
                          setters.setOverlayColor(`rgba(${r}, ${g}, ${b}, ${alpha})`);
                        }}
                        className="w-12 h-12 rounded-xl border-2 border-slate-200 dark:border-slate-700 cursor-pointer"
                      />
                      <div className="flex-1">
                        <Input
                          value={state.overlayColor}
                          onChange={(e) => setters.setOverlayColor(e.target.value)}
                          placeholder="rgba(255, 255, 255, 0.95)"
                          className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700 text-xs"
                        />
                      </div>
                    </div>
                    
                    {/* Control de Transparencia */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-xs text-slate-600 dark:text-slate-400">
                          Transparencia
                        </Label>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                          {(() => {
                            if (state.overlayColor.startsWith('rgba')) {
                              const match = state.overlayColor.match(/rgba\([^,]+,[^,]+,[^,]+,\s*([^)]+)\)/);
                              if (match) return Math.round(parseFloat(match[1]) * 100) + '%';
                            }
                            return '95%';
                          })()}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={(() => {
                          if (state.overlayColor.startsWith('rgba')) {
                            const match = state.overlayColor.match(/rgba\([^,]+,[^,]+,[^,]+,\s*([^)]+)\)/);
                            if (match) return parseFloat(match[1]);
                          }
                          return 0.95;
                        })()}
                        onChange={(e) => {
                          const alpha = parseFloat(e.target.value);
                          
                          // Extraer RGB actual
                          let r = 255, g = 255, b = 255;
                          if (state.overlayColor.startsWith('rgba')) {
                            const match = state.overlayColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+),/);
                            if (match) {
                              r = parseInt(match[1]);
                              g = parseInt(match[2]);
                              b = parseInt(match[3]);
                            }
                          } else if (state.overlayColor.startsWith('#')) {
                            const hex = state.overlayColor;
                            r = parseInt(hex.slice(1, 3), 16);
                            g = parseInt(hex.slice(3, 5), 16);
                            b = parseInt(hex.slice(5, 7), 16);
                          }
                          
                          setters.setOverlayColor(`rgba(${r}, ${g}, ${b}, ${alpha})`);
                        }}
                        className="w-full h-2 bg-gradient-to-r from-transparent to-current rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, transparent, ${(() => {
                            if (state.overlayColor.startsWith('rgba')) {
                              const match = state.overlayColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+),/);
                              if (match) {
                                return `rgb(${match[1]}, ${match[2]}, ${match[3]})`;
                              }
                            }
                            return state.overlayColor.startsWith('#') ? state.overlayColor : '#ffffff';
                          })()})`
                        }}
                      />
                    </div>
                    
                    {/* Presets de colores RGBA */}
                    <div>
                      <Label className="text-xs text-slate-500 dark:text-slate-400 mb-2 block">
                        Presets rápidos:
                      </Label>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { name: 'Blanco', color: 'rgba(255, 255, 255, 0.95)' },
                          { name: 'Negro', color: 'rgba(0, 0, 0, 0.8)' },
                          { name: 'Azul', color: 'rgba(59, 130, 246, 0.9)' },
                          { name: 'Verde', color: 'rgba(34, 197, 94, 0.85)' },
                        ].map((preset) => (
                          <Button
                            key={preset.name}
                            variant="outline"
                            size="sm"
                            onClick={() => setters.setOverlayColor(preset.color)}
                            className="text-xs h-8 p-1"
                          >
                            {preset.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Colors Section */}
        <div className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 rounded-2xl border border-violet-200/60 dark:border-violet-700/60 overflow-hidden">
          <button
            onClick={() => toggleSection('colors')}
            className="w-full p-4 flex items-center justify-between hover:bg-violet-100/50 dark:hover:bg-violet-900/20 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg">
                <Palette className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Colores del Texto</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">Personaliza los colores</p>
              </div>
            </div>
            {expandedSections.includes('colors') ? (
              <ChevronDown className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            )}
          </button>
          
          {expandedSections.includes('colors') && (
            <div className="p-4 pt-0 space-y-4">
              <div className="space-y-3">
                <div>
                  <Label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Color del Título
                  </Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={state.titleColor}
                      onChange={(e) => setters.setTitleColor(e.target.value)}
                      className="w-10 h-10 rounded-xl border-2 border-slate-200 dark:border-slate-700 cursor-pointer"
                    />
                    <div className="flex-1">
                      <Input
                        value={state.titleColor}
                        onChange={(e) => setters.setTitleColor(e.target.value)}
                        placeholder="#1e40af"
                        className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700 text-xs"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Color del Texto
                  </Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={state.bodyColor}
                      onChange={(e) => setters.setBodyColor(e.target.value)}
                      className="w-10 h-10 rounded-xl border-2 border-slate-200 dark:border-slate-700 cursor-pointer"
                    />
                    <div className="flex-1">
                      <Input
                        value={state.bodyColor}
                        onChange={(e) => setters.setBodyColor(e.target.value)}
                        placeholder="#6b7280"
                        className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700 text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-xs text-slate-500 dark:text-slate-400 mb-2 block">
                    Presets de colores:
                  </Label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { name: 'Azul', title: '#1e40af', body: '#6b7280' },
                      { name: 'Verde', title: '#059669', body: '#6b7280' },
                      { name: 'Púrpura', title: '#7c3aed', body: '#6b7280' },
                      { name: 'Naranja', title: '#ea580c', body: '#6b7280' },
                    ].map((preset) => (
                      <Button
                        key={preset.name}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setters.setTitleColor(preset.title);
                          setters.setBodyColor(preset.body);
                        }}
                        className="text-xs h-8 p-1"
                      >
                        {preset.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
