import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { progressStore } from "@/api/progress-store";
import { useT, useLang } from "../i18n";
import QuizScreen from "./QuizScreen";
// The content of the game, which this screen is the first to need: the map
// screen counts what is due from the schedule alone, and the wording of a
// question is read here, where it is really shown.
import { getLevels } from "./gameData";
import { buildReviewLevel, formatReviewDelay, nextReviewDelay } from "./learning";
import { getLevelSummaries } from "./level-summary";

/**
 * A review session: the questions the player keeps getting wrong, asked again.
 *
 * The map screen knows which questions are due - the schedule is a set of keys
 * and dates - but not what they ask, so the wording is attached here, from the
 * full levels, and the synthetic level the quiz screen runs on is built here
 * too. The split is the same as everywhere else in the app: the first screen
 * counts, a screen the player opens reads.
 */
export default function ReviewSession({ items = [], title, subtitle, region, onExit }) {
  const t = useT();
  const lang = useLang();
  const queryClient = useQueryClient();
  // When the session ends, the player is told when the questions they missed
  // come back, read from the schedule the store has just written rather than
  // guessed.
  const [nextReviewIn, setNextReviewIn] = useState(null);

  // Rebuilt on every render, as the review level always was: switching the
  // language in the middle of a session re-reads the questions in the new one.
  const questionsOf = new Map(getLevels(lang).map((level) => [level.id, level.questions]));
  const resolved = items.filter((item) => questionsOf.get(item.levelId)?.[item.index]);
  const level = buildReviewLevel(resolved, { title, subtitle, region });

  // Nothing to ask: a session is never opened empty, and a question the game no
  // longer holds is dropped rather than put to the player as a blank line.
  if (level.questions.length === 0) return null;

  const handleAnswer = (index, isCorrect) => {
    const key = level.questions[index]?.__key;
    if (!key) return;
    progressStore
      .recordAnswer(key, isCorrect)
      .then((updated) => {
        setNextReviewIn(
          formatReviewDelay(
            nextReviewDelay(updated.question_stats || {}, getLevelSummaries(lang)),
            t
          )
        );
        return queryClient.invalidateQueries({ queryKey: ["progress"] });
      });
  };

  return (
    <QuizScreen
      level={level}
      difficulty="easy"
      reviewMode
      nextReviewText={nextReviewIn}
      onBack={onExit}
      onComplete={onExit}
      onAnswer={handleAnswer}
    />
  );
}
