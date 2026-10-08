import type { AuthMode } from "@/features/auth/types";
import type { TranslationKey } from "@/shared/i18n/LocaleContext";

export interface NavItem {
  labelKey: TranslationKey;
  href?: string;
  action?: AuthMode;
}

export const landingNavItems: NavItem[] = [
  { labelKey: "nav.home", href: "#home" },
  { labelKey: "nav.blog", href: "#blog" },
  { labelKey: "nav.login", href: "#login", action: "login" },
];
