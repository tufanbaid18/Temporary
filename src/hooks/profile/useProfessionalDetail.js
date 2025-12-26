import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProfessionalDetail,
  updateProfessionalDetail,
} from "../../api/profileApi";

export const useProfessionalDetail = () => {
  return useQuery({
    queryKey: ["professional-detail"],
    queryFn: getProfessionalDetail,
  });
};

export const useUpdateProfessionalDetail = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfessionalDetail,
    onSuccess: (data) => {
      queryClient.setQueryData(["professional-detail"], data);
    },
  });
};

