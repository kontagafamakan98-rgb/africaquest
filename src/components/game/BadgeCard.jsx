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
        "relative flex flex-col items-center text-center p-4 rounded-3xl border-2 transition-all overflow-hidden",
        earned
          ? "bg-gradient-to-b from-amber-50 to-white border-amber-200 shadow-md shadow-amber-100/60"
          : "bg-slate-50 border-slate-100"
      )}
    >
      {/* Glow for earned */}
      {earned && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-20 h-20 bg-amber-300/30 rounded-full blur-xl pointer-events-none" />
      )}

      {/* Icon */}
      <div className={cn(
        "w-14 h-14 rounded-2xl flex items-center justify-center mb-3 text-3xl relative",
        earned
          ? "bg-gradient-to-br from-amber-100 to-yellow-50 shadow-sm border border-amber-200"
          : "bg-slate-100 border border-slate-200 grayscale opacity-40"
      )}>
        <span>{badge.icon}</span>
        {!earned && (
          <div className="absolute -bottom-1 -right-1 bg-slate-300 rounded-full p-0.5">
            <Lock className="w-3 h-3 text-slate-500" />
          </div>
        )}
      </div>

      <h4 className={cn(
        "font-extrabold text-sm leading-tight",
        earned ? "text-slate-800" : "text-slate-400"
      )}>{badge.name}</h4>
      <p className={cn(
        "text-[11px] mt-1 leading-snug",
        earned ? "text-slate-500" : "text-slate-300"
      )}>{badge.description}</p>

      {earned && (
        <div className="mt-2 px-2.5 py-0.5 bg-amber-100 rounded-full">
          <span className="text-[10px] font-black text-amber-600 uppercase tracking-wide">Earned</span>
        </div>
      )}
    </motion.div>
  );
}