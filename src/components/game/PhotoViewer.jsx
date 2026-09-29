import { useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ExternalLink, X } from "lucide-react";
import { useT } from "../i18n";
import { useModalA11y } from "@/lib/use-modal-a11y";
import LevelPicture from "./LevelPicture";

/**
 * A photograph of the credits screen, seen at the size it was made.
 *
 * The list draws a hundred and sixty pixel thumbnail beside each credit, which
 * is enough to tell two pictures apart and not enough to see one. The picture
 * that opens here is the lesson version, the largest file of that photograph the
 * game ships, asked for at the moment of the tap rather than with the list: a
 * reader who only checks who made a picture pays nothing for this screen, and
 * the sixty photographs are not downloaded twice.
 *
 * It is drawn by LevelPicture and not by an `img` of its own, because that is
 * the component that offers the lightest format the browser can read. Written
 * here, it would hand every reader the JPEG, which is the heaviest of the three,
 * on the screen that opens the largest file of the game.
 *
 * Nothing is written twice either: the caption, the author, the licence and the
 * page the photograph was taken from arrive with the row that was tapped, so
 * this component holds no table of its own and cannot disagree with the list
 * behind it. The credit travels with the picture instead of being left behind on
 * the row, which is what a licence asks for: the photograph is shown at its
 * largest with the name of the person who made it beside it.
 *
 * It is a dialog, with the keyboard and screen reader behaviour of every other
 * sheet in the game: the focus moves into it, Tab stays inside it, Escape closes
 * it, and the focus returns to the thumbnail that opened it. Its heading is the
 * caption of the photograph rather than a title of its own, so a reader who
 * cannot see the picture is told which one they opened.
 */
export default function PhotoViewer({ photo, onClose }) {
  const t = useT();
  const dialogRef = useRef(null);
  // Whoever asked their device for less motion gets the photograph straight
  // away: opening a picture is not an effect.
  const still = useReducedMotion();

  useModalA11y({ open: Boolean(photo), onClose, containerRef: dialogRef });

  // The credits stay where they are while a photograph is open: the viewer is
  // fixed, so a wheel or a swipe would otherwise scroll the list under a picture
  // that does not move, which reads as the screen being broken. What can still
  // be scrolled is the viewer itself, for a photograph and a credit line that do
  // not fit the height of a short screen.
  useEffect(() => {
    if (!photo) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [photo]);

  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="photo-viewer-caption"
          tabIndex={-1}
          // A tap anywhere around the picture closes it, which is what a reader
          // tries first on a phone. The figure below stops that from happening
          // on the picture itself.
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overscroll-contain bg-slate-950/90 p-4 focus:outline-none"
          initial={still ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={still ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <figure
            onClick={(event) => event.stopPropagation()}
            className="flex max-h-full w-full max-w-2xl flex-col items-center gap-3"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label={t.close}
              className="self-end p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>

            {/* The dark box is what the reader sees while the file arrives: the
                picture is the largest of the game, and on a slow connection the
                caption below is readable before it is. */}
            <LevelPicture
              src={photo.file}
              alt=""
              className="max-h-[62vh] w-auto max-w-full object-contain rounded-xl bg-slate-800 shadow-2xl"
            />

            <figcaption className="w-full text-center">
              <p id="photo-viewer-caption" className="text-sm font-semibold leading-snug text-white">
                {photo.caption}
              </p>
              <p className="text-[11px] text-white/70 mt-1">
                <span className="font-bold text-white/90">{t.photoCreditsAuthor}</span> {photo.author}
              </p>
              <p className="text-[11px] text-white/70">
                <span className="font-bold text-white/90">{t.photoCreditsLicence}</span> {photo.licence}
              </p>
              <a
                href={photo.source}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-1 text-[11px] font-semibold text-amber-300 underline decoration-amber-500 underline-offset-2 hover:text-amber-200"
              >
                {t.photoCreditsSource}
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
            </figcaption>
          </figure>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
