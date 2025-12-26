import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCalendarEvent } from "../../api/calendarApi";

export const useCreateCalendarEvent = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createCalendarEvent,
    onSuccess: () => {
      qc.invalidateQueries(["calendar-events"]);
    },
  });
};
