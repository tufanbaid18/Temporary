import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadProfileImage } from "../../api/profileApi";

export const useUploadProfileImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadProfileImage,
    onSuccess: (data) => {
      // Update user-profile cache
      queryClient.setQueryData(["user-profile"], (old) => ({
        ...old,
        profile_image: data.profile_image,
      }));
    },
  });
};
