import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  UploadCloud,
  FileText,
  BookOpen,
  Clock,
  Loader2,
  BrainCircuit,
} from "lucide-react";
import { useStore, LearningPreferences } from "../store";
import { generateSummary } from "../services/ai";
import { motion } from "framer-motion";
import LearningPreferencesModal from "../components/LearningPreferencesModal";

const DEMO_SUBJECTS = [
  {
    id: "biology",
    title: "Biology",
    icon: <BrainCircuit className="w-6 h-6 text-zinc-500" />,
    content:
      "Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to produce oxygen and glucose. The equation is: 6CO2 + 6H2O + light -> C6H12O6 + 6O2. This occurs in the chloroplast. The two stages are the light-dependent reactions (in the thylakoid membrane) and the Calvin cycle (in the stroma). Chlorophyll is the green pigment that absorbs light energy. Factors affecting photosynthesis include light intensity, temperature, and CO2 concentration.",
  },
  {
    id: "mathematics",
    title: "Mathematics",
    icon: <FileText className="w-6 h-6 text-zinc-500" />,
    content:
      "Calculus is the mathematical study of continuous change. The two major branches are differential calculus and integral calculus. Differential calculus concerns instantaneous rates of change and the slopes of curves. Integral calculus concerns accumulation of quantities and the areas under and between curves. The fundamental theorem of calculus relates the two branches. Derivatives represent the rate of change of a function with respect to a variable.",
  },
  {
    id: "history",
    title: "History",
    icon: <BookOpen className="w-6 h-6 text-zinc-500" />,
    content:
      "The Industrial Revolution was the transition to new manufacturing processes in Great Britain, continental Europe, and the United States, that occurred during the period from around 1760 to about 1820-1840. This transition included going from hand production methods to machines, new chemical manufacturing and iron production processes, the increasing use of steam power and water power, the development of machine tools and the rise of the mechanized factory system.",
  },
];

export default function Home() {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [pendingDemo, setPendingDemo] = useState<{text: string, subjectName: string} | null>(null);
  const { addSession, incrementTopicsStudied } = useStore();
  const navigate = useNavigate();

  const handleUpload = async (preferences: LearningPreferences) => {
    setIsPreferencesModalOpen(false);
    setIsLoading(true);
    try {
      if (pendingFiles.length > 0) {
        for (const file of pendingFiles) {
          const text = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => resolve(event.target?.result as string);
            reader.onerror = reject;
            reader.readAsText(file);
          });
          const subjectName = file.name.split(".")[0] || "Uploaded Notes";
          const summary = await generateSummary(text, preferences);
          addSession({
            subjectName,
            notes: text,
            summary,
            learningPreferences: preferences,
          });
          incrementTopicsStudied();
        }
      } else if (pendingDemo) {
        const summary = await generateSummary(pendingDemo.text, preferences);
        addSession({
          subjectName: pendingDemo.subjectName,
          notes: pendingDemo.text,
          summary,
          learningPreferences: preferences,
        });
        incrementTopicsStudied();
      }
      navigate("/summary");
    } catch (error) {
      console.error("Failed to process notes:", error);
      alert("Failed to process notes. Please try again.");
    } finally {
      setIsLoading(false);
      setPendingFiles([]);
      setPendingDemo(null);
    }
  };

  const startUploadFlow = (files: File[]) => {
    setPendingFiles(files);
    setPendingDemo(null);
    setIsPreferencesModalOpen(true);
  };

  const startDemoFlow = (text: string, subjectName: string) => {
    setPendingDemo({ text, subjectName });
    setPendingFiles([]);
    setIsPreferencesModalOpen(true);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      startUploadFlow(Array.from(files));
    }
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="mb-8 relative"
        >
          <div className="absolute inset-0 bg-zinc-500/20 blur-xl rounded-full" />
          <div className="w-24 h-24 border-4 border-zinc-200 dark:border-zinc-800 border-t-zinc-900 dark:border-t-white rounded-full relative z-10" />
        </motion.div>
        <h2 className="font-display text-3xl font-bold text-zinc-900 dark:text-white mb-4">
          AI is reading your notes...
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg">
          Extracting key concepts and generating study materials
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pt-12 pb-24">
      <div className="text-center mb-20 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-zinc-500/20 via-zinc-500/20 to-zinc-500/20 dark:from-zinc-500/10 dark:via-zinc-500/10 dark:to-zinc-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 shadow-sm mb-8 relative z-10"
        >
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">Gemini 3.1 Pro Powered</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display text-6xl md:text-8xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-8 relative z-10 leading-[1.1]"
        >
          Master any subject <br />
          <span className="text-gradient">
            in minutes.
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto relative z-10 font-medium leading-relaxed"
        >
          Upload your notes, lectures, or PDFs. Our AI instantly generates personalized summaries, interactive quizzes, and concept maps.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className={`
          relative border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-12 md:p-20 text-center transition-all duration-500 ease-out overflow-hidden bg-white/40 dark:bg-zinc-950/40 backdrop-blur-xl shadow-2xl
          ${
            isDragging
              ? "border-zinc-900 bg-zinc-50 dark:bg-zinc-900 dark:border-white scale-[1.02] shadow-xl"
              : "hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xl"
          }
        `}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/20 dark:to-zinc-900/20 pointer-events-none" />
        
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".txt,.md,.csv"
          multiple
          onChange={(e) => {
            const files = e.target.files;
            if (files && files.length > 0) {
              startUploadFlow(Array.from(files));
            }
          }}
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center relative z-10 group"
        >
          <div className="w-24 h-24 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center mb-8 shadow-xl border border-zinc-200 dark:border-zinc-800 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300">
            <UploadCloud className="w-10 h-10 text-zinc-900 dark:text-white group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors" />
          </div>
          <h3 className="font-display text-3xl font-bold text-zinc-900 dark:text-white mb-4">
            Drop your knowledge here
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg mb-8 max-w-md">
            Drag & drop your text, markdown, or CSV files, or click to browse your computer.
          </p>
          <div className="px-8 py-4 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-lg hover:scale-105 transition-transform shadow-lg">
            Select Files
          </div>
        </label>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-32"
      >
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-zinc-900 dark:text-white mb-4">
            No notes? Try a demo.
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            Experience the magic instantly with our pre-loaded subjects.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {DEMO_SUBJECTS.map((subject, index) => (
            <motion.button
              key={subject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              onClick={() => startDemoFlow(subject.content, subject.title)}
              className="group text-left p-8 rounded-[2rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-white transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-zinc-100 dark:border-zinc-700">
                {subject.icon}
              </div>
              <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-white mb-3">
                {subject.title}
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed line-clamp-3">
                {subject.content}
              </p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      <LearningPreferencesModal
        isOpen={isPreferencesModalOpen}
        onClose={() => {
          setIsPreferencesModalOpen(false);
          setPendingFiles([]);
          setPendingDemo(null);
        }}
        onSave={handleUpload}
      />
    </div>
  );
}
