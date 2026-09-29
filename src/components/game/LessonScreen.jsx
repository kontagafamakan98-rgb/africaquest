import { useEffect } from "react";
import { ChevronLeft, Lightbulb, CheckCircle2, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LEVEL_IMAGES } from "./level-summary";
// The full level, with its questions and its gallery, is read here and only
// here: the map screen knows a lesson's title and picture, and deliberately not
// what it teaches, so the screens that need the content ask this module for it.
import { getLevels } from "./gameData";
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
 * questions themselves, so a lesson reads its own content from the game data,
 * which the screen before it has already asked the browser for.
 */
export default function LessonScreen({ levelId, onStartQuiz, onBack, onStudied, onFlashQuizAnswer }) {
  const t = useT();
  const lang = useLang();
  const level = getLevels(lang).find((candidate) => candidate.id === levelId);

  useEffect(() => {
    if (level) onStudied?.(level.id);
  }, [level?.id]);

  // A card can only open a level the game holds; the guard is here rather than
  // in the caller so nothing below has to ask whether the level arrived.
  if (!level) return null;

  const story = getLevelStory(level.id, lang);
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

        {story && (
          <section>
            <h2 className="flex items-center gap-2 text-xs font-extrabold text-slate-700 uppercase tracking-widest mb-2">
              <BookOpen className="w-4 h-4 text-amber-600" aria-hidden="true" />
              {t.lessonStory}
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">{story}</p>
          </section>
        )}

        <LevelGallery photos={level.gallery} />

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
