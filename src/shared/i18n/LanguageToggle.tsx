import type { MouseEventHandler } from "react";
import { useLocale } from "./LocaleContext";
import { cn } from "@/shared/lib/utils";

interface LanguageToggleProps {
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export function LanguageToggle({ className, onClick }: LanguageToggleProps) {
  const { toggleLocale, t } = useLocale();

  return (
    <button
      type="button"
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) toggleLocale();
      }}
      aria-label={t("locale.aria")}
      title={t("locale.aria")}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-full text-xs font-semibold tracking-wide text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground",
        className,
      )}
    >
      {t("locale.switchTo")}
    </button>
  );
}
