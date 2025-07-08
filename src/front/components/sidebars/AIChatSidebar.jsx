import React, { useState, useRef, useEffect } from "react";

const AIChatSidebar = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    } catch (err) {
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

  return (
    <div className="w-full h-full bg-[#1e1e2f] text-white p-2 flex flex-col">
      <h3 className="text-lg font-semibold mb-2">Chat IA</h3>
      <div className="flex-1 overflow-y-auto space-y-2 mb-2 px-1">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[75%] px-3 py-2 rounded-xl text-sm ${
              msg.sender === "user"
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
  );
};

export default AIChatSidebar;
