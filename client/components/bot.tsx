"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, X, Bot, MessageCircle } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const BotComponent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const apiKey = "AIzaSyCm6Tm_CdiyT0kGP9zPoBHa4wlmB5zjVW4";
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  // Topics to filter: navigation and environment-related
  const allowedTopics = [
    "navigation", "dashboard", "modules", "assignments", "missions", "leaderboard", "messages", "certificates", "settings",
    "environment", "climate", "weather", "energy", "resources", "solar", "ocean", "forest", "eco", "sustainable"
  ];

  const isRelevantTopic = (message: string) => {
    const lowerMessage = message.toLowerCase();
    return allowedTopics.some(topic => lowerMessage.includes(topic));
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Gemini API endpoint (use generateContent)
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" + apiKey, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: inputMessage }] }],
          generationConfig: {
            temperature: 0.7,
            topK: 1,
            topP: 1,
            maxOutputTokens: 2048,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            // Add other safety settings as needed
          ]
        })
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();
      let assistantContent = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";

      // Filter response if not relevant (basic check)
      if (!isRelevantTopic(inputMessage)) {
        assistantContent = "I'm here to help with website navigation (e.g., dashboard, modules) and environment topics (e.g., climate, energy). Ask me about those!";
      }

      const assistantMessage: Message = { role: "assistant", content: assistantContent };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      const errorMessage: Message = { role: "assistant", content: "Sorry, there was an error with the API." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  // Position popup above the floating button
  const getPopupPosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      return {
        bottom: window.innerHeight - rect.top + 10, // Above button
        right: window.innerWidth - rect.right,
      };
    }
    return { bottom: 100, right: 20 }; // Default position
  };

  if (!isOpen) {
    return (
      <div ref={buttonRef} className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-20 inline-flex h-14 w-14 items-center justify-center rounded-full border-4 border-black bg-yellow-300 shadow-[0_6px_0_#000]"
          aria-label="Open AI Assistant"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6 text-black"
          >
            <path d="M2 5a3 3 0 013-3h14a3 3 0 013 3v9a3 3 0 01-3 3H9.828L5 21.828V17H5a3 3 0 01-3-3V5z" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed z-50" style={{ bottom: "100px", right: "20px" }}>
      {/* Floating Button - Minimize/Close */}
      <div ref={buttonRef} className="mb-2">
        <button
          onClick={() => setIsOpen(false)}
          className="fixed bottom-6 right-6 z-20 inline-flex h-14 w-14 items-center justify-center rounded-full border-4 border-black bg-yellow-300 shadow-[0_6px_0_#000]"
          aria-label="Close AI Assistant"
        >
          <X size={24} className="h-6 w-6 text-black" />
        </button>
      </div>

      {/* Chat Popup */}
      <div className="w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col border border-gray-200">
        {/* Header */}
        <div className="p-4 bg-blue-600 text-white rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot size={20} />
            <span className="font-semibold">AI Environment Assistant</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-white hover:opacity-70">
            <X size={20} />
          </button>
        </div>

        {/* Chat Messages */}
        <div ref={chatRef} className="flex-1 p-4 overflow-y-auto bg-gray-50">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-8">
              <Bot size={32} className="mx-auto mb-2 opacity-50" />
              <p>Ask me about website navigation or environment topics!</p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className={`mb-4 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                <div className={`inline-block p-3 rounded-lg max-w-xs ${msg.role === "user" ? "bg-blue-500 text-white" : "bg-white text-gray-800 shadow-sm"}`}>
                  {msg.content}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="text-left mb-4">
              <div className="inline-block p-3 rounded-lg bg-white text-gray-800 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span>Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotComponent;
