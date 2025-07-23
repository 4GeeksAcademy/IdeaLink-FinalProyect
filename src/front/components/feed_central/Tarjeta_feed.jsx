import './Feed_central.css';
import './Tarjeta.css';
import { Avatar } from "@material-tailwind/react";
import Modal_postularse from './Modal_postularse';
import { Card, CardHeader, CardBody, CardFooter, Typography } from "@material-tailwind/react";

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Navigation } from 'swiper/modules';

const API_BASE = import.meta.env.VITE_API_URL;

export default function Tarjeta({ project, userFavorites, setUserFavorites, onHashtagClick }) {
    const isFavorite = Array.isArray(userFavorites) && userFavorites.includes(project.id);

    const handleLike = async () => {
        const token = localStorage.getItem("jwt-token");

        const method = isFavorite ? "DELETE" : "POST";
        const response = await fetch(`${API_BASE}/favorites/${project.id}`, {
            method,
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) return;

        setUserFavorites(prev =>
            isFavorite
                ? prev.filter(id => id !== project.id)
                : [...prev, project.id]
        );
    };

    if (!project || !project.owner) return null;

    const images = Array.isArray(project.image_urls) && project.image_urls.length > 0
        ? project.image_urls
        : project.image_url
            ? [project.image_url]
            : [];

    return (
        <div className="tarjeta-container">
            <div className="tarjeta-aura"></div>

            <div className="tarjeta-particles">
                <div className="particle particle-1"></div>
                <div className="particle particle-2"></div>
                <div className="particle particle-3"></div>
            </div>

            <Card className="tarjeta-card">
                <div className="tarjeta-top-glow"></div>
                <div className="tarjeta-pattern"></div>

                <CardHeader floated={false} shadow={false} className="tarjeta-header">
                    <div className="tarjeta-user-info">
                        <div className="tarjeta-avatar-container">
                            <div className="tarjeta-avatar-aura"></div>
                            <Avatar
                                src={project?.owner?.avatar_url || "https://ui-avatars.com/api/?name=User"}
                                alt="avatar"
                                size="sm"
                                className="tarjeta-avatar"
                            />
                            <div className="tarjeta-status-indicator"></div>
                        </div>
                        <div>
                            <Typography variant="h6" className="tarjeta-username">
                                {project.owner?.username || "Anónimo"}
                            </Typography>
                        </div>
                    </div>
                    <div className="tarjeta-hashtags">
                        {project.hashtags?.map((tag, i) => (
                            <span
                                key={i}
                                className="tarjeta-hashtag"
                                style={{ animationDelay: `${i * 0.1}s`, cursor: 'pointer' }}
                                onClick={() => onHashtagClick?.(tag.trim())}
                            >
                                <div className="tarjeta-hashtag-shine"></div>
                                <span className="tarjeta-hashtag-text">#{tag.trim()}</span>
                            </span>
                        ))}
                    </div>
                </CardHeader>

                <CardBody className="tarjeta-body">
                    <p className="tarjeta-description">
                        {project.description}
                    </p>

                    {images.length > 0 && (
                        <Swiper
                            modules={[Navigation]}
                            navigation
                            spaceBetween={10}
                            slidesPerView={1}
                            className="tarjeta-swiper"
                        >
                            {images.map((img, index) => (
                                <SwiperSlide key={index}>
                                    <div className="tarjeta-image-container">
                                        <div className="tarjeta-image-frame"></div>
                                        <img
                                            src={`https://sample-service-name-alvt.onrender.com${img}`}
                                            alt={`imagen ${index + 1}`}
                                            className="tarjeta-image"
                                        />
                                        <div className="tarjeta-image-overlay"></div>
                                        <div className="tarjeta-image-particles">
                                            <div className="image-particle image-particle-1"></div>
                                            <div className="image-particle image-particle-2"></div>
                                            <div className="image-particle image-particle-3"></div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                </CardBody>

                <CardFooter className='tarjeta-footer'>
                    <div className="tarjeta-actions">
                        <div className="tarjeta-modal-container">
                            <Modal_postularse projectId={project.id} />
                        </div>
                        <button
                            className="tarjeta-action-btn tarjeta-like-btn"
                            onClick={handleLike}
                            aria-pressed={isFavorite}
                            aria-label={isFavorite ? "Quitar favorito" : "Agregar a favoritos"}
                        >
                            <svg
                                className="tarjeta-icon"
                                fill={isFavorite ? "currentColor" : "none"}
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}



