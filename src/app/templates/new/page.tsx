"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { mockDatabase, mockAuth } from "@/lib/mock-db";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function NewTemplatePage() {
  const router = useRouter();
  const [creating, setCreating] = useState(true);

  useEffect(() => {
    createNewTemplate();
  }, []);

  const createNewTemplate = async () => {
    try {
      setCreating(true);
      const supabase = createClient();

      // Verificar autenticación usando mock
      const { data: { user }, error: authError } = await mockAuth.getUser();
      if (authError || !user) {
        router.push('/auth/login');
        return;
      }

      // Crear una nueva plantilla usando mock database (para demo)
      const { data, error } = await mockDatabase.createTemplate({
        name: 'Nueva Plantilla',
        description: 'Plantilla de certificado personalizable',
        category: 'Académico',
        tags: [],
        config: {
          orientation: 'landscape',
          logoUrl: '',
          logoWidth: 150,
          logoHeight: 150,
          backgroundUrl: null,
          title: 'Certificado de Finalización',
          body1: 'Este certificado se presenta con orgullo a',
          body2: 'por haber completado exitosamente el curso',
          courseName: 'Desarrollo Web Avanzado',
          studentName: 'Nombre del Estudiante',
          directorName: 'Firma del Director',
          signatures: [
            { imageUrl: 'https://placehold.co/150x50/blue/white?text=Firma1', dataAiHint: 'signature autograph' },
            { imageUrl: 'https://placehold.co/150x50/green/white?text=Firma2', dataAiHint: 'signature autograph' }
          ],
          overlayColor: 'transparent',
          certificateSize: 'landscape',
          titleColor: '#111827',
          bodyColor: '#374151',
          customCss: '',
          customJs: '',
          date: new Date().toISOString(),
          dateLocale: 'es-ES'
        },
        html: '',
        status: 'draft',
        is_public: false
      });

      if (error) {
        console.error('Error creating template:', error);
        toast.error("Error al crear la plantilla");
        router.push('/templates');
        return;
      }

      // Redirigir al editor con el ID de la nueva plantilla
      toast.success("Plantilla creada exitosamente");
      router.replace(`/templates/edit/${data.id}`);

    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error("Error inesperado al crear la plantilla");
      router.push('/templates');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Creando nueva plantilla...</p>
        <p className="text-sm text-muted-foreground mt-2">
          Te redirigiremos al editor en un momento
        </p>
      </div>
    </div>
  );
}