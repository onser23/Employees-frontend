import React, { useState, useEffect } from "react";
import {
  UserPlus,
  Save,
  X,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

const EmployeeForm = ({ employee, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    position: "",
    department: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({}); // Validation error-ları göstərmək üçün

  useEffect(() => {
    if (employee) {
      setFormData({
        firstName: employee.firstName,
        lastName: employee.lastName,
        birthDate: employee.birthDate.split("T")[0],
        position: employee.position,
        department: employee.department,
        email: employee.email,
        password: "",
        confirmPassword: "",
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Yazmağa başlayanda həmin sahənin error-unu sil
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  // Validasiya funksiyası
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    let firstErrorField = null;

    // Ad
    if (!formData.firstName || formData.firstName.trim() === "") {
      newErrors.firstName = "Ad tələb olunur";
      isValid = false;
      if (!firstErrorField) firstErrorField = "firstName";
    }

    // Soyad
    if (!formData.lastName || formData.lastName.trim() === "") {
      newErrors.lastName = "Soyad tələb olunur";
      isValid = false;
      if (!firstErrorField) firstErrorField = "lastName";
    }

    // Doğum tarixi
    if (!formData.birthDate) {
      newErrors.birthDate = "Doğum tarixi tələb olunur";
      isValid = false;
      if (!firstErrorField) firstErrorField = "birthDate";
    }

    // Email
    if (!formData.email || formData.email.trim() === "") {
      newErrors.email = "Email tələb olunur";
      isValid = false;
      if (!firstErrorField) firstErrorField = "email";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email =
          "Düzgün email formatı daxil edin (nümunə: ad@domain.com)";
        isValid = false;
        if (!firstErrorField) firstErrorField = "email";
      }
    }

    // Vəzifə
    if (!formData.position || formData.position.trim() === "") {
      newErrors.position = "Vəzifə tələb olunur";
      isValid = false;
      if (!firstErrorField) firstErrorField = "position";
    }

    // Departament
    if (!formData.department || formData.department === "") {
      newErrors.department = "Departament seçilməlidir";
      isValid = false;
      if (!firstErrorField) firstErrorField = "department";
    }

    // Şifrə (yalnız yeni əlavə edəndə və ya redaktə edəndə doldurulubsa)
    if (!employee) {
      // Yeni işçi - şifrə mütləqdir
      if (!formData.password || formData.password === "") {
        newErrors.password = "Şifrə tələb olunur";
        isValid = false;
        if (!firstErrorField) firstErrorField = "password";
      } else if (formData.password.length < 6) {
        newErrors.password = "Şifrə ən az 6 simvol olmalıdır";
        isValid = false;
        if (!firstErrorField) firstErrorField = "password";
      }

      if (!formData.confirmPassword || formData.confirmPassword === "") {
        newErrors.confirmPassword = "Şifrə təkrarı tələb olunur";
        isValid = false;
        if (!firstErrorField) firstErrorField = "confirmPassword";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Şifrələr uyğun gəlmir";
        isValid = false;
        if (!firstErrorField) firstErrorField = "confirmPassword";
      }
    } else {
      // Redaktə - əgər şifrə doldurulubsa yoxla
      if (formData.password && formData.password.length > 0) {
        if (formData.password.length < 6) {
          newErrors.password = "Şifrə ən az 6 simvol olmalıdır";
          isValid = false;
          if (!firstErrorField) firstErrorField = "password";
        }
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = "Şifrələr uyğun gəlmir";
          isValid = false;
          if (!firstErrorField) firstErrorField = "confirmPassword";
        }
      }
    }

    setErrors(newErrors);

    // Toast bildirişi göstər (əgər error varsa)
    if (!isValid) {
      // Hər bir error üçün ayrı toast göstər
      Object.entries(newErrors).forEach(([field, message]) => {
        toast.error(message, {
          id: `error-${field}`, // Unikal ID - təkrarlanmaması üçün
          duration: 4000,
          icon: <AlertCircle className="w-4 h-4" />,
        });
      });

      // İlk error sahəsinə scroll et
      setTimeout(() => {
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.focus();
        }
      }, 100);
    }

    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasiyanı işlət
    const isValid = validateForm();
    if (!isValid) {
      return; // Form göndərilmir
    }

    // Təhlükəsiz data göndər
    const submitData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      birthDate: formData.birthDate,
      position: formData.position.trim(),
      department: formData.department,
      email: formData.email.trim().toLowerCase(),
    };

    // Əgər şifrə varsa əlavə et
    if (formData.password && formData.password.length > 0) {
      submitData.password = formData.password;
    }

    onSubmit(submitData);
  };

  // Input komponenti (error göstərmə ilə)
  const renderInput = (
    name,
    label,
    type = "text",
    placeholder,
    required = true,
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className={`
          w-full px-4 py-2 border rounded-lg transition-all
          ${
            errors[name]
              ? "border-red-500 focus:ring-2 focus:ring-red-500 bg-red-50"
              : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          }
        `}
        placeholder={placeholder}
      />
      {errors[name] && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <UserPlus className="w-6 h-6 text-blue-600" />
          {employee ? "İşçini Redaktə Et" : "Yeni İşçi Əlavə Et"}
        </h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Ad */}
          {renderInput("firstName", "Ad", "text", "Adınızı daxil edin")}

          {/* Soyad */}
          {renderInput("lastName", "Soyad", "text", "Soyadınızı daxil edin")}

          {/* Doğum Tarixi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Doğum Tarixi <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className={`
                w-full px-4 py-2 border rounded-lg transition-all
                ${
                  errors.birthDate
                    ? "border-red-500 focus:ring-2 focus:ring-red-500 bg-red-50"
                    : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                }
              `}
            />
            {errors.birthDate && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.birthDate}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email (Login üçün) <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`
                w-full px-4 py-2 border rounded-lg transition-all
                ${
                  errors.email
                    ? "border-red-500 focus:ring-2 focus:ring-red-500 bg-red-50"
                    : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                }
              `}
              placeholder="email@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Vəzifə */}
          {renderInput("position", "Vəzifə", "text", "Vəzifəni daxil edin")}

          {/* Departament */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Departament <span className="text-red-500">*</span>
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={`
                w-full px-4 py-2 border rounded-lg transition-all
                ${
                  errors.department
                    ? "border-red-500 focus:ring-2 focus:ring-red-500 bg-red-50"
                    : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                }
              `}
            >
              <option value="">Departament seçin</option>
              <option value="İnsan Resursları">İnsan Resursları</option>
              <option value="Maliyyə">Maliyyə</option>
              <option value="Marketing">Marketing</option>
              <option value="Satış">Satış</option>
              <option value="Texnologiya">Texnologiya</option>
              <option value="Əməliyyat">Əməliyyat</option>
              <option value="Hüquq">Hüquq</option>
              <option value="Digər">Digər</option>
            </select>
            {errors.department && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.department}
              </p>
            )}
          </div>

          {/* Şifrə */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Şifrə{" "}
              {employee ? (
                "(Boş qalsa dəyişilməz)"
              ) : (
                <span className="text-red-500">*</span>
              )}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`
                  w-full pl-10 pr-10 py-2 border rounded-lg transition-all
                  ${
                    errors.password
                      ? "border-red-500 focus:ring-2 focus:ring-red-500 bg-red-50"
                      : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  }
                `}
                placeholder={
                  employee ? "Yeni şifrə (istəyə bağlı)" : "Şifrə daxil edin"
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Şifrə Təkrarı */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Şifrə Təkrarı{" "}
              {formData.password ? <span className="text-red-500">*</span> : ""}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`
                  w-full pl-10 pr-10 py-2 border rounded-lg transition-all
                  ${
                    errors.confirmPassword
                      ? "border-red-500 focus:ring-2 focus:ring-red-500 bg-red-50"
                      : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  }
                `}
                placeholder="Şifrəni təkrar daxil edin"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Ləğv Et
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {employee ? "Yenilə" : "Əlavə Et"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
