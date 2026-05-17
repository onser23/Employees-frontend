import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { UserAuthProvider } from "./context/UserAuthContext";
import Login from "./pages/Login";
import UserLogin from "./pages/UserLogin";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import EmployeesPage from "./pages/EmployeesPage";
import ExpeditorsPage from "./pages/ExpeditorsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import UserProtectedRoute from "./components/UserProtectedRoute"; // YENI

function App() {
  return (
    <AuthProvider>
      <UserAuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/user-login" element={<UserLogin />} />

            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="employees" element={<EmployeesPage />} />
              <Route path="expeditors" element={<ExpeditorsPage />} />
            </Route>

            {/* User routes (sonra hazırlayacağıq) */}
            <Route
              path="/user-dashboard"
              element={
                <UserProtectedRoute>
                  <div className="min-h-screen flex items-center justify-center bg-emerald-50">
                    <div className="text-center">
                      <h1 className="text-3xl font-bold text-emerald-800 mb-4">
                        User Dashboard
                      </h1>
                      <p className="text-emerald-600">
                        Tezliklə hazır olacaq...
                      </p>
                    </div>
                  </div>
                </UserProtectedRoute>
              }
            />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/user-login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </UserAuthProvider>
    </AuthProvider>
  );
}

export default App;
