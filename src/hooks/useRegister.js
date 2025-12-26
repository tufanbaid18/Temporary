// src/hooks/auth/useRegister.js
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../api/registerApi";

export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
  });
};
