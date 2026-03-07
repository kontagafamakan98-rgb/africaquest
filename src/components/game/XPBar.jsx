import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function XPBar({ current, max, level, className }) {
  const pct = Math.min((current / max) * 100, 100);

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-white/20 border border-white/30 flex items-center justify-center">
            <span className="text-[10px] font-black text-white">{level}</span>
          </div>
          <span className="text-xs font-bold text-white/80">Level {level}</span>
        </div>
        <span className="text-[11px] text-white/50 font-semibold">{current} / {max} XP</span>
      </div>
      <div className="h-2.5 bg-white/15 rounded-full overflow-hidden border border-white/10">
        <motion.div
          className="h-full rounded-full relative overflow-hidden"
          style={{ background: "linear-gradient(90deg, #a78bfa, #e879f9, #f472b6)" }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
        >
          {/* Shimmer */}
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)",
              animation: "shimmer 2s infinite"
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}