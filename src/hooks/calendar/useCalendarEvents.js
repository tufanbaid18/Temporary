import { useQuery } from "@tanstack/react-query";
import { getCalendarEvents } from "../../api/calendarApi";

export const useCalendarEvents = () => {
  return useQuery({
    queryKey: ["calendar-events"],
    queryFn: getCalendarEvents,
  });
};
