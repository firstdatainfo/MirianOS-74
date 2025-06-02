import type { Config } from "tailwindcss";
import { theme } from "./src/lib/theme";
import animate from 'tailwindcss-animate';

const config: Config = {
  // Tema escuro ativado
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      // Gradientes modernos
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
        'gradient-success': 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
        'gradient-warning': 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
        'gradient-danger': 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
      },
      // Garantir que os gradientes sejam fixos
      backgroundSize: {
        '200%': '200%',
      },
      backgroundPosition: {
        'gradient-pos': '0% 0%',
      },
      backgroundAttachment: {
        'fixed': 'fixed',
      },
      // Efeitos de glassmorphism extras
      blurEffects: {
        'standard': 'blur(8px)',
        'medium': 'blur(12px)',
        'large': 'blur(16px)',
        'extra': 'blur(24px)',
        'ultra': 'blur(40px)',
        'mega': 'blur(64px)',
      },
      // Definições auxiliares de glow
      glowEffects: {
        'subtle': '0 0 15px rgba(147, 51, 234, 0.5)',
        'medium': '0 0 30px rgba(147, 51, 234, 0.8)',
      },
      colors: {
        // Cores vibrantes e modernas
        'vibrant-primary': '#8B5CF6',
        'vibrant-secondary': '#6366F1',
        'vibrant-success': '#10B981',
        'vibrant-warning': '#F59E0B',
        'vibrant-danger': '#EF4444',
        'vibrant-info': '#3B82F6',
        // Cores neon
        'neon-purple': '#A855F7',
        'neon-blue': '#3B82F6',
        'neon-pink': '#EC4899',
        'neon-green': '#10B981',
        'neon-yellow': '#EAB308',
        'neon-red': '#EF4444',
        // Cores pastel
        'pastel-purple': '#D8B4FE',
        'pastel-blue': '#93C5FD',
        'pastel-pink': '#FDA4AF',
        'pastel-green': '#86EFAC',
        'pastel-yellow': '#FDE68A',
        'pastel-red': '#FCA5A5',
        border: `rgb(${theme.colors.border})`,
        input: `rgb(${theme.colors.input})`,
        ring: `rgb(${theme.colors.ring})`,
        background: `rgb(${theme.colors.background})`,
        foreground: `rgb(${theme.colors.foreground})`,
        primary: {
          DEFAULT: `rgb(${theme.colors.primary})`,
          foreground: `rgb(${theme.colors.primaryForeground})`
        },
        secondary: {
          DEFAULT: `rgb(${theme.colors.secondary})`,
          foreground: `rgb(${theme.colors.secondaryForeground})`
        },
        destructive: {
          DEFAULT: `rgb(${theme.colors.destructive})`,
          foreground: `rgb(${theme.colors.destructiveForeground})`
        },
        muted: {
          DEFAULT: `rgb(${theme.colors.muted})`,
          foreground: `rgb(${theme.colors.mutedForeground})`
        },
        accent: {
          DEFAULT: `rgb(${theme.colors.accent})`,
          foreground: `rgb(${theme.colors.accentForeground})`
        },
        popover: {
          DEFAULT: `rgb(${theme.colors.popover})`,
          foreground: `rgb(${theme.colors.popoverForeground})`
        },
        card: {
          DEFAULT: `rgb(${theme.colors.card})`,
          foreground: `rgb(${theme.colors.cardForeground})`
        },
      },
      borderRadius: theme.borders.radius,
      // Espaçamentos do tema
      spacing: theme.spacing,
      // Animações personalizadas
      keyframes: {
        'pulse-gentle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'float-motion': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'bounce-soft': {
          '0%': { transform: 'translateY(-5%)', opacity: '0' },
          '50%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-5%)', opacity: '1' }
        },
        'slide-in': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        }
      },
      // Definições de animação
      animation: {
        'pulse-slow': 'pulse-gentle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float-motion 3s ease-in-out infinite',
        'bounce-soft': 'bounce-soft 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'slide-in': 'slide-in 0.3s ease-in-out',
        'fade-up': 'fade-up 0.5s ease-out',
        'scale-in': 'scale-in 0.3s ease-out'
      },
      boxShadow: theme.shadows,
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.5' }],
        sm: ['0.875rem', { lineHeight: '1.5715' }],
        base: ['1rem', { lineHeight: '1.5' }],
        lg: ['1.125rem', { lineHeight: '1.5' }],
        xl: ['1.25rem', { lineHeight: '1.5' }],
        '2xl': ['1.5rem', { lineHeight: '1.5' }],
        '3xl': ['1.875rem', { lineHeight: '1.5' }],
        '4xl': ['2.25rem', { lineHeight: '1.5' }],
        '5xl': ['3rem', { lineHeight: '1.5' }],
        '6xl': ['3.75rem', { lineHeight: '1.5' }],
        '7xl': ['4.5rem', { lineHeight: '1.5' }],
        '8xl': ['6.25rem', { lineHeight: '1.5' }],
        '9xl': ['8.125rem', { lineHeight: '1.5' }]
      },
      transitionProperty: {
        'all': 'all',
        'colors': 'background-color, border-color, color, fill, stroke',
        'opacity': 'opacity',
        'shadows': 'box-shadow',
        'transform': 'transform'
      },
      transitionTimingFunction: {
        'ease': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
        'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
        'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'linear': 'linear',
        'cubic': theme.transitions.timing
      },
      transitionDuration: {
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': theme.transitions.duration,
        '300': '300ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms'
      },
      backdropFilter: {
        'transparent': 'none',
        'blur': 'blur(20px)',
      },
      backdropOpacity: {
        '0': '0',
        '5': '0.05',
        '10': '0.1',
        '20': '0.2',
        '30': '0.3',
        '40': '0.4',
        '50': '0.5',
        '60': '0.6',
        '70': '0.7',
        '80': '0.8',
        '90': '0.9',
        '100': '1',
      },
      dropShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px rgba(0, 0, 0, 0.1)',
        '3xl': '0 35px 60px rgba(0, 0, 0, 0.1)',
        '4xl': '0 45px 80px rgba(0, 0, 0, 0.1)',
        '5xl': '0 55px 100px rgba(0, 0, 0, 0.1)',
        '6xl': '0 65px 120px rgba(0, 0, 0, 0.1)',
        '7xl': '0 75px 140px rgba(0, 0, 0, 0.1)',
        '8xl': '0 85px 160px rgba(0, 0, 0, 0.1)',
        '9xl': '0 95px 180px rgba(0, 0, 0, 0.1)',
        '10xl': '0 105px 200px rgba(0, 0, 0, 0.1)',
      }
    }
  },
  plugins: [animate]
};

export default config;
