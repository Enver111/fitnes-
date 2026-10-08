import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthMode } from "../types";

interface AuthModalContextValue {
  open: boolean;
  mode: AuthMode;
  setMode: (mode: AuthMode) => void;
  openAuth: (nextMode?: AuthMode) => void;
  closeAuth: () => void;
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

interface AuthModalProviderProps {
  children: ReactNode;
}

export function AuthModalProvider({ children }: AuthModalProviderProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("register");

  const openAuth = useCallback((nextMode: AuthMode = "register") => {
    setMode(nextMode === "login" ? "login" : "register");
    setOpen(true);
  }, []);

  const closeAuth = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ open, mode, setMode, openAuth, closeAuth }),
    [open, mode, openAuth, closeAuth],
  );

  return (
    <AuthModalContext.Provider value={value}>
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) {
    throw new Error("useAuthModal must be used within AuthModalProvider");
  }
  return ctx;
}
