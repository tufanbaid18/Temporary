import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptHandshake } from "../../api/handshakeApi";

export const useAcceptHandshake = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: acceptHandshake,
    onSuccess: () => {
      queryClient.invalidateQueries(["my-handshakes"]);
    }
  });
};
