export type AuthMode = "login" | "register";

export const MOCK_AVATARS = [
  { id: "a1", label: "A", color: "#2ee6a6" },
  { id: "a2", label: "B", color: "#ff5a3c" },
  { id: "a3", label: "C", color: "#5b8cff" },
  { id: "a4", label: "D", color: "#f5c542" },
] as const;

export type MockAvatarId = (typeof MOCK_AVATARS)[number]["id"];

export interface UserProfile {
  firstName: string;
  lastName: string;
  heightCm: string;
  weightKg: string;
  /** Mock avatar id — real upload later */
  avatarId: MockAvatarId;
}

export interface StoredUser extends UserProfile {
  email: string;
  signedInAt: number;
}

export const EMPTY_PROFILE: UserProfile = {
  firstName: "",
  lastName: "",
  heightCm: "",
  weightKg: "",
  avatarId: MOCK_AVATARS[0].id,
};

export function isMockAvatarId(value: string): value is MockAvatarId {
  return MOCK_AVATARS.some((a) => a.id === value);
}
