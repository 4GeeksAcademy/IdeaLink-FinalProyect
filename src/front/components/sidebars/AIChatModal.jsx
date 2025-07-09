import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, MessageCircle } from "lucide-react";
import "./AIChatModal.css";

const AIChatModal = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open) scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = { sender: "user", text: userInput };
    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });
      const data = await res.json();
      const botMessage = { sender: "bot", text: data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error al contactar con la IA." },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const clearChat = () => setMessages([]);

  const modalContent = (
    <div className="ai-chat-modal">
      <div className="ai-chat-modal__overlay" onClick={() => setOpen(false)}></div>

      <div className="ai-chat-modal__content">
        <button onClick={() => setOpen(false)} className="ai-chat-modal__close">
          <X className="w-4 h-4" />
        </button>

        <div className="p-4 flex flex-col h-full">
          <h3 className="text-lg font-semibold mb-2 text-white">Chat IA</h3>

          <div className="flex-1 overflow-y-auto space-y-2 mb-2 px-1">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${msg.sender === "user"
                  ? "bg-blue-600 self-end text-white"
                  : "bg-gray-700 self-start text-gray-100"
                  }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="text-sm italic text-gray-400">Escribiendo...</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 px-3 py-1 rounded-xl bg-[#2a2a3c] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              placeholder="Pregunta algo..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={sendMessage}
              className="px-3 py-1 bg-blue-600 rounded-xl hover:bg-blue-700 transition duration-200"
            >
              Enviar
            </button>
          </div>

          <button
            onClick={clearChat}
            className="mt-2 text-xs text-gray-400 hover:underline self-start"
          >
            Limpiar chat
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full  bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white px-4 py-2 rounded-md flex items-center gap-2 justify-center cursor-pointer"
      >
        <MessageCircle className="w-5 h-5" />
        Chat IA
      </button>


      {open && createPortal(modalContent, document.getElementById("modal-root"))}
    </>
  );
};

export default AIChatModal;

