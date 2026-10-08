import { useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { AuthModal } from "@/features/auth/components/AuthModal";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { useAuthModal } from "@/features/auth/context/AuthModalContext";
import type { AuthMode } from "@/features/auth/types";
import { AppShellPage } from "@/features/app-shell/pages/AppShellPage";
import { LandingPage } from "@/features/landing/pages/LandingPage";

interface AuthRouteProps {
  mode: AuthMode;
}

function AuthRoute({ mode }: AuthRouteProps) {
  const navigate = useNavigate();
  const { openAuth } = useAuthModal();

  useEffect(() => {
    openAuth(mode);
    navigate("/", { replace: true });
  }, [mode, navigate, openAuth]);

  return null;
}

export function AppRouter() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthRoute mode="login" />} />
        <Route path="/register" element={<AuthRoute mode="register" />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppShellPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <AuthModal />
    </>
  );
}
