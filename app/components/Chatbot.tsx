"use client";

import React, { useState, useEffect, useRef } from "react";
import chatIcon from "@/public/chat.png";
import Image from "next/image";

const Chatbot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [userInput, setUserInput] = useState("");
  const [initialMessage, setInitialMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [minimize, setMinimize] = useState(false);
  const [maximize, setMaximize] = useState(false);

  const [chatbotSize, setChatbotSize] = useState({ width: 320, height: 400 });

  const initializationPrompt =
    "You are our chatbot integrated into our CharakDT website. Introduce yourself as CharakBot in a very small and friendly manner (use friendly emoji in intro), here to assist with any queries about CharakDT. CharakDT is a unified interface that links all healthcare advances and participants in the nation. It facilitates patient-centric healthcare delivery through efficiency and cost savings. Please note: you must answer only CharakDT-related queries. Stay quiet otherwise.";

  const secondPrompt = "you are CharakBot";

  const latestMessageRef = useRef<HTMLDivElement>(null);

  const scrollToLatestMessage = () => {
    if (latestMessageRef.current) {
      latestMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start", // Focus on the top of the latest message
      });
    }
  };

  useEffect(() => {
    const initializeChatbot = async () => {
      try {
        setInitialMessage(true);
        const response = await fetch("/api/gemini/request", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: initializationPrompt }),
        });

        if (!response.ok) {
          throw new Error("Failed to initialize chatbot.");
        }

        const data = await response.json();
        const botReply = data?.response || "Chatbot initialization failed.";

        setMessages((prev) => [...prev, `CharakBot: ${botReply}`]);
      } catch (error) {
        console.error("Chatbot initialization error:", error);
        setMessages((prev) => [
          ...prev,
          "Bot: Failed to initialize the chatbot.",
        ]);
      }
    };

    initializeChatbot();
  }, []);

  useEffect(() => {
    scrollToLatestMessage(); // Scroll to the latest message on updates
  }, [messages]);

  const sendMessage = async () => {
    setInitialMessage(false);
    if (initialMessage) {
      console.log("initial message");
    }
    setLoading(true);
    if (!userInput.trim()) return;

    setMessages((prev) => [...prev, `You: ${userInput}`]);

    try {
      const fullPrompt = `${secondPrompt}\n\n${messages
        .join("\n")
        .replace(/You:/g, "User:")}\nUser: ${userInput}`;

      const response = await fetch("/api/gemini/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: fullPrompt }),
      });

      if (!response.ok) {
        setLoading(false);
        throw new Error("Failed to fetch chatbot response.");
      }

      setLoading(false);
      const data = await response.json();
      const botReply = data?.response || "Sorry, I couldn't understand that.";

      setMessages((prev) => [...prev, ` ${botReply}`]);
    } catch (error) {
      setLoading(false);
      console.error("Error communicating with chatbot:", error);
      setMessages((prev) => [...prev, "Bot: An error occurred."]);
    }

    setUserInput("");
  };

  const toggleChat = () => setIsChatOpen((prev) => !prev);

  const handleResize = (widthChange: number, heightChange: number) => {
    setChatbotSize((prev) => ({
      width: Math.max(320, prev.width + widthChange),
      height: Math.max(400, prev.height + heightChange),
    }));
  };

  return (
    <div className="fixed bottom-4 right-4">
      {!isChatOpen && (
        <button onClick={toggleChat} aria-label="Open chat">
          <Image src={chatIcon} alt="Open chat" className="w-10 bounce" />
        </button>
      )}

      {isChatOpen && (
        <div
          className="bg-white border rounded-lg shadow-lg flex flex-col"
          style={{
            width: `${chatbotSize.width}px`,
            height: `${chatbotSize.height}px`,
          }}
        >
          <div className="bg-blue-500 text-white p-3 rounded-t-lg flex items-center">
            <p>Chat with</p>
            <p className="font-bold ml-1">CharakBot</p>
            <button
              onClick={toggleChat}
              className="ml-auto text-white font-bold focus:outline-none focus:ring-0 hover:text-white active:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.map((message, index) => {
              const isBotMessage = message.startsWith("CharakBot:");
              const isUserMessage = message.startsWith("You:");
              const isLatestMessage = index === messages.length - 1; // Check if it's the latest message

              if (isBotMessage) {
                const botContent = message.replace("CharakBot:", "").trim();
                const botPoints = botContent
                  .split(/\n/)
                  .map((line) => line.replace(/\*\*/g, "").trim())
                  .filter((line) => line !== "");

                return (
                  <div
                    key={index}
                    ref={isLatestMessage ? latestMessageRef : null} // Attach ref to the latest message
                    className="text-left text-gray-800"
                  >
                    <p className="font-bold">CharakBot:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {botPoints.map((point, pointIndex) => (
                        <li key={pointIndex}>{point}</li>
                      ))}
                    </ul>
                  </div>
                );
              }

              return (
                <div
                  key={index}
                  ref={isLatestMessage ? latestMessageRef : null} // Attach ref to the latest message
                  className={`${
                    isUserMessage
                      ? "text-right text-blue-600"
                      : "text-left text-gray-800"
                  }`}
                >
                  {message}
                </div>
              );
            })}
          </div>

          <div className="p-3 border-t flex items-center">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={loading}
              placeholder="Type your message..."
              className="flex-1 border rounded p-2 focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <button
              onClick={sendMessage}
              className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none flex items-center justify-center"
              disabled={loading} // Optional: Disable button while loading
            >
              {loading && (
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {loading ? "" : "Send"}
            </button>

            {/* Resize Handle */}
            <div className="absolute top-0 right-8 p-2 cursor-pointer flex">
              {minimize && <p className=" "></p>}
              {maximize && <p className=" "></p>}

              <button
                onMouseEnter={() => setMinimize(true)}
                onMouseLeave={() => setMinimize(false)}
                onClick={() => handleResize(-20, -20)}
                className="p-2 rounded hover:bg-gray-300 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 12H6"
                  />
                </svg>
              </button>
              <button
                onMouseEnter={() => setMaximize(true)}
                onMouseLeave={() => setMaximize(false)}
                onClick={() => handleResize(20, 20)}
                className="p-2 rounded hover:bg-gray-300 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v12m6-6H6"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
