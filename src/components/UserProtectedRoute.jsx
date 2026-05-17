// frontend/src/components/UserProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";

const UserProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useUserAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/user-login" replace />;
  }

  return children;
};

export default UserProtectedRoute;
