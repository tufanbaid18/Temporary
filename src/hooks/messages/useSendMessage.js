// src/hooks/messages/useSendMessage.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendMessage } from "../../api/messageApi";

export const useSendMessage = (userId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendMessage,

    onSuccess: (newMessage) => {
      // update chat history cache
      queryClient.setQueryData(
        ["chatHistory", userId],
        (old = []) => [...old, newMessage]
      );

      // refresh conversations (inbox)
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    },
  });
};
