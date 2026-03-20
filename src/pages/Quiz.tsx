import { useState, useEffect } from "react";
import { useStore } from "../store";
import { useNavigate } from "react-router-dom";
import { generateQuiz } from "../services/ai";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
  Loader2,
} from "lucide-react";
import confetti from "canvas-confetti";
import { cn } from "../lib/utils";
import EmptyState from "../components/EmptyState";

export default function Quiz() {
  const { sessions, activeSessionId, updateActiveSession } = useStore();
  const activeSession = sessions.find(s => s.id === activeSessionId);
  const notes = activeSession?.notes;
  const quiz = activeSession?.quiz || [];
  const setQuiz = (q: any) => updateActiveSession({ quiz: q });

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(!quiz.length);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (notes && !quiz.length) {
      loadQuiz();
    }
  }, [notes]);

  const loadQuiz = async () => {
    setIsLoading(true);
    try {
      const generatedQuiz = await generateQuiz(notes, activeSession?.learningPreferences);
      setQuiz(generatedQuiz);
    } catch (error) {
      console.error("Failed to generate quiz:", error);
      alert("Failed to generate quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!notes) {
    return <EmptyState />;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-zinc-500/20 blur-[100px] rounded-full pointer-events-none" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="mb-8 relative z-10"
        >
          <div className="w-16 h-16 border-4 border-zinc-200 dark:border-zinc-800 border-t-zinc-900 dark:border-t-white rounded-full" />
        </motion.div>
        <h2 className="font-display text-3xl font-bold text-zinc-900 dark:text-white mb-2 relative z-10">
          Generating your quiz...
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg relative z-10">
          Crafting 10 questions based on your notes
        </p>
      </div>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / quiz.length) * 100);
    let grade = "F";
    let message = "Keep studying! You'll get it next time.";
    if (percentage >= 90) {
      grade = "A";
      message = "Outstanding! You've mastered this topic.";
    } else if (percentage >= 80) {
      grade = "B";
      message = "Great job! You have a solid understanding.";
    } else if (percentage >= 70) {
      grade = "C";
      message = "Good effort. Review the notes to improve.";
    } else if (percentage >= 60) {
      grade = "D";
      message = "You passed, but there's room for improvement.";
    }

    if (percentage >= 80) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#52525b", "#a1a1aa", "#FFFFFF"],
      });
    }

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto text-center py-12 relative"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-zinc-500/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="glass-card rounded-[2.5rem] p-12 relative z-10">
          <div className="w-28 h-28 bg-gradient-to-br from-zinc-500/10 via-zinc-500/10 to-zinc-500/10 dark:from-zinc-500/20 dark:via-zinc-500/20 dark:to-zinc-500/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-white/50 dark:border-white/5">
            <Trophy className="w-14 h-14 text-zinc-600 dark:text-zinc-400" />
          </div>
          <h2 className="font-display text-5xl font-bold text-zinc-900 dark:text-white mb-4">
            Quiz Complete!
          </h2>
          <div className="font-display text-8xl font-black text-gradient mb-6">
            {percentage}%
          </div>
          <div className="font-display text-3xl font-bold text-zinc-800 dark:text-zinc-200 mb-3">
            Grade: {grade}
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 mb-12 text-xl font-medium">
            {message}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                setCurrentQuestion(0);
                setSelectedAnswer(null);
                setScore(0);
                setShowResult(false);
              }}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-zinc-100/80 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white rounded-2xl font-display font-bold transition-colors backdrop-blur-sm"
            >
              <RotateCcw className="w-5 h-5" />
              Try Again
            </button>
            <button
              onClick={() => navigate("/map")}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-display font-bold shadow-xl shadow-zinc-900/20 dark:shadow-white/20 transition-all hover:scale-105 active:scale-95"
            >
              Concept Map
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  const question = quiz[currentQuestion];
  const isAnswered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === question.correctAnswerIndex;

  return (
    <div className="max-w-3xl mx-auto pb-24">
      <div className="mb-8">
        <div className="flex justify-between text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-4">
          <span>
            Question {currentQuestion + 1} of {quiz.length}
          </span>
          <span>Score: {score}</span>
        </div>
        <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-zinc-900 dark:bg-white"
            initial={{ width: 0 }}
            animate={{
              width: `${((currentQuestion + 1) / quiz.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="glass-card rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden"
        >
          <h2 className="font-display text-2xl md:text-4xl font-bold text-zinc-900 dark:text-white mb-10 leading-tight">
            {question.question}
          </h2>

          <div className="space-y-4 relative z-10">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectOption = index === question.correctAnswerIndex;

              let buttonClass =
                "w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between group ";

              if (!isAnswered) {
                buttonClass +=
                  "bg-white/50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 hover:bg-white dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300";
              } else if (isCorrectOption) {
                buttonClass +=
                  "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 text-emerald-900 dark:text-emerald-100";
              } else if (isSelected && !isCorrectOption) {
                buttonClass +=
                  "bg-rose-50 dark:bg-rose-500/10 border-rose-500 text-rose-900 dark:text-rose-100";
              } else {
                buttonClass +=
                  "bg-white/30 dark:bg-zinc-800/30 border-zinc-200 dark:border-zinc-800 opacity-50 text-zinc-500 dark:text-zinc-500";
              }

              return (
                <button
                  key={index}
                  disabled={isAnswered}
                  onClick={() => {
                    setSelectedAnswer(index);
                    if (index === question.correctAnswerIndex) {
                      setScore((s) => s + 1);
                    }
                  }}
                  className={buttonClass}
                >
                  <span className="text-lg font-medium pr-4">{option}</span>
                  {isAnswered && isCorrectOption && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/30"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </motion.div>
                  )}
                  {isAnswered && isSelected && !isCorrectOption && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-rose-500/30"
                    >
                      <XCircle className="w-5 h-5" />
                    </motion.div>
                  )}
                  {!isAnswered && (
                    <div className="w-8 h-8 rounded-full border-2 border-zinc-300 dark:border-zinc-600 group-hover:border-zinc-400 dark:group-hover:border-zinc-500 flex items-center justify-center shrink-0 transition-colors">
                      <span className="text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        {String.fromCharCode(65 + index)}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "mt-10 p-8 rounded-3xl border backdrop-blur-sm",
                isCorrect
                  ? "bg-emerald-50/80 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20"
                  : "bg-rose-50/80 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20",
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                  isCorrect 
                    ? "bg-emerald-200 dark:bg-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                    : "bg-rose-200 dark:bg-rose-500/30 text-rose-700 dark:text-rose-300"
                )}>
                  {isCorrect ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                </div>
                <div className="flex-1">
                  <h4
                    className={cn(
                      "font-display text-xl font-bold mb-2",
                      isCorrect
                        ? "text-emerald-900 dark:text-emerald-300"
                        : "text-rose-900 dark:text-rose-300",
                    )}
                  >
                    {isCorrect ? "Excellent!" : "Not quite right"}
                  </h4>
                  <p
                    className={cn(
                      "text-lg leading-relaxed",
                      isCorrect
                        ? "text-emerald-800 dark:text-emerald-200/80"
                        : "text-rose-800 dark:text-rose-200/80",
                    )}
                  >
                    {question.explanation}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => {
                    if (currentQuestion < quiz.length - 1) {
                      setCurrentQuestion((c) => c + 1);
                      setSelectedAnswer(null);
                    } else {
                      setShowResult(true);
                    }
                  }}
                  className="flex items-center gap-2 px-8 py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-display font-bold shadow-xl shadow-zinc-900/20 dark:shadow-white/20 transition-all hover:scale-105 active:scale-95"
                >
                  {currentQuestion < quiz.length - 1
                    ? "Next Question"
                    : "See Results"}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
