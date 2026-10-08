export const APP_ICONS = {
  dark: "/app-icon-dark.png",
  light: "/app-icon-light.png",
} as const;

export const FAVICONS = {
  dark: "/favicon-dark.svg",
  light: "/favicon-light.svg",
} as const;

export const THEME_COLORS = {
  dark: "#0D3D2E",
  light: "#2EE6A6",
} as const;

export type BrandThemeId = keyof typeof APP_ICONS;

export function faviconHref(theme: BrandThemeId) {
  return FAVICONS[theme];
}

export function appIconHref(theme: BrandThemeId) {
  return APP_ICONS[theme];
}
