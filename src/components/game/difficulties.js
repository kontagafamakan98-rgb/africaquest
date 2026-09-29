import { Flame, Sprout, Zap } from "lucide-react";

/**
 * The three ways a level can be played.
 *
 * It sits outside gameData.js on purpose. The map screen reads the difficulty
 * list to compare the player's success rates, and gameData.js carries the whole
 * content of the game - the questions, their facts and their sources - which the
 * entry file must not pull in for the sake of three rows. Re-exported from there
 * so the quiz screens keep finding it where they always did.
 */
export const DIFFICULTIES = {
  easy: {
    id: "easy",
    label: "Easy",
    icon: Sprout,
    description: "No time limit · 1× XP",
    timeLimit: 0,
    xpMultiplier: 1,
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-300",
    textColor: "text-emerald-700",
  },
  medium: {
    id: "medium",
    label: "Medium",
    icon: Zap,
    description: "30s per question · 1.5× XP",
    timeLimit: 30,
    xpMultiplier: 1.5,
    bgColor: "bg-amber-50",
    borderColor: "border-amber-300",
    textColor: "text-amber-700",
  },
  hard: {
    id: "hard",
    label: "Hard",
    icon: Flame,
    description: "15s per question · 2× XP",
    timeLimit: 15,
    xpMultiplier: 2,
    bgColor: "bg-red-50",
    borderColor: "border-red-300",
    textColor: "text-red-700",
  },
};
