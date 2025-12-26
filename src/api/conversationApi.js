import api from "./api";

/**
 * Get inbox / conversations
 */
export const getConversations = async () => {
  const res = await api.get("/conversations/");
  return res.data;
};
