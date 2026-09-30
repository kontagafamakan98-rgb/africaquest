import { useEffect, useState } from "react";
import {
  ChevronLeft, Lightbulb, CheckCircle2, ArrowRight, BookOpen,
  CalendarClock, Users, MapPin, BookMarked,
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
  // read from a module holding all twenty: the history in several paragraphs,
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
      <div className="relative h-44 overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${level.color}`} />
        {img && (
          <LevelPicture src={img} alt="" className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <button
          onClick={onBack}
          aria-label={t.backToLearn}
          className="absolute top-4 left-4 p-2 rounded-lg bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 transition-colors"
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
      </div>

      <main className="max-w-lg mx-auto px-4 py-5 space-y-6">
        <AudioNarrator levelId={level.id} />

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

        <LevelGallery photos={level.gallery} />

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

        <FlashQuiz items={flashQuizQuestions} onAnswer={onFlashQuizAnswer} />

        <Button
          onClick={onStartQuiz}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-amber-700 to-orange-800 hover:from-amber-800 hover:to-orange-900 text-white font-bold text-base shadow-lg shadow-amber-900/20"
        >
          {t.startQuiz} <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </main>
    </div>
  );
}
