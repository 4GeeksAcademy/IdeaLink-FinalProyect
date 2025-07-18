import React from "react";
import { Home, Folder, User, HelpCircle } from "lucide-react";
import Separator from "./Separator";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LogoBombilla from "../LogoBombilla";
import AIChatModal from "./AIChatModal";

export default function SidebarLeft() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jwt-token");
    localStorage.removeItem("user-profile");
    localStorage.removeItem("hasVisitedFeed");
    navigate("/");
  };

  const navItems = [
    { label: "Dashboard", icon: Home, to: "/feed" },
    { label: "Perfil", icon: User, to: "/perfil" },
    { label: "Colaboraciones", icon: Folder, to: "/proyectos" },
    { label: "Sobre Nosotros", icon: User, to: "/about_us" },
    { label: "Centro de ayuda", icon: HelpCircle, to: "/soporte" },
  ];

  return (
    <aside className="w-64 bg-[#1e293b] p-5 pt-0 text-white h-screen flex flex-col justify-between">
      {/* Top Logo y Menú */}
      <div>
        <div className="h-35 flex items-start p-0 ">
          <LogoBombilla />
        </div>

        <nav className="space-y-3 ">
          {navItems.map(({ label, icon: Icon, to }) => (
            <Link
              to={to}
              key={label}
              className={`w-full flex items-center space-x-3 text-left p-2 rounded-md transition-colors duration-200 cursor-pointer ${location.pathname === to
                ? "bg-purple-700"
                : "hover:bg-purple-500/20"
                }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Separador + Botón Chat IA */}
        <div className="mt-6">
          <Separator />
        </div>
        <div className="mt-4">
          <AIChatModal /> {/* ✅ Botón que abre el chat IA */}
        </div>
      </div>

      {/* Bottom: Cerrar sesión */}
      <div className="mt-8">
        <button
          onClick={handleLogout}
          className="bg-gray-700 hover:bg-gray-600 text-white mb-3 px-4 py-2 rounded-md text-sm w-full cursor-pointer"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
