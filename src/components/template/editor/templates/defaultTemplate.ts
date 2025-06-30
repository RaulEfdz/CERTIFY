import { TemplateConfig } from '../types';

/**
 * Generates HTML for a certificate template with customizable styling and content
 * @param config - Configuration object containing all template parameters
 * @returns HTML string for the certificate template
 */
export const getTemplateHtml = (config: TemplateConfig): string => {
  const {
    title,
    backgroundUrl,
    overlayColor = 'rgba(255, 255, 255, 0.95)',
    customCss = '',
    customJs = '',
    logoUrl,
    logoWidth = 200,
    logoHeight = 100,
    body1 = '',
    body2 = '',
    courseName = '',
    studentName = '',
    directorName = 'Firma del Director',
    date = new Date().toISOString(),
    dateLocale = 'es-ES',
  } = config;

  

  // Sanitize inputs to prevent XSS
  const sanitize = (input: string | undefined | null): string => {
    if (!input) return '';
    return String(input)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  };

  const safeTitle = sanitize(title);
  const safeStudentName = sanitize(studentName);
  const safeCourseName = sanitize(courseName);
  const safeDirectorName = sanitize(directorName);
  const safeBody1 = sanitize(body1);
  const safeBody2 = sanitize(body2);

  // Format date safely
  let formattedDate: string;
  try {
    formattedDate = new Date(date).toLocaleDateString(dateLocale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.warn('Error formatting date, using current date:', error);
    formattedDate = new Date().toLocaleDateString(dateLocale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Validate dimensions
  const validLogoWidth = Math.max(50, Math.min(logoWidth, 500));
  const validLogoHeight = Math.max(25, Math.min(logoHeight, 250));

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle}</title>
  <style>
    :root {
      --color-text-primary: #1f2937;
      --color-text-secondary: #4b5563;
      --color-bg: #ffffff;
      --content-bg: ${overlayColor};
      --spacing: 1rem;
      --radius: 8px;
      --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    
    *, *::before, *::after { 
      box-sizing: border-box; 
    }
    
    body, html {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: var(--color-text-primary);
      background: var(--color-bg);
    }
    
    .certificate {
      position: relative;
      width: 100%;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: calc(var(--spacing) * 2);
      ${backgroundUrl ? `background: url('${backgroundUrl}') center/cover no-repeat;` : ''}
    }
    
    .overlay {
      position: absolute;
      inset: 0;
      background: var(--overlay-color);
      z-index: 1;
    }
    
    .content {
      position: relative;
      z-index: 2;
      max-width: 900px;
      width: 100%;
      text-align: center;
      background: var(--content-bg);
      padding: calc(var(--spacing) * 3);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      backdrop-filter: blur(10px);
    }
    
    .logo {
      max-width: ${validLogoWidth}px;
      max-height: ${validLogoHeight}px;
      height: auto;
      width: auto;
      margin-bottom: calc(var(--spacing) * 1.5);
      object-fit: contain;
    }
    
    .logo-placeholder {
      width: ${validLogoWidth}px;
      height: ${validLogoHeight}px;
      margin: 0 auto calc(var(--spacing) * 1.5);
      display: flex;
      align-items: center;
      justify-content: center;
      background: #e5e7eb;
      border-radius: var(--radius);
      border: 2px dashed #9ca3af;
    }
    
    .logo-placeholder-text {
      color: var(--color-text-secondary);
      font-size: 0.875rem;
      font-weight: 500;
    }
    
    h1 {
      font-size: clamp(1.5rem, 4vw, 2.5rem);
      font-weight: 700;
      margin-bottom: calc(var(--spacing) * 2);
      color: var(--color-text-primary);
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }
    
    .body-text {
      font-size: clamp(1rem, 2.5vw, 1.25rem);
      line-height: 1.75;
      margin-bottom: calc(var(--spacing) * 1.5);
      color: var(--color-text-secondary);
    }
    
    .student-name {
      font-size: clamp(1.25rem, 3vw, 1.75rem);
      font-weight: 600;
      color: var(--color-text-primary);
      margin: calc(var(--spacing) * 2) 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .course-label { 
      font-weight: 600;
      color: var(--color-text-primary);
    }
    
    .signatures {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: calc(var(--spacing) * 4);
      padding-top: calc(var(--spacing) * 2);
      border-top: 2px solid #e5e7eb;
      gap: calc(var(--spacing) * 2);
    }
    
    .signature {
      flex: 1;
      max-width: 250px;
    }
    
    .signature-line {
      width: 100%;
      height: 2px;
      background: #374151;
      margin-bottom: calc(var(--spacing) * 0.5);
    }
    
    .signature p {
      margin: 0;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--color-text-secondary);
    }
    
    /* Responsive design */
    @media (max-width: 768px) {
      .certificate {
        padding: var(--spacing);
      }
      
      .content {
        padding: calc(var(--spacing) * 2);
      }
      
      .signatures {
        flex-direction: column;
        gap: calc(var(--spacing) * 1.5);
        text-align: center;
      }
      
      .signature {
        max-width: 100%;
      }
    }
    
    /* Print styles */
    @media print {
      body {
        background: white !important;
      }
      
      .certificate {
        min-height: 100vh;
        background: none !important;
      }
      
      .overlay {
        display: none;
      }
      
      .content {
        background: white !important;
        box-shadow: none !important;
        backdrop-filter: none !important;
      }
    }
    
    ${customCss}
  </style>
</head>
<body>
  <div class="certificate" role="main" aria-label="Certificado">
    ${backgroundUrl ? '<div class="overlay" aria-hidden="true"></div>' : ''}
    <div class="content" role="document">
      ${
        logoUrl
          ? `<img src="${logoUrl}" alt="Logo de la institución" class="logo" loading="lazy" />`
          : `<div class="logo-placeholder" aria-label="Espacio reservado para logo">
               <span class="logo-placeholder-text">Logo</span>
             </div>`
      }
      
      <h1>${safeTitle}</h1>
      
      ${safeBody1 ? `<p class="body-text">${safeBody1}</p>` : ''}
      
      <div class="student-name">${safeStudentName}</div>
      
      ${safeBody2 ? `<p class="body-text">${safeBody2}</p>` : ''}
      
      <p class="body-text">
        <span class="course-label">Curso:</span> ${safeCourseName}
      </p>
      
      <div class="signatures" role="contentinfo">
        <div class="signature">
          <div class="signature-line" aria-hidden="true"></div>
          <p>${safeDirectorName}</p>
        </div>
        <div class="signature">
          <div class="signature-line" aria-hidden="true"></div>
          <p>Fecha: ${formattedDate}</p>
        </div>
      </div>
    </div>
  </div>
  
  ${customJs ? `<script>${customJs}</script>` : ''}
</body>
</html>`;
};