// src/hooks/messages/useLatestMessages.js
import { useQuery } from "@tanstack/react-query";
import { getLatestMessages } from "../../api/messageApi";

export const useLatestMessages = () => {
  return useQuery({
    queryKey: ["latestMessages"],
    queryFn: getLatestMessages,
    staleTime: 1000 * 30, // 30 seconds
  });
};
