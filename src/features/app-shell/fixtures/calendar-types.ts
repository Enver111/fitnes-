export type CalendarSession = {
  date: string;
  time: string;
  title: string;
  participants: string[];
  location: string;
};

export type DayType = {
  day: string;
  classNames: string;
  meetingInfo?: CalendarSession[];
};
