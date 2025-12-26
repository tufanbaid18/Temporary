import api from "./api";

/* =======================
   PROGRAMS
======================= */

// Get all programs (with optional search + ordering)
export const getPrograms = async (params = {}) => {
  const res = await api.get("/programs/", { params });
  return res.data;
};

// Get single program
export const getProgramById = async (id) => {
  const res = await api.get(`/programs/${id}/`);
  return res.data;
};

// Create program
export const createProgram = async (data) => {
  const res = await api.post("/programs/", data);
  return res.data;
};

// Update program (PUT / PATCH)
export const updateProgram = async ({ id, data }) => {
  const res = await api.patch(`/programs/${id}/`, data);
  return res.data;
};

// Delete program
export const deleteProgram = async (id) => {
  const res = await api.delete(`/programs/${id}/`);
  return res.data;
};
