import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likePost } from "../../api/post";

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: likePost,
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      queryClient.invalidateQueries(["post"]);
    },
  });
};

