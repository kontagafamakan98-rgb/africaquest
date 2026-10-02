import { useEffect, useState } from "react";
import {
  ChevronLeft, Lightbulb, CheckCircle2, ArrowRight, BookOpen,
  CalendarClock, Users, MapPin, BookMarked, Printer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LEVEL_IMAGES } from "./level-summary";
import ScreenSkeleton from "./ScreenSkeleton.jsx";
// The level this lesson is about, asked for on its own: the map knows a lesson's
// title and picture and deliberately not what it teaches, and the lesson is the
// one screen that knows which level it is. So it downloads that level rather
// than the whole game, and the screens that do need every level read gameData
// themselves.
import { loadLevel } from "./level-content";
import AudioNarrator, { getLevelStory } from "./AudioNarrator";
import SourceReference from "./SourceReference";
import LevelGallery from "./LevelGallery";
import LevelPicture from "./LevelPicture";
import FlashQuiz from "./FlashQuiz";
import { pickFlashQuizQuestions } from "../../lib/quick-quiz.js";
import { useT, useLang } from "../i18n";

/**
 * A reading-first lesson: the civilization's narrative, the audio narration and
 * every key fact from the level, so the player studies before being quizzed.
 *
 * It is opened by level id rather than handed a level. The map screen carries the
 * brief of the game - titles, pictures, the number of questions - and not the
 * questions themselves, so a lesson asks the browser for the one level it is
 * opening, with the study pack that belongs to it and no other.
 */
export default function LessonScreen({ levelId, onStartQuiz, onBack, onStudied, onFlashQuizAnswer }) {
  const t = useT();
  const lang = useLang();
  // Loading, then the level or nothing. Nothing rather than a crash, because a
  // card can only open a level the game holds, but an address can be typed.
  const [loaded, setLoaded] = useState({ ready: false, level: null });

  useEffect(() => {
    let alive = true;
    setLoaded({ ready: false, level: null });
    loadLevel(levelId, lang)
      .then((level) => {
        if (alive) setLoaded({ ready: true, level });
      })
      .catch(() => {
        // A level that cannot be fetched says so with the wait it already has,
        // rather than a screen that draws nothing at all.
        if (alive) setLoaded({ ready: true, level: null });
      });
    return () => {
      alive = false;
    };
  }, [levelId, lang]);

  const level = loaded.level;

  useEffect(() => {
    if (level) onStudied?.(level.id);
  }, [level?.id]);

  if (!loaded.ready) return <ScreenSkeleton variant="quiz" />;

  // A card can only open a level the game holds; the guard is here rather than
  // in the caller so nothing below has to ask whether the level arrived.
  if (!level) return null;

  const story = getLevelStory(level.id, lang);
  // The study pack of this level, which travelled with it rather than being
  // read from a module holding all twenty-six: the history in several paragraphs,
  // the timeline, the people, the places and the words. The lesson story is the
  // narration the player listens to, and stands in for the history if a level
  // ever arrived without one.
  const study = level.study;
  const history = study?.essay?.length ? study.essay : story ? [story] : [];
  const img = LEVEL_IMAGES[level.id];
  const Icon = level.icon;
  // Same questions in either language: only their wording changes.
  const flashQuizQuestions = pickFlashQuizQuestions(level.questions);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* No photograph and no controls on paper: the sheet opens on the name of
          the lesson instead, written just below, and a photograph prints as a
          page of ink. */}
      {/* The name of the lesson, over its photograph, outside the reading: a
          header is a landmark of its own, and content outside every landmark is
          what axe reports as a screen read in fragments. */}
      <header className="relative h-44 overflow-hidden print:hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${level.color}`} />
        {img && (
          <LevelPicture src={img} alt="" className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <button
          onClick={onBack}
          aria-label={t.backToLearn}
          className="absolute top-4 left-4 p-3 rounded-lg bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 transition-colors"
          style={{ marginTop: "var(--sat)" }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-4">
          <p className="text-amber-200/90 text-xs font-bold uppercase tracking-widest mb-0.5">{level.region}</p>
          <div className="flex items-end justify-between">
            <h1 className="text-2xl font-extrabold text-white drop-shadow">{level.title}</h1>
            <Icon className="w-8 h-8 text-white/90" aria-hidden="true" />
          </div>
          <p className="text-white/85 text-sm">{level.subtitle}</p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-5 space-y-6">
        {/* The name of the lesson, drawn for the sheet alone: on screen it is
            carried by the photograph above, and the photograph is not printed. */}
        <header className="hidden print:block">
          <h1 className="text-2xl font-extrabold text-slate-900">{level.title}</h1>
          <p className="text-sm font-semibold text-slate-700">{level.region}</p>
        </header>

        <div className="print:hidden">
          <AudioNarrator levelId={level.id} />
        </div>

        {history.length > 0 && (
          <section>
            <h2 className="flex items-center gap-2 text-xs font-extrabold text-slate-700 uppercase tracking-widest mb-2">
              <BookOpen className="w-4 h-4 text-amber-600" aria-hidden="true" />
              {t.lessonStory}
            </h2>
            <div className="space-y-3">
              {history.map((paragraph, index) => (
                <p key={index} className="text-sm text-slate-700 leading-relaxed">{paragraph}</p>
              ))}
            </div>
          </section>
        )}

        {study?.timeline?.length > 0 && (
          <section>
            <h2 className="flex items-center gap-2 text-xs font-extrabold text-slate-700 uppercase tracking-widest mb-3">
              <CalendarClock className="w-4 h-4 text-amber-600" aria-hidden="true" />
              {t.lessonTimeline}
            </h2>
            <ol className="space-y-3">
              {study.timeline.map((entry, index) => (
                <li key={index} className="border-l-2 border-amber-200 pl-3">
                  <p className="text-xs font-bold text-amber-700">{entry.year}</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{entry.text}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {study?.people?.length > 0 && (
          <section>
            <h2 className="flex items-center gap-2 text-xs font-extrabold text-slate-700 uppercase tracking-widest mb-3">
              <Users className="w-4 h-4 text-amber-600" aria-hidden="true" />
              {t.lessonPeople}
            </h2>
            <dl className="space-y-2.5">
              {study.people.map((entry, index) => (
                <div key={index} className="bg-white border border-slate-200 rounded-xl p-3">
                  <dt className="text-sm font-bold text-slate-800">{entry.name}</dt>
                  <dd className="text-sm text-slate-700 leading-relaxed">{entry.text}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {study?.places?.length > 0 && (
          <section>
            <h2 className="flex items-center gap-2 text-xs font-extrabold text-slate-700 uppercase tracking-widest mb-3">
              <MapPin className="w-4 h-4 text-amber-600" aria-hidden="true" />
              {t.lessonPlaces}
            </h2>
            <dl className="space-y-2.5">
              {study.places.map((entry, index) => (
                <div key={index} className="bg-white border border-slate-200 rounded-xl p-3">
                  <dt className="text-sm font-bold text-slate-800">{entry.name}</dt>
                  <dd className="text-sm text-slate-700 leading-relaxed">{entry.text}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <div className="print:hidden">
          <LevelGallery photos={level.gallery} />
        </div>

        {study?.glossary?.length > 0 && (
          <section>
            <h2 className="flex items-center gap-2 text-xs font-extrabold text-slate-700 uppercase tracking-widest mb-3">
              <BookMarked className="w-4 h-4 text-amber-600" aria-hidden="true" />
              {t.lessonWords}
            </h2>
            <dl className="space-y-2.5">
              {study.glossary.map((entry, index) => (
                <div key={index} className="bg-white border border-slate-200 rounded-xl p-3">
                  <dt className="text-sm font-bold text-slate-800">{entry.term}</dt>
                  <dd className="text-sm text-slate-700 leading-relaxed">{entry.text}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <section>
          <h2 className="flex items-center gap-2 text-xs font-extrabold text-slate-700 uppercase tracking-widest mb-3">
            <Lightbulb className="w-4 h-4 text-amber-600" aria-hidden="true" />
            {t.lessonKeyPoints}
          </h2>
          <ul className="space-y-2.5">
            {level.questions.map((question, index) => (
              <li
                key={index}
                className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl p-3"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
                <div className="space-y-1.5 min-w-0">
                  <p className="text-sm text-amber-900 leading-relaxed">{question.fact}</p>
                  {/* Each key point names the work it was taken from. */}
                  <SourceReference source={question.source} tone="amber" compact />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <div className="print:hidden">
          <FlashQuiz items={flashQuizQuestions} onAnswer={onFlashQuizAnswer} />
        </div>

        {/* What a teacher takes to the photocopier. On screen this is two
            buttons; on paper the buttons are gone and the sheet carries the
            lesson, the exercises and their answer key. */}
        <div className="print:hidden space-y-3">
          <Button
            onClick={onStartQuiz}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-700 to-orange-800 hover:from-amber-800 hover:to-orange-900 text-white font-bold text-base shadow-lg shadow-amber-900/20"
          >
            {t.startQuiz} <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <button
            onClick={() => window.print()}
            className="w-full h-12 rounded-xl border-2 border-slate-300 bg-white text-slate-700 font-bold text-base hover:bg-slate-50 active:scale-[0.99] transition-colors flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" aria-hidden="true" />
            {t.printSheet}
          </button>
        </div>

        <Worksheet level={level} />
      </main>
    </div>
  );
}

/**
 * The exercises of a lesson, drawn in print alone.
 *
 * A sheet is the thing teachers asked for before anything else: the lesson on
 * one page, the questions on the next, and the answers at the end. It is never
 * on screen, and that is the point rather than a way of saving space: the same
 * questions are the quiz, so a worksheet on the screen would hand the answers
 * to the reader it is meant to test. The key is printed because the sheet is
 * meant to be marked by somebody, and whoever marks twenty-six of them reads the
 * key rather than the lesson.
 */
function Worksheet({ level }) {
  const t = useT();
  const questions = level.questions || [];

  return (
    <section className="hidden print:block">
      <h2 className="text-lg font-extrabold text-slate-900 border-t-2 border-slate-300 pt-4">
        {t.worksheetTitle}
      </h2>
      <p className="text-sm text-slate-700 mt-2">{t.worksheetIntro}</p>
      <p className="text-sm text-slate-700 mt-2">
        {t.worksheetName} ____________________ {t.worksheetDateLabel} ____________
      </p>

      <ol className="mt-4 space-y-4">
        {questions.map((question, index) => (
          <li key={index}>
            <p className="text-sm font-bold text-slate-900">
              {index + 1}. {question.question}
            </p>
            <ul className="mt-1 space-y-0.5">
              {question.options.map((option, at) => (
                <li key={at} className="text-sm text-slate-800">
                  {String.fromCharCode(65 + at)}. {option}
                </li>
              ))}
            </ul>
            <p className="text-xs text-slate-600 mt-1">{t.worksheetAnswer} ____________________</p>
          </li>
        ))}
      </ol>

      <section className="break-before-page">
        <h2 className="text-lg font-extrabold text-slate-900 border-t-2 border-slate-300 pt-4">
          {t.worksheetAnswerKey}
        </h2>
        <ol className="mt-3 columns-2 text-sm text-slate-800">
          {questions.map((question, index) => (
            <li key={index}>
              {index + 1}. {String.fromCharCode(65 + question.correct)}
            </li>
          ))}
        </ol>
      </section>
    </section>
  );
}
