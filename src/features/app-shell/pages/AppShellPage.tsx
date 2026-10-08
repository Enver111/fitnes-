import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Apple, Dumbbell, LogOut, MessageCircle, User } from "lucide-react";
import { NavBar } from "@/components/ui/tubelight-navbar";
import {
  DemoOne as WorkoutCalendar,
  NutritionDemo as NutritionCalendar,
} from "@/components/ui/visualize-booking-demo";
import { useAuthSession } from "@/features/auth/context/AuthSessionContext";
import { LanguageToggle } from "@/shared/i18n/LanguageToggle";
import { useLocale } from "@/shared/i18n/LocaleContext";
import { ThemeToggle } from "../components/ThemeToggle";
import type { AppTab, ChatMessage } from "../types";

export function AppShellPage() {
  const { user, signOut } = useAuthSession();
  const { t, locale } = useLocale();
  const navigate = useNavigate();
  const [tab, setTab] = useState<AppTab>("chat");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const userEmail = user?.email ?? t("app.demoProfile");
  const wideTab = tab === "workouts" || tab === "nutrition";

  const navItems = [
    { id: "chat" as const, name: t("app.tabChat"), url: "#chat", icon: MessageCircle },
    { id: "nutrition" as const, name: t("app.tabNutrition"), url: "#nutrition", icon: Apple },
    { id: "workouts" as const, name: t("app.tabWorkouts"), url: "#workouts", icon: Dumbbell },
    { id: "profile" as const, name: t("app.tabProfile"), url: "#profile", icon: User },
  ];

  const activeNavName =
    navItems.find((item) => item.id === tab)?.name ?? navItems[0].name;

  useEffect(() => {
    setMessages([
      { role: "ai", text: t("app.msg1") },
      { role: "user", text: t("app.msg2") },
      { role: "ai", text: t("app.msg3") },
    ]);
  }, [locale, t]);

  function handleSignOut() {
    signOut();
    navigate("/");
  }

  function handleTabChange(name: string) {
    const next = navItems.find((item) => item.name === name);
    if (next) setTab(next.id);
  }

  function sendMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", text },
      {
        role: "ai",
        text: t("app.demoReply"),
      },
    ]);
    setInput("");
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
        {tab === "chat" && (
          <>
            <div className="flex-1 space-y-4 overflow-y-auto pb-4">
              {messages.map((msg, i) => (
                <div
                  key={`${msg.role}-${i}`}
                  className={`max-w-[90%] rounded-sm px-4 py-3 text-sm leading-relaxed md:text-base ${
                    msg.role === "user"
                      ? "ml-auto bg-signal/15 text-mist"
                      : "bg-ink-soft text-fog"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            <form onSubmit={sendMessage} className="mt-auto flex gap-2 pt-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-11 flex-1 rounded-sm border border-line bg-ink-soft px-3 text-sm outline-none focus:border-signal"
                placeholder={t("app.chatPlaceholder")}
              />
              <button
                type="submit"
                className="rounded-sm bg-signal px-4 text-sm font-semibold text-on-accent transition hover:bg-cta-hover hover:text-ink-soft"
              >
                {t("app.send")}
              </button>
            </form>
          </>
        )}

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

        {tab === "profile" && (
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold">{t("app.profileTitle")}</h1>
            <p className="text-sm text-fog">{t("app.profileHint")}</p>
            <ul className="divide-y divide-line border border-line">
              <li className="flex flex-col gap-1 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-fog">{t("app.profileEmail")}</span>
                <span className="font-medium break-all">{userEmail}</span>
              </li>
            </ul>
            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-sm border border-line px-4 py-2.5 text-sm text-fog transition hover:border-signal hover:text-mist"
            >
              {t("app.signOut")}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
