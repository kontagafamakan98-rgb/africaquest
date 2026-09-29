import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, RotateCcw, CheckCircle2, Clock, Check, Layers, MapPin, SlidersHorizontal, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT, useLang } from "../i18n";
// The wording of each question is read here, from the full levels: the home
// screen hands over the schedule (which question, from which level, due when),
// because that is all it needs to count what is waiting, and this is the screen
// that shows the questions themselves.
import { getLevels } from "./gameData";
import { formatReviewDelay, questionKey } from "./learning";
import LiquidMark from "./LiquidMark";
import {
  ALL_SCOPE,
  MISTAKES_SCOPE,
  questionsInScope,
  reviewScopeSummary,
  scopeKey,
  scopeOfLevel,
  scopeOfRegion,
} from "../../lib/review-scope";

/**
 * The review inbox.
 *
 * The card on the home screen offers the questions that are due right now, which
 * is the fast path. This screen is the whole picture: every question still in
 * the rotation, whether it is due or waiting for a later date, with the time
 * left before it comes back. The player picks what to work on instead of taking
 * a batch they did not choose, and nothing leaves the rotation by being ignored:
 * it is still listed tomorrow.
 *
 * The whole rotation is also more than anyone can act on, so the screen lets the
 * player narrow the session before selecting: one level, one region, or the
 * questions they keep getting wrong. A scope only changes what is listed and
 * what a selection can reach; it never changes what the schedule knows.
 *
 * `queue` is what `collectReviewQueue` returns, computed by the home screen so
 * both screens agree on the same list.
 */
export default function ReviewScreen({ queue = [], onBack, onStart }) {
  const t = useT();
  const lang = useLang();
  // What the home screen handed over carries no wording: the questions are
  // attached here, once, and a question the game no longer holds is dropped
  // rather than shown as a blank line.
  const waiting = useMemo(() => {
    const questionsOf = new Map(getLevels(lang).map((level) => [level.id, level.questions]));
    return queue
      .map((item) => ({ ...item, question: item.question ?? questionsOf.get(item.levelId)?.[item.index] }))
      .filter((item) => item.question);
  }, [queue, lang]);
  // A waiting time frozen at mount would drift within minutes. The list re-reads
  // the clock on a slow timer so a question due in two minutes turns into "due
  // now" while the screen is open, without any animation.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  // What this screen can be narrowed to, counted once for the whole list.
  const summary = useMemo(() => reviewScopeSummary(waiting), [waiting]);
  const [scope, setScope] = useState(ALL_SCOPE);

  // The questions the current scope holds. Everything below reads this list
  // rather than the queue, so a scope cannot be shown without being applied.
  const visible = useMemo(() => questionsInScope(waiting, scope), [waiting, scope]);
  const currentKey = scopeKey(scope);

  // Only the questions the schedule is asking for are ticked to start with; the
  // rest stay one tap away. Changing the scope hands the player a fresh, honest
  // selection: the due questions of what they just chose, never a stale set.
  const [selected, setSelected] = useState(
    () => new Set(visible.filter((item) => item.due <= Date.now()).map(keyOf))
  );
  useEffect(() => {
    setSelected(
      new Set(questionsInScope(waiting, scope).filter((item) => item.due <= Date.now()).map(keyOf))
    );
    // Deliberately keyed on the scope alone: `queue` is rebuilt on every render
    // of the home screen, and following it would wipe the player's ticks each
    // time the clock ticks.
  }, [currentKey]);

  const due = visible.filter((item) => item.due <= now);
  const later = visible.filter((item) => item.due > now);

  const toggle = (key) => {
    setSelected((previous) => {
      const next = new Set(previous);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const allSelected = visible.length > 0 && selected.size === visible.length;
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(visible.map(keyOf)));

  // The session names what it really is, so the quiz that opens says which level
  // or which region is being worked on rather than repeating a generic title.
  const scopeMeta = () => {
    if (scope.kind === "level") return { title: scope.title || "", region: t.reviewScopeLevel };
    if (scope.kind === "region") return { title: scope.region, region: t.reviewScopeRegion };
    if (scope.kind === "mistakes") return { region: t.reviewScopeMistakes };
    return {};
  };

  const start = () =>
    onStart?.(
      visible.filter((item) => selected.has(keyOf(item))),
      scopeMeta()
    );

  // Choosing a scope is choosing what to work on, so a scope that holds nothing
  // stays offered: its count says so before the tap, and the list then says why.
  // A greyed out button would leave the player guessing.
  const scopes = [
    {
      kind: "all",
      icon: null,
      label: t.reviewScopeAll,
      count: summary.total,
      target: ALL_SCOPE,
      active: scope.kind === "all",
    },
    {
      kind: "level",
      icon: Layers,
      label: t.reviewScopeLevel,
      count: summary.levels.length,
      target: summary.levels.length
        ? { ...scopeOfLevel(summary.levels[0].id), title: summary.levels[0].title }
        : ALL_SCOPE,
      active: scope.kind === "level",
    },
    {
      kind: "region",
      icon: MapPin,
      label: t.reviewScopeRegion,
      count: summary.regions.length,
      target: summary.regions.length ? scopeOfRegion(summary.regions[0].region) : ALL_SCOPE,
      active: scope.kind === "region",
    },
    {
      kind: "mistakes",
      icon: Target,
      label: t.reviewScopeMistakes,
      count: summary.mistakes,
      target: MISTAKES_SCOPE,
      active: scope.kind === "mistakes",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#14100A" }}>
      <header
        className="shrink-0 px-4 pb-4 border-b border-white/10"
        style={{ paddingTop: "calc(1rem + var(--sat))" }}
      >
        <div className="max-w-lg mx-auto">
          <button
            type="button"
            onClick={onBack}
            aria-label={t.reviewBack}
            className="mb-3 -ml-2 p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          </button>
          <div>
            <h1 className="text-lg font-extrabold text-white leading-tight">{t.reviewScreen}</h1>
            <p className="text-white/70 text-[11px] font-medium">
              {queue.length} {t.reviewPending}
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar">
        <div className="max-w-lg mx-auto px-4 pt-4 pb-28 space-y-4">
          {queue.length === 0 ? (
            <div className="rounded-2xl bg-[#1C150C] border border-white/10 p-5 text-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" aria-hidden="true" />
              <p className="text-white font-bold text-sm mt-3">{t.reviewEmptyTitle}</p>
              <p className="text-white/70 text-xs mt-1.5 leading-relaxed">{t.reviewEmptyBody}</p>
            </div>
          ) : (
            <>
              <p className="text-white/70 text-xs leading-relaxed">{t.reviewScreenIntro}</p>

              <section className="rounded-2xl bg-[#1C150C] border border-white/10 p-3 space-y-2.5">
                <h2 className="flex items-center gap-1.5 text-white/60 text-[11px] font-extrabold uppercase tracking-widest">
                  <SlidersHorizontal className="w-3.5 h-3.5" aria-hidden="true" />
                  {t.reviewScope}
                </h2>

                <div className="grid grid-cols-2 gap-2">
                  {scopes.map((entry) => {
                    const Icon = entry.icon;
                    return (
                      <button
                        key={entry.kind}
                        type="button"
                        onClick={() => setScope(entry.target)}
                        aria-current={entry.active ? "true" : undefined}
                        className={cn(
                          // The outline is the same whichever one is chosen: only
                          // the mark says so, and a border that changed colour on
                          // its own would flash while the mark travels to it.
                          "relative isolate flex items-center gap-1.5 rounded-xl border border-white/10 px-2.5 py-2 text-left transition-colors",
                          entry.active
                            ? "text-amber-200"
                            : entry.count === 0
                              ? "text-white/60 hover:border-white/25"
                              : "text-white/70 hover:border-white/25"
                        )}
                      >
                        {entry.active && (
                          <LiquidMark
                            layoutId="review-scope"
                            className="-inset-px rounded-xl border border-amber-400/60 bg-amber-500/15"
                          />
                        )}
                        {Icon ? <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> : null}
                        <span className="flex-1 min-w-0 text-[11px] font-bold truncate">{entry.label}</span>
                        <span className="text-[11px] font-bold tabular-nums shrink-0">{entry.count}</span>
                      </button>
                    );
                  })}
                </div>

                {/* One level at a time. The count beside each is how many of its
                    questions are still in the rotation, so an empty level is
                    never offered. */}
                {scope.kind === "level" && summary.levels.length > 0 && (
                  <ul className="flex flex-wrap gap-1.5">
                    {summary.levels.map((row) => (
                      <li key={row.id}>
                        <button
                          type="button"
                          onClick={() => setScope({ ...scopeOfLevel(row.id), title: row.title })}
                          aria-current={scope.id === row.id ? "true" : undefined}
                          className={cn(
                            "relative isolate flex items-center gap-1.5 rounded-lg border border-white/10 px-2 py-1.5 text-[11px] font-bold transition-colors",
                            scope.id === row.id ? "text-amber-200" : "text-white/65 hover:border-white/25"
                          )}
                        >
                          {scope.id === row.id && (
                            <LiquidMark
                              layoutId="review-level"
                              className="-inset-px rounded-lg border border-amber-400/60 bg-amber-500/15"
                            />
                          )}
                          <span className="max-w-[11rem] truncate">{row.title}</span>
                          <span className="tabular-nums text-white/50">{row.count}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {scope.kind === "region" && summary.regions.length > 0 && (
                  <ul className="flex flex-wrap gap-1.5">
                    {summary.regions.map((row) => (
                      <li key={row.region}>
                        <button
                          type="button"
                          onClick={() => setScope(scopeOfRegion(row.region))}
                          aria-current={scope.region === row.region ? "true" : undefined}
                          className={cn(
                            "relative isolate flex items-center gap-1.5 rounded-lg border border-white/10 px-2 py-1.5 text-[11px] font-bold transition-colors",
                            scope.region === row.region ? "text-amber-200" : "text-white/65 hover:border-white/25"
                          )}
                        >
                          {scope.region === row.region && (
                            <LiquidMark
                              layoutId="review-region"
                              className="-inset-px rounded-lg border border-amber-400/60 bg-amber-500/15"
                            />
                          )}
                          <span className="max-w-[11rem] truncate">{row.region}</span>
                          <span className="tabular-nums text-white/50">{row.count}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {scope.kind === "mistakes" && (
                  <p className="text-white/55 text-[11px] leading-relaxed">{t.reviewScopeMistakesHint}</p>
                )}
              </section>

              {visible.length === 0 ? (
                <div className="rounded-2xl bg-[#1C150C] border border-white/10 p-5 text-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" aria-hidden="true" />
                  <p className="text-white/75 text-xs leading-relaxed">{t.reviewScopeEmpty}</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-white/80 text-xs font-bold">
                      {selected.size} / {visible.length} {t.reviewSelected}
                    </p>
                    <button
                      type="button"
                      onClick={toggleAll}
                      className="text-xs font-bold text-amber-300 hover:text-amber-200 transition-colors"
                    >
                      {allSelected ? t.reviewClearAll : t.reviewSelectAll}
                    </button>
                  </div>

                  <Group title={t.reviewWaitingNow} items={due} now={now} selected={selected} onToggle={toggle} />
                  <Group title={t.reviewWaitingLater} items={later} now={now} selected={selected} onToggle={toggle} />
                </>
              )}
            </>
          )}
        </div>
      </main>

      {queue.length > 0 && visible.length > 0 && (
        <div
          className="fixed bottom-0 left-0 right-0 border-t border-white/10"
          style={{ background: "#14100A", paddingBottom: "var(--sab)" }}
        >
          <div className="max-w-lg mx-auto px-4 py-3">
            <button
              type="button"
              onClick={start}
              disabled={selected.size === 0}
              className={cn(
                "w-full h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors",
                selected.size === 0
                  ? "bg-white/10 text-white/60 cursor-not-allowed"
                  : "bg-gradient-to-r from-amber-700 to-orange-800 hover:from-amber-800 hover:to-orange-900 text-white shadow-lg shadow-amber-900/20"
              )}
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              {t.reviewStart} ({selected.size})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** One section of the list, hidden when it has nothing to show. */
function Group({ title, items, now, selected, onToggle }) {
  if (items.length === 0) return null;
  return (
    <section>
      <h2 className="text-white/60 text-[11px] font-extrabold uppercase tracking-widest mb-2 px-1">
        {title}
      </h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <ReviewRow
            key={keyOf(item)}
            item={item}
            now={now}
            selected={selected.has(keyOf(item))}
            onToggle={onToggle}
          />
        ))}
      </ul>
    </section>
  );
}

/** One question: its text, the lesson it comes from and the time before it is due. */
function ReviewRow({ item, now, selected, onToggle }) {
  const t = useT();
  const isDue = item.due <= now;
  const delay = formatReviewDelay(item.due - now, t);
  return (
    <li>
      <label
        className={cn(
          "flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-colors",
          selected ? "border-amber-400/60 bg-amber-500/10" : "border-white/10 bg-[#1C150C] hover:border-white/25"
        )}
      >
        {/* A real checkbox rather than a styled div, so the row keeps its
            keyboard support and its label for screen readers. */}
        <span className="relative shrink-0 mt-0.5 w-5 h-5">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onToggle(keyOf(item))}
            className="peer block appearance-none w-5 h-5 rounded-md border-2 border-white/30 bg-[#1C150C] cursor-pointer transition-colors checked:bg-amber-500 checked:border-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
          />
          <Check
            className="pointer-events-none absolute inset-0 m-auto w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100"
            aria-hidden="true"
          />
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-sm text-white/90 leading-snug">{item.question.question}</span>
          <span className="block text-[11px] text-white/55 mt-1">{item.levelTitle}</span>
        </span>
        <span
          className={cn(
            "shrink-0 flex items-center gap-1 text-[11px] font-bold mt-0.5 whitespace-nowrap",
            isDue ? "text-amber-300" : "text-white/60"
          )}
        >
          {isDue ? (
            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
          ) : null}
          {isDue ? t.dueNow : `${t.reviewInTime} ${delay}`}
        </span>
      </label>
    </li>
  );
}

/** Stable identity of a question across the different screens. */
function keyOf(item) {
  return questionKey(item.levelId, item.index);
}
