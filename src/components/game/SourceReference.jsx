import { Link2, Search } from "lucide-react";
import { useT } from "../i18n";
import { searchUrl } from "./publishers.js";

/**
 * Where one explanation comes from.
 *
 * The reference sits under the anecdote it supports rather than in a list at
 * the end of the level, so a reader can check the exact claim in front of them
 * instead of guessing which of five works backs it. Every entry names the work
 * it comes from, and two kinds of reference are shown here as two different
 * things rather than as one.
 *
 * A reference the game has a page for is a link to it, underlined in amber with
 * the icon of a link that leaves the app: that is the one address somebody
 * opened and read. A work that is quoted by title alone has no such address, and
 * it is followed instead by a search of its publisher's own site, on its own
 * line of decoration and with the icon of a search, because it is not the same
 * promise: it opens a search, it does not vouch for a page.
 */
export default function SourceReference({ source, tone = "light", compact = false }) {
  const t = useT();
  if (!source || typeof source.label !== "string" || source.label.trim().length === 0) return null;

  const onAmber = tone === "amber";
  const heading = onAmber ? "text-amber-700" : "text-slate-500";
  // A search is only ever offered where there is no page: the two are the two
  // halves of one reference, not two links a reader has to choose between.
  const search = source.url ? null : searchUrl(source.label);

  return (
    <p
      className={`flex items-start gap-1.5 ${compact ? "text-[11px]" : "text-xs"} leading-snug`}
      aria-label={t.source}
    >
      <Link2 className={`w-3 h-3 shrink-0 mt-0.5 ${heading}`} aria-hidden="true" />
      <span className={`font-extrabold uppercase tracking-widest ${compact ? "text-[9px]" : "text-[10px]"} ${heading} mt-px`}>
        {t.source}
      </span>
      <span className={onAmber ? "text-amber-900/80" : "text-slate-600"}>
        {source.url ? (
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className={
              onAmber
                ? "underline decoration-amber-400 underline-offset-2 hover:text-amber-950"
                : "underline decoration-amber-400 underline-offset-2 hover:text-amber-800"
            }
          >
            {source.label}
          </a>
        ) : (
          <span>
            {source.label}
            {search && (
              <>
                {" "}
                <a
                  href={search}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t.searchNotice} · ${source.label}`}
                  title={t.searchNoticeNote}
                  className={`inline-flex items-center gap-0.5 underline decoration-slate-300 decoration-dashed underline-offset-2 ${
                    onAmber ? "hover:text-amber-950" : "hover:text-amber-800"
                  }`}
                >
                  <Search className="w-3 h-3 shrink-0" aria-hidden="true" />
                  {t.searchNotice}
                </a>
              </>
            )}
          </span>
        )}
      </span>
    </p>
  );
}
