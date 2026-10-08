import { USER_STORAGE_KEY } from "@/shared/constants/storage-keys";
import type { StoredUser } from "../types";

export function readStoredUser(): StoredUser | null {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("email" in parsed) ||
      typeof (parsed as StoredUser).email !== "string"
    ) {
      return null;
    }
    const user = parsed as StoredUser;
    return {
      email: user.email,
      signedInAt:
        typeof user.signedInAt === "number" ? user.signedInAt : Date.now(),
    };
  } catch {
    return null;
  }
}

export function writeStoredUser(user: StoredUser): void {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

export function clearStoredUser(): void {
  localStorage.removeItem(USER_STORAGE_KEY);
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
