import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookmarkPost } from "../../api/post";

export const useBookmarkPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookmarkPost,
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });
};

