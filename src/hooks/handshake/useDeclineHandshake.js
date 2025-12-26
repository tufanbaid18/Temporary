import { useMutation, useQueryClient } from "@tanstack/react-query";
import { declineHandshake } from "../../api/handshakeApi";

export const useDeclineHandshake = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: declineHandshake,
    onSuccess: () => {
      queryClient.invalidateQueries(["my-handshakes"]);
    }
  });
};
