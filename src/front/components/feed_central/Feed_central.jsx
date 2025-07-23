import Modal1 from '../Modal';
import './Feed_central.css';
import Tarjeta from './Tarjeta_feed';
import useGlobalReducer from '../../hooks/useGlobalReducer';
import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL;

const Feed_central = () => {
    const { store, dispatch } = useGlobalReducer();
    const [userFavorites, setUserFavorites] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [trendingHashtags, setTrendingHashtags] = useState([]);

    const fetchProjects = async () => {
        const token = localStorage.getItem("jwt-token");
        try {
            const res = await fetch(`${API_BASE}/projects`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!res.ok) {
                const errorText = await res.text();
                console.error("❌ Error en proyectos:", errorText);
                return;
            }
            const data = await res.json();
            dispatch({ type: 'set_projects', payload: data });
        } catch (err) {
            console.error("❌ Error de red al obtener ideas:", err);
        }
    };

    const fetchTrendingHashtags = async () => {
        try {
            const res = await fetch(`${API_BASE}/trending-hashtags`);
            if (!res.ok) {
                console.error("Error al obtener hashtags trending");
                return;
            }
            const data = await res.json();
            setTrendingHashtags(data);
        } catch (err) {
            console.error("Error de red al obtener hashtags trending:", err);
        }
    };

    const fetchFavorites = async () => {
        const token = localStorage.getItem("jwt-token");
        try {
            const res = await fetch(`${API_BASE}/my-favorites`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const text = await res.text();
            const data = JSON.parse(text);
            setUserFavorites(data.map(fav => fav.id));
        } catch (err) {
            console.error("❌ Error de red al obtener favoritos:", err);
        }
    };

    const [activeHashtag, setActiveHashtag] = useState(null);

    const handleHashtagClick = (tag) => {
        setSearchTerm(tag); // actualiza el campo de búsqueda también
        setActiveHashtag(tag);
    };


    useEffect(() => {
        fetchProjects();
        fetchFavorites();
        fetchTrendingHashtags();
    }, []);

    const filteredProjects = store.projects?.filter(project => {
        const term = searchTerm.toLowerCase();
        return (
            project.name?.toLowerCase().includes(term) ||
            project.description?.toLowerCase().includes(term) ||
            project.hashtags?.some(tag => tag.toLowerCase().includes(term))
        );
    }) || [];

    return (
        <>
            <div className="w-full flex justify-center mt-2">
                <div className="w-full flex flex-col items-center gap-4 px-4 max-w-4xl">
                    {/* Buscador */}
                    <div className="relative w-full max-w-2xl group">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl blur-xl opacity-75 group-hover:opacity-100 transition-all duration-500"></div>
                        <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-1 shadow-2xl">
                            <input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-transparent placeholder:text-white/60 text-white text-base border-none rounded-xl pl-6 pr-28 py-4 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-white/5"
                                placeholder="Buscar UI Kits, Dashboards, Proyectos..."
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute top-1/2 right-36 transform -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all duration-200 cursor-pointer"
                                    type="button"
                                    aria-label="Limpiar búsqueda"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}

                            <button
                                className="absolute top-2 right-2 flex items-center rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-3 px-6 text-sm font-medium text-white shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
                                type="button"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
                                </svg>
                                Buscar
                            </button>
                        </div>
                    </div>

                    {/* Trending Hashtags */}
                    <div className="flex flex-wrap justify-center gap-2">
                        <span className="text-white font-semibold text-lg mr-4">🔥 Trending</span>
                        <div className="flex flex-wrap gap-2">
                            {trendingHashtags.length > 0 ? (
                                trendingHashtags.map((tag, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSearchTerm(tag)}
                                        className="relative inline-flex items-center justify-center rounded-full border border-purple-500 bg-gradient-to-br from-slate-800 to-slate-900 text-sm text-white font-medium px-4 py-2 shadow-md hover:scale-105 hover:from-purple-700 hover:to-purple-800 hover:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 cursor-pointer"
                                    >
                                        <span className="z-10">#{tag}</span>
                                        <span className="absolute inset-0 rounded-full bg-purple-500 opacity-10 blur-sm"></span>
                                    </button>
                                ))
                            ) : (
                                <p className="text-white">Cargando hashtags...</p>
                            )}
                        </div>

                        <Modal1 />
                    </div>
                </div>
            </div>

            {/* Lista de proyectos */}
            <div className="mt-6 px-4 flex justify-center">
                <div className="w-full max-w-4xl  2xl:h-[78vh]  overflow-y-auto space-y-4 pr-2 ocultar-scroll ps-15 pt-4">
                    {filteredProjects.length > 0 ? (
                        filteredProjects.map((project) => (
                            <Tarjeta
                                key={project.id}
                                project={project}
                                setUserFavorites={setUserFavorites}
                                userFavorites={userFavorites}
                                onHashtagClick={handleHashtagClick}
                            />
                        ))
                    ) : (
                        <p className="text-white text-center">No se encontraron proyectos que coincidan.</p>
                    )}
                </div>
            </div>

        </>
    );
};

export default Feed_central;
