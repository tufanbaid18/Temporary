import { useQuery } from "@tanstack/react-query";
import { getPrograms } from "../../api/program";

export const usePrograms = (params = {}) => {
  return useQuery({
    queryKey: ["programs", params],
    queryFn: () => getPrograms(params),
    keepPreviousData: true,
  });
};

