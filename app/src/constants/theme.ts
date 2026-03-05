// UltraMind Design System
// Based on the UI designs with cyan/blue primary color

export const Colors = {
  // Primary Brand Colors
  primary: '#13a4ec',
  primaryLight: '#30bae8',
  primaryDark: '#0d7ab1',
  primaryFaded: 'rgba(19, 164, 236, 0.1)',
  primaryMuted: 'rgba(19, 164, 236, 0.2)',

  // Background Colors
  backgroundLight: '#f6f7f8',
  backgroundDark: '#101c22',
  surfaceLight: '#ffffff',
  surfaceDark: '#1a2a32',
  cardLight: '#ffffff',
  cardDark: '#162229',

  // Text Colors
  textPrimary: '#1a1a2e',
  textSecondary: '#64748b',
  textMuted: '#94a3b8',
  textLight: '#ffffff',
  textDark: '#0f172a',

  // Semantic Colors
  success: '#10b981',
  successLight: '#d1fae5',
  successDark: '#065f46',
  warning: '#f59e0b',
  warningLight: '#fef3c7',
  error: '#ef4444',
  errorLight: '#fee2e2',
  info: '#3b82f6',
  infoLight: '#dbeafe',

  // Accent Colors (from designs)
  sage: '#e2ece6',
  softBlue: '#e1f0f7',
  coral: '#ff7f7f',
  lavender: '#e6e0f8',
  mint: '#d1f7e8',
  peach: '#ffe5d9',

  // Chart Colors
  chartMood: '#8b5cf6',
  chartEnergy: '#f97316',
  chartClarity: '#ec4899',
  chartNutrition: '#10b981',
  chartSleep: '#3b82f6',
  chartStress: '#ef4444',

  // Border Colors
  borderLight: '#e2e8f0',
  borderDark: '#334155',
  borderFocused: '#13a4ec',

  // Overlay Colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(255, 255, 255, 0.8)',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
  massive: 64,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const FontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  title: 28,
  hero: 32,
  display: 40,
};

export const FontWeights = {
  light: '300' as const,
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  primary: {
    shadowColor: '#13a4ec',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
};

export const Theme = {
  light: {
    background: Colors.backgroundLight,
    surface: Colors.surfaceLight,
    card: Colors.cardLight,
    text: Colors.textPrimary,
    textSecondary: Colors.textSecondary,
    textMuted: Colors.textMuted,
    border: Colors.borderLight,
    primary: Colors.primary,
  },
  dark: {
    background: Colors.backgroundDark,
    surface: Colors.surfaceDark,
    card: Colors.cardDark,
    text: Colors.textLight,
    textSecondary: Colors.textMuted,
    textMuted: Colors.textSecondary,
    border: Colors.borderDark,
    primary: Colors.primary,
  },
};

export default {
  Colors,
  Spacing,
  BorderRadius,
  FontSizes,
  FontWeights,
  Shadows,
  Theme,
};
