import type { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthModalProvider } from "@/features/auth/context/AuthModalContext";
import { AuthSessionProvider } from "@/features/auth/context/AuthSessionContext";
import { ThemeProvider } from "@/shared/theme/ThemeContext";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthSessionProvider>
          <AuthModalProvider>{children}</AuthModalProvider>
        </AuthSessionProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}
