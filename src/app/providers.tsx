import type { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthModalProvider } from "@/features/auth/context/AuthModalContext";
import { AuthSessionProvider } from "@/features/auth/context/AuthSessionContext";
import { LocaleProvider } from "@/shared/i18n/LocaleContext";
import { ThemeProvider } from "@/shared/theme/ThemeContext";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <LocaleProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AuthSessionProvider>
            <AuthModalProvider>{children}</AuthModalProvider>
          </AuthSessionProvider>
        </BrowserRouter>
      </LocaleProvider>
    </ThemeProvider>
  );
}
