import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  Users,
  Truck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    {
      path: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      path: "/admin/employees",
      label: "İşçilər",
      icon: Users,
      exact: false,
    },
    {
      path: "/admin/expeditors",
      label: "Ekspeditorlar",
      icon: Truck,
      exact: false,
    },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobile = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={toggleMobile}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg shadow-lg"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 
          text-white transition-all duration-300 z-40 shadow-xl
          ${collapsed ? "w-20" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-700">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg">Admin</span>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mx-auto">
              <Users className="w-5 h-5" />
            </div>
          )}

          {/* Collapse button (desktop only) */}
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex p-1 hover:bg-slate-700 rounded transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* User info */}
        <div
          className={`p-4 border-b border-slate-700 ${collapsed ? "text-center" : ""}`}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="font-bold text-sm">
              {user?.username?.[0]?.toUpperCase() || "A"}
            </span>
          </div>
          {!collapsed && (
            <>
              <p className="text-sm font-medium truncate">{user?.username}</p>
              <p className="text-xs text-slate-400">Administrator</p>
            </>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white"
                  }
                  ${collapsed ? "justify-center" : ""}
                `}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 ${isActive ? "animate-pulse" : ""}`}
                />
                {!collapsed && (
                  <span className="font-medium">{item.label}</span>
                )}

                {/* Active indicator */}
                {isActive && !collapsed && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className={`
              flex items-center gap-3 px-3 py-3 w-full rounded-lg
              text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all
              ${collapsed ? "justify-center" : ""}
            `}
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span className="font-medium">Çıxış</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
