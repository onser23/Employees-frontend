import axios from "axios";

// const API_URL = "http://localhost:5000/api";
const API_URL = "https://employees-backend-nu.vercel.app/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - hər request-ə token əlavə et
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - 401 xətası gələrsə
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// İşçilər API
export const employeeAPI = {
  getAll: () => api.get("/employees"),
  getById: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post("/employees", data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
};

// Auth API
export const authAPI = {
  login: (username, password) =>
    api.post("/auth/login", { username, password }),
  register: (username, password) =>
    api.post("/auth/register", { username, password }),
  me: () => api.get("/auth/me"),
};

export default api;
