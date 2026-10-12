const assetBase = import.meta.env.BASE_URL;

export const APP_ICONS = {
  dark: `${assetBase}app-icon-dark.png`,
  light: `${assetBase}app-icon-light.png`,
} as const;

export const FAVICONS = {
  dark: `${assetBase}favicon-dark.svg`,
  light: `${assetBase}favicon-light.svg`,
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
