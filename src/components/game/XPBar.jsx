import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function XPBar({ current, max, level, className }) {
  const pct = Math.min((current / max) * 100, 100);
  
  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex justify-between items-center text-xs">
        <span className="font-bold text-slate-700">Level {level}</span>
        <span className="text-slate-500">{current} / {max} XP</span>
      </div>
      <div className="h-3 bg-slate-200 rounded-full overflow-hidden relative">
        <motion.div
          className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-white/20 rounded-full" style={{ backgroundImage: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)' }} />
      </div>
    </div>
  );
}