import type { AuthMode } from "@/features/auth/types";

export interface NavItem {
  name: string;
  href?: string;
  action?: AuthMode;
}

export const landingNavItems: NavItem[] = [
  { name: "Главная", href: "#home" },
  { name: "Блог", href: "#blog" },
  { name: "Войти", href: "#login", action: "login" },
];
