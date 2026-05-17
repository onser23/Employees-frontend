import axios from "axios";

// const API_URL = "http://localhost:5000/api";
// const API_URL = "https://employees-backend-nu.vercel.app/api";
const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Hər iki token-i yoxla
    const adminToken = localStorage.getItem("token");
    const userToken = localStorage.getItem("userToken");

    // Hansı səhifədə olduğumuzu müəyyən et
    const isUserRoute =
      window.location.pathname.startsWith("/user") ||
      window.location.pathname === "/user-login";

    // Uyğun token-i göndər
    if (isUserRoute && userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    } else if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - 401 xətası
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Hansı token-in aktiv olduğunu müəyyən et
      const userToken = localStorage.getItem("userToken");
      const adminToken = localStorage.getItem("token");
      const currentPath = window.location.pathname;

      // Əgər user token-i varsa və user səhifəsindədirsə
      if (
        userToken &&
        (currentPath.startsWith("/user") || currentPath === "/user-login")
      ) {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userData");
        delete api.defaults.headers.common["Authorization"];
        window.location.href = "/user-login";
        return Promise.reject(error);
      }

      // Əgər admin token-i varsa və ya user token-i yoxdursa adminə yönləndir
      if (
        adminToken ||
        currentPath.startsWith("/admin") ||
        currentPath === "/login"
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete api.defaults.headers.common["Authorization"];
        window.location.href = "/login";
        return Promise.reject(error);
      }

      // Default - user səhifəsinə yönləndir
      localStorage.removeItem("userToken");
      localStorage.removeItem("userData");
      window.location.href = "/user-login";
    }
    return Promise.reject(error);
  },
);

// İşçilər API (Admin üçün)
export const employeeAPI = {
  getAll: () => api.get("/employees"),
  getById: (id) => api.get(`/employees/${id}`),
  create: (data) => api.post("/employees", data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
};

// Admin Auth API
export const authAPI = {
  login: (username, password) =>
    api.post("/auth/login", { username, password }),
  register: (username, password) =>
    api.post("/auth/register", { username, password }),
  me: () => api.get("/auth/me"),
};

// User Auth API
export const userAuthAPI = {
  login: (email, password) => api.post("/user-auth/login", { email, password }),
  me: () => api.get("/user-auth/me"),
};

export default api;
