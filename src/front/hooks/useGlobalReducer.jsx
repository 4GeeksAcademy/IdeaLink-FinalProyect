import { useContext, useReducer, createContext, useEffect, useState, useRef } from "react";
import storeReducer, { initialStore } from "../store";
import { StreamChat } from "stream-chat";
const API_BASE = import.meta.env.VITE_API_URL;
const StoreContext = createContext();
const apiKey = "2pks7t76xeqd";
const client = StreamChat.getInstance(apiKey);

export function StoreProvider({ children }) {
    const [store, dispatch] = useReducer(storeReducer, initialStore());
    const [ready, setReady] = useState(false);
    const connectingRef = useRef(false);  // <-- Flag para controlar conexión en progreso

    useEffect(() => {
        const userString = localStorage.getItem("user-profile");
        if (userString) {
            const user = JSON.parse(userString);
            dispatch({ type: "set_user", payload: user });
        }
    }, []);

    useEffect(() => {
        if (!store.user || !store.user.token) return;
        if (client.userID) {
            setReady(true);
            return;
        }

        if (connectingRef.current) return; // Ya estamos intentando conectar

        connectingRef.current = true;

        async function connectUser() {
            try {
                const token = await getStreamToken(store.user);

                await client.connectUser(
                    {
                        id: String(store.user.id),
                        name: store.user.name || store.user.email,
                        image: `https://getstream.io/random_png/?id=${store.user.id}`,
                    },
                    token
                );

                setReady(true);
            } catch (error) {
                console.error("Error conectando usuario Stream en StoreProvider:", error);
            } finally {
                connectingRef.current = false;
            }
        }

        connectUser();

        // No desconectamos para mantener sesión activa
    }, [store.user]);

    // Agregado: pedir permiso y escuchar mensajes nuevos globalmente para notificaciones
    useEffect(() => {
        if (!ready) return;

        if ("Notification" in window && Notification.permission !== "granted") {
            Notification.requestPermission();
        }

        const handleNewMessage = (event) => {
            const message = event.message;
            if (String(message.user.id) === String(store.user.id)) {
                // Mensaje propio, no notifico
                return;
            }

            if (Notification.permission === "granted") {
                new Notification(message.user.name || message.user.id, {
                    body: message.text,
                });
            }
        };

        client.on("message.new", handleNewMessage);

        return () => {
            client.off("message.new", handleNewMessage);
        };
    }, [ready, store.user]);

    return (
        <StoreContext.Provider value={{ store, dispatch, client, ready }}>
            {children}
        </StoreContext.Provider>
    );
}

export default function useGlobalReducer() {
    const context = useContext(StoreContext);
    if (!context) throw new Error("useGlobalReducer debe usarse dentro de StoreProvider");
    return context;
}

async function getStreamToken(user) {
    const res = await fetch(`${API_BASE}/stream-token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
            me: {
                name: user.name || user.email,
                image: `https://getstream.io/random_png/?id=${user.id}`,
            },
            friends: [],
        }),
    });

    if (!res.ok) throw new Error("Backend devolvió " + res.status);
    const { token } = await res.json();
    return token;
}
