import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useAuthModal } from "../context/AuthModalContext";
import { useAuthSession } from "../context/AuthSessionContext";
import { isValidEmail } from "../lib/storage";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

export function AuthModal() {
  const { open, mode, setMode, closeAuth } = useAuthModal();
  const { signIn } = useAuthSession();
  const navigate = useNavigate();
  const [email, setEmail] = useState("demo@fitnes.app");
  const [error, setError] = useState("");
  const titleId = useId();
  const isLogin = mode === "login";

  useEffect(() => {
    if (!open) {
      setEmail("demo@fitnes.app");
      setError("");
      return undefined;
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAuth();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, closeAuth]);

  function enterApp(nextEmail: string) {
    signIn(nextEmail);
    closeAuth();
    navigate("/app");
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = email.trim();
    if (!value) {
      setError("Введите email");
      return;
    }
    if (!isValidEmail(value)) {
      setError("Введите корректный email");
      return;
    }
    setError("");
    enterApp(value);
  }

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Закрыть"
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
            onClick={closeAuth}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="auth-modal relative z-10 w-full max-w-[400px] rounded-2xl border border-[var(--auth-border)] bg-[var(--auth-bg)] p-7 shadow-2xl sm:p-8"
          >
            <button
              type="button"
              onClick={closeAuth}
              aria-label="Закрыть модалку"
              className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-lg text-[var(--auth-muted)] transition hover:bg-[var(--auth-btn)] hover:text-[var(--auth-text)]"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path
                  d="M1 1l12 12M13 1 1 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <div className="text-center">
              <h2
                id={titleId}
                className="text-[1.65rem] font-semibold tracking-tight text-[var(--auth-text)]"
              >
                {isLogin ? "С возвращением" : "Создать аккаунт"}
              </h2>
              <p className="mt-2 text-sm text-[var(--auth-muted)]">
                {isLogin
                  ? "Выберите удобный способ входа"
                  : "Выберите удобный способ регистрации"}
              </p>
            </div>

            <div className="mt-7 space-y-3">
              <button
                type="button"
                onClick={() => enterApp("google@fitnes.app")}
                className="flex w-full items-center justify-center gap-3 rounded-lg border border-[var(--auth-border)] bg-[var(--auth-btn)] px-4 py-3 text-sm font-medium text-[var(--auth-text)] transition hover:bg-[var(--auth-btn-hover)]"
              >
                <GoogleIcon />
                Продолжить через Google
              </button>
              <button
                type="button"
                onClick={() => enterApp("github@fitnes.app")}
                className="flex w-full items-center justify-center gap-3 rounded-lg border border-[var(--auth-border)] bg-[var(--auth-btn)] px-4 py-3 text-sm font-medium text-[var(--auth-text)] transition hover:bg-[var(--auth-btn-hover)]"
              >
                <GitHubIcon />
                Продолжить через GitHub
              </button>
            </div>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-[var(--auth-border)]" />
              <span className="shrink-0 text-[10px] font-medium tracking-[0.12em] text-[var(--auth-muted)]">
                ИЛИ ЧЕРЕЗ EMAIL
              </span>
              <div className="h-px flex-1 bg-[var(--auth-border)]" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-3" noValidate>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[var(--auth-text)]">
                  Электронная почта
                </span>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Введите ваш email"
                  className="w-full rounded-lg border border-[var(--auth-border)] bg-[var(--auth-input)] px-3.5 py-3 text-sm text-[var(--auth-text)] outline-none transition placeholder:text-[var(--auth-muted)] focus:border-[var(--auth-focus)]"
                />
              </label>
              {error ? (
                <p className="text-xs text-[var(--destructive)]" role="alert">
                  {error}
                </p>
              ) : null}
              <button
                type="submit"
                className="w-full rounded-lg bg-[var(--auth-primary)] py-3 text-sm font-semibold text-[var(--auth-primary-text)] transition hover:opacity-90"
              >
                {isLogin ? "Войти" : "Зарегистрироваться"}
              </button>
              <p className="text-center text-xs text-[var(--auth-muted)]">
                Введите email и нажмите кнопку, чтобы открыть приложение
              </p>
            </form>

            <p className="mt-7 text-center text-xs leading-relaxed text-[var(--auth-muted)]">
              Продолжая, вы соглашаетесь с{" "}
              <a
                href="#terms"
                className="text-[var(--auth-text)] underline underline-offset-2"
              >
                Условиями использования
              </a>{" "}
              и{" "}
              <a
                href="#privacy"
                className="text-[var(--auth-text)] underline underline-offset-2"
              >
                Политикой конфиденциальности
              </a>
              .
            </p>

            <p className="mt-5 text-center text-sm text-[var(--auth-muted)]">
              {isLogin ? (
                <>
                  Нет аккаунта?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("register");
                      setError("");
                    }}
                    className="font-medium text-[var(--auth-text)] underline underline-offset-2"
                  >
                    Зарегистрироваться
                  </button>
                </>
              ) : (
                <>
                  Уже есть аккаунт?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setError("");
                    }}
                    className="font-medium text-[var(--auth-text)] underline underline-offset-2"
                  >
                    Войти
                  </button>
                </>
              )}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
