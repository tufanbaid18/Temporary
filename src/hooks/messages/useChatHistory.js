// src/hooks/messages/useChatHistory.js
import { useQuery } from "@tanstack/react-query";
import { getChatHistory } from "../../api/messageApi";

export const useChatHistory = (userId) => {
  return useQuery({
    queryKey: ["chatHistory", userId],
    queryFn: () => getChatHistory(userId),
    enabled: !!userId,
  });
};
