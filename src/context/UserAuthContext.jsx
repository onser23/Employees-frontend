// frontend/src/context/UserAuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const UserAuthContext = createContext(null);

export const UserAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("userToken");

    if (token) {
      try {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await axios.get(
          // 'http://localhost:5000/api/user-auth/me'
          process.env.REACT_APP_API_URL + "/user-auth/me",
        );

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

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        // 'http://localhost:5000/api/user-auth/login',
        process.env.REACT_APP_API_URL + "/user-auth/login",
        {
          email,
          password,
        },
      );

      console.log("Server cavabı:", response.data); // Debug

      if (response.data.success) {
        const { token, user } = response.data;

        localStorage.setItem("userToken", token);
        localStorage.setItem("userData", JSON.stringify(user));

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        setUser(user);
        return { success: true, user };
      } else {
        // Backend success: false qaytardıqda
        return {
          success: false,
          message: response.data.message || "Giriş uğursuz oldu",
        };
      }
    } catch (error) {
      console.error("UserAuthContext login xətası:", error.response?.data);

      // MÜTLƏQ BU ŞƏKİLDƏ QAYTAR
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Email və ya şifrə yanlışdır!";

      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
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

  return (
    <UserAuthContext.Provider value={value}>
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error("useUserAuth must be used within UserAuthProvider");
  }
  return context;
};
