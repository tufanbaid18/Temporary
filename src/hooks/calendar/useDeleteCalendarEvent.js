import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCalendarEvent } from "../../api/calendarApi";

export const useDeleteCalendarEvent = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: deleteCalendarEvent,
    onSuccess: () => {
      qc.invalidateQueries(["calendar-events"]);
    },
  });
};
