import axios from "axios";

const api = axios.create({
  baseURL: "http://68.178.168.255:9006/api",  
});


// const api = axios.create({
//   baseURL: "http://127.0.0.1:8000/api",  // <-- Correct main API root
// });


api.interceptors.request.use((config) => {
  // 1) Add timestamp only to GET
  if (config.method?.toLowerCase() === "get") {
    config.params = {
      ...(config.params || {}),
      _t: Date.now(),
    };
  }

  // 2) Attach Token
  const token = localStorage.getItem("token");
  if (token && config.url !== "/login/") {
    config.headers.Authorization = `Token ${token}`;
  }

  return config;
});

export default api;
