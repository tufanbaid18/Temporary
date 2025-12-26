// src/hooks/messages/useLatestConversations.js
import { useQuery } from "@tanstack/react-query";
import { getLatestConversations } from "../../api/messageApi";

export const useLatestConversations = () => {
  return useQuery({
    queryKey: ["latestConversations"],
    queryFn: getLatestConversations,
    staleTime: 1000 * 30,
  });
};
