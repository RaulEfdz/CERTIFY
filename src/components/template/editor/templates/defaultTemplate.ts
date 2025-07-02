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
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary-color: #1e40af;
      --secondary-color: #3b82f6;
      --accent-color: #fbbf24;
      --text-primary: #1f2937;
      --text-secondary: #6b7280;
      --text-muted: #9ca3af;
      --bg-primary: #ffffff;
      --bg-overlay: ${overlayColor};
      --border-color: #e5e7eb;
      --border-accent: #dbeafe;
    }
    
    *, *::before, *::after { 
      box-sizing: border-box; 
      margin: 0;
      padding: 0;
    }
    
    body, html {
      width: 100%;
      height: 100%;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: var(--text-primary);
      background: var(--bg-primary);
      line-height: 1.6;
    }
    
    .certificate-container {
      position: relative;
      width: 100%;
      height: 100vh;
      display: flex;
      align-items: stretch;
      justify-content: stretch;
      padding: 0;
      ${backgroundUrl ? `background: url('${backgroundUrl}') center/cover no-repeat;` : 'background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);'}
    }
    
    .background-overlay {
      position: absolute;
      inset: 0;
      background: var(--bg-overlay);
      z-index: 1;
    }
    
    .certificate {
      position: relative;
      z-index: 2;
      width: 100%;
      height: 100%;
      background: var(--bg-primary);
      border-radius: 0;
      box-shadow: none;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    
    /* Decorative border */
    .certificate::before {
      content: '';
      position: absolute;
      top: 20px;
      left: 20px;
      right: 20px;
      bottom: 20px;
      border: 2px solid var(--primary-color);
      border-radius: 8px;
      pointer-events: none;
      z-index: 1;
    }
    
    /* Corner decorations */
    .certificate::after {
      content: '';
      position: absolute;
      top: 20px;
      left: 20px;
      right: 20px;
      bottom: 20px;
      background: 
        radial-gradient(circle at 0 0, var(--secondary-color) 20%, transparent 20%),
        radial-gradient(circle at 100% 0, var(--accent-color) 20%, transparent 20%),
        radial-gradient(circle at 0 100%, var(--accent-color) 20%, transparent 20%),
        radial-gradient(circle at 100% 100%, var(--secondary-color) 20%, transparent 20%);
      background-size: 30px 30px;
      background-position: 0 0, 100% 0, 0 100%, 100% 100%;
      opacity: 0.08;
      z-index: 1;
    }
    
    .certificate-content {
      position: relative;
      z-index: 2;
      height: 100%;
      display: grid;
      grid-template-rows: auto 1fr auto;
      padding: 40px 60px;
      text-align: center;
      flex: 1;
    }
    
    /* Header Section */
    .certificate-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      margin-bottom: 30px;
    }
    
    .logo-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }
    
    .logo {
      max-width: ${Math.min(validLogoWidth, 120)}px;
      max-height: ${Math.min(validLogoHeight, 80)}px;
      height: auto;
      width: auto;
      object-fit: contain;
      border-radius: 12px;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }
    
    .logo-placeholder {
      width: ${Math.min(validLogoWidth, 120)}px;
      height: ${Math.min(validLogoHeight, 80)}px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--secondary-color), var(--primary-color));
      border-radius: 12px;
      box-shadow: 0 8px 25px rgba(30, 64, 175, 0.3);
      color: white;
      font-weight: 600;
      font-size: 16px;
      letter-spacing: 0.5px;
    }
    
    .institution-name {
      font-size: 14px;
      color: var(--text-muted);
      font-weight: 500;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    
    .certificate-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(32px, 5vw, 48px);
      font-weight: 700;
      color: var(--primary-color);
      letter-spacing: -0.5px;
      line-height: 1.1;
      text-shadow: 0 2px 4px rgba(30, 64, 175, 0.1);
    }
    
    /* Body Section */
    .certificate-body {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 20px;
      flex: 1;
    }
    
    .presentation-text {
      font-size: 18px;
      color: var(--text-secondary);
      font-weight: 400;
      line-height: 1.5;
    }
    
    .student-name {
      font-family: 'Playfair Display', serif;
      font-size: clamp(28px, 4vw, 36px);
      font-weight: 600;
      color: var(--primary-color);
      border-bottom: 3px solid var(--border-accent);
      padding-bottom: 12px;
      margin: 0 auto;
      min-width: 350px;
      max-width: 500px;
      letter-spacing: 0.5px;
      text-transform: capitalize;
    }
    
    .completion-text {
      font-size: 16px;
      color: var(--text-secondary);
      font-weight: 400;
      line-height: 1.6;
    }
    
    .course-info {
      background: linear-gradient(135deg, #f8fafc, #e2e8f0);
      padding: 20px 30px;
      border-radius: 16px;
      border: 1px solid var(--border-color);
      margin: 20px 0;
    }
    
    .course-label {
      font-size: 14px;
      color: var(--text-muted);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }
    
    .course-name {
      font-size: 20px;
      font-weight: 600;
      color: var(--text-primary);
      font-style: italic;
    }
    
    /* Footer Section */
    .certificate-footer {
      display: flex;
      justify-content: space-between;
      align-items: end;
      gap: 40px;
      margin-top: 30px;
      padding-top: 25px;
      border-top: 2px solid var(--border-color);
    }
    
    .signature-section {
      flex: 1;
      max-width: 200px;
    }
    
    .signature-line {
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--text-secondary), transparent);
      margin-bottom: 12px;
    }
    
    .signature-name {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 4px;
    }
    
    .signature-title {
      font-size: 14px;
      color: var(--text-muted);
      font-weight: 400;
    }
    
    .date-section {
      flex: 1;
      max-width: 200px;
      text-align: right;
    }
    
    .date-label {
      font-size: 14px;
      color: var(--text-muted);
      font-weight: 500;
      margin-bottom: 8px;
    }
    
    .date-value {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);
    }
    
    /* Responsive design */
    @media (max-width: 768px) {
      .certificate-container {
        padding: 0;
      }
      
      .certificate-content {
        padding: 30px 25px;
        grid-template-rows: auto 1fr auto;
      }
      
      .certificate-header {
        margin-bottom: 25px;
        gap: 12px;
      }
      
      .certificate-title {
        font-size: clamp(24px, 6vw, 32px);
      }
      
      .student-name {
        font-size: clamp(20px, 5vw, 28px);
        min-width: 250px;
      }
      
      .certificate-footer {
        flex-direction: column;
        text-align: center;
        gap: 20px;
        margin-top: 25px;
        padding-top: 20px;
      }
      
      .date-section {
        text-align: center;
      }
      
      .course-info {
        padding: 16px 20px;
        margin: 15px 0;
      }
      
      .certificate::before {
        top: 15px;
        left: 15px;
        right: 15px;
        bottom: 15px;
      }
      
      .certificate::after {
        top: 15px;
        left: 15px;
        right: 15px;
        bottom: 15px;
      }
    }
    
    /* Print styles */
    @media print {
      body {
        background: white !important;
      }
      
      .certificate-container {
        background: white !important;
        padding: 0;
        height: 100vh;
        min-height: auto;
      }
      
      .background-overlay {
        display: none;
      }
      
      .certificate {
        box-shadow: none !important;
        border: 1px solid #ddd;
        page-break-inside: avoid;
        height: 100%;
      }
      
      .certificate::before {
        border-color: var(--primary-color);
        opacity: 1;
      }
      
      .certificate::after {
        opacity: 0.15;
      }
      
      .certificate-content {
        padding: 40px 60px;
      }
    }
    
    ${customCss}
  </style>
</head>
<body>
  <div class="certificate-container" role="main" aria-label="Certificado">
    ${backgroundUrl ? '<div class="background-overlay" aria-hidden="true"></div>' : ''}
    
    <div class="certificate" role="document">
      <div class="certificate-content">
        <!-- Header Section -->
        <header class="certificate-header">
          <div class="logo-section">
            ${
              logoUrl
                ? `<img src="${logoUrl}" alt="Logo de la institución" class="logo" loading="lazy" />`
                : `<div class="logo-placeholder" aria-label="Logo de la institución">
                     <span>LOGO</span>
                   </div>`
            }
            <div class="institution-name">Logo de la institución</div>
          </div>
          
          <h1 class="certificate-title">${safeTitle}</h1>
        </header>
        
        <!-- Body Section -->
        <main class="certificate-body">
          ${safeBody1 ? `<p class="presentation-text">${safeBody1}</p>` : '<p class="presentation-text">Este certificado se presenta con orgullo a</p>'}
          
          <div class="student-name">${safeStudentName}</div>
          
          ${safeBody2 ? `<p class="completion-text">${safeBody2}</p>` : '<p class="completion-text">por haber completado exitosamente el curso</p>'}
          
          ${safeCourseName ? `
            <div class="course-info">
              <div class="course-label">Curso</div>
              <div class="course-name">${safeCourseName}</div>
            </div>
          ` : ''}
        </main>
        
        <!-- Footer Section -->
        <footer class="certificate-footer" role="contentinfo">
          <div class="signature-section">
            <div class="signature-line" aria-hidden="true"></div>
            <div class="signature-name">${safeDirectorName}</div>
            <div class="signature-title">Director Académico</div>
          </div>
          
          <div class="date-section">
            <div class="date-label">Fecha de emisión</div>
            <div class="date-value">${formattedDate}</div>
          </div>
        </footer>
      </div>
    </div>
  </div>
  
  ${customJs ? `<script>${customJs}</script>` : ''}
</body>
</html>`;
};