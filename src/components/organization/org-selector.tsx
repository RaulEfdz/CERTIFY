"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Organization {
  id: string;
  name: string;
  logo_url: string | null;
}

export function OrganizationSelector() {
  const router = useRouter();
  
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Obtener organizaciones del usuario
        const { data: memberships } = await supabase
          .from('organization_members')
          .select('organizations(id, name, logo_url)')
          .eq('user_id', user.id);

        if (memberships) {
          const orgs = memberships.flatMap(m => m.organizations);
          setOrganizations(orgs as Organization[]);

          // Obtener la organización actual del perfil
          const { data: profile } = await supabase
            .from('profiles')
            .select('current_organization_id')
            .eq('id', user.id)
            .single();

          if (profile?.current_organization_id) {
            const current = orgs.find(o => o.id === profile.current_organization_id);
            if (current) {
              setCurrentOrg(current as Organization);
            } else if (orgs.length > 0) {
              // Si la organización actual no está en la lista, usar la primera
              setCurrentOrg(orgs[0] as Organization);
              await updateCurrentOrg(orgs[0].id);
            }
          } else if (orgs.length > 0) {
            // Si no hay organización actual, usar la primera
            setCurrentOrg(orgs[0] as Organization);
            await updateCurrentOrg(orgs[0].id);
          }
        }
      } catch (error) {
        console.error("Error fetching organizations:", error);
        toast.error("Error al cargar las organizaciones");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  const updateCurrentOrg = async (orgId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('profiles')
      .update({ current_organization_id: orgId })
      .eq('id', user.id);
  };

  const handleOrgSelect = async (org: Organization) => {
    if (org.id === currentOrg?.id) return;
    
    setIsSwitching(true);
    try {
      await updateCurrentOrg(org.id);
      setCurrentOrg(org);
      router.refresh(); // Refrescar la página para actualizar los datos
    } catch (error) {
      console.error("Error switching organization:", error);
      toast.error("Error al cambiar de organización");
    } finally {
      setIsSwitching(false);
    }
  };

  if (isLoading) {
    return (
      <Button variant="ghost" className="justify-start gap-2 w-full">
        <Icons.spinner className="h-4 w-4 animate-spin" />
        <span>Cargando...</span>
      </Button>
    );
  }

  if (organizations.length === 0) {
    return (
      <Button variant="ghost" className="justify-start gap-2 w-full">
        <Icons.logo className="h-4 w-4" />
        <span>Sin organización</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="justify-start gap-2 w-full">
          {currentOrg?.logo_url ? (
            <Avatar className="h-5 w-5">
              <AvatarImage src={currentOrg.logo_url} alt={currentOrg.name} />
              <AvatarFallback>
                {currentOrg.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ) : (
            <Icons.logo className="h-4 w-4" />
          )}
          <span className="truncate">{currentOrg?.name || "Seleccionar organización"}</span>
          <Icons.chevronDown className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="start">
        <DropdownMenuLabel>Cambiar organización</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {organizations.map((org) => (
          <DropdownMenuItem 
            key={org.id} 
            className="cursor-pointer"
            onClick={() => handleOrgSelect(org)}
            disabled={isSwitching}
          >
            {org.logo_url ? (
              <Avatar className="h-5 w-5 mr-2">
                <AvatarImage src={org.logo_url} alt={org.name} />
                <AvatarFallback>
                  {org.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ) : (
              <Icons.logo className="h-4 w-4 mr-2" />
            )}
            <span className="truncate">{org.name}</span>
            {org.id === currentOrg?.id && (
              <Icons.logo className="ml-auto h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="cursor-pointer"
          onClick={() => router.push('/dashboard/organization/settings')}
        >
          <Icons.settings className="h-4 w-4 mr-2" />
          <span>Configuración de la organización</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="cursor-pointer"
          onClick={() => router.push('/dashboard/organization/members')}
        >
          <Icons.users className="h-4 w-4 mr-2" />
          <span>Miembros</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
