import { useState, type ComponentType, type ReactNode, type SVGProps } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

type IconComponent = ComponentType<
  SVGProps<SVGSVGElement> & { size?: number | string; strokeWidth?: number | string }
>;

export interface NavItem {
  name: string;
  url: string;
  icon: IconComponent;
}

interface NavBarProps {
  items: NavItem[];
  className?: string;
  /** Controlled active tab name. Falls back to internal state when omitted. */
  activeTab?: string;
  onTabChange?: (name: string) => void;
  /** Extra controls rendered after nav items (e.g. language / theme). */
  trailing?: ReactNode;
}

export function NavBar({
  items,
  className,
  activeTab,
  onTabChange,
  trailing,
}: NavBarProps) {
  const [internalTab, setInternalTab] = useState(items[0]?.name ?? "");
  const currentTab = activeTab ?? internalTab;

  function selectTab(name: string) {
    setInternalTab(name);
    onTabChange?.(name);
  }

  return (
    <div
      className={cn(
        "fixed bottom-0 left-1/2 z-50 mb-6 -translate-x-1/2 sm:top-0 sm:bottom-auto sm:mb-0 sm:pt-6",
        className,
      )}
    >
      <div className="flex items-center gap-1 rounded-full border border-border bg-background/5 px-1 py-1 shadow-lg backdrop-blur-lg sm:gap-3">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.name;
          const isInAppTab = item.url.startsWith("#");

          const itemClassName = cn(
            "relative cursor-pointer rounded-full px-6 py-2 text-sm font-semibold transition-colors",
            "text-foreground/80 hover:text-primary",
            isActive && "bg-muted text-primary",
          );

          const content = (
            <>
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2.5} aria-hidden />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 -z-10 w-full rounded-full bg-primary/5"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-2 left-1/2 h-1 w-8 -translate-x-1/2 rounded-t-full bg-primary">
                    <div className="absolute -top-2 -left-2 h-6 w-12 rounded-full bg-primary/20 blur-md" />
                    <div className="absolute -top-1 h-6 w-8 rounded-full bg-primary/20 blur-md" />
                    <div className="absolute top-0 left-2 h-4 w-4 rounded-full bg-primary/20 blur-sm" />
                  </div>
                </motion.div>
              )}
            </>
          );

          if (isInAppTab) {
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => selectTab(item.name)}
                className={itemClassName}
                aria-current={isActive ? "page" : undefined}
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={item.name}
              to={item.url}
              onClick={() => selectTab(item.name)}
              className={itemClassName}
              aria-current={isActive ? "page" : undefined}
            >
              {content}
            </Link>
          );
        })}
        {trailing ? (
          <div className="ml-0.5 flex items-center gap-1 border-l border-border/60 pl-1 sm:ml-1 sm:gap-1.5 sm:pl-2">
            {trailing}
          </div>
        ) : null}
      </div>
    </div>
  );
}
