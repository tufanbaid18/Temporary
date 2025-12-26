import api from "./api";

/**
 * Send a message
 */
export const sendMessage = async (payload) => {
  const res = await api.post("/messages/", payload);
  return res.data;
};

/**
 * Get chat history with a user
 */
export const getChatHistory = async (userId) => {
  const res = await api.get(`/messages/chat/${userId}/`);
  return res.data;
};

/**
 * Mark all messages from a specific user as read
 */
export const markChatAsRead = async (userId) => {
  const res = await api.post(`/messages/mark-read/${userId}/`);
  return res.data;
};


// src/api/messageApi.js
export const getLatestMessages = async () => {
  const res = await api.get("/messages/latest/");
  return res.data;
};

// src/api/messageApi.js
export const getLatestConversations = async () => {
  const res = await api.get("/messages/latest-conversations/");
  return res.data;
};