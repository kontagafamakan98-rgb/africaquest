import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, ExternalLink, Search } from "lucide-react";
import { useT, useLang } from "../components/i18n";
import { getBibliography } from "../components/game/references";

/**
 * A count that reads as a sentence whatever it counts.
 *
 * A single work documents a single question more often than not on this page,
 * and "1 questions" is the kind of line that makes a reader stop trusting the
 * rest of it.
 */
const counted = (count, singular, plural) => `${count} ${count === 1 ? singular : plural}`;

/**
 * Every work the game quotes, grouped by the institution that publishes it.
 *
 * The quiz carries a reference under every explanation, and that reference is
 * what makes an explanation a fact rather than an assertion. It is enough for
 * one reader at a time, but a teacher preparing a lesson from this game needs
 * the other direction: which works the game stands on, and which claim each of
 * them supports. That is what this page is.
 *
 * Nothing is written out here by hand. The institutions and their names come
 * from the one list the tests also read, and the works and their questions come
 * from the levels themselves, in the language on screen, so a reference added,
 * reworded or re-pointed shows up on this page on its own. A work quoted by
 * several levels is one entry listing every question it documents, rather than
 * one entry per level that a reader would have to gather themselves.
 *
 * A work is linked when the game has a page for it. The notices that are quoted
 * by title alone carry no page nobody could check, and they are not left as dead
 * text for it: each one is followed by a search of its publisher's own site. The
 * two are shown differently on purpose, because they are not the same claim: a
 * link is an address somebody opened, a search only opens a search.
 */
/** How many institutions are drawn before the screen asks whether to go on. */
const INSTITUTIONS_PAGE = 4;

export default function Bibliography() {
  const t = useT();
  const lang = useLang();
  // Every work the game quotes, with its questions, is two hundred lines long:
  // drawn in one go, a reader who came to check one reference waits for all of
  // them. The institutions are therefore revealed a few at a time, and the
  // counts in the header are still the whole bibliography.
  const [shown, setShown] = useState(INSTITUTIONS_PAGE);

  const institutions = getBibliography(lang);
  const works = institutions.reduce((total, institution) => total + institution.works.length, 0);
  const questions = institutions.reduce((total, institution) => total + institution.questions, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <header
        className="relative overflow-hidden text-white"
        style={{
          background: "linear-gradient(160deg, #1C1109 0%, #4A2A12 45%, #7A3B1D 100%)",
          paddingTop: "calc(2rem + var(--sat))",
          paddingBottom: "1.5rem",
        }}
      >
        <div className="max-w-lg mx-auto px-5">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 min-h-11 text-xs font-bold text-white/70 hover:text-white mb-3"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            {t.backToGame}
          </Link>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold leading-tight">
            <BookOpen className="w-6 h-6 text-amber-400" aria-hidden="true" />
            {t.bibliography}
          </h1>
          <p className="text-white/60 text-xs mt-1">
            {counted(questions, t.bibliographyQuestion, t.bibliographyQuestions)} ·{" "}
            {counted(works, t.bibliographyWork, t.bibliographyWorks)}
          </p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-5 py-6 space-y-6">
        <p className="text-sm text-slate-600 leading-relaxed">{t.bibliographyIntro}</p>

        {institutions.slice(0, shown).map((institution) => (
          <section key={institution.id} aria-labelledby={`bibliography-${institution.id}`}>
            <h2 id={`bibliography-${institution.id}`} className="text-base font-extrabold text-slate-800">
              {institution.name}
            </h2>
            <p className="text-[11px] text-slate-500 mb-1">
              {counted(institution.works.length, t.bibliographyWork, t.bibliographyWorks)} ·{" "}
              {counted(institution.questions, t.bibliographyQuestion, t.bibliographyQuestions)}
            </p>
            {institution.works.some((work) => work.search) && (
              <p className="text-[11px] text-slate-500 mb-1">{t.searchNoticeNote}</p>
            )}

            <ul className="divide-y divide-slate-100 border-y border-slate-100">
              {institution.works.map((work) => (
                <li key={work.label} className="py-3">
                  <p className="text-sm font-semibold text-slate-800 leading-snug">
                    {work.url ? (
                      <a
                        href={work.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-start gap-1 underline decoration-amber-400 underline-offset-2 hover:text-amber-900"
                      >
                        {work.label}
                        <ExternalLink className="w-3 h-3 mt-1 shrink-0" aria-hidden="true" />
                      </a>
                    ) : (
                      work.label
                    )}
                  </p>
                  {!work.url && work.search && (
                    <a
                      href={work.search}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${t.searchNotice} · ${work.label}`}
                      className="inline-flex items-center gap-1 mt-1 text-[11px] font-bold text-slate-500 underline decoration-slate-300 decoration-dashed underline-offset-2 hover:text-amber-900"
                    >
                      <Search className="w-3 h-3 shrink-0" aria-hidden="true" />
                      {t.searchNotice}
                    </a>
                  )}
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {counted(work.questions.length, t.bibliographyQuestion, t.bibliographyQuestions)}
                  </p>
                  <ul className="mt-1.5 space-y-1">
                    {work.questions.map((entry) => (
                      <li key={`${entry.level}-${entry.number}`} className="flex gap-1.5 text-xs leading-snug">
                        <span className="shrink-0 font-bold text-amber-800">
                          {t.level} {entry.level}
                        </span>
                        <span className="text-slate-600">{entry.question}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </section>
        ))}

        {shown < institutions.length && (
          <button
            type="button"
            onClick={() => setShown((count) => count + INSTITUTIONS_PAGE)}
            className="w-full rounded-xl border-2 border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-amber-400 active:scale-[0.99]"
          >
            {t.showMore} · {institutions.length - shown}
          </button>
        )}
      </main>
    </div>
  );
}
