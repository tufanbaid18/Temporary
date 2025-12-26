import { useMutation, useQueryClient } from "@tanstack/react-query";
import { commentOnPost } from "../../api/post";

export const useCommentPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, c_content }) =>
      commentOnPost(postId, c_content),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["posts"]);
      queryClient.invalidateQueries(["post", variables.postId]);
    },
  });
};
