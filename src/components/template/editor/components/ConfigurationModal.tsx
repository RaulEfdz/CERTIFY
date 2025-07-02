"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings2, Palette, Type, Image, Layout, Save, Eye } from "lucide-react";

import { SizeToggle } from "./SizeToggle";
import { LogoSettings } from "./sidebar/LogoSettings";
import { ContentSettings } from "./sidebar/ContentSettings";
import { BackgroundSettings } from "./sidebar/BackgroundSettings";

interface ConfigurationModalProps {
  state: any;
  setters: any;
  templateHtml: string;
  children: React.ReactNode;
}

export function ConfigurationModal({ state, setters, templateHtml, children }: ConfigurationModalProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("layout");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="max-w-5xl h-[85vh] p-0 overflow-hidden bg-background">
        <div className="flex h-full">
          {/* Configuration Panel */}
          <div className="w-1/2 flex flex-col border-r">
            <DialogHeader className="p-6 border-b">
              <DialogTitle className="flex items-center gap-2">
                <Settings2 className="h-5 w-5" />
                Configuración de Plantilla
              </DialogTitle>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
                <TabsList className="grid w-full grid-cols-4 m-6 mb-4">
                  <TabsTrigger value="layout" className="flex items-center gap-2">
                    <Layout className="h-4 w-4" />
                    <span className="hidden sm:inline">Diseño</span>
                  </TabsTrigger>
                  <TabsTrigger value="content" className="flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    <span className="hidden sm:inline">Contenido</span>
                  </TabsTrigger>
                  <TabsTrigger value="style" className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    <span className="hidden sm:inline">Estilo</span>
                  </TabsTrigger>
                  <TabsTrigger value="assets" className="flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    <span className="hidden sm:inline">Recursos</span>
                  </TabsTrigger>
                </TabsList>

                {/* Layout Tab */}
                <TabsContent value="layout" className="px-6 pb-6 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Layout className="h-4 w-4" />
                        Formato del Certificado
                      </CardTitle>
                      <CardDescription>
                        Configura las dimensiones y orientación del certificado
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Tamaño</label>
                          <SizeToggle 
                            value={state.certificateSize} 
                            onChange={setters.setCertificateSize} 
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="p-3 bg-muted rounded-lg">
                            <p className="font-medium">Horizontal</p>
                            <p className="text-muted-foreground">11" × 8.5" (A4)</p>
                          </div>
                          <div className="p-3 bg-muted rounded-lg">
                            <p className="font-medium">Cuadrado</p>
                            <p className="text-muted-foreground">8.5" × 8.5"</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Configuración Avanzada</CardTitle>
                      <CardDescription>
                        Opciones adicionales de diseño
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Márgenes automáticos</span>
                          <Badge variant="outline">Activado</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Optimización para impresión</span>
                          <Badge variant="outline">Activado</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Compatibilidad móvil</span>
                          <Badge variant="outline">Activado</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Content Tab */}
                <TabsContent value="content" className="px-6 pb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Type className="h-4 w-4" />
                        Contenido del Certificado
                      </CardTitle>
                      <CardDescription>
                        Edita los textos y contenido que aparecerán en el certificado
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ContentSettings state={state} setters={setters} />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Style Tab */}
                <TabsContent value="style" className="px-6 pb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        Fondo y Colores
                      </CardTitle>
                      <CardDescription>
                        Personaliza los colores y el fondo del certificado
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <BackgroundSettings state={state} setters={setters} />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Assets Tab */}
                <TabsContent value="assets" className="px-6 pb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Image className="h-4 w-4" />
                        Logo y Recursos
                      </CardTitle>
                      <CardDescription>
                        Agrega y configura el logo de tu organización
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <LogoSettings state={state} setters={setters} />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Actions */}
            <div className="p-6 border-t bg-muted/50">
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setOpen(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => setOpen(false)}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Aplicar Cambios
                </Button>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="w-1/2 flex flex-col">
            <div className="p-6 border-b bg-background">
              <h3 className="font-semibold flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Vista Previa en Tiempo Real
              </h3>
            </div>
            
            <div className="flex-1 p-6 overflow-auto bg-muted/30">
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-full max-w-md aspect-[1.4/1] bg-white rounded-lg shadow-lg overflow-hidden">
                  <iframe
                    srcDoc={templateHtml}
                    className="w-full h-full border-0"
                    style={{ transform: 'scale(0.8)', transformOrigin: 'top left' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}