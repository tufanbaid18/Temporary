import { useQuery } from "@tanstack/react-query";
import { getProgramById } from "../../api/programApi";

export const useProgram = (id) => {
  return useQuery({
    queryKey: ["program", id],
    queryFn: () => getProgramById(id),
    enabled: !!id,
  });
};
