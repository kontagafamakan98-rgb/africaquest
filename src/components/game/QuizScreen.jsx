import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, XCircle, Lightbulb, ChevronLeft, Clock, ClipboardList, TrendingUp, TrendingDown, Trophy, ArrowUp, ArrowDown, Printer } from "lucide-react";
import StarDisplay from "./StarDisplay";
import HintModal, { MAX_ELIMINATIONS } from "./HintModal";
import SourceReference from "./SourceReference";
import LevelPicture from "./LevelPicture";
// The three ways to play and what a run is worth, neither of which needs the
// questions of twenty-six levels: the level being played arrives on its own, through
// the loader in level-content.js.
import { DIFFICULTIES, EXAM } from "./difficulties";
import { calculateStars, getXPForScore } from "./scoring";
import { LEVEL_IMAGES } from "./level-summary";
import { useT, DIFFICULTY_LABEL_KEYS } from "../i18n";
import { formatDuration } from "../../lib/progress-report";
import { sessionRecap } from "./learning";
import { quizQuestions } from "./question-bank.js";
import { isChronological, movedMoment } from "./chronology.js";
import { emptyAssignment, isMatchingRight } from "./matching.js";
import { answerText, emptyAnswers, gradeRun, rightText } from "./exam.js";

export default function QuizScreen({ level, difficulty, onComplete, onBack, onAnswer, reviewMode = false, examMode = false, nextReviewText = null, history = null }) {
  const t = useT();
  // An exam is the fourth setting a level can be sat on, and it is not a
  // difficulty: see difficulties.js. It is read from either end - the picker
  // hands over its own id, and a caller may say so directly - so that a screen
  // opened by an address cannot be an exam in one place and a quiz in another.
  const isExam = examMode || difficulty === "exam";
  const diff = isExam ? EXAM : DIFFICULTIES[difficulty] || DIFFICULTIES.easy;
  // The run itself is built in question-bank.js, which the picker also reads,
  // so the number of questions it announced is the number asked here. It opens
  // on the chronology of the lesson, assembled from the level's own timeline in
  // the language on screen and shown in an order seeded by the level, so that a
  // re-render, a reload or a switch of language cannot move the moments under
  // the player's hands.
  const questions = quizQuestions(level, difficulty, { review: reviewMode });

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [showHints, setShowHints] = useState(false);
  const [removedOptions, setRemovedOptions] = useState([]);
  const [hintLetter, setHintLetter] = useState(null);
  // The arrangement a player has given to a chronology question, or null while
  // it is still the one the question was handed over in.
  const [arrangement, setArrangement] = useState(null);
  // The matches a player has given to a matching question, or null while none
  // has been given: read once below, the way the chronology's order is, so the
  // row that is drawn and the answer that is judged cannot disagree.
  const [matching, setMatching] = useState(null);
  const [announcement, setAnnouncement] = useState("");
  // What the player has given, one entry per question, for a run that is marked
  // at the end rather than as it is played. An exam says nothing until it is
  // over, and the marking needs the answers it was never allowed to judge.
  const [answers, setAnswers] = useState(() => emptyAnswers(questions.length));
  const [examResult, setExamResult] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef(null);
  const nextButtonRef = useRef(null);
  const questionRef = useRef(null);
  // Real play time clock: from the first question until the results screen.
  const startedAtRef = useRef(Date.now());

  const q = questions[currentQ];
  // The order a chronology question is currently in, and the one the lesson
  // tells. Read here rather than in the two handlers below so the row that is
  // being drawn and the answer that is being checked can never disagree.
  const order = q.type === "order" ? arrangement || q.order : null;
  const orderIsRight = q.type === "order" && isChronological(order);
  const assignment = q.type === "match" ? matching || emptyAssignment(q) : null;
  const matchIsRight = q.type === "match" && isMatchingRight(q, assignment);
  // A question that is not four answers to choose between. It is written once
  // here because three separate rules depend on it - no clock, no hint, and the
  // verdict read from the question rather than from a picked option - and three
  // copies of the same test is how one of them comes to disagree.
  const isAssembled = Boolean(q.type);
  // What the current question has been given so far, in the shape the marking
  // reads: a chronology as it stands, the matches as they stand, or the option
  // the player has picked. Null while nothing has been given, which is what an
  // exam has to be able to say.
  const currentAnswer =
    q.type === "order"
      ? { order }
      : q.type === "match"
        ? { match: assignment }
        : selected === null
          ? null
          : { choice: selected };
  const progress = ((currentQ + (isAnswered ? 1 : 0)) / questions.length) * 100;

  // Timer. An assembled question has no clock, and it is not a kindness: the
  // clock measures recognition on four answers, while putting moments in order
  // or matching three names to their descriptions is done a keystroke at a
  // time. Fifteen seconds of it would decide the question on how fast somebody
  // taps rather than on whether they know the period.
  useEffect(() => {
    if (diff.timeLimit === 0 || isAnswered || isAssembled) return;
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
    // An exam says nothing until it is over: a choice is recorded and shown as
    // chosen rather than marked, and the player can change it until the run
    // moves on. Everything below is the practice shape, where the verdict is
    // the point of answering at all.
    if (isExam) {
      setSelected(idx);
      setAnswers((previous) => previous.map((answer, at) => (at === currentQ ? { choice: idx } : answer)));
      // Choosing an answer colours a button and changes nothing else, and a
      // colour is exactly what a reader who cannot see the screen does not get:
      // so the choice is said out loud, the way a moved moment is.
      setAnnouncement(`${t.examChosen} ${q.options[idx]}`);
      return;
    }
    clearInterval(timerRef.current);
    setSelected(idx);
    setIsAnswered(true);
    const isCorrect = idx === q.correct;
    if (isCorrect) setScore((s) => s + 1);
    // Feed the learning memory so mistakes can be reviewed later. The position
    // the question holds in its own level travels with it, because the memory is
    // keyed by that position and not by its place in the chosen set.
    onAnswer?.(q.__index ?? currentQ, isCorrect);
  };

  const handleNext = () => {
    setShowHints(false);
    setRemovedOptions([]);
    setHintLetter(null);
    setArrangement(null);
    setMatching(null);
    setAnnouncement("");
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

  /**
   * One row of a chronology question moved by one place.
   *
   * The row's own text is announced into the live region, because a move is the
   * one thing here that changes the screen without moving the focus: a screen
   * reader user would otherwise be told nothing at all.
   */
  const handleMoveMoment = (position, by) => {
    if (isAnswered || q.type !== "order") return;
    const next = movedMoment(order, position, by);
    if (next === order) return;
    setArrangement(next);
    // In an exam the arrangement is the answer, so it is kept as it is made:
    // nothing else records it, and the marking at the end reads it back.
    if (isExam) {
      setAnswers((previous) => previous.map((answer, at) => (at === currentQ ? { order: next } : answer)));
    }
    setAnnouncement(`${q.steps[order[position]]}: ${t.chronologyNow} ${position + by + 1} ${t.of} ${order.length}`);
  };

  /**
   * One term of a matching question given a description.
   *
   * The choice is announced the way a moved moment is: picking a numbered button
   * changes the row without moving the focus, so a screen reader user would
   * otherwise hear nothing at all.
   */
  const handleMatchSet = (index, choice) => {
    if (isAnswered || q.type !== "match") return;
    const next = assignment.map((value, at) => (at === index ? choice : value));
    setMatching(next);
    // In an exam the matches are the answer, so they are kept as they are made:
    // nothing else records them, and the marking at the end reads them back.
    if (isExam) {
      setAnswers((previous) => previous.map((answer, at) => (at === currentQ ? { match: next } : answer)));
    }
    setAnnouncement(`${q.terms[index]}: ${t.matchingNow} ${choice + 1} ${t.of} ${q.definitions.length}`);
  };

  /**
   * The arrow keys walking the descriptions of one term.
   *
   * A group of choices answers the arrow keys, and not only the Tab key: a
   * reader who has just heard "one of three" reaches for the arrows, and a group
   * that ignores them reads as a list of buttons rather than as one choice. The
   * focus follows the choice, so what the screen reader announces next is the
   * description the player has just moved to.
   */
  const handleMatchKey = (event, index) => {
    const step =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? -1
          : 0;
    if (step === 0 || isAnswered || q.type !== "match") return;
    event.preventDefault();
    const count = q.definitions.length;
    // Nothing chosen yet is the end of the row for the key that would walk off
    // it, so the first press selects the first description going forwards and
    // the last going backwards.
    const from = assignment[index] === -1 ? (step > 0 ? -1 : 0) : assignment[index];
    const next = (from + step + count) % count;
    handleMatchSet(index, next);
    event.currentTarget.parentElement?.children[next]?.focus();
  };

  /**
   * The matching question checked.
   *
   * One question, one point: the score counts the question rather than the rows,
   * and the rows say which ones were right. Nothing is handed to the learning
   * memory, for the reason the chronology hands nothing over: the memory is
   * keyed by a position in the bank, and this question holds none.
   */
  const handleCheckMatch = () => {
    if (isAnswered) return;
    clearInterval(timerRef.current);
    setIsAnswered(true);
    if (isMatchingRight(q, assignment)) setScore((s) => s + 1);
  };

  /**
   * The chronology question answered.
   */
  const handleCheckOrder = () => {
    if (isAnswered) return;
    clearInterval(timerRef.current);
    setIsAnswered(true);
    if (isChronological(order)) setScore((s) => s + 1);
    // Nothing is handed to the learning memory, and there is nowhere to hand it:
    // that memory is keyed by the position a question holds in the bank it was
    // written in, and this question is assembled from the lesson when the level
    // is opened. It is scored with the rest of the run and does not enter the
    // rotation.
  };

  /**
   * One question of an exam given, and the run moving on.
   *
   * Nothing is judged here. What the player has just given is written onto the
   * answer sheet, the next question is shown, and the verdict waits for the
   * last one: marking a question the moment it is left would make the questions
   * after it easier, and a test that teaches as it goes is not a test.
   */
  const handleExamNext = () => {
    const sheet = answers.map((answer, at) => (at === currentQ ? currentAnswer : answer));
    setAnswers(sheet);

    if (currentQ < questions.length - 1) {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setArrangement(null);
      setMatching(null);
      setAnnouncement("");
      setTimeLeft(null);
      return;
    }

    const marked = gradeRun(questions, sheet);
    setScore(marked.score);
    setExamResult(marked);
    setElapsedSeconds(Math.max(0, Math.round((Date.now() - startedAtRef.current) / 1000)));
    setShowResults(true);
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
    // recap reads here is exactly the games that came before this one. An exam
    // is left out of both: it records nothing, so it has nothing to be compared
    // with, and a recap against runs that were kept would be inventing one.
    const recap =
      !isExam && history ? sessionRecap(history, { levelId: level.id, difficulty: diff.id, score }) : null;
    // The questions the exam did not get: the marking hands back positions, and
    // the run is what holds the questions they point at.
    const missed = examResult
      ? examResult.missed.map(({ index, answer }) => ({ question: questions[index], answer }))
      : [];
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
        exam={isExam}
        missed={missed}
        nextReviewText={nextReviewText}
        // An exam is not paid: the stars and the XP are handed back as zero
        // rather than as what a quiz of the same score would have earned, so
        // that a caller reading the mark cannot keep them by mistake.
        onComplete={() =>
          onComplete({
            score,
            total: questions.length,
            stars: isExam ? 0 : stars,
            xp: isExam ? 0 : xp,
            timeSeconds: elapsedSeconds,
            exam: isExam,
          })
        }
      />
    );
  }

  const timerPct = diff.timeLimit > 0 && timeLeft !== null ? (timeLeft / diff.timeLimit) * 100 : 100;
  const timerColor = timerPct > 50 ? "bg-emerald-500" : timerPct > 25 ? "bg-amber-500" : "bg-red-500";

  const img = LEVEL_IMAGES[level.id];
  const LevelIcon = level.icon;
  const DiffIcon = diff.icon;

  // A run is a screen of its own rather than a part of one: it is what a shared
  // link to a level opens. So it carries the page's landmark, and the level it
  // is playing is the heading the page is named by.
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
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
              <button onClick={onBack} aria-label={t.cancel} className="p-3 rounded-lg bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 transition-colors">
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
                  <DiffIcon className="w-3.5 h-3.5" aria-hidden="true" />
                  {isExam ? t.examMode : t[DIFFICULTY_LABEL_KEYS[diff.id]] || diff.label}
                </span>
              )}
              {!isAnswered && !isExam && !isAssembled && (
                <button
                  onClick={() => setShowHints(true)}
                  aria-label={t.hint}
                  className="p-3.5 rounded-lg bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 transition-colors"
                >
                  <Lightbulb className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>
            {/* Bottom: title + counter */}
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-white font-extrabold text-sm drop-shadow">{level.title}</h1>
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
            <h2 ref={questionRef} tabIndex={-1} className="text-xl font-bold text-slate-800 leading-snug focus:outline-none">
              {q.type === "order" ? t.chronologyQuestion : q.type === "match" ? t.matchingQuestion : q.question}
            </h2>
          </div>

          {/* Announced to screen readers when an answer is checked, and when a
              moment of a chronology question is moved. */}
          <div role="status" aria-live="polite" className="sr-only">
            {isAnswered &&
              // The verdict is a word rather than a flag: a screen reader is
              // handed the same sentence for both kinds of question, and a
              // boolean drawn as a child would say nothing at all.
              ((q.type === "order" ? orderIsRight : q.type === "match" ? matchIsRight : selected === q.correct)
                ? t.correct
                : t.incorrect)}
            {!isAnswered && announcement}
          </div>

          {q.type === "order" ? (
            <div>
              <ol className="space-y-3">
                {order.map((moment, position) => {
                  const inPlace = isAnswered && moment === position;
                  return (
                    <li
                      key={moment}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border-2 bg-white px-3 py-2.5 shadow-sm",
                        !isAnswered && "border-slate-200",
                        inPlace && "border-emerald-400 bg-emerald-50",
                        isAnswered && !inPlace && "border-red-300 bg-red-50"
                      )}
                    >
                      <span className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0",
                        !isAnswered && "bg-slate-100 text-slate-600",
                        inPlace && "bg-emerald-200 text-emerald-700",
                        isAnswered && !inPlace && "bg-red-200 text-red-600"
                      )}>
                        {position + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-800 leading-relaxed">{q.steps[moment]}</p>
                        {/* The date is the answer's own justification, so it is
                            shown once the player has given theirs. */}
                        {isAnswered && (
                          <p className="text-xs font-bold text-amber-700 mt-0.5">{q.years[moment]}</p>
                        )}
                      </div>
                      {isAnswered ? (
                        inPlace ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500 shrink-0" aria-hidden="true" />
                        )
                      ) : (
                        /* A list reordered with two buttons rather than by
                           dragging: a drag is the one gesture a keypad cannot
                           make and a screen reader cannot describe, and the
                           names of the two buttons carry the moment they move
                           so that neither is ever "the second one". */
                        <div className="flex flex-col gap-1 shrink-0">
                          <button
                            onClick={() => handleMoveMoment(position, -1)}
                            disabled={position === 0}
                            aria-label={`${t.chronologyMoveUp}: ${q.steps[moment]}`}
                            className="p-3.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white transition-colors"
                          >
                            <ArrowUp className="w-4 h-4" aria-hidden="true" />
                          </button>
                          <button
                            onClick={() => handleMoveMoment(position, 1)}
                            disabled={position === order.length - 1}
                            aria-label={`${t.chronologyMoveDown}: ${q.steps[moment]}`}
                            className="p-3.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white transition-colors"
                          >
                            <ArrowDown className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ol>
              {!isAnswered && !isExam && (
                <Button
                  onClick={handleCheckOrder}
                  className="w-full h-12 mt-3 rounded-xl bg-gradient-to-r from-amber-700 to-orange-800 hover:from-amber-800 hover:to-orange-900 text-white font-bold text-base shadow-lg shadow-amber-900/20"
                >
                  {t.chronologyCheck}
                </Button>
              )}
            </div>
          ) : q.type === "match" ? (
            <div>
              {/* The descriptions are listed once and numbered, and each one is
                  chosen by its number: writing the descriptions beside every
                  name would print the same three sentences three times over,
                  and a list of names each followed by a wall of text is a
                  screen nobody reads. */}
              <ol className="space-y-2">
                {q.definitions.map((definition, position) => (
                  <li
                    key={position}
                    className="flex gap-3 rounded-xl border-2 border-slate-200 bg-white px-3 py-2.5 shadow-sm"
                  >
                    <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center shrink-0">
                      {position + 1}
                    </span>
                    <p className="text-sm text-slate-700 leading-relaxed min-w-0">{definition}</p>
                  </li>
                ))}
              </ol>

              <ul className="mt-4 space-y-2">
                {q.terms.map((term, index) => {
                  const inPlace = isAnswered && assignment[index] === q.solution[index];
                  return (
                    <li
                      key={term}
                      className={cn(
                        "rounded-xl border-2 bg-white px-3 py-3 shadow-sm",
                        !isAnswered && "border-slate-200",
                        inPlace && "border-emerald-400 bg-emerald-50",
                        isAnswered && !inPlace && "border-red-300 bg-red-50"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-slate-800 min-w-0 flex-1">{term}</p>
                        {isAnswered &&
                          (inPlace ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500 shrink-0" aria-hidden="true" />
                          ))}
                      </div>
                      {/* A row of numbered buttons rather than a dropdown: the
                          numbers of the descriptions above are what is being
                          chosen, so they have to stay on the screen while the
                          choice is made. Each button carries the term it belongs
                          to, because a screen reader hears "2" and nothing else
                          otherwise. */}
                      <div
                        role="radiogroup"
                        aria-label={`${term}: ${t.matchingChooseOne}`}
                        className="flex gap-1.5 mt-2"
                      >
                        {q.definitions.map((_definition, choice) => (
                          <button
                            key={choice}
                            type="button"
                            role="radio"
                            aria-checked={assignment[index] === choice}
                            onClick={() => handleMatchSet(index, choice)}
                            onKeyDown={(event) => handleMatchKey(event, index)}
                            disabled={isAnswered}
                            className={cn(
                              "w-11 h-11 rounded-lg border-2 text-sm font-bold flex items-center justify-center transition-colors",
                              assignment[index] === choice
                                ? "border-amber-400 bg-amber-100 text-amber-800"
                                : "border-slate-200 text-slate-600 hover:bg-slate-100",
                              isAnswered && choice === q.solution[index] && "border-emerald-400 bg-emerald-100 text-emerald-800"
                            )}
                          >
                            {choice + 1}
                          </button>
                        ))}
                      </div>
                    </li>
                  );
                })}
              </ul>

              {!isAnswered && !isExam && (
                <Button
                  onClick={handleCheckMatch}
                  disabled={assignment.includes(-1)}
                  className="w-full h-12 mt-3 rounded-xl bg-gradient-to-r from-amber-700 to-orange-800 hover:from-amber-800 hover:to-orange-900 text-white font-bold text-base shadow-lg shadow-amber-900/20 disabled:opacity-50"
                >
                  {t.matchingCheck}
                </Button>
              )}
            </div>
          ) : (
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
                      // In an exam a chosen answer is shown as chosen and left
                      // unjudged: the mark comes at the end, and a colour here
                      // would be the verdict arriving early.
                      !isRemoved && !isAnswered && isExam && isSelected && "border-amber-500 bg-amber-50",
                      !isRemoved && !isAnswered && !(isExam && isSelected) && "hover:border-amber-400 hover:bg-amber-50 border-slate-200 bg-white",
                      !isRemoved && isAnswered && isCorrect && "border-emerald-400 bg-emerald-50 text-emerald-800",
                      !isRemoved && isAnswered && isSelected && !isCorrect && "border-red-300 bg-red-50 text-red-700",
                      !isRemoved && isAnswered && !isSelected && !isCorrect && "border-slate-200 bg-slate-50 text-slate-600"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0",
                        isRemoved && "bg-slate-200 text-slate-600",
                        !isRemoved && !isAnswered && isExam && isSelected && "bg-amber-200 text-amber-800",
                        !isRemoved && !isAnswered && !(isExam && isSelected) && "bg-slate-100 text-slate-600",
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
          )}

          {/* One button for the whole run, and no verdict beside it: an exam is
              marked when it is over, so the only thing left to do is go on. */}
          {isExam && !isAnswered && (
            <Button
              onClick={handleExamNext}
              disabled={isAssembled ? false : selected === null}
              className="w-full h-12 mt-4 rounded-xl bg-gradient-to-r from-amber-700 to-orange-800 hover:from-amber-800 hover:to-orange-900 text-white font-bold text-base shadow-lg shadow-amber-900/20 disabled:opacity-50"
            >
              {currentQ < questions.length - 1 ? (
                <>{t.continue} <ArrowRight className="w-4 h-4 ml-2" /></>
              ) : (
                t.seeResults
              )}
            </Button>
          )}

          {isAnswered && (
            <div className="mt-6 space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-2 min-w-0">
                  {/* A chronology question is assembled from the lesson and has
                      no anecdote of its own; the explanation is what the dates
                      just revealed mean. */}
                  <p className="text-sm text-amber-900 leading-relaxed">
                    {q.type === "order" ? t.chronologyFact : q.type === "match" ? t.matchingFact : q.fact}
                  </p>
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
    </main>
  );
}

function ResultsScreen({ level, difficulty, score, total, stars, xp, timeSeconds = 0, recap = null, onComplete, reviewMode, exam = false, missed = [], nextReviewText }) {
  const t = useT();
  const pct = Math.round((score / total) * 100);
  const message = exam
    ? t.examResults
    : reviewMode
      ? t.reviewComplete
      : pct === 100 ? t.perfect : pct >= 70 ? t.greatJob : pct >= 50 ? t.goodTry : t.keepPracticing;
  const img = LEVEL_IMAGES[level.id];
  const LevelIcon = level.icon;
  const DiffIcon = difficulty.icon;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <div className="relative h-48 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${level.color}`} />
        {img && <LevelPicture src={img} alt="" className="absolute inset-0 w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 text-center">
          <p className="text-white/85 text-xs uppercase tracking-widest font-bold">{level.region}</p>
          <h1 className="text-white font-extrabold text-lg">{level.title}</h1>
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
                <DiffIcon className="w-3.5 h-3.5" aria-hidden="true" />
                {/* An exam is not a difficulty and has no multiplier to name:
                    printing "0× XP" beside it would read as a setting nobody
                    would choose rather than as a run that is not paid. */}
                {exam ? (
                  t.examMode
                ) : (
                  <>
                    {t[DIFFICULTY_LABEL_KEYS[difficulty.id]] || difficulty.label} · {difficulty.xpMultiplier}
                    {t.xpMultiplier}
                  </>
                )}
              </span>
            )}
          </div>

          {/* Stars + stats (a review session awards nothing and an exam is not
              paid at all: both show the score alone) */}
          {exam ? (
            <div className="bg-white rounded-2xl border-2 border-slate-100 p-5 shadow-sm mb-5">
              <p className="text-3xl font-extrabold text-slate-800 tabular-nums">{score}/{total}</p>
              <p className="text-xs text-slate-600 font-medium mt-1">{t.correct}</p>
              <p className="text-xs text-slate-500 leading-relaxed mt-3 pt-3 border-t border-slate-100">
                {t.examNotGraded}
              </p>
            </div>
          ) : reviewMode ? (
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

          {/* What the exam did not get, with the right answer beside it: the
              point of a marked run is the list of what to work on, and the
              explanation is already written for that question's lesson. */}
          {exam && (
            <section className="mb-5 text-left">
              <h3 className="flex items-center gap-1.5 text-slate-500 text-[11px] font-bold uppercase tracking-widest mb-2 px-1">
                <XCircle className="w-3.5 h-3.5 text-red-500" aria-hidden="true" />
                {t.examMissed}
              </h3>

              {missed.length === 0 ? (
                <p className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm px-4 py-3 text-sm text-slate-600">
                  {t.examMissedNone}
                </p>
              ) : (
                <ol className="space-y-3">
                  {missed.map((item, position) => (
                    <li
                      key={item.question?.question ?? position}
                      className="bg-white rounded-2xl border-2 border-slate-100 shadow-sm p-4"
                    >
                      <div className="flex gap-3">
                        <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center shrink-0">
                          {position + 1}
                        </span>
                        <p className="text-sm font-bold text-slate-800 leading-snug min-w-0">
                          {item.question?.type === "order"
                            ? t.chronologyQuestion
                            : item.question?.type === "match"
                              ? t.matchingQuestion
                              : item.question?.question}
                        </p>
                      </div>
                      <p className="text-sm text-red-700 mt-2 leading-relaxed">
                        {t.examYourAnswer}: {answerText(item.question, item.answer) || t.examNoAnswer}
                      </p>
                      <p className="text-sm text-emerald-800 mt-1 leading-relaxed">
                        {t.examCorrectAnswer}: {rightText(item.question)}
                      </p>
                      <p className="text-xs text-amber-800 mt-2 leading-relaxed">
                        {item.question?.type === "order"
                          ? t.chronologyFact
                          : item.question?.type === "match"
                            ? t.matchingFact
                            : item.question?.fact}
                      </p>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          )}

          {/* How this game sits next to the ones before it. A review session is
              left out: it awards nothing and records no result to compare. */}
          {!reviewMode && recap && (
            <RecapCard recap={recap} score={score} total={total} stars={stars} timeSeconds={timeSeconds} />
          )}

          {exam && (
            <button
              onClick={() => window.print()}
              className="w-full h-12 mb-3 rounded-xl border-2 border-slate-300 bg-white text-slate-700 font-bold text-base hover:bg-slate-50 active:scale-[0.99] transition-colors flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4" aria-hidden="true" />
              {t.printSheet}
            </button>
          )}

          <Button
            onClick={onComplete}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-700 to-orange-800 hover:from-amber-800 hover:to-orange-900 text-white font-bold text-base shadow-lg shadow-amber-900/20"
          >
            {t.continue} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </main>
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
