import { useEffect, useState } from "react";
import {
    Chat,
    Channel,
    Window,
    ChannelHeader,
    MessageList,
    MessageInput,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import "stream-chat-react/dist/css/v2/index.css";

const apiKey = "2pks7t76xeqd";
const client = StreamChat.getInstance(apiKey); // singleton global

export default function ChatApp({ currentUser, friend }) {
    const [ready, setReady] = useState(false);
    const [channel, setChannel] = useState(null);

    /* 1. Conectar usuario actual --------------------------------- */
    useEffect(() => {
        let cancelled = false;

        async function connectUser() {
            try {
                if (client.userID) return; // ya conectado

                if (!currentUser?.token) {
                    console.error("No token en currentUser");
                    return;
                }

                const token = await getStreamToken(currentUser, friend); // ← enviamos friend

                await client.connectUser(
                    {
                        id: String(currentUser.id),
                        name: currentUser.name || currentUser.email,
                        image: `https://getstream.io/random_png/?id=${currentUser.id}`,
                    },
                    token
                );

                if (!cancelled) setReady(true);
            } catch (err) {
                console.error("Error al conectar usuario a Stream:", err);
            }
        }

        connectUser();
        return () => {
            cancelled = true;
            client.disconnectUser();
        };
    }, [currentUser, friend]);

    /* 2. Crear / abrir canal DM ---------------------------------- */
    useEffect(() => {
        if (!ready || !friend) return;

        const createOrOpenChannel = async () => {
            const members = [String(currentUser.id), String(friend.id)].sort();
            const channelId = members.join("--");

            const ch = client.channel("messaging", channelId, {
                name: friend.name,
                members,
            });

            await ch.watch();
            setChannel(ch);
        };

        createOrOpenChannel();
    }, [ready, friend, currentUser]);

    if (!ready || !channel) return <p className="text-center text-white p-4">Cargando chat…</p>;

    /* 3. UI ------------------------------------------------------ */
    return (
        <div className="rounded-2xl overflow-hidden border border-gray-700 h-[460px]">
            <Chat client={client} theme="str-chat__theme-dark">
                <Channel channel={channel}>
                    <Window>
                        <ChannelHeader />
                        <MessageList />
                        <MessageInput />
                    </Window>
                </Channel>
            </Chat>
        </div>
    );
}

/* Petición al backend para token + alta de usuarios ------------- */
async function getStreamToken(user, friend) {
    const res = await fetch("http://127.0.0.1:5000/api/stream-token", {
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
            friends: [
                {
                    id: friend.id,
                    name: friend.name || friend.email,
                    image: `https://getstream.io/random_png/?id=${friend.id}`,
                }
            ]
        }),
    });

    if (!res.ok) throw new Error("Backend devolvió " + res.status);
    const { token } = await res.json();
    return token;
}

