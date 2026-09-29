import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Camera, ExternalLink, Maximize2 } from "lucide-react";
import { useT, useLang } from "../components/i18n";
import LevelPicture from "../components/game/LevelPicture";
import PhotoViewer from "../components/game/PhotoViewer";
import { getLevels } from "../components/game/gameData";

/**
 * Every photograph of the game, with who made it and under which licence.
 *
 * A credit line under a picture is the whole of the debt for a photograph that
 * is somebody else's work, and the lesson carries one. A reader who wants to
 * check where a picture came from, or what they may do with it themselves, needs
 * more than a caption though, so this screen lists the gallery in one place:
 * the thumbnail, the author, the licence, and a link to the page each picture
 * was taken from.
 *
 * Nothing is listed here by hand. The levels and their galleries come from the
 * game data, which reads the one table of photographs the rest of the
 * application uses, so a picture added or replaced shows up on this screen
 * without anybody remembering to come back to it. That is also why the pictures
 * are drawn through LevelPicture: it is the component that offers the lightest
 * format the browser can read, and a second way of drawing a photograph would
 * quietly download the heaviest one.
 *
 * Each of them is asked for as a thumbnail, which is the whole point of this
 * screen having copies of its own: what is drawn here is eighty pixels square,
 * and the lesson versions it used to draw would have been sixty full width
 * photographs, about two megabytes, to fill those squares. The thumbnail is
 * written by the same script that prepares every other file of a photograph:
 * under three kilobytes per row on average, seven at the heaviest.
 *
 * They are also asked for lazily, so opening the screen on a phone does not pull
 * the whole list at once.
 *
 * A thumbnail tells two pictures apart and shows neither of them, so each one is
 * a button: tapping it opens that photograph at the size it was made, with its
 * credit still beside it, in PhotoViewer. Nothing is fetched for this until the
 * tap, which is what keeps a screen of credits from being a screen of sixty
 * photographs.
 */
export default function PhotoCredits() {
  const t = useT();
  const lang = useLang();
  // The photograph whose viewer is open, or null. Held here rather than in the
  // row, so only one can ever be open.
  const [open, setOpen] = useState(null);

  const levels = getLevels(lang)
    .map((level) => ({ id: level.id, title: level.title, photos: level.gallery }))
    .filter((level) => level.photos.length > 0);
  const total = levels.reduce((count, level) => count + level.photos.length, 0);

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
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white/70 hover:text-white mb-3"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            {t.backToGame}
          </Link>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold leading-tight">
            <Camera className="w-6 h-6 text-amber-400" aria-hidden="true" />
            {t.photoCredits}
          </h1>
          <p className="text-white/60 text-xs mt-1">
            {total} {t.photoCreditsPhotographs}
          </p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-5 py-6 space-y-6">
        <p className="text-sm text-slate-600 leading-relaxed">{t.photoCreditsIntro}</p>

        {levels.map((level) => (
          <section key={level.id} aria-labelledby={`photo-credits-${level.id}`}>
            <h2
              id={`photo-credits-${level.id}`}
              className="text-base font-extrabold text-slate-800 mb-1"
            >
              {t.photoCreditsLevel} {level.id} · {level.title}
            </h2>
            <ul className="divide-y divide-slate-100 border-y border-slate-100">
              {level.photos.map((photo) => (
                <li key={photo.file} className="flex gap-3 py-3">
                  {/* The picture is described by the caption beside it, so the
                      thumbnail itself stays out of the reading order. */}
                  <button
                    type="button"
                    onClick={() => setOpen(photo)}
                    // A row of sixty buttons that all say the same thing is no
                    // use read aloud, so each one names the picture it opens.
                    aria-label={`${t.photoCreditsView} · ${photo.caption}`}
                    className="group relative w-20 h-20 shrink-0 rounded-xl"
                  >
                    <LevelPicture
                      src={photo.file}
                      thumb
                      alt=""
                      loading="lazy"
                      className="w-20 h-20 object-cover rounded-xl border border-slate-200 bg-slate-100 group-hover:border-amber-400 transition-colors"
                    />
                    {/* The mark that says the thumbnail can be opened. Drawn
                        over the corner of the picture rather than beside it, so
                        the row keeps the width the caption needs. */}
                    <span className="absolute bottom-1 right-1 flex w-5 h-5 items-center justify-center rounded-md bg-slate-900/60 group-hover:bg-slate-900/80 transition-colors">
                      <Maximize2 className="w-3 h-3 text-white" aria-hidden="true" />
                    </span>
                  </button>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-700 leading-snug">{photo.caption}</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      <span className="font-bold text-slate-700">{t.photoCreditsAuthor}</span>{" "}
                      {photo.author}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      <span className="font-bold text-slate-700">{t.photoCreditsLicence}</span>{" "}
                      {photo.licence}
                    </p>
                    <a
                      href={photo.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-1 text-[11px] font-semibold text-amber-800 underline decoration-amber-400 underline-offset-2 hover:text-amber-950"
                    >
                      {t.photoCreditsSource}
                      <ExternalLink className="w-3 h-3" aria-hidden="true" />
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>

      <PhotoViewer photo={open} onClose={() => setOpen(null)} />
    </div>
  );
}
