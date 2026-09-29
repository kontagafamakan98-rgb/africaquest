import { useState } from "react";
import { Zap, CheckCircle2, XCircle, RotateCcw, ArrowRight, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useT } from "../i18n";
import { flashQuizMissedFacts, quickQuizVerdict, FLASH_QUIZ_VERDICT_KEYS } from "../../lib/quick-quiz.js";

/**
 * A short self check at the end of a lesson. It asks a few questions from the
 * level, one at a time, and tells the player whether to start the real quiz or
 * to reread a couple of points first.
 *
 * It awards nothing: no stars, no XP, no finished level. But every answer is
 * handed to the parent, which writes it to the review memory, so a question
 * missed a minute after reading it comes back in the next review session.
 *
 * `items` are { index, question } pairs, where `index` is the question's position
 * in the level and therefore its key in the review memory.
 */
export default function FlashQuiz({ items = [], onAnswer }) {
  const t = useT();
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);

  if (items.length === 0) return null;

  const total = items.length;
  const { index, question } = items[step];
  const answered = selected !== null;
  const isRight = selected === question.correct;
  const isLast = step + 1 >= total;

  const choose = (optionIndex) => {
    if (answered) return;
    const correct = optionIndex === question.correct;
    setSelected(optionIndex);
    setAnswers((previous) => {
      const next = [...previous];
      next[step] = correct;
      return next;
    });
    // Off by one here would schedule the wrong question for review.
    onAnswer?.(index, correct);
  };

  const advance = () => {
    if (isLast) {
      setFinished(true);
      return;
    }
    setStep(step + 1);
    setSelected(null);
  };

  const restart = () => {
    setStep(0);
    setSelected(null);
    setAnswers([]);
    setFinished(false);
  };

  if (finished) {
    const correct = answers.filter((value) => value === true).length;
    const verdict = quickQuizVerdict(correct, total);
    const missedFacts = flashQuizMissedFacts(items.map((item) => item.question), answers);
    return (
      <section className="rounded-2xl border-2 border-amber-200 bg-white p-4">
        <h2 className="flex items-center gap-2 text-xs font-extrabold text-slate-700 uppercase tracking-widest mb-3">
          <Zap className="w-4 h-4 text-amber-600" aria-hidden="true" />
          {t.flashQuiz}
        </h2>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-extrabold text-slate-800 tabular-nums">
            {correct}/{total}
          </p>
          <p className="text-xs text-slate-600 font-medium">{t.flashQuizScore}</p>
        </div>
        <p
          className={cn(
            "text-sm font-bold mt-1.5",
            verdict === "ready" ? "text-emerald-700" : "text-amber-700"
          )}
        >
          {t[FLASH_QUIZ_VERDICT_KEYS[verdict]]}
        </p>

        {missedFacts.length > 0 && (
          <div className="mt-4">
            <p className="flex items-center gap-2 text-xs font-extrabold text-slate-700 uppercase tracking-widest mb-2">
              <BookOpen className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
              {t.flashQuizPoints}
            </p>
            <ul className="space-y-2">
              {missedFacts.map((fact) => (
                <li
                  key={fact}
                  className="flex gap-2.5 bg-amber-50 border border-amber-200 rounded-xl p-3"
                >
                  <RotateCcw className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-sm text-amber-900 leading-relaxed">{fact}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="button"
          onClick={restart}
          className="mt-4 w-full inline-flex items-center justify-center gap-1.5 h-10 rounded-xl border border-amber-500/60 text-sm font-bold text-amber-800 hover:bg-amber-50 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          {t.flashQuizRetry}
        </button>
        <p className="text-[11px] text-slate-500 mt-2 text-center">{t.flashQuizNotGraded}</p>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="flash-quiz-heading"
      className="rounded-2xl border-2 border-amber-200 bg-white p-4"
    >
      <div className="flex items-center justify-between gap-3 mb-1">
        <h2
          id="flash-quiz-heading"
          className="flex items-center gap-2 text-xs font-extrabold text-slate-700 uppercase tracking-widest"
        >
          <Zap className="w-4 h-4 text-amber-600" aria-hidden="true" />
          {t.flashQuiz}
        </h2>
        <span className="text-[11px] font-bold text-slate-500 tabular-nums">
          {t.flashQuizQuestion} {step + 1} / {total}
        </span>
      </div>

      {step === 0 && <p className="text-xs text-slate-600 mb-3">{t.flashQuizIntro}</p>}

      <p className="text-sm font-bold text-slate-800 leading-snug mb-3">{question.question}</p>

      <div role="group" className="space-y-2">
        {question.options.map((option, optionIndex) => {
          const isCorrectOption = optionIndex === question.correct;
          const isChosen = optionIndex === selected;
          return (
            <button
              key={optionIndex}
              type="button"
              onClick={() => choose(optionIndex)}
              disabled={answered}
              className={cn(
                "w-full flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-colors",
                !answered && "border-slate-200 bg-white hover:border-amber-400",
                answered && isCorrectOption && "border-emerald-500 bg-emerald-50",
                answered && isChosen && !isCorrectOption && "border-red-500 bg-red-50",
                answered && !isCorrectOption && !isChosen && "border-slate-200 bg-white opacity-60"
              )}
            >
              <span
                className={cn(
                  "w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-extrabold shrink-0 border",
                  !answered && "bg-slate-50 border-slate-200 text-slate-600",
                  answered && isCorrectOption && "bg-emerald-600 border-emerald-600 text-white",
                  answered && isChosen && !isCorrectOption && "bg-red-600 border-red-600 text-white",
                  answered && !isCorrectOption && !isChosen && "bg-slate-50 border-slate-200 text-slate-500"
                )}
                aria-hidden="true"
              >
                {String.fromCharCode(65 + optionIndex)}
              </span>
              <span className="text-sm text-slate-800 leading-snug">{option}</span>
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="mt-3" role="status">
          {isRight ? (
            <p className="flex items-center gap-1.5 text-sm font-bold text-emerald-700">
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
              {t.correct}
            </p>
          ) : (
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
              <p className="flex items-center gap-1.5 text-sm font-bold text-red-700 mb-1.5">
                <XCircle className="w-4 h-4" aria-hidden="true" />
                {t.incorrect}
              </p>
              <p className="text-sm text-amber-900 leading-relaxed">{question.fact}</p>
            </div>
          )}
        </div>
      )}

      {answered && (
        <button
          type="button"
          onClick={advance}
          className="mt-3 w-full inline-flex items-center justify-center gap-1.5 h-11 rounded-xl bg-gradient-to-r from-amber-700 to-orange-800 hover:from-amber-800 hover:to-orange-900 text-white font-bold text-sm shadow-lg shadow-amber-900/20"
        >
          {isLast ? t.flashQuizFinish : t.flashQuizNext}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </section>
  );
}
