import type { AppTabItem, NutritionItem, WorkoutItem } from "../types";

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
  { id: "coach", label: "ИИ-план" },
  { id: "nutrition", label: "Питание" },
  { id: "workouts", label: "Тренировки" },
];
