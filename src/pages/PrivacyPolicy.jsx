import LegalPage from "../components/game/LegalPage";
import { useLang } from "../components/i18n";
import { contactFacts, publisherFacts } from "../lib/publisher";

/**
 * The privacy notice, in both languages.
 *
 * A section may declare `facts`, which names a builder in the map below: the
 * publisher identity and the host come from `src/lib/publisher.js`, so the
 * notice and the terms cannot drift apart, and a field the publisher has not
 * filled in yet is shown as a gap rather than invented.
 */
const CONTENT = {
  en: {
    title: "Privacy Policy (GDPR)",
    backLabel: "Back to the game",
    updatedLabel: "Last updated:",
    updatedAt: "September 2026",
    intro:
      "This notice explains which personal data Africa History Quest processes, why, and the rights you can exercise. It is written to comply with the European General Data Protection Regulation (GDPR).",
    sections: [
      {
        heading: "1. Who is responsible for your data",
        paragraphs: [
          "The data controller is the publisher of the Africa History Quest application, identified below.",
          "This notice and the terms of use read the same source, so the publisher is named in the same words in both documents.",
        ],
        facts: "publisher",
      },
      {
        heading: "2. Data we process",
        paragraphs: [
          "The application runs entirely in your browser. It has no account, no server of its own and no advertising, and it does not send us your data.",
        ],
        bullets: [
          "Game progress: the level reached, total XP, stars, badges, per-level scores and the daily streak.",
          "Student profiles: on a shared device, the teacher space can keep a separate progress record for each student, all of them in the browser.",
          "Language preference, stored in your browser.",
          "Backup files: you can export your progress to a file and load it back on another device. The file is written and read on your device, and we never receive it. A file you load is checked for its type and its size before it is read, its contents are rebuilt field by field rather than stored as they arrive, and nothing in it is ever executed.",
          "We do not collect payment data, precise location, contacts or advertising identifiers.",
        ],
      },
      {
        heading: "3. Purpose and legal basis",
        bullets: [
          "Give you the game and save your progress (performance of the service).",
          "Keep a separate record for each student on a shared device (performance of the service).",
          "Remember your language choice (consent, through local storage).",
        ],
      },
      {
        heading: "4. Where the data is stored",
        paragraphs: [
          "Progress, student profiles and the language choice are stored in your browser's local storage, on the device you play on. The application is fully playable offline.",
          "Nothing is sent to the publisher or to a third party, so no data is transferred outside your device, and in particular no data leaves the European Union.",
        ],
      },
      {
        heading: "5. How long we keep it",
        paragraphs: [
          "Your data stays on your device until you remove it. The Settings screen deletes a progress record, and clearing your browser storage removes everything the game holds.",
          "Because we never receive your data, we hold no copy that we could keep or delete for you.",
        ],
      },
      {
        heading: "6. Sharing and transfers",
        paragraphs: [
          "We never sell or rent your data. Since nothing leaves your device, no data is shared with anyone, and no transfer outside the European Union takes place.",
          "Photographs are served from the copy the application carries, so no request is made to Wikimedia Commons or to any other picture site while you play.",
        ],
      },
      {
        heading: "7. Your rights",
        paragraphs: ["Under the GDPR you have the following rights over your data:"],
        bullets: [
          "Access: obtain a copy of the data linked to you.",
          "Rectification: correct inaccurate data.",
          "Erasure: delete your progress from the Settings screen.",
          "Portability: receive your data in a structured format.",
          "Objection and restriction: object to or limit a processing operation.",
          "Withdrawal of consent at any time when the processing is based on consent.",
        ],
      },
      {
        heading: "8. Exercising your rights",
        paragraphs: [
          "Most of these rights are exercised in the application itself: the Settings screen exports your progress as a file and deletes it. For anything else, write to the contact address at the end of this page.",
          "You may also lodge a complaint with your national data protection authority, the CNIL in France.",
        ],
      },
      {
        heading: "9. Cookies and local storage",
        paragraphs: [
          "We use no advertising and no analytics cookies. The application stores a small amount of technical data in your browser: your language preference, your progress and the roster of student profiles. This data stays on your device and can be removed by deleting your progress in the Settings screen or by clearing your browser storage.",
        ],
      },
      {
        heading: "10. Security",
        paragraphs: [
          "Your progress is protected by the security of your own device: its screen lock and the account that unlocks it. On a shared device, such as a classroom tablet, keep that control in the hands of the person responsible for it.",
          "No data reaches a server we operate, so there is no database of yours that could be breached on our side.",
        ],
      },
      {
        heading: "11. Children",
        paragraphs: [
          "The game is built for educational use and is meant for children. It asks for no name, no address and no contact detail, and it never asks for sensitive information.",
          "In France, a child may consent alone to an online service from the age of fifteen. Below that age, the agreement of the holder of parental authority is required.",
        ],
      },
      {
        heading: "12. Changes",
        paragraphs: [
          "This notice may be updated as the application evolves. The date at the top of the page shows the latest version.",
        ],
      },
      {
        heading: "13. Contact",
        paragraphs: [
          "Write to the contact address above for any question about this notice, or to exercise your rights.",
        ],
        facts: "contact",
      },
    ],
  },
  fr: {
    title: "Politique de confidentialité (RGPD)",
    backLabel: "Retour au jeu",
    updatedLabel: "Dernière mise à jour :",
    updatedAt: "septembre 2026",
    intro:
      "Cette page explique quelles données personnelles Quête Historique Africaine traite, pourquoi, et les droits que vous pouvez exercer. Elle est rédigée pour respecter le Règlement général sur la protection des données (RGPD).",
    sections: [
      {
        heading: "1. Responsable du traitement",
        paragraphs: [
          "Le responsable du traitement est l'éditeur de l'application Quête Historique Africaine, identifié ci-dessous.",
          "La présente page et les conditions d'utilisation lisent la même source : l'éditeur y est donc nommé dans les mêmes termes.",
        ],
        facts: "publisher",
      },
      {
        heading: "2. Données traitées",
        paragraphs: [
          "L'application fonctionne entièrement dans votre navigateur. Elle n'a ni compte, ni serveur qui lui soit propre, ni publicité, et elle ne nous transmet pas vos données.",
        ],
        bullets: [
          "Progression de jeu : niveau atteint, XP total, étoiles, badges, scores par niveau et série de jours.",
          "Profils d'élèves : sur un appareil partagé, l'espace enseignant peut conserver un suivi de progression par élève, tous dans le navigateur.",
          "Préférence de langue, stockée dans votre navigateur.",
          "Fichiers de sauvegarde : vous pouvez exporter votre progression dans un fichier et la recharger sur un autre appareil. Le fichier est créé et lu sur votre appareil, et nous ne le recevons jamais. Un fichier que vous chargez est contrôlé en type et en taille avant d'être lu, son contenu est reconstruit champ par champ au lieu d'être stocké tel quel, et rien de ce qu'il contient n'est exécuté.",
          "Nous ne collectons aucune donnée bancaire, localisation précise, contact, ni identifiant publicitaire.",
        ],
      },
      {
        heading: "3. Finalités et base légale",
        bullets: [
          "Vous fournir le jeu et enregistrer votre progression (exécution du service).",
          "Conserver un suivi distinct pour chaque élève sur un appareil partagé (exécution du service).",
          "Mémoriser votre choix de langue (consentement, via le stockage local).",
        ],
      },
      {
        heading: "4. Lieu de stockage",
        paragraphs: [
          "La progression, les profils d'élèves et le choix de langue sont stockés dans le stockage local de votre navigateur, sur l'appareil avec lequel vous jouez. L'application est entièrement utilisable hors connexion.",
          "Rien n'est envoyé à l'éditeur ni à un tiers : aucune donnée n'est transférée hors de votre appareil, et en particulier aucune donnée ne quitte l'Union européenne.",
        ],
      },
      {
        heading: "5. Durée de conservation",
        paragraphs: [
          "Vos données restent sur votre appareil jusqu'à ce que vous les supprimiez. L'écran Paramètres supprime un suivi de progression, et vider le stockage de votre navigateur efface tout ce que le jeu détient.",
          "Comme nous ne recevons jamais vos données, nous n'en détenons aucune copie que nous pourrions conserver ou supprimer pour vous.",
        ],
      },
      {
        heading: "6. Partage et transferts",
        paragraphs: [
          "Nous ne vendons ni ne louons vos données. Comme rien ne quitte votre appareil, aucune donnée n'est partagée avec qui que ce soit, et aucun transfert hors de l'Union européenne n'a lieu.",
          "Les photographies sont servies depuis la copie que l'application embarque : aucune requête n'est adressée à Wikimedia Commons ni à un autre site d'images pendant que vous jouez.",
        ],
      },
      {
        heading: "7. Vos droits",
        paragraphs: ["Conformément au RGPD, vous disposez des droits suivants sur vos données :"],
        bullets: [
          "Accès : obtenir une copie des données qui vous concernent.",
          "Rectification : corriger des données inexactes.",
          "Effacement : supprimer votre progression depuis l'écran Paramètres.",
          "Portabilité : recevoir vos données dans un format structuré.",
          "Opposition et limitation : vous opposer à un traitement ou le limiter.",
          "Retrait du consentement à tout moment lorsque le traitement repose sur le consentement.",
        ],
      },
      {
        heading: "8. Exercer vos droits",
        paragraphs: [
          "La plupart de ces droits s'exercent dans l'application même : l'écran Paramètres exporte votre progression dans un fichier et la supprime. Pour le reste, écrivez à l'adresse de contact indiquée en fin de page.",
          "Vous pouvez également introduire une réclamation auprès de votre autorité de protection des données, la CNIL en France.",
        ],
      },
      {
        heading: "9. Cookies et stockage local",
        paragraphs: [
          "Nous n'utilisons aucun cookie publicitaire ni de mesure d'audience. L'application stocke une petite quantité de données techniques dans votre navigateur : votre préférence de langue, votre progression et la liste des profils d'élèves. Ces données restent sur votre appareil et peuvent être supprimées via l'écran Paramètres ou en vidant le stockage de votre navigateur.",
        ],
      },
      {
        heading: "10. Sécurité",
        paragraphs: [
          "Votre progression est protégée par la sécurité de votre propre appareil : son verrouillage d'écran et le compte qui le déverrouille. Sur un appareil partagé, comme une tablette de classe, gardez cette maîtrise entre les mains de la personne responsable.",
          "Aucune donnée n'atteint un serveur que nous exploitons : il n'existe donc chez nous aucune base vous concernant qui pourrait être compromise.",
        ],
      },
      {
        heading: "11. Mineurs",
        paragraphs: [
          "Le jeu est conçu pour un usage éducatif et s'adresse aux enfants. Il ne demande ni nom, ni adresse, ni coordonnées, et ne demande jamais d'informations sensibles.",
          "En France, un enfant peut consentir seul à un service en ligne à partir de quinze ans. En dessous de cet âge, l'accord du titulaire de l'autorité parentale est requis.",
        ],
      },
      {
        heading: "12. Modifications",
        paragraphs: [
          "Cette page peut être mise à jour avec l'évolution de l'application. La date en haut de page indique la dernière version.",
        ],
      },
      {
        heading: "13. Contact",
        paragraphs: [
          "Écrivez à l'adresse de contact ci-dessus pour toute question sur cette page, ou pour exercer vos droits.",
        ],
        facts: "contact",
      },
    ],
  },
};

/** Builders a section can ask for through its `facts` marker. */
const FACTS = {
  publisher: (lang) => publisherFacts(lang),
  contact: (lang) => contactFacts(lang),
};

export default function PrivacyPolicy() {
  const lang = useLang();
  const content = CONTENT[lang] || CONTENT.en;
  const sections = content.sections.map((section) =>
    section.facts ? { ...section, facts: FACTS[section.facts](lang) } : section
  );
  return <LegalPage {...content} sections={sections} />;
}
