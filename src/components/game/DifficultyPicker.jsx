import { cn } from "@/lib/utils";
import { ChevronLeft, Clock, Zap, Star } from "lucide-react";
import { DIFFICULTIES } from "./gameData";
import { LEVEL_IMAGES } from "./level-summary";
import { useT, DIFFICULTY_LABEL_KEYS } from "../i18n";
import AudioNarrator from "./AudioNarrator";
import LevelPicture from "./LevelPicture";

export default function DifficultyPicker({ level, levelScores, onSelect, onBack }) {
  const t = useT();
  const img = LEVEL_IMAGES[level.id];
  const LevelIcon = level.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero image header */}
      <div className="relative h-52 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${level.color}`} />
        {img && (
          <LevelPicture src={img} alt="" className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
        <button
          onClick={onBack}
          aria-label={t.cancel}
          className="absolute top-4 left-4 p-2 rounded-lg bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 transition-colors"
          style={{ marginTop: "var(--sat)" }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
          <p className="text-white/85 text-xs font-bold uppercase tracking-widest mb-0.5">{level.region}</p>
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-extrabold text-white drop-shadow">{level.title}</h2>
            <LevelIcon className="w-8 h-8 text-white/90" aria-hidden="true" />
          </div>
          <p className="text-white/85 text-sm">{level.subtitle}</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5">
        <AudioNarrator levelId={level.id} />

        <h3 className="text-center text-lg font-bold text-slate-700 mb-1">{t.chooseDifficulty}</h3>
        <p className="text-center text-sm text-slate-600 mb-5">{t.chooseDifficultyDesc}</p>

        <div className="space-y-3">
          {Object.values(DIFFICULTIES).map((diff) => {
            const best = levelScores?.[diff.id];
            const DiffIcon = diff.icon;
            return (
              <button
                key={diff.id}
                onClick={() => onSelect(diff.id)}
                className={cn(
                  "w-full text-left rounded-2xl border-2 p-5 shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.99]",
                  diff.borderColor, diff.bgColor
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <DiffIcon className={cn("w-6 h-6", diff.textColor)} aria-hidden="true" />
                    <div>
                      <p className={cn("font-extrabold text-lg", diff.textColor)}>
                        {t[DIFFICULTY_LABEL_KEYS[diff.id]] || diff.label}
                      </p>
                    </div>
                  </div>
                  {best && (
                    <div className="flex items-center gap-1 bg-white/70 rounded-lg px-3 py-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="text-sm font-bold text-slate-700">{best.stars}/3</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-4 text-xs font-semibold text-slate-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {diff.timeLimit > 0 ? `${diff.timeLimit}${t.perQuestion}` : t.noTimeLimit}
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    {diff.xpMultiplier}{t.xpMultiplier}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
