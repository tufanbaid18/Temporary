import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPastExperienceList,
  addPastExperience,
  updatePastExperience,
  deletePastExperience,
} from "../../api/profileApi";

export const usePastExperienceList = () =>
  useQuery({
    queryKey: ["past-experience"],
    queryFn: getPastExperienceList,
  });

export const useAddPastExperience = () =>
  useMutation({
    mutationFn: addPastExperience,
  });

export const useUpdatePastExperience = () =>
  useMutation({
    mutationFn: updatePastExperience,
  });

export const useDeletePastExperience = () =>
  useMutation({
    mutationFn: deletePastExperience,
  });
