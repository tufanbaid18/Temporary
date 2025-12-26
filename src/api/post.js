import api from "./api";

/* =======================
   POSTS
======================= */

// Get all posts
export const getPosts = async () => {
  const res = await api.get("/posts/");
  return res.data;
};

// Get single post
export const getPostById = async (id) => {
  const res = await api.get(`/posts/${id}/`);
  return res.data;
};

// Create post (multipart/form-data)
export const createPost = async ({ title, content, files = [] }) => {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);

  files.forEach((file) => {
    formData.append("files", file);
  });

  const res = await api.post("/posts/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

// Get my latest posts
export const getMyLatestPosts = async () => {
  const res = await api.get("/posts/my_latest/");
  return res.data;
};

/* =======================
   ACTIONS
======================= */

// Like / Unlike
export const likePost = async (postId) => {
  const res = await api.post(`/posts/${postId}/like/`);
  return res.data;
};

// Bookmark / Remove bookmark
export const bookmarkPost = async (postId) => {
  const res = await api.post(`/posts/${postId}/bookmark/`);
  return res.data;
};

// Comment
export const commentOnPost = async (postId, c_content) => {
  const res = await api.post(`/posts/${postId}/comment/`, {
    c_content,
  });
  return res.data;
};

// Share post
export const sharePost = async ({ postId, receiver }) => {
  const res = await api.post(`/posts/${postId}/share/`, {
    receiver,
  });
  return res.data;
};


export const fetchBookmarks = async () => {
  const res = await api.get("/posts/my_bookmarks/");
  return res.data;
};
