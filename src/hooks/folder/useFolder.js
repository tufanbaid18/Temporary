// src/hooks/folder/useFolder.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchFolderTree,
  createFolder,
  renameFolder,
  deleteFolder,
  createFile,
  renameFile,
  deleteFile,
} from "../../api/folderApi";

// Fetch folder tree
export const useFolderTree = () => {
  return useQuery({
    queryKey: ["folders"],
    queryFn: fetchFolderTree,
  });
};

// create folder
export const useCreateFolder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createFolder,
    onSuccess: () => qc.invalidateQueries(["folders", "tree"]),
  });
};

// Rename folder
export const useRenameFolder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: renameFolder,
    onSuccess: () => qc.invalidateQueries(["folders"]),
  });
};

// Delete folder
export const useDeleteFolder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteFolder,
    onSuccess: () => qc.invalidateQueries(["folders","tree"]),
  });
};

// create file
export const useCreateFile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createFile,
    onSuccess: () => qc.invalidateQueries(["folders","tree"]),
  });
};

// Rename file
export const useRenameFile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: renameFile,
    onSuccess: () => qc.invalidateQueries(["folders","tree"]),
  });
};

// Delete file
export const useDeleteFile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteFile,
    onSuccess: () => qc.invalidateQueries(["folders","tree"]),
  });
};
