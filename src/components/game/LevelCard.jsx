import { motion } from "framer-motion";
import { Lock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { LEVEL_IMAGES } from "./gameData";
import StarDisplay from "./StarDisplay";

export default function LevelCard({ level, isUnlocked, isCompleted, levelScores, onClick, index }) {
  const img = LEVEL_IMAGES[level.id];
  const bestStars = levelScores
    ? Math.max(...Object.values(levelScores).map((d) => d.stars || 0))
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      onClick={() => isUnlocked && onClick(level)}
      className={cn(
        "relative rounded-2xl overflow-hidden shadow-md",
        isUnlocked ? "cursor-pointer active:scale-95 transition-transform" : "opacity-60 cursor-not-allowed"
      )}
    >
      {/* Background image */}
      <div className="relative h-32 w-full">
        {img ? (
          <img src={img} alt={level.title} className="w-full h-full object-cover" />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${level.color}`} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Lock overlay */}
        {!isUnlocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Lock className="w-8 h-8 text-white/70" />
          </div>
        )}

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 flex items-end justify-between">
          <div>
            <p className="text-white/60 text-[10px] uppercase tracking-widest font-semibold">{level.region}</p>
            <div className="flex items-center gap-2">
              <span className="text-xl">{level.icon}</span>
              <h3 className="text-white font-extrabold text-base leading-tight">{level.title}</h3>
            </div>
            <p className="text-white/60 text-xs mt-0.5">{level.subtitle}</p>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            {isCompleted && (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            )}
            {levelScores && bestStars > 0 && (
              <StarDisplay count={bestStars} size="sm" />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}