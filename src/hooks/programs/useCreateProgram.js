import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProgram } from "../../api/programApi";

export const useCreateProgram = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProgram,
    onSuccess: () => {
      queryClient.invalidateQueries(["programs"]);
    },
  });
};
