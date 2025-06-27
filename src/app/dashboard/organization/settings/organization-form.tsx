"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const organizationFormSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  description: z.string().optional(),
  website: z.string().url("Debe ser una URL válida").or(z.literal("")),
  logo_url: z.string().url("Debe ser una URL válida").or(z.literal("")),
});

type OrganizationFormValues = z.infer<typeof organizationFormSchema>;

interface OrganizationFormProps {
  organization?: {
    id?: string;
    name: string;
    description?: string | null;
    website?: string | null;
    logo_url?: string | null;
  } | null;
  isAdmin?: boolean;
}

export function OrganizationForm({ organization, isAdmin = false }: OrganizationFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isEdit = !!organization?.id;

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(organizationFormSchema),
    defaultValues: {
      name: organization?.name || "",
      description: organization?.description || "",
      website: organization?.website || "",
      logo_url: organization?.logo_url || "",
    },
  });

  const onSubmit = async (values: OrganizationFormValues) => {
    if (!isAdmin) {
      toast.error("No tienes permisos para editar esta organización");
      return;
    }

    setIsLoading(true);
    try {
      const url = isEdit 
        ? `/api/organizations/${organization.id}`
        : '/api/organizations';
      
      const method = isEdit ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al guardar la organización");
      }

      toast.success(isEdit ? "Organización actualizada" : "Organización creada");
      router.refresh();
      
      if (!isEdit) {
        // Redirigir a la página de configuración de la nueva organización
        router.push(`/dashboard/organization/settings`);
      }
    } catch (error) {
      console.error("Error saving organization:", error);
      toast.error(
        error instanceof Error ? error.message : "Error al guardar la organización"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de la Organización</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Mi Empresa S.A." 
                    disabled={isLoading || !isAdmin}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Describe tu organización..."
                    className="min-h-[100px]"
                    disabled={isLoading || !isAdmin}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sitio Web</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="https://ejemplo.com" 
                      disabled={isLoading || !isAdmin}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="logo_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL del Logo</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="https://ejemplo.com/logo.png" 
                      disabled={isLoading || !isAdmin}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {isAdmin && (
            <div className="pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          )}
        </div>
      </form>
    </Form>
  );
}
