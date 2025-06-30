"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { TemplateInitializer } from "@/components/template/TemplateInitializer";
import { TemplateConfig } from "@/components/template/editor/types";
import { createClient } from "@/lib/supabase/client";
import { mockDatabase, mockAuth } from "@/lib/mock-db";
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  config: TemplateConfig;
  html: string;
  status: string;
  is_public: boolean;
  created_by: string;
  organization_id: string | null;
  auto_save_data: any;
  version: number;
  created_at: string;
  updated_at: string;
  last_saved_at: string;
}

export default function EditTemplatePage() {
  const params = useParams();
  const router = useRouter();
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const templateId = params.id as string;

  useEffect(() => {
    if (!templateId) {
      setError("Template ID is required");
      setLoading(false);
      return;
    }

    loadTemplate();
  }, [templateId]);

  const loadTemplate = async () => {
    try {
      setLoading(true);
      setError(null);

      const supabase = createClient();
      
      // Verificar autenticación usando mock
      const { data: { user }, error: authError } = await mockAuth.getUser();
      if (authError || !user) {
        router.push('/auth/login');
        return;
      }

      // Cargar la plantilla usando mock database
      const { data, error: fetchError } = await mockDatabase.getTemplate(templateId);

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          setNotFound(true);
        } else {
          setError('Error loading template: ' + fetchError.message);
        }
        return;
      }

      if (!data) {
        setNotFound(true);
        return;
      }

      // Para el mock, siempre permitir editar (en producción verificar permisos reales)
      // if (data.created_by !== user.id) {
      //   setError("You don't have permission to edit this template");
      //   return;
      // }

      setTemplate(data);
    } catch (err) {
      console.error('Error loading template:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading template...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Template not found</h1>
          <p className="text-muted-foreground mb-6">
            The template you're looking for doesn't exist or has been deleted.
          </p>
          <Button onClick={() => router.push('/templates')} className="w-full">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Templates
          </Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="max-w-md w-full px-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="mb-4">
              {error}
            </AlertDescription>
          </Alert>
          <div className="flex gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => router.push('/templates')}
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Templates
            </Button>
            <Button 
              onClick={loadTemplate}
              className="flex-1"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!template) {
    return null;
  }

  return (
    <TemplateInitializer 
      templateId={templateId}
      initialTemplate={template}
      onTemplateUpdate={(updatedTemplate) => setTemplate(updatedTemplate)}
    />
  );
}