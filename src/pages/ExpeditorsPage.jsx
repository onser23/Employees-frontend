import React, { useState, useEffect } from "react";
import { Search, Truck, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import EmployeeList from "../components/EmployeeList";
import { employeeAPI } from "../services/api";
import { useNavigate } from "react-router-dom";

const ExpeditorsPage = () => {
  const [expeditors, setExpeditors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchExpeditors();
  }, []);

  const fetchExpeditors = async () => {
    try {
      setLoading(true);
      const response = await employeeAPI.getAll();
      const allEmployees = response.data.data;

      // Yalnız vəzifəsi "Ekspeditor" olanları filtrlə
      const filtered = allEmployees.filter(
        (emp) => emp.position.toLowerCase().trim() === "ekspeditor",
      );

      setExpeditors(filtered);
    } catch (error) {
      if (error.response?.status === 401) {
        window.location.href = "/login";
      } else {
        toast.error("Məlumatları yükləyərkən xəta baş verdi");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Düzəldilmiş: İşçilər səhifəsinə yönləndir
  const handleEdit = (employee) => {
    // İşçilər səhifəsinə yönləndir və redaktə modunu aç
    navigate("/admin/employees", {
      state: { editEmployee: employee },
    });
    toast.success("İşçilər səhifəsinə yönləndirilir...");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bu ekspeditoru silmək istədiyinizə əminsiniz?"))
      return;

    try {
      await employeeAPI.delete(id);
      toast.success("Ekspeditor uğurla silindi!");
      fetchExpeditors();
    } catch (error) {
      toast.error("Silinərkən xəta baş verdi");
    }
  };

  const filteredExpeditors = expeditors.filter(
    (emp) =>
      emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Truck className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Ekspeditorlar</h2>
            <p className="text-sm text-gray-500">
              Ümumi: {expeditors.length} ekspeditor
            </p>
          </div>
        </div>
      </div>

      {/* Info banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex items-start gap-3">
        <Truck className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm text-emerald-800 font-medium">
            Bu səhifədə yalnız Ekspeditor vəzifəsində olan işçilər göstərilir.
          </p>
          <p className="text-xs text-emerald-600 mt-1">
            Yeni ekspeditor əlavə etmək üçün{" "}
            <a href="/admin/employees" className="underline font-medium">
              İşçilər
            </a>{" "}
            səhifəsinə keçin.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Ekspeditor axtar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Custom List (redaktə/sil ilə) */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      ) : filteredExpeditors.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600">
            Ekspeditor tapılmadı
          </h3>
          <p className="text-gray-400">
            Yeni ekspeditor əlavə etmək üçün İşçilər səhifəsinə keçin
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExpeditors.map((employee) => (
            <div
              key={employee._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {employee.firstName[0]}
                    {employee.lastName[0]}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {employee.firstName} {employee.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{employee.email}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Truck className="w-4 h-4 text-emerald-500" />
                  <span className="font-medium">Vəzifə:</span>{" "}
                  {employee.position}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">Departament:</span>{" "}
                  {employee.department}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                <button
                  onClick={() => handleEdit(employee)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                  Redaktə Et
                </button>
                <button
                  onClick={() => handleDelete(employee._id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpeditorsPage;
