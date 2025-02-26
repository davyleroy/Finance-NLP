import React, { useState } from "react";
import { Send, Bot } from "lucide-react";

interface Message {
  content: string;
  isBot: boolean;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Hello! I'm your finance assistant. How can I help you today?",
      isBot: true,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage = { content: input, isBot: false };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_input: input }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from the chatbot");
      }

      const data = await response.json();
      const botMessage = {
        content: data.bot_response,
        isBot: true,
      };

      // Simulate typing delay
      setTimeout(() => {
        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
        setIsLoading(false);
      }, 5000); // 5 seconds delay
    } catch (error) {
      const errorMessage = {
        content: "Something went wrong. Please try again.",
        isBot: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
      console.error("Error:", error);
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4">
        {/* Header */}
        <div className="bg-white rounded-t-lg p-4 border-b">
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-800">
              Finance Assistant
            </h1>
          </div>
        </div>

        {/* Messages Container */}
        <div className="bg-white h-[600px] overflow-y-auto p-4 flex flex-col gap-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.isBot ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.isBot
                    ? "bg-gray-100 text-gray-800"
                    : "bg-blue-600 text-white"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 text-gray-800">
                <div className="flex gap-2">
                  <span className="animate-bounce">•</span>
                  <span className="animate-bounce delay-100">•</span>
                  <span className="animate-bounce delay-200">•</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border-t p-4 rounded-b-lg flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your finances..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
            disabled={isLoading}
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
