import React, { useState } from "react";
import {
  AnimatePresence,
  motion,
  type HTMLMotionProps,
} from "framer-motion";
import { Columns3, Grid } from "lucide-react";
import type { DayType } from "@/features/app-shell/fixtures/calendar-types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export type { DayType };

export type InteractiveCalendarLabels = {
  month: string;
  year: string;
  listTitle: string;
  listHint: string;
  showList: string;
  showCalendar: string;
  daysOfWeek: string[];
};

type InteractiveCalendarProps = HTMLMotionProps<"div"> & {
  days: DayType[];
  labels: InteractiveCalendarLabels;
};

interface DayProps {
  classNames: string;
  day: DayType;
  onHover: (day: string | null) => void;
}

const Day: React.FC<DayProps> = ({ classNames, day, onHover }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={cn(
        "relative flex items-center justify-center py-1",
        classNames,
      )}
      style={{ height: "4rem", borderRadius: 16 }}
      onMouseEnter={() => {
        setIsHovered(true);
        onHover(day.day);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        onHover(null);
      }}
      id={`day-${day.day}`}
    >
      <motion.div className="flex flex-col items-center justify-center">
        {!(day.day[0] === "+" || day.day[0] === "-") && (
          <span className="text-sm text-mist">{day.day}</span>
        )}
      </motion.div>
      {day.meetingInfo && (
        <motion.div
          className="absolute bottom-1 right-1 flex size-5 items-center justify-center rounded-full bg-signal p-1 text-[10px] font-bold text-on-accent"
          layoutId={`day-${day.day}-meeting-count`}
          style={{ borderRadius: 999 }}
        >
          {day.meetingInfo.length}
        </motion.div>
      )}

      <AnimatePresence>
        {day.meetingInfo && isHovered && (
          <div className="absolute inset-0 flex size-full items-center justify-center">
            <motion.div
              className="flex size-10 items-center justify-center bg-signal p-1 text-xs font-bold text-on-accent"
              layoutId={`day-${day.day}-meeting-count`}
              style={{ borderRadius: 999 }}
            >
              {day.meetingInfo.length}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const CalendarGrid: React.FC<{
  days: DayType[];
  onHover: (day: string | null) => void;
}> = ({ days, onHover }) => {
  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((day, index) => (
        <Day
          key={`${day.day}-${index}`}
          classNames={day.classNames}
          day={day}
          onHover={onHover}
        />
      ))}
    </div>
  );
};

const InteractiveCalendar = React.forwardRef<
  HTMLDivElement,
  InteractiveCalendarProps
>(({ className, days, labels, ...props }, ref) => {
  const [moreView, setMoreView] = useState(false);
  const [hoveredDay, setHoveredDay] = useState<string | null>(null);

  const handleDayHover = (day: string | null) => {
    setHoveredDay(day);
  };

  const sortedDays = React.useMemo(() => {
    if (!hoveredDay) return days;
    return [...days].sort((a, b) => {
      if (a.day === hoveredDay) return -1;
      if (b.day === hoveredDay) return 1;
      return 0;
    });
  }, [hoveredDay, days]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        ref={ref}
        className={cn(
          "relative mx-auto my-4 flex w-full flex-col items-center justify-center gap-8 lg:flex-row",
          className,
        )}
        {...props}
      >
        <motion.div layout className="w-full max-w-lg">
          <motion.div
            key="calendar-view"
            className="flex w-full flex-col gap-4"
          >
            <div className="flex w-full items-center justify-between gap-3">
              <motion.h2 className="mb-0 text-4xl font-bold tracking-wider text-mist">
                {labels.month}{" "}
                <span className="text-fog">{labels.year}</span>
              </motion.h2>
              <motion.button
                type="button"
                aria-label={
                  moreView ? labels.showCalendar : labels.showList
                }
                className="relative flex shrink-0 overflow-hidden rounded-lg border border-line bg-ink-soft p-1"
                onClick={() => setMoreView(!moreView)}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-1 left-1 w-8 rounded-md bg-signal transition-transform duration-300 ease-out"
                  style={{
                    transform: moreView
                      ? "translateX(2rem)"
                      : "translateX(0)",
                  }}
                />
                <span className="relative z-2 flex size-8 items-center justify-center">
                  <Columns3
                    className={cn(
                      "size-4 transition-colors",
                      moreView ? "text-fog" : "text-on-accent",
                    )}
                  />
                </span>
                <span className="relative z-2 flex size-8 items-center justify-center">
                  <Grid
                    className={cn(
                      "size-4 transition-colors",
                      moreView ? "text-on-accent" : "text-fog",
                    )}
                  />
                </span>
              </motion.button>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {labels.daysOfWeek.map((day) => (
                <div
                  key={day}
                  className="rounded-xl border border-line bg-ink-soft px-0.5 py-1 text-center text-xs text-mist"
                >
                  {day}
                </div>
              ))}
            </div>
            <CalendarGrid days={days} onHover={handleDayHover} />
          </motion.div>
        </motion.div>
        {moreView && (
          <motion.div
            className="w-full max-w-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              key="more-view"
              className="mt-4 flex w-full flex-col gap-4"
            >
              <div className="flex w-full flex-col items-start justify-between">
                <motion.h2 className="mb-2 text-4xl font-bold tracking-wider text-mist">
                  {labels.listTitle}
                </motion.h2>
                <p className="font-medium text-fog">{labels.listHint}</p>
              </div>
              <ScrollArea asChild>
                <motion.div
                  className="flex h-[620px] flex-col items-start justify-start rounded-xl border border-line bg-ink-soft shadow-md"
                  layout
                >
                  <AnimatePresence>
                    {sortedDays
                      .filter((day) => day.meetingInfo)
                      .map((day) => (
                        <motion.div
                          key={day.day}
                          className="w-full border-b border-line py-0 last:border-b-0"
                          layout
                        >
                          {day.meetingInfo?.map((meeting, mIndex) => (
                            <motion.div
                              key={mIndex}
                              className="border-b border-line p-3 last:border-b-0"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{
                                duration: 0.2,
                                delay: mIndex * 0.05,
                              }}
                            >
                              <div className="mb-2 flex items-center justify-between gap-2">
                                <span className="text-sm text-fog">
                                  {meeting.date}
                                </span>
                                <span className="text-sm text-fog">
                                  {meeting.time}
                                </span>
                              </div>
                              <h3 className="mb-1 text-lg font-semibold text-mist">
                                {meeting.title}
                              </h3>
                              <p className="mb-1 text-sm text-fog">
                                {meeting.participants.join(", ")}
                              </p>
                              <div className="flex items-center text-signal">
                                <svg
                                  className="mr-1 h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                  />
                                </svg>
                                <span className="text-sm">
                                  {meeting.location}
                                </span>
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      ))}
                  </AnimatePresence>
                </motion.div>
              </ScrollArea>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
});

InteractiveCalendar.displayName = "InteractiveCalendar";

export default InteractiveCalendar;
