import { Flame, GraduationCap, Sprout, Zap } from "lucide-react";

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

/**
 * The fourth way to sit a level, and the one that is not a difficulty.
 *
 * It is kept out of DIFFICULTIES on purpose. A difficulty is a promise about
 * pace - the clock and the multiplier - and the statistics screen compares a
 * player's success rate across the three of them, which is a comparison between
 * beaten paths. An exam is not a pace, it is a test: the whole level, no clock,
 * no hints, no verdict until the last question, and nothing awarded at the end.
 * Written into the difficulty table it would arrive on that comparison with an
 * unbeaten score and quietly change what the screen is comparing.
 *
 * So it carries the three things a screen needs to draw it - a label, an icon
 * and a colour - and the two numbers a run reads: no clock at all, and nothing
 * to multiply, because an exam is marked and not paid.
 */
export const EXAM = {
  id: "exam",
  label: "Exam",
  icon: GraduationCap,
  timeLimit: 0,
  xpMultiplier: 0,
  bgColor: "bg-slate-50",
  borderColor: "border-slate-300",
  textColor: "text-slate-700",
};

/**
 * The settings a quiz screen can be opened with, in one list.
 *
 * The picker draws the three difficulties and the exam beside them, and the
 * quiz reads the setting back by id, so the two agree about what an id means
 * rather than each holding half of it.
 */
export const GAME_MODES = { ...DIFFICULTIES, [EXAM.id]: EXAM };
