import { ChevronRight, Check, GraduationCap } from "lucide-react";
// The brief of each level, not its questions: this tab lists the lessons and
// opens one, and the lesson is what downloads the level it opens.
import { getLevelSummaries } from "./level-summary";
import { levelMastery, averageMastery } from "./learning";
import { useT, useLang } from "../i18n";

export default function LearnScreen({ progress, onOpenLesson }) {
  const t = useT();
  const lang = useLang();
  const levels = getLevelSummaries(lang);
  const studied = progress.studied_levels || [];
  const levelScores = progress.level_scores || {};
  const mastery = averageMastery(levelScores, levels);

  return (
    <div className="space-y-3">
      <div className="mb-2 px-1">
        <h2 className="font-extrabold text-white text-sm">{t.learnTitle}</h2>
        <p className="text-white/70 text-xs">{t.learnIntro}</p>
      </div>

      {/* Study progress at a glance, so the tab always says where the player stands. */}
      <div className="flex gap-2 px-1 pb-1">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-200 bg-amber-500/15 border border-amber-400/30 rounded-full px-2.5 py-1">
          <GraduationCap className="w-3.5 h-3.5" aria-hidden="true" />
          {studied.length}/{levels.length} {t.studiedSummary}
        </span>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-white/80 bg-[#1C150C] border border-white/10 rounded-full px-2.5 py-1 tabular-nums">
          {t.mastery} {mastery}%
        </span>
      </div>

      {levels.map((level) => {
        const Icon = level.icon;
        const isStudied = studied.includes(level.id);
        const mastery = levelMastery(level, levelScores);
        return (
          <button
            key={level.id}
            onClick={() => onOpenLesson(level)}
            className="group w-full text-left rounded-2xl overflow-hidden bg-[#1C150C] border border-white/10 hover:border-white/20 hover:bg-[#241B10] transition-colors p-4 flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${level.color} flex items-center justify-center shadow-lg ring-1 ring-white/20 shrink-0`}>
              <Icon className="w-6 h-6 text-white" aria-hidden="true" />
            </div>

            {/* The name of the level takes the width of the row, and the status
                and the mastery are read on the line under it. Held in a column
                of their own on the right, as they used to be, they left about a
                hundred and twenty pixels for the title, which is three words:
                fourteen of the twenty levels were cut short with an ellipsis,
                and the eighteen characters of "Kingdom of Kush" did not fit. */}
            <div className="flex-1 min-w-0">
              <p className="text-amber-200/80 text-[10px] uppercase tracking-[0.15em] font-bold">{level.region}</p>
              <h3 className="text-white font-extrabold text-base leading-tight">{level.title}</h3>
              <p className="text-white/70 text-xs">{level.subtitle}</p>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {isStudied ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-400/30 rounded-full px-2 py-0.5">
                    <Check className="w-3 h-3" aria-hidden="true" />
                    {t.studied}
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-white/60 bg-[#1C150C] border border-white/10 rounded-full px-2 py-0.5">
                    {t.notStudied}
                  </span>
                )}
                <span className="text-[10px] text-white/60 font-semibold tabular-nums">
                  {t.mastery} {mastery}%
                </span>
              </div>
            </div>

            <ChevronRight className="w-5 h-5 text-white/60 group-hover:text-white transition-colors shrink-0" aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
