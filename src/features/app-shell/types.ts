export type AppTab = "chat" | "nutrition" | "workouts" | "profile";

export type ChatRole = "user" | "ai";

export interface ChatMessage {
  role: ChatRole;
  text: string;
}

export interface NutritionItem {
  title: string;
  value: string;
}

export interface WorkoutItem {
  day: string;
  focus: string;
}

export interface AppTabItem {
  id: AppTab;
  label: string;
}
