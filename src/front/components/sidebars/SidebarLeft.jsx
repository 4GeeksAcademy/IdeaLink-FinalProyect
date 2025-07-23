import React, { useEffect } from "react";
import { Home, Folder, User, HelpCircle } from "lucide-react";
import Separator from "./Separator";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LogoBombilla from "../LogoBombilla";
import AIChatModal from "./AIChatModal";
import useGlobalReducer from "../../hooks/useGlobalReducer";

const API_BASE = import.meta.env.VITE_API_URL;

export default function SidebarLeft() {
  const location = useLocation();
  const navigate = useNavigate();

  const { store, dispatch } = useGlobalReducer();
  const hasPending = store.pendingApplications > 0;

  const handleLogout = () => {
    localStorage.removeItem("jwt-token");
    localStorage.removeItem("user-profile");
    localStorage.removeItem("hasVisitedFeed");
    navigate("/");
  };

  // Opcional: actualizar el conteo de solicitudes periódicamente si no se hace en otro lugar
  useEffect(() => {
    const fetchApplicationsCount = async () => {
      try {
        const token = localStorage.getItem("jwt-token");
        const res = await fetch(`${API_BASE}/my-project-applications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al obtener postulaciones");
        const data = await res.json();
        dispatch({ type: "set_pending_applications", payload: data.length });
      } catch (error) {
        console.error("Error cargando solicitudes en sidebar:", error);
      }
    };

    fetchApplicationsCount();
    const interval = setInterval(fetchApplicationsCount, 30000); // cada 30 seg
    return () => clearInterval(interval);
  }, [dispatch]);

  const navItems = [
    { label: "Dashboard", icon: Home, to: "/feed" },
    { label: "Perfil", icon: User, to: "/perfil" },
    { label: "Colaboraciones", icon: Folder, to: "/proyectos" },
    { label: "Sobre Nosotros", icon: User, to: "/about_us" },
    { label: "Centro de ayuda", icon: HelpCircle, to: "/soporte" },
  ];

  return (
    <aside className="w-64 bg-[#1e2939] p-5 pt-0 text-white h-screen flex flex-col justify-between">
      <div>
        <div className="h-35 flex items-start p-0 ">
          <LogoBombilla />
        </div>

        <nav className="space-y-3 ">
          {navItems.map(({ label, icon: Icon, to }) => {
            const isActive = location.pathname === to;
            const isCollab = label === "Colaboraciones";

            return (
              <Link
                to={to}
                key={label}
                className={`relative w-full flex items-center space-x-3 text-left p-2 rounded-md transition-colors duration-200 cursor-pointer ${isActive ? "bg-purple-700" : "hover:bg-purple-500/20"
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>

                {/* 🔴 Notificación mejorada para "Colaboraciones" */}
                {isCollab && hasPending && (
                  <div className="absolute -top-2 -left-1 flex items-center justify-center">
                    {/* Círculo de fondo con animación de pulso */}
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                      {/* Número de solicitudes pendientes */}
                      <span className="text-white text-xs font-semibold leading-none">
                        {store.pendingApplications > 99 ? '99+' : store.pendingApplications}
                      </span>
                    </div>
                    {/* Anillo exterior con animación de ping */}
                    <div className="absolute w-5 h-5 bg-red-400 rounded-full animate-ping opacity-75"></div>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6">
          <Separator />
        </div>
        <div className="mt-4">
          <AIChatModal />
        </div>
      </div>

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