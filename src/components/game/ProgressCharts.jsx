import { Star, TrendingUp, MapPin } from "lucide-react";
import { regionAccuracy, starsOverTime } from "./learning";
import { getLevels } from "./gameData";
import { useT, useLang } from "../i18n";

const AMBER = "#E3A72E";
const GREEN = "#2F7D4F";
const ORANGE = "#C2410C";

// "2026-09-27" -> "27/09"
const dayLabel = (iso) => {
  const parts = String(iso).split("-");
  return parts.length === 3 ? `${parts[2]}/${parts[1]}` : iso;
};

// Shared with the statistics screen, so one green means the same everywhere.
export function accuracyColor(accuracy) {
  if (accuracy === null) return null;
  if (accuracy >= 80) return GREEN;
  if (accuracy >= 50) return AMBER;
  return ORANGE;
}

/**
 * Stars earned day after day, cumulated, drawn as a plain SVG area chart.
 * No charting dependency: the shape is a handful of points and the numbers are
 * real text, so the card stays readable for screen readers too.
 */
export function StarsOverTimeChart({ history = [], totalStars = 0 }) {
  const t = useT();
  const series = starsOverTime(history, 14);

  const W = 300;
  const H = 110;
  const PAD = 10;
  const baseline = H - PAD;

  const max = Math.max(1, ...series.map((p) => p.cumulative));
  const step = series.length > 1 ? (W - 2 * PAD) / (series.length - 1) : 0;
  const points = series.map((point, index) => ({
    ...point,
    // A single day sits at the right edge, like the last point of a longer line.
    x: series.length === 1 ? W - PAD : PAD + index * step,
    y: baseline - (point.cumulative / max) * (H - 2 * PAD),
  }));

  const line = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area = points.length
    ? `M ${points[0].x.toFixed(1)},${baseline} `
      + points.map((p) => `L ${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")
      + ` L ${points[points.length - 1].x.toFixed(1)},${baseline} Z`
    : "";

  const last = points[points.length - 1];

  return (
    <div className="bg-[#1C150C] border border-white/10 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="flex items-center gap-1.5 text-white/80 text-xs font-bold uppercase tracking-widest">
          <TrendingUp className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
          {t.starsOverTime}
        </p>
        <span className="flex items-center gap-1 text-amber-300 text-sm font-extrabold tabular-nums">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
          {totalStars}
        </span>
      </div>

      {points.length === 0 ? (
        <p className="text-white/70 text-xs">{t.noChartData}</p>
      ) : (
        <>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full h-auto"
            role="img"
            aria-label={`${t.starsOverTime}, ${t.stars}: ${last.cumulative}, ${points.length} ${points.length === 1 ? t.activeDay : t.activeDays}`}
          >
            <defs>
              <linearGradient id="stars-area" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={AMBER} stopOpacity="0.45" />
                <stop offset="100%" stopColor={AMBER} stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* Baseline */}
            <line
              x1={PAD}
              y1={baseline}
              x2={W - PAD}
              y2={baseline}
              stroke="#ffffff"
              strokeOpacity="0.2"
              strokeWidth="1"
            />

            {points.length > 1 && <path d={area} fill="url(#stars-area)" />}

            {points.length > 1 ? (
              <polyline
                points={line}
                fill="none"
                stroke={AMBER}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              // One recorded day: a value guide rather than a lone spike.
              <line
                x1={PAD}
                y1={last.y}
                x2={W - PAD}
                y2={last.y}
                stroke={AMBER}
                strokeWidth="1.5"
                strokeOpacity="0.45"
                strokeDasharray="4 4"
              />
            )}

            {points.map((p) => (
              <circle key={p.date} cx={p.x} cy={p.y} r="3.5" fill={AMBER} stroke="#14100A" strokeWidth="1.5" />
            ))}
          </svg>

          <div className="flex items-center justify-between mt-1.5 text-[10px] font-semibold text-white/70 tabular-nums">
            <span>{dayLabel(points[0].date)}</span>
            <span className="uppercase tracking-wide">
              {points.length} {points.length === 1 ? t.activeDay : t.activeDays}
            </span>
            {points.length > 1 && <span>{dayLabel(last.date)}</span>}
          </div>
        </>
      )}
    </div>
  );
}

/** Success rate per region, straight from the per question memory. */
export function RegionAccuracyChart({ questionStats = {} }) {
  const t = useT();
  const lang = useLang();
  const rows = regionAccuracy(questionStats, getLevels(lang));
  const answered = rows.filter((row) => row.accuracy !== null);

  return (
    <div className="bg-[#1C150C] border border-white/10 rounded-2xl p-4">
      <p className="flex items-center gap-1.5 text-white/80 text-xs font-bold uppercase tracking-widest mb-3">
        <MapPin className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
        {t.accuracyByRegion}
      </p>

      {answered.length === 0 ? (
        <p className="text-white/70 text-xs">{t.noChartData}</p>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => {
            const color = accuracyColor(row.accuracy);
            return (
              <div key={row.region}>
                <div className="flex items-baseline justify-between mb-1.5 gap-2">
                  <span className="text-white/85 text-xs font-semibold truncate">{row.region}</span>
                  <span className="text-white text-xs font-extrabold tabular-nums shrink-0">
                    {row.accuracy === null ? t.noAnswersYet : `${row.accuracy}%`}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-[width] duration-300"
                    style={{ width: `${row.accuracy || 0}%`, background: color || "transparent" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
