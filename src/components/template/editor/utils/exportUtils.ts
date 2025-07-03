import { CERTIFICATE_DIMENSIONS } from '../types';

export interface ExportOptions {
  format: 'pdf' | 'png' | 'jpeg';
  quality?: number;
  scale?: number;
  filename?: string;
}

/**
 * Exports certificate as PDF using browser's print functionality
 */
export const exportToPDF = async (
  htmlContent: string,
  options: Partial<ExportOptions> = {}
): Promise<void> => {
  const { filename = 'certificado.pdf' } = options;

  try {
    // Create a temporary iframe for printing
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.top = '-9999px';
    iframe.style.left = '-9999px';
    iframe.style.width = '0';
    iframe.style.height = '0';
    document.body.appendChild(iframe);

    // Write the HTML content to the iframe
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) {
      throw new Error('No se pudo crear el documento para exportar');
    }

    // Enhanced HTML for PDF with proper sizing
    const pdfHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${filename}</title>
          <style>
            @page {
              margin: 0;
              size: A4;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100vh;
              overflow: hidden;
            }
            .certificate-container {
              width: 100% !important;
              height: 100vh !important;
              page-break-inside: avoid;
            }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
      </html>
    `;

    iframeDoc.open();
    iframeDoc.write(pdfHTML);
    iframeDoc.close();

    // Wait for content to load
    await new Promise(resolve => {
      iframe.onload = resolve;
      setTimeout(resolve, 1000); // Fallback timeout
    });

    // Focus the iframe and print
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();

    // Clean up
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);

  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw new Error('Error al exportar a PDF. Intenta nuevamente.');
  }
};

/**
 * Exports certificate as image using html2canvas
 */
export const exportToImage = async (
  element: HTMLElement,
  certificateSize: 'landscape' | 'square',
  options: Partial<ExportOptions> = {}
): Promise<void> => {
  const { 
    format = 'png', 
    quality = 0.95, 
    scale = 2,
    filename = `certificado.${format}`
  } = options;

  try {
    // Dynamically import html2canvas
    const html2canvas = await import('html2canvas');
    
    const dimensions = CERTIFICATE_DIMENSIONS[certificateSize];
    
    // Capture the element
    const canvas = await html2canvas.default(element, {
      width: dimensions.width,
      height: dimensions.height,
      scale: scale,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      removeContainer: true,
      imageTimeout: 15000,
      onclone: (clonedDoc) => {
        // Ensure styles are applied in cloned document
        const clonedElement = clonedDoc.querySelector('.certificate-container') as HTMLElement;
        if (clonedElement) {
          clonedElement.style.width = `${dimensions.width}px`;
          clonedElement.style.height = `${dimensions.height}px`;
          clonedElement.style.transform = 'none';
          clonedElement.style.position = 'static';
        }
      }
    });

    // Convert canvas to blob
    const blob = await new Promise<Blob>((resolve, reject) => {
      if (format === 'png') {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to create PNG blob'));
        }, 'image/png');
      } else {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to create JPEG blob'));
        }, 'image/jpeg', quality);
      }
    });

    // Download the image
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

  } catch (error) {
    console.error('Error exporting to image:', error);
    throw new Error(`Error al exportar como ${format.toUpperCase()}. Intenta nuevamente.`);
  }
};

/**
 * Helper function to get export filename with timestamp
 */
export const generateExportFilename = (
  templateName: string = 'certificado',
  format: string,
  includeTimestamp: boolean = true
): string => {
  const cleanName = templateName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  const timestamp = includeTimestamp 
    ? new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-')
    : '';
  
  const parts = [cleanName, timestamp].filter(Boolean);
  return `${parts.join('-')}.${format}`;
};

/**
 * Copy certificate HTML to clipboard
 */
export const copyToClipboard = async (htmlContent: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(htmlContent);
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = htmlContent;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
    } catch (err) {
      throw new Error('No se pudo copiar al portapapeles');
    } finally {
      document.body.removeChild(textArea);
    }
  }
};