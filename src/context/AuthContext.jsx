import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Səhifə yüklənəndə token-i yoxla
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await axios.get(
          // "http://localhost:5000/api/auth/me"
          // "https://employees-backend-nu.vercel.app/api/auth/me"
          process.env.REACT_APP_API_URL + "/auth/me",
        );

        process.env.EMAIL_USER;
        if (response.data.success) {
          setUser(response.data.user);
        } else {
          logout();
        }
      } catch (error) {
        logout();
      }
    }
    setLoading(false);
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post(
        // "http://localhost:5000/api/auth/login",
        // "https://employees-backend-nu.vercel.app/api/auth/login",
        process.env.REACT_APP_API_URL + "/auth/login",
        {
          username,
          password,
        },
      );

      if (response.data.success) {
        const { token, user } = response.data;

        // localStorage-a yaz
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // Axios header-ə əlavə et
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        setUser(user);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Xəta baş verdi",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
