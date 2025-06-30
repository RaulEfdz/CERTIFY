'use client';
import dynamic from 'next/dynamic';

// Dynamically import the editor with SSR disabled since it uses browser APIs
const TemplateEditor = dynamic<{}>(
  () => import('@/components/template/template-editor').then(mod => mod.ImprovedTemplateEditor),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-full">Cargando editor...</div> }
);

export default function CertificateEditorPage() {
  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-semibold">Editor de Plantilla de Certificado</h1>
        </div>
      </header>
      
      <main className="flex-1 overflow-hidden">
        <TemplateEditor />
      </main>
    </div>
  );
}
