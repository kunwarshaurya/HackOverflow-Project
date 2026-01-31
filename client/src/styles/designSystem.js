// Design System — Brown & Complementary Palette (single source for theme)

export const colors = {
  primary: {
    50: '#fef9f3',
    100: '#ffeadb',
    200: '#ffdec7',
    300: '#f5e6d3',
    400: '#efa3a0',
    500: '#d4a89c',
    600: '#8b597b',
    700: '#5c3a52',
    800: '#493129',
    900: '#2a1b16',
  },
  secondary: {
    50: '#fefaf6',
    100: '#fdf5ed',
    200: '#fde8c8',
    300: '#fad49c',
    400: '#e8c9a0',
    500: '#c9a882',
    600: '#8b597b',
    700: '#5c3a52',
    800: '#493129',
    900: '#2d2018',
  },
  neutral: {
    50: '#fafaf9',
    100: '#f5f5f4',
    200: '#e7e5e4',
    300: '#d6d3d1',
    400: '#a8a29e',
    500: '#78716c',
    600: '#57534e',
    700: '#44403c',
    800: '#292524',
    900: '#1c1917',
  },
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  background: {
    primary: '#ffffff',
    secondary: '#ffeadb',
    tertiary: '#ffdec7',
    dark: '#493129',
  },
  text: {
    primary: '#493129',
    secondary: '#8b597b',
    tertiary: '#5c3a52',
    inverse: '#ffeadb',
  },
  brand: {
    brown: '#493129',
    accent: '#8b597b',
    cream: '#ffeadb',
    creamLight: '#ffdec7',
    accentLight: '#efa3a0',
    white: '#ffffff',
  },
};

export const typography = {
  fontFamily: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    display: "'Poppins', 'Inter', sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
    '7xl': '4.5rem',
  },
  fontWeight: { light: 300, normal: 400, medium: 500, semibold: 600, bold: 700, extrabold: 800, black: 900 },
};

export const borderRadius = {
  none: '0', sm: '0.25rem', base: '0.5rem', md: '0.75rem', lg: '1rem', xl: '1.5rem', '2xl': '2rem', '3xl': '3rem', full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  none: 'none',
};

export default { colors, typography, borderRadius, shadows };
