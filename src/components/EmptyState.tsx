import { UploadCloud, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function EmptyState() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-card p-12 rounded-[2.5rem] max-w-md w-full relative z-10"
      >
        <div className="w-24 h-24 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-500/20 dark:via-purple-500/20 dark:to-pink-500/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner border border-white/50 dark:border-white/5 rotate-3 hover:rotate-6 transition-transform duration-500">
          <UploadCloud className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="font-display text-3xl font-bold text-zinc-900 dark:text-white mb-4 leading-tight">
          Upload your notes first to unlock this feature
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 mb-10 text-lg leading-relaxed">
          We need some material to work with before we can generate your study
          resources.
        </p>
        <button
          onClick={() => navigate("/")}
          className="flex items-center justify-center gap-2 w-full px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-display font-bold shadow-xl shadow-zinc-900/20 dark:shadow-white/20 transition-all hover:scale-105 active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Upload
        </button>
      </motion.div>
    </div>
  );
}
