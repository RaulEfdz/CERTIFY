"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type OrganizationInvitation = {
  id: string;
  organization_id: string;
  email: string;
  role: string;
  token: string;
  expires_at: string;
  accepted_at: string | null;
  organizations?: {
    name: string;
  };
};

type User = {
  id: string;
  email: string | undefined;
} | null;

export function AcceptInvitationClient({
  user,
  invitation,
  organizationName,
}: {
  user: User;
  invitation: OrganizationInvitation;
  organizationName: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!user);
  const [email, setEmail] = useState("");

  const handleAcceptInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/invitations/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: invitation.token,
          email: user?.email || email,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al aceptar la invitación");
      }

      toast.success("¡Invitación aceptada con éxito!");
      
      // Redirigir al dashboard o a la organización
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
      
    } catch (error) {
      console.error("Error accepting invitation:", error);
      toast.error(error instanceof Error ? error.message : "Error al procesar la invitación");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    // Guardar el token en localStorage para usarlo después del login
    localStorage.setItem("invitationToken", invitation.token);
    router.push(`/login?redirectAfterLogin=/invitations/accept?token=${invitation.token}`);
  };

  const handleSignupRedirect = () => {
    // Guardar el token en localStorage para usarlo después del registro
    localStorage.setItem("invitationToken", invitation.token);
    router.push(`/signup?email=${encodeURIComponent(email)}&redirectAfterSignup=/invitations/accept?token=${invitation.token}`);
  };

  if (!isLoggedIn) {
    return (
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-2xl font-bold">¡Has sido invitado a unirte a {organizationName}!</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Para aceptar esta invitación, inicia sesión o crea una cuenta.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Correo electrónico de la invitación
            </label>
            <input
              type="email"
              id="email"
              value={email || invitation.email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              disabled={!!invitation.email}
            />
            {invitation.email && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Esta invitación es para: {invitation.email}
              </p>
            )}
          </div>

          <div className="flex flex-col space-y-3">
            <Button 
              onClick={handleLoginRedirect}
              className="w-full"
              variant="outline"
            >
              Iniciar sesión
            </Button>
            
            <Button 
              onClick={handleSignupRedirect}
              className="w-full"
            >
              Crear cuenta
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <div className="text-center">
        <h1 className="text-2xl font-bold">¡Unirse a {organizationName}!</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Has sido invitado a unirte a <span className="font-semibold">{organizationName}</span> como <span className="font-semibold">{invitation.role}</span>.
        </p>
      </div>

      <form onSubmit={handleAcceptInvitation} className="mt-6 space-y-4">
        <div className="p-4 text-sm text-gray-700 bg-gray-100 rounded-md dark:bg-gray-700 dark:text-gray-300">
          <p>Correo electrónico: <span className="font-medium">{user?.email}</span></p>
          <p>Rol: <span className="font-medium capitalize">{invitation.role}</span></p>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/")}
            disabled={isLoading}
          >
            Rechazar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Procesando...
              </>
            ) : (
              "Aceptar invitación"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
