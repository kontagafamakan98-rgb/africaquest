import { Lock, CheckCircle2, Play, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import StarDisplay from "./StarDisplay";
import { motion } from "framer-motion";
import { DIFFICULTIES, LEVEL_IMAGES } from "./gameData";
import { useT } from "../i18n";

const DIFF_ORDER = ["easy", "medium", "hard"];

export default function LevelCard({ level, isUnlocked, isCompleted, levelScores, onClick, index }) {
  const t = useT();
  const bestStars = levelScores ? Math.max(...DIFF_ORDER.map(d => levelScores[d]?.stars || 0)) : 0;
  const img = LEVEL_IMAGES[level.id];

  return (
    <motion.button
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, type: "spring", stiffness: 200, damping: 20 }}
      onClick={() => isUnlocked && onClick(level)}
      disabled={!isUnlocked}
      className={cn(
        "relative w-full text-left rounded-2xl overflow-hidden transition-all duration-300 group shadow-sm",
        isUnlocked
          ? "hover:shadow-xl hover:-translate-y-1 cursor-pointer"
          : "opacity-60 cursor-not-allowed"
      )}
    >
      {/* Image background */}
      <div className="relative h-28 w-full overflow-hidden">
        {img ? (
          <img
            src={img}
            alt={level.title}
            className={cn(
              "w-full h-full object-cover transition-transform duration-500",
              isUnlocked ? "group-hover:scale-105" : "grayscale"
            )}
          />
        ) : (
          <div className={cn("w-full h-full bg-gradient-to-br", level.color)} />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Top badges */}
        <div className="absolute top-2 left-3 flex items-center gap-1.5">
          <span className={cn(
            "text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm",
            isUnlocked ? "bg-white/20 text-white" : "bg-slate-500/50 text-slate-300"
          )}>
            {t.level} {level.id} · {level.region}
          </span>
        </div>

        {isCompleted && (
          <div className="absolute top-2 right-2 bg-emerald-500 rounded-full p-1 shadow-md">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
        )}
        {!isUnlocked && (
          <div className="absolute top-2 right-2 bg-slate-700/70 rounded-full p-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-300" />
          </div>
        )}

        {/* Bottom title overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 pt-6">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="font-extrabold text-white text-base leading-tight drop-shadow">{level.title}</h3>
              <p className="text-white/70 text-xs">{level.subtitle}</p>
            </div>
            <span className="text-2xl drop-shadow">{isUnlocked ? level.icon : "🔒"}</span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={cn(
        "px-4 py-2.5 flex items-center justify-between border-t",
        isUnlocked ? "bg-white border-slate-100" : "bg-slate-50 border-slate-100"
      )}>
        {isCompleted ? (
          <div className="flex items-center gap-3">
            {bestStars > 0 && <StarDisplay count={bestStars} size="sm" />}
            <div className="flex gap-1">
              {DIFF_ORDER.map((d) => levelScores?.[d] && (
                <span key={d} className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full", DIFFICULTIES[d].bgColor, DIFFICULTIES[d].textColor)}>
                  {DIFFICULTIES[d].icon}
                </span>
              ))}
            </div>
          </div>
        ) : isUnlocked ? (
          <div className="flex items-center gap-1 text-xs font-bold text-violet-600">
            <Play className="w-3.5 h-3.5 fill-current" />
            {t.playNow}
          </div>
        ) : (
          <p className="text-xs text-slate-400 font-medium">Complete previous level</p>
        )}
        {isUnlocked && (
          <ChevronRight className={cn("w-4 h-4 transition-transform", isUnlocked && "group-hover:translate-x-1", isCompleted ? "text-emerald-500" : "text-violet-400")} />
        )}
      </div>
    </motion.button>
  );
}