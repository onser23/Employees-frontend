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
import SalesPage from "./pages/SalesPage"; // YENI
import IncomesPage from "./pages/IncomesPage"; // YENI
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <UserAuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/user-login" element={<UserLogin />} />

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
              <Route path="sales" element={<SalesPage />} /> // YENI
              <Route path="incomes" element={<IncomesPage />} /> // YENI
            </Route>

            <Route path="/" element={<Navigate to="/user-login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </UserAuthProvider>
    </AuthProvider>
  );
}

export default App;
