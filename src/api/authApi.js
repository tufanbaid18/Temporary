import api from "./api";   // <-- this is your Axios instance

export const validateLogin = async ({ email, password }) => {
  const response = await api.post("/login/", { email, password });
  return response.data;
};
