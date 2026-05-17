import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import { LogIn, Mail, Lock, Eye, EyeOff, Briefcase } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const UserLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useUserAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasiya
    if (!formData.email.trim() || !formData.password) {
      toast.error("Email və şifrə daxil edilməlidir!", {
        duration: 4000,
        icon: "⚠️",
      });
      return;
    }

    // Email formatı yoxlama
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Düzgün email formatı daxil edin!", {
        duration: 4000,
        icon: "⚠️",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log("Login göndərilir:", formData.email); // Debug

      const result = await login(formData.email, formData.password);

      console.log("Login nəticəsi:", result); // Debug - BUNU YOXLAYIN

      if (result.success) {
        toast.success(`Xoş gəlmisiniz, ${result.user?.firstName || ""}!`, {
          duration: 3000,
          icon: "👋",
        });
        navigate("/user-dashboard");
      } else {
        // BURADA MÜTLƏQ TOAST ÇIXMALIDIR
        console.log("Error mesajı:", result.message); // Debug

        toast.error(result.message || "Email və ya şifrə yanlışdır!", {
          duration: 4000,
          icon: "❌",
        });
      }
    } catch (error) {
      console.error("UserLogin xətası:", error);
      toast.error("Sistem xətası baş verdi. Zəhmət olmasa yenidən cəhd edin.", {
        duration: 5000,
        icon: "🔥",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 flex items-center justify-center p-4">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#363636",
            color: "#fff",
            padding: "16px",
            borderRadius: "8px",
          },
          success: {
            style: {
              background: "#22c55e",
            },
          },
          error: {
            style: {
              background: "#ef4444",
            },
          },
        }}
      />

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Briefcase className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">İşçi Girişi</h1>
          <p className="text-gray-500">Hesabınıza daxil olun</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="email@example.com"
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Şifrə
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="Şifrənizi daxil edin"
                disabled={isLoading}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Daxil olunur...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Daxil Ol
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Admin səhifəsinə keçid:{" "}
            <a
              href="/login"
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Admin Girişi
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
