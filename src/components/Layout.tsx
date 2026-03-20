import {
  Brain,
  Moon,
  Sun,
  UploadCloud,
  BookOpen,
  HelpCircle,
  Network,
  MessageSquare,
  ChevronDown,
  FileText,
  Trash2,
  MessageSquarePlus,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useStore } from "../store";
import { cn } from "../lib/utils";
import { useEffect, useState, useRef } from "react";
import FeedbackModal from "./FeedbackModal";

export default function Layout() {
  const { topicsStudied, isDarkMode, toggleDarkMode, sessions, activeSessionId, setActiveSession, deleteSession } = useStore();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find(s => s.id === activeSessionId);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { name: "Summary", path: "/summary", icon: BookOpen },
    { name: "Quiz", path: "/quiz", icon: HelpCircle },
    { name: "Map", path: "/map", icon: Network },
    { name: "Tutor", path: "/tutor", icon: MessageSquare },
  ];

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-200",
        isDarkMode ? "bg-zinc-950 text-white" : "bg-white text-zinc-900",
      )}
    >
      <header
        className={cn(
          "sticky top-0 z-50 border-b backdrop-blur-xl transition-all",
          isDarkMode
            ? "border-white/5 bg-zinc-950/80"
            : "border-zinc-200/50 bg-white/80",
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => navigate("/")}
            >
              <div className="bg-zinc-900 dark:bg-white p-2 rounded-lg shadow-sm group-hover:scale-105 transition-all">
                <Brain className="w-5 h-5 text-white dark:text-zinc-900" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight hidden sm:block">
                Nexus
              </span>
            </div>

            {sessions.length > 0 && (
              <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />
            )}

            {sessions.length > 0 && (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 px-3 py-1.5 rounded-md text-sm font-medium transition-colors max-w-[150px] sm:max-w-[200px] border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
                >
                  <FileText className="w-4 h-4 text-zinc-500 shrink-0" />
                  <span className="truncate">{activeSession?.subjectName || 'Select File'}</span>
                  <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden py-1 z-50 shadow-2xl">
                    <div className="px-3 py-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                      Your Files
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {sessions.map(session => (
                        <div 
                          key={session.id}
                          className={cn(
                            "flex items-center justify-between px-3 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 cursor-pointer group",
                            session.id === activeSessionId ? "bg-zinc-100 dark:bg-zinc-800" : ""
                          )}
                          onClick={() => {
                            setActiveSession(session.id);
                            setIsDropdownOpen(false);
                          }}
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <FileText className={cn("w-4 h-4 shrink-0", session.id === activeSessionId ? "text-zinc-900 dark:text-white" : "text-zinc-400")} />
                            <span className={cn("truncate text-sm font-medium", session.id === activeSessionId ? "text-zinc-900 dark:text-white" : "text-zinc-600 dark:text-zinc-400")}>
                              {session.subjectName}
                            </span>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (sessions.length === 1) {
                                deleteSession(session.id);
                                navigate('/');
                              } else {
                                if (session.id === activeSessionId) {
                                  const currentIndex = sessions.findIndex(s => s.id === session.id);
                                  const nextSession = sessions[currentIndex + 1] || sessions[0];
                                  setActiveSession(nextSession.id);
                                }
                                deleteSession(session.id);
                              }
                            }}
                            className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-zinc-100 dark:border-zinc-800 mt-1 p-1">
                      <button 
                        onClick={() => {
                          setIsDropdownOpen(false);
                          navigate('/');
                        }}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-lg transition-colors"
                      >
                        <UploadCloud className="w-4 h-4" />
                        Upload New File
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {activeSession && (
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm"
                        : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800",
                    )
                  }
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-display">{item.name}</span>
                </NavLink>
              ))}
            </nav>
          )}

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-zinc-500"></span>
              {topicsStudied} topics studied
            </div>

            <button
              onClick={() => setIsFeedbackOpen(true)}
              className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              title="Send Feedback"
            >
              <MessageSquarePlus className="w-5 h-5" />
            </button>

            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {activeSession && (
              <button
                onClick={() => navigate("/")}
                className="hidden sm:flex items-center gap-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:scale-105 px-4 py-2 rounded-full text-sm font-bold transition-all shadow-md"
              >
                <UploadCloud className="w-4 h-4" />
                <span className="font-display">New File</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {activeSession && (
        <div className="md:hidden mt-6 mx-4 border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md rounded-full overflow-x-auto shadow-sm">
          <nav className="flex items-center p-1.5 gap-1 min-w-max">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                    isActive
                      ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-800",
                  )
                }
              >
                <item.icon className="w-4 h-4" />
                <span className="font-display">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Outlet />
      </main>

      <FeedbackModal 
        isOpen={isFeedbackOpen} 
        onClose={() => setIsFeedbackOpen(false)} 
      />
    </div>
  );
}
