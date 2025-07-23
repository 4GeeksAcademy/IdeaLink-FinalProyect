import {
    Dialog, DialogHeader, DialogBody, DialogFooter,
    Button, Input, Typography, Textarea
} from "@material-tailwind/react";
import { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import sdk from "@stackblitz/sdk";

const API_BASE = import.meta.env.VITE_API_URL;

export default function Modal1() {
    const [open, setOpen] = useState(false);
    const { store, dispatch } = useGlobalReducer();
    const [imagePreview, setImagePreview] = useState([]);

    const user = store.user;

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        hashtags: "",
        image_files: [],
        stackblitz_url: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async () => {
        if (!user || !user.id) {
            alert("Debes iniciar sesión para crear un proyecto.");
            return;
        }

        if (!formData.title || !formData.description) {
            alert("El título y la descripción son obligatorios.");
            return;
        }

        try {
            const projectData = {
                title: formData.title,
                description: formData.description,
                template: "javascript",
                files: {
                    "index.html": `<h1>${formData.title}</h1>`,
                    "index.js": `console.log('Hola desde IdeaLink');`,
                    "style.css": "body { font-family: sans-serif; background: #f4f4f4; }"
                }
            };

            sdk.openProject(projectData, {
                openFile: "index.js",
                view: "editor"
            });

            alert("Por favor, guarda el proyecto en StackBlitz y pega la URL en el campo correspondiente.");
        } catch (err) {
            console.error("Error al abrir StackBlitz:", err);
        }
    };

    const handleFinalSubmit = async () => {
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("title", formData.title);
            formDataToSend.append("description", formData.description);
            formDataToSend.append("hashtags", formData.hashtags);
            formDataToSend.append("stackblitz_url", formData.stackblitz_url);
            formData.image_files.forEach((file) => {
                formDataToSend.append("image_files", file);
            });


            const token = localStorage.getItem("jwt-token");

            const response = await fetch(`${API_BASE}/projects`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formDataToSend
            });

            if (!response.ok) throw new Error("Error al crear proyecto");

            const newProject = await response.json();
            dispatch({ type: "add_project", payload: newProject });

            setFormData({
                title: "",
                description: "",
                hashtags: "",
                image_file: null,
                stackblitz_url: ""
            });
            setImagePreview(null);
            setOpen(false);
        } catch (err) {
            console.error("Error al guardar proyecto:", err);
            alert("No se pudo guardar el proyecto.");
        }
    };

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                variant="filled"
                className="rounded-md bg-purple-700 mx-2 py-2 px-4 text-white text-sm shadow-sm shadow-white hover:bg-purple-500 hover:shadow-md cursor-pointer"
            >
                CREA TU IDEA
            </Button>
            {open && (
                <>
                    {open && <div className="fixed inset-0 z-40 backdrop-blur-md bg-black/40"></div>}
                    <Dialog
                        open={open}
                        handler={setOpen}
                        size="md"
                        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[800px] rounded-[1vw] bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-lg"
                    >

                        <DialogHeader className="flex justify-between items-center">
                            <Typography variant="h6">Crea tu idea</Typography>
                            <Button className="text-white cursor-pointer" variant="text" size="sm" onClick={() => setOpen(false)}>
                                ✕
                            </Button>
                        </DialogHeader>

                        <DialogBody className="space-y-4">
                            <Typography>Ingresa los datos de tu idea</Typography>

                            <div className="flex flex-wrap gap-4">
                                <div className="flex flex-col flex-1">
                                    <label htmlFor="title" className="text-sm font-semibold">Título</label>
                                    <Input
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="rounded-md"
                                        placeholder="Título aquí"
                                    />
                                </div>

                                <div className="flex flex-col flex-1">
                                    <label htmlFor="hashtags" className="text-sm font-semibold">Hashtags #</label>
                                    <Input
                                        id="hashtags"
                                        name="hashtags"
                                        value={formData.hashtags}
                                        onChange={handleChange}
                                        className="rounded-md"
                                        placeholder="IA, Developer, FullStack"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <label htmlFor="description" className="text-sm font-semibold">Descripción</label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="rounded-md"
                                    placeholder="Descripción aquí…"
                                />
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <label htmlFor="stackblitz_url" className="text-sm font-semibold">Pega aquí la URL final de StackBlitz</label>
                                <Input
                                    id="stackblitz_url"
                                    name="stackblitz_url"
                                    value={formData.stackblitz_url}
                                    onChange={handleChange}
                                    className="rounded-md"
                                    placeholder="https://stackblitz.com/edit/..."
                                />
                            </div>

                            <div className="flex flex-col space-y-2">
                                <label htmlFor="image_file" className="text-sm font-semibold">Subir imagen</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => {
                                        const files = Array.from(e.target.files);
                                        setFormData({ ...formData, image_files: files });

                                        // Mostrar previews
                                        const previews = files.map((file) => URL.createObjectURL(file));
                                        setImagePreview(previews);
                                    }}
                                    className="text-sm text-white file:bg-purple-600 file:text-white file:border-none file:px-3 file:py-1 file:rounded-md file:cursor-pointer"
                                />
                                {imagePreview.length > 0 && (
                                    <div className="flex gap-2 flex-wrap">
                                        {imagePreview.map((src, idx) => (
                                            <img
                                                key={idx}
                                                src={src}
                                                alt={`preview-${idx}`}
                                                className="w-32 h-32 object-cover rounded-lg border border-gray-400"
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </DialogBody>

                        <DialogFooter>
                            <Button
                                variant="outlined"
                                onClick={handleSubmit}
                                className="rounded-md border-gray-500 text-gray-500 mr-2 cursor-pointer"
                            >
                                Abrir StackBlitz
                            </Button>
                            <Button
                                variant="filled"
                                onClick={handleFinalSubmit}
                                className="rounded-md bg-purple-700 py-2 px-4 text-white text-sm shadow-sm hover:bg-purple-800 cursor-pointer"
                            >
                                Guardar Proyecto
                            </Button>
                        </DialogFooter>

                    </Dialog>
                </>
            )}
        </>
    );
}
