import { useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LEVELS, BADGES } from "../components/game/gameData";
import LevelCard from "../components/game/LevelCard.jsx";

import XPBar from "../components/game/XPBar";
import BadgeCard from "../components/game/BadgeCard";
import PullToRefresh from "../components/game/PullToRefresh";
import SettingsModal from "../components/game/SettingsModal";
import { Map, Award, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useT, getLang } from "../components/i18n";

function getPlayerLevel(xp) { return Math.floor(xp / 200) + 1; }

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "map";
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [, forceUpdate] = useState(0);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const t = useT();

  const TABS = [
    { id: "map", label: t.levelsTab, icon: Map },
    { id: "badges", label: t.badgesTab, icon: Award },
  ];

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
    <div className="flex flex-col min-h-screen bg-slate-50 overflow-hidden">
      {/* Hero */}
      <div
        className="relative text-white px-4 pb-16 overflow-hidden shrink-0"
        style={{
          paddingTop: "calc(2.5rem + var(--sat))",
          background: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 40%, #a21caf 70%, #c026d3 100%)"
        }}
      >
        {/* Decorative continent silhouette */}
        <div className="absolute right-0 top-0 h-full opacity-10 pointer-events-none select-none text-[160px] leading-none">🌍</div>
        {/* Dotted pattern */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

        <div className="max-w-lg mx-auto relative">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-3xl">🌍</span>
                <h1 className="text-xl font-extrabold tracking-tight leading-tight">{t.appTitle}</h1>
              </div>
              <p className="text-purple-200 text-xs font-medium">{t.appSubtitle}</p>
            </div>
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/25 border border-white/20 transition-colors mt-0.5"
            >
              <Settings className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2.5 mb-4">
            <StatBox icon="⭐" value={totalStars} label={t.stars} color="from-amber-400/30 to-yellow-400/20" />
            <StatBox icon="🏆" value={`${completedLevels.length}/${LEVELS.length}`} label={t.levels} color="from-emerald-400/30 to-teal-400/20" />
            <StatBox icon="🔥" value={streakDays} label={t.dayStreak} color="from-orange-400/30 to-red-400/20" />
          </div>

          <XPBar current={xpInCurrentLevel} max={200} level={playerLevel}
            className="[&_span]:text-purple-200 [&_span]:font-normal [&_.font-bold]:text-white [&>div:last-child]:bg-white/20" />
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

      {/* Scrollable content */}
      <div className="flex-1 overflow-hidden" style={{ paddingBottom: "var(--sab)" }}>
        <PullToRefresh onRefresh={handleRefresh}>
          <div className="max-w-lg mx-auto px-4 py-6 pb-10">
            <AnimatePresence mode="wait">
              {activeTab === "map" && (
                <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
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
                    <h3 className="font-bold text-slate-700">{badges.length} {t.of} {BADGES.length} {t.badgesEarned}</h3>
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

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        progressId={progress?.id}
        onLangChange={() => forceUpdate(n => n + 1)}
      />
    </div>
  );
}

function StatBox({ icon, value, label, color }) {
  return (
    <div className={`bg-gradient-to-br ${color} backdrop-blur-sm border border-white/20 rounded-xl p-3 text-center`}>
      <span className="text-xl">{icon}</span>
      <p className="text-lg font-extrabold mt-0.5 leading-tight">{value}</p>
      <p className="text-[10px] text-purple-100 font-semibold uppercase tracking-wide">{label}</p>
    </div>
  );
}