import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

/** Tailwind-ready class for the shared signal-colored scrollbar. */
export const scrollbarSignalClassName = "scrollbar-signal";

type ScrollAreaProps = React.ComponentProps<"div"> & {
  asChild?: boolean;
};

/**
 * Reusable scroll container with the brand (signal) scrollbar.
 * Use `asChild` to merge styles onto a custom element (e.g. motion.div).
 */
export function ScrollArea({
  className,
  asChild = false,
  ...props
}: ScrollAreaProps) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      data-slot="scroll-area"
      className={cn(
        "overflow-y-auto overflow-x-hidden",
        scrollbarSignalClassName,
        className,
      )}
      {...props}
    />
  );
}
