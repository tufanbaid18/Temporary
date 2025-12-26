// src/api/registerApi.js
import api from "./api";

export const registerUser = async (data) => {
  const res = await api.post("/users/", data);
  return res.data;
};
