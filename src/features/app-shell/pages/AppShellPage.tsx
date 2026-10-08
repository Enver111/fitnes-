import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Apple, Dumbbell, LogOut, Sparkles, User } from "lucide-react";
import { NavBar } from "@/components/ui/tubelight-navbar";
import {
  DemoOne as WorkoutCalendar,
  NutritionDemo as NutritionCalendar,
} from "@/components/ui/visualize-booking-demo";
import { useAuthSession } from "@/features/auth/context/AuthSessionContext";
import { LanguageToggle } from "@/shared/i18n/LanguageToggle";
import { useLocale } from "@/shared/i18n/LocaleContext";
import { CoachIntakePanel } from "../components/CoachIntakePanel";
import { ProfilePanel } from "../components/ProfilePanel";
import { ThemeToggle } from "../components/ThemeToggle";
import type { AppTab } from "../types";

export function AppShellPage() {
  const { signOut } = useAuthSession();
  const { t } = useLocale();
  const navigate = useNavigate();
  const [tab, setTab] = useState<AppTab>("coach");
  const wideTab = tab === "workouts" || tab === "nutrition";

  const navItems = [
    {
      id: "coach" as const,
      name: t("app.tabCoach"),
      url: "#coach",
      icon: Sparkles,
    },
    {
      id: "nutrition" as const,
      name: t("app.tabNutrition"),
      url: "#nutrition",
      icon: Apple,
    },
    {
      id: "workouts" as const,
      name: t("app.tabWorkouts"),
      url: "#workouts",
      icon: Dumbbell,
    },
    {
      id: "profile" as const,
      name: t("app.tabProfile"),
      url: "#profile",
      icon: User,
    },
  ];

  const activeNavName =
    navItems.find((item) => item.id === tab)?.name ?? navItems[0].name;

  function handleSignOut() {
    signOut();
    navigate("/");
  }

  function handleTabChange(name: string) {
    const next = navItems.find((item) => item.name === name);
    if (next) setTab(next.id);
  }

  return (
    <div className="flex min-h-svh flex-col bg-ink text-mist">
      <NavBar
        items={navItems}
        activeTab={activeNavName}
        onTabChange={handleTabChange}
        trailing={
          <>
            <LanguageToggle className="size-9 shrink-0 rounded-full text-foreground/80 hover:bg-muted hover:text-primary" />
            <ThemeToggle className="size-9 shrink-0 rounded-full border-transparent text-foreground/80 hover:border-border hover:bg-muted hover:text-primary" />
            <button
              type="button"
              onClick={handleSignOut}
              aria-label={t("app.signOut")}
              title={t("app.signOut")}
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-muted hover:text-primary"
            >
              <LogOut size={18} strokeWidth={2.5} aria-hidden />
            </button>
          </>
        }
      />

      <main
        className={`mx-auto flex w-full flex-1 flex-col px-4 py-6 pb-24 sm:px-8 sm:pb-6 sm:pt-24 ${
          wideTab ? "max-w-5xl" : "max-w-3xl"
        }`}
      >
        {tab === "coach" && <CoachIntakePanel />}

        {tab === "nutrition" && (
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">{t("app.nutritionTitle")}</h1>
            <p className="text-sm text-fog">{t("app.nutritionHint")}</p>
            <NutritionCalendar />
          </div>
        )}

        {tab === "workouts" && (
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">{t("app.workoutsTitle")}</h1>
            <p className="text-sm text-fog">{t("app.workoutsHint")}</p>
            <WorkoutCalendar />
          </div>
        )}

        {tab === "profile" && <ProfilePanel onSignOut={handleSignOut} />}
      </main>
    </div>
  );
}
