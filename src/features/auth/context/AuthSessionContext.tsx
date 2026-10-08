import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  clearStoredUser,
  readStoredUser,
  writeStoredUser,
} from "../lib/storage";
import type { StoredUser } from "../types";

interface AuthSessionContextValue {
  user: StoredUser | null;
  isAuthenticated: boolean;
  signIn: (email: string) => void;
  signOut: () => void;
}

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

interface AuthSessionProviderProps {
  children: ReactNode;
}

export function AuthSessionProvider({ children }: AuthSessionProviderProps) {
  const [user, setUser] = useState<StoredUser | null>(() => readStoredUser());

  const signIn = useCallback((email: string) => {
    const next: StoredUser = { email, signedInAt: Date.now() };
    writeStoredUser(next);
    setUser(next);
  }, []);

  const signOut = useCallback(() => {
    clearStoredUser();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      signIn,
      signOut,
    }),
    [user, signIn, signOut],
  );

  return (
    <AuthSessionContext.Provider value={value}>
      {children}
    </AuthSessionContext.Provider>
  );
}

export function useAuthSession() {
  const ctx = useContext(AuthSessionContext);
  if (!ctx) {
    throw new Error("useAuthSession must be used within AuthSessionProvider");
  }
  return ctx;
}
