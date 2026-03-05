import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { LEVELS, getXPForScore } from "../components/game/gameData";
import QuizScreen from "../components/game/QuizScreen";
import { motion } from "framer-motion";

function getXPForNextLevel(xp) {
  return (Math.floor(xp / 200) + 1) * 200;
}

export default function QuizPage() {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
    navigate("/", { replace: true });
    return null;
  }

  if (isLoading || !progress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
          <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full" />
        </motion.div>
      </div>
    );
  }

  const handleComplete = ({ score, total, stars, xp }) => {
    const levelId = level.id;
    const prevScores = progress.level_scores || {};
    const prevLevelScore = prevScores[String(levelId)];
    const isNewBest = !prevLevelScore || score > prevLevelScore.score;

    const newScores = {
      ...prevScores,
      [String(levelId)]: isNewBest ? { score, stars } : prevLevelScore,
    };

    const completed = progress.completed_levels || [];
    const newCompleted = completed.includes(levelId) ? completed : [...completed, levelId];

    const starDiff = isNewBest ? stars - (prevLevelScore?.stars || 0) : 0;
    const xpDiff = isNewBest ? xp - (prevLevelScore ? getXPForScore(prevLevelScore.score, total) : 0) : 0;

    const newXP = (progress.total_xp || 0) + Math.max(xpDiff, 0);
    const newStars = (progress.stars_earned || 0) + Math.max(starDiff, 0);
    const newCurrentLevel = Math.max(progress.current_level || 1, levelId + 1);

    const { BADGES } = require("../components/game/gameData");
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
        level_scores: newScores,
        streak_days: streakDays,
        last_played: today,
      },
    });

    navigate("/", { replace: true });
  };

  return (
    <QuizScreen
      level={level}
      onComplete={handleComplete}
      onBack={() => navigate(-1)}
    />
  );
}