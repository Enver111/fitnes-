import { useMemo } from "react";
import InteractiveCalendar, {
  type InteractiveCalendarLabels,
} from "@/components/ui/visualize-booking";
import { getNutritionCalendarDays } from "@/features/app-shell/fixtures/nutrition-calendar";
import { getWorkoutCalendarDays } from "@/features/app-shell/fixtures/workout-calendar";
import { useLocale } from "@/shared/i18n/LocaleContext";

function useCalendarWeekdays(): string[] {
  const { t } = useLocale();
  return [
    t("app.calSun"),
    t("app.calMon"),
    t("app.calTue"),
    t("app.calWed"),
    t("app.calThu"),
    t("app.calFri"),
    t("app.calSat"),
  ];
}

function WorkoutCalendarDemo() {
  const { t, locale } = useLocale();
  const daysOfWeek = useCalendarWeekdays();
  const days = useMemo(() => getWorkoutCalendarDays(locale), [locale]);

  const labels: InteractiveCalendarLabels = {
    month: t("app.calMonth"),
    year: t("app.calYear"),
    listTitle: t("app.calListTitle"),
    listHint: t("app.calListHint"),
    showList: t("app.calShowList"),
    showCalendar: t("app.calShowCalendar"),
    daysOfWeek,
  };

  return (
    <div className="flex w-full flex-col items-center justify-start">
      <InteractiveCalendar days={days} labels={labels} />
    </div>
  );
}

function NutritionCalendarDemo() {
  const { t, locale } = useLocale();
  const daysOfWeek = useCalendarWeekdays();
  const days = useMemo(() => getNutritionCalendarDays(locale), [locale]);

  const labels: InteractiveCalendarLabels = {
    month: t("app.calMonth"),
    year: t("app.calYear"),
    listTitle: t("app.nutritionCalListTitle"),
    listHint: t("app.nutritionCalListHint"),
    showList: t("app.nutritionCalShowList"),
    showCalendar: t("app.nutritionCalShowCalendar"),
    daysOfWeek,
  };

  return (
    <div className="flex w-full flex-col items-center justify-start">
      <InteractiveCalendar days={days} labels={labels} />
    </div>
  );
}

export {
  WorkoutCalendarDemo as DemoOne,
  NutritionCalendarDemo as NutritionDemo,
};
