import { Camera } from "lucide-react";
import { useT } from "../i18n";
import LevelPicture from "./LevelPicture";

/**
 * The photographs of a level, shown in the lesson.
 *
 * A strip the reader swipes through rather than a grid: on a phone, three
 * pictures side by side would be too small to see anything, and stacked full
 * width they would push the lesson itself out of reach. Every picture carries
 * its own caption and its credit line, because the licence of the ones taken
 * from Wikimedia Commons asks for the author to be named where the picture is
 * shown, not only on a legal page.
 */
export default function LevelGallery({ photos = [] }) {
  const t = useT();
  if (photos.length === 0) return null;

  return (
    <section aria-labelledby="level-gallery-heading">
      <h2
        id="level-gallery-heading"
        className="flex items-center gap-2 text-xs font-extrabold text-slate-700 uppercase tracking-widest mb-1"
      >
        <Camera className="w-4 h-4 text-amber-600" aria-hidden="true" />
        {t.gallery}
      </h2>
      <p className="text-xs text-slate-600 mb-3">{t.galleryIntro}</p>

      <ul className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4">
        {photos.map((photo) => (
          <li key={photo.file} className="snap-start shrink-0 w-[76%]">
            <figure>
              <LevelPicture
                src={photo.file}
                alt={photo.caption}
                loading="lazy"
                className="w-full aspect-[4/3] object-cover rounded-xl border border-slate-200 bg-slate-100"
              />
              <figcaption className="mt-1.5">
                <p className="text-xs text-slate-700 leading-snug">{photo.caption}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{photo.credit}</p>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
