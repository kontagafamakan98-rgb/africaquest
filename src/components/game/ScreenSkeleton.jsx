import { useT } from "../i18n";

/**
 * What stands in place of a screen while that screen's own code or its stored
 * progress arrives.
 *
 * A spinner says that something is happening; it does not say what is about to
 * appear. This says both: the blocks are the shape of the screen that is coming,
 * so the page does not jump when it lands, and the wait is as long as the read
 * from the local store, which is short. It is drawn on the same dark surface as
 * everything else, in the app's own colours, so a wait looks like the app rather
 * than like a hole in it.
 *
 * Three shapes, because three kinds of screen are loaded on demand: the map of
 * levels, a quiz, and a list of rows. A single generic grey would be a second
 * thing to look at and would say nothing.
 *
 * The blocks are decorative: they carry no information, so they are hidden from
 * a screen reader, and what a reader is told instead is that the screen is
 * loading. The breathing is the one animation here that is not decoration: a
 * still skeleton reads as a screen that has stopped loading. It is 2 seconds and
 * it is turned off like every other animation by the reduced-motion rule in
 * src/index.css.
 */
const MAP_CARDS = 4;
const LIST_ROWS = 5;
const QUIZ_ANSWERS = 4;

function Block({ className }) {
  return <div aria-hidden="true" className={`animate-pulse ${className}`} />;
}

export default function ScreenSkeleton({ variant = "list" }) {
  const t = useT();

  return (
    <div className="min-h-screen" style={{ background: "#14100A" }} role="status">
      <span className="sr-only">{t.loadingScreen}</span>
      <div className="max-w-lg mx-auto px-4 pt-6 pb-6 space-y-3">
        <Block className="h-5 w-32 rounded-md bg-[#241B10]" />
        <Block className="h-3 w-48 rounded-md bg-[#1C150C]" />

        {variant === "quiz" ? (
          <>
            <Block className="h-28 rounded-2xl bg-[#1C150C]" />
            {Array.from({ length: QUIZ_ANSWERS }, (_, index) => (
              <Block key={index} className="h-12 rounded-xl bg-[#1C150C]" />
            ))}
          </>
        ) : variant === "map" ? (
          Array.from({ length: MAP_CARDS }, (_, index) => (
            <Block key={index} className="h-[150px] rounded-2xl bg-[#1C150C]" />
          ))
        ) : (
          Array.from({ length: LIST_ROWS }, (_, index) => (
            <Block key={index} className="h-16 rounded-2xl bg-[#1C150C]" />
          ))
        )}
      </div>
    </div>
  );
}
