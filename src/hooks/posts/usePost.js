import { useQuery } from "@tanstack/react-query";
import { getPostById } from "../../api/post";

export const usePost = (postId) => {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId,
  });
};
