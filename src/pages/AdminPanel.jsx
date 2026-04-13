import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, LayoutDashboard, LogOut, User } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeList from "../components/EmployeeList";
import { employeeAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const AdminPanel = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getAll();
      setEmployees(response.data.data);
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
        navigate("/login");
      } else {
        toast.error("İşçiləri yükləyərkən xəta baş verdi");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Çıxış edildi");
    navigate("/login");
  };

  // ... (handleAddEmployee, handleUpdateEmployee, handleDeleteEmployee, handleEdit, handleCancel funksiyaları əvvəlki kimi qalır)

  const handleAddEmployee = async (formData) => {
    try {
      await employeeAPI.create(formData);
      toast.success("İşçi uğurla əlavə edildi!");
      setShowForm(false);
      fetchEmployees();
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Xəta baş verdi");
      }
    }
  };

  const handleUpdateEmployee = async (formData) => {
    try {
      await employeeAPI.update(editingEmployee._id, formData);
      toast.success("İşçi uğurla yeniləndi!");
      setEditingEmployee(null);
      setShowForm(false);
      fetchEmployees();
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Xəta baş verdi");
      }
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm("Bu işçini silmək istədiyinizə əminsiniz?")) return;

    try {
      await employeeAPI.delete(id);
      toast.success("İşçi uğurla silindi!");
      fetchEmployees();
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
        navigate("/login");
      } else {
        toast.error("Silinərkən xəta baş verdi");
      }
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingEmployee(null);
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <LayoutDashboard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  İşçi İdarəetmə Sistemi
                </h1>
                <p className="text-sm text-gray-500">Admin Panel</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* User info */}
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-lg">
                <User className="w-4 h-4" />
                <span className="font-medium">{user?.username}</span>
              </div>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Çıxış</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ... (qalan hissə əvvəlki kimi) */}
        {showForm ? (
          <EmployeeForm
            employee={editingEmployee}
            onSubmit={
              editingEmployee ? handleUpdateEmployee : handleAddEmployee
            }
            onCancel={handleCancel}
          />
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="mb-6 w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-md"
          >
            <Plus className="w-5 h-5" />
            Yeni İşçi Əlavə Et
          </button>
        )}

        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="İşçi axtar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <EmployeeList
          employees={filteredEmployees}
          onEdit={handleEdit}
          onDelete={handleDeleteEmployee}
          loading={loading}
        />
      </main>
    </div>
  );
};

export default AdminPanel;
