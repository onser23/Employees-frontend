import React from "react";
import { useLocation } from "react-router-dom";
import { Bell, Search, Calendar } from "lucide-react";

const TopBar = () => {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/admin":
        return "Dashboard";
      case "/admin/employees":
        return "İşçilər";
      case "/admin/expeditors":
        return "Ekspeditorlar";
      default:
        return "Admin Panel";
    }
  };

  const today = new Date().toLocaleDateString("az-AZ", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-20">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Date */}
        <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span className="capitalize">{today}</span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Search */}
        <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Axtar..."
            className="bg-transparent border-none outline-none text-sm w-48"
          />
        </div>
      </div>
    </header>
  );
};

export default TopBar;
