import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { LEVELS, BADGES, getXPForScore, DIFFICULTIES } from "../components/game/gameData";
import QuizScreen from "../components/game/QuizScreen";
import DifficultyPicker from "../components/game/DifficultyPicker";
import { motion } from "framer-motion";

export default function QuizPage({ levelId: levelIdProp, onBack }) {
  const queryClient = useQueryClient();
  const [difficulty, setDifficulty] = useState(null);

  // Support both inline usage (props) and standalone page (URL params)
  const urlParams = new URLSearchParams(window.location.search);
  const levelId = levelIdProp ?? urlParams.get("levelId");
  const handleBack = onBack ?? (() => window.history.back());

  const level = LEVELS.find((l) => l.id === Number(levelId));

  const { data: progressList, isLoading } = useQuery({
    queryKey: ["progress"],
    queryFn: () => base44.entities.PlayerProgress.list(),
    initialData: [],
  });

  const progress = progressList?.[0] || null;

  const updateProgress = useMutation({
    mutationFn: ({ id, data }) => base44.entities.PlayerProgress.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["progress"] }),
  });

  if (!level) {
    handleBack();
    return null;
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

  if (!difficulty) {
    const levelScores = (progress.level_scores || {})[String(level.id)] || {};
    return (
      <DifficultyPicker
        level={level}
        levelScores={levelScores}
        onSelect={setDifficulty}
        onBack={onBack}
      />
    );
  }

  const handleComplete = ({ score, total, stars, xp }) => {
    const diff = DIFFICULTIES[difficulty];
    const prevScores = progress.level_scores || {};
    const prevLevelScores = prevScores[String(level.id)] || {};
    const prevDiffScore = prevLevelScores[difficulty];
    const isNewBest = !prevDiffScore || score > prevDiffScore.score;

    const newLevelScores = {
      ...prevScores,
      [String(level.id)]: {
        ...prevLevelScores,
        [difficulty]: isNewBest ? { score, stars } : prevDiffScore,
      },
    };

    const completed = progress.completed_levels || [];
    const newCompleted = completed.includes(level.id) ? completed : [...completed, level.id];

    const starDiff = isNewBest ? stars - (prevDiffScore?.stars || 0) : 0;
    const prevXP = prevDiffScore ? Math.round(getXPForScore(prevDiffScore.score, total) * diff.xpMultiplier) : 0;
    const xpDiff = isNewBest ? xp - prevXP : 0;

    const newXP = (progress.total_xp || 0) + Math.max(xpDiff, 0);
    const newStars = (progress.stars_earned || 0) + Math.max(starDiff, 0);
    const newCurrentLevel = Math.max(progress.current_level || 1, level.id + 1);

    const currentBadges = progress.badges || [];
    const newBadges = [...currentBadges];
    BADGES.forEach((b) => {
      if (newBadges.includes(b.id)) return;
      if (b.requirement.type === "levels" && newCompleted.length >= b.requirement.count) newBadges.push(b.id);
      if (b.requirement.type === "stars" && newStars >= b.requirement.count) newBadges.push(b.id);
      if (b.requirement.type === "xp" && newXP >= b.requirement.count) newBadges.push(b.id);
      if (b.requirement.type === "perfect" && score === total) newBadges.push(b.id);
    });

    const today = new Date().toISOString().split("T")[0];
    const lastPlayed = progress.last_played;
    let streakDays = progress.streak_days || 0;
    if (lastPlayed !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      streakDays = lastPlayed === yesterday ? streakDays + 1 : 1;
    }
    if (!newBadges.includes("streak_keeper") && streakDays >= 3) newBadges.push("streak_keeper");

    updateProgress.mutate({
      id: progress.id,
      data: {
        current_level: newCurrentLevel,
        total_xp: newXP,
        stars_earned: newStars,
        completed_levels: newCompleted,
        badges: newBadges,
        level_scores: newLevelScores,
        streak_days: streakDays,
        last_played: today,
      },
    });

    onBack();
  };

  return (
    <QuizScreen
      level={level}
      difficulty={difficulty}
      onComplete={handleComplete}
      onBack={() => setDifficulty(null)}
    />
  );
}