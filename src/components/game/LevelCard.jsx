import { Lock, CheckCircle2, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import StarDisplay from "./StarDisplay";
import { motion } from "framer-motion";
import { DIFFICULTIES } from "./gameData";
import { useT } from "../i18n";

const DIFF_ORDER = ["easy", "medium", "hard"];

export default function LevelCard({ level, isUnlocked, isCompleted, levelScores, onClick, index }) {
  // levelScores = { easy: {score, stars}, medium: {...}, hard: {...} }
  const bestStars = levelScores ? Math.max(...DIFF_ORDER.map(d => levelScores[d]?.stars || 0)) : 0;
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      onClick={() => isUnlocked && onClick(level)}
      disabled={!isUnlocked}
      className={cn(
        "relative w-full text-left rounded-2xl p-5 transition-all duration-300 border-2 group",
        isUnlocked
          ? "bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
          : "bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed"
      )}
    >
      {isCompleted && (
        <div className="absolute -top-2 -right-2 bg-emerald-500 rounded-full p-1 shadow-md">
          <CheckCircle2 className="w-4 h-4 text-white" />
        </div>
      )}
      
      <div className="flex items-start gap-4">
        <div className={cn(
          "w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0",
          isUnlocked ? `bg-gradient-to-br ${level.color} shadow-md` : "bg-slate-200"
        )}>
          {isUnlocked ? level.icon : <Lock className="w-5 h-5 text-slate-400" />}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {useT().level} {level.id}
            </span>
            <span className="text-[10px] font-medium text-slate-400">•</span>
            <span className="text-[10px] font-medium text-slate-400">{level.region}</span>
          </div>
          <h3 className="font-bold text-slate-800 mt-0.5 truncate">{level.title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{level.subtitle}</p>
          
          {isCompleted && (
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              {bestStars > 0 && <StarDisplay count={bestStars} size="sm" />}
              {levelScores && DIFF_ORDER.map((d) => levelScores[d] && (
                <span key={d} className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full", DIFFICULTIES[d].bgColor, DIFFICULTIES[d].textColor)}>
                  {DIFFICULTIES[d].icon}
                </span>
              ))}
            </div>
          )}
          
          {isUnlocked && !isCompleted && (
            <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-violet-600 group-hover:text-violet-700">
              <Play className="w-3.5 h-3.5 fill-current" />
              Play Now
            </div>
          )}
        </div>
      </div>
    </motion.button>
  );
}