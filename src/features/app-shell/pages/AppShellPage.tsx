import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  useEffect(() => {
    setMessages([
      { role: "ai", text: t("app.msg1") },
      { role: "user", text: t("app.msg2") },
      { role: "ai", text: t("app.msg3") },
    ]);
  }, [locale, t]);

  const appTabs = [
    { id: "chat" as const, label: t("app.tabChat") },
    { id: "nutrition" as const, label: t("app.tabNutrition") },
    { id: "workouts" as const, label: t("app.tabWorkouts") },
  ];

  const nutritionItems = [
    { title: t("app.calTitle"), value: t("app.calValue") },
    { title: t("app.proteinTitle"), value: t("app.proteinValue") },
    { title: t("app.dayTitle"), value: t("app.dayValue") },
  ];

  const workoutItems = [
    { day: t("app.mon"), focus: t("app.monFocus") },
    { day: t("app.wed"), focus: t("app.wedFocus") },
    { day: t("app.fri"), focus: t("app.friFocus") },
  ];

  function handleSignOut() {
    signOut();
    navigate("/");
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
    <div className="flex min-h-[100svh] flex-col bg-ink text-mist">
      <header className="flex items-center justify-between border-b border-line px-4 py-4 md:px-8">
        <Link to="/" className="font-display text-xl tracking-[0.12em]">
          FITNES
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <LanguageToggle className="size-9 rounded-sm border border-line text-fog hover:border-signal hover:bg-transparent hover:text-mist" />
          <ThemeToggle />
          <span className="hidden truncate text-fog sm:inline">{userEmail}</span>
          <button
            type="button"
            onClick={handleSignOut}
            className="text-fog hover:text-mist"
          >
            {t("app.signOut")}
          </button>
        </div>
      </header>

      <div className="flex gap-1 border-b border-line px-4 md:px-8">
        {appTabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`border-b-2 px-3 py-3 text-sm font-medium transition ${
              tab === item.id
                ? "border-signal text-mist"
                : "border-transparent text-fog hover:text-mist"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6 md:px-8">
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
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold">{t("app.nutritionTitle")}</h1>
            <p className="text-sm text-fog">{t("app.nutritionHint")}</p>
            <ul className="divide-y divide-line border border-line">
              {nutritionItems.map((item) => (
                <li
                  key={item.title}
                  className="flex flex-col gap-1 px-4 py-4 sm:flex-row sm:justify-between"
                >
                  <span className="text-fog">{item.title}</span>
                  <span className="font-medium">{item.value}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === "workouts" && (
          <div className="space-y-4">
            <h1 className="text-2xl font-semibold">{t("app.workoutsTitle")}</h1>
            <p className="text-sm text-fog">{t("app.workoutsHint")}</p>
            <ul className="space-y-3">
              {workoutItems.map((w) => (
                <li
                  key={w.day}
                  className="border border-line bg-ink-soft px-4 py-4"
                >
                  <span className="font-display text-lg tracking-wider text-signal">
                    {w.day}
                  </span>
                  <p className="mt-1 text-sm md:text-base">{w.focus}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
