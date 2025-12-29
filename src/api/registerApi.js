// src/api/registerApi.js
import api from "./api";

export const registerUser = async (data) => {
  const res = await api.post("/register/", data); // ✅ FIXED
  return res.data;
};
