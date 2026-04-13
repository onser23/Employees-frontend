import React from "react";
import { Edit2, Trash2, Mail, Briefcase, Building2, Cake } from "lucide-react";
import { format } from "date-fns";
import { az } from "date-fns/locale";

const EmployeeCard = ({ employee, onEdit, onDelete }) => {
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const isBirthdayToday = () => {
    const today = new Date();
    const birth = new Date(employee.birthDate);
    return (
      today.getMonth() === birth.getMonth() &&
      today.getDate() === birth.getDate()
    );
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow relative overflow-hidden ${isBirthdayToday() ? "ring-2 ring-pink-400" : ""}`}
    >
      {isBirthdayToday() && (
        <div className="absolute top-0 right-0 bg-pink-500 text-white px-3 py-1 rounded-bl-lg text-xs font-bold">
          🎂 Bu gün doğum günüdür!
        </div>
      )}

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {employee.firstName[0]}
            {employee.lastName[0]}
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              {employee.firstName} {employee.lastName}
            </h3>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <Mail className="w-3 h-3" />
              {employee.email}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(employee)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Redaktə et"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(employee._id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Sil"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Briefcase className="w-4 h-4 text-blue-500" />
          <span className="font-medium">Vəzifə:</span> {employee.position}
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Building2 className="w-4 h-4 text-green-500" />
          <span className="font-medium">Departament:</span>{" "}
          {employee.department}
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Cake className="w-4 h-4 text-pink-500" />
          <span className="font-medium">Doğum tarixi:</span>
          {format(new Date(employee.birthDate), "dd MMMM yyyy", { locale: az })}
          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
            {calculateAge(employee.birthDate)} yaş
          </span>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;
