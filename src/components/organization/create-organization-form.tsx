'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/icons';
import { ImageUpload } from '@/components/image-upload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Esquema de validación mejorado
const formSchema = z.object({
  name: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .trim(),
  website: z
    .string()
    .trim()
    .optional()
    .refine((val) => {
      if (!val || val === '') return true;
      try {
        new URL(val);
        return true;
      } catch {
        return false;
      }
    }, 'Ingrese una URL válida (ej: https://ejemplo.com)')
    .or(z.literal('')),
  logoFile: z
    .any()
    .refine((file) => {
      if (!file) return true;
      return file instanceof File && file.type.startsWith('image/');
    }, 'El archivo debe ser una imagen válida')
    .refine((file) => {
      if (!file) return true;
      return file.size <= 5 * 1024 * 1024; // 5MB máximo
    }, 'El archivo no debe exceder 5MB')
    .optional()
    .nullable(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateOrganizationFormProps {
  onSuccess?: (organization: any) => void;
  onCancel?: () => void;
  className?: string;
}

interface CloudinaryResponse {
  public_id: string;
  secure_url: string;
  version: number;
  format: string;
}

interface OrganizationData {
  name: string;
  website: string | null;
  logo: {
    publicId: string;
    url: string;
    version: number;
    format: string;
  } | null;
}

export function CreateOrganizationForm({ 
  onSuccess, 
  onCancel,
  className 
}: CreateOrganizationFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      website: '',
      logoFile: null,
    },
    mode: 'onChange', // Validación en tiempo real
  });

  // Función para manejar la subida de imagen con mejor manejo de errores
  const handleImageUpload = useCallback(async (file: File) => {
    try {
      // Validaciones adicionales
      if (!file.type.startsWith('image/')) {
        form.setError('logoFile', {
          type: 'manual',
          message: 'El archivo debe ser una imagen (JPG, PNG, GIF, etc.)',
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        form.setError('logoFile', {
          type: 'manual',
          message: 'El archivo no debe exceder 5MB',
        });
        return;
      }
      
      // Crear vista previa
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Limpiar errores y establecer el archivo
      form.clearErrors('logoFile');
      form.setValue('logoFile', file, { shouldValidate: true });
      
    } catch (error) {
      console.error('Error al procesar la imagen:', error);
      form.setError('logoFile', {
        type: 'manual',
        message: 'Error al procesar la imagen',
      });
    }
  }, [form]);

  // Función para remover imagen
  const removeImage = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    form.setValue('logoFile', null);
  }, [previewUrl, form]);

  // Función para subir imagen a Cloudinary
  const uploadImageToCloudinary = async (file: File): Promise<CloudinaryResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');
    formData.append('folder', 'organization');
    formData.append('api_key', '831188196434165'); // Tu API Key
    
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
      throw new Error('Configuración de Cloudinary no encontrada');
    }
    
    // Usar autenticación firmada
    const timestamp = Math.round((new Date).getTime()/1000);
    formData.append('timestamp', timestamp.toString());
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error de Cloudinary:', errorData);
      throw new Error(errorData.error?.message || 'Error al subir la imagen');
    }
    
    return response.json();
  };

  // Función para crear organización en la API
  const createOrganization = async (data: OrganizationData) => {
    const response = await fetch('/api/organizations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Error al crear la organización');
    }
    
    return response.json();
  };

  // Función principal de envío del formulario
  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setUploadProgress(0);
    
    try {
      let logoData = null;
      
      // Subir imagen si existe
      if (values.logoFile) {
        setUploadProgress(25);
        const imageData = await uploadImageToCloudinary(values.logoFile);
        setUploadProgress(50);
        
        logoData = {
          publicId: imageData.public_id,
          url: imageData.secure_url,
          version: imageData.version,
          format: imageData.format,
        };
      }
      
      // Crear organización
      setUploadProgress(75);
      const organizationData: OrganizationData = {
        name: values.name.trim(),
        website: values.website?.trim() || null,
        logo: logoData,
      };
      
      const result = await createOrganization(organizationData);
      setUploadProgress(100);
      
      toast.success('Organización creada exitosamente');
      
      if (onSuccess) {
        onSuccess(result.organization);
      } else {
        router.push('/dashboard/organization');
        router.refresh();
      }
      
    } catch (error) {
      console.error('Error al crear la organización:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Error desconocido al crear la organización';
      
      toast.error(errorMessage);
      
      // Si hay error con la imagen, limpiar el preview
      if (errorMessage.includes('imagen') || errorMessage.includes('Cloudinary')) {
        removeImage();
      }
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const isFormValid = form.formState.isValid;
  const hasErrors = Object.keys(form.formState.errors).length > 0;

  return (
    <Card className={className}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-gray-900">Crear organización</CardTitle>
        <CardDescription className="text-gray-600">
          Complete la información de su organización para comenzar a emitir certificados.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Columna izquierda - Logo */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="logoFile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900 text-base">Logo de la organización</FormLabel>
                        <FormDescription className="text-gray-600 text-sm">
                          Suba una imagen cuadrada (máx. 5MB). Formato recomendado: 512x512px.
                        </FormDescription>
                        <FormControl>
                          <div className="mt-2">
                            <ImageUpload
                              value={previewUrl}
                              onChange={handleImageUpload}
                              onRemove={removeImage}
                              disabled={isLoading}
                              maxSize={5 * 1024 * 1024} // 5MB
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-sm" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* Columna derecha - Campos del formulario */}
              <div className="space-y-6">
                {/* Campo para el nombre */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900 text-base">Nombre de la organización *</FormLabel>
                        <FormDescription className="text-gray-600 text-sm">
                          Ingrese el nombre completo de su organización (3-100 caracteres).
                        </FormDescription>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isLoading}
                            placeholder="Ej: Mi Empresa S.A."
                            maxLength={100}
                            autoComplete="organization"
                            className="mt-1"
                          />
                        </FormControl>
                        <FormMessage className="text-sm" />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Campo para el sitio web */}
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900 text-base">Sitio web</FormLabel>
                        <FormDescription className="text-gray-600 text-sm">
                          URL del sitio web de la organización (opcional).
                        </FormDescription>
                        <FormControl>
                          <Input
                            {...field}
                            type="url"
                            disabled={isLoading}
                            placeholder="https://ejemplo.com"
                            value={field.value || ''}
                            autoComplete="url"
                            className="mt-1"
                          />
                        </FormControl>
                        <FormMessage className="text-sm" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Barra de progreso durante la carga */}
            {isLoading && uploadProgress > 0 && (
              <div className="col-span-full space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Creando organización...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
            
            {/* Botones de acción */}
            <div className="col-span-full flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4 border-t">
              {onCancel && (
                <Button 
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                  className="w-full sm:w-auto bg-muted hover:bg-muted/50 text-foreground border-border hover:border-border/80"
                >
                  Cancelar
                </Button>
              )}
              <Button 
                type="submit" 
                disabled={isLoading || !isFormValid}
                className="w-full sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  'Crear organización'
                )}
              </Button>
            </div>
            
            {/* Mensaje de ayuda si hay errores */}
            {hasErrors && !isLoading && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-100">
                Por favor, corrija los errores antes de continuar.
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}