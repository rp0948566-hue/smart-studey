import { useState, useRef, useEffect } from "react";
import { useStore } from "../store";
import { chatWithTutor } from "../services/ai";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles } from "lucide-react";
import { cn } from "../lib/utils";
import Markdown from "react-markdown";
import EmptyState from "../components/EmptyState";

const SUGGESTED_QUESTIONS = [
  "Summarise the key points",
  "What is the most important concept?",
  "Quiz me on this topic",
];

export default function Tutor() {
  const { sessions, activeSessionId, updateActiveSession } = useStore();
  const activeSession = sessions.find(s => s.id === activeSessionId);
  const notes = activeSession?.notes;
  const chatHistory = activeSession?.chatHistory || [];
  const addChatMessage = (msg: any) => updateActiveSession({ chatHistory: [...chatHistory, msg] });

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping]);

  if (!notes) {
    return <EmptyState />;
  }

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg = { role: "user" as const, text };
    addChatMessage(userMsg);
    setInput("");
    setIsTyping(true);

    try {
      const response = await chatWithTutor(text, notes, chatHistory, activeSession?.learningPreferences);
      addChatMessage({ role: "model", text: response });
    } catch (error) {
      console.error("Chat error:", error);
      addChatMessage({
        role: "model",
        text: "Sorry, I encountered an error. Please try again.",
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col glass-card rounded-[2.5rem] shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-zinc-500/5 to-transparent pointer-events-none" />
      <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 custom-scrollbar relative z-10">
        {chatHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="w-24 h-24 bg-gradient-to-br from-zinc-500/10 via-zinc-500/10 to-zinc-500/10 dark:from-zinc-500/20 dark:via-zinc-500/20 dark:to-zinc-500/20 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner border border-white/50 dark:border-white/5 rotate-3 hover:rotate-6 transition-transform duration-500">
              <Bot className="w-12 h-12 text-zinc-600 dark:text-zinc-400" />
            </div>
            <h2 className="font-display text-4xl font-bold text-zinc-900 dark:text-white mb-4">
              Your Personal AI Tutor
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-md mb-10 leading-relaxed">
              I've read your notes and I'm ready to help you study. Ask me
              anything about the material!
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="flex items-center gap-2 px-6 py-3 bg-white/50 hover:bg-white dark:bg-zinc-800/50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-2xl text-sm font-medium transition-all border border-zinc-200/50 dark:border-zinc-700/50 hover:border-zinc-300 dark:hover:border-zinc-500/50 hover:shadow-md hover:-translate-y-0.5"
                >
                  <Sparkles className="w-4 h-4 text-zinc-500" />
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {chatHistory.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn(
                  "flex gap-4 max-w-[85%]",
                  msg.role === "user" ? "ml-auto flex-row-reverse" : "",
                )}
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                    msg.role === "user"
                      ? "bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900"
                      : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-700/50",
                  )}
                >
                  {msg.role === "user" ? (
                    <User className="w-6 h-6" />
                  ) : (
                    <Bot className="w-6 h-6" />
                  )}
                </div>
                <div
                  className={cn(
                    "px-6 py-4 rounded-3xl shadow-sm",
                    msg.role === "user"
                      ? "bg-zinc-800 dark:bg-zinc-200 text-white dark:text-zinc-900 rounded-tr-sm"
                      : "bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-700/50 text-zinc-900 dark:text-zinc-100 rounded-tl-sm",
                  )}
                >
                  {msg.role === "user" ? (
                    <p className="whitespace-pre-wrap text-[15px] leading-relaxed">{msg.text}</p>
                  ) : (
                    <div className="prose prose-zinc dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800">
                      <Markdown>{msg.text}</Markdown>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4 max-w-[85%]"
              >
                <div className="w-12 h-12 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-700/50 rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                  <Bot className="w-6 h-6" />
                </div>
                <div className="px-6 py-5 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-700/50 rounded-3xl rounded-tl-sm flex items-center gap-2 shadow-sm">
                  <motion.div
                    className="w-2 h-2 bg-zinc-400 rounded-full"
                    animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-zinc-400 rounded-full"
                    animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-zinc-400 rounded-full"
                    animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
                  />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="p-4 md:p-6 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border-t border-zinc-200/50 dark:border-zinc-800/50 relative z-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex gap-3 relative"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your tutor a question..."
            className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl px-6 py-4 text-zinc-900 dark:text-white transition-all outline-none shadow-sm text-[15px]"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 disabled:opacity-50 disabled:hover:bg-zinc-900 dark:disabled:hover:bg-white text-white dark:text-zinc-900 px-6 py-4 rounded-2xl transition-all flex items-center justify-center shadow-xl shadow-zinc-900/10 dark:shadow-white/10 hover:scale-105 active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
