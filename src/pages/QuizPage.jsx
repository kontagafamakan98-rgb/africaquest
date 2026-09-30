import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { progressStore } from "@/api/progress-store";
import { BADGES, getXPForScore, DIFFICULTIES, getLevels } from "../components/game/gameData";
import QuizScreen from "../components/game/QuizScreen";
import ScreenSkeleton from "../components/game/ScreenSkeleton.jsx";
import DifficultyPicker from "../components/game/DifficultyPicker";
import { questionKey } from "../components/game/learning";
import { useLang } from "../components/i18n";
import { localDay, streakAfterPlay } from "../lib/streak";

/**
 * Writes one changed record.
 *
 * Named and annotated rather than left inline, and not for tidiness: a
 * destructured parameter with no type of its own cannot tell the mutation what it
 * is handed, so the mutation would be typed as taking nothing at all and the
 * screen's own call would be reported as a mistake.
 *
 * @param {{ id: string, data: object }} change the profile to write, and what to
 *   write over it
 * @returns {Promise<object>} the record as it was written
 */
function saveProgressChange({ id, data }) {
  return progressStore.update(id, data);
}

function buildNewProgress(progress, levels, { level, difficulty, score, total, stars, xp, timeSeconds }) {
  const diff = DIFFICULTIES[difficulty];
  const prevScores = progress.level_scores || {};
  const prevLevelScores = prevScores[String(level.id)] || {};
  const prevDiffScore = prevLevelScores[difficulty];
  const isNewBest = !prevDiffScore || score > prevDiffScore.score;

  const newLevelScores = {
    ...prevScores,
    [String(level.id)]: {
      ...prevLevelScores,
      // The total travels with the score: the three difficulties no longer
      // ask the same number of questions, so the statistics screen cannot take
      // the length of the whole level for the length of this run.
      [difficulty]: isNewBest ? { score, stars, total } : prevDiffScore,
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
  const newTotalTime = (progress.total_time_seconds || 0) + Math.max(Math.round(timeSeconds || 0), 0);

  // Distinct regions the player has finished at least one level in.
  const exploredRegions = new Set(
    levels.filter((l) => newCompleted.includes(l.id)).map((l) => l.region)
  ).size;

  const currentBadges = progress.badges || [];
  const newBadges = [...currentBadges];
  BADGES.forEach((b) => {
    if (newBadges.includes(b.id)) return;
    if (b.requirement.type === "levels" && newCompleted.length >= b.requirement.count) newBadges.push(b.id);
    if (b.requirement.type === "regions" && exploredRegions >= b.requirement.count) newBadges.push(b.id);
    if (b.requirement.type === "stars" && newStars >= b.requirement.count) newBadges.push(b.id);
    if (b.requirement.type === "xp" && newXP >= b.requirement.count) newBadges.push(b.id);
    if (b.requirement.type === "perfect" && score === total) newBadges.push(b.id);
  });

  // The streak is counted on the player's local calendar, and starts at one on
  // the very first day of play (see src/lib/streak.js for the rules).
  const now = new Date();
  const today = localDay(now);
  const { streakDays } = streakAfterPlay(progress.streak_days, progress.last_played, now);
  if (!newBadges.includes("streak_keeper") && streakDays >= 3) newBadges.push("streak_keeper");

  // Record only the gains, so summing the history always equals the real totals
  // even when a level is replayed with a worse score.
  const history = [
    ...(progress.history || []),
    {
      date: today,
      level: level.id,
      difficulty,
      score,
      total,
      stars: Math.max(starDiff, 0),
      xp: Math.max(xpDiff, 0),
    },
  ].slice(-200);

  return {
    current_level: newCurrentLevel,
    total_xp: newXP,
    stars_earned: newStars,
    completed_levels: newCompleted,
    badges: newBadges,
    level_scores: newLevelScores,
    total_time_seconds: newTotalTime,
    streak_days: streakDays,
    last_played: today,
    history,
  };
}

/**
 * The quiz, reached in two ways: as a page of its own, where the level and the
 * way back come from the address, and from the home screen, which hands both in.
 * So neither prop is required, and each one falls back to the address or to the
 * browser's own back when it is missing.
 *
 * @param {{ levelId?: string|number, onBack?: () => void }} props
 */
export default function QuizPage({ levelId: levelIdProp, onBack }) {
  const queryClient = useQueryClient();
  const [difficulty, setDifficulty] = useState(null);
  const lang = useLang();
  const levels = getLevels(lang);

  const urlParams = new URLSearchParams(window.location.search);
  const levelId = levelIdProp ?? urlParams.get("levelId");
  const handleBack = onBack ?? (() => window.history.back());

  const level = levels.find((l) => l.id === Number(levelId));

  const { data: progressList, isLoading } = useQuery({
    queryKey: ["progress"],
    queryFn: () => progressStore.list(),
    initialData: [],
  });

  const progress = progressList?.[0] || null;

  // Optimistic update mutation
  const updateProgress = useMutation({
    mutationFn: saveProgressChange,
    onMutate: async ({ data }) => {
      await queryClient.cancelQueries({ queryKey: ["progress"] });
      const previous = queryClient.getQueryData(["progress"]);
      // Optimistically update the cache immediately. What the cache holds is
      // checked rather than assumed: this is the first render of the screen, so
      // the list may not be there yet, and a record that is not a list is left
      // as it is rather than replaced with an empty one.
      queryClient.setQueryData(["progress"], (old) => {
        const list = Array.isArray(old) ? old : [];
        return list.map((p) => (p.id === progress?.id ? { ...p, ...data } : p));
      });
      return { previous };
    },
    onError: (_err, _vars, context) => {
      // Roll back on error
      queryClient.setQueryData(["progress"], context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["progress"] });
    },
  });

  // An unknown level id must leave the screen, but never by calling a parent
  // setState during render: that warns and can loop.
  useEffect(() => {
    if (!level) handleBack();
  }, [level]);

  if (!level) return null;

  if (isLoading || !progress) {
    return <ScreenSkeleton variant="quiz" />;
  }

  if (!difficulty) {
    const levelScores = (progress.level_scores || {})[String(level.id)] || {};
    return (
      <DifficultyPicker
        level={level}
        levelScores={levelScores}
        onSelect={setDifficulty}
        onBack={handleBack}
      />
    );
  }

  const handleComplete = ({ score, total, stars, xp, timeSeconds }) => {
    const newData = buildNewProgress(progress, levels, { level, difficulty, score, total, stars, xp, timeSeconds });
    updateProgress.mutate({ id: progress.id, data: newData });
    handleBack();
  };

  return (
    <QuizScreen
      level={level}
      difficulty={difficulty}
      onComplete={handleComplete}
      onBack={() => setDifficulty(null)}
      // The results screen compares this game with the ones already recorded.
      history={progress.history || []}
      onAnswer={(index, isCorrect) => {
        progressStore
          .recordAnswer(questionKey(level.id, index), isCorrect)
          .then(() => queryClient.invalidateQueries({ queryKey: ["progress"] }));
      }}
    />
  );
}