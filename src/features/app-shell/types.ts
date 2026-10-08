export type AppTab = "coach" | "nutrition" | "workouts" | "profile";

export type FitnessGoal = "lose" | "gain" | "tone" | "maintain";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "active";
export type ExperienceLevel = "beginner" | "intermediate" | "advanced";
export type TrainingPlace = "home" | "gym" | "both";
export type DietPreference = "none" | "vegetarian" | "vegan" | "keto" | "halal";

export interface CoachIntakeData {
  goal: FitnessGoal | null;
  age: string;
  activity: ActivityLevel | null;
  experience: ExperienceLevel | null;
  daysPerWeek: number | null;
  sessionMinutes: number | null;
  place: TrainingPlace | null;
  limitations: string;
  diet: DietPreference | null;
  allergies: string;
  mealsPerDay: number | null;
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
