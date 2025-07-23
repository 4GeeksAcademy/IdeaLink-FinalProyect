import React, { useEffect, useState } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Avatar } from "@material-tailwind/react";
import { toast } from "react-toastify";
const API_BASE = import.meta.env.VITE_API_URL;

export default function PostulacionesModal({ open, handleClose }) {
    const [postulaciones, setPostulaciones] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchPostulaciones = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("jwt-token");
            const res = await fetch(`${API_BASE}/my-applications-received`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error("Error al obtener postulaciones");
            const data = await res.json();
            setPostulaciones(data);
        } catch (error) {
            toast.error("❌ Error cargando postulaciones");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) fetchPostulaciones();
    }, [open]);

    const responderPostulacion = async (id, status) => {
        const token = localStorage.getItem("jwt-token");
        try {
            const res = await fetch(`${API_BASE}/applications/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });

            if (!res.ok) throw new Error("Error actualizando estado");
            toast.success(`✅ Postulación ${status === "accepted" ? "aceptada" : "rechazada"}`);
            setPostulaciones((prev) => prev.filter(p => p.id !== id));
        } catch (error) {
            toast.error("❌ Error actualizando estado");
            console.error(error);
        }
    };

    const LoadingSkeleton = () => (
        <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-700 rounded-full"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-slate-700 rounded w-24"></div>
                            <div className="h-3 bg-slate-700 rounded w-32"></div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <div className="h-8 w-16 bg-slate-700 rounded"></div>
                        <div className="h-8 w-16 bg-slate-700 rounded"></div>
                    </div>
                </div>
            ))}
        </div>
    );

    const EmptyState = () => (
        <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m13-8l-4 4-4-4m0 0L9 9l4-4 4 4" />
                </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-200 mb-2">No hay postulaciones</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
                Cuando recibas nuevas postulaciones para tus proyectos, aparecerán aquí para que puedas revisarlas.
            </p>
        </div>
    );

    return (
        <Dialog
            open={open}
            handler={handleClose}
            size="md"
            className="bg-slate-900 border border-slate-700"
        >
            <DialogHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2L13 7h5l-4 3 1.5 5L10 12l-5.5 3L6 10 2 7h5l3-5z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Postulaciones Recibidas</h2>
                        <p className="text-sm text-blue-100/80">Revisa y gestiona las solicitudes para tus proyectos</p>
                    </div>
                </div>
            </DialogHeader>

            <DialogBody className="bg-slate-900 max-h-[60vh] overflow-y-auto">
                <div className="space-y-4">
                    {loading ? (
                        <LoadingSkeleton />
                    ) : postulaciones.length === 0 ? (
                        <EmptyState />
                    ) : (
                        postulaciones.map((post) => (
                            <div
                                key={post.id}
                                className="group relative bg-gradient-to-br from-slate-800 to-slate-800/50 p-4 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
                            >
                                {/* Efecto de brillo sutil */}
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                <div className="relative flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <Avatar
                                                size="md"
                                                src={post.user.avatar_url}
                                                alt="avatar"
                                                className="ring-2 ring-slate-700 group-hover:ring-blue-500/50 transition-all duration-300"
                                            />
                                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-800 animate-pulse"></div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <p className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                                                    {post.user.username}
                                                </p>
                                                <div className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                                                    Nuevo
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-300 leading-relaxed max-w-md">
                                                {post.message}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                </svg>
                                                <span>Hace 2 horas</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                                            onClick={() => responderPostulacion(post.id, "accepted")}
                                        >
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Aceptar
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-red-500/25 transition-all duration-300"
                                            onClick={() => responderPostulacion(post.id, "rejected")}
                                        >
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                            Rechazar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </DialogBody>

            <DialogFooter className="bg-slate-900 border-t border-slate-700 rounded-b-lg">
                <div className="flex items-center justify-between w-full">
                    <p className="text-sm text-slate-400">
                        {postulaciones.length} postulación{postulaciones.length !== 1 ? 'es' : ''} pendiente{postulaciones.length !== 1 ? 's' : ''}
                    </p>
                    <Button
                        variant="text"
                        className="text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-300"
                        onClick={handleClose}
                    >
                        Cerrar
                    </Button>
                </div>
            </DialogFooter>
        </Dialog>
    );
}