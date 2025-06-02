export const theme = {
  colors: {
    // Cores principais
    primary: '255, 105, 180', // Rosa vibrante
    primaryForeground: '255, 255, 255',

    // Cores secundárias
    secondary: '239, 68, 68', // Vermelho moderno
    secondaryForeground: '255, 255, 255',

    // Cores de destaque
    accent: '147, 197, 253', // Azul claro
    accentForeground: '255, 255, 255',

    // Cores de fundo
    background: '250, 249, 255', // Branco suave
    foreground: '31, 41, 55', // Preto suave

    // Cores de interação
    muted: '249, 250, 251',
    mutedForeground: '107, 114, 128',

    // Cores de feedback
    destructive: '239, 68, 68',
    destructiveForeground: '255, 255, 255',

    // Cores de interface
    border: '229, 231, 235',
    input: '249, 250, 251',
    ring: '191, 219, 254',

    // Cores de popovers
    popover: '255, 255, 255',
    popoverForeground: '97, 104, 114',

    // Cores de cards
    card: '255, 255, 255',
    cardForeground: '97, 104, 114',
  },

  // Configurações de espaçamento
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    '4xl': '2.5rem',
    '5xl': '3rem',
  },

  // Configurações de bordas
  borders: {
    radius: {
      sm: '0.125rem',
      md: '0.25rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      '3xl': '1.5rem',
      full: '9999px',
    },
  },

  // Configurações de sombras
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },

  // Configurações de transições
  transitions: {
    duration: '200ms',
    timing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Configurações de fontes
  fonts: {
    sans: 'Inter, system-ui, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
}
