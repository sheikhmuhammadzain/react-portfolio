import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { SentIcon, Cancel01Icon, Download04Icon, Delete02Icon, ArrowDown01Icon, Brain02Icon } from "@hugeicons/core-free-icons";
import { useLocation } from "react-router-dom";
import chatIcon from "../assets/chat_icon.png";
import LiveCallBlob from "./LiveCallBlob";
import resume from "../assets/resume/my_resume-zain.pdf";
import { RESUME_FILENAME } from "../constants";
import { downloadResume } from "../utils/downloadResume";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

const Chatbot = ({ isOpen, setIsOpen }) => {
  // const [isOpen, setIsOpen] = useState(false); // State lifted to App.jsx
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
  const scrollRef = useRef(null);
  const lastUserMsgRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL || '/api';

  // Resizable window. Anchored bottom-right; the handle sits in the top-left
  // corner so dragging up/left grows the window. Constrained to viewport.
  const MIN_W = 320, MIN_H = 360, MAX_W = 900, MAX_H = 900;
  const [size, setSize] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("chatSize") || "null");
      if (saved && saved.width && saved.height) return saved;
    } catch { /* ignore */ }
    return { width: 448, height: 560 };
  });
  useEffect(() => {
    localStorage.setItem("chatSize", JSON.stringify(size));
  }, [size]);

  const onResizeStart = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = size.width;
    const startH = size.height;
    const onMove = (ev) => {
      // Window is anchored bottom-right: dragging left/up should grow it.
      const nextW = Math.min(MAX_W, Math.max(MIN_W, startW + (startX - ev.clientX)));
      const nextH = Math.min(MAX_H, Math.max(MIN_H, startH + (startY - ev.clientY)));
      setSize({ width: nextW, height: nextH });
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    document.body.style.cursor = "nwse-resize";
    document.body.style.userSelect = "none";
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const scrollToBottom = (behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // When the visitor sends a message, pin it near the top so their question stays
  // in view while the reply streams below it (ChatGPT-style). Otherwise, follow
  // new streaming content to the bottom — but only if already near the bottom, so
  // scrolling up to read isn't yanked.
  useEffect(() => {
    if (!isOpen) return;
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.role === "user") {
      lastUserMsgRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    const el = scrollRef.current;
    const nearBottom = !el || el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    if (nearBottom) scrollToBottom("auto");
  }, [isOpen, messages, isLoading]);

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

      setMessages((prev) => [...prev, { role: "assistant", content: "", reasoning: "" }]);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let content = "";
      let reasoning = "";
      let buffer = "";

      // Backwards compat: if the server is the old plain-text streamer (no
      // newlines, no JSON), we just append everything to content.
      let isNdjson = null;

      const flushAssistant = () => {
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            role: "assistant",
            content,
            reasoning,
          };
          return next;
        });
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });

        if (isNdjson === null) {
          isNdjson = chunk.startsWith("{");
        }

        if (!isNdjson) {
          content += chunk;
          flushAssistant();
          continue;
        }

        buffer += chunk;
        let nl;
        while ((nl = buffer.indexOf("\n")) !== -1) {
          const line = buffer.slice(0, nl).trim();
          buffer = buffer.slice(nl + 1);
          if (!line) continue;
          try {
            const evt = JSON.parse(line);
            if (evt.t === "c") content += evt.d;
            else if (evt.t === "r") reasoning += evt.d;
          } catch {
            // Tolerate malformed lines (e.g. server warning in stream)
          }
        }
        flushAssistant();
      }
      // Drain any trailing partial line
      if (buffer.trim() && isNdjson) {
        try {
          const evt = JSON.parse(buffer.trim());
          if (evt.t === "c") content += evt.d;
          else if (evt.t === "r") reasoning += evt.d;
          flushAssistant();
        } catch { /* ignore */ }
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
           className="fixed bottom-4 sm:bottom-8 left-0 z-50 w-full flex justify-center px-3 sm:px-4"
        >
            <form onSubmit={handleFloatingSubmit} className="w-full flex justify-center sm:px-4">
                <div className="relative flex items-center w-full max-w-2xl glass-ios-16 rounded-full p-1.5 sm:p-2 transition-all duration-300">
                    <input
                        type="text"
                        value={floatingInput}
                        onChange={(e) => setFloatingInput(e.target.value)}
                        placeholder="Ask anything about Zain..."
                        className="w-full min-w-0 bg-transparent border-none text-neutral-200 placeholder-neutral-500 px-4 py-2.5 text-base sm:px-6 sm:py-3 sm:text-lg focus:outline-none focus:ring-0"
                    />
                    <button
                        type="submit"
                        disabled={!floatingInput.trim()}
                        className="shrink-0 p-2.5 sm:p-3 rounded-full bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <HugeiconsIcon icon={SentIcon} size={18} strokeWidth={1.8} />
                    </button>
                    <LiveCallBlob />
                </div>
            </form>
        </motion.div>
      )}

      <div className="fixed bottom-2 right-2 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              style={
                typeof window !== "undefined" && window.innerWidth >= 640
                  ? { width: size.width, height: size.height }
                  : undefined
              }
              className="relative mb-3 sm:mb-4 w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] h-[80vh] max-h-[calc(100dvh-6rem)] sm:w-auto sm:h-auto sm:max-h-none sm:max-w-none rounded-2xl sm:rounded-3xl bg-neutral-900 overflow-hidden flex flex-col"
            >
              {/* Resize handle — desktop only */}
              <div
                onMouseDown={onResizeStart}
                title="Drag to resize"
                className="hidden sm:block absolute top-0 left-0 z-20 h-4 w-4 cursor-nwse-resize group"
                aria-label="Resize chat"
              >
                <div className="absolute top-1.5 left-1.5 h-2 w-2 border-l-2 border-t-2 border-neutral-600 group-hover:border-purple-400 transition-colors" />
              </div>
              {/* Header */}
              <div className="flex items-center justify-between px-3 py-2.5 sm:p-4 bg-neutral-900">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-purple-900/30 text-purple-400 overflow-hidden">
                        <img src={chatIcon} alt="Chat" className="w-full h-full object-contain p-1" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-neutral-100 text-sm sm:text-base truncate">Zain&apos;s Assistant</h3>
                    <p className="text-[10px] sm:text-xs text-neutral-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        Online
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
                  <button
                    onClick={handleClearChat}
                    className="rounded-full p-1.5 sm:p-2 text-neutral-400 hover:bg-neutral-800 hover:text-red-400 transition-colors"
                    title="Clear Chat History"
                  >
                    <HugeiconsIcon icon={Delete02Icon} size={16} strokeWidth={1.8} />
                  </button>
                  <a
                    href={resume}
                    download={RESUME_FILENAME}
                    onClick={(e) => { e.preventDefault(); downloadResume(); }}
                    className="rounded-full p-1.5 sm:p-2 text-neutral-400 hover:bg-neutral-800 hover:text-purple-400 transition-colors"
                    title="Download Resume"
                  >
                    <HugeiconsIcon icon={Download04Icon} size={16} strokeWidth={1.8} />
                  </a>
                  <button
                    onClick={toggleChat}
                    className="rounded-full p-1.5 sm:p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={1.8} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div ref={scrollRef} data-lenis-prevent className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-3 sm:p-4 space-y-3 sm:space-y-4 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent bg-neutral-900">
                {(() => { const lastUserIdx = messages.map((m) => m.role).lastIndexOf("user"); return messages.map((msg, index) => (
                  <div
                    key={index}
                    ref={msg.role === "user" && index === lastUserIdx ? lastUserMsgRef : null}
                    className={`flex scroll-mt-3 ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] min-w-0 break-words overflow-hidden rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-purple-600 text-white rounded-br-md"
                          : "bg-neutral-800 text-neutral-200 rounded-bl-md"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <div className="prose prose-sm prose-invert max-w-none text-neutral-200 break-words [&_pre]:overflow-x-auto [&_pre]:max-w-full [&_code]:break-words">
                          {msg.reasoning && msg.reasoning.trim() && (
                            <details className="not-prose mb-2 rounded-lg bg-neutral-900/60 group">
                              <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2 text-xs text-neutral-400 hover:text-neutral-200 transition-colors select-none">
                                <HugeiconsIcon icon={Brain02Icon} className="text-purple-400/80" size={13} strokeWidth={1.8} />
                                <span className="font-medium">
                                  {msg.content ? "Reasoning" : "Thinking…"}
                                </span>
                                <HugeiconsIcon icon={ArrowDown01Icon} className="ml-auto text-neutral-500 transition-transform group-open:rotate-180" size={14} strokeWidth={1.8} />
                              </summary>
                              <div data-lenis-prevent className="px-3 pb-3 pt-1 text-[12px] leading-relaxed text-neutral-400 whitespace-pre-wrap font-mono max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
                                {msg.reasoning}
                              </div>
                            </details>
                          )}
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw]}
                            components={{
                              a: (props) => (
                                <a {...props} target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:text-white underline break-all" />
                              ),
                              p: (props) => <p {...props} className="mb-2 leading-relaxed" />,
                              ul: (props) => <ul {...props} className="list-disc ml-4 mb-2" />,
                              ol: (props) => <ol {...props} className="list-decimal ml-4 mb-2" />,
                              li: (props) => <li {...props} className="mb-1" />,
                              strong: (props) => <strong {...props} className="font-semibold text-white" />,
                              table: (props) => (
                                <div className="overflow-x-auto my-2 rounded-lg border border-neutral-700">
                                  <table {...props} className="min-w-full text-xs border-collapse" />
                                </div>
                              ),
                              th: (props) => (
                                <th {...props} className="bg-neutral-700 text-neutral-100 font-semibold px-3 py-2 text-left border-b border-neutral-600 whitespace-nowrap" />
                              ),
                              td: (props) => (
                                <td {...props} className="px-3 py-2 border-b border-neutral-700/50 text-neutral-300 align-top" />
                              ),
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
                )); })()}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-neutral-800 rounded-2xl rounded-bl-md px-4 py-3">
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
              <form onSubmit={handleSubmit} className="p-2.5 sm:p-4 bg-neutral-900">
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your question..."
                    className="flex-1 min-w-0 rounded-full bg-neutral-800 px-3 sm:px-4 py-2 sm:py-3 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-purple-500/40 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-purple-600 text-white transition-all hover:bg-purple-500 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-purple-600"
                  >
                    <HugeiconsIcon icon={SentIcon} size={16} strokeWidth={1.8} />
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
                <HugeiconsIcon icon={Cancel01Icon} className="text-white" size={24} strokeWidth={2} />
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
