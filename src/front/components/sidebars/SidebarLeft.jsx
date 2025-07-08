import React, { useState, useRef, useEffect } from "react";
import { Home, Folder, User, HelpCircle } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AIChatSidebar from "./AIChatSidebar";

export default function SidebarLeft() {
  const location = useLocation();
  const navigate = useNavigate();

  const [chatHeight, setChatHeight] = useState(300);
  const isResizing = useRef(false);

  const startResizing = () => (isResizing.current = true);
  const stopResizing = () => (isResizing.current = false);
  const resize = (e) => {
    if (!isResizing.current) return;
    const newHeight = window.innerHeight - e.clientY - 60;
    if (newHeight >= 200 && newHeight <= 600) setChatHeight(newHeight);
  };

  useEffect(() => {
    window.addEventListener("mousemove", resize);
    window.addEventListener("mouseup", stopResizing);
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, []);

  const navItems = [
    { label: "Dashboard", icon: Home, to: "/feed" },
    { label: "Perfil", icon: User, to: "/perfil" },
    { label: "Colaboraciones", icon: Folder, to: "/proyectos" },
    { label: "Sobre Nosotros", icon: User, to: "/about_us" },
    { label: "Centro de ayuda", icon: HelpCircle, to: "/soporte" },
  ];

  return (
    <aside className="w-64 bg-[#1e293b] p-5 space-y-6 text-white h-screen flex flex-col justify-between relative">
      <div>
        <h2 className="text-xl font-bold mb-4">Logo Aquí</h2>
        <nav className="space-y-3">
          {navItems.map(({ label, icon: Icon, to }) => (
            <Link
              to={to}
              key={label}
              className={`w-full flex items-center space-x-3 text-left p-2 rounded-md transition-colors duration-200 cursor-pointer ${
                location.pathname === to
                  ? "bg-purple-700"
                  : "hover:bg-purple-500/20"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div
        style={{ height: `${chatHeight}px` }}
        className="overflow-hidden rounded-md border border-gray-700 relative mt-6"
      >
        <div
          onMouseDown={startResizing}
          className="absolute top-0 left-0 right-0 h-2 cursor-ns-resize bg-gray-600 z-10"
        />
        <AIChatSidebar />
      </div>

      <button
        onClick={() => navigate("/")}
        className="absolute bottom-4 left-4 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm cursor-pointer"
      >
        Cerrar sesión
      </button>
    </aside>
  );
}
