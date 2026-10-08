import { useEffect, type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthModal } from "../context/AuthModalContext";
import { useAuthSession } from "../context/AuthSessionContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuthSession();
  const { openAuth } = useAuthModal();

  useEffect(() => {
    if (!isAuthenticated) {
      openAuth("login");
    }
  }, [isAuthenticated, openAuth]);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}
