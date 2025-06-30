import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['Inter', 'sans-serif'],
        headline: ['Space Grotesk', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: '#111111', // Fondo oscuro
        graybackground: '#1a1a1a', // Alternativa para secciones
        foreground: '#ffffff', // Texto principal blanco
        muted: {
          DEFAULT: '#23272e',   // Gris oscuro para fondos secundarios
          foreground: '#bdbdbd' // Gris claro para descripciones
        },
        border: '#333842',      // Gris oscuro para bordes
        accent: {
          DEFAULT: '#00b894',   // Verde acento
          foreground: '#ffffff' // Texto blanco sobre acento
        },
        destructive: {
          DEFAULT: '#ef4444',   // Rojo para errores
          foreground: '#ffffff'
        },
        gray: {
          50:  '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        // Paleta verde ampliada
        verde: {
          darkest: '#001A14',
          900: '#022C22',
          800: '#064E3B',
          700: '#065F46',
          600: '#047857',
          500: '#059669',
          dark:   '#047857',
          light:  '#A7F3D0',
          logo:   '#059669',
        },
      },
      boxShadow: {
        sm:      '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        md:      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        lg:      '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        xl:      '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        '2xl':   '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        inner:   'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      keyframes: {
        shine: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%':      { 'background-position': '100% 50%' },
        },
        'accordion-down': {
          from: { height: '0' },
          to:   { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to:   { height: '0' },
        },
      },
      backgroundImage: {
        'gold-gradient-light':  'linear-gradient(135deg, #FEF3C7 0%, #FBBF24 50%, #F59E0B 100%)',
        'green-gradient':       'linear-gradient(135deg, #34D399 0%, #059669 50%, #047857 100%)',
        'green-gradient-light': 'linear-gradient(135deg, #D1FAE5 0%, #34D399 50%, #059669 100%)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        shine:          'shine 3s ease-in-out infinite',
        'pulse-gold':   'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'accordion-down':'accordion-down 0.2s ease-out',
        'accordion-up':  'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
}

export default config
