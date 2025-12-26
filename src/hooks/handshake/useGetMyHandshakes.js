// src/hooks/handshake/useGetMyHandshakes.js
import { useQuery } from "@tanstack/react-query";
import { getMyHandshakes } from "../../api/handshakeApi";

export const useGetMyHandshakes = () => {
  return useQuery({
    queryKey: ["handshakes"],
    queryFn: getMyHandshakes,
    staleTime: 1000,
    refetchOnWindowFocus: true,
  });
};
