import { useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LEVELS, BADGES } from "../components/game/gameData";
import LevelCard from "../components/game/LevelCard";
import XPBar from "../components/game/XPBar";
import BadgeCard from "../components/game/BadgeCard";
import PullToRefresh from "../components/game/PullToRefresh";
import SettingsModal from "../components/game/SettingsModal";
import { Map, Award, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const TABS = [
  { id: "map", label: "Levels", icon: Map },
  { id: "badges", label: "Badges", icon: Award },
];

function getPlayerLevel(xp) { return Math.floor(xp / 200) + 1; }

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "map";
  const [settingsOpen, setSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: progressList, isLoading } = useQuery({
    queryKey: ["progress"],
    queryFn: () => base44.entities.PlayerProgress.list(),
    initialData: [],
  });

  const progress = progressList?.[0] || null;

  // Auto-create progress if missing
  useEffect(() => {
    if (!isLoading && !progress) {
      base44.entities.PlayerProgress.create({
        current_level: 1, total_xp: 0, stars_earned: 0,
        completed_levels: [], badges: [], level_scores: {},
        streak_days: 0, last_played: new Date().toISOString().split("T")[0],
      }).then(() => queryClient.invalidateQueries({ queryKey: ["progress"] }));
    }
  }, [isLoading, progress]);

  const handleRefresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["progress"] });
  }, [queryClient]);

  const setTab = (id) => setSearchParams({ tab: id }, { replace: true });

  if (isLoading || !progress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
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

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden">
      {/* Hero */}
      <div
        className="bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 text-white px-4 pb-16 relative overflow-hidden shrink-0"
        style={{ paddingTop: "calc(2.5rem + var(--sat))" }}
      >
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="max-w-lg mx-auto relative">
          <div className="flex items-start justify-between mb-1">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl">🌍</span>
                <h1 className="text-2xl font-extrabold tracking-tight">Africa History Quest</h1>
              </div>
              <p className="text-violet-200 text-sm font-medium mt-0.5">Explore the amazing history of Africa!</p>
            </div>
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors mt-1"
            >
              <Settings className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-5 mt-5">
            <StatBox icon="⭐" value={totalStars} label="Stars" />
            <StatBox icon="🏆" value={completedLevels.length} label={`of ${LEVELS.length} Levels`} />
            <StatBox icon="🔥" value={streakDays} label="Day Streak" />
          </div>

          <XPBar current={xpInCurrentLevel} max={200} level={playerLevel}
            className="[&_span]:text-violet-200 [&_span]:font-normal [&_.font-bold]:text-white [&>div:last-child]:bg-white/20" />
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="max-w-lg w-full mx-auto px-4 -mt-6 shrink-0 z-10">
        <div className="tab-bar-bg bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 p-1.5 flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all",
                activeTab === tab.id ? "bg-violet-100 text-violet-700" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable content with pull-to-refresh */}
      <div className="flex-1 overflow-hidden" style={{ paddingBottom: "var(--sab)" }}>
        <PullToRefresh onRefresh={handleRefresh}>
          <div className="max-w-lg mx-auto px-4 py-6 pb-10">
            <AnimatePresence mode="wait">
              {activeTab === "map" && (
                <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                  {LEVELS.map((level, i) => {
                    const isUnlocked = level.id <= (progress.current_level || 1);
                    const isCompleted = completedLevels.includes(level.id);
                    const stars = levelScores[String(level.id)]?.stars || 0;
                    return (
                      <LevelCard
                        key={level.id}
                        level={level}
                        isUnlocked={isUnlocked}
                        isCompleted={isCompleted}
                        stars={stars}
                        onClick={(lvl) => navigate(`/quiz/${lvl.id}`)}
                        index={i}
                      />
                    );
                  })}
                </motion.div>
              )}

              {activeTab === "badges" && (
                <motion.div key="badges" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="w-5 h-5 text-amber-500" />
                    <h3 className="font-bold text-slate-700">{badges.length} of {BADGES.length} Badges Earned</h3>
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

      {/* Settings modal */}
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} progressId={progress?.id} />
    </div>
  );
}

function StatBox({ icon, value, label }) {
  return (
    <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
      <span className="text-lg">{icon}</span>
      <p className="text-xl font-extrabold mt-0.5">{value}</p>
      <p className="text-[10px] text-violet-200 font-medium uppercase tracking-wide">{label}</p>
    </div>
  );
}