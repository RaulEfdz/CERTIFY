'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { CreateOrganizationForm } from '@/components/organization/create-organization-form';

export function OrganizationSection() {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Organización</h3>
          <p className="text-sm text-muted-foreground">
            Crea o actualiza la información de tu organización
          </p>
        </div>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)}>
            <Icons.plus className="mr-2 h-4 w-4" />
            Crear organización
          </Button>
        )}
      </div>

      {isCreating && (
        <div className="rounded-lg border p-6">
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
