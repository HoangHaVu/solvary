/**
 * Single source of truth for Voltify brand colors.
 * Update this file to change the visual identity across the app.
 */
export const COLORS = {
  primary: '#FAEE00',
  primaryHover: '#E3D600',
  secondary: '#303030',
  secondaryHover: '#1A1A1A',
  bgAlt: '#F8FAFB',
  tint: '#E8F4FD',
} as const;

export type ThemeColor = keyof typeof COLORS;
