import { useStore } from "../store";
import { useNavigate } from "react-router-dom";
import Markdown from "react-markdown";
import { FileText, Clock, Download, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import EmptyState from "../components/EmptyState";

export default function Summary() {
  const { sessions, activeSessionId } = useStore();
  const activeSession = sessions.find(s => s.id === activeSessionId);
  const notes = activeSession?.notes;
  const summary = activeSession?.summary || "";
  const subjectName = activeSession?.subjectName || "";

  const navigate = useNavigate();

  if (!notes) {
    return <EmptyState />;
  }

  const estimatedReadTime = Math.ceil(summary.split(" ").length / 200);
  const topicsCount = (summary.match(/## /g) || []).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto pb-24"
    >
      <div className="glass-card rounded-[2rem] p-6 md:p-8 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-500/10 blur-3xl rounded-full pointer-events-none" />
        <div className="relative z-10">
          <h1 className="font-display text-4xl font-bold text-zinc-900 dark:text-white mb-3 tracking-tight">
            {subjectName} Summary
          </h1>
          <div className="flex items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400 font-medium">
            <span className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              {topicsCount} Key Topics
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {estimatedReadTime} min read
            </span>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={() => window.print()}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-100/80 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl font-display font-semibold transition-colors backdrop-blur-sm"
          >
            <Download className="w-4 h-4" />
            PDF
          </button>
          <button
            onClick={() => navigate("/quiz")}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-display font-bold shadow-xl shadow-zinc-900/20 dark:shadow-white/20 transition-all hover:scale-105 active:scale-95"
          >
            Practice Quiz
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="prose prose-zinc dark:prose-invert max-w-none glass-card p-8 md:p-12 rounded-[2.5rem]">
        <Markdown
          components={{
            h2: ({ node, ...props }) => (
              <h2
                className="font-display text-3xl font-bold text-zinc-900 dark:text-white mt-10 mb-6 pb-4 border-b border-zinc-200/50 dark:border-zinc-800/50"
                {...props}
              />
            ),
            h3: ({ node, ...props }) => (
              <h3
                className="font-display text-2xl font-semibold text-zinc-800 dark:text-zinc-200 mt-8 mb-4"
                {...props}
              />
            ),
            ul: ({ node, ...props }) => (
              <ul
                className="space-y-3 my-6 list-disc list-inside text-zinc-700 dark:text-zinc-300"
                {...props}
              />
            ),
            li: ({ node, ...props }) => (
              <li className="leading-relaxed pl-2" {...props} />
            ),
            strong: ({ node, ...props }) => (
              <strong
                className="font-semibold text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-md"
                {...props}
              />
            ),
            p: ({ node, ...props }) => (
              <p
                className="leading-relaxed text-lg text-zinc-700 dark:text-zinc-300 mb-6"
                {...props}
              />
            ),
          }}
        >
          {summary}
        </Markdown>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => window.print()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl font-medium transition-colors"
        >
          <Download className="w-5 h-5" />
          Download Notes PDF
        </button>
        <button
          onClick={() => navigate("/quiz")}
          className="flex items-center justify-center gap-2 px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/25 transition-all hover:scale-105"
        >
          Generate Practice Quiz
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}
