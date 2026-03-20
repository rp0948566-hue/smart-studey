import { useState } from "react";
import { X, Send, MessageSquarePlus, AlertCircle } from "lucide-react";
import { cn } from "../lib/utils";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [type, setType] = useState<"suggestion" | "issue">("suggestion");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    
    // Simulate network request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Close modal after showing success message
      setTimeout(() => {
        setIsSuccess(false);
        setMessage("");
        onClose();
      }, 2000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-sm">
      <div className="glass-card w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200/50 dark:border-zinc-800/50">
          <h2 className="text-lg font-display font-bold flex items-center gap-2">
            <MessageSquarePlus className="w-5 h-5 text-purple-500" />
            Send Feedback
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
              <Send className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-display font-bold">Thank You!</h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Your feedback has been sent successfully. We appreciate your help in improving StudyMind AI.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Feedback Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setType("suggestion")}
                  className={cn(
                    "flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all border",
                    type === "suggestion"
                      ? "bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-300"
                      : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800/50"
                  )}
                >
                  <MessageSquarePlus className="w-4 h-4" />
                  Suggestion
                </button>
                <button
                  type="button"
                  onClick={() => setType("issue")}
                  className={cn(
                    "flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all border",
                    type === "issue"
                      ? "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300"
                      : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800/50"
                  )}
                >
                  <AlertCircle className="w-4 h-4" />
                  Report Issue
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label htmlFor="message" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Message
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={type === "suggestion" ? "How can we improve?" : "What went wrong?"}
                className="w-full h-32 px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 resize-none transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                required
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!message.trim() || isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium bg-purple-600 hover:bg-purple-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
