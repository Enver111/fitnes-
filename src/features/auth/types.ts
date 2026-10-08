export type AuthMode = "login" | "register";

export interface StoredUser {
  email: string;
  signedInAt: number;
}
