'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { CreateOrganizationForm } from '@/components/organization/create-organization-form';

export function OrganizationSection() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-medium text-foreground">Organización</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Gestiona la información y miembros de tu organización
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => router.push('/organization/members')}
          >
            <Icons.users className="mr-2 h-4 w-4" />
            Gestionar miembros
          </Button>
          {!isCreating && (
            <Button 
              onClick={() => setIsCreating(true)}
              className="bg-primary hover:bg-primary/90 text-white"
            >
              <Icons.plus className="mr-2 h-4 w-4" />
              Crear organización
            </Button>
          )}
        </div>
      </div>

      {isCreating && (
        <div className="rounded-lg border border-border bg-background p-6 shadow-sm">
          <CreateOrganizationForm 
            onSuccess={() => {
              setIsCreating(false);
              // Recargar la página para ver los cambios
              window.location.reload();
            }} 
            onCancel={() => setIsCreating(false)}
          />
        </div>
      )}
    </div>
  );
}
