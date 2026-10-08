import type {
  AppTabItem,
  ChatMessage,
  NutritionItem,
  WorkoutItem,
} from "../types";

export const mockMessages: ChatMessage[] = [
  {
    role: "ai",
    text: "Привет! Я твой AI-тренер. Расскажи цель — похудение, набор или тонус — и что есть из оборудования.",
  },
  {
    role: "user",
    text: "Хочу похудеть, тренируюсь дома 3 раза в неделю.",
  },
  {
    role: "ai",
    text: "Ок. Ниже черновик рациона и домашних тренировок — сохранится в профиле после онбординга.",
  },
];

export const nutritionItems: NutritionItem[] = [
  { title: "Калории", value: "~1850 ккал / день" },
  { title: "Белок", value: "120–140 г" },
  { title: "Пример дня", value: "Овсянка · курица с рисом · творог · овощи" },
];

export const workoutItems: WorkoutItem[] = [
  { day: "Пн", focus: "Full body · приседания, отжимания, планка" },
  { day: "Ср", focus: "Кардио + кор · берпи, mountain climbers" },
  { day: "Пт", focus: "Сила ног/спины · выпады, тяга с рюкзаком" },
];

export const appTabs: AppTabItem[] = [
  { id: "chat", label: "Чат с ИИ" },
  { id: "nutrition", label: "Питание" },
  { id: "workouts", label: "Тренировки" },
];
