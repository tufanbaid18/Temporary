import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getEducationList,
  addEducation,
  updateEducation,
  deleteEducation,
} from "../../api/profileApi";

export const useEducationList = () => {
  return useQuery({
    queryKey: ["education"],
    queryFn: getEducationList,
  });
};

export const useAddEducation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addEducation,
    onSuccess: () => {
      queryClient.invalidateQueries(["education"]);
    },
  });
};

export const useUpdateEducation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEducation,
    onSuccess: () => {
      queryClient.invalidateQueries(["education"]);
    },
  });
};

export const useDeleteEducation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEducation,
    onSuccess: () => {
      queryClient.invalidateQueries(["education"]);
    },
  });
};

