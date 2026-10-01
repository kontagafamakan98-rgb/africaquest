import { servedPath } from "@/lib/base-path.js";

/**
 * The first screen of the application: the mark, and the language to speak.
 *
 * The game is bilingual, and until a choice is made there is no language to
 * write it in: an English sentence under a French button would be a guess about
 * the reader, which is the guess this screen exists to avoid. So the two
 * wordings are written out here side by side, each in its own language and each
 * marked with its own `lang` attribute, and each button names its language in
 * that language: Francais, English. Nothing here is read from the dictionary,
 * which is the one place this rule has to bend, since the dictionary is what has
 * not been chosen yet.
 *
 * The mark is the same file the browser tab and the launcher icon are drawn
 * from, so the first thing a reader sees cannot be a different logo from the one
 * that opened the tab. It is asked for through `servedPath`, because the site
 * can be served under a path the way a project site on GitHub Pages is.
 *
 * The screen is not a dialog: it is what the application draws in place of
 * itself until a choice is made, so there is nothing to dismiss, no focus to
 * trap and no way to reach the game with no language chosen. It is announced as
 * a heading rather than as an alert, since it is the whole of what is on the
 * screen.
 */
const CHOICE = [
  {
    code: "fr",
    label: "Français",
    note: "Jouer en français",
    prompt: "Choisissez votre langue",
    primary: true,
  },
  {
    code: "en",
    label: "English",
    note: "Play in English",
    prompt: "Choose your language",
    primary: false,
  },
];

export default function StartupLanguage({ onChoose }) {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center px-6 text-center"
      style={{ background: "linear-gradient(160deg, #1F140B 0%, #33200F 55%, #452611 100%)" }}
    >
      {/* Decoration, and the title right beside it says what it is: a mark read
          out as "Africa History Quest" under a heading of the same words is the
          same sentence twice. */}
      <img
        src={servedPath("favicon.svg")}
        alt=""
        width={96}
        height={96}
        className="w-24 h-24 rounded-3xl shadow-2xl ring-1 ring-white/15"
      />
      <h1 className="mt-5 text-2xl font-extrabold tracking-tight leading-tight text-white">
        Africa History Quest
      </h1>

      {/* Both wordings are drawn, in order, so the screen reads the same to a
          reader of either language before a choice is made. */}
      <div className="mt-6 w-full max-w-xs space-y-1">
        {CHOICE.map(({ code, prompt }) => (
          <p key={code} lang={code} className="text-sm font-semibold text-amber-100/90">
            {prompt}
          </p>
        ))}
      </div>

      <div className="mt-5 w-full max-w-xs space-y-3">
        {CHOICE.map(({ code, label, note, primary }) => (
          <button
            key={code}
            type="button"
            onClick={() => onChoose(code)}
            // The wording is in the language it chooses, which is why the button
            // says so out loud rather than relying on the reader recognising it.
            lang={code}
            className={
              primary
                ? "w-full rounded-2xl bg-amber-500 px-4 py-3.5 text-[#1C150C] transition-colors hover:bg-amber-400 active:scale-[0.99]"
                : "w-full rounded-2xl border-2 border-white/20 bg-white/5 px-4 py-3.5 text-white transition-colors hover:border-white/40 hover:bg-white/10 active:scale-[0.99]"
            }
          >
            <span className="block text-base font-extrabold leading-tight">{label}</span>
            <span className={primary ? "block text-xs mt-0.5 font-semibold" : "block text-xs mt-0.5 font-semibold text-white/70"}>
              {note}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
