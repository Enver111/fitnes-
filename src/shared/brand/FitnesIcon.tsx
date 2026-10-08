import { useTheme, type ThemeId } from "@/shared/theme/ThemeContext";
import { cn } from "@/shared/lib/utils";
import { APP_ICONS } from "./icons";

interface FitnesIconProps {
  className?: string;
  /** Force a theme variant; defaults to the active app theme. */
  theme?: ThemeId;
  alt?: string;
}

export function FitnesIcon({
  className,
  theme: themeProp,
  alt = "FITNES",
}: FitnesIconProps) {
  const { theme } = useTheme();
  const resolved = themeProp ?? theme;

  return (
    <img
      src={APP_ICONS[resolved]}
      alt={alt}
      className={cn("size-6 rounded-[22%] object-cover", className)}
      draggable={false}
    />
  );
}
