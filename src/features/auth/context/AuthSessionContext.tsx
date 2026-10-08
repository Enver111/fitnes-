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
import { EMPTY_PROFILE, type StoredUser, type UserProfile } from "../types";

interface AuthSessionContextValue {
  user: StoredUser | null;
  isAuthenticated: boolean;
  signIn: (email: string) => void;
  updateProfile: (profile: Partial<UserProfile> & { email?: string }) => void;
  signOut: () => void;
}

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

interface AuthSessionProviderProps {
  children: ReactNode;
}

export function AuthSessionProvider({ children }: AuthSessionProviderProps) {
  const [user, setUser] = useState<StoredUser | null>(() => readStoredUser());

  const signIn = useCallback((email: string) => {
    const existing = readStoredUser();
    const next: StoredUser = {
      ...EMPTY_PROFILE,
      ...(existing?.email === email ? existing : null),
      email,
      signedInAt: Date.now(),
    };
    writeStoredUser(next);
    setUser(next);
  }, []);

  const updateProfile = useCallback(
    (profile: Partial<UserProfile> & { email?: string }) => {
      setUser((prev) => {
        if (!prev) return prev;
        const next: StoredUser = { ...prev, ...profile };
        writeStoredUser(next);
        return next;
      });
    },
    [],
  );

  const signOut = useCallback(() => {
    clearStoredUser();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      signIn,
      updateProfile,
      signOut,
    }),
    [user, signIn, updateProfile, signOut],
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
