import * as React from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, Moon, Sun } from "lucide-react";
import { FitnesIcon } from "@/shared/brand/FitnesIcon";
import { cn } from "@/shared/lib/utils";
import { LanguageToggle } from "@/shared/i18n/LanguageToggle";
import { useLocale } from "@/shared/i18n/LocaleContext";
import { useTheme } from "@/shared/theme/ThemeContext";
import { landingNavItems, type NavItem } from "../config/nav";

const EXPAND_SCROLL_THRESHOLD = 80;

const containerVariants = {
  expanded: {
    y: 0,
    opacity: 1,
    width: "auto",
    transition: {
      y: { type: "spring" as const, damping: 18, stiffness: 250 },
      opacity: { duration: 0.3 },
      type: "spring" as const,
      damping: 20,
      stiffness: 300,
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
  collapsed: {
    y: 0,
    opacity: 1,
    width: "3rem",
    transition: {
      type: "spring" as const,
      damping: 20,
      stiffness: 300,
      when: "afterChildren" as const,
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const logoVariants = {
  expanded: {
    opacity: 1,
    x: 0,
    rotate: 0,
    transition: { type: "spring" as const, damping: 15 },
  },
  collapsed: {
    opacity: 0,
    x: -25,
    rotate: -180,
    transition: { duration: 0.3 },
  },
};

const itemVariants = {
  expanded: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: "spring" as const, damping: 15 },
  },
  collapsed: {
    opacity: 0,
    x: -20,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

const collapsedIconVariants = {
  expanded: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  collapsed: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      damping: 15,
      stiffness: 300,
      delay: 0.15,
    },
  },
};

export interface AnimatedNavProps {
  items?: NavItem[];
  onItemClick?: (item: NavItem) => boolean | void;
  className?: string;
}

export function AnimatedNav({
  items = landingNavItems,
  onItemClick,
  className,
}: AnimatedNavProps) {
  const [isExpanded, setExpanded] = React.useState(true);
  const { theme, toggleTheme } = useTheme();
  const { t } = useLocale();
  const isDark = theme === "dark";

  const { scrollY } = useScroll();
  const lastScrollY = React.useRef(0);
  const scrollPositionOnCollapse = React.useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current;

    if (isExpanded && latest > previous && latest > 150) {
      setExpanded(false);
      scrollPositionOnCollapse.current = latest;
    } else if (
      !isExpanded &&
      latest < previous &&
      scrollPositionOnCollapse.current - latest > EXPAND_SCROLL_THRESHOLD
    ) {
      setExpanded(true);
    }

    lastScrollY.current = latest;
  });

  const handleNavClick = (e: React.MouseEvent) => {
    if (!isExpanded) {
      e.preventDefault();
      setExpanded(true);
    }
  };

  const handleItemClick = (e: React.MouseEvent, item: NavItem) => {
    e.stopPropagation();
    if (onItemClick?.(item) === false) {
      e.preventDefault();
    }
  };

  return (
    <div className={cn("fixed top-6 left-1/2 z-[100] -translate-x-1/2", className)}>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={isExpanded ? "expanded" : "collapsed"}
        variants={containerVariants}
        whileHover={!isExpanded ? { scale: 1.1 } : {}}
        whileTap={!isExpanded ? { scale: 0.95 } : {}}
        onClick={handleNavClick}
        className={cn(
          "flex h-12 items-center overflow-hidden rounded-full border bg-background/80 shadow-lg backdrop-blur-sm",
          !isExpanded && "cursor-pointer justify-center",
        )}
      >
        <motion.div
          variants={logoVariants}
          className="flex flex-shrink-0 items-center pr-2 pl-4 font-semibold"
        >
          <FitnesIcon className="size-8 rounded-full" />
        </motion.div>

        <motion.div
          className={cn(
            "flex items-center gap-1 pr-3 sm:gap-3",
            !isExpanded && "pointer-events-none",
          )}
        >
          {items.map((item) => (
            <motion.a
              key={item.labelKey}
              href={item.href ?? "#"}
              variants={itemVariants}
              onClick={(e) => handleItemClick(e, item)}
              className="px-2 py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {t(item.labelKey)}
            </motion.a>
          ))}

          <motion.div variants={itemVariants} className="ml-1">
            <LanguageToggle
              onClick={(e) => e.stopPropagation()}
              className="size-8"
            />
          </motion.div>

          <motion.button
            type="button"
            variants={itemVariants}
            onClick={(e) => {
              e.stopPropagation();
              toggleTheme();
            }}
            aria-label={isDark ? t("theme.toLight") : t("theme.toDark")}
            title={isDark ? t("theme.light") : t("theme.dark")}
            className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </motion.button>
        </motion.div>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <motion.div
            variants={collapsedIconVariants}
            animate={isExpanded ? "expanded" : "collapsed"}
          >
            <Menu className="h-6 w-6" />
          </motion.div>
        </div>
      </motion.nav>
    </div>
  );
}
