// src/hooks/post/useCreatePost.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "../../api/post";

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ title, content, files }) => createPost({ title, content, files }),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]); // refresh feed
    },
  });
};
