import { useMemo } from "react";
import { Brain, Sparkles, AlertTriangle, CircleDashed, ChevronRight } from "lucide-react";
import { useT, useLang } from "../i18n";
import { getLevels } from "./gameData";
import { knowledgeMap, fragileQuestionsOf } from "../../lib/knowledge-map";

// The three buckets the dashboard is built on, in reading order.
const BUCKETS = [
  { key: "known", icon: Sparkles, bar: "bg-emerald-500", dot: "bg-emerald-400", text: "text-emerald-300" },
  { key: "fragile", icon: AlertTriangle, bar: "bg-amber-500", dot: "bg-amber-400", text: "text-amber-300" },
  { key: "undiscovered", icon: CircleDashed, bar: "bg-white/20", dot: "bg-white/30", text: "text-white/60" },
];

const LABEL_KEYS = {
  known: "solidQuestions",
  fragile: "fragileQuestions",
  undiscovered: "undiscoveredQuestions",
};

/**
 * Learning dashboard: what the player has really learned, what is still shaky,
 * and what they have not met yet. Every number comes from the stored answers,
 * nothing is estimated.
 */
export default function KnowledgeMap({ questionStats = {}, onReviewLevel }) {
  const t = useT();
  const lang = useLang();
  const levels = getLevels(lang);
  const map = useMemo(() => knowledgeMap(questionStats, levels), [questionStats, levels]);
  // The questions a tap on a level would hand to a session, prepared once for
  // every row instead of being rebuilt on each render.
  const fragileByLevel = useMemo(
    () => new Map(levels.map((level) => [level.id, fragileQuestionsOf(level, questionStats)])),
    [levels, questionStats]
  );
  const hasFragile = levels.some((level) => (fragileByLevel.get(level.id) || []).length > 0);

  return (
    <section>
      <h3 className="flex items-center gap-1.5 text-white/70 text-xs font-bold uppercase tracking-widest mb-2 px-1">
        <Brain className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
        {t.knowledgeMap}
      </h3>

      <div className="bg-[#1C150C] border border-white/10 rounded-2xl p-4 space-y-4">
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <p className="text-sm font-extrabold text-white tabular-nums">
              {map.known} {t.of} {map.total}
            </p>
            <p className="text-xs font-bold text-emerald-300 tabular-nums">
              {map.knownPercent}% {t.solidQuestions}
            </p>
          </div>
          <SegmentBar known={map.known} fragile={map.fragile} undiscovered={map.undiscovered} />
        </div>

        <ul className="space-y-1.5">
          {BUCKETS.map((bucket) => {
            const Icon = bucket.icon;
            return (
              <li key={bucket.key} className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full shrink-0 ${bucket.dot}`} aria-hidden="true" />
                <Icon className={`w-3.5 h-3.5 shrink-0 ${bucket.text}`} aria-hidden="true" />
                <span className={`text-xs flex-1 ${bucket.text}`}>{t[LABEL_KEYS[bucket.key]]}</span>
                <span className="text-xs font-bold text-white tabular-nums">{map[bucket.key]}</span>
              </li>
            );
          })}
        </ul>

        {map.priorityRegion && map.fragileLevel && (
          <p className="text-[11px] text-white/70 border-t border-white/10 pt-3 leading-relaxed">
            <span className="font-bold text-amber-300">{t.workFirst} : </span>
            {map.fragileLevel.title} ({map.fragileLevel.fragile} {t.fragileQuestions.toLowerCase()},{" "}
            {map.fragileLevel.region})
          </p>
        )}

        {/* Where the work is, level by level. */}
        <div className="space-y-2.5 border-t border-white/10 pt-3">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/50">
            {t.perLevelKnowledge}
          </h4>
          {hasFragile && (
            <p className="text-[10px] text-white/50 leading-relaxed">{t.knowledgeMapHint}</p>
          )}
          {map.byLevel.map((row) => (
            <LevelRow
              key={row.id}
              row={row}
              questions={fragileByLevel.get(row.id) || []}
              onReview={onReviewLevel}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * One level of the map. A level holding fragile questions becomes a button that
 * starts a review session on those questions only, in this level. A level with
 * nothing fragile stays plain: offering a tap that would open an empty session
 * would be worse than not offering it.
 */
function LevelRow({ row, questions, onReview }) {
  const t = useT();
  const reviewable = questions.length > 0 && typeof onReview === "function";

  const body = (
    <>
      <div className="flex items-baseline justify-between gap-2 mb-1">
        <p className="text-[11px] font-bold text-white/85 truncate">{row.title}</p>
        <p className="text-[10px] text-white/60 tabular-nums shrink-0">
          {row.known}/{row.total}
        </p>
      </div>
      <SegmentBar known={row.known} fragile={row.fragile} undiscovered={row.undiscovered} thin />
    </>
  );

  if (!reviewable) return <div>{body}</div>;

  return (
    <button
      type="button"
      onClick={() => onReview({ id: row.id, title: row.title, region: row.region }, questions)}
      aria-label={`${row.title}, ${questions.length} ${t.fragileQuestions}`}
      className="-mx-2 px-2 py-1 rounded-xl w-full text-left transition-colors hover:bg-[#1C150C] flex items-center gap-2"
    >
      <span className="flex-1 min-w-0">{body}</span>
      <ChevronRight className="w-3.5 h-3.5 text-amber-300 shrink-0" aria-hidden="true" />
    </button>
  );
}

/** One bar split into the three buckets, used for the game and for each level. */
function SegmentBar({ known, fragile, undiscovered, thin = false }) {
  const total = known + fragile + undiscovered;
  if (total === 0) return null;
  const width = (value) => `${(value / total) * 100}%`;

  return (
    <div
      className={`flex w-full overflow-hidden rounded-full bg-white/10 ${thin ? "h-1.5" : "h-2.5"}`}
      role="img"
      aria-label={`${known} ${known + fragile + undiscovered}, ${fragile}, ${undiscovered}`}
    >
      {BUCKETS.map((bucket) => {
        const value = bucket.key === "known" ? known : bucket.key === "fragile" ? fragile : undiscovered;
        return value > 0 ? (
          <div key={bucket.key} className={bucket.bar} style={{ width: width(value) }} />
        ) : null;
      })}
    </div>
  );
}
