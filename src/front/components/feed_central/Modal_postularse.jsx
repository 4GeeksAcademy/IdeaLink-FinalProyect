import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
    Textarea,
    Typography,
} from "@material-tailwind/react";
import { useState } from "react";
import { UserCircle } from "lucide-react";
import { toast } from "react-toastify";
import "./Modal_postularse.css";

const API_BASE = import.meta.env.VITE_API_URL;

export default function Modal_postularse({ projectId }) {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");

    const handleOpen = () => setOpen((prev) => !prev);

    const handleSubmit = async () => {
        const token = localStorage.getItem("jwt-token");

        try {
            const res = await fetch(`${API_BASE}/applications`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    message,
                    project_id: projectId,
                }),
            });

            if (!res.ok) throw new Error("Error al enviar");

            toast.success("🎉 Postulación enviada");
            setMessage("");
            setOpen(false);
        } catch (err) {
            toast.error("❌ Error al postularse");
            console.error(err);
        }
    };

    return (
        <>
            <Button
                onClick={handleOpen}
                className="flex items-center rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-3 px-6 text-sm font-medium text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
            >
                Postularse
            </Button>

            <Dialog
                open={open}
                handler={handleOpen}
                size="md"
                className="postularse-modal-dialog relative z-[9999]"
                overlayProps={{
                    className: "backdrop-blur-md bg-black/40",
                }}
                animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 0.9, y: -100 },
                }}
            >
                <DialogHeader className="postularse-modal-header">
                    <div className="postularse-user-icon-container">
                        <UserCircle className="postularse-user-icon" />
                    </div>
                    <div>
                        <Typography variant="h5" className="postularse-modal-title">
                            ¿Quieres unirte al proyecto?
                        </Typography>
                        <Typography variant="small" className="postularse-modal-subtitle">
                            Cuéntale al creador por qué deberías formar parte.
                        </Typography>
                    </div>
                </DialogHeader>

                <DialogBody className="postularse-modal-body">
                    <div className="postularse-form-field">
                        <label htmlFor="postularse-descripcion" className="postularse-form-label">
                            ¿Qué puedes aportar?
                        </label>
                        <Textarea
                            id="postularse-descripcion"
                            autoFocus
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="postularse-form-textarea"
                            placeholder="Ej: Soy frontend con experiencia en React y me encantaría ayudar con la interfaz."
                        />
                    </div>
                </DialogBody>

                <DialogFooter className="postularse-modal-footer">
                    <div
                        style={{
                            backgroundColor: "rgb(126, 34, 206)",
                            color: "white",
                            borderRadius: "0.375rem",
                            padding: "0.5rem 1rem",
                            fontSize: "0.875rem",
                            fontWeight: "500",
                            cursor: "pointer",
                            userSelect: "none",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            minWidth: "120px",
                            zIndex: 10000,
                            position: "relative",
                        }}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSubmit();
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "rgb(147, 51, 234)";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "rgb(126, 34, 206)";
                        }}
                    >
                        Enviar postulación
                    </div>
                </DialogFooter>
            </Dialog>
        </>
    );
}
