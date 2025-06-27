import { Metadata } from 'next';
import { CreateOrganizationForm } from '@/components/organization/create-organization-form';
import { PageHeader } from '@/components/organization/page-header';

export const metadata: Metadata = {
  title: 'Nueva Organización',
  description: 'Crea una nueva organización en Certify',
};

export default function NewOrganizationPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Crear organización"
        description="Completa la información para crear una nueva organización"
      />
      <div className="max-w-2xl">
        <CreateOrganizationForm />
      </div>
    </div>
  );
}
