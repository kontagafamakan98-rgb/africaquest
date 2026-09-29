import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";
import { useT, useBadgeText } from "../i18n";

export default function BadgeCard({ badge, earned }) {
  const t = useT();
  const { name, description } = useBadgeText(badge);
  const Icon = badge.icon;

  return (
    <div
      className={cn(
        "relative flex flex-col items-center text-center p-4 rounded-2xl border overflow-hidden",
        earned
          ? "bg-gradient-to-b from-amber-500/15 to-transparent border-amber-400/30 shadow-md shadow-amber-900/20"
          : "bg-[#1C150C] border-white/15"
      )}
    >
      {earned && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-24 h-24 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
      )}

      {/* Icon */}
      <div className={cn(
        "w-14 h-14 rounded-xl flex items-center justify-center mb-3 relative border",
        earned
          ? "bg-gradient-to-br from-amber-400/20 to-yellow-500/10 border-amber-400/30 text-amber-300"
          : "bg-[#1C150C] border-white/15 text-white/70"
      )}>
        <Icon className="w-6 h-6" aria-hidden="true" />
        {!earned && (
          <div className="absolute -bottom-1 -right-1 bg-slate-600 rounded-md p-0.5 border border-slate-400">
            <Lock className="w-3 h-3 text-white" aria-hidden="true" />
          </div>
        )}
      </div>

      <h3 className={cn(
        "font-extrabold text-sm leading-tight",
        earned ? "text-white" : "text-white/80"
      )}>{name}</h3>
      <p className={cn(
        "text-[11px] mt-1 leading-snug",
        earned ? "text-white/80" : "text-white/70"
      )}>{description}</p>

      {earned && (
        <div className="mt-2.5 px-3 py-0.5 bg-amber-400/20 rounded-md border border-amber-400/30">
          <span className="text-[10px] font-black text-amber-300 uppercase tracking-wide">{t.earned}</span>
        </div>
      )}
    </div>
  );
}
