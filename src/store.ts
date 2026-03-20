import { create } from "zustand";

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface ConceptMapData {
  mainTopic: { name: string; explanation: string };
  subTopics: {
    name: string;
    explanation: string;
    details: { name: string; explanation: string }[];
  }[];
}

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export interface LearningPreferences {
  mode: "normal" | "fun";
  favoriteSport?: string;
  favoriteColor?: string;
  hobby?: string;
  passion?: string;
  learningStyle?: "visual" | "auditory" | "kinesthetic";
  difficultyLevel?: "beginner" | "intermediate" | "advanced";
}

export interface StudySession {
  id: string;
  subjectName: string;
  notes: string;
  summary: string;
  quiz: QuizQuestion[];
  conceptMap: ConceptMapData | null;
  chatHistory: ChatMessage[];
  learningPreferences?: LearningPreferences;
}

interface AppState {
  sessions: StudySession[];
  activeSessionId: string | null;
  topicsStudied: number;
  isDarkMode: boolean;

  addSession: (session: Omit<StudySession, 'id' | 'quiz' | 'conceptMap' | 'chatHistory'>) => string;
  setActiveSession: (id: string) => void;
  updateActiveSession: (data: Partial<StudySession>) => void;
  deleteSession: (id: string) => void;
  incrementTopicsStudied: () => void;
  toggleDarkMode: () => void;
}

export const useStore = create<AppState>((set) => ({
  sessions: [],
  activeSessionId: null,
  topicsStudied: 0,
  isDarkMode: false,

  addSession: (sessionData) => {
    const id = crypto.randomUUID();
    const newSession: StudySession = {
      ...sessionData,
      id,
      quiz: [],
      conceptMap: null,
      chatHistory: [],
    };
    set((state) => ({
      sessions: [...state.sessions, newSession],
      activeSessionId: id,
    }));
    return id;
  },
  setActiveSession: (id) => set({ activeSessionId: id }),
  updateActiveSession: (data) => set((state) => ({
    sessions: state.sessions.map(s => s.id === state.activeSessionId ? { ...s, ...data } : s)
  })),
  deleteSession: (id) => set((state) => {
    const index = state.sessions.findIndex(s => s.id === id);
    if (index === -1) return state;

    const newSessions = state.sessions.filter(s => s.id !== id);
    let nextActiveId = state.activeSessionId;

    if (state.activeSessionId === id) {
      if (newSessions.length === 0) {
        nextActiveId = null;
      } else {
        const nextIndex = index < newSessions.length ? index : 0;
        nextActiveId = newSessions[nextIndex].id;
      }
    }

    return {
      sessions: newSessions,
      activeSessionId: nextActiveId
    };
  }),
  incrementTopicsStudied: () =>
    set((state) => ({ topicsStudied: state.topicsStudied + 1 })),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}));
