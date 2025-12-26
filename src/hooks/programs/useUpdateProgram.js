import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProgram } from "../../api/programApi";

export const useUpdateProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProgram,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["programs"]);
      queryClient.invalidateQueries(["program", variables.id]);
    },
  });
};
