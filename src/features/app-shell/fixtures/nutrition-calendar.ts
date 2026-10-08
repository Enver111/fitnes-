import type { Locale } from "@/shared/i18n/types";
import { buildCalendarDays, type CalendarSession, type DayType } from "./calendar-grid";

type Session = CalendarSession;

const sessionsEn: Record<string, Session[]> = {
  "02": [
    {
      date: "Wed, 2 Nov",
      time: "8:00 AM",
      title: "Oatmeal with berries",
      participants: ["420 kcal", "18g protein"],
      location: "Breakfast",
    },
    {
      date: "Wed, 2 Nov",
      time: "1:00 PM",
      title: "Chicken bowl with rice",
      participants: ["610 kcal", "42g protein"],
      location: "Lunch",
    },
    {
      date: "Wed, 2 Nov",
      time: "7:00 PM",
      title: "Cottage cheese & veggies",
      participants: ["380 kcal", "32g protein"],
      location: "Dinner",
    },
  ],
  "06": [
    {
      date: "Mon, 6 Nov",
      time: "8:30 AM",
      title: "Greek yogurt parfait",
      participants: ["350 kcal", "24g protein"],
      location: "Breakfast",
    },
    {
      date: "Mon, 6 Nov",
      time: "12:30 PM",
      title: "Turkey wrap",
      participants: ["540 kcal", "36g protein"],
      location: "Lunch",
    },
  ],
  "08": [
    {
      date: "Wed, 8 Nov",
      time: "8:00 AM",
      title: "Egg scramble",
      participants: ["390 kcal", "28g protein"],
      location: "Breakfast",
    },
    {
      date: "Wed, 8 Nov",
      time: "1:00 PM",
      title: "Salmon & quinoa",
      participants: ["650 kcal", "45g protein"],
      location: "Lunch",
    },
    {
      date: "Wed, 8 Nov",
      time: "4:00 PM",
      title: "Protein shake",
      participants: ["220 kcal", "30g protein"],
      location: "Snack",
    },
    {
      date: "Wed, 8 Nov",
      time: "7:30 PM",
      title: "Veggie stir-fry",
      participants: ["480 kcal", "26g protein"],
      location: "Dinner",
    },
  ],
  "15": [
    {
      date: "Wed, 15 Nov",
      time: "9:00 AM",
      title: "Overnight oats",
      participants: ["410 kcal", "20g protein"],
      location: "Breakfast",
    },
    {
      date: "Wed, 15 Nov",
      time: "1:30 PM",
      title: "Beef & sweet potato",
      participants: ["680 kcal", "48g protein"],
      location: "Lunch",
    },
  ],
  "17": [
    {
      date: "Fri, 17 Nov",
      time: "8:00 AM",
      title: "Protein pancakes",
      participants: ["450 kcal", "32g protein"],
      location: "Breakfast",
    },
    {
      date: "Fri, 17 Nov",
      time: "12:00 PM",
      title: "Tuna salad",
      participants: ["420 kcal", "38g protein"],
      location: "Lunch",
    },
    {
      date: "Fri, 17 Nov",
      time: "3:30 PM",
      title: "Apple & peanut butter",
      participants: ["250 kcal", "8g protein"],
      location: "Snack",
    },
    {
      date: "Fri, 17 Nov",
      time: "7:00 PM",
      title: "Grilled chicken plate",
      participants: ["560 kcal", "46g protein"],
      location: "Dinner",
    },
  ],
  "21": [
    {
      date: "Tue, 21 Nov",
      time: "8:00 AM",
      title: "Smoothie bowl",
      participants: ["380 kcal", "22g protein"],
      location: "Breakfast",
    },
    {
      date: "Tue, 21 Nov",
      time: "12:30 PM",
      title: "Pasta with turkey",
      participants: ["720 kcal", "40g protein"],
      location: "Lunch",
    },
    {
      date: "Tue, 21 Nov",
      time: "4:00 PM",
      title: "Rice cakes & hummus",
      participants: ["210 kcal", "7g protein"],
      location: "Snack",
    },
    {
      date: "Tue, 21 Nov",
      time: "7:00 PM",
      title: "Baked cod & salad",
      participants: ["490 kcal", "44g protein"],
      location: "Dinner",
    },
    {
      date: "Tue, 21 Nov",
      time: "9:00 PM",
      title: "Casein yogurt",
      participants: ["180 kcal", "20g protein"],
      location: "Evening snack",
    },
  ],
  "30": [
    {
      date: "Thu, 30 Nov",
      time: "8:30 AM",
      title: "Avocado toast + eggs",
      participants: ["460 kcal", "24g protein"],
      location: "Breakfast",
    },
    {
      date: "Thu, 30 Nov",
      time: "1:00 PM",
      title: "Chicken soup & bread",
      participants: ["520 kcal", "34g protein"],
      location: "Lunch",
    },
  ],
};

const sessionsRu: Record<string, Session[]> = {
  "02": [
    {
      date: "Ср, 2 ноя",
      time: "08:00",
      title: "Овсянка с ягодами",
      participants: ["420 ккал", "18 г белка"],
      location: "Завтрак",
    },
    {
      date: "Ср, 2 ноя",
      time: "13:00",
      title: "Курица с рисом",
      participants: ["610 ккал", "42 г белка"],
      location: "Обед",
    },
    {
      date: "Ср, 2 ноя",
      time: "19:00",
      title: "Творог и овощи",
      participants: ["380 ккал", "32 г белка"],
      location: "Ужин",
    },
  ],
  "06": [
    {
      date: "Пн, 6 ноя",
      time: "08:30",
      title: "Греческий йогурт",
      participants: ["350 ккал", "24 г белка"],
      location: "Завтрак",
    },
    {
      date: "Пн, 6 ноя",
      time: "12:30",
      title: "Ролл с индейкой",
      participants: ["540 ккал", "36 г белка"],
      location: "Обед",
    },
  ],
  "08": [
    {
      date: "Ср, 8 ноя",
      time: "08:00",
      title: "Яичница",
      participants: ["390 ккал", "28 г белка"],
      location: "Завтрак",
    },
    {
      date: "Ср, 8 ноя",
      time: "13:00",
      title: "Лосось и киноа",
      participants: ["650 ккал", "45 г белка"],
      location: "Обед",
    },
    {
      date: "Ср, 8 ноя",
      time: "16:00",
      title: "Протеиновый шейк",
      participants: ["220 ккал", "30 г белка"],
      location: "Перекус",
    },
    {
      date: "Ср, 8 ноя",
      time: "19:30",
      title: "Овощной вок",
      participants: ["480 ккал", "26 г белка"],
      location: "Ужин",
    },
  ],
  "15": [
    {
      date: "Ср, 15 ноя",
      time: "09:00",
      title: "Ночная овсянка",
      participants: ["410 ккал", "20 г белка"],
      location: "Завтрак",
    },
    {
      date: "Ср, 15 ноя",
      time: "13:30",
      title: "Говядина и батат",
      participants: ["680 ккал", "48 г белка"],
      location: "Обед",
    },
  ],
  "17": [
    {
      date: "Пт, 17 ноя",
      time: "08:00",
      title: "Протеиновые панкейки",
      participants: ["450 ккал", "32 г белка"],
      location: "Завтрак",
    },
    {
      date: "Пт, 17 ноя",
      time: "12:00",
      title: "Салат с тунцом",
      participants: ["420 ккал", "38 г белка"],
      location: "Обед",
    },
    {
      date: "Пт, 17 ноя",
      time: "15:30",
      title: "Яблоко и арахисовая паста",
      participants: ["250 ккал", "8 г белка"],
      location: "Перекус",
    },
    {
      date: "Пт, 17 ноя",
      time: "19:00",
      title: "Куриная грудка",
      participants: ["560 ккал", "46 г белка"],
      location: "Ужин",
    },
  ],
  "21": [
    {
      date: "Вт, 21 ноя",
      time: "08:00",
      title: "Смузи-боул",
      participants: ["380 ккал", "22 г белка"],
      location: "Завтрак",
    },
    {
      date: "Вт, 21 ноя",
      time: "12:30",
      title: "Паста с индейкой",
      participants: ["720 ккал", "40 г белка"],
      location: "Обед",
    },
    {
      date: "Вт, 21 ноя",
      time: "16:00",
      title: "Хлебцы с хумусом",
      participants: ["210 ккал", "7 г белка"],
      location: "Перекус",
    },
    {
      date: "Вт, 21 ноя",
      time: "19:00",
      title: "Треска и салат",
      participants: ["490 ккал", "44 г белка"],
      location: "Ужин",
    },
    {
      date: "Вт, 21 ноя",
      time: "21:00",
      title: "Творожный йогурт",
      participants: ["180 ккал", "20 г белка"],
      location: "Вечерний перекус",
    },
  ],
  "30": [
    {
      date: "Чт, 30 ноя",
      time: "08:30",
      title: "Тост с авокадо и яйцом",
      participants: ["460 ккал", "24 г белка"],
      location: "Завтрак",
    },
    {
      date: "Чт, 30 ноя",
      time: "13:00",
      title: "Куриный суп и хлеб",
      participants: ["520 ккал", "34 г белка"],
      location: "Обед",
    },
  ],
};

export function getNutritionCalendarDays(locale: Locale): DayType[] {
  return buildCalendarDays(locale === "ru" ? sessionsRu : sessionsEn);
}
