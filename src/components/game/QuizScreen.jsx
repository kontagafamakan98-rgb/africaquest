import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, XCircle, Lightbulb, ChevronLeft, Clock, ClipboardList, TrendingUp, TrendingDown, Trophy } from "lucide-react";
import StarDisplay from "./StarDisplay";
import HintModal, { MAX_ELIMINATIONS } from "./HintModal";
import SourceReference from "./SourceReference";
import LevelPicture from "./LevelPicture";
import { calculateStars, getXPForScore, DIFFICULTIES } from "./gameData";
import { LEVEL_IMAGES } from "./level-summary";
import { useT, DIFFICULTY_LABEL_KEYS } from "../i18n";
import { formatDuration } from "../../lib/progress-report";
import { sessionRecap } from "./learning";

export default function QuizScreen({ level, difficulty, onComplete, onBack, onAnswer, reviewMode = false, nextReviewText = null, history = null }) {
  const t = useT();
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [showHints, setShowHints] = useState(false);
  const [removedOptions, setRemovedOptions] = useState([]);
  const [hintLetter, setHintLetter] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef(null);
  const nextButtonRef = useRef(null);
  const questionRef = useRef(null);
  // Real play time clock: from the first question until the results screen.
  const startedAtRef = useRef(Date.now());

  const diff = DIFFICULTIES[difficulty] || DIFFICULTIES.easy;
  const questions = level.questions;
  const q = questions[currentQ];
  const progress = ((currentQ + (isAnswered ? 1 : 0)) / questions.length) * 100;

  // Timer
  useEffect(() => {
    if (diff.timeLimit === 0 || isAnswered) return;
    setTimeLeft(diff.timeLimit);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleSelect(-1); // time out = wrong
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [currentQ, isAnswered]);

  // Keep keyboard users oriented: focus the next action once an answer is given,
  // and focus the new question when a new one is shown.
  useEffect(() => {
    if (isAnswered) nextButtonRef.current?.focus();
  }, [isAnswered]);

  useEffect(() => {
    if (!isAnswered) questionRef.current?.focus();
  }, [currentQ, isAnswered]);

  const handleSelect = (idx) => {
    if (isAnswered || removedOptions.includes(idx)) return;
    clearInterval(timerRef.current);
    setSelected(idx);
    setIsAnswered(true);
    const isCorrect = idx === q.correct;
    if (isCorrect) setScore((s) => s + 1);
    // Feed the learning memory so mistakes can be reviewed later.
    onAnswer?.(currentQ, isCorrect);
  };

  const handleNext = () => {
    setShowHints(false);
    setRemovedOptions([]);
    setHintLetter(null);
    if (currentQ < questions.length - 1) {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setIsAnswered(false);
      setTimeLeft(null);
    } else {
      setElapsedSeconds(Math.max(0, Math.round((Date.now() - startedAtRef.current) / 1000)));
      setShowResults(true);
    }
  };

  // Local hints: eliminate a wrong option, or reveal the first letter.
  const handleRemoveOption = () => {
    if (removedOptions.length >= MAX_ELIMINATIONS) return;
    const wrong = q.options
      .map((_, i) => i)
      .filter((i) => i !== q.correct && !removedOptions.includes(i));
    if (wrong.length === 0) return;
    const pick = wrong[Math.floor(Math.random() * wrong.length)];
    setRemovedOptions((prev) => [...prev, pick]);
  };

  const handleRevealLetter = () => {
    if (hintLetter) return;
    setHintLetter(q.options[q.correct].charAt(0));
  };

  if (showResults) {
    const stars = calculateStars(score, questions.length);
    const xp = Math.round(getXPForScore(score, questions.length) * diff.xpMultiplier);
    // The finished game is written to the history by the caller, so what the
    // recap reads here is exactly the games that came before this one.
    const recap = history ? sessionRecap(history, { levelId: level.id, difficulty: diff.id, score }) : null;
    return (
      <ResultsScreen
        level={level}
        difficulty={diff}
        score={score}
        total={questions.length}
        stars={stars}
        xp={xp}
        timeSeconds={elapsedSeconds}
        recap={recap}
        reviewMode={reviewMode}
        nextReviewText={nextReviewText}
        onComplete={() => onComplete({ score, total: questions.length, stars, xp, timeSeconds: elapsedSeconds })}
      />
    );
  }

  const timerPct = diff.timeLimit > 0 && timeLeft !== null ? (timeLeft / diff.timeLimit) * 100 : 100;
  const timerColor = timerPct > 50 ? "bg-emerald-500" : timerPct > 25 ? "bg-amber-500" : "bg-red-500";

  const img = LEVEL_IMAGES[level.id];
  const LevelIcon = level.icon;
  const DiffIcon = diff.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-lg mx-auto">
        <HintModal
          open={showHints}
          onClose={() => setShowHints(false)}
          question={q.question}
          removedOptions={removedOptions}
          onRemoveOption={handleRemoveOption}
          revealLetter={hintLetter}
          onRevealLetter={handleRevealLetter}
        />

        {/* Hero image strip with header overlaid */}
        <div className="relative h-36 overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${level.color}`} />
          {img && <LevelPicture src={img} alt="" className="absolute inset-0 w-full h-full object-cover" />}
          {/* Darker at the top and bottom where the text and controls sit, so
              the overlaid text keeps AA contrast over any photo. */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80" />
          <div className="absolute inset-0 px-4 py-3 flex flex-col justify-between">
            {/* Top row */}
            <div className="flex items-center gap-3">
              <button onClick={onBack} aria-label={t.cancel} className="p-2 rounded-lg bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex-1">
                <div
                  className="h-2 bg-white/30 rounded-full overflow-hidden"
                  role="progressbar"
                  aria-label={t.quizProgressLabel}
                  aria-valuemin={0}
                  aria-valuemax={questions.length}
                  aria-valuenow={currentQ + (isAnswered ? 1 : 0)}
                >
                  <div
                    className="h-full rounded-full bg-white transition-[width] duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              {!reviewMode && (
                <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md backdrop-blur-sm bg-black/60 text-white">
                  <DiffIcon className="w-3.5 h-3.5" aria-hidden="true" /> {t[DIFFICULTY_LABEL_KEYS[diff.id]] || diff.label}
                </span>
              )}
              {!isAnswered && (
                <button
                  onClick={() => setShowHints(true)}
                  aria-label={t.hint}
                  className="p-2 rounded-lg bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 transition-colors"
                >
                  <Lightbulb className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>
            {/* Bottom: title + counter */}
            <div className="flex items-end justify-between">
              <div>
                <p className="text-white font-extrabold text-sm drop-shadow">{level.title}</p>
                <p className="text-white/85 text-xs">{level.region}</p>
              </div>
              <LevelIcon className="w-6 h-6 text-white/90" aria-hidden="true" />
            </div>
          </div>
        </div>

        <div className="px-4 pt-4">

        {/* Timer bar */}
        {diff.timeLimit > 0 && timeLeft !== null && !isAnswered && (
          <div className="mb-3">
            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-300", timerColor)}
                style={{ width: `${timerPct}%` }}
              />
            </div>
            <div className="flex items-center gap-1 mt-1" role="timer" aria-live="off">
              <Clock className="w-3 h-3 text-slate-500" aria-hidden="true" />
              <span className={cn("text-xs font-bold tabular-nums", timerPct <= 25 ? "text-red-600" : "text-slate-600")}>
                {timeLeft}s
              </span>
            </div>
          </div>
        )}

        {/* Question */}
        <div>
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-amber-100 text-xs font-extrabold text-amber-700 mb-3">
              {currentQ + 1}/{questions.length}
            </div>
            <h2 ref={questionRef} tabIndex={-1} className="text-xl font-bold text-slate-800 leading-snug focus:outline-none">{q.question}</h2>
          </div>

          {/* Announced to screen readers when an answer is checked */}
          <div role="status" aria-live="polite" className="sr-only">
            {isAnswered && (selected === q.correct ? t.correct : t.incorrect)}
          </div>

          <div className="space-y-3">
            {q.options.map((opt, idx) => {
              const isCorrect = idx === q.correct;
              const isSelected = idx === selected;
              const isRemoved = removedOptions.includes(idx);
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={isAnswered || isRemoved}
                  className={cn(
                    "w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200 font-medium shadow-sm",
                    isRemoved && "border-slate-200 bg-slate-100 text-slate-600 line-through",
                    !isRemoved && !isAnswered && "hover:border-amber-400 hover:bg-amber-50 border-slate-200 bg-white",
                    !isRemoved && isAnswered && isCorrect && "border-emerald-400 bg-emerald-50 text-emerald-800",
                    !isRemoved && isAnswered && isSelected && !isCorrect && "border-red-300 bg-red-50 text-red-700",
                    !isRemoved && isAnswered && !isSelected && !isCorrect && "border-slate-200 bg-slate-50 text-slate-600"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0",
                      isRemoved && "bg-slate-200 text-slate-600",
                      !isRemoved && !isAnswered && "bg-slate-100 text-slate-600",
                      !isRemoved && isAnswered && isCorrect && "bg-emerald-200 text-emerald-700",
                      !isRemoved && isAnswered && isSelected && !isCorrect && "bg-red-200 text-red-600",
                      !isRemoved && isAnswered && !isSelected && !isCorrect && "bg-slate-200 text-slate-600"
                    )}>
                      {isAnswered && isCorrect ? <CheckCircle2 className="w-4 h-4" /> :
                       isAnswered && isSelected && !isCorrect ? <XCircle className="w-4 h-4" /> :
                       String.fromCharCode(65 + idx)}
                    </span>
                    <span>{opt}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="mt-6 space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-2 min-w-0">
                  <p className="text-sm text-amber-900 leading-relaxed">{q.fact}</p>
                  {/* Where this very explanation comes from: a teacher can check it. */}
                  <SourceReference source={q.source} tone="amber" />
                </div>
              </div>
              <Button
                ref={nextButtonRef}
                onClick={handleNext}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-700 to-orange-800 hover:from-amber-800 hover:to-orange-900 text-white font-bold text-base shadow-lg shadow-amber-900/20"
              >
                {currentQ < questions.length - 1 ? (
                  <>{t.continue} <ArrowRight className="w-4 h-4 ml-2" /></>
                ) : t.seeResults}
              </Button>
            </div>
          )}
        </div>
        </div>{/* end px-4 */}
        </div>{/* end max-w-lg */}
    </div>
  );
}

function ResultsScreen({ level, difficulty, score, total, stars, xp, timeSeconds = 0, recap = null, onComplete, reviewMode, nextReviewText }) {
  const t = useT();
  const pct = Math.round((score / total) * 100);
  const message = reviewMode
    ? t.reviewComplete
    : pct === 100 ? t.perfect : pct >= 70 ? t.greatJob : pct >= 50 ? t.goodTry : t.keepPracticing;
  const img = LEVEL_IMAGES[level.id];
  const LevelIcon = level.icon;
  const DiffIcon = difficulty.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <div className="relative h-48 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${level.color}`} />
        {img && <LevelPicture src={img} alt="" className="absolute inset-0 w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 text-center">
          <p className="text-white/85 text-xs uppercase tracking-widest font-bold">{level.region}</p>
          <h3 className="text-white font-extrabold text-lg">{level.title}</h3>
        </div>
      </div>

      <div className="px-4 pb-8 max-w-sm mx-auto">
        <div className="text-center">
          {/* Result banner */}
          <div className={cn(
            "rounded-2xl p-5 mt-5 mb-4 shadow-lg",
            pct === 100 ? "bg-gradient-to-br from-amber-600 to-orange-700"
            : pct >= 70 ? "bg-gradient-to-br from-orange-600 to-red-700"
            : pct >= 50 ? "bg-gradient-to-br from-teal-600 to-emerald-700"
            : "bg-gradient-to-br from-slate-500 to-slate-600"
          )}>
            <LevelIcon className="w-10 h-10 text-white mx-auto mb-2" aria-hidden="true" />
            <h2 className="text-2xl font-extrabold text-white mb-1">{message}</h2>
            {!reviewMode && (
              <span className="inline-flex items-center gap-1 text-sm font-bold px-3 py-1 rounded-md bg-black/30 text-white">
                <DiffIcon className="w-3.5 h-3.5" aria-hidden="true" /> {t[DIFFICULTY_LABEL_KEYS[difficulty.id]] || difficulty.label} · {difficulty.xpMultiplier}{t.xpMultiplier}
              </span>
            )}
          </div>

          {/* Stars + stats (a review session awards nothing, only the score) */}
          {reviewMode ? (
            <div className="bg-white rounded-2xl border-2 border-slate-100 p-5 shadow-sm mb-5">
              <p className="text-3xl font-extrabold text-slate-800 tabular-nums">{score}/{total}</p>
              <p className="text-xs text-slate-600 font-medium mt-1">{t.correct}</p>
              {/* Spaced repetition is only useful if the player knows when the
                  questions come back: say it right after the session. */}
              {nextReviewText && (
                <p className="flex items-center justify-center gap-1.5 text-xs text-slate-600 font-medium mt-3 pt-3 border-t border-slate-100">
                  <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                  {t.reviewNextIn} <span className="font-bold text-slate-800">{nextReviewText}</span>
                </p>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border-2 border-slate-100 p-5 shadow-sm mb-5">
              <div className="flex justify-center mb-4">
                <StarDisplay count={stars} size="lg" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-3xl font-extrabold text-slate-800 tabular-nums">{score}/{total}</p>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">{t.correct}</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-3">
                  <p className="text-3xl font-extrabold text-amber-700 tabular-nums">+{xp}</p>
                  <p className="text-xs text-amber-700 font-medium mt-0.5">{t.xpEarned}</p>
                </div>
              </div>
            </div>
          )}

          {/* How this game sits next to the ones before it. A review session is
              left out: it awards nothing and records no result to compare. */}
          {!reviewMode && recap && (
            <RecapCard recap={recap} score={score} total={total} stars={stars} timeSeconds={timeSeconds} />
          )}

          <Button
            onClick={onComplete}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-700 to-orange-800 hover:from-amber-800 hover:to-orange-900 text-white font-bold text-base shadow-lg shadow-amber-900/20"
          >
            {t.continue} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * The game that just ended, next to the previous ones on the same level and the
 * same difficulty. A row only appears when the stored history really holds
 * something to compare with: a first game gets the two facts of the session and
 * a sentence saying so, never a row of zeros.
 */
function RecapCard({ recap, score, total, stars, timeSeconds }) {
  const t = useT();
  const played = recap.played > 0;

  return (
    <section className="mb-5 text-left">
      <h3 className="flex items-center gap-1.5 text-slate-500 text-[11px] font-bold uppercase tracking-widest mb-2 px-1">
        <ClipboardList className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
        {t.sessionRecap}
      </h3>

      <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm divide-y divide-slate-100">
        <RecapRow label={t.recapScore}>
          <span>
            {score}/{total}
          </span>
          {played && (
            <span className="flex items-center gap-1 text-xs font-medium text-slate-500">
              {t.recapLastTime} {recap.lastScore}/{recap.lastTotal || total}
              {recap.scoreDelta !== 0 && (
                <span
                  className={cn(
                    "flex items-center gap-0.5 font-bold",
                    recap.scoreDelta > 0 ? "text-emerald-600" : "text-orange-600"
                  )}
                >
                  {recap.scoreDelta > 0 ? (
                    <TrendingUp className="w-3 h-3" aria-hidden="true" />
                  ) : (
                    <TrendingDown className="w-3 h-3" aria-hidden="true" />
                  )}
                  {recap.scoreDelta > 0 ? `+${recap.scoreDelta}` : recap.scoreDelta}
                </span>
              )}
            </span>
          )}
        </RecapRow>

        {played && !recap.isNewBest && (
          <RecapRow label={t.recapBestBefore}>
            <span>
              {recap.bestScore}/{total}
            </span>
          </RecapRow>
        )}

        {played && recap.isNewBest && (
          <RecapRow label={t.recapBestBefore}>
            <span className="flex items-center gap-1 text-emerald-600">
              <Trophy className="w-3.5 h-3.5" aria-hidden="true" />
              {t.recapNewRecord}
            </span>
          </RecapRow>
        )}

        <RecapRow label={t.stars}>
          <span>
            {stars}
          </span>
          {played && (
            <span className="text-xs font-medium text-slate-500">
              {t.recapStarsRecord} {recap.bestStars}
            </span>
          )}
        </RecapRow>

        <RecapRow label={t.recapTime}>
          <span>{formatDuration(timeSeconds, t)}</span>
        </RecapRow>

        {played && (
          <RecapRow label={t.recapGamesBefore}>
            <span>{recap.played}</span>
          </RecapRow>
        )}
      </div>

      {!played && <p className="text-[11px] text-slate-500 px-1 mt-2">{t.recapFirstGame}</p>}
    </section>
  );
}

/** One line of the recap: what it is on the left, the figures on the right. */
function RecapRow({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <span className="text-xs text-slate-500 font-medium">{label}</span>
      <span className="flex items-center gap-1.5 text-sm font-extrabold text-slate-800 tabular-nums">
        {children}
      </span>
    </div>
  );
}
