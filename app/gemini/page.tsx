"use client";

import React, { useState } from "react";

const Chatbot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [userInput, setUserInput] = useState("");

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    setMessages([...messages, `You: ${userInput}`]);

    try {
      const response = await fetch("gemini/api/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: userInput }),
      });

      const data = await response.json();
      const botReply = data?.response || "Sorry, I couldn't understand that.";

      setMessages((prev) => [...prev, `Bot: ${botReply}`]);
    } catch (error) {
      console.error("Error communicating with Gemini API:", error);
      setMessages((prev) => [...prev, "Bot: An error occurred."]);
    }

    setUserInput("");
  };

  return (
    <div className="fixed bottom-4 right-4">
      {/* Chat Icon */}
      {!isChatOpen && (
        <button
          onClick={toggleChat}
          className="bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600"
        >
          💬
        </button>
      )}

      {/* Chat Window */}
      {isChatOpen && (
        <div className="bg-white w-80 h-96 border rounded-lg shadow-lg flex flex-col">
          <div className="bg-blue-500 text-white p-3 rounded-t-lg flex justify-between">
            <span>Chat with CharakDT</span>
            <button onClick={toggleChat} className="text-white font-bold">
              ✖
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`${
                  message.startsWith("You:")
                    ? "text-right text-blue-600"
                    : "text-left text-gray-800"
                }`}
              >
                {message}
              </div>
            ))}
          </div>

          <div className="p-3 border-t flex">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border rounded p-2"
            />
            <button
              onClick={sendMessage}
              className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
