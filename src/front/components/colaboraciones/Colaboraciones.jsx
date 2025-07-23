import React, { useEffect, useState } from "react";
import {
    Users,
    MailPlus,
    Handshake,
    Code,
    ExternalLink,
    GitBranch,
    Search,
    Filter,
    Loader2,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Crown,
    UserCheck
} from "lucide-react";
import "./Colaboraciones.css";
import ProyectoEmbed from "../StackblitzEmbed";
import SolicitudesButton from "./SolicitudesButton";
const API_BASE = import.meta.env.VITE_API_URL;

export default function Collaborations() {
    const [collabs, setCollabs] = useState([]);
    const [filteredCollabs, setFilteredCollabs] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isMinimized, setIsMinimized] = useState(false);

    const itemsPerPage = 4;
    const totalSlides = Math.ceil(filteredCollabs.length / itemsPerPage);
    useEffect(() => {
        const token = localStorage.getItem("jwt-token");

        fetch(`${API_BASE}/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((res) => res.json())
            .then((data) => console.log("🧠 Usuario autenticado:", data));
    }, []);

    useEffect(() => {
        const fetchCollaborations = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("jwt-token");
                const res = await fetch(`${API_BASE}/my-collaborations`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (!res.ok) throw new Error("Error al cargar colaboraciones");

                const data = await res.json();
                console.log("✅ Datos de colaboraciones:", JSON.stringify(data, null, 2));
                setCollabs(data);
                setFilteredCollabs(data);
                setError(null);
            } catch (error) {
                console.error(error);
                setError("Error al cargar las colaboraciones. Inténtalo de nuevo.");
            } finally {
                setLoading(false);
            }
        };

        fetchCollaborations();
    }, []);

    useEffect(() => {
        let filtered = collabs;

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(collab =>
                collab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                collab.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filter by type
        if (filterType === "own") {
            filtered = filtered.filter(collab => collab.is_owner);
        } else if (filterType === "collaborator") {
            filtered = filtered.filter(collab => !collab.is_owner);
        }

        setFilteredCollabs(filtered);
        setCurrentSlide(0); // Reset slide when filtering
    }, [collabs, searchQuery, filterType]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    const getCurrentItems = () => {
        const startIndex = currentSlide * itemsPerPage;
        return filteredCollabs.slice(startIndex, startIndex + itemsPerPage);
    };

    if (loading) {
        return (
            <div className="collab-container">
                <div className="collab-loading-wrapper">
                    <div className="collab-loading-content">
                        <Loader2 className="collab-loading-spinner" />
                        <p className="collab-loading-text">Cargando colaboraciones...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="collab-container">
                <div className="collab-error-wrapper">
                    <div className="collab-error-content">
                        <AlertCircle className="collab-error-icon" />
                        <h3 className="collab-error-title">Error al cargar</h3>
                        <p className="collab-error-message">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="collab-error-button"
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="collab-container">
            <div className="collab-content">
                {/* Header Hero */}
                <div className="collab-header">
                    <div className="collab-header-icon">
                        <div className="collab-icon-container">
                            <Users className="collab-users-icon" />
                        </div>
                        <h1 className="collab-title">
                            Colaboraciones
                        </h1>
                    </div>
                    <p className="collab-subtitle">
                        Gestiona tus proyectos colaborativos y accede a entornos de desarrollo compartidos
                    </p>
                </div>

                {/* Search and Filter Bar */}
                <div className="collab-search-section">
                    <div className="collab-search-wrapper">
                        <div className="collab-search-input-wrapper">
                            <Search className="collab-search-icon" />
                            <input
                                type="text"
                                placeholder="Buscar colaboraciones..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="collab-search-input"
                            />
                        </div>

                        <div className="collab-filters-wrapper">
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="collab-filter-select"
                            >
                                <option value="all">Todos los proyectos</option>
                                <option value="own">Mis proyectos</option>
                                <option value="collaborator" >Colaboraciones</option>
                            </select>

                            <SolicitudesButton />
                        </div>
                    </div>
                </div>

                {/* Proyectos de colaboración en carrusel */}
                <section className="collab-projects-section">
                    <div className="collab-section-header">
                        <div className="collab-section-icon">
                            <GitBranch className="collab-git-icon" />
                        </div>
                        <h2 className="collab-section-title">
                            Mis Proyectos ({filteredCollabs.length})
                        </h2>
                        <div className="collab-section-line"></div>
                    </div>

                    {filteredCollabs.length > 0 ? (
                        <div className="collab-carousel-wrapper">
                            {/* Carousel Navigation */}
                            {totalSlides > 1 && (
                                <>
                                    <button
                                        onClick={prevSlide}
                                        className="collab-nav-button collab-nav-prev"
                                    >
                                        <ChevronLeft className="collab-nav-icon" />
                                    </button>
                                    <button
                                        onClick={nextSlide}
                                        className="collab-nav-button collab-nav-next"
                                    >
                                        <ChevronRight className="collab-nav-icon" />
                                    </button>
                                </>
                            )}

                            {/* Carousel Content */}
                            <div className="collab-projects-grid">
                                {getCurrentItems().map((project, index) => (
                                    <div
                                        key={project.id}
                                        onClick={() => setSelectedProject(project)}
                                        className={`collab-project-card ${project.is_owner ? 'collab-project-owner' : 'collab-project-collaborator'}`}
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <div className="collab-card-content">
                                            <div className="collab-card-header">
                                                <div className="collab-card-info">
                                                    <div className="collab-card-icon">
                                                        {project.is_owner ? (
                                                            <Crown className="collab-crown-icon" />
                                                        ) : (
                                                            <UserCheck className="collab-user-icon" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="collab-card-title-wrapper">
                                                            <h3 className="collab-card-title">
                                                                {project.title}
                                                            </h3>
                                                            <span className={`collab-card-badge ${project.is_owner ? 'collab-badge-owner' : 'collab-badge-collaborator'}`}>
                                                                {project.is_owner ? 'Propietario' : 'Colaborador'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {project.stackblitz_url && (
                                                    <div className="collab-card-status">
                                                        <Code className="collab-code-icon" />
                                                    </div>
                                                )}
                                            </div>

                                            <p className="collab-card-description">
                                                {project.description}
                                            </p>

                                            <div className="collab-card-footer">
                                                <div className="collab-card-indicator">
                                                    <div className={`collab-status-dot ${project.stackblitz_url ? 'collab-dot-active' : 'collab-dot-inactive'}`}></div>
                                                    <span className="collab-status-text">
                                                        {project.stackblitz_url ? "Entorno activo" : "Sin entorno"}
                                                    </span>
                                                </div>
                                                <ExternalLink className="collab-card-link" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Carousel Indicators */}
                            {totalSlides > 1 && (
                                <div className="collab-indicators-wrapper">
                                    {Array.from({ length: totalSlides }).map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentSlide(index)}
                                            className={`collab-indicator ${index === currentSlide ? 'collab-indicator-active' : 'collab-indicator-inactive'}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="collab-empty-state">
                            <div className="collab-empty-icon">
                                <div className="collab-empty-icon-container">
                                    <Users className="collab-empty-users-icon" />
                                </div>
                            </div>
                            <h3 className="collab-empty-title">
                                {searchQuery || filterType !== "all"
                                    ? "No se encontraron proyectos"
                                    : "No tienes colaboraciones activas"
                                }
                            </h3>
                            <p className="collab-empty-description">
                                {searchQuery || filterType !== "all"
                                    ? "Intenta ajustar los filtros de búsqueda para encontrar lo que necesitas."
                                    : "Cuando participes en proyectos colaborativos, aparecerán aquí para que puedas acceder a ellos fácilmente."
                                }
                            </p>
                            {(searchQuery || filterType !== "all") && (
                                <button
                                    onClick={() => {
                                        setSearchQuery("");
                                        setFilterType("all");
                                    }}
                                    className="collab-clear-filters-button"
                                >
                                    Limpiar filtros
                                </button>
                            )}
                        </div>
                    )}
                </section>

                {/* Editor de código - Original */}
                {selectedProject?.stackblitz_url && (
                    <section className="collab-editor-section">
                        <div className="collab-editor-header">
                            <div className="collab-editor-icon">
                                <Code className="collab-editor-code-icon" />
                            </div>
                            <h2 className="collab-editor-title">Editor de código</h2>
                            <div className="collab-editor-line"></div>
                            <button
                                onClick={() => setSelectedProject(null)}
                                className="collab-editor-close"
                            >
                                <span>Cerrar</span>
                            </button>
                        </div>

                        <div className="collab-editor-container">
                            <div className="collab-editor-wrapper">
                                <div className="collab-editor-toolbar">
                                    <div className="collab-editor-dots">
                                        {/* 🔴 Cerrar */}
                                        <div
                                            className="collab-editor-dot collab-dot-red"
                                            title="Cerrar"
                                            onClick={() => setSelectedProject(null)}
                                        ></div>

                                        {/* 🟡 Minimizar/Restaurar */}
                                        <div
                                            className="collab-editor-dot collab-dot-yellow"
                                            title={isMinimized ? "Restaurar" : "Minimizar"}
                                            onClick={() => setIsMinimized(prev => !prev)}
                                        ></div>

                                        {/* 🟢 Abrir en nueva pestaña */}
                                        <div
                                            className="collab-editor-dot collab-dot-green"
                                            title="Abrir en StackBlitz"
                                            onClick={() => window.open(selectedProject.stackblitz_url, "_blank")}
                                        ></div>
                                    </div>

                                    <span className="collab-editor-name">{selectedProject.title}</span>

                                    <a
                                        href={selectedProject.stackblitz_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="collab-editor-external"
                                    >
                                        <ExternalLink className="collab-external-icon" />
                                        Abrir en nueva pestaña
                                    </a>
                                </div>

                                {!isMinimized && (
                                    <ProyectoEmbed
                                        className="collab-embed"
                                        stackblitzUrl={selectedProject.stackblitz_url}
                                        title={selectedProject.title}
                                    />
                                )}
                            </div>
                        </div>
                    </section>
                )}

            </div>
        </div>
    );
}