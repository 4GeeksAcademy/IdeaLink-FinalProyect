import React, { useState, useRef, useEffect } from "react";
import { Home, Folder, User, HelpCircle } from "lucide-react";
import Separator from "./Separator";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import LogoBombilla from "../LogoBombilla";
import { MessageCircle } from "lucide-react";
import AIChatSidebar from "./AIChatSidebar";

export default function SidebarLeft() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", icon: Home, to: "/feed" },
    { label: "Perfil", icon: User, to: "/perfil" },
    { label: "Colaboraciones", icon: Folder, to: "/proyectos" },
    { label: "Sobre Nosotros", icon: User, to: "/about_us" },
    { label: "Centro de ayuda", icon: HelpCircle, to: "/soporte" },
  ];

  return (
    <>
      <div className="h-30 flex items-start p-0">
        <LogoBombilla />
      </div>

      <aside className="w-64 bg-[#1e293b] p-5 pt-0 space-y-6 text-white mt-0">
        <nav className="space-y-3">
          {navItems.map(({ label, icon: Icon, to }) => (
            <Link
              to={to}
              key={label}
              className={`w-full flex items-center space-x-3 text-left p-2 rounded-md transition-colors duration-200 cursor-pointer ${location.pathname === to ? "bg-purple-700" : "hover:bg-purple-500/20"
                }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <div className="pt-6">
          <Separator />
        </div>
        <button
          onClick={() => setOpen(true)}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm"
        >
          <MessageCircle className="w-4 h-4" />
          Chat IA
        </button>
        <button
          onClick={() => navigate("/")}
          className="absolute bottom-4 left-4 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm cursor-pointer"
        >
          Cerrar sesión
        </button>
      </aside>
      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-gray-900 w-full max-w-md max-h-[90vh] rounded-xl shadow-lg flex flex-col overflow-hidden border border-purple-700">
            <div className="flex justify-end p-2">
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <AIChatSidebar />
          </div>
        </div>
      )}
    </>
  );
}
