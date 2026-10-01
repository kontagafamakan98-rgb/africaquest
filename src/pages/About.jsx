import { Link } from "react-router-dom";
import { ArrowLeft, Info, Smartphone } from "lucide-react";
import { useLang } from "../components/i18n";
import { PUBLISHER } from "../lib/publisher";

/**
 * Who publishes this game, why it exists, and how it is paid for.
 *
 * The legal pages answer a store review; this one answers a reader. It says
 * plainly who is behind the application, what it is for, and the honest state
 * of its funding, because a free game with no advertising and no account raises
 * that question the moment somebody plays it.
 *
 * The publisher's name, form, address and contact are read from the one module
 * the privacy notice and the terms also read, so this page cannot name an
 * editor the other two do not.
 */
const CONTENT = {
  en: {
    title: "About",
    back: "Back to the game",
    intro:
      "Africa History Quest is a free quiz game that helps young learners explore the history of Africa, from human origins to the continent today. Twenty-six levels, more than two hundred questions, in English and in French.",
    whoHeading: "Who publishes it",
    whoBody:
      "The application is edited and published by the person below. It is an independent project, not a school or a ministry, and it answers to no one but its readers.",
    whyHeading: "Why it exists",
    whyBody:
      "African history is often taught late, briefly, or through somebody else's eyes. The game tells the story in order, names the works each explanation comes from, and lets a player study a level before being quizzed on it.",
    fundedHeading: "How it is paid for",
    fundedBody:
      "The game is free, and it has to stay that way for the classrooms that use it. It carries no advertising, sets no cookie, loads nothing from another site and takes no payment: there is nothing to buy in it and nothing about you leaves your device. Today the whole cost is carried by its publisher.",
    supportHeading: "How to support it",
    supportBody:
      "If you teach with it, run it in a school, or want to help it grow, write to the address below. Corrections, sources and lesson ideas are the most useful thing you can send.",
    contactLabel: "Contact",
    registrationLabel: "Registration",
    formLabel: "Legal form",
    addressLabel: "Registered office",
    androidHeading: "The Android app",
    androidBody:
      "The same game is also published as an Android application, installed from a signed release rather than opened in a browser.",
    androidLink: "Download the Android app",
  },
  fr: {
    title: "À propos",
    back: "Retour au jeu",
    intro:
      "Africa History Quest est un jeu de quiz gratuit qui aide les jeunes à découvrir l'histoire de l'Afrique, des origines de l'humanité au continent d'aujourd'hui. Vingt-six niveaux, plus de deux cents questions, en français et en anglais.",
    whoHeading: "Qui l'édite",
    whoBody:
      "L'application est éditée et publiée par la personne ci-dessous. C'est un projet indépendant, ni une école ni un ministère, et il ne rend de comptes qu'à ses lecteurs.",
    whyHeading: "Pourquoi elle existe",
    whyBody:
      "L'histoire africaine est souvent enseignée tard, brièvement, ou vue par les yeux des autres. Le jeu raconte l'histoire dans l'ordre, nomme les œuvres dont vient chaque explication, et laisse le joueur étudier un niveau avant d'être interrogé dessus.",
    fundedHeading: "Comment il est financé",
    fundedBody:
      "Le jeu est gratuit, et il doit le rester pour les classes qui l'utilisent. Il ne porte aucune publicité, ne pose aucun cookie, ne charge rien depuis un autre site et ne demande aucun paiement : rien ne s'y achète et rien de vous ne quitte votre appareil. Aujourd'hui, tout le coût est porté par son éditeur.",
    supportHeading: "Comment l'aider",
    supportBody:
      "Si vous l'utilisez en classe, l'installez dans une école ou voulez l'aider à grandir, écrivez à l'adresse ci-dessous. Les corrections, les sources et les idées de leçon sont ce qu'il y a de plus utile.",
    contactLabel: "Contact",
    registrationLabel: "Immatriculation",
    formLabel: "Forme juridique",
    addressLabel: "Siège",
    androidHeading: "L'application Android",
    androidBody:
      "Le même jeu est aussi publié comme application Android, installée depuis une version signée plutôt qu'ouverte dans un navigateur.",
    androidLink: "Télécharger l'application Android",
  },
};

export default function About() {
  const lang = useLang();
  const t = CONTENT[lang] || CONTENT.en;

  const facts = [
    { label: t.formLabel, value: PUBLISHER.legalForm },
    { label: t.addressLabel, value: PUBLISHER.address },
    { label: t.registrationLabel, value: PUBLISHER.registration },
  ].filter((fact) => fact.value);

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
            {t.back}
          </Link>
          <h1 className="flex items-center gap-2 text-2xl font-extrabold leading-tight">
            <Info className="w-6 h-6 text-amber-400" aria-hidden="true" />
            {t.title}
          </h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-5 py-6 space-y-6">
        <p className="text-sm text-slate-600 leading-relaxed">{t.intro}</p>

        <section>
          <h2 className="text-base font-extrabold text-slate-800 mb-1">{t.whoHeading}</h2>
          <p className="text-sm text-slate-600 leading-relaxed">{t.whoBody}</p>
          <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-bold text-slate-800">{PUBLISHER.name}</p>
            {PUBLISHER.legalName && (
              <p className="text-xs text-slate-600 mt-0.5">{PUBLISHER.legalName}</p>
            )}
            <dl className="mt-3 space-y-1.5">
              {facts.map((fact) => (
                <div key={fact.label} className="flex gap-2 text-xs">
                  <dt className="text-slate-500 font-semibold shrink-0">{fact.label}</dt>
                  <dd className="text-slate-700">{fact.value}</dd>
                </div>
              ))}
              <div className="flex gap-2 text-xs">
                <dt className="text-slate-500 font-semibold shrink-0">{t.contactLabel}</dt>
                <dd className="text-slate-700">
                  <a
                    href={`mailto:${PUBLISHER.email}`}
                    className="font-semibold text-amber-700 hover:text-amber-800 transition-colors"
                  >
                    {PUBLISHER.email}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section>
          <h2 className="text-base font-extrabold text-slate-800 mb-1">{t.whyHeading}</h2>
          <p className="text-sm text-slate-600 leading-relaxed">{t.whyBody}</p>
        </section>

        <section>
          <h2 className="text-base font-extrabold text-slate-800 mb-1">{t.fundedHeading}</h2>
          <p className="text-sm text-slate-600 leading-relaxed">{t.fundedBody}</p>
        </section>

        <section>
          <h2 className="text-base font-extrabold text-slate-800 mb-1">{t.supportHeading}</h2>
          <p className="text-sm text-slate-600 leading-relaxed">{t.supportBody}</p>
        </section>

        <section>
          <h2 className="text-base font-extrabold text-slate-800 mb-1">{t.androidHeading}</h2>
          <p className="text-sm text-slate-600 leading-relaxed">{t.androidBody}</p>
          <Link
            to="/Android"
            className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-amber-500 px-4 py-3 text-sm font-bold text-[#1C150C] transition-colors hover:bg-amber-400 active:scale-[0.99]"
          >
            <Smartphone className="w-4 h-4" aria-hidden="true" />
            {t.androidLink}
          </Link>
        </section>
      </main>
    </div>
  );
}
