import { Lock, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
// The brief of the game, not the game: a card draws a title and a picture, and
// the entry file must not carry two hundred questions to do it.
import { LEVEL_IMAGES } from "./level-summary";
import StarDisplay from "./StarDisplay";
import LevelPicture from "./LevelPicture";
import { useT } from "../i18n";

export default function LevelCard({ level, isUnlocked, isCompleted, levelScores, onClick, index }) {
  const t = useT();
  const img = LEVEL_IMAGES[level.id];
  const Icon = level.icon;
  const bestStars = levelScores
    ? Math.max(...Object.values(levelScores).map((d) => d.stars || 0))
    : 0;

  return (
    <button
      type="button"
      onClick={() => isUnlocked && onClick(level)}
      aria-disabled={!isUnlocked}
      className={cn(
        "group relative block w-full rounded-2xl overflow-hidden text-left ring-1 ring-white/10",
        isUnlocked
          ? "cursor-pointer active:scale-[0.99] transition-all duration-200 shadow-lg shadow-black/30 hover:shadow-xl hover:shadow-black/50 hover:-translate-y-0.5"
          : "opacity-70 saturate-50 cursor-not-allowed shadow-sm"
      )}
      style={{ height: 150 }}
    >
      {/* Coloured fallback is always present, the photo renders on top of it */}
      <div className={`absolute inset-0 bg-gradient-to-br ${level.color}`} />
      {img && (
        /* The map draws twenty-six of these, and they are the first screen a reader
           downloads: five hundred kilobytes of pictures, against a hundred and
           seventy for the application itself. `card` offers the copy written at
           the width a card is drawn, and `sizes` says how wide that is, so a
           screen of one pixel density stops downloading the light version it
           cannot show. */
        <LevelPicture
          src={img}
          alt=""
          card
          sizes="(min-width: 512px) 480px, 92vw"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
        />
      )}

      {/* Overlay: darkest on the left where the text sits, so the photo can breathe */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/92 via-black/60 to-black/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

      {/* Locked overlay */}
      {!isUnlocked && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white/15 rounded-2xl p-3 ring-1 ring-white/25">
            <Lock className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
        </div>
      )}

      {/* Left accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${level.color}`} />

      {/* Content */}
      <div className="relative h-full px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Icon badge */}
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${level.color} flex items-center justify-center shadow-lg ring-1 ring-white/30 shrink-0`}>
            <Icon className="w-7 h-7 text-white" aria-hidden="true" />
          </div>

          <div>
            <p className="text-amber-200/90 text-[10px] uppercase tracking-[0.18em] font-bold mb-1">{level.region}</p>
            <h3 className="text-white font-extrabold text-lg leading-tight drop-shadow">{level.title}</h3>
            <p className="text-white/85 text-xs mt-0.5">{level.subtitle}</p>
            {bestStars > 0 && (
              <div className="mt-2">
                <StarDisplay count={bestStars} size="sm" />
              </div>
            )}
          </div>
        </div>

        {/* Right side */}
        {isUnlocked && (
          <div className="flex flex-col items-center gap-2 shrink-0">
            {isCompleted ? (
              <div className="w-9 h-9 rounded-xl bg-emerald-500/30 ring-1 ring-emerald-300/70 flex items-center justify-center">
                <Check className="w-5 h-5 text-emerald-100" aria-hidden="true" />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-xl bg-white/10 ring-1 ring-white/30 flex items-center justify-center">
                <ChevronRight className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Level number badge */}
      <div className="absolute top-3 right-3">
        <span className="text-[10px] font-black text-white bg-black/60 ring-1 ring-white/15 rounded-md px-2 py-0.5 tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Status for screen readers */}
      <span className="sr-only">
        {!isUnlocked ? t.lockedLevel : isCompleted ? t.levelComplete : t.openLevel}
      </span>
    </button>
  );
}
