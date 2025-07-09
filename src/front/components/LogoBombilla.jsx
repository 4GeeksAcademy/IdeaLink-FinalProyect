import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useSound from "use-sound";
import Bombilla from "../assets/img/Logo_dark.png";
import explosionSound from "../assets/img/sounds/explosion.mp3";

const particles = Array.from({ length: 8 });

export default function LogoBombilla() {
    const [hoverCount, setHoverCount] = useState(0);
    const [exploded, setExploded] = useState(false);
    const [playExplosion] = useSound(explosionSound);

    const handleHover = () => {
        if (exploded) return;

        const newCount = hoverCount + 1;
        setHoverCount(newCount);

        if (newCount >= 3) {
            playExplosion(); // 💥 Sonido
            setExploded(true);
            setTimeout(() => {
                setExploded(false);
                setHoverCount(0);
            }, 3000);
        }
    };

    return (
        <div
            className="relative h-[140px] w-[220px] cursor-pointer overflow-hidden"
            onMouseEnter={handleHover}
        >
            <AnimatePresence>
                {!exploded ? (
                    <motion.img
                        key="bombilla"
                        src={Bombilla}
                        alt="Logo"
                        className="w-full h-full object-contain"
                        initial={{ scale: 1 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0, opacity: 0, rotate: 90 }}
                        transition={{ duration: 0.5 }}
                    />
                ) : (
                    <>
                        {particles.map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-3 h-3 bg-yellow-300 rounded-full"
                                initial={{ top: "50%", left: "50%", opacity: 1, scale: 1 }}
                                animate={{
                                    top: `${Math.random() * 100}%`,
                                    left: `${Math.random() * 100}%`,
                                    opacity: 0,
                                    scale: 2,
                                }}
                                transition={{
                                    duration: 1.5,
                                    ease: "easeOut",
                                }}
                            />
                        ))}
                        <motion.div
                            key="explosion-text"
                            className="absolute inset-0 flex items-center justify-center text-yellow-300 font-bold text-md"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1.2 }}
                            exit={{ scale: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            💥 ¡IDEA EXPLOTADA!
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
