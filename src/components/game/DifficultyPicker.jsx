import { cn } from "@/lib/utils";
import { ChevronLeft, Clock, Zap, Star, ClipboardList, GraduationCap } from "lucide-react";
import { DIFFICULTIES } from "./difficulties";
import { quizQuestions } from "./question-bank.js";
import { LEVEL_IMAGES } from "./level-summary";
import { useT, DIFFICULTY_LABEL_KEYS } from "../i18n";
import AudioNarrator from "./AudioNarrator";
import LevelPicture from "./LevelPicture";

export default function DifficultyPicker({ level, levelScores, onSelect, onBack }) {
  const t = useT();
  const img = LEVEL_IMAGES[level.id];
  const LevelIcon = level.icon;
  // How many questions the exam asks, read from the run itself for the reason
  // the three rows above are: a number written here as well would be a second
  // promise to keep.
  const examCount = quizQuestions(level, "exam").length;

  // The picker is a screen of its own rather than a part of one: it is what a
  // shared link to a level opens, so it carries the page's landmark and the one
  // heading the page is named by.
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
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
          className="absolute top-4 left-4 p-3 rounded-lg bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 transition-colors"
          style={{ marginTop: "var(--sat)" }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
          <p className="text-white/85 text-xs font-bold uppercase tracking-widest mb-0.5">{level.region}</p>
          <div className="flex items-end justify-between">
            <h1 className="text-2xl font-extrabold text-white drop-shadow">{level.title}</h1>
            <LevelIcon className="w-8 h-8 text-white/90" aria-hidden="true" />
          </div>
          <p className="text-white/85 text-sm">{level.subtitle}</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-5">
        <AudioNarrator levelId={level.id} />

        <h2 className="text-center text-lg font-bold text-slate-700 mb-1">{t.chooseDifficulty}</h2>
        <p className="text-center text-sm text-slate-600 mb-5">{t.chooseDifficultyDesc}</p>

        <div className="space-y-3">
          {Object.values(DIFFICULTIES).map((diff) => {
            const best = levelScores?.[diff.id];
            const DiffIcon = diff.icon;
            // How many questions this setting really asks. The run is built
            // here by the same function the quiz builds it with - chronology
            // question included - so the row cannot promise a shorter run than
            // the player gets.
            const count = quizQuestions(level, diff.id).length;
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
                    <ClipboardList className="w-3.5 h-3.5" aria-hidden="true" />
                    {count} {t.difficultyQuestions}
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    {diff.xpMultiplier}{t.xpMultiplier}
                  </span>
                </div>
              </button>
            );
          })}

          {/* The exam, beside the three difficulties rather than among them: it
              is the whole level and it is not paid, so it is not a rung on the
              same ladder. It is offered here because this is the screen where
              a player decides how to sit the level, and it is the setting a
              teacher asks for first. */}
          <button
            onClick={() => onSelect("exam")}
            className="w-full text-left rounded-2xl border-2 p-5 shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.99] border-slate-300 bg-slate-100"
          >
            <div className="flex items-center gap-3 mb-2">
              <GraduationCap className="w-6 h-6 text-slate-700" aria-hidden="true" />
              <p className="font-extrabold text-lg text-slate-700">{t.examMode}</p>
            </div>
            <p className="text-xs font-semibold text-slate-600 leading-relaxed mb-2">{t.examModeDesc}</p>
            <div className="flex gap-4 text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1">
                <ClipboardList className="w-3.5 h-3.5" aria-hidden="true" />
                {examCount} {t.difficultyQuestions}
              </span>
            </div>
          </button>
        </div>
      </div>
    </main>
  );
}
