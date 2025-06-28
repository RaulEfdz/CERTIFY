import type {Config} from 'tailwindcss';

const config = {
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
        /**
         * GOLD COLOR PALETTE
         * Used for: Buttons, accents, highlights, and important interactive elements
         * - 50-200: Light backgrounds, subtle highlights
         * - 300-400: Hover states, secondary buttons
         * - 500: Primary gold (DEFAULT) - Main buttons, primary actions
         * - 600-900: Darker shades for text on light bg, pressed states
         * - light: Light gold for highlights
         * - dark: Dark gold for shadows and borders
         */
        gold: {
          50:  '#FFFDF9',  // Lightest - for text on dark backgrounds
          100: '#FEF8F0', // Very light - for subtle highlights
          200: '#FDF2E1', // Light - for hover states
          300: '#FBE5C3', // Light medium - for secondary actions
          400: '#F8D9A5', // Medium - for interactive elements
          500: '#F5CC87', // Base - primary gold for text/icons
          600: '#E5B63A', // Brighter - for important elements
          700: '#B08C38', // Base gold - for buttons
          800: '#8D702D', // Darker - for hover states
          900: '#6A5422', // Dark - for pressed states
          DEFAULT: '#F5CC87', // Brighter gold for better visibility
          light: '#F8E6C4',   // Very light gold for text
          dark:  '#B08C38',   // Standard gold for UI elements
        },
        
        /**
         * GREEN COLOR PALETTE
         * Used for: Backgrounds, UI elements, and text
         * - 50-200: Light backgrounds, cards
         * - 300-400: Borders, subtle UI elements
         * - 500: Main brand green - matches logo background
         * - 600-900: Text colors, dark UI elements
         * - logo: Direct reference to logo background color
         */
        green: {
          50:  '#E8F0EB',  // Lightest - for text on dark backgrounds
          100: '#D1E1D7', // Very light - for subtle text
          200: '#A3C3AF', // Light - for secondary text
          300: '#75A587', // Light medium - for subtle UI elements
          400: '#47875F', // Medium - for accents
          500: '#0d2215', // Main background color
          600: '#0A1B10', // Slightly darker - for hover states
          700: '#08150D', // Darker - for pressed states
          800: '#050E09', // Very dark - for deep shadows
          900: '#030804', // Darkest - for deepest elements
          darkest: '#020503', // Darkest - almost black
          dark: '#0A1B10',    // Dark - for UI elements
          light: '#A3C3AF',   // Light green for text
          logo: '#0D2215',    // Main background color
        },
        // Theme colors
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      boxShadow: {
        // Professional shadows
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'md': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'lg': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        // Gold accents
        'gold': '0 4px 14px 0 rgba(176, 140, 56, 0.3)',
        'gold-lg': '0 10px 25px -5px rgba(176, 140, 56, 0.2), 0 8px 10px -6px rgba(176, 140, 56, 0.2)',
        'inner-gold': 'inset 0 2px 4px 0 rgba(109, 82, 33, 0.5)',
      },

      keyframes: {
        shine: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #FFE066 0%, #D4AF37 50%, #B08E2E 100%)',
        'gold-gradient-light': 'linear-gradient(135deg, #FFF5CC 0%, #FFE066 50%, #D4AF37 100%)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        'shine': 'shine 3s ease-in-out infinite',
        'pulse-gold': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} as const;

export default config;
