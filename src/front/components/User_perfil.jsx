import { useEffect, useState, useCallback, useMemo } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import Tarjeta from "./feed_central/Tarjeta_feed";
import AddFriendButton from "./AddFriendButton";

const API_BASE = import.meta.env.VITE_API_URL;

const User_perfil = () => {
    const { store, dispatch } = useGlobalReducer();
    const user = store.user;

    const [userProjects, setUserProjects] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [activeTab, setActiveTab] = useState("projects");
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [favoriteIds, setFavoriteIds] = useState([]);

    const [formData, setFormData] = useState({
        username: user?.username || "",
        role: user?.role || "",
        location: user?.location || "",
        bio: user?.bio || "",
        avatar_url: user?.avatar_url || "",
        banner_url: user?.banner_url || "",
    });

    const fetchUserProjects = useCallback(async () => {
        const token = localStorage.getItem("jwt-token");
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${API_BASE}/my-projects`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

            const data = await res.json();
            setUserProjects(data);
        } catch (error) {
            console.error("❌ Error al cargar proyectos del usuario:", error);
            setError("Error al cargar los proyectos");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchFavorites = useCallback(async () => {
        const token = localStorage.getItem("jwt-token");
        try {
            const res = await fetch(`${API_BASE}/my-favorites`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!res.ok) throw new Error("Error al cargar favoritos");

            const data = await res.json();
            setFavorites(data);
            setFavoriteIds(data.map(p => p.id));
        } catch (err) {
            console.error("❌ Error al cargar favoritos:", err);
            setFavorites([]);
        }
    }, []);

    useEffect(() => {
        fetchUserProjects();
        fetchFavorites();
    }, [fetchUserProjects, fetchFavorites]);

    const handleInputChange = useCallback((field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleFileUpload = useCallback((file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, avatar_url: reader.result }));
        };
        reader.readAsDataURL(file);
    }, []);

    const handleBannerUpload = useCallback((file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, banner_url: reader.result }));
        };
        reader.readAsDataURL(file);
    }, []);

    const handleSaveProfile = useCallback(async () => {
        const token = localStorage.getItem("jwt-token");
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${API_BASE}/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const updatedUser = await res.json();
            if (res.ok) {
                dispatch({ type: "set_user", payload: updatedUser });
                setEditMode(false);
            } else {
                setError("Error al guardar perfil");
            }
        } catch (err) {
            console.error("❌ Error al guardar perfil:", err);
            setError("Error al guardar perfil");
        } finally {
            setLoading(false);
        }
    }, [formData, dispatch]);

    const handleCancelEdit = useCallback(() => {
        setEditMode(false);
        setError(null);
        setFormData({
            username: user?.username || "",
            role: user?.role || "",
            location: user?.location || "",
            bio: user?.bio || "",
            avatar_url: user?.avatar_url || "",
            banner_url: user?.banner_url || "",
        });
    }, [user]);

    const isFormValid = useMemo(() => formData.username.trim().length > 0, [formData.username]);

    return (
        <>
            <div className="flex flex-col items-center bg-[#1e293b] text-white p-6 rounded-2xl w-full max-w-4xl mx-auto">
                <div className="w-full bg-gradient-to-r from-pink-500 to-purple-500 h-39 rounded-t-2xl relative">
                    {/* Banner de fondo si existe */}
                    {formData.banner_url && (
                        <img
                            src={formData.banner_url}
                            alt="Banner"
                            className="w-full h-full object-cover rounded-t-2xl absolute inset-0"
                        />
                    )}

                    <button
                        onClick={() => setEditMode(true)}
                        disabled={loading}
                        className="absolute top-4 right-4 bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700 transition disabled:opacity-50 cursor-pointer"
                    >
                        Editar perfil
                    </button>

                    <img
                        src={user?.avatar_url || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user?.username || "User")}
                        alt={user?.username || "avatar"}
                        className="w-35 h-35 rounded-full border-4 border-white absolute -bottom-12 left-1/2 transform -translate-x-1/2 object-cover"
                    />
                </div>

                <div className="grid justify-center mt-16 px-6 w-full">
                    <h2 className="flex justify-center text-3xl font-bold">{user?.username || "Usuario"}</h2>

                    {user && user.id !== store.user.id && (
                        <div className="flex justify-center mt-2">
                            <AddFriendButton receiverId={user.id} />
                        </div>
                    )}

                    <p className="flex justify-center text-sm text-gray-400">{user?.role}</p>
                    <p className="flex justify-center mt-2 text-sm">
                        {user?.bio || "Escribe algo sobre ti..."}
                    </p>

                    <div className="flex justify-center gap-6 mt-4 text-sm text-gray-400">
                        <span>{user?.email}</span>
                        <span>{user?.location || "Ubicación no definida"}</span>
                    </div>
                </div>
            </div>

            {editMode && (
                <div className="bg-gray-800 text-white p-6 rounded-2xl mt-6 w-full max-w-4xl mx-auto space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold">Editar Perfil</h3>
                        <button
                            onClick={handleCancelEdit}
                            className="text-gray-400 hover:text-white text-xl cursor-pointer"
                            aria-label="Cerrar"
                        >
                            ✕
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-900 border border-red-600 text-red-200 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Username */}
                        <div>
                            <label className="text-sm text-gray-300 mb-1 block">Username</label>
                            <input
                                type="text"
                                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                                value={formData.username}
                                onChange={(e) => handleInputChange('username', e.target.value)}
                            />
                        </div>

                        {/* Role */}
                        <div>
                            <label className="text-sm text-gray-300 mb-1 block">Rol</label>
                            <input
                                type="text"
                                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                                value={formData.role}
                                onChange={(e) => handleInputChange('role', e.target.value)}
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <label className="text-sm text-gray-300 mb-1 block">Ubicación</label>
                            <input
                                type="text"
                                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                                value={formData.location}
                                onChange={(e) => handleInputChange('location', e.target.value)}
                            />
                        </div>



                        {/* Bio */}
                        <div className="md:col-span-2">
                            <label className="text-sm text-gray-300 mb-1 block">Bio</label>
                            <textarea
                                className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                                rows={3}
                                value={formData.bio}
                                onChange={(e) => handleInputChange('bio', e.target.value)}
                                maxLength={300}
                            />
                            <div className="text-right text-xs text-gray-400 mt-1">
                                {formData.bio.length}/300
                            </div>
                        </div>

                        {/* Banner URL con preview */}
                        <div className="md:col-span-2">
                            <label className="text-sm text-gray-300 mb-1 block">Banner</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleBannerUpload(e.target.files[0])}
                                className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700 mb-2 "
                            />
                            {formData.banner_url && (
                                <div className="relative">
                                    <img
                                        src={formData.banner_url}
                                        alt="Banner preview"
                                        className="w-full h-32 object-cover rounded-md border border-purple-500"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                    <button
                                        onClick={() => handleInputChange('banner_url', '')}
                                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700 cursor-pointer"
                                        type="button"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Avatar upload mejorado */}
                        <div className="md:col-span-2 flex flex-col md:flex-row items-center gap-4">
                            <div>
                                <label className="text-sm text-gray-300 mb-1 block">Avatar</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileUpload(e.target.files[0])}
                                    className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                                />
                            </div>
                            {formData.avatar_url && (
                                <div className="relative inline-block w-24 h-24 mt-4 md:mt-0">
                                    <img
                                        src={formData.avatar_url}
                                        alt="Avatar preview"
                                        className="w-24 h-24 object-cover rounded-full border border-purple-500"
                                    />
                                    <button
                                        onClick={() => handleInputChange('avatar_url', '')}
                                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700 cursor-pointer shadow-lg"
                                        type="button"
                                        title="Eliminar avatar"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}

                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t border-gray-700">
                        <button
                            onClick={handleCancelEdit}
                            disabled={loading}
                            className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition disabled:opacity-50 cursor-pointer"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleSaveProfile}
                            disabled={loading || !isFormValid}
                            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded text-white hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                    </div>
                </div>
            )}


            <div className="flex gap-6 mt-6 border-b border-gray-700 w-full px-6">
                <button
                    className={`pb-2 ${activeTab === "projects" ? "border-b-2 border-white text-white" : "text-gray-400 hover:text-white"}, cursor-pointer`}
                    onClick={() => setActiveTab("projects")}
                >
                    Mis Ideas
                </button>
                <button
                    className={`pb-2 cursor-pointer ${activeTab === "favorites"
                            ? "border-b-2 border-white text-white"
                            : "text-gray-400 hover:text-white"
                        }`}
                    onClick={() => setActiveTab("favorites")}
                >
                    Favoritos
                </button>
            </div>

            <div className="mt-8 space-y-4 px-4 flex flex-col items-center">
                {loading && userProjects.length === 0 ? (
                    <div className="text-white">Cargando proyectos...</div>
                ) : error && userProjects.length === 0 ? (
                    <div className="text-center">
                        <p className="text-red-400 mb-4">{error}</p>
                        <button
                            onClick={fetchUserProjects}
                            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
                        >
                            Reintentar
                        </button>
                    </div>
                ) : activeTab === "projects" ? (
                    userProjects.length === 0 ? (
                        <p className="text-white">Aún no tienes proyectos publicados.</p>
                    ) : (
                        userProjects.map((project) => (
                            <Tarjeta
                                key={project.id}
                                project={project}
                                userFavorites={favoriteIds}
                                setUserFavorites={setFavoriteIds}
                            />

                        ))

                    )
                ) : (
                    favorites.length === 0 ? (
                        <p className="text-white">No tienes proyectos marcados como favoritos.</p>
                    ) : (
                        favorites.map((project) => (
                            <Tarjeta
                                key={project.id}
                                project={project}
                                userFavorites={favoriteIds}
                                setUserFavorites={setFavoriteIds}
                            />

                        ))

                    )
                )}
            </div>
        </>
    );
};

export default User_perfil;