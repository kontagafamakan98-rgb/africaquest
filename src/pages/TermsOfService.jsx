import LegalPage from "../components/game/LegalPage";
import { useLang } from "../components/i18n";
import { contactFacts, hostFacts, publisherFacts } from "../lib/publisher";

/**
 * The terms of use, in both languages.
 *
 * A section may declare `facts`, which names a builder in the map below. The
 * mentions legales of section 3 and the closing contact section therefore name
 * the same publisher as the privacy notice, and a field the publisher has not
 * filled in yet is shown as a gap rather than invented.
 */

const CONTENT = {
  en: {
    title: "Terms of Use",
    backLabel: "Back to the game",
    updatedLabel: "Last updated:",
    updatedAt: "September 2026",
    intro:
      "These terms govern your use of the Africa History Quest application. Using the application means you accept them.",
    sections: [
      {
        heading: "1. Purpose",
        paragraphs: [
          "These terms of use define the conditions under which the Africa History Quest application is made available to users.",
        ],
      },
      {
        heading: "2. Description of the service",
        paragraphs: [
          "Africa History Quest is an educational quiz game about African history. It offers twenty thematic levels, three difficulty modes and a progress system with stars, XP and badges. The content is provided for educational purposes.",
        ],
      },
      {
        heading: "3. Publisher and host",
        paragraphs: [
          "Africa History Quest is published and operated by the publisher identified below, who answers for its content.",
          "The host serves the files of the application. It receives no personal data, because the game keeps everything in your browser.",
        ],
        facts: "publisherAndHost",
      },
      {
        heading: "4. Access",
        bullets: [
          "The game is used without any account, and your progress is stored in your browser only.",
          "The first visit can load the files over the network. After that, the game also works offline.",
          "Access requires a recent browser, and an internet connection for the first visit.",
        ],
      },
      {
        heading: "5. Accounts and profiles",
        paragraphs: [
          "The game needs no account. Your progress is kept in the browser of the device you play on, and it is not linked to any identity on our side.",
          "On a shared device, the teacher space can keep one progress record per student. Each record stays on that device, and deleting one leaves the others untouched.",
          "You may also export a backup file and load it elsewhere. The file is created and read on your device, under your control.",
        ],
      },
      {
        heading: "6. Acceptable use",
        bullets: [
          "Do not attempt to disrupt, overload or reverse engineer the service.",
          "Do not reuse the content for commercial purposes without permission.",
          "Respect other users and applicable law.",
        ],
      },
      {
        heading: "7. Content and accuracy",
        paragraphs: [
          "Historical content is written for a young audience and for teaching purposes. Despite careful research, mistakes remain possible, and the game is not a substitute for a scholarly source.",
          "Photographs come from third-party services and remain subject to their own licences.",
        ],
      },
      {
        heading: "8. Intellectual property",
        paragraphs: [
          "The game, its interface, its texts and its visual identity are protected. Third-party names and logos belong to their respective owners.",
        ],
      },
      {
        heading: "9. Availability and changes",
        paragraphs: [
          "The service is provided as is. It may be modified, interrupted or withdrawn, in particular for maintenance or improvement. We do not guarantee uninterrupted availability.",
        ],
      },
      {
        heading: "10. Liability",
        paragraphs: [
          "To the extent permitted by law, we cannot be held liable for indirect damage resulting from the use of, or the impossibility of using, the application.",
        ],
      },
      {
        heading: "11. Termination",
        paragraphs: [
          "You may stop using the application at any time and delete your data from the Settings screen. We may suspend access in the event of a breach of these terms.",
        ],
      },
      {
        heading: "12. Governing law",
        paragraphs: [
          "These terms are governed by French law. In the event of a dispute, the competent courts will be those of the registered office named in section 3, unless the law provides otherwise.",
        ],
      },
      {
        heading: "13. Photo credits",
        paragraphs: [
          "The game shows three photographs per level. They come from free-licence sources and remain the property of their authors, who are named under each picture and again here:",
          "Apart from the first one, which comes from Unsplash, all of them are published on Wikimedia Commons under the licence named below. The game keeps its own copy of every file, so no request is made to those sites while it runs.",
        ],
        bullets: [
          "Ancient Egypt: the pyramids of Giza, from Unsplash; the Great Sphinx, photograph by Petar Milošević, CC BY-SA 4.0; the funeral mask of Tutankhamun, photograph by Dawid Wdowczyk, CC BY 4.0.",
          "Kingdom of Kush: the pyramids of Meroe from the air, photograph by B N Chagny, CC BY-SA 1.0; a pyramid at Nuri, photograph by Sue Fleckney, CC BY-SA 2.0; a bronze of King Taharqa, photograph by Hans Ollermann, CC BY-SA 2.0.",
          "Great Zimbabwe: the Great Enclosure from the air, photograph by Janice Bell, CC BY-SA 4.0; the conical tower, photograph by Fanny Schertzer, CC BY 3.0; a soapstone bird, photograph by Cliff, CC BY 2.0.",
          "Mali Empire: the Great Mosque of Djenne, photograph by Andy Gilham, CC BY-SA 3.0; the Sankore mosque in Timbuktu, photograph by Ondřej Havelka, CC BY-SA 4.0; a manuscript of Timbuktu, photograph by Mark Fischer, CC BY-SA 2.0.",
          "Kingdom of Axum: the Rome Stele, photograph by Ondřej Žváček, CC BY 2.5; the ruins of the oldest church at St Mary of Zion, photograph by Sailko, CC BY 3.0; a gold coin of King Ezana, photograph by Ismoon, CC BY-SA 4.0.",
          "Songhai Empire: fishermen on the Niger River, photograph by T.K. Naliaka, CC BY-SA 4.0; the Tomb of Askia in Gao, photograph by Gio53, CC BY-SA 4.0; the Djinguereber mosque in Timbuktu, photograph by upyernoz, CC BY 2.0.",
          "Zulu Kingdom: the battlefield of Isandlwana, photograph by RedNovember82, CC BY-SA 3.0; a portrait of King Cetshwayo by Carl Rudolph Sohn, Public domain; a Zulu shield of cowhide from the Peabody Museum, photograph by Daderot, Public domain.",
          "African Independence: Independence Square in Accra, photograph by George Appiah, CC BY 2.0; the monument to Kwame Nkrumah, photograph by Nkansahrexford, CC BY-SA 4.0; Patrice Lumumba, photograph by Harry Pot, CC BY 4.0.",
          "Human Origins: the Olduvai Gorge in Tanzania, photograph by Mike Krüger, CC BY-SA 4.0; the Sterkfontein caves, photograph by Mike Peel, CC BY-SA 4.0; a cast of the Taung Child, photograph by Gerbil, CC BY-SA 3.0.",
          "Carthage and Ancient North Africa: the Baths of Antoninus at Carthage, photograph by Silar, CC BY-SA 4.0; a Punic stela of the tophet, photograph by Shoestring, CC BY-SA 4.0; Punic stonework in the museum of Carthage, photograph by damian entwistle, CC BY-SA 2.0.",
          "The Iron Age: a Nok terracotta near the village of Nok, photograph by Zbobai, CC BY-SA 4.0; a Nok head of the Honolulu Museum of Art, photograph by Hiart, CC0; a two-headed reptile of fired clay, photograph by Friday musa, CC BY-SA 4.0.",
          "Medieval Ethiopia: the church of Saint George at Lalibela, photograph by Thomas Fuhrmann, CC BY-SA 4.0; the church of Bet Gebriel-Rafael at Lalibela, photograph by Adam Jones, CC BY-SA 2.0; an Ethiopian prayer book of the Linden Museum, photograph by KarlHeinrich, Public domain.",
          "The Ghana Empire: blocks of salt at Mopti, photograph by Robin Taylor, CC BY 2.0; a grinding stone of Dhar Tichitt, photograph by Sylvie Amblard-Pison, CC BY 4.0; the burial ground of Koumbi Saleh, photograph by Chloé Capel, CC BY-SA 4.0.",
          "Kanem-Bornu and the Hausa Cities: the gate of the emir's palace in Kano, photograph by Uncle Bash007, CC BY-SA 4.0; the ancient walls of Kano, photograph by Anasskoko, CC BY-SA 4.0; the palace gate of Sarkin Kano in 1890, drawing by Monteil, P.-L., Public domain.",
          "The Swahili Coast: the great mosque of Kilwa Kisiwani, photograph by Richard Mortel, CC BY 2.0; a carved door of Stone Town in Zanzibar, photograph by Eric Kilby, CC BY-SA 2.0; the palace of the sultans of Kilwa, photograph by David Stanley, CC BY 2.0.",
          "Forest Kingdoms: the brass plaques of Benin in the British Museum, photograph by Warofdreams, CC BY-SA 3.0; a brass head of Ife, photograph by FA2010, Public domain; the royal enclosure of the king of Kongo in 1745, drawing by Thomas Astley, Public domain.",
          "The Atlantic Slave Trade: the gate of Elmina Castle, photograph by Kurt Dundy, CC BY-SA 3.0; Cape Coast Castle, photograph by Matti Blume, CC BY-SA 4.0; the island of Goree, photograph by Focale Emotions, CC BY-SA 4.0.",
          "Colonial Conquest: Emperor Menelik II at Adwa, illustration by F. Méaulle, Public domain; a cartoon of the Berlin Conference of 1884, by François Maréchal, Public domain; the delegates of the Pan-African Congress of 1927, by Unknown author, Public domain.",
          "Apartheid: the cell of Nelson Mandela on Robben Island, photograph by Paul Mannix, CC BY-SA 2.0; Nelson Mandela and Donald Card, photograph by Blossom Index, CC0; the entrance of Soweto, photograph by Nolabob, CC BY-SA 4.0.",
          "Africa Today: the skyline of Lagos Island, photograph by Jamie Tubers, CC BY-SA 4.0; the headquarters of the African Union, photograph by Wang Guansen, Public domain; a light rail train in Addis Ababa, photograph by Turtlewong, CC0.",
          "The Amazigh Kingdoms: the High Atlas of Morocco, photograph by Mounir Neddi, CC BY-SA 4.0; the Roman city of Timgad, photograph by Yelles, CC BY-SA 3.0; an Amazigh woman of the Atlas, photograph by Tahirshah999, CC BY-SA 4.0.",
          "Madagascar: the avenue of the baobabs, photograph by Cactus0625, CC BY-SA 4.0; the royal hill of Ambohimanga, photograph by Lemurbaby, CC BY-SA 3.0; a zebu market in the highlands, photograph by JialiangGao, CC BY-SA 4.0.",
          "The Great Lakes Kingdoms: Lake Victoria from the Ugandan shore, photograph by Monica2168, CC BY-SA 4.0; the tombs of the kabakas at Kasubi, photograph by Karl.Mustermann, Public domain; Lake Tanganyika, photograph by Orrling, CC BY-SA 3.0.",
          "Portuguese Africa: the bay of Luanda, photograph by Paulo César Santos, CC0; Fort Jesus at Mombasa, photograph by Mutisya Maingi, CC BY-SA 4.0; boats off the Island of Mozambique, photograph by Stig Nygaard, CC BY 2.0.",
          "The Asante Empire: a shrine of the Asante Traditional Buildings, photograph by Joy Agyepong, CC BY-SA 4.0; kente cloth of the Volta region, photograph by Warmglow, CC0; a street in Kumasi, photograph by Maven Egote, CC BY-SA 4.0.",
          "The Sokoto Caliphate: the palace of the Sultan of Sokoto, photograph by el-siddeeq lame, CC BY 3.0; the ancient walls of Kano, photograph by Anasskoko, CC BY-SA 4.0; the gateway to Sukur, photograph by Culture Hero, CC BY-SA 4.0.",
        ],
      },
      {
        heading: "14. Contact",
        paragraphs: [
          "Write to the contact address below for any question about these terms.",
        ],
        facts: "contact",
      },
    ],
  },
  fr: {
    title: "Conditions générales d'utilisation",
    backLabel: "Retour au jeu",
    updatedLabel: "Dernière mise à jour :",
    updatedAt: "septembre 2026",
    intro:
      "Ces conditions encadrent votre utilisation de l'application Quête Historique Africaine. En utilisant l'application, vous les acceptez.",
    sections: [
      {
        heading: "1. Objet",
        paragraphs: [
          "Les présentes conditions générales d'utilisation définissent les modalités de mise à disposition de l'application Quête Historique Africaine auprès des utilisateurs.",
        ],
      },
      {
        heading: "2. Description du service",
        paragraphs: [
          "Quête Historique Africaine est un jeu de quiz éducatif sur l'histoire de l'Afrique. Il propose vingt niveaux thématiques, trois modes de difficulté et un système de progression avec étoiles, XP et badges. Les contenus sont fournis à des fins pédagogiques.",
        ],
      },
      {
        heading: "3. Éditeur et hébergeur",
        paragraphs: [
          "Quête Historique Africaine est éditée et exploitée par l'éditeur identifié ci-dessous, qui répond de ses contenus.",
          "L'hébergeur sert les fichiers de l'application. Il ne reçoit aucune donnée personnelle, le jeu conservant tout dans votre navigateur.",
        ],
        facts: "publisherAndHost",
      },
      {
        heading: "4. Accès",
        bullets: [
          "Le jeu s'utilise sans aucun compte, et votre progression est stockée uniquement dans votre navigateur.",
          "La première visite peut charger les fichiers par le réseau. Ensuite, le jeu fonctionne aussi hors connexion.",
          "L'accès nécessite un navigateur récent, et une connexion internet pour la première visite.",
        ],
      },
      {
        heading: "5. Comptes et profils",
        paragraphs: [
          "Le jeu ne nécessite aucun compte. Votre progression est conservée dans le navigateur de l'appareil avec lequel vous jouez, et elle n'est liée à aucune identité de notre côté.",
          "Sur un appareil partagé, l'espace enseignant peut conserver un suivi de progression par élève. Chaque suivi reste sur cet appareil, et en supprimer un laisse les autres intacts.",
          "Vous pouvez également exporter un fichier de sauvegarde et le recharger ailleurs. Le fichier est créé et lu sur votre appareil, sous votre contrôle.",
        ],
      },
      {
        heading: "6. Usage acceptable",
        bullets: [
          "Ne pas tenter de perturber, surcharger ou décompiler le service.",
          "Ne pas réutiliser les contenus à des fins commerciales sans autorisation.",
          "Respecter les autres utilisateurs et la loi applicable.",
        ],
      },
      {
        heading: "7. Contenus et exactitude",
        paragraphs: [
          "Les contenus historiques sont rédigés pour un jeune public et à des fins pédagogiques. Malgré un travail de recherche attentif, des erreurs restent possibles, et le jeu ne remplace pas une source scientifique.",
          "Les photographies proviennent de services tiers et restent soumises à leurs propres licences.",
        ],
      },
      {
        heading: "8. Propriété intellectuelle",
        paragraphs: [
          "Le jeu, son interface, ses textes et son identité visuelle sont protégés. Les noms et logos de tiers appartiennent à leurs propriétaires respectifs.",
        ],
      },
      {
        heading: "9. Disponibilité et modifications",
        paragraphs: [
          "Le service est fourni en l'état. Il peut être modifié, interrompu ou retiré, notamment pour maintenance ou amélioration. Nous ne garantissons pas une disponibilité ininterrompue.",
        ],
      },
      {
        heading: "10. Responsabilité",
        paragraphs: [
          "Dans la mesure permise par la loi, nous ne pouvons être tenus responsables des dommages indirects résultant de l'utilisation ou de l'impossibilité d'utiliser l'application.",
        ],
      },
      {
        heading: "11. Résiliation",
        paragraphs: [
          "Vous pouvez cesser d'utiliser l'application à tout moment et supprimer vos données depuis l'écran Paramètres. Nous pouvons suspendre l'accès en cas de manquement à ces conditions.",
        ],
      },
      {
        heading: "12. Droit applicable",
        paragraphs: [
          "Ces conditions sont régies par le droit français. En cas de litige, les tribunaux compétents seront ceux du siège social indiqué à la section 3, sauf disposition légale contraire.",
        ],
      },
      {
        heading: "13. Crédits photographiques",
        paragraphs: [
          "Le jeu présente trois photographies par niveau. Elles proviennent de sources sous licence libre et restent la propriété de leurs auteurs, nommés sous chaque image et rappelés ici :",
          "À l'exception de la première, qui vient d'Unsplash, elles sont toutes publiées sur Wikimedia Commons sous la licence indiquée ci-dessous. Le jeu conserve sa propre copie de chaque fichier et n'adresse aucune requête à ces sites pendant qu'il fonctionne.",
        ],
        bullets: [
          "Égypte ancienne : les pyramides de Gizeh, issues d'Unsplash ; le grand Sphinx, photographie de Petar Milošević, CC BY-SA 4.0 ; le masque funéraire de Toutânkhamon, photographie de Dawid Wdowczyk, CC BY 4.0.",
          "Royaume de Kouch : les pyramides de Méroé vues du ciel, photographie de B N Chagny, CC BY-SA 1.0 ; une pyramide de Nuri, photographie de Sue Fleckney, CC BY-SA 2.0 ; un bronze du roi Taharqa, photographie de Hans Ollermann, CC BY-SA 2.0.",
          "Grand Zimbabwe : la Grande Enceinte vue du ciel, photographie de Janice Bell, CC BY-SA 4.0 ; la tour conique, photographie de Fanny Schertzer, CC BY 3.0 ; un oiseau de stéatite, photographie de Cliff, CC BY 2.0.",
          "Empire du Mali : la grande mosquée de Djenné, photographie de Andy Gilham, CC BY-SA 3.0 ; la mosquée Sankoré à Tombouctou, photographie de Ondřej Havelka, CC BY-SA 4.0 ; un manuscrit de Tombouctou, photographie de Mark Fischer, CC BY-SA 2.0.",
          "Royaume d'Axoum : la stèle de Rome, photographie de Ondřej Žváček, CC BY 2.5 ; les ruines de la plus ancienne église de Sainte-Marie-de-Sion, photographie de Sailko, CC BY 3.0 ; une pièce d'or du roi Ezana, photographie de Ismoon, CC BY-SA 4.0.",
          "Empire songhaï : des pêcheurs sur le fleuve Niger, photographie de T.K. Naliaka, CC BY-SA 4.0 ; le tombeau d'Askia à Gao, photographie de Gio53, CC BY-SA 4.0 ; la mosquée Djingareyber à Tombouctou, photographie de upyernoz, CC BY 2.0.",
          "Royaume zoulou : le champ de bataille d'Isandlwana, photographie de RedNovember82, CC BY-SA 3.0 ; un portrait du roi Cetshwayo par Carl Rudolph Sohn, domaine public ; un bouclier zoulou en cuir de vache du Peabody Museum, photographie de Daderot, domaine public.",
          "Indépendances africaines : Independence Square à Accra, photographie de George Appiah, CC BY 2.0 ; le monument à Kwame Nkrumah, photographie de Nkansahrexford, CC BY-SA 4.0 ; Patrice Lumumba, photographie de Harry Pot, CC BY 4.0.",
          "Aux origines de l'humanité : la gorge d'Olduvai en Tanzanie, photographie de Mike Krüger, CC BY-SA 4.0 ; les grottes de Sterkfontein, photographie de Mike Peel, CC BY-SA 4.0 ; un moulage de l'enfant de Taung, photographie de Gerbil, CC BY-SA 3.0.",
          "Carthage et l'Afrique du Nord antique : les thermes d'Antonin à Carthage, photographie de Silar, CC BY-SA 4.0 ; une stèle punique du tophet, photographie de Shoestring, CC BY-SA 4.0 ; des pierres puniques du musée de Carthage, photographie de damian entwistle, CC BY-SA 2.0.",
          "L'âge du fer : une terre cuite nok près du village de Nok, photographie de Zbobai, CC BY-SA 4.0 ; une tête nok du Honolulu Museum of Art, photographie de Hiart, CC0 ; un reptile à deux têtes de terre cuite, photographie de Friday musa, CC BY-SA 4.0.",
          "L'Éthiopie médiévale : l'église Saint-Georges de Lalibela, photographie de Thomas Fuhrmann, CC BY-SA 4.0 ; l'église Bet Gebriel-Rafael de Lalibela, photographie de Adam Jones, CC BY-SA 2.0 ; un livre de prières éthiopien du Linden Museum, photographie de KarlHeinrich, domaine public.",
          "L'empire du Ghana : des blocs de sel à Mopti, photographie de Robin Taylor, CC BY 2.0 ; une meule du Dhar Tichitt, photographie de Sylvie Amblard-Pison, CC BY 4.0 ; le cimetière de Koumbi Saleh, photographie de Chloé Capel, CC BY-SA 4.0.",
          "Kanem-Bornou et les cités haoussa : la porte du palais de l'émir à Kano, photographie de Uncle Bash007, CC BY-SA 4.0 ; les vieux murs de Kano, photographie de Anasskoko, CC BY-SA 4.0 ; la porte du palais de Sarkin Kano en 1890, dessin de Monteil, P.-L., domaine public.",
          "La côte swahili : la grande mosquée de Kilwa Kisiwani, photographie de Richard Mortel, CC BY 2.0 ; une porte sculptée de Stone Town à Zanzibar, photographie de Eric Kilby, CC BY-SA 2.0 ; le palais des sultans de Kilwa, photographie de David Stanley, CC BY 2.0.",
          "Les royaumes de la forêt : les plaques de laiton du Bénin au British Museum, photographie de Warofdreams, CC BY-SA 3.0 ; une tête de laiton d'Ifé, photographie de FA2010, domaine public ; l'enceinte royale du roi du Kongo en 1745, dessin de Thomas Astley, domaine public.",
          "La traite atlantique : la porte du château d'Elmina, photographie de Kurt Dundy, CC BY-SA 3.0 ; le château de Cape Coast, photographie de Matti Blume, CC BY-SA 4.0 ; l'île de Gorée, photographie de Focale Emotions, CC BY-SA 4.0.",
          "La conquête coloniale : l'empereur Ménélik II à Adoua, illustration de F. Méaulle, domaine public ; une caricature de la conférence de Berlin de 1884, de François Maréchal, domaine public ; les délégués du Congrès panafricain de 1927, par Unknown author (auteur non identifié), domaine public.",
          "L'apartheid : la cellule de Nelson Mandela sur l'île de Robben, photographie de Paul Mannix, CC BY-SA 2.0 ; Nelson Mandela et Donald Card, photographie de Blossom Index, CC0 ; l'entrée de Soweto, photographie de Nolabob, CC BY-SA 4.0.",
          "L'Afrique d'aujourd'hui : les tours de Lagos Island, photographie de Jamie Tubers, CC BY-SA 4.0 ; le siège de l'Union africaine, photographie de Wang Guansen, domaine public ; une rame du tramway d'Addis-Abeba, photographie de Turtlewong, CC0.",
          "Les royaumes amazighs : le Haut Atlas marocain, photographie de Mounir Neddi, CC BY-SA 4.0 ; la cité romaine de Timgad, photographie de Yelles, CC BY-SA 3.0 ; une femme amazighe de l'Atlas, photographie de Tahirshah999, CC BY-SA 4.0.",
          "Madagascar : l'allée des baobabs, photographie de Cactus0625, CC BY-SA 4.0 ; la colline royale d'Ambohimanga, photographie de Lemurbaby, CC BY-SA 3.0 ; un marché de zébus des hauts plateaux, photographie de JialiangGao, CC BY-SA 4.0.",
          "Les royaumes des Grands Lacs : le lac Victoria vu de la rive ougandaise, photographie de Monica2168, CC BY-SA 4.0 ; les tombeaux des kabakas à Kasubi, photographie de Karl.Mustermann, domaine public ; le lac Tanganyika, photographie de Orrling, CC BY-SA 3.0.",
          "L'Afrique portugaise : la baie de Luanda, photographie de Paulo César Santos, CC0 ; Fort Jesus à Mombasa, photographie de Mutisya Maingi, CC BY-SA 4.0 ; des bateaux au large de l'île de Mozambique, photographie de Stig Nygaard, CC BY 2.0.",
          "L'empire asante : un sanctuaire des bâtiments traditionnels asante, photographie de Joy Agyepong, CC BY-SA 4.0 ; le tissu kente de la région de la Volta, photographie de Warmglow, CC0 ; une rue de Kumasi, photographie de Maven Egote, CC BY-SA 4.0.",
          "Le califat de Sokoto : le palais du sultan de Sokoto, photographie de el-siddeeq lame, CC BY 3.0 ; les anciens remparts de Kano, photographie de Anasskoko, CC BY-SA 4.0 ; la porte de Sukur, photographie de Culture Hero, CC BY-SA 4.0.",
        ],
      },
      {
        heading: "14. Contact",
        paragraphs: [
          "Écrivez à l'adresse de contact ci-dessous pour toute question sur ces conditions.",
        ],
        facts: "contact",
      },
    ],
  },
};

/** Builders a section can ask for through its `facts` marker. */
const FACTS = {
  publisherAndHost: (lang) => [...publisherFacts(lang, { includeDpo: false }), ...hostFacts(lang)],
  contact: (lang) => contactFacts(lang),
};

export default function TermsOfService() {
  const lang = useLang();
  const content = CONTENT[lang] || CONTENT.en;
  const sections = content.sections.map((section) =>
    section.facts ? { ...section, facts: FACTS[section.facts](lang) } : section
  );
  return <LegalPage {...content} sections={sections} />;
}
