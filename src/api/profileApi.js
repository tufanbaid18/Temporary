import api from "./api";

/* =================================================
   👤 USER (Core Profile: name, DOB, gender, image)
================================================= */

export const getUserProfile = async () => {
  const res = await api.get("/user-profile/");
  return res.data; // single user object (handled in viewset)
};

export const updateUserProfile = async (data) => {
  const res = await api.patch("/user-profile/update-current/", data);
  return res.data;
};


/* =================================================
   🧍 PERSONAL DETAILS
================================================= */

export const getPersonalDetail = async () => {
  const res = await api.get("/profile/personal/");
  return res.data;
};

export const updatePersonalDetail = async (data) => {
  const res = await api.patch("/profile/personal/update/", data);
  return res.data;
};

/* =================================================
   💼 PROFESSIONAL DETAILS (Current)
================================================= */

export const getProfessionalDetail = async () => {
  const res = await api.get("/profile/professional/");
  return res.data;
};

export const updateProfessionalDetail = async (data) => {
  const res = await api.patch("/profile/professional/update/", data);
  return res.data;
};

/* =================================================
   🎓 EDUCATION
================================================= */

export const getEducationList = async () => {
  const res = await api.get("/profile/education/");
  return res.data;
};

export const addEducation = async (data) => {
  const res = await api.post("/profile/education/add/", data);
  return res.data;
};

export const updateEducation = async ({ id, data }) => {
  const res = await api.patch(`/profile/education/${id}/update/`, data);
  return res.data;
};

export const deleteEducation = async (id) => {
  const res = await api.delete(`/profile/education/${id}/delete/`);
  return res.data;
};


/* =================================================
   🖼 PROFILE IMAGE
================================================= */

export const uploadProfileImage = async (formData) => {
  const res = await api.post("/upload-profile-image/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
