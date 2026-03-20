import { useState } from "react";
import { X, Sparkles, Palette, Gamepad2, Heart, Activity, BookOpen, Eye, Ear, Hand, Signal, SignalHigh, SignalMedium, SignalLow } from "lucide-react";
import { cn } from "../lib/utils";
import { LearningPreferences } from "../store";

interface LearningPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preferences: LearningPreferences) => void;
}

export default function LearningPreferencesModal({ isOpen, onClose, onSave }: LearningPreferencesModalProps) {
  const [mode, setMode] = useState<"normal" | "fun">("normal");
  const [favoriteSport, setFavoriteSport] = useState("");
  const [favoriteColor, setFavoriteColor] = useState("");
  const [hobby, setHobby] = useState("");
  const [passion, setPassion] = useState("");
  const [learningStyle, setLearningStyle] = useState<"visual" | "auditory" | "kinesthetic">("visual");
  const [difficultyLevel, setDifficultyLevel] = useState<"beginner" | "intermediate" | "advanced">("intermediate");

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      mode,
      learningStyle,
      difficultyLevel,
      ...(mode === "fun" && {
        favoriteSport,
        favoriteColor,
        hobby,
        passion,
      }),
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 dark:border-zinc-800/50">
          <h2 className="text-xl font-display font-semibold flex items-center gap-2 text-zinc-900 dark:text-white">
            <Sparkles className="w-5 h-5 text-zinc-900 dark:text-white" />
            Customize your learning
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Learning Mode
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setMode("normal")}
                className={cn(
                  "flex flex-col items-start justify-center gap-3 p-5 rounded-2xl transition-all border",
                  mode === "normal"
                    ? "bg-zinc-50 border-zinc-900 text-zinc-900 dark:bg-zinc-800/50 dark:border-white dark:text-white shadow-sm"
                    : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700"
                )}
              >
                <div className={cn("p-2.5 rounded-xl", mode === "normal" ? "bg-zinc-200 dark:bg-zinc-700" : "bg-zinc-100 dark:bg-zinc-800")}>
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="block font-display font-semibold text-base mb-1">Standard</span>
                  <span className="block text-xs opacity-80">Academic & structured</span>
                </div>
              </button>
              
              <button
                type="button"
                onClick={() => setMode("fun")}
                className={cn(
                  "flex flex-col items-start justify-center gap-3 p-5 rounded-2xl transition-all border",
                  mode === "fun"
                    ? "bg-zinc-50 border-zinc-900 text-zinc-900 dark:bg-zinc-800/50 dark:border-white dark:text-white shadow-sm"
                    : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700"
                )}
              >
                <div className={cn("p-2.5 rounded-xl", mode === "fun" ? "bg-zinc-200 dark:bg-zinc-700" : "bg-zinc-100 dark:bg-zinc-800")}>
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="block font-display font-semibold text-base mb-1">Creative</span>
                  <span className="block text-xs opacity-80">Gamified & personalized</span>
                </div>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Learning Style
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setLearningStyle("visual")}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all border",
                  learningStyle === "visual"
                    ? "bg-zinc-50 border-zinc-900 text-zinc-900 dark:bg-zinc-800/50 dark:border-white dark:text-white shadow-sm"
                    : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700"
                )}
              >
                <Eye className="w-5 h-5" />
                <span className="font-medium text-sm">Visual</span>
              </button>
              <button
                type="button"
                onClick={() => setLearningStyle("auditory")}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all border",
                  learningStyle === "auditory"
                    ? "bg-zinc-50 border-zinc-900 text-zinc-900 dark:bg-zinc-800/50 dark:border-white dark:text-white shadow-sm"
                    : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700"
                )}
              >
                <Ear className="w-5 h-5" />
                <span className="font-medium text-sm">Auditory</span>
              </button>
              <button
                type="button"
                onClick={() => setLearningStyle("kinesthetic")}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all border",
                  learningStyle === "kinesthetic"
                    ? "bg-zinc-50 border-zinc-900 text-zinc-900 dark:bg-zinc-800/50 dark:border-white dark:text-white shadow-sm"
                    : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700"
                )}
              >
                <Hand className="w-5 h-5" />
                <span className="font-medium text-sm">Kinesthetic</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setDifficultyLevel("beginner")}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all border",
                  difficultyLevel === "beginner"
                    ? "bg-zinc-50 border-zinc-900 text-zinc-900 dark:bg-zinc-800/50 dark:border-white dark:text-white shadow-sm"
                    : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700"
                )}
              >
                <SignalLow className="w-5 h-5" />
                <span className="font-medium text-sm">Beginner</span>
              </button>
              <button
                type="button"
                onClick={() => setDifficultyLevel("intermediate")}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all border",
                  difficultyLevel === "intermediate"
                    ? "bg-zinc-50 border-zinc-900 text-zinc-900 dark:bg-zinc-800/50 dark:border-white dark:text-white shadow-sm"
                    : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700"
                )}
              >
                <SignalMedium className="w-5 h-5" />
                <span className="font-medium text-sm">Intermediate</span>
              </button>
              <button
                type="button"
                onClick={() => setDifficultyLevel("advanced")}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all border",
                  difficultyLevel === "advanced"
                    ? "bg-zinc-50 border-zinc-900 text-zinc-900 dark:bg-zinc-800/50 dark:border-white dark:text-white shadow-sm"
                    : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700"
                )}
              >
                <SignalHigh className="w-5 h-5" />
                <span className="font-medium text-sm">Advanced</span>
              </button>
            </div>
          </div>

          {mode === "fun" && (
            <div className="space-y-6 animate-in slide-in-from-top-4 fade-in duration-300">
              <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700/50">
                <p className="text-sm text-zinc-600 dark:text-zinc-300 font-medium">
                  Tell me a bit about yourself so I can tailor the examples and analogies just for you!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-2 uppercase tracking-wider">
                    <Activity className="w-4 h-4 text-zinc-400" />
                    Favorite Sport
                  </label>
                  <input
                    type="text"
                    value={favoriteSport}
                    onChange={(e) => setFavoriteSport(e.target.value)}
                    placeholder="e.g. Basketball, Soccer"
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-white/20 focus:border-zinc-900 dark:focus:border-white transition-all text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-2 uppercase tracking-wider">
                    <Palette className="w-4 h-4 text-zinc-400" />
                    Favorite Color
                  </label>
                  <input
                    type="text"
                    value={favoriteColor}
                    onChange={(e) => setFavoriteColor(e.target.value)}
                    placeholder="e.g. Neon Green, Crimson"
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-white/20 focus:border-zinc-900 dark:focus:border-white transition-all text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-2 uppercase tracking-wider">
                    <Gamepad2 className="w-4 h-4 text-zinc-400" />
                    Hobby
                  </label>
                  <input
                    type="text"
                    value={hobby}
                    onChange={(e) => setHobby(e.target.value)}
                    placeholder="e.g. Video games, Painting"
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-white/20 focus:border-zinc-900 dark:focus:border-white transition-all text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-2 uppercase tracking-wider">
                    <Heart className="w-4 h-4 text-zinc-400" />
                    Passion
                  </label>
                  <input
                    type="text"
                    value={passion}
                    onChange={(e) => setPassion(e.target.value)}
                    placeholder="e.g. Space, Music, Animals"
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 dark:focus:ring-white/20 focus:border-zinc-900 dark:focus:border-white transition-all text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/20 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full font-medium text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-full font-medium text-sm bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 transition-all shadow-sm"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
