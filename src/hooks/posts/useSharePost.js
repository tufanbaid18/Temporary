import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sharePost } from "../../api/post";

export const useSharePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sharePost,
    onSuccess: () => {
      // refresh inbox + conversations
      queryClient.invalidateQueries(["conversations"]);
      queryClient.invalidateQueries(["messages"]);
    },
  });
};
