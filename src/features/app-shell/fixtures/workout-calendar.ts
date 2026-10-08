import type { Locale } from "@/shared/i18n/types";
import { buildCalendarDays, type CalendarSession, type DayType } from "./calendar-grid";

export type { CalendarSession, DayType };

type Session = CalendarSession;

const sessionsEn: Record<string, Session[]> = {
  "02": [
    {
      date: "Wed, 2 Nov",
      time: "10:00 AM – 11:00 AM",
      title: "Upper Body Strength",
      participants: ["Coach Alex", "You"],
      location: "Gym Floor A",
    },
    {
      date: "Wed, 2 Nov",
      time: "1:00 PM – 2:00 PM",
      title: "Mobility Flow",
      participants: ["Coach Mira", "You"],
      location: "Studio 2",
    },
  ],
  "06": [
    {
      date: "Mon, 6 Nov",
      time: "10:00 AM – 11:00 AM",
      title: "HIIT Circuit",
      participants: ["Coach Sam", "You"],
      location: "Gym Floor B",
    },
  ],
  "08": [
    {
      date: "Wed, 8 Nov",
      time: "2:00 PM – 3:00 PM",
      title: "Lower Body Strength",
      participants: ["Coach Alex", "You"],
      location: "Gym Floor A",
    },
    {
      date: "Wed, 8 Nov",
      time: "4:00 PM – 5:00 PM",
      title: "Core & Stability",
      participants: ["Coach Mira", "You"],
      location: "Studio 1",
    },
    {
      date: "Wed, 8 Nov",
      time: "5:30 PM – 6:30 PM",
      title: "Recovery Stretch",
      participants: ["You"],
      location: "Home",
    },
  ],
  "15": [
    {
      date: "Wed, 15 Nov",
      time: "9:00 AM – 10:00 AM",
      title: "Push Day",
      participants: ["Coach Alex", "You"],
      location: "Gym Floor A",
    },
  ],
  "17": [
    {
      date: "Fri, 17 Nov",
      time: "9:00 AM – 10:00 AM",
      title: "Pull Day",
      participants: ["Coach Sam", "You"],
      location: "Gym Floor B",
    },
    {
      date: "Fri, 17 Nov",
      time: "11:00 AM – 12:00 PM",
      title: "Cardio Intervals",
      participants: ["You"],
      location: "Treadmill Zone",
    },
    {
      date: "Fri, 17 Nov",
      time: "2:00 PM – 3:00 PM",
      title: "Form Check",
      participants: ["Coach Mira", "You"],
      location: "Studio 2",
    },
    {
      date: "Fri, 17 Nov",
      time: "4:00 PM – 5:00 PM",
      title: "Cool-down Yoga",
      participants: ["You"],
      location: "Home",
    },
  ],
  "21": [
    {
      date: "Tue, 21 Nov",
      time: "11:00 AM – 12:00 PM",
      title: "Full Body Power",
      participants: ["Coach Alex", "You"],
      location: "Gym Floor A",
    },
    {
      date: "Tue, 21 Nov",
      time: "1:00 PM – 2:00 PM",
      title: "Conditioning",
      participants: ["Coach Sam", "You"],
      location: "Gym Floor B",
    },
    {
      date: "Tue, 21 Nov",
      time: "3:00 PM – 4:00 PM",
      title: "Technique Drills",
      participants: ["Coach Mira", "You"],
      location: "Studio 1",
    },
    {
      date: "Tue, 21 Nov",
      time: "5:00 PM – 6:00 PM",
      title: "Team Workout",
      participants: ["Group Class", "You"],
      location: "Main Hall",
    },
    {
      date: "Tue, 21 Nov",
      time: "7:00 PM – 8:00 PM",
      title: "Evening Walk",
      participants: ["You"],
      location: "Outdoor Track",
    },
  ],
  "30": [
    {
      date: "Thu, 30 Nov",
      time: "11:00 AM – 12:00 PM",
      title: "Deload Session",
      participants: ["Coach Alex", "You"],
      location: "Gym Floor A",
    },
  ],
};

const sessionsRu: Record<string, Session[]> = {
  "02": [
    {
      date: "Ср, 2 ноя",
      time: "10:00 – 11:00",
      title: "Сила: верх тела",
      participants: ["Тренер Алекс", "Ты"],
      location: "Зал A",
    },
    {
      date: "Ср, 2 ноя",
      time: "13:00 – 14:00",
      title: "Мобилити",
      participants: ["Тренер Мира", "Ты"],
      location: "Студия 2",
    },
  ],
  "06": [
    {
      date: "Пн, 6 ноя",
      time: "10:00 – 11:00",
      title: "HIIT-круговая",
      participants: ["Тренер Сэм", "Ты"],
      location: "Зал B",
    },
  ],
  "08": [
    {
      date: "Ср, 8 ноя",
      time: "14:00 – 15:00",
      title: "Сила: низ тела",
      participants: ["Тренер Алекс", "Ты"],
      location: "Зал A",
    },
    {
      date: "Ср, 8 ноя",
      time: "16:00 – 17:00",
      title: "Кор и стабильность",
      participants: ["Тренер Мира", "Ты"],
      location: "Студия 1",
    },
    {
      date: "Ср, 8 ноя",
      time: "17:30 – 18:30",
      title: "Растяжка",
      participants: ["Ты"],
      location: "Дома",
    },
  ],
  "15": [
    {
      date: "Ср, 15 ноя",
      time: "09:00 – 10:00",
      title: "Жим / push",
      participants: ["Тренер Алекс", "Ты"],
      location: "Зал A",
    },
  ],
  "17": [
    {
      date: "Пт, 17 ноя",
      time: "09:00 – 10:00",
      title: "Тяга / pull",
      participants: ["Тренер Сэм", "Ты"],
      location: "Зал B",
    },
    {
      date: "Пт, 17 ноя",
      time: "11:00 – 12:00",
      title: "Кардио-интервалы",
      participants: ["Ты"],
      location: "Дорожки",
    },
    {
      date: "Пт, 17 ноя",
      time: "14:00 – 15:00",
      title: "Проверка техники",
      participants: ["Тренер Мира", "Ты"],
      location: "Студия 2",
    },
    {
      date: "Пт, 17 ноя",
      time: "16:00 – 17:00",
      title: "Йога на заминку",
      participants: ["Ты"],
      location: "Дома",
    },
  ],
  "21": [
    {
      date: "Вт, 21 ноя",
      time: "11:00 – 12:00",
      title: "Full body power",
      participants: ["Тренер Алекс", "Ты"],
      location: "Зал A",
    },
    {
      date: "Вт, 21 ноя",
      time: "13:00 – 14:00",
      title: "Кондишн",
      participants: ["Тренер Сэм", "Ты"],
      location: "Зал B",
    },
    {
      date: "Вт, 21 ноя",
      time: "15:00 – 16:00",
      title: "Техника",
      participants: ["Тренер Мира", "Ты"],
      location: "Студия 1",
    },
    {
      date: "Вт, 21 ноя",
      time: "17:00 – 18:00",
      title: "Групповая тренировка",
      participants: ["Группа", "Ты"],
      location: "Главный зал",
    },
    {
      date: "Вт, 21 ноя",
      time: "19:00 – 20:00",
      title: "Вечерняя прогулка",
      participants: ["Ты"],
      location: "Улица",
    },
  ],
  "30": [
    {
      date: "Чт, 30 ноя",
      time: "11:00 – 12:00",
      title: "Deload / разгрузка",
      participants: ["Тренер Алекс", "Ты"],
      location: "Зал A",
    },
  ],
};

export function getWorkoutCalendarDays(locale: Locale): DayType[] {
  return buildCalendarDays(locale === "ru" ? sessionsRu : sessionsEn);
}
