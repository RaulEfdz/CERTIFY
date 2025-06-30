// Utilidad simple para generar un SVG de certificado como string.
// Personalízalo según tu diseño real.

export function generateCertificateSVG({ studentName, courseName, date }: { studentName: string, courseName: string, date: string }): string {
  return `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#111" rx="32" />
      <text x="50%" y="40%" dominant-baseline="middle" text-anchor="middle" font-size="56" fill="#fff" font-family="sans-serif">${studentName}</text>
      <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-size="36" fill="#b3e6a5" font-family="sans-serif">${courseName}</text>
      <text x="50%" y="70%" dominant-baseline="middle" text-anchor="middle" font-size="28" fill="#aaa" font-family="sans-serif">${date}</text>
    </svg>
  `;
}
