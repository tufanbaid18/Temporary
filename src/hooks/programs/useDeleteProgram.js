import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProgram } from "../../api/programApi";

export const useDeleteProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProgram,
    onSuccess: () => {
      queryClient.invalidateQueries(["programs"]);
    },
  });
};

