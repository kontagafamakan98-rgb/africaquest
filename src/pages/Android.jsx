import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Smartphone, Download, ExternalLink, ShieldCheck, WifiOff } from "lucide-react";
import { useLang } from "../components/i18n";
import {
  RELEASES_PAGE,
  RELEASE_TIMEOUT_MS,
  latestAndroidRelease,
} from "../lib/android-release";

/**
 * The Android app, where to get it, and how to install it.
 *
 * The same game is wrapped in a native shell and published as an APK on the
 * releases page. This screen is the place a reader is told that, and it is the
 * only screen of the application that asks anything of another machine: it asks
 * GitHub for the newest release when it is opened, so the number on the button
 * is the number of the release rather than a constant somebody has to remember
 * to bump. The request is made here and never at load, and a reader with no
 * network is not left without an answer: the button still opens
 * `/releases/latest`, which GitHub resolves to the newest release on its own.
 *
 * Nothing here is a promise the app cannot keep. The download is somebody
 * else's file on somebody else's site, so the button leaves the application for
 * it in a new tab, and the wording about unknown sources is the sentence a phone
 * shows, not a claim invented here.
 *
 * The wording lives in the module rather than in the shared dictionary, the way
 * the About page keeps its own: this is a page read once, and its text is long
 * enough that keeping it beside the layout is what makes it editable.
 */
const CONTENT = {
  en: {
    title: "Android app",
    back: "Back to the game",
    intro:
      "Africa History Quest also ships as an app for Android phones and tablets. It is the same game, and it works with no network at all.",
    versionLabel: "Latest version",
    checking: "Reading the latest version from GitHub",
    unknown: "The version could not be read here. The release page always names the newest one.",
    download: "Download for Android",
    direct: "Download the APK file directly",
    releasePage: "Open the release page",
    installHeading: "How to install it",
    installSteps: [
      "Open the download and let the APK arrive. That is the file format Android installs applications from.",
      "Your phone will ask whether this source may install apps. Allow it for this one file, and the installation continues.",
      "If you already had an earlier copy of the app, remove it first: a phone refuses to update one signed with another key.",
      "Open the app. It asks for no account and needs no network, and everything it knows stays on the device.",
    ],
    signedHeading: "A signed release",
    signedBody:
      "Every release is signed, so a phone accepts it the way it accepts any other application. The download link points at the release this project publishes, and nothing in the game is sent anywhere when it is opened.",
    offlineHeading: "This line and your network",
    offlineBody:
      "This screen asks GitHub for the version when it is opened, and only then. With no network, the number is simply absent and the download button still opens the release page.",
    offlineNote: "The game itself still needs no network to be played.",
  },
  fr: {
    title: "Application Android",
    back: "Retour au jeu",
    intro:
      "Africa History Quest existe aussi comme application pour téléphones et tablettes Android. C'est le même jeu, et il fonctionne sans réseau.",
    versionLabel: "Dernière version",
    checking: "Lecture de la dernière version sur GitHub",
    unknown:
      "La version n'a pas pu être lue ici. La page des versions nomme toujours la plus récente.",
    download: "Télécharger pour Android",
    direct: "Télécharger directement le fichier APK",
    releasePage: "Ouvrir la page des versions",
    installHeading: "Comment l'installer",
    installSteps: [
      "Ouvrez le téléchargement et laissez le fichier APK arriver. C'est le format avec lequel Android installe une application.",
      "Votre téléphone demandera si cette source peut installer des applications. Autorisez-le pour ce fichier, et l'installation continue.",
      "Si vous aviez déjà une version antérieure, désinstallez-la d'abord : un téléphone refuse de mettre à jour une application signée avec une autre clé.",
      "Ouvrez l'application. Elle ne demande aucun compte et n'a pas besoin de réseau, et tout ce qu'elle sait reste sur l'appareil.",
    ],
    signedHeading: "Une version signée",
    signedBody:
      "Chaque version est signée, donc un téléphone l'accepte comme n'importe quelle autre application. Le lien de téléchargement mène à la version que ce projet publie, et rien du jeu n'est envoyé où que ce soit quand on l'ouvre.",
    offlineHeading: "Cette ligne et votre réseau",
    offlineBody:
      "Cet écran demande la version à GitHub quand on l'ouvre, et seulement à ce moment. Sans réseau, le numéro est simplement absent et le bouton de téléchargement ouvre quand même la page des versions.",
    offlineNote: "Le jeu lui-même n'a toujours besoin d'aucun réseau pour être joué.",
  },
};

export default function Android() {
  const lang = useLang();
  const t = CONTENT[lang] || CONTENT.en;
  // `loading` while the request is in flight, `ready` when a version was read,
  // `unknown` for everything else. The three are drawn differently, because a
  // number that is still coming and a number that will never come are not the
  // same thing to a reader.
  const [state, setState] = useState("loading");
  const [release, setRelease] = useState(null);

  useEffect(() => {
    let cancelled = false;
    // The request is bounded: a phone on a slow network should not leave the
    // screen saying it is still reading forever. The controller also stops the
    // request when the reader leaves before it answers.
    const controller = typeof AbortController === "function" ? new AbortController() : null;
    const timer = setTimeout(() => controller?.abort(), RELEASE_TIMEOUT_MS);

    latestAndroidRelease({ signal: controller ? controller.signal : undefined })
      .then((found) => {
        if (cancelled) return;
        setRelease(found);
        setState(found ? "ready" : "unknown");
      })
      .finally(() => clearTimeout(timer));

    return () => {
      cancelled = true;
      controller?.abort();
      clearTimeout(timer);
    };
  }, []);

  const archive = release?.download && release.download !== RELEASES_PAGE ? release.download : null;

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
            {t.back}
          </Link>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold leading-tight">
            <Smartphone className="w-6 h-6 text-amber-400" aria-hidden="true" />
            {t.title}
          </h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-5 py-6 space-y-6">
        <p className="text-sm text-slate-600 leading-relaxed">{t.intro}</p>

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          {/* The version is announced before it is known, so the line is not a
              blank the reader has to guess at while the request runs. */}
          <p className="text-xs font-semibold text-slate-500">{t.versionLabel}</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-800" aria-live="polite">
            {state === "ready" ? (
              release.version
            ) : state === "loading" ? (
              <span className="text-base font-semibold text-slate-500">{t.checking}</span>
            ) : (
              <span className="text-base font-semibold text-slate-500">{t.unknown}</span>
            )}
          </p>

          {/* The download leaves the application for a file on GitHub, so it
              opens its own tab and carries nothing back with it. */}
          <a
            href={archive || RELEASES_PAGE}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-500 px-4 py-3 text-sm font-bold text-[#1C150C] transition-colors hover:bg-amber-400 active:scale-[0.99]"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            {t.download}
          </a>

          {archive && (
            <a
              href={archive}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 flex items-center justify-center gap-1.5 min-h-11 text-xs font-semibold text-amber-800 underline decoration-amber-400 underline-offset-2 hover:text-amber-950"
            >
              {t.direct}
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
          )}

          <a
            href={RELEASES_PAGE}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-1.5 min-h-11 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
          >
            {t.releasePage}
            <ExternalLink className="w-3 h-3" aria-hidden="true" />
          </a>
        </section>

        <section>
          <h2 className="text-base font-extrabold text-slate-800 mb-2">{t.installHeading}</h2>
          <ol className="space-y-2 list-decimal list-inside text-sm text-slate-600 leading-relaxed">
            {t.installSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h2 className="flex items-center gap-2 text-sm font-extrabold text-slate-800">
            <ShieldCheck className="w-4 h-4 text-amber-600" aria-hidden="true" />
            {t.signedHeading}
          </h2>
          <p className="mt-1 text-xs text-slate-600 leading-relaxed">{t.signedBody}</p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <h2 className="flex items-center gap-2 text-sm font-extrabold text-slate-800">
            <WifiOff className="w-4 h-4 text-amber-600" aria-hidden="true" />
            {t.offlineHeading}
          </h2>
          <p className="mt-1 text-xs text-slate-600 leading-relaxed">{t.offlineBody}</p>
          <p className="mt-2 text-xs font-semibold text-slate-700">{t.offlineNote}</p>
        </section>
      </main>
    </div>
  );
}
