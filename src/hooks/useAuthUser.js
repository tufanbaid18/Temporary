// src/hooks/useAuthUser.js
import { useQuery } from "@tanstack/react-query";
import api from "../api/api";

export default function useAuthUser() {
  return useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await api.get("/user/"); // backend endpoint for current user
      return res.data;
    },
    initialData: JSON.parse(localStorage.getItem("user")) || null,
    staleTime: 1000 * 60 * 5, // optional, cache for 5 min
  });
}
