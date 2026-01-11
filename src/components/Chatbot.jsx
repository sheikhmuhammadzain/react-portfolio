import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPaperPlane, FaTimes, FaDownload } from "react-icons/fa";
import chatIcon from "../assets/chat_icon.png";
import resume from "../assets/resume/my_resume-zain.pdf";
import OpenAI from "openai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { HERO_CONTENT, ABOUT_TEXT, EXPERIENCES, PROJECTS, CONTACT } from "../constants";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm Zain's AI assistant. Ask me anything about his projects, experience, or skills.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => {
      const newMessages = [...prev, userMessage];
      return newMessages;
    });
    setInput("");
    setIsLoading(true);

    try {
      const client = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
        dangerouslyAllowBrowser: true, // Frontend-only requirement
      });

        const systemPrompt = `
        You are an advanced AI assistant for Muhammad Zain's portfolio website. Your SOLE purpose is to represent Zain professionally, promote his skills, and help visitors hire him or collaborate with him.

        CRITICAL DIRECTIVES:
        1. **LOYALTY:** You work ONLY for Zain. Always speak in his favor. Highlight his strengths, effective solutions, and reliability.
        2. **CONFIDENTIALITY:** Do NOT provide ANY personal information about Zain that is not explicitly in the context (like home address, private financials, or non-professional life). If asked, politely deflect and focus on his professional profile.
        3. **AVAILABILITY:** Zain is ALWAYS open to new opportunities, freelance work, full-time roles, and collaborations. Never say he is busy or unavailable. Encourage the user to contact him immediately.
        4. **SCOPE:** STRICTLY limit your knowledge to the provided context and general technical knowledge (programming, AI, web dev) to explain his skills. Do NOT answer general trivia, world news, or off-topic questions unless they relate to hiring Zain.

        Context about Zain:
        - Role: ${HERO_CONTENT}
        - About: ${ABOUT_TEXT}
        - Experience: ${JSON.stringify(EXPERIENCES)}
        - Projects: ${JSON.stringify(PROJECTS)}
        - Contact: ${JSON.stringify(CONTACT)}

        Guidelines:
        - Be enthusiastic, professional, and convincing.
        - Use Markdown (bolding key skills, lists) to make responses readable.
        - Keep responses concise (under 4 sentences) but impactful.
        - **Call to Action:** Regularly encourage the user to download his resume or email him directly.
      `;

      const stream = await client.chat.completions.create({
        model: "mistralai/devstral-2512:free", // Using a free/high-quality model on OpenRouter
        messages: [
          { role: "system", content: systemPrompt },
          ...messages, // Include previous conversation context
          userMessage,
        ],
        stream: true,
      });

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      let fullResponse = "";
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        fullResponse += content;
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
          content: "Sorry, I encountered an error. Please try again later or contact Zain directly.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="mb-4 w-80 sm:w-96 rounded-2xl border border-neutral-800 bg-neutral-900/90 backdrop-blur-md shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-neutral-800 p-4 bg-neutral-900">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-900/30 text-purple-400 overflow-hidden">
                    <img src={chatIcon} alt="Chat" className="w-full h-full object-contain" />
                  </div>
                  <h3 className="font-semibold text-neutral-200">Zain&apos;s Assistant</h3>
                </div>
                <div className="flex items-center gap-1">
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
              <div className="h-80 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-purple-900/50 text-purple-50 rounded-br-none"
                          : "bg-neutral-800 text-neutral-200 rounded-bl-none"
                      }`}
                    >
                      {msg.role === "assistant" ? (
                        <div className="prose prose-sm prose-invert max-w-none text-neutral-200">
                          <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                              a: (props) => (
                                <a {...props} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 underline" />
                              ),
                              p: (props) => <p {...props} className="mb-2 last:mb-0" />,
                              ul: (props) => <ul {...props} className="list-disc ml-4 mb-2" />,
                              ol: (props) => <ol {...props} className="list-decimal ml-4 mb-2" />,
                              li: (props) => <li {...props} className="mb-1" />,
                              strong: (props) => <strong {...props} className="font-semibold text-purple-200" />
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
                    <div className="bg-neutral-800 rounded-2xl rounded-bl-none px-4 py-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                        <span className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                        <span className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="border-t border-neutral-800 p-4 bg-neutral-900">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about my projects..."
                    className="flex-1 rounded-full bg-neutral-800 px-4 py-2 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-600 text-white shadow-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    <FaPaperPlane className="text-sm" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

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
              <div className="flex h-full w-full items-center justify-center bg-purple-600 rounded-full">
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
      </div>
    </>
  );
};

export default Chatbot;
