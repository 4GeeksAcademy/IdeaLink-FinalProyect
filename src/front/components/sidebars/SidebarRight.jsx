import { useState, useEffect } from "react";
import { Avatar } from "@material-tailwind/react";
import Separator from "./Separator";
import ModalChat from "../Modal_chat";
import { getFriends } from "../../../api/routes/friendService";
import FriendRequests from "../FriendRequests";
import SendFriendRequestTest from "../SendFriendRequestTest";
import useGlobalReducer from "../../hooks/useGlobalReducer";

export default function SidebarRight() {
  const { store } = useGlobalReducer();
  const [friend, setFriend] = useState(null);
  const [open, setOpen] = useState(false);
  const [friends, setFriends] = useState([]);

  const token = localStorage.getItem("jwt-token");

  useEffect(() => {
    if (token) {
      getFriends(token)
        .then((res) => {
          if (Array.isArray(res)) setFriends(res);
          else setFriends([]);
        })
        .catch((err) => {
          console.error("Error fetching friends:", err);
          setFriends([]);
        });
    }
  }, [token]);

  const currentUser = store.user;

  return (
    <>
      <aside className="chat_sidebar w-full sm:w-[300px] bg-[#1e293b] p-2 text-white border border-gray-500 max-h-[360px] overflow-y-auto rounded-md hidden xl:block">
        <FriendRequests />

        <div className="space-y-4 text-sm mt-4">
          {friends.length === 0 && <p>No tienes amigos aún</p>}
          {friends.map((u, idx) => (
            <div key={u.id}>
              <Separator />
              <div
                className="flex items-center justify-between cursor-pointer hover:bg-blue-500/10 px-2 py-1.5 rounded-md"
                onClick={() => {
                  if (!currentUser?.token) {
                    alert("Debes iniciar sesión para chatear");
                    return;
                  }
                  setFriend(u);
                  setOpen(true);
                }}
              >
                <div className="flex items-center space-x-3">
                  <Avatar
                    className="rounded-full w-[50px]"
                    src={u.avatar_url || `https://getstream.io/random_png/?id=${u.id}`}
                    alt={u.username || u.name}
                  />
                  <p className={u.username === "Juan Pérez" ? "font-semibold" : ""}>
                    {u.username || u.name}
                  </p>
                </div>
                <span
                  className={`w-2 h-2 rounded-full ${idx === 0
                      ? "bg-green-400"
                      : idx === 1
                        ? "bg-yellow-400"
                        : "bg-gray-400"
                    }`}
                />
              </div>
            </div>
          ))}
        </div>
      </aside>

      <SendFriendRequestTest />

      {/* Renderiza solo si hay un amigo seleccionado */}
      {friend && (
        <ModalChat
          open={open}
          onClose={() => {
            setOpen(false);
            setFriend(null);
          }}
          currentUser={currentUser}
          friend={friend}
        />
      )}
    </>
  );
}
