import { useEffect, useId, useState, type FormEvent } from "react";
import { Camera, Check } from "lucide-react";
import { isValidEmail } from "@/features/auth/lib/storage";
import { useAuthSession } from "@/features/auth/context/AuthSessionContext";
import { MOCK_AVATARS, type MockAvatarId } from "@/features/auth/types";
import { useLocale } from "@/shared/i18n/LocaleContext";

const fieldClass =
  "w-full rounded-xl border border-line bg-ink px-3.5 py-3 text-sm text-mist outline-none transition placeholder:text-fog/70 focus:border-signal";

const labelClass = "mb-1.5 block text-sm font-medium text-mist";

export function ProfilePanel({ onSignOut }: { onSignOut: () => void }) {
  const { user, updateProfile } = useAuthSession();
  const { t } = useLocale();
  const formId = useId();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [avatarId, setAvatarId] = useState<MockAvatarId>(MOCK_AVATARS[0].id);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.email);
    setHeightCm(user.heightCm);
    setWeightKg(user.weightKg);
    setAvatarId(user.avatarId);
    setError("");
    setSaved(false);
  }, [user]);

  const avatar = MOCK_AVATARS.find((a) => a.id === avatarId) ?? MOCK_AVATARS[0];
  const initials =
    `${firstName.trim().charAt(0)}${lastName.trim().charAt(0)}`.toUpperCase() ||
    email.trim().charAt(0).toUpperCase() ||
    "?";

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nextEmail = email.trim();
    if (!nextEmail) {
      setError(t("app.profileEmailRequired"));
      setSaved(false);
      return;
    }
    if (!isValidEmail(nextEmail)) {
      setError(t("app.profileEmailInvalid"));
      setSaved(false);
      return;
    }
    setError("");
    updateProfile({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: nextEmail,
      heightCm: heightCm.trim(),
      weightKg: weightKg.trim(),
      avatarId,
    });
    setSaved(true);
  }

  function cycleAvatar() {
    const idx = MOCK_AVATARS.findIndex((a) => a.id === avatarId);
    const next = MOCK_AVATARS[(idx + 1) % MOCK_AVATARS.length];
    setAvatarId(next.id);
    setSaved(false);
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-4xl font-bold tracking-wider text-mist">
          {t("app.profileTitle")}
        </h1>
        <p className="mt-2 font-medium text-fog">{t("app.profileHint")}</p>
      </div>

      <form
        id={formId}
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-line bg-ink-soft p-5 shadow-md sm:p-6"
        noValidate
      >
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="relative">
            <div
              className="flex size-24 items-center justify-center rounded-full text-2xl font-semibold text-on-accent"
              style={{ backgroundColor: avatar.color }}
              aria-hidden
            >
              {initials}
            </div>
            <button
              type="button"
              onClick={cycleAvatar}
              aria-label={t("app.profileAvatarChange")}
              title={t("app.profileAvatarMock")}
              className="absolute -right-1 -bottom-1 inline-flex size-9 items-center justify-center rounded-full border border-line bg-ink-soft text-mist transition hover:border-signal hover:text-signal"
            >
              <Camera size={16} strokeWidth={2.25} aria-hidden />
            </button>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-mist">
              {t("app.profileAvatar")}
            </p>
            <p className="text-xs text-fog">{t("app.profileAvatarMock")}</p>
            <div className="flex gap-2 pt-1">
              {MOCK_AVATARS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setAvatarId(item.id);
                    setSaved(false);
                  }}
                  aria-label={`${t("app.profileAvatar")} ${item.label}`}
                  aria-pressed={avatarId === item.id}
                  className={`size-7 rounded-full transition ring-offset-2 ring-offset-ink-soft ${
                    avatarId === item.id
                      ? "ring-2 ring-signal"
                      : "opacity-70 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: item.color }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={labelClass}>{t("app.profileFirstName")}</span>
            <input
              type="text"
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                setSaved(false);
              }}
              placeholder={t("app.profileFirstNamePlaceholder")}
              className={fieldClass}
            />
          </label>
          <label className="block">
            <span className={labelClass}>{t("app.profileLastName")}</span>
            <input
              type="text"
              autoComplete="family-name"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                setSaved(false);
              }}
              placeholder={t("app.profileLastNamePlaceholder")}
              className={fieldClass}
            />
          </label>
        </div>

        <label className="block">
          <span className={labelClass}>{t("app.profileEmail")}</span>
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
              setSaved(false);
            }}
            placeholder={t("app.profileEmailPlaceholder")}
            className={fieldClass}
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={labelClass}>{t("app.profileHeight")}</span>
            <div className="relative">
              <input
                type="number"
                inputMode="decimal"
                min={50}
                max={250}
                step="0.1"
                value={heightCm}
                onChange={(e) => {
                  setHeightCm(e.target.value);
                  setSaved(false);
                }}
                placeholder={t("app.profileHeightPlaceholder")}
                className={`${fieldClass} pr-12`}
              />
              <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-xs text-fog">
                {t("app.profileHeightUnit")}
              </span>
            </div>
          </label>
          <label className="block">
            <span className={labelClass}>{t("app.profileWeight")}</span>
            <div className="relative">
              <input
                type="number"
                inputMode="decimal"
                min={20}
                max={400}
                step="0.1"
                value={weightKg}
                onChange={(e) => {
                  setWeightKg(e.target.value);
                  setSaved(false);
                }}
                placeholder={t("app.profileWeightPlaceholder")}
                className={`${fieldClass} pr-12`}
              />
              <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-xs text-fog">
                {t("app.profileWeightUnit")}
              </span>
            </div>
          </label>
        </div>

        {error ? (
          <p className="text-xs text-ember" role="alert">
            {error}
          </p>
        ) : null}

        {saved ? (
          <p
            className="inline-flex items-center gap-1.5 text-sm text-signal"
            role="status"
          >
            <Check size={14} strokeWidth={2.5} aria-hidden />
            {t("app.profileSaved")}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="submit"
            className="rounded-lg bg-signal px-5 py-3 text-sm font-semibold text-on-accent transition hover:opacity-90"
          >
            {t("app.profileSave")}
          </button>
          <button
            type="button"
            onClick={onSignOut}
            className="rounded-lg border border-line bg-ink px-5 py-3 text-sm text-fog transition hover:border-signal hover:text-mist"
          >
            {t("app.signOut")}
          </button>
        </div>
      </form>
    </div>
  );
}
