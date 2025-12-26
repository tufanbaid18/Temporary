import { useQuery } from "@tanstack/react-query";
import { getMyLatestPosts } from "../../api/post";

export const useMyLatestPosts = () => {
  return useQuery({
    queryKey: ["my-posts"],
    queryFn: getMyLatestPosts,
  });
};
