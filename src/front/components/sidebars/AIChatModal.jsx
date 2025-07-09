import React, { useState } from "react";
import { MessageCircle } from "lucide-react";
import AIChatSidebar from "./AIChatSidebar";

export default function AIChatModal() {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Botón flotante */}
            <button
                onClick={() => setOpen(true)}
                className="fixed bottom-4 right-4 z-50 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg"
                title="Abrir asistente IA"
            >
                <MessageCircle className="w-5 h-5" />
            </button>

            {/* Modal del chat */}
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
