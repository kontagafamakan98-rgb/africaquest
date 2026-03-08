import { useState, useCallback, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LEVELS, BADGES } from "../components/game/gameData";
import LevelCard from "../components/game/LevelCard.jsx";
import XPBar from "../components/game/XPBar";
import BadgeCard from "../components/game/BadgeCard";
import PullToRefresh from "../components/game/PullToRefresh";
import SettingsModal from "../components/game/SettingsModal";
import QuizPage from "./QuizPage";
import { Map, Award, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useT } from "../components/i18n";

function getPlayerLevel(xp) { return Math.floor(xp / 200) + 1; }

const TABS = [
  { id: "map", icon: Map, labelKey: "levelsTab" },
  { id: "badges", icon: Award, labelKey: "badgesTab" },
  { id: "settings", icon: Settings, labelKey: "settings" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("map");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedLevelId, setSelectedLevelId] = useState(null);
  const [, forceUpdate] = useState(0);
  const queryClient = useQueryClient();
  const t = useT();

  // Preserve scroll positions per tab
  const scrollRefs = useRef({ map: 0, badges: 0 });
  const scrollContainerRef = useRef(null);

  const { data: progressList, isLoading } = useQuery({
    queryKey: ["progress"],
    queryFn: () => base44.entities.PlayerProgress.list(),
    initialData: [],
  });

  const progress = progressList?.[0] || null;

  useEffect(() => {
    if (!isLoading && !progress) {
      base44.entities.PlayerProgress.create({
        current_level: 1, total_xp: 0, stars_earned: 0,
        completed_levels: [], badges: [], level_scores: {},
        streak_days: 0, last_played: new Date().toISOString().split("T")[0],
      }).then(() => queryClient.invalidateQueries({ queryKey: ["progress"] }));
    }
  }, [isLoading, progress]);

  // Save/restore scroll on tab switch
  const handleTabChange = (tabId) => {
    if (scrollContainerRef.current) {
      scrollRefs.current[activeTab] = scrollContainerRef.current.scrollTop;
    }
    setActiveTab(tabId);
    if (tabId === "settings") {
      setSettingsOpen(true);
      return;
    }
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollRefs.current[tabId] || 0;
      }
    }, 0);
  };

  const handleRefresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["progress"] });
  }, [queryClient]);

  // Show quiz page inline
  if (selectedLevelId !== null) {
    return (
      <QuizPage
        levelId={selectedLevelId}
        onBack={() => setSelectedLevelId(null)}
      />
    );
  }

  if (isLoading || !progress) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0f0a1e" }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full" />
        </motion.div>
      </div>
    );
  }

  const totalStars = progress.stars_earned || 0;
  const totalXP = progress.total_xp || 0;
  const playerLevel = getPlayerLevel(totalXP);
  const xpInCurrentLevel = totalXP - (playerLevel - 1) * 200;
  const completedLevels = progress.completed_levels || [];
  const badges = progress.badges || [];
  const levelScores = progress.level_scores || {};
  const streakDays = progress.streak_days || 0;

  const activeTabId = activeTab === "settings" ? "map" : activeTab;

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: "#0f0a1e" }}>
      {/* Hero Header */}
      <div
        className="relative text-white px-4 pb-5 overflow-hidden shrink-0"
        style={{
          paddingTop: "calc(2.5rem + var(--sat))",
          background: "linear-gradient(160deg, #1a0533 0%, #3b0764 30%, #581c87 60%, #7c3aed 100%)"
        }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 pointer-events-none" style={{ background: "radial-gradient(circle, #a855f7, transparent 70%)", transform: "translate(30%, -30%)" }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-15 pointer-events-none" style={{ background: "radial-gradient(circle, #ec4899, transparent 70%)", transform: "translate(-30%, 30%)" }} />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        <div className="max-w-lg mx-auto relative">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
              <span className="text-xl">🌍</span>
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight leading-tight text-white">{t.appTitle}</h1>
              <p className="text-purple-300/70 text-[11px] font-medium">{t.appSubtitle}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <StatBox icon="⭐" value={totalStars} label={t.stars} gradient="from-amber-400 to-orange-500" />
            <StatBox icon="🏆" value={`${completedLevels.length}/${LEVELS.length}`} label={t.levels} gradient="from-emerald-400 to-teal-500" />
            <StatBox icon="🔥" value={streakDays} label={t.dayStreak} gradient="from-rose-400 to-pink-500" />
          </div>

          <XPBar current={xpInCurrentLevel} max={200} level={playerLevel} />
        </div>
      </div>

      {/* Scrollable content area */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <PullToRefresh onRefresh={handleRefresh}>
          <div className="max-w-lg mx-auto px-4 pt-5 pb-6">
            <AnimatePresence mode="wait">
              {activeTabId === "map" && (
                <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                  <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-4 px-1">
                    {completedLevels.length} of {LEVELS.length} Completed
                  </p>
                  {LEVELS.map((level, i) => {
                    const isUnlocked = level.id <= (progress.current_level || 1);
                    const isCompleted = completedLevels.includes(level.id);
                    const perLevelScores = levelScores[String(level.id)] || null;
                    return (
                      <LevelCard
                        key={level.id}
                        level={level}
                        isUnlocked={isUnlocked}
                        isCompleted={isCompleted}
                        levelScores={perLevelScores}
                        onClick={(lvl) => setSelectedLevelId(lvl.id)}
                        index={i}
                      />
                    );
                  })}
                </motion.div>
              )}

              {activeTabId === "badges" && (
                <motion.div key="badges" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="flex items-center gap-2 mb-5 px-1">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                      <Award className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-white text-sm">{t.badgesEarned}</h3>
                      <p className="text-white/30 text-xs">{badges.length} {t.of} {BADGES.length} unlocked</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {BADGES.map((badge, i) => (
                      <BadgeCard key={badge.id} badge={badge} earned={badges.includes(badge.id)} index={i} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </PullToRefresh>
      </div>

      {/* Fixed Bottom Navigation Bar */}
      <div
        className="shrink-0 bg-[#1a1030] border-t border-white/8 flex"
        style={{ paddingBottom: "var(--sab)" }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id || (tab.id === "settings" && settingsOpen);
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-all duration-200",
                isActive ? "text-violet-400" : "text-white/30 hover:text-white/60"
              )}
            >
              <tab.icon className={cn("w-5 h-5 transition-transform", isActive && "scale-110")} />
              <span className="text-[10px] font-bold uppercase tracking-wide">{t[tab.labelKey]}</span>
              {isActive && tab.id !== "settings" && (
                <div className="absolute bottom-0 w-6 h-0.5 rounded-full bg-violet-400" />
              )}
            </button>
          );
        })}
      </div>

      <SettingsModal
        open={settingsOpen}
        onClose={() => { setSettingsOpen(false); setActiveTab("map"); }}
        progressId={progress?.id}
        onLangChange={() => forceUpdate(n => n + 1)}
      />
    </div>
  );
}

function StatBox({ icon, value, label, gradient }) {
  return (
    <div className="bg-white/6 backdrop-blur-sm border border-white/10 rounded-2xl p-3 text-center relative overflow-hidden">
      <div className={`absolute inset-0 opacity-10 bg-gradient-to-br ${gradient}`} />
      <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mx-auto mb-1.5 shadow-lg`}>
        <span className="text-base">{icon}</span>
      </div>
      <p className="text-lg font-extrabold leading-tight text-white">{value}</p>
      <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-0.5">{label}</p>
    </div>
  );
}