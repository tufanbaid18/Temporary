// src/api/notificationApi.js
import api from "./api";

// ------------------------------
// 🔹 GET MY NOTIFICATIONS
// ------------------------------
export const fetchNotifications = async () => {
  const res = await api.get("/notifications/");
  return res.data;
};

// ------------------------------
// 🔹 MARK SINGLE NOTIFICATION READ
// ------------------------------
export const markNotificationRead = async (id) => {
  const res = await api.post(`/notifications/${id}/mark_read/`);
  return res.data;
};

// ------------------------------
// 🔹 MARK ALL AS READ
// ------------------------------
export const markAllRead = async () => {
  const res = await api.post("/notifications/mark_all_read/");
  return res.data;
};

// ------------------------------
// 🔹 DELETE SINGLE NOTIFICATION
// ------------------------------
export const deleteNotification = async (id) => {
  const res = await api.delete(`/notifications/${id}/`);
  return res.data;
};

// ------------------------------
// 🔹 CLEAR ALL NOTIFICATIONS
// ------------------------------
export const clearAllNotifications = async () => {
  const res = await api.delete("/notifications/clear_all/");
  return res.data;
};
