import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";

export default function BadgeCard({ badge, earned, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 250, damping: 20 }}
      className={cn(
        "relative flex flex-col items-center text-center p-4 rounded-3xl border overflow-hidden",
        earned
          ? "bg-gradient-to-b from-amber-500/15 to-transparent border-amber-400/30 shadow-md shadow-amber-900/20"
          : "bg-white/4 border-white/8"
      )}
    >
      {earned && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-24 h-24 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
      )}

      {/* Icon */}
      <div className={cn(
        "w-14 h-14 rounded-2xl flex items-center justify-center mb-3 text-3xl relative border",
        earned
          ? "bg-gradient-to-br from-amber-400/20 to-yellow-500/10 border-amber-400/30"
          : "bg-white/5 border-white/10 grayscale opacity-40"
      )}>
        <span>{badge.icon}</span>
        {!earned && (
          <div className="absolute -bottom-1 -right-1 bg-slate-700 rounded-full p-0.5 border border-slate-600">
            <Lock className="w-3 h-3 text-slate-400" />
          </div>
        )}
      </div>

      <h4 className={cn(
        "font-extrabold text-sm leading-tight",
        earned ? "text-white" : "text-white/25"
      )}>{badge.name}</h4>
      <p className={cn(
        "text-[11px] mt-1 leading-snug",
        earned ? "text-white/50" : "text-white/20"
      )}>{badge.description}</p>

      {earned && (
        <div className="mt-2.5 px-3 py-0.5 bg-amber-400/20 rounded-full border border-amber-400/30">
          <span className="text-[10px] font-black text-amber-300 uppercase tracking-wide">Earned ✓</span>
        </div>
      )}
    </motion.div>
  );
}