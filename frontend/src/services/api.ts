import axios from "axios";

/*
  创建 axios 实例

  所有请求都会自动以：
  http://localhost:5000/api

  开头
*/
const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

/*
  请求拦截器

  每次请求都会自动携带 token
*/
api.interceptors.request.use((config) => {
  // 从本地存储获取 token
  const token = localStorage.getItem("token");

  // 如果 token 存在
  if (token) {
    // 自动添加请求头
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;