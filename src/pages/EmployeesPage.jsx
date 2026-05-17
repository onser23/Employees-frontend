import React, { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeList from "../components/EmployeeList";
import { employeeAPI } from "../services/api";

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const location = useLocation();

  // ✅ Ekspeditorlar səhifəsindən gələn state-i yoxla
  useEffect(() => {
    if (location.state?.editEmployee) {
      setEditingEmployee(location.state.editEmployee);
      setShowForm(true);
      // State-i təmizlə
      window.history.replaceState({}, document.title);
    }
  }, [location]);

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
        window.location.href = "/login";
      } else {
        toast.error("İşçiləri yükləyərkən xəta baş verdi");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = async (formData) => {
    try {
      await employeeAPI.create(formData);
      toast.success("İşçi uğurla əlavə edildi!");
      setShowForm(false);
      fetchEmployees();
    } catch (error) {
      toast.error(error.response?.data?.message || "Xəta baş verdi");
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
      toast.error(error.response?.data?.message || "Xəta baş verdi");
    }
  };

  const handleDeleteEmployee = async (id) => {
    if (!window.confirm("Bu işçini silmək istədiyinizə əminsiniz?")) return;

    try {
      await employeeAPI.delete(id);
      toast.success("İşçi uğurla silindi!");
      fetchEmployees();
    } catch (error) {
      toast.error("Silinərkən xəta baş verdi");
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Bütün İşçilər</h2>
          <p className="text-sm text-gray-500">
            Ümumi: {employees.length} işçi
          </p>
        </div>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-md"
          >
            <Plus className="w-5 h-5" />
            Yeni İşçi Əlavə Et
          </button>
        )}
      </div>

      {showForm && (
        <EmployeeForm
          employee={editingEmployee}
          onSubmit={editingEmployee ? handleUpdateEmployee : handleAddEmployee}
          onCancel={handleCancel}
        />
      )}

      <div className="relative">
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
    </div>
  );
};

export default EmployeesPage;
