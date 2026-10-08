import { useId, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useLocale, type TranslationKey } from "@/shared/i18n/LocaleContext";
import type {
  ActivityLevel,
  CoachIntakeData,
  DietPreference,
  ExperienceLevel,
  FitnessGoal,
  TrainingPlace,
} from "../types";

const easeOut = [0.22, 1, 0.36, 1] as const;

const goalKeys: Record<FitnessGoal, TranslationKey> = {
  lose: "app.coachGoal.lose",
  gain: "app.coachGoal.gain",
  tone: "app.coachGoal.tone",
  maintain: "app.coachGoal.maintain",
};

const activityKeys: Record<ActivityLevel, TranslationKey> = {
  sedentary: "app.coachActivity.sedentary",
  light: "app.coachActivity.light",
  moderate: "app.coachActivity.moderate",
  active: "app.coachActivity.active",
};

const experienceKeys: Record<ExperienceLevel, TranslationKey> = {
  beginner: "app.coachExperience.beginner",
  intermediate: "app.coachExperience.intermediate",
  advanced: "app.coachExperience.advanced",
};

const placeKeys: Record<TrainingPlace, TranslationKey> = {
  home: "app.coachPlace.home",
  gym: "app.coachPlace.gym",
  both: "app.coachPlace.both",
};

const dietKeys: Record<DietPreference, TranslationKey> = {
  none: "app.coachDiet.none",
  vegetarian: "app.coachDiet.vegetarian",
  vegan: "app.coachDiet.vegan",
  keto: "app.coachDiet.keto",
  halal: "app.coachDiet.halal",
};

const fieldClass =
  "w-full rounded-xl border border-line bg-ink px-3.5 py-3 text-sm text-mist outline-none transition placeholder:text-fog/70 focus:border-signal";

const labelClass = "mb-1.5 block text-sm font-medium text-mist";

const STEPS = 4;

const emptyIntake: CoachIntakeData = {
  goal: null,
  age: "",
  activity: null,
  experience: null,
  daysPerWeek: null,
  sessionMinutes: null,
  place: null,
  limitations: "",
  diet: null,
  allergies: "",
  mealsPerDay: null,
};

const goals: FitnessGoal[] = ["lose", "gain", "tone", "maintain"];
const activities: ActivityLevel[] = [
  "sedentary",
  "light",
  "moderate",
  "active",
];
const experiences: ExperienceLevel[] = [
  "beginner",
  "intermediate",
  "advanced",
];
const places: TrainingPlace[] = ["home", "gym", "both"];
const diets: DietPreference[] = ["none", "vegetarian", "vegan", "keto", "halal"];
const dayOptions = [2, 3, 4, 5, 6];
const durationOptions = [30, 45, 60, 90];
const mealOptions = [3, 4, 5];

const stepVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction >= 0 ? 28 : -28,
  }),
  center: {
    opacity: 1,
    x: 0,
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction >= 0 ? -20 : 20,
  }),
};

const choiceContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.045, delayChildren: 0.04 },
  },
};

const choiceItem = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: easeOut },
  },
};

function ChoiceGrid<T extends string | number>({
  options,
  value,
  onChange,
  labelOf,
}: {
  options: T[];
  value: T | null;
  onChange: (next: T) => void;
  labelOf: (option: T) => string;
}) {
  return (
    <motion.div
      className="grid gap-2 sm:grid-cols-2"
      variants={choiceContainer}
      initial="hidden"
      animate="show"
    >
      {options.map((option) => {
        const selected = value === option;
        return (
          <motion.button
            key={String(option)}
            type="button"
            variants={choiceItem}
            aria-pressed={selected}
            onClick={() => onChange(option)}
            whileTap={{ scale: 0.97 }}
            animate={{ scale: selected ? 1.02 : 1 }}
            transition={{ duration: 0.2, ease: easeOut }}
            className={`rounded-xl border px-3.5 py-3 text-left text-sm transition-colors ${
              selected
                ? "border-signal bg-signal/10 text-mist"
                : "border-line bg-ink text-fog hover:border-signal/60 hover:text-mist"
            }`}
          >
            {labelOf(option)}
          </motion.button>
        );
      })}
    </motion.div>
  );
}

export function CoachIntakePanel() {
  const { t } = useLocale();
  const formId = useId();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<CoachIntakeData>(emptyIntake);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function patch(partial: Partial<CoachIntakeData>) {
    setData((prev) => ({ ...prev, ...partial }));
    setError("");
    setSubmitted(false);
  }

  function goalLabel(goal: FitnessGoal) {
    return t(goalKeys[goal]);
  }

  function activityLabel(level: ActivityLevel) {
    return t(activityKeys[level]);
  }

  function experienceLabel(level: ExperienceLevel) {
    return t(experienceKeys[level]);
  }

  function placeLabel(place: TrainingPlace) {
    return t(placeKeys[place]);
  }

  function dietLabel(diet: DietPreference) {
    return t(dietKeys[diet]);
  }

  function validateStep(current: number): boolean {
    if (current === 0 && !data.goal) {
      setError(t("app.coachErrorGoal"));
      return false;
    }
    if (current === 1) {
      const age = Number(data.age);
      if (!data.age.trim() || Number.isNaN(age) || age < 14 || age > 90) {
        setError(t("app.coachErrorAge"));
        return false;
      }
      if (!data.activity) {
        setError(t("app.coachErrorActivity"));
        return false;
      }
    }
    if (current === 2) {
      if (
        !data.experience ||
        !data.daysPerWeek ||
        !data.sessionMinutes ||
        !data.place
      ) {
        setError(t("app.coachErrorTraining"));
        return false;
      }
    }
    if (current === 3 && (!data.diet || !data.mealsPerDay)) {
      setError(t("app.coachErrorDiet"));
      return false;
    }
    setError("");
    return true;
  }

  function goNext() {
    if (!validateStep(step)) return;
    setDirection(1);
    setStep((prev) => Math.min(prev + 1, STEPS - 1));
  }

  function goBack() {
    setError("");
    setDirection(-1);
    setStep((prev) => Math.max(prev - 1, 0));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validateStep(step)) return;
    setSubmitted(true);
  }

  const stepTitles = [
    t("app.coachStepGoal"),
    t("app.coachStepBody"),
    t("app.coachStepTraining"),
    t("app.coachStepNutrition"),
  ] as const;

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: easeOut }}
    >
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: easeOut, delay: 0.05 }}
      >
        <h1 className="text-4xl font-bold tracking-wider text-mist">
          {t("app.coachTitle")}
        </h1>
        <p className="mt-2 font-medium text-fog">{t("app.coachHint")}</p>
      </motion.div>

      <div className="flex items-center gap-2" aria-hidden>
        {Array.from({ length: STEPS }, (_, i) => (
          <div key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
            <motion.div
              className="h-full origin-left rounded-full bg-signal"
              initial={false}
              animate={{ scaleX: i <= step ? 1 : 0 }}
              transition={{ duration: 0.35, ease: easeOut }}
              style={{ transformOrigin: "left center" }}
            />
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={step}
          className="text-xs text-fog"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
        >
          {t("app.coachStepOf", {
            current: String(step + 1),
            total: String(STEPS),
          })}{" "}
          · {stepTitles[step]}
        </motion.p>
      </AnimatePresence>

      <motion.form
        id={formId}
        onSubmit={handleSubmit}
        className="space-y-6 overflow-hidden rounded-xl border border-line bg-ink-soft p-5 shadow-md sm:p-6"
        noValidate
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: easeOut, delay: 0.08 }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: easeOut }}
          >
            {step === 0 ? (
              <fieldset className="space-y-3">
                <legend className={labelClass}>{t("app.coachGoalLabel")}</legend>
                <p className="text-xs text-fog">{t("app.coachGoalHint")}</p>
                <ChoiceGrid
                  options={goals}
                  value={data.goal}
                  onChange={(goal) => patch({ goal })}
                  labelOf={goalLabel}
                />
              </fieldset>
            ) : null}

            {step === 1 ? (
              <div className="space-y-5">
                <label className="block">
                  <span className={labelClass}>{t("app.coachAge")}</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={14}
                    max={90}
                    value={data.age}
                    onChange={(e) => patch({ age: e.target.value })}
                    placeholder={t("app.coachAgePlaceholder")}
                    className={fieldClass}
                  />
                </label>
                <fieldset className="space-y-3">
                  <legend className={labelClass}>
                    {t("app.coachActivityLabel")}
                  </legend>
                  <ChoiceGrid
                    options={activities}
                    value={data.activity}
                    onChange={(activity) => patch({ activity })}
                    labelOf={activityLabel}
                  />
                </fieldset>
              </div>
            ) : null}

            {step === 2 ? (
              <div className="space-y-5">
                <fieldset className="space-y-3">
                  <legend className={labelClass}>
                    {t("app.coachExperienceLabel")}
                  </legend>
                  <ChoiceGrid
                    options={experiences}
                    value={data.experience}
                    onChange={(experience) => patch({ experience })}
                    labelOf={experienceLabel}
                  />
                </fieldset>
                <fieldset className="space-y-3">
                  <legend className={labelClass}>{t("app.coachDaysLabel")}</legend>
                  <ChoiceGrid
                    options={dayOptions}
                    value={data.daysPerWeek}
                    onChange={(daysPerWeek) => patch({ daysPerWeek })}
                    labelOf={(n) =>
                      t("app.coachDaysValue", { count: String(n) })
                    }
                  />
                </fieldset>
                <fieldset className="space-y-3">
                  <legend className={labelClass}>
                    {t("app.coachDurationLabel")}
                  </legend>
                  <ChoiceGrid
                    options={durationOptions}
                    value={data.sessionMinutes}
                    onChange={(sessionMinutes) => patch({ sessionMinutes })}
                    labelOf={(n) =>
                      t("app.coachDurationValue", { minutes: String(n) })
                    }
                  />
                </fieldset>
                <fieldset className="space-y-3">
                  <legend className={labelClass}>{t("app.coachPlaceLabel")}</legend>
                  <ChoiceGrid
                    options={places}
                    value={data.place}
                    onChange={(place) => patch({ place })}
                    labelOf={placeLabel}
                  />
                </fieldset>
                <label className="block">
                  <span className={labelClass}>{t("app.coachLimitations")}</span>
                  <textarea
                    rows={3}
                    value={data.limitations}
                    onChange={(e) => patch({ limitations: e.target.value })}
                    placeholder={t("app.coachLimitationsPlaceholder")}
                    className={`${fieldClass} resize-y`}
                  />
                </label>
              </div>
            ) : null}

            {step === 3 ? (
              <div className="space-y-5">
                <fieldset className="space-y-3">
                  <legend className={labelClass}>{t("app.coachDietLabel")}</legend>
                  <ChoiceGrid
                    options={diets}
                    value={data.diet}
                    onChange={(diet) => patch({ diet })}
                    labelOf={dietLabel}
                  />
                </fieldset>
                <fieldset className="space-y-3">
                  <legend className={labelClass}>{t("app.coachMealsLabel")}</legend>
                  <ChoiceGrid
                    options={mealOptions}
                    value={data.mealsPerDay}
                    onChange={(mealsPerDay) => patch({ mealsPerDay })}
                    labelOf={(n) =>
                      t("app.coachMealsValue", { count: String(n) })
                    }
                  />
                </fieldset>
                <label className="block">
                  <span className={labelClass}>{t("app.coachAllergies")}</span>
                  <textarea
                    rows={3}
                    value={data.allergies}
                    onChange={(e) => patch({ allergies: e.target.value })}
                    placeholder={t("app.coachAllergiesPlaceholder")}
                    className={`${fieldClass} resize-y`}
                  />
                </label>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {error ? (
            <motion.p
              key={error}
              className="text-xs text-ember"
              role="alert"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: [0, -4, 4, -2, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: easeOut }}
            >
              {error}
            </motion.p>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {submitted ? (
            <motion.p
              className="inline-flex items-center gap-1.5 text-sm text-signal"
              role="status"
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.3, ease: easeOut }}
            >
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 420, damping: 18 }}
                className="inline-flex"
              >
                <Check size={14} strokeWidth={2.5} aria-hidden />
              </motion.span>
              {t("app.coachSubmitted")}
            </motion.p>
          ) : null}
        </AnimatePresence>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <motion.button
            type="button"
            onClick={goBack}
            disabled={step === 0}
            whileTap={step === 0 ? undefined : { scale: 0.98 }}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-line bg-ink px-4 py-3 text-sm text-fog transition enabled:hover:border-signal enabled:hover:text-mist disabled:opacity-40"
          >
            <ChevronLeft size={16} strokeWidth={2.25} aria-hidden />
            {t("app.coachBack")}
          </motion.button>

          {step < STEPS - 1 ? (
            <motion.button
              type="button"
              onClick={goNext}
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.015 }}
              transition={{ duration: 0.15 }}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-signal px-5 py-3 text-sm font-semibold text-on-accent"
            >
              {t("app.coachNext")}
              <ChevronRight size={16} strokeWidth={2.25} aria-hidden />
            </motion.button>
          ) : (
            <motion.button
              type="submit"
              whileTap={{ scale: 0.98 }}
              whileHover={{ scale: 1.015 }}
              transition={{ duration: 0.15 }}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-signal px-5 py-3 text-sm font-semibold text-on-accent"
            >
              <motion.span
                animate={
                  submitted
                    ? { rotate: 0 }
                    : { rotate: [0, -8, 8, 0], scale: [1, 1.08, 1] }
                }
                transition={
                  submitted
                    ? { duration: 0.2 }
                    : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
                }
                className="inline-flex"
              >
                <Sparkles size={16} strokeWidth={2.25} aria-hidden />
              </motion.span>
              {t("app.coachGenerate")}
            </motion.button>
          )}
        </div>
      </motion.form>
    </motion.div>
  );
}
