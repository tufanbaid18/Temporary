// src/hooks/handshake/useCancelHandshake.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelHandshake, createHandshake } from "../../api/handshakeApi";

// mutation to cancel (delete) and also helper to undo (recreate)
export const useCancelHandshake = () => {
  const qc = useQueryClient();

  const cancelMut = useMutation({
    mutationFn: (id) => cancelHandshake(id),
    onSuccess: () => qc.invalidateQueries(["handshakes"]),
  });

  // undo -> create handshake again
  const undoCreateMut = useMutation({
    mutationFn: ({ receiver_id }) => createHandshake({ receiver_id }),
    onSuccess: () => qc.invalidateQueries(["handshakes"]),
  });

  return { cancelMut, undoCreateMut };
};
