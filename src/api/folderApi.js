// src/api/folderApi.js
import api from "./api";

// ------------------------------
// 🔹 GET FOLDER TREE
// ------------------------------
export const fetchFolderTree = async () => {
  const res = await api.get("/folders/tree/");
  return res.data;
};

// ------------------------------
// 🔹 CREATE / UPDATE / DELETE FOLDER
// ------------------------------
export const createFolder = async (data) => {
  const res = await api.post("/folders/", data);
  return res.data;
};

export const renameFolder = async ({ id, name }) => {
  const res = await api.patch(`/folders/${id}/`, { name });
  return res.data;
};

export const deleteFolder = async (id) => {
  const res = await api.delete(`/folders/${id}/`);
  return res.data;
};

// ------------------------------
// 🔹 CREATE / UPDATE / DELETE FILE (FolderItem)
// ------------------------------
export const createFile = async (data) => {
  const res = await api.post("/folder-items/", data);
  return res.data;
};

export const renameFile = async ({ id, title }) => {
  const res = await api.patch(`/folder-items/${id}/`, { title });
  return res.data;
};

export const deleteFile = async (id) => {
  const res = await api.delete(`/folder-items/${id}/`);
  return res.data;
};
