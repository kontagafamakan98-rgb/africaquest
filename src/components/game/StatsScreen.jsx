import { useState } from "react";
import { Zap, Star, Clock, Flame, Award, MapPin, GraduationCap, Target, RotateCcw, BookOpenCheck, CalendarClock, FileDown } from "lucide-react";
import { BADGES, DIFFICULTIES, getLevels } from "./gameData";
import StarDisplay from "./StarDisplay";
import {
  averageMastery,
  countMastered,
  countDueReviews,
  nextReviewDelay,
  formatReviewDelay,
  TOTAL_QUESTIONS,
  difficultyBreakdown,
} from "./learning";
import { StarsOverTimeChart, RegionAccuracyChart, accuracyColor } from "./ProgressCharts";
import KnowledgeMap from "./KnowledgeMap";
import { useT, useLang, DIFFICULTY_LABEL_KEYS } from "../i18n";
import { activeProfile } from "@/api/profiles-store";
import { recentFailures } from "../../lib/error-log";
import { buildProgressReport, formatDuration } from "../../lib/progress-report";

// Everything below is derived from the player's stored progress, nothing is invented.
function levelStats(levelScores, levelId) {
  const entries = Object.values(levelScores[String(levelId)] || {});
  if (entries.length === 0) return { stars: 0, bestScore: null, bestTotal: null, attempts: 0 };
  const best = entries.reduce((top, entry) => ((entry.score || 0) > (top.score || 0) ? entry : top), entries[0]);
  return {
    stars: Math.max(...entries.map((e) => e.stars || 0)),
    bestScore: Math.max(...entries.map((e) => e.score || 0)),
    // The number of questions that best run was played over, when the result
    // recorded it: the difficulties ask different counts now, so the length of
    // the whole level is only the fallback for records written before that.
    bestTotal: best?.total || null,
    attempts: entries.length,
  };
}

export default function StatsScreen({ progress, onReviewLevel }) {
  const t = useT();
  const lang = useLang();
  const levels = getLevels(lang);
  const [exporting, setExporting] = useState(false);
  const [exportFailed, setExportFailed] = useState(false);

  // The PDF library is only fetched when a report is actually asked for.
  const handleExport = async () => {
    setExporting(true);
    setExportFailed(false);
    try {
      const report = buildProgressReport({
        progress,
        levels,
        t,
        student: activeProfile().name || t.defaultProfileName,
        // What failed in this tab's session - a reload does not empty it, closing
        // the tab does - which travels with the report rather than being
        // described from memory by whoever sends it.
        failures: recentFailures(),
      });
      const { exportProgressReportPdf } = await import("../../lib/report-pdf");
      await exportProgressReportPdf(report);
    } catch {
      setExportFailed(true);
    } finally {
      setExporting(false);
    }
  };

  const completedLevels = progress.completed_levels || [];
  const levelScores = progress.level_scores || {};
  const badges = progress.badges || [];
  const totalXP = progress.total_xp || 0;
  const totalStars = progress.stars_earned || 0;
  const totalSeconds = progress.total_time_seconds || 0;
  const streakDays = progress.streak_days || 0;

  const hasNoData = totalXP === 0 && totalStars === 0 && completedLevels.length === 0;

  // Learning metrics are derived from the same stored progress as everything else.
  const questionStats = progress.question_stats || {};
  const studiedCount = (progress.studied_levels || []).length;
  const mastery = averageMastery(levelScores, levels);
  const masteredCount = countMastered(questionStats);
  // Spaced repetition: how many questions the schedule brings back right now,
  // and when the rest of the rotation is planned.
  const toReviewCount = countDueReviews(questionStats, levels);
  const upcomingDelay = nextReviewDelay(questionStats, levels);
  const nextReviewValue =
    toReviewCount > 0 ? t.dueNow : formatReviewDelay(upcomingDelay, t) || t.nothingScheduled;

  const regions = [...new Set(levels.map((level) => level.region))];
  const regionStats = regions.map((region) => {
    const inRegion = levels.filter((level) => level.region === region);
    const done = inRegion.filter((level) => completedLevels.includes(level.id)).length;
    return { region, done, total: inRegion.length };
  });
  const regionsExplored = regionStats.filter((r) => r.done > 0).length;

  // Two readings of the same difficulty, side by side: how much of the map was
  // covered (from the per level scores) and how well the questions were
  // answered (from the history of finished games). A difficulty never played
  // keeps a rate of null, which is rendered as "no data" rather than as 0 %.
  const breakdown = difficultyBreakdown(progress.history || []);
  const difficultyStats = Object.values(DIFFICULTIES).map((diff) => {
    const played = levels.filter((level) => levelScores[String(level.id)]?.[diff.id]);
    const stars = played.reduce((sum, level) => sum + (levelScores[String(level.id)]?.[diff.id]?.stars || 0), 0);
    const rate = breakdown.rows.find((row) => row.id === diff.id) || {
      games: 0,
      accuracy: null,
      bestAccuracy: null,
    };
    return { ...diff, playedCount: played.length, stars, ...rate };
  });
  const gamesPlayed = breakdown.rows.some((row) => row.games > 0);

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex items-center gap-2 px-1">
        <div>
          <h2 className="font-extrabold text-white text-sm">{t.yourProgress}</h2>
          <p className="text-white/70 text-xs">
            {completedLevels.length} {t.of} {levels.length} {t.levelsShort}
          </p>
        </div>

        {/* A document a parent or a teacher can read on its own. */}
        <button
          onClick={handleExport}
          disabled={exporting}
          className="ml-auto flex items-center gap-1.5 h-9 px-3 rounded-xl border border-amber-400/40 text-xs font-bold text-amber-200 hover:bg-amber-500/10 transition-colors disabled:opacity-60"
        >
          <FileDown className="w-3.5 h-3.5" aria-hidden="true" />
          {exporting ? t.exportingPdf : t.exportPdf}
        </button>
      </div>

      {exportFailed && (
        <p role="alert" className="text-xs text-orange-200 bg-orange-500/15 border border-orange-400/30 rounded-xl px-3 py-2">
          {t.exportFailed}
        </p>
      )}

      {hasNoData && <p className="text-white/70 text-xs px-1">{t.noDataYet}</p>}

      {/* Summary */}
      <div className="bg-[#1C150C] border border-white/10 rounded-2xl divide-y divide-white/10">
        <SummaryRow icon={Zap} label={t.totalXp} value={String(totalXP)} />
        <SummaryRow icon={Star} label={t.stars} value={String(totalStars)} />
        <SummaryRow icon={Clock} label={t.timePlayed} value={formatDuration(totalSeconds, t)} />
        <SummaryRow icon={Flame} label={t.dayStreak} value={String(streakDays)} />
        <SummaryRow icon={Award} label={t.badgesEarned} value={`${badges.length} / ${BADGES.length}`} />
      </div>

      {/* Progress over time and accuracy per region, both from stored history */}
      <section className="space-y-3">
        <StarsOverTimeChart history={progress.history || []} totalStars={totalStars} />
        <RegionAccuracyChart questionStats={questionStats} />
      </section>

      {/* Learning: how much of the material the player actually knows */}
      <section>
        <h3 className="flex items-center gap-1.5 text-white/70 text-xs font-bold uppercase tracking-widest mb-2 px-1">
          <GraduationCap className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
          {t.learningTitle}
        </h3>
        <div className="bg-[#1C150C] border border-white/10 rounded-2xl divide-y divide-white/10">
          <SummaryRow icon={GraduationCap} label={t.civilizationsStudied} value={`${studiedCount} / ${levels.length}`} />
          <SummaryRow icon={Target} label={t.averageMastery} value={`${mastery}%`} />
          <SummaryRow icon={BookOpenCheck} label={t.questionsMastered} value={`${masteredCount} / ${TOTAL_QUESTIONS}`} />
          <SummaryRow icon={RotateCcw} label={t.questionsToReview} value={String(toReviewCount)} />
          <SummaryRow icon={CalendarClock} label={t.nextReview} value={nextReviewValue} />
        </div>
      </section>

      {/* What is learned, what is shaky, what is left to discover */}
      <KnowledgeMap questionStats={questionStats} onReviewLevel={onReviewLevel} />

      {/* Stars per level */}
      <section>
        <h3 className="text-white/70 text-xs font-bold uppercase tracking-widest mb-2 px-1">{t.starsByLevel}</h3>
        <div className="space-y-2">
          {levels.map((level) => {
            const Icon = level.icon;
            const stats = levelStats(levelScores, level.id);
            const isCompleted = completedLevels.includes(level.id);
            let status = t.notStarted;
            if (stats.bestScore !== null) {
              status = `${t.bestScore}: ${stats.bestScore}/${stats.bestTotal ?? level.questions.length}`;
            }
            if (isCompleted && stats.bestScore === null) status = t.levelComplete;
            return (
              <div key={level.id} className="flex items-center gap-3 bg-[#1C150C] border border-white/10 rounded-2xl px-3 py-2.5">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${level.color} flex items-center justify-center shrink-0`}>
                  <Icon className="w-5 h-5 text-white" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white text-xs font-bold truncate">{level.title}</p>
                  <p className={`text-[10px] truncate ${isCompleted ? "text-emerald-300" : "text-white/70"}`}>{status}</p>
                </div>
                <StarDisplay count={stats.stars} size="sm" />
              </div>
            );
          })}
        </div>
      </section>

      {/* Regions explored */}
      <section>
        <h3 className="text-white/70 text-xs font-bold uppercase tracking-widest mb-2 px-1">
          {t.regionsExplored} ({regionsExplored}/{regions.length})
        </h3>
        <div className="space-y-2">
          {regionStats.map((r) => (
            <div key={r.region} className="bg-[#1C150C] border border-white/10 rounded-2xl px-3 py-2.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-1.5 text-white text-xs font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                  {r.region}
                </span>
                <span className="text-white/70 text-[10px] font-bold">
                  {r.done}/{r.total} {t.levelsShort}
                </span>
              </div>
              <div className="h-1.5 bg-white/15 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(r.done / r.total) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Success rate per difficulty: one bar each, all three on one scale */}
      <section>
        <h3 className="text-white/70 text-xs font-bold uppercase tracking-widest mb-2 px-1">{t.difficultyBreakdown}</h3>
        <div className="bg-[#1C150C] border border-white/10 rounded-2xl p-4">
          {!gamesPlayed && <p className="text-white/70 text-xs">{t.difficultyNoGames}</p>}

          <div className="space-y-3">
            {difficultyStats.map((diff) => {
              const DiffIcon = diff.icon;
              const color = accuracyColor(diff.accuracy);
              const isLeader = breakdown.leader?.id === diff.id;
              // Same wording as the region chart: a rate nothing was recorded for
              // is missing, and is never drawn as a zero.
              const rate = diff.accuracy === null ? t.noAnswersYet : `${diff.accuracy}%`;

              // Only the facts that exist are written, and every number that is
              // written carries its own wording: a difficulty never played has
              // no game, no best run and no star to report, so its line stops at
              // the coverage, and nothing is shown as a zero.
              const facts = [`${diff.playedCount}/${levels.length} ${t.levelsShort}`];
              if (diff.games > 0) {
                facts.push(`${diff.games} ${diff.games > 1 ? t.difficultyGames : t.difficultyGamesOne}`);
              }
              if (diff.bestAccuracy !== null) facts.push(`${t.difficultyBest} ${diff.bestAccuracy}%`);
              if (diff.stars > 0) facts.push(`${diff.stars} ${diff.stars > 1 ? t.stars : t.starOne}`);

              return (
                <div key={diff.id}>
                  <div className="flex items-baseline justify-between gap-2 mb-1.5">
                    <span className="flex items-center gap-1.5 text-white/85 text-xs font-semibold truncate">
                      <DiffIcon className="w-3.5 h-3.5 text-amber-400 shrink-0" aria-hidden="true" />
                      {t[DIFFICULTY_LABEL_KEYS[diff.id]] || diff.label}
                      {isLeader && (
                        <span className="text-[10px] font-bold text-green-300 shrink-0">
                          {t.difficultyLeader}
                        </span>
                      )}
                    </span>
                    <span className="text-white text-xs font-extrabold tabular-nums shrink-0">{rate}</span>
                  </div>
                  <div
                    className="h-2 rounded-full bg-white/10 overflow-hidden"
                    role="img"
                    aria-label={`${t.difficultySuccess} ${t[DIFFICULTY_LABEL_KEYS[diff.id]] || diff.label}: ${rate}`}
                  >
                    <div
                    className="h-full rounded-full transition-[width] duration-300"
                    style={{ width: `${diff.accuracy || 0}%`, background: color || "transparent" }}
                    />
                  </div>
                  <p className="text-white/70 text-[10px] mt-1 tabular-nums">{facts.join(" · ")}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

function SummaryRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="flex items-center gap-2 text-white/80 text-xs font-semibold">
        <Icon className="w-4 h-4 text-amber-400" aria-hidden="true" />
        {label}
      </span>
      <span className="text-white text-sm font-extrabold tabular-nums">{value}</span>
    </div>
  );
}
