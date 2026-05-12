import { useState, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot" | "agent";
  timestamp: Date;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! How can we help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [hasNewMessage, setHasNewMessage] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setHasNewMessage(false);
    }
  }, [isOpen]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputValue("");

    // Simulate bot response
    setTimeout(() => {
      const botResponses = [
        "Thanks for reaching out! How can I assist you?",
        "I'm here to help with tracking, shipping, and support questions.",
        "You can also connect with a live agent if you need further assistance.",
      ];

      const randomResponse =
        botResponses[Math.floor(Math.random() * botResponses.length)];

      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: randomResponse,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    }, 500);
  };

  const handleConnectAgent = () => {
    const agentMessage: Message = {
      id: messages.length + 1,
      text: "An agent will be with you shortly. Please wait...",
      sender: "agent",
      timestamp: new Date(),
    };
    setMessages([...messages, agentMessage]);
  };

  return (
    <>
      {/* Chat Widget Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-secondary hover:bg-secondary/90 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 transform hover:scale-110"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        {hasNewMessage && !isOpen && (
          <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-1.5rem)] h-[500px] bg-white rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary text-white p-4">
            <h3 className="font-semibold text-lg">Nexus Support</h3>
            <p className="text-sm text-blue-100">Usually responds in minutes</p>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-secondary text-white rounded-br-none"
                      : msg.sender === "agent"
                      ? "bg-green-100 text-green-800 rounded-bl-none"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${
                    msg.sender === "user"
                      ? "text-blue-100"
                      : "text-gray-500"
                  }`}>
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-2 bg-white border-t border-gray-200">
            <Button
              onClick={handleConnectAgent}
              variant="outline"
              className="w-full text-xs mb-3 border-secondary text-secondary hover:bg-secondary/10"
            >
              Connect to Agent
            </Button>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
                className="flex-1 border-gray-300"
              />
              <Button
                onClick={handleSendMessage}
                className="bg-secondary hover:bg-secondary/90 px-4"
              >
                <Send size={18} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
