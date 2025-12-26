// src/hooks/handshake/useUpdateHandshake.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { acceptHandshake, declineHandshake } from "../../api/handshakeApi";

export const useUpdateHandshakeStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }) => {
      if (status === "accepted") return acceptHandshake(id);
      if (status === "declined" || status === "rejected") return declineHandshake(id);
      throw new Error("Unsupported status");
    },
    onSuccess: () => qc.invalidateQueries(["handshakes"]),
  });
};
