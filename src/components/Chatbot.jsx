import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPaperPlane, FaTimes, FaDownload, FaTrash, FaSearch } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import chatIcon from "../assets/chat_icon.png";
import resume from "../assets/resume/my_resume-zain.pdf";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const INITIAL_MESSAGE = {
    role: "assistant",
    content: "Hi! I'm Zain's AI assistant. Ask me anything about his projects, experience, or skills.",
  };
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [floatingInput, setFloatingInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || '/api';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleClearChat = () => {
    setMessages([INITIAL_MESSAGE]);
    localStorage.removeItem("chatMessages");
  };

  // Helper to process sending a message
  const sendMessage = async (messageContent) => {
    if (!messageContent.trim() || isLoading) return;

    const userMessage = { role: "user", content: messageContent };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setFloatingInput("");
    setIsLoading(true);

    if (!isOpen) setIsOpen(true);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage], 
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      if (!response.body) throw new Error('ReadableStream not supported');

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        fullResponse += chunk;
        
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            role: "assistant",
            content: fullResponse,
          };
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error connecting to the server. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleFloatingSubmit = (e) => {
    e.preventDefault();
    sendMessage(floatingInput);
  };

  return (
    <>
      {/* Floating Glassmorphism Input Bar - Only on Home Page */}
      {location.pathname === "/" && !isOpen && (
        <motion.div
           initial={{ opacity: 0, y: 50 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 1, duration: 0.8 }}
           className="fixed bottom-8 left-0 z-50 w-full flex justify-center px-4"
        >
            <form onSubmit={handleFloatingSubmit} className="w-full flex justify-center px-4">
                <div className="relative flex items-center w-full max-w-2xl glass-ios-16 rounded-full p-2 transition-all duration-300">
                    <input 
                        type="text" 
                        value={floatingInput}
                        onChange={(e) => setFloatingInput(e.target.value)}
                        placeholder="Ask anything about Zain..."
                        className="w-full bg-transparent border-none text-neutral-200 placeholder-neutral-500 px-6 py-3 text-lg focus:outline-none focus:ring-0"
                    />
                    <button 
                        type="submit"
                        disabled={!floatingInput.trim()}
                        className="p-3 rounded-full bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FaPaperPlane size={16} />
                    </button>
                </div>
            </form>
        </motion.div>
      )}

      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="mb-4 w-96 sm:w-[28rem] rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-neutral-800 p-4 bg-neutral-950">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-900/30 text-purple-400 overflow-hidden border border-purple-500/20">
                        <img src={chatIcon} alt="Chat" className="w-full h-full object-contain p-1" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-100 text-base">Zain&apos;s Assistant</h3>
                    <p className="text-xs text-neutral-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        Online
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleClearChat}
                    className="rounded-full p-2 text-neutral-400 hover:bg-neutral-800 hover:text-red-400 transition-colors"
                    title="Clear Chat History"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                  <a
                    href={resume}
                    download="Muhammad_Zain_Resume.pdf"
                    className="rounded-full p-2 text-neutral-400 hover:bg-neutral-800 hover:text-purple-400 transition-colors"
                    title="Download Resume"
                  >
                    <FaDownload className="text-sm" />
                  </a>
                  <button
                    onClick={toggleChat}
                    className="rounded-full p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="h-96 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent bg-neutral-900/50">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                        msg.role === "user"
                          ? "bg-purple-600 text-white rounded-br-none"
                          : "bg-neutral-800 text-neutral-200 rounded-bl-none border border-neutral-700"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <div className="prose prose-sm prose-invert max-w-none text-neutral-200">
                          <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                              a: (props) => (
                                <a {...props} target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:text-white underline" />
                              ),
                              p: (props) => <p {...props} className="mb-2 leading-relaxed" />,
                              ul: (props) => <ul {...props} className="list-disc ml-4 mb-2" />,
                              ol: (props) => <ol {...props} className="list-decimal ml-4 mb-2" />,
                              li: (props) => <li {...props} className="mb-1" />,
                              strong: (props) => <strong {...props} className="font-semibold text-white" />
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-neutral-800 rounded-2xl rounded-bl-none px-4 py-3 border border-neutral-700">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                        <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                        <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="border-t border-neutral-800 p-4 bg-neutral-950">
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your question..."
                    className="flex-1 rounded-full bg-neutral-900 border border-neutral-800 px-4 py-3 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-white shadow-lg shadow-purple-900/20 transition-all hover:bg-purple-500 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-purple-600"
                  >
                    <FaPaperPlane className="text-xs" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {(isOpen || location.pathname !== "/") && (
        <button
          onClick={toggleChat}
          className="group flex h-14 w-14 items-center justify-center rounded-full bg-transparent shadow-lg transition-all hover:scale-110"
        >
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
          >
            {isOpen ? (
              <div className="flex h-full w-full items-center justify-center bg-purple-600 rounded-full shadow-[0_0_15px_rgba(147,51,234,0.5)]">
                <FaTimes className="text-xl text-white" />
              </div>
            ) : (
                <motion.img 
                  src={chatIcon} 
                  alt="Chat" 
                  className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(168,85,247,0.8)] drop-shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all duration-300 group-hover:drop-shadow-[0_0_40px_rgba(168,85,247,0.8)]" 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
            )}
          </motion.div>
        </button>
        )}
      </div>
    </>
  );
};

export default Chatbot;
