import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../../api/userApi";

export const useUser = (userId) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
};
