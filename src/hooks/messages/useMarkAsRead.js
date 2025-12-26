import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markChatAsRead } from "../../api/messageApi";

/**
 * Clears unread count + marks messages as read in cache
 */
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId) => markChatAsRead(userId),

    onSuccess: (_, userId) => {
      // 1️⃣ Clear unread count in conversations list
      queryClient.setQueryData(["conversations"], (old = []) =>
        old.map((c) =>
          c.user.id === userId
            ? { ...c, unread_count: 0 }
            : c
        )
      );

      // 2️⃣ Mark messages as read in chat history
      queryClient.setQueryData(["chatHistory", userId], (old) =>
        Array.isArray(old)
          ? old.map((m) => ({ ...m, is_read: true }))
          : old
      );
    },
  });
};
