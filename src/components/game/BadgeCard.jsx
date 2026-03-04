import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function BadgeCard({ badge, earned, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "flex flex-col items-center text-center p-4 rounded-2xl border-2 transition-all",
        earned
          ? "bg-white border-amber-200 shadow-sm"
          : "bg-slate-50 border-slate-100 opacity-50 grayscale"
      )}
    >
      <span className="text-3xl mb-2">{badge.icon}</span>
      <h4 className="font-bold text-sm text-slate-800">{badge.name}</h4>
      <p className="text-[11px] text-slate-500 mt-1 leading-snug">{badge.description}</p>
    </motion.div>
  );
}