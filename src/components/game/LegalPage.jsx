import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const EMAIL_SPLIT = /([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/;
const EMAIL_WHOLE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

/**
 * Turns any email address found in legal copy into a tappable mailto link,
 * so a reader can write to the publisher without retyping the address.
 */
function withMailto(text) {
  return String(text)
    .split(EMAIL_SPLIT)
    .map((part, index) =>
      EMAIL_WHOLE.test(part) ? (
        <a
          key={`${index}-${part}`}
          href={`mailto:${part}`}
          className="font-semibold text-[#8A4218] underline decoration-[#E3A72E] underline-offset-2 hover:text-[#C2410C]"
        >
          {part}
        </a>
      ) : (
        part
      )
    );
}

/**
 * Shared presentation for legal pages (GDPR notice, terms of use).
 * Sections render an optional list of paragraphs, bullet points, and a block of
 * label and value rows. The rows carry the publisher identity: a value that is
 * still missing is shown in amber so an unfilled legal field cannot be shipped
 * without being seen.
 */
export default function LegalPage({ title, intro, updatedLabel, updatedAt, sections, backLabel }) {
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
          <Link to="/" className="inline-flex items-center gap-1.5 min-h-11 text-xs font-bold text-white/70 hover:text-white mb-3">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            {backLabel}
          </Link>
          <h1 className="text-2xl font-extrabold leading-tight">{title}</h1>
          <p className="text-white/60 text-xs mt-1">
            {updatedLabel} {updatedAt}
          </p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-5 py-6 space-y-6">
        {intro && <p className="text-sm text-slate-600 leading-relaxed">{intro}</p>}

        {sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-base font-extrabold text-slate-800 mb-2">{section.heading}</h2>
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph} className="text-sm text-slate-600 leading-relaxed mb-2">
                {withMailto(paragraph)}
              </p>
            ))}
            {section.bullets && (
              <ul className="list-disc pl-5 space-y-1 text-sm text-slate-600 leading-relaxed break-words">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{withMailto(bullet)}</li>
                ))}
              </ul>
            )}
            {section.facts && (
              <dl className="mt-2 divide-y divide-slate-100 border-y border-slate-100">
                {section.facts.map((fact) => (
                  // A label and its value side by side, and one above the other
                  // on a phone. A column of a hundred and twenty-eight pixels
                  // leaves a hundred and forty of the three hundred and twenty a
                  // small screen has, and the address a reader writes to is one
                  // word that cannot be broken: it hung seventeen pixels past
                  // the edge, and the page scrolled sideways to show it. A
                  // definition list reading downwards is no worse for it, and
                  // `break-words` is there so that no address long enough to be
                  // real can ever do that again.
                  <div key={fact.label} className="flex flex-col gap-0.5 py-1.5 text-sm sm:flex-row sm:gap-3">
                    <dt className="font-semibold text-slate-700 sm:w-32 sm:shrink-0">{fact.label}</dt>
                    <dd
                      className={`min-w-0 break-words ${
                        fact.missing
                          ? "font-semibold text-amber-700 leading-relaxed"
                          : "text-slate-600 leading-relaxed"
                      }`}
                    >
                      {withMailto(fact.value)}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </section>
        ))}
      </main>
    </div>
  );
}
