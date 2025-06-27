"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Organization = {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  website: string | null;
};

type OrganizationContextType = {
  organization: Organization | null;
  isLoading: boolean;
  isAdmin: boolean;
  refresh: () => Promise<void>;
};

const OrganizationContext = createContext<OrganizationContextType | undefined>(
  undefined
);

export function OrganizationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = createClient();

  const fetchOrganization = async () => {
    try {
      setIsLoading(true);
      
      // Obtener el perfil del usuario para obtener la organización actual
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setOrganization(null);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("current_organization_id")
        .eq("id", user.id)
        .single();

      if (!profile?.current_organization_id) {
        setOrganization(null);
        setIsAdmin(false);
        return;
      }

      // Obtener información de la organización
      const { data: orgData } = await supabase
        .from("organizations")
        .select("*")
        .eq("id", profile.current_organization_id)
        .single();

      if (!orgData) {
        setOrganization(null);
        setIsAdmin(false);
        return;
      }

      setOrganization({
        id: orgData.id,
        name: orgData.name,
        description: orgData.description,
        logo_url: orgData.logo_url,
        website: orgData.website,
      });

      // Verificar si el usuario es administrador
      const { data: membership } = await supabase
        .from("organization_members")
        .select("role")
        .eq("user_id", user.id)
        .eq("organization_id", orgData.id)
        .single();

      setIsAdmin(membership?.role === 'owner' || membership?.role === 'admin');
    } catch (error) {
      console.error("Error fetching organization:", error);
      setOrganization(null);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganization();

    // Suscribirse a cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event) => {
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          await fetchOrganization();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <OrganizationContext.Provider
      value={{
        organization,
        isLoading,
        isAdmin,
        refresh: fetchOrganization,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error(
      "useOrganization must be used within an OrganizationProvider"
    );
  }
  return context;
}
