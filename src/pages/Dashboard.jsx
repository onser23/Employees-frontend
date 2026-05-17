import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Truck,
  UserPlus,
  TrendingUp,
  Calendar,
  Briefcase,
} from "lucide-react";
import { employeeAPI } from "../services/api";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    expeditors: 0,
    departments: 0,
  });
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await employeeAPI.getAll();
      const employees = response.data.data;

      const expeditors = employees.filter((emp) =>
        emp.position.toLowerCase().includes("ekspeditor"),
      );

      const uniqueDepartments = [
        ...new Set(employees.map((emp) => emp.department)),
      ];

      setStats({
        totalEmployees: employees.length,
        expeditors: expeditors.length,
        departments: uniqueDepartments.length,
      });

      setRecentEmployees(employees.slice(0, 5));
    } catch (error) {
      toast.error("Məlumatları yükləyərkən xəta");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Ümumi İşçi",
      value: stats.totalEmployees,
      icon: Users,
      color: "bg-blue-500",
      path: "/admin/employees",
    },
    {
      title: "Ekspeditor",
      value: stats.expeditors,
      icon: Truck,
      color: "bg-emerald-500",
      path: "/admin/expeditors",
    },
    {
      title: "Departament",
      value: stats.departments,
      icon: Briefcase,
      color: "bg-purple-500",
      path: "/admin/employees",
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              onClick={() => navigate(card.path)}
              className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {card.value}
                  </p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Employees */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-600" />
            Son Əlavə Edilən İşçilər
          </h2>
          <button
            onClick={() => navigate("/admin/employees")}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Hamısına bax →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  İşçi
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Vəzifə
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Departament
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                  Doğum Tarixi
                </th>
              </tr>
            </thead>
            <tbody>
              {recentEmployees.map((emp) => (
                <tr
                  key={emp._id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {emp.firstName[0]}
                        {emp.lastName[0]}
                      </div>
                      <span className="font-medium text-gray-800">
                        {emp.firstName} {emp.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{emp.position}</td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                      {emp.department}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-sm">
                    {new Date(emp.birthDate).toLocaleDateString("az-AZ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
