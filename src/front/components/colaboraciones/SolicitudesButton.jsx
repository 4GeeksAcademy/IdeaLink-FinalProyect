import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Users } from "lucide-react";
import useGlobalReducer from "../../hooks/useGlobalReducer"; // 👈 IMPORTANTE

const API_BASE = import.meta.env.VITE_API_URL;

export default function SolicitudesButton() {
    const [applications, setApplications] = useState([]);
    const [showRequests, setShowRequests] = useState(false);
    const [pendingCount, setPendingCount] = useState(0);
    const buttonRef = useRef(null);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

    const { dispatch } = useGlobalReducer(); // 👈 ACCESO AL DISPATCH GLOBAL

    const fetchApplications = async () => {
        try {
            const token = localStorage.getItem("jwt-token");
            const res = await fetch(`${API_BASE}/my-project-applications`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Error al obtener postulaciones");
            const data = await res.json();
            setApplications(data);
            setPendingCount(data.length);
            dispatch({ type: "set_pending_applications", payload: data.length }); // 👈 ACTUALIZA GLOBAL
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    useEffect(() => {
        if (showRequests && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setModalPosition({
                top: rect.bottom + window.scrollY + 8,
                left: rect.left + window.scrollX
            });
        }
    }, [showRequests]);

    const handleAccept = async (appId) => {
        try {
            const token = localStorage.getItem("jwt-token");
            const res = await fetch(`${API_BASE}/applications/${appId}/accept`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            if (!res.ok) throw new Error("Error al aceptar postulación");

            setApplications((prev) => {
                const updated = prev.filter((a) => a.id !== appId);
                setPendingCount(updated.length);
                dispatch({ type: "set_pending_applications", payload: updated.length }); // 👈 ACTUALIZA GLOBAL
                return updated;
            });
        } catch (error) {
            console.error("❌ Error aceptando postulación:", error);
        }
    };

    const handleReject = async (appId) => {
        try {
            const token = localStorage.getItem("jwt-token");
            const res = await fetch(`${API_BASE}/applications/${appId}/reject`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            if (!res.ok) throw new Error("Error al rechazar postulación");

            setApplications((prev) => {
                const updated = prev.filter((a) => a.id !== appId);
                setPendingCount(updated.length);
                dispatch({ type: "set_pending_applications", payload: updated.length }); // 👈 ACTUALIZA GLOBAL
                return updated;
            });
        } catch (error) {
            console.error("❌ Error rechazando postulación:", error);
        }
    };

    const ModalSolicitudes = () =>
        createPortal(
            <div
                style={{
                    position: "absolute",
                    top: `${modalPosition.top}px`,
                    left: `${modalPosition.left}px`,
                    zIndex: 9999
                }}
                className="w-[300px] bg-gray-800 border border-gray-700 p-4 rounded-md shadow-lg"
            >
                <h3 className="text-purple-400 font-bold mb-2">Postulaciones</h3>
                {applications.length === 0 ? (
                    <p className="text-gray-400 text-sm">No hay nuevas solicitudes.</p>
                ) : (
                    <ul className="space-y-2 max-h-60 overflow-y-auto">
                        {applications.map((app) => (
                            <li key={app.id} className="border border-gray-600 rounded-md p-2 text-white">
                                <p className="font-semibold">{app.user.username}</p>
                                <p className="text-sm italic text-gray-400">{app.message}</p>
                                <div className="mt-2 flex gap-2">
                                    <button
                                        onClick={() => handleAccept(app.id)}
                                        className="bg-green-600 hover:bg-green-700 px-2 py-1 rounded text-xs cursor-pointer"
                                    >
                                        Aceptar
                                    </button>
                                    <button
                                        onClick={() => handleReject(app.id)}
                                        className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs cursor-pointer"
                                    >
                                        Rechazar
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>,
            document.body
        );

    return (
        <>
            <div className="relative flex">
                <button
                    ref={buttonRef}
                    onClick={() => setShowRequests(!showRequests)}
                    className="flex items-center rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-3 px-6 text-sm font-medium text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
                >
                    Postulaciones
                </button>

                {pendingCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full z-[999]">
                        {pendingCount}
                    </span>
                )}
            </div>

            {showRequests && <ModalSolicitudes />}
        </>
    );
}
