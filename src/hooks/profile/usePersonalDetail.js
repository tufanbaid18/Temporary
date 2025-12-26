import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPersonalDetail,
  updatePersonalDetail,
} from "../../api/profileApi";

export const usePersonalDetail = () => {
  return useQuery({
    queryKey: ["personal-detail"],
    queryFn: getPersonalDetail,
  });
};

export const useUpdatePersonalDetail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePersonalDetail,
    onSuccess: (data) => {
      queryClient.setQueryData(["personal-detail"], data);
    },
  });
};
