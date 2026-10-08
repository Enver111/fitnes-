import type { CalendarSession, DayType } from "./calendar-types";

export type { CalendarSession, DayType } from "./calendar-types";

export const DAY_OUT = "bg-secondary";
export const DAY_IN = "border border-line bg-ink-soft";
export const DAY_ACTIVE = "border border-line bg-ink-soft cursor-pointer";

export const CALENDAR_DAY_KEYS = [
  "-3",
  "-2",
  "-1",
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "29",
  "30",
  "+1",
  "+2",
] as const;

export const OUT_OF_MONTH_DAYS = new Set([
  "-3",
  "-2",
  "-1",
  "04",
  "05",
  "11",
  "12",
  "18",
  "19",
  "25",
  "26",
  "+1",
  "+2",
]);

export function buildCalendarDays(
  sessions: Record<string, CalendarSession[]>,
): DayType[] {
  return CALENDAR_DAY_KEYS.map((day) => {
    if (OUT_OF_MONTH_DAYS.has(day)) {
      return { day, classNames: DAY_OUT };
    }
    const meetingInfo = sessions[day];
    if (meetingInfo) {
      return { day, classNames: DAY_ACTIVE, meetingInfo };
    }
    return { day, classNames: DAY_IN };
  });
}
