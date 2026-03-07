import { motion } from "framer-motion";
import { Lock, ChevronRight } from "lucide-react";
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, type: "spring", stiffness: 200, damping: 20 }}
      onClick={() => isUnlocked && onClick(level)}
      className={cn(
        "relative rounded-3xl overflow-hidden",
        isUnlocked
          ? "cursor-pointer active:scale-[0.97] transition-transform duration-150 shadow-lg hover:shadow-xl"
          : "opacity-50 cursor-not-allowed shadow-sm"
      )}
      style={{ height: 140 }}
    >
      {/* Background image */}
      {img ? (
        <img src={img} alt={level.title} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${level.color}`} />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/10" />

      {/* Locked overlay */}
      {!isUnlocked && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20">
            <Lock className="w-6 h-6 text-white/80" />
          </div>
        </div>
      )}

      {/* Left accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${level.color}`} />

      {/* Content */}
      <div className="absolute inset-0 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Icon badge */}
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${level.color} flex items-center justify-center shadow-lg shrink-0 border-2 border-white/30`}>
            <span className="text-2xl">{level.icon}</span>
          </div>

          <div>
            <p className="text-white/50 text-[10px] uppercase tracking-[0.15em] font-bold mb-0.5">{level.region}</p>
            <h3 className="text-white font-extrabold text-lg leading-tight drop-shadow">{level.title}</h3>
            <p className="text-white/60 text-xs mt-0.5">{level.subtitle}</p>
            {bestStars > 0 && (
              <div className="mt-1.5">
                <StarDisplay count={bestStars} size="sm" />
              </div>
            )}
          </div>
        </div>

        {/* Right side */}
        {isUnlocked && (
          <div className="flex flex-col items-center gap-2 shrink-0">
            {isCompleted ? (
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center">
                <span className="text-lg">✓</span>
              </div>
            ) : (
              <div className="w-9 h-9 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center">
                <ChevronRight className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Level number badge */}
      <div className="absolute top-3 right-3">
        <span className="text-[10px] font-black text-white/40 bg-black/20 rounded-full px-2 py-0.5">
          #{level.id}
        </span>
      </div>
    </motion.div>
  );
}