"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { useTemplateState } from "./editor/hooks/useTemplateState";
import { TemplateHeader } from "./editor/components/TemplateHeader";
import { TemplateSidebar } from "./editor/components/TemplateSidebar";
import { TemplatePreview } from "./editor/components/TemplatePreview";

export function ImprovedTemplateEditor() {
    const state = useTemplateState();

    const templateHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${state.title}</title>
      <style>
        /* Base styles */
        body, html {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          font-family: Arial, sans-serif;
          color: #1f2937;
        }
        
        .certificate {
          position: relative;
          width: 100%;
          min-height: 100%;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background-color: #ffffff;
          ${state.backgroundUrl ? `background-image: url('${state.backgroundUrl}');` : ''}
          background-size: cover;
          background-position: center;
        }
        
        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: ${state.overlayColor};
          z-index: 1;
        }
        
        .content {
          position: relative;
          z-index: 2;
          max-width: 800px;
          width: 100%;
          margin: 0 auto;
          text-align: center;
          background: rgba(255, 255, 255, 0.95);
          padding: 2.5rem;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        .logo {
          max-width: ${state.logoWidth}px;
          max-height: ${state.logoHeight}px;
          margin: 0 auto 1.5rem;
        }
        
        h1 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: #1f2937;
        }
        
        .body-text {
          font-size: 1.125rem;
          line-height: 1.75;
          margin-bottom: 2rem;
          color: #4b5563;
        }
        
        .signatures {
          display: flex;
          justify-content: space-around;
          margin-top: 3rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e5e7eb;
        }
        
        .signature {
          flex: 1;
          padding: 0 1rem;
        }
        
        .signature-line {
          height: 1px;
          background: #9ca3af;
          margin: 0.5rem 0;
        }
        
        ${state.customCss}
      </style>
    </head>
    <body>
      <div class="certificate">
        <div class="overlay"></div>
        <div class="content">
          ${state.logoUrl ? `<img src="${state.logoUrl}" alt="Logo" class="logo" />` : ''}
          <h1>${state.title}</h1>
          <p class="body-text">${state.body1}</p>
          <div style="margin: 2rem 0; padding: 1.5rem; border: 1px dashed #9ca3af; border-radius: 4px;">
            <p style="margin: 0; font-weight: 500; font-size: 1.25rem;">Nombre del Estudiante</p>
          </div>
          <p class="body-text">${state.body2}</p>
          <p class="body-text"><strong>Curso:</strong> ${state.courseName}</p>
          
          <div class="signatures">
            <div class="signature">
              <div class="signature-line"></div>
              <p>Firma del Director</p>
            </div>
            <div class="signature">
              <div class="signature-line"></div>
              <p>Fecha: ${new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
      
      <script>
        ${state.customJs}
      </script>
    </body>
    </html>
  `;

    return (
        <TooltipProvider>
            <div className="flex flex-col h-screen bg-background">
                <TemplateHeader />
                <div className="flex flex-1 overflow-hidden">
                    <TemplateSidebar state={state} setters={state} />
                    <TemplatePreview templateHtml={templateHtml} certificateSize={state.certificateSize} />
                </div>
            </div>
        </TooltipProvider>
    );
}