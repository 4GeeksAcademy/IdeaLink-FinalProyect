import React from "react";
import { Home, Folder, User, HelpCircle } from "lucide-react";
import Separator from "./Separator";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LogoBombilla from "../LogoBombilla";
import AIChatModal from "./AIChatModal"; // ✅ Usa el modal, no el sidebar

export default function SidebarLeft() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: "Dashboard", icon: Home, to: "/feed" },
    { label: "Perfil", icon: User, to: "/perfil" },
    { label: "Colaboraciones", icon: Folder, to: "/proyectos" },
    { label: "Sobre Nosotros", icon: User, to: "/about_us" },
    { label: "Centro de ayuda", icon: HelpCircle, to: "/soporte" },
  ];

  return (
    <aside className="w-64 bg-[#1e293b] p-5 pt-4 text-white h-screen flex flex-col justify-between">
      {/* Top Logo y Menú */}
      <div>
        <div className="mb-4">
          <LogoBombilla />
        </div>

        <nav className="space-y-3">
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
          <AIChatModal /> {/* ✅ Aquí va el botón */}
        </div>
      </div>

      {/* Bottom: Cerrar sesión */}
      <div className="mt-8">
        <button

          onClick={() => navigate("/")}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm w-full"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
