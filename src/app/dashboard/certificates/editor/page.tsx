'use client';
import dynamic from 'next/dynamic';

// Dynamically import the editor with SSR disabled since it uses browser APIs
const TemplateEditor = dynamic<{}>(
  () => import('@/components/template/template-editor').then(mod => mod.ImprovedTemplateEditor),
  { ssr: false, loading: () => <div className="flex items-center justify-center h-full">Cargando editor...</div> }
);

export default function CertificateEditorPage() {
  return (
    <div className="h-full flex flex-col bg-background">
      <main className="flex-1 overflow-hidden">
        <TemplateEditor />
      </main>
    </div>
  );
}
