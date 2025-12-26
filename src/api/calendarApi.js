import api from "../api";

/* GET all events */
export const getCalendarEvents = async () => {
  const res = await api.get("/calendar-events/");
  return res.data;
};

/* CREATE event */
export const createCalendarEvent = async (data) => {
  const res = await api.post("/calendar-events/", data);
  return res.data;
};

/* UPDATE event */
export const updateCalendarEvent = async ({ id, data }) => {
  const res = await api.put(`/calendar-events/${id}/`, data);
  return res.data;
};

/* DELETE event */
export const deleteCalendarEvent = async (id) => {
  const res = await api.delete(`/calendar-events/${id}/`);
  return res.data;
};
