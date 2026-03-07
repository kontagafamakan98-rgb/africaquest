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

  return (
    <div className="flex flex-col min-h-screen overflow-hidden" style={{ background: "#0f0a1e" }}>
      {/* Hero */}
      <div
        className="relative text-white px-4 pb-20 overflow-hidden shrink-0"
        style={{
          paddingTop: "calc(2.5rem + var(--sat))",
          background: "linear-gradient(160deg, #1a0533 0%, #3b0764 30%, #581c87 60%, #7c3aed 100%)"
        }}
      >
        {/* Background orbs */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 pointer-events-none" style={{ background: "radial-gradient(circle, #a855f7, transparent 70%)", transform: "translate(30%, -30%)" }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-15 pointer-events-none" style={{ background: "radial-gradient(circle, #ec4899, transparent 70%)", transform: "translate(-30%, 30%)" }} />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        <div className="max-w-lg mx-auto relative">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                  <span className="text-xl">🌍</span>
                </div>
                <h1 className="text-xl font-extrabold tracking-tight leading-tight text-white">{t.appTitle}</h1>
              </div>
              <p className="text-purple-300/70 text-xs font-medium pl-0.5">{t.appSubtitle}</p>
            </div>
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-2.5 rounded-xl bg-white/8 hover:bg-white/15 border border-white/15 transition-colors mt-0.5 backdrop-blur-sm"
            >
              <Settings className="w-5 h-5 text-white/70" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2.5 mb-5">
            <StatBox icon="⭐" value={totalStars} label={t.stars} gradient="from-amber-400 to-orange-500" />
            <StatBox icon="🏆" value={`${completedLevels.length}/${LEVELS.length}`} label={t.levels} gradient="from-emerald-400 to-teal-500" />
            <StatBox icon="🔥" value={streakDays} label={t.dayStreak} gradient="from-rose-400 to-pink-500" />
          </div>

          <XPBar current={xpInCurrentLevel} max={200} level={playerLevel} />
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="max-w-lg w-full mx-auto px-4 -mt-7 shrink-0 z-10">
        <div className="bg-[#1a1030] rounded-2xl shadow-2xl border border-white/8 p-1.5 flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all duration-200",
                activeTab === tab.id
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-900/50"
                  : "text-white/40 hover:text-white/70"
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
          <div className="max-w-lg mx-auto px-4 py-5 pb-10">
            <AnimatePresence mode="wait">
              {activeTab === "map" && (
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
                        onClick={(lvl) => navigate(`/quiz/${lvl.id}`)}
                        index={i}
                      />
                    );
                  })}
                </motion.div>
              )}

              {activeTab === "badges" && (
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

      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
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