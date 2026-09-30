import { cn } from "@/lib/utils";
import { useT } from "../i18n";

export default function XPBar({ current, max, level, className = "" }) {
  const t = useT();
  const pct = Math.min((current / max) * 100, 100);

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white/15 ring-1 ring-white/30 flex items-center justify-center">
            <span className="text-[11px] font-black text-white tabular-nums">{level}</span>
          </div>
          <span className="text-xs font-bold text-white tracking-wide">{t.level} {level}</span>
        </div>
        <span className="text-[11px] text-white/80 font-semibold tabular-nums">{current} / {max} XP</span>
      </div>
      <div
        className="h-2.5 bg-white/15 rounded-full overflow-hidden ring-1 ring-inset ring-white/20"
        role="progressbar"
        aria-label={t.xpBarLabel}
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuetext={`${current} / ${max} XP`}
      >
        <div
          className="h-full rounded-full transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%`, background: "linear-gradient(90deg, #C98A2E, #E3A72E)" }}
        />
      </div>
    </div>
  );
}
