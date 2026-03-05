import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, XCircle, Lightbulb, ChevronLeft, Clock } from "lucide-react";
import StarDisplay from "./StarDisplay";
import { calculateStars, getXPForScore, DIFFICULTIES } from "./gameData";
import { useT } from "../i18n";

export default function QuizScreen({ level, difficulty, onComplete, onBack }) {
  const t = useT();
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const timerRef = useRef(null);

  const diff = DIFFICULTIES[difficulty] || DIFFICULTIES.easy;
  const questions = level.questions;
  const q = questions[currentQ];
  const progress = ((currentQ + (isAnswered ? 1 : 0)) / questions.length) * 100;

  // Timer
  useEffect(() => {
    if (diff.timeLimit === 0 || isAnswered) return;
    setTimeLeft(diff.timeLimit);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleSelect(-1); // time out = wrong
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [currentQ, isAnswered]);

  const handleSelect = (idx) => {
    if (isAnswered) return;
    clearInterval(timerRef.current);
    setSelected(idx);
    setIsAnswered(true);
    if (idx === q.correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setIsAnswered(false);
      setTimeLeft(null);
    } else {
      setShowResults(true);
    }
  };

  if (showResults) {
    const stars = calculateStars(score, questions.length);
    const xp = Math.round(getXPForScore(score, questions.length) * diff.xpMultiplier);
    return (
      <ResultsScreen
        level={level}
        difficulty={diff}
        score={score}
        total={questions.length}
        stars={stars}
        xp={xp}
        onComplete={() => onComplete({ score, total: questions.length, stars, xp })}
      />
    );
  }

  const timerPct = diff.timeLimit > 0 && timeLeft !== null ? (timeLeft / diff.timeLimit) * 100 : 100;
  const timerColor = timerPct > 50 ? "bg-emerald-400" : timerPct > 25 ? "bg-amber-400" : "bg-red-400";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-4 py-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="p-2 rounded-xl hover:bg-slate-100 transition-colors">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex-1">
            <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full bg-gradient-to-r ${level.color}`}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", diff.bgColor, diff.textColor)}>
              {diff.icon} {diff.label}
            </span>
            <span className="text-sm font-bold text-slate-500 tabular-nums">
              {currentQ + 1}/{questions.length}
            </span>
          </div>
        </div>

        {/* Timer bar */}
        {diff.timeLimit > 0 && timeLeft !== null && !isAnswered && (
          <div className="mb-4">
            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                className={cn("h-full rounded-full transition-colors", timerColor)}
                animate={{ width: `${timerPct}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span className={cn("text-xs font-bold tabular-nums", timerPct <= 25 ? "text-red-500" : "text-slate-400")}>
                {timeLeft}s
              </span>
            </div>
          </div>
        )}

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            <div className="text-center mb-8">
              <span className="text-4xl mb-3 block">{level.icon}</span>
              <h2 className="text-xl font-bold text-slate-800 leading-snug">{q.question}</h2>
            </div>

            <div className="space-y-3">
              {q.options.map((opt, idx) => {
                const isCorrect = idx === q.correct;
                const isSelected = idx === selected;
                return (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    onClick={() => handleSelect(idx)}
                    disabled={isAnswered}
                    className={cn(
                      "w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200 font-medium",
                      !isAnswered && "hover:border-violet-300 hover:bg-violet-50 border-slate-200 bg-white",
                      isAnswered && isCorrect && "border-emerald-400 bg-emerald-50 text-emerald-800",
                      isAnswered && isSelected && !isCorrect && "border-red-300 bg-red-50 text-red-700",
                      isAnswered && !isSelected && !isCorrect && "border-slate-100 bg-slate-50 text-slate-400"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0",
                        !isAnswered && "bg-slate-100 text-slate-500",
                        isAnswered && isCorrect && "bg-emerald-200 text-emerald-700",
                        isAnswered && isSelected && !isCorrect && "bg-red-200 text-red-600",
                        isAnswered && !isSelected && !isCorrect && "bg-slate-100 text-slate-300"
                      )}>
                        {isAnswered && isCorrect ? <CheckCircle2 className="w-4 h-4" /> :
                         isAnswered && isSelected && !isCorrect ? <XCircle className="w-4 h-4" /> :
                         String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 space-y-4"
                >
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                    <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800 leading-relaxed">{q.fact}</p>
                  </div>
                  <Button
                    onClick={handleNext}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white font-bold text-base shadow-lg shadow-violet-200"
                  >
                    {currentQ < questions.length - 1 ? (
                      <>{t.continue} <ArrowRight className="w-4 h-4 ml-2" /></>
                    ) : t.seeResults}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function ResultsScreen({ level, difficulty, score, total, stars, xp, onComplete }) {
  const t = useT();
  const pct = Math.round((score / total) * 100);
  const message = pct === 100 ? t.perfect : pct >= 70 ? t.greatJob : pct >= 50 ? t.goodTry : t.keepPracticing;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="w-full max-w-sm text-center"
      >
        <div className="text-6xl mb-4">{level.icon}</div>
        <h2 className="text-2xl font-extrabold text-slate-800 mb-1">{message}</h2>
        <p className="text-slate-500 mb-2">{level.title} Complete</p>
        <span className={cn("text-sm font-bold px-3 py-1 rounded-full inline-block mb-8", difficulty.bgColor, difficulty.textColor)}>
          {difficulty.icon} {difficulty.label} Mode · {difficulty.xpMultiplier}× XP
        </span>

        <div className="bg-white rounded-2xl border-2 border-slate-100 p-6 shadow-sm mb-6">
          <div className="flex justify-center mb-4">
            <StarDisplay count={stars} size="lg" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-2xl font-extrabold text-slate-800">{score}/{total}</p>
              <p className="text-xs text-slate-500 font-medium">Correct</p>
            </div>
            <div className="bg-violet-50 rounded-xl p-3">
              <p className="text-2xl font-extrabold text-violet-600">+{xp}</p>
              <p className="text-xs text-violet-500 font-medium">XP Earned</p>
            </div>
          </div>
        </div>

        <Button
          onClick={onComplete}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white font-bold text-base shadow-lg shadow-violet-200"
        >
          Continue
        </Button>
      </motion.div>
    </div>
  );
}