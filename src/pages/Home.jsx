import { Fragment, lazy, Suspense, useState, useCallback, useRef, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
// The brief of the game and the list of badges: what the map draws, and nothing
// else. The questions, the lessons and the rest of the photographs are not
// imported here at all - they are fetched right after the map, and the screens
// that show them read them from the game data themselves.
import { BADGES } from "../components/game/badges";
import { getLevelSummaries } from "../components/game/level-summary";
import ScreenSkeleton from "../components/game/ScreenSkeleton.jsx";
import LevelCard from "../components/game/LevelCard.jsx";
import XPBar from "../components/game/XPBar";
import BadgeCard from "../components/game/BadgeCard";
import PullToRefresh from "../components/game/PullToRefresh";
import SettingsModal from "../components/game/SettingsModal.jsx";
import WelcomeBackup from "../components/game/WelcomeBackup.jsx";
import LiquidMark from "../components/game/LiquidMark.jsx";

// The map is the screen the player lands on: its code, and the level data every
// screen reads, are the only thing the first paint waits for. Everything a tap
// opens on its own - a lesson, a quiz, the review inbox, the two reading tabs -
// is fetched as its own chunk instead, which is what keeps the entry file small
// without taking anything away from the screen that is shown first.
const QuizPage = lazy(() => import("./QuizPage"));
const LearnScreen = lazy(() => import("../components/game/LearnScreen"));
const LessonScreen = lazy(() => import("../components/game/LessonScreen"));
const ReviewScreen = lazy(() => import("../components/game/ReviewScreen"));
const ReviewSession = lazy(() => import("../components/game/ReviewSession"));
const StatsScreen = lazy(() => import("../components/game/StatsScreen"));
import { collectDueReviews, collectReviewQueue, nextReviewDelay, formatReviewDelay, questionKey, countDueReviews, unlockedLevelIds } from "../components/game/learning";
import { useReviewReminder } from "../lib/use-review-reminder.js";
import { Map, BookOpen, Award, BarChart3, Settings, ChevronRight, RotateCcw, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useT, useLang } from "../components/i18n";
import { progressStore } from "@/api/progress-store";

function getPlayerLevel(xp) { return Math.floor(xp / 200) + 1; }

const TABS = [
  { id: "map", icon: Map, labelKey: "levelsTab" },
  { id: "learn", icon: BookOpen, labelKey: "learnTab" },
  { id: "badges", icon: Award, labelKey: "badgesTab" },
  { id: "stats", icon: BarChart3, labelKey: "progressTab" },
  { id: "settings", icon: Settings, labelKey: "settings" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("map");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedLevelId, setSelectedLevelId] = useState(null);
  const [lessonLevelId, setLessonLevelId] = useState(null);
  const [reviewScreenOpen, setReviewScreenOpen] = useState(false);
  // { items, title, subtitle, region }: a session is not always the whole
  // mistake list, it can be the fragile questions of one level.
  const [reviewSession, setReviewSession] = useState(null);
  // What is due is not decided once: a question the player missed ten minutes
  // ago comes back while the app is open. The clock lets the review count and
  // the cards follow that, instead of freezing until the next answer.
  const [clock, setClock] = useState(() => Date.now());
  const queryClient = useQueryClient();
  const t = useT();
  const lang = useLang();
  // The levels follow the active language everywhere they are displayed. What
  // arrives here is the brief of each level, which is what a card draws and what
  // the review schedule counts against; the questions themselves are read by the
  // screens that open a level.
  const levels = getLevelSummaries(lang);

  // Preserve scroll positions per tab
  const scrollRefs = useRef({ map: 0, learn: 0, badges: 0, stats: 0 });
  const scrollContainerRef = useRef(null);

  const { data: progressList, isLoading, isFetched } = useQuery({
    queryKey: ["progress"],
    queryFn: () => progressStore.list(),
    initialData: [],
  });

  const progress = progressList?.[0] || null;
  const hasLoadedProgress = isFetched && !isLoading;

  useEffect(() => {
    // Only seed a fresh record once the store has actually answered with nothing,
    // otherwise a mount could overwrite progress that already exists.
    if (hasLoadedProgress && progressList.length === 0) {
      progressStore
        .create({
          current_level: 1, total_xp: 0, stars_earned: 0,
          completed_levels: [], badges: [], level_scores: {},
          total_time_seconds: 0, streak_days: 0,
        })
        .then(() => queryClient.invalidateQueries({ queryKey: ["progress"] }));
    }
  }, [hasLoadedProgress, progressList, queryClient]);

  useEffect(() => {
    const id = setInterval(() => setClock(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  // The reminder: what is due goes on the icon of the installed app, and, when
  // the player asked for it, the schedule is handed to the service worker so a
  // question that comes back can reach them with the game closed. It is called
  // here, before the early returns below, because the map is the one screen the
  // whole game is played from - a level, a lesson and the review all open over
  // it - so this is the only place that sees every answer.
  const reminder = useReviewReminder({
    questionStats: progressList?.[0]?.question_stats || {},
    levels,
    now: clock,
    t,
  });

  // The map is drawn from the brief alone, so the content of the game - the
  // questions, their facts, the lesson stories and the rest of the gallery - is
  // asked for as soon as the map is on screen. A player who taps a level then
  // finds the browser already holding what that screen needs, and one who never
  // does has lost nothing: the request runs beside the map, after it, and a
  // failure is silent because the screen that needs the content asks again.
  useEffect(() => {
    import("../components/game/gameData").catch(() => {});
  }, []);

  // Save/restore scroll on tab switch
  const handleTabChange = (tabId) => {
    // Settings is a sheet on top of the current tab, not a tab of its own:
    // opening it must not move the player away from where they were.
    if (tabId === "settings") {
      setSettingsOpen(true);
      return;
    }
    if (scrollContainerRef.current) {
      scrollRefs.current[activeTab] = scrollContainerRef.current.scrollTop;
    }
    setActiveTab(tabId);
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollRefs.current[tabId] || 0;
      }
    }, 0);
  };

  const handleRefresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["progress"] });
  }, [queryClient]);

  // An empty selection is not a session: a screen must never open a quiz with
  // nothing to ask.
  const startReview = (items, meta = {}) => {
    if (!items || items.length === 0) return;
    setReviewSession({
      items,
      title: meta.title || t.reviewTitle,
      subtitle: meta.subtitle || t.reviewSubtitle,
      region: meta.region || t.reviewMistakes,
    });
  };

  if (isLoading || !progress) {
    return <ScreenSkeleton variant="map" />;
  }

  // Spaced repetition: only the questions the schedule has brought back are
  // offered on the card, while the review screen shows the whole rotation.
  const questionStats = progress.question_stats || {};
  const dueReviews = collectDueReviews(questionStats, levels, { max: 12, now: clock });
  const upcomingDelay = nextReviewDelay(questionStats, levels, clock);
  const reviewQueue = collectReviewQueue(questionStats, levels, { now: clock });
  // Uncapped on purpose: the card opens a batch of twelve at most, but the badge
  // has to tell the truth, so a player thirty questions behind does not read 12.
  const dueReviewCount = countDueReviews(questionStats, levels, clock);

  // The review inbox: every waiting question, with the time left before each one
  // comes back, and a session started on whatever the player selects.
  if (reviewScreenOpen) {
    return (
      <Suspense fallback={<ScreenSkeleton variant="list" />}>
      <ReviewScreen
        queue={reviewQueue}
        onBack={() => setReviewScreenOpen(false)}
        // The screen names the scope the player chose, so the quiz header
        // says which level or region is being worked on.
        onStart={(items, meta) => {
          setReviewScreenOpen(false);
          startReview(items, meta);
        }}
      />
      </Suspense>
    );
  }

  // A review session replays the questions the player keeps getting wrong. The
  // screen attaches their wording and runs the quiz itself, so this one only has
  // to hand over what the schedule picked and let the player leave it.
  if (reviewSession) {
    return (
      <Suspense fallback={<ScreenSkeleton variant="quiz" />}>
        <ReviewSession
          items={reviewSession.items}
          title={reviewSession.title}
          subtitle={reviewSession.subtitle}
          region={reviewSession.region}
          onExit={() => setReviewSession(null)}
        />
      </Suspense>
    );
  }

  // Study mode: read a civilization's lesson before its quiz. The screen reads
  // the level it teaches from its id, since the map screen holds only the brief.
  if (lessonLevelId !== null) {
    return (
      <Suspense fallback={<ScreenSkeleton variant="list" />}>
        <LessonScreen
          levelId={lessonLevelId}
          onBack={() => setLessonLevelId(null)}
          onStudied={(id) =>
            progressStore
              .markStudied(id)
              .then(() => queryClient.invalidateQueries({ queryKey: ["progress"] }))
          }
          // Answers from the flash quiz feed the review memory only: no stars, no
          // XP, no level marked as finished. A question missed while reading the
          // lesson therefore comes back in the next review session.
          onFlashQuizAnswer={(questionIndex, isCorrect) =>
            progressStore
              .recordAnswer(questionKey(lessonLevelId, questionIndex), isCorrect)
              .then(() => queryClient.invalidateQueries({ queryKey: ["progress"] }))
          }
          onStartQuiz={() => {
            setSelectedLevelId(lessonLevelId);
            setLessonLevelId(null);
          }}
        />
      </Suspense>
    );
  }

  // Show quiz page inline
  if (selectedLevelId !== null) {
    return (
      <Suspense fallback={<ScreenSkeleton variant="quiz" />}>
        <QuizPage
          levelId={selectedLevelId}
          onBack={() => setSelectedLevelId(null)}
        />
      </Suspense>
    );
  }

  const totalStars = progress.stars_earned || 0;
  const totalXP = progress.total_xp || 0;
  const playerLevel = getPlayerLevel(totalXP);
  const xpInCurrentLevel = totalXP - (playerLevel - 1) * 200;
  const completedLevels = progress.completed_levels || [];
  // Which level of the timeline the player has reached. Computed from the
  // finished levels rather than from a stored number, so adding a level in the
  // middle of history never locks anybody out of what they already finished.
  const unlocked = unlockedLevelIds(levels, completedLevels);
  const badges = progress.badges || [];
  const levelScores = progress.level_scores || {};
  const streakDays = progress.streak_days || 0;

  const activeTabId = activeTab;

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: "#14100A" }}>
      {/* The band the game opens on.

          It is one warm gradient and nothing else: no blobs, no grid, no texture
          over it, because a decoration under the text is a second thing to read
          and a reason for the text to be harder to read. It is also kept dark
          from top to bottom, which is what makes the white on it legible: amber
          is an accent here rather than a surface. */}
      <header
        className="relative text-white px-4 pb-5 shrink-0 border-b border-white/10"
        style={{
          paddingTop: "calc(2.5rem + var(--sat))",
          background: "linear-gradient(160deg, #1F140B 0%, #33200F 55%, #452611 100%)"
        }}
      >
        <div className="max-w-lg mx-auto">
          <h1 className="text-xl font-extrabold tracking-tight leading-tight text-white">{t.appTitle}</h1>
          <p className="text-amber-100/80 text-[11px] font-medium mt-0.5">{t.appSubtitle}</p>

          {/* One number carries the screen: how far along the timeline the player
              is. Everything else the game knows about them is the quiet line
              under it, so the eye has a first thing to land on and a second. */}
          <div className="mt-4 flex items-end gap-2">
            <span className="text-4xl font-black leading-none tabular-nums">{completedLevels.length}</span>
            <span className="text-base font-bold text-white/60 leading-none pb-0.5">/ {levels.length}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-200/90 pb-1">
              {t.levelsCompleted}
            </span>
          </div>
          <p className="mt-2 text-xs text-white/70 tabular-nums">
            {totalStars} {totalStars > 1 ? t.stars : t.starOne} · {streakDays} {t.dayStreak} · {totalXP} XP
          </p>

          <div className="mt-4">
            <XPBar current={xpInCurrentLevel} max={200} level={playerLevel} />
          </div>
        </div>
      </header>

      {/* Scrollable content area */}
      <main
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto no-scrollbar"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <PullToRefresh onRefresh={handleRefresh}>
          <div className="max-w-lg mx-auto px-4 pt-5 pb-6">
            <AnimatePresence mode="wait">
              {activeTabId === "map" && (
                <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                  {dueReviews.length > 0 && (
                    <button
                      onClick={() => startReview(dueReviews)}
                      className="w-full text-left rounded-2xl bg-gradient-to-r from-amber-600/25 to-orange-700/10 border border-amber-400/30 hover:border-amber-400/60 transition-colors p-4 flex items-center gap-4"
                    >
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-700 flex items-center justify-center shadow-lg ring-1 ring-white/20 shrink-0">
                        <RotateCcw className="w-5 h-5 text-white" aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-extrabold text-sm">{t.reviewMistakes}</h3>
                        <p className="text-white/75 text-xs">
                          {dueReviews.length} {t.reviewQuestions}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-amber-300 shrink-0" aria-hidden="true" />
                    </button>
                  )}
                  {dueReviews.length === 0 && upcomingDelay !== null && (
                    <div className="rounded-2xl bg-[#1C150C] border border-white/10 p-3.5 space-y-3">
                      <div className="flex items-center gap-3">
                        <RotateCcw className="w-4 h-4 text-amber-300/80 shrink-0" aria-hidden="true" />
                        <p className="text-white/75 text-xs">
                          {t.reviewNextIn}{" "}
                          <span className="text-white font-bold">{formatReviewDelay(upcomingDelay, t)}</span>
                        </p>
                      </div>
                    </div>
                  )}
                  {reviewQueue.length > 0 && (
                    <button
                      onClick={() => setReviewScreenOpen(true)}
                      className="w-full text-left rounded-2xl bg-[#1C150C] border border-white/10 hover:border-white/25 transition-colors p-3.5 flex items-center gap-3"
                    >
                      <Clock className="w-4 h-4 text-amber-300/80 shrink-0" aria-hidden="true" />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-extrabold text-sm">{t.reviewScreen}</h3>
                        <p className="text-white/70 text-xs">
                          {reviewQueue.length} {t.reviewPending}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-amber-300 shrink-0" aria-hidden="true" />
                    </button>
                  )}
                  <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-4 px-1">
                    {completedLevels.length} {t.of} {levels.length} {t.levelsCompleted}
                  </p>
                  {levels.map((level, i) => {
                    const isUnlocked = unlocked.has(level.id);
                    const isCompleted = completedLevels.includes(level.id);
                    const perLevelScores = levelScores[String(level.id)] || null;
                    // A heading opens each era of the timeline, so the list reads
                    // as history rather than as a pile of cards.
                    const opensEra = i === 0 || levels[i - 1].era !== level.era;
                    return (
                      <Fragment key={level.id}>
                        {opensEra && (
                          <div className="flex items-center gap-3 pt-2 pb-0.5 px-1">
                            <span className="text-amber-200/90 text-[10px] font-black uppercase tracking-[0.18em]">
                              {t.eras?.[level.era] || level.era}
                            </span>
                            <span className="flex-1 h-px bg-white/10" aria-hidden="true" />
                          </div>
                        )}
                        <LevelCard
                          level={level}
                          isUnlocked={isUnlocked}
                          isCompleted={isCompleted}
                          levelScores={perLevelScores}
                          onClick={(lvl) => setSelectedLevelId(lvl.id)}
                          index={i}
                        />
                      </Fragment>
                    );
                  })}
                </motion.div>
              )}

              {activeTabId === "learn" && (
                <motion.div key="learn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Suspense fallback={<ScreenSkeleton variant="map" />}>
                    <LearnScreen progress={progress} onOpenLesson={(lvl) => setLessonLevelId(lvl.id)} />
                  </Suspense>
                </motion.div>
              )}

              {activeTabId === "badges" && (
                <motion.div key="badges" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="mb-5 px-1">
                    <h2 className="font-extrabold text-white text-sm">{t.badgesEarned}</h2>
                    <p className="text-white/70 text-xs">{badges.length} {t.of} {BADGES.length} {t.badgesUnlocked}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {BADGES.map((badge) => (
                      <BadgeCard key={badge.id} badge={badge} earned={badges.includes(badge.id)} />
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTabId === "stats" && (
                <motion.div key="stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Suspense fallback={<ScreenSkeleton variant="list" />}>
                  <StatsScreen
                    progress={progress}
                    // A tap on a level of the knowledge map reviews the fragile
                    // questions of that level only.
                    onReviewLevel={(level, items) =>
                      startReview(items, {
                        // The quiz header has one line above the title, so the
                        // session names what it is rather than repeating the
                        // level's region, which the map already showed.
                        title: level.title,
                        region: t.reviewFragile,
                      })
                    }
                  />
                  </Suspense>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </PullToRefresh>
      </main>

      {/* Fixed Bottom Navigation Bar */}
      <nav
        aria-label={t.mainNav}
        className="shrink-0 bg-[#1C150C] border-t border-white/10 flex"
        style={{ paddingBottom: "var(--sab)" }}
      >
        {TABS.map((tab) => {
          const isActive = settingsOpen ? tab.id === "settings" : activeTab === tab.id;
          const Icon = tab.icon;
          // The reviews live on the levels tab, so that is where the count goes:
          // a badge must sit on the tab that answers it.
          const badge = tab.id === "map" && dueReviewCount > 0 ? dueReviewCount : 0;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              aria-current={isActive ? "page" : undefined}
              aria-label={badge > 0 ? `${t[tab.labelKey]}, ${badge} ${t.reviewQuestions}` : undefined}
              className={cn(
                "relative isolate flex-1 flex flex-col items-center justify-center py-2.5 gap-1 transition-colors duration-200",
                isActive ? "text-amber-400" : "text-white/65 hover:text-white/90"
              )}
            >
              <span className="relative isolate flex items-center justify-center w-11 h-6 rounded-full">
                {isActive && <LiquidMark layoutId="main-tab" className="inset-0 rounded-full bg-amber-400/15" />}
                <Icon className="w-5 h-5" aria-hidden="true" />
                {badge > 0 && (
                  <span
                    aria-hidden="true"
                    className="absolute -top-1 -right-0.5 min-w-4 h-4 px-1 rounded-md bg-amber-400 text-[#14100A] text-[10px] font-extrabold leading-none flex items-center justify-center tabular-nums"
                  >
                    {badge > 99 ? "99+" : badge}
                  </span>
                )}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wide">{t[tab.labelKey]}</span>
              {isActive && tab.id !== "settings" && (
                <LiquidMark
                  layoutId="main-tab-underline"
                  className="inset-x-0 bottom-0.5 mx-auto w-6 h-0.5 rounded-full bg-amber-400"
                />
              )}
            </button>
          );
        })}
      </nav>

      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} reminder={reminder} />
      {/* On a device that has never played, the backup is offered before the
          first question rather than left to be found in the settings. */}
      <WelcomeBackup />
    </div>
  );
}


