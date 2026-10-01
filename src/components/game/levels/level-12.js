/**
 * Medieval Ethiopia: one level of the game, on its own.
 *
 * WRITTEN BY scripts/generate-level-content.mjs. Do not edit by hand. The
 * questions, their references, the study pack and the gallery are read out of
 * gameData.js, content-fr.js, level-study.js and level-images.js, and
 * `npm run verify` regenerates this file and fails when it no longer matches
 * them. Run `npm run level:content` after changing one of those.
 *
 * A lesson opens one level, so this is what it downloads: not the other
 * twenty-five, and not the screens that need every level.
 */
import { Mountain } from "lucide-react";

export default {
  id: 12,
  order: 13,
  era: "medieval",
  from: 1137,
  title: "Medieval Ethiopia",
  subtitle: "Lalibela and the Solomonic dynasty",
  region: "Horn of Africa",
  color: "from-yellow-600 to-red-700",
  icon: Mountain,
  gallery: {
    en: [
      {
        file: "/photos/level-12-1.jpg",
        caption: "The church of Saint George at Lalibela, cut downwards into the rock in the 13th century.",
        credit: "Thomas Fuhrmann · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Thomas Fuhrmann",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Ethiopia_-_sunset_at_Church_of_Saint_George%2C_Lalibela_01.jpg",
      },
      {
        file: "/photos/level-12-2.jpg",
        caption: "Another of the churches of Lalibela, one of eleven hewn from the same rocky ground.",
        credit: "Adam Jones · CC BY-SA 2.0 · Wikimedia Commons",
        author: "Adam Jones",
        licence: "CC BY-SA 2.0",
        source: "https://commons.wikimedia.org/wiki/File:Outside_Bet_Gebriel-Rafael_Rock-Hewn_Church_-_Southeastern_Cluster_-_Lalibela_-_Ethiopia_-_01_(8729946249).jpg",
      },
      {
        file: "/photos/level-12-3.jpg",
        caption: "An Ethiopian prayer book and its leather case, copied by hand in the Ge'ez script.",
        credit: "KarlHeinrich · Public domain · Wikimedia Commons",
        author: "KarlHeinrich",
        licence: "Public domain",
        source: "https://commons.wikimedia.org/wiki/File:%C3%84thiopien_Gebetbuch_mit_Futteral_Linden-Museum_62509.jpg",
      },
    ],
    fr: [
      {
        file: "/photos/level-12-1.jpg",
        caption: "L'église Saint-Georges de Lalibela, taillée vers le bas dans la roche au XIIIe siècle.",
        credit: "Thomas Fuhrmann · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Thomas Fuhrmann",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Ethiopia_-_sunset_at_Church_of_Saint_George%2C_Lalibela_01.jpg",
      },
      {
        file: "/photos/level-12-2.jpg",
        caption: "Une autre des églises de Lalibela, l'une des onze taillées dans le même sol de pierre.",
        credit: "Adam Jones · CC BY-SA 2.0 · Wikimedia Commons",
        author: "Adam Jones",
        licence: "CC BY-SA 2.0",
        source: "https://commons.wikimedia.org/wiki/File:Outside_Bet_Gebriel-Rafael_Rock-Hewn_Church_-_Southeastern_Cluster_-_Lalibela_-_Ethiopia_-_01_(8729946249).jpg",
      },
      {
        file: "/photos/level-12-3.jpg",
        caption: "Un livre de prières éthiopien et son étui de cuir, copié à la main en écriture guèze.",
        credit: "KarlHeinrich · domaine public · Wikimedia Commons",
        author: "KarlHeinrich",
        licence: "domaine public",
        source: "https://commons.wikimedia.org/wiki/File:%C3%84thiopien_Gebetbuch_mit_Futteral_Linden-Museum_62509.jpg",
      },
    ],
  },
  study: {
    en: {
      essay: ["While much of Europe was rebuilding, a Christian kingdom in the Ethiopian highlands was carving churches into solid rock. The walls, the pillars, the roofs and the floors of each church were cut downwards out of one piece of the hillside, so that a visitor looks down on a building that was never raised.", "The Zagwe kings cut the eleven churches of Lalibela, and then the Solomonic dynasty took the throne in 1270 and ruled for more than six centuries. The line claimed descent from Solomon and the queen of Sheba, and its emperors were crowned at Axum, in the old capital of the kingdom that had come before them.", "The highlands traded with the Red Sea through Massawa, and caravans carried coffee, ivory and gold down to the coast. The church owned much of the land and ran the schools where Ge'ez was read and copied, and it kept its own calendar, its own fasts and its own music, which is why the kingdom kept its shape while others around it changed.", "When an army from the sultanate of Adal almost destroyed the kingdom in the 1530s, Ethiopia fought back with the help of a Portuguese expedition and kept its own script, its own church and its own history. In the seventeenth century the capital moved to Gondar, where the emperors built castles and the church rebuilt its schools."],
      timeline: [
        { year: "c. 1200", text: "The Zagwe kings carve the churches of Lalibela out of the rock." },
        { year: "1270", text: "Yekuno Amlak founds the Solomonic dynasty at the expense of the Zagwe." },
        { year: "1520s", text: "Portuguese envoys reach the court and the first firearms arrive." },
        { year: "1529", text: "Ahmad ibn Ibrahim of Adal defeats the Ethiopian army at Shimbra Kure." },
        { year: "1543", text: "The Adalite army is broken at Wayna Daga and the kingdom survives." },
        { year: "c. 1600", text: "The capital moves to Gondar and the kingdom rebuilds its churches." },
      ],
      people: [
        { name: "Lalibela", text: "The Zagwe king whose name the rock churches carry." },
        { name: "Yekuno Amlak", text: "The king who restored the Solomonic line in 1270." },
        {
          name: "Ahmad ibn Ibrahim",
          text: "The Adalite leader whose armies nearly took the highlands.",
        },
        { name: "Galawdewos", text: "The Ethiopian king who won at Wayna Daga in 1543." },
        {
          name: "Zara Yaqob",
          text: "The fifteenth century emperor who reformed the church and its schools.",
        },
      ],
      places: [
        { name: "Lalibela", text: "The town of the eleven churches cut downwards into the rock." },
        { name: "Axum", text: "The old capital where the emperors were crowned." },
        { name: "Massawa", text: "The Red Sea port of the highland trade." },
        { name: "Gondar", text: "The capital from the seventeenth century, with its castles." },
        { name: "Lake Tana", text: "The source of the Blue Nile, and the monasteries on its islands." },
      ],
      glossary: [
        { term: "Zagwe", text: "The dynasty that ruled the highlands before the Solomonic line." },
        {
          term: "Solomonic",
          text: "The dynasty that claimed descent from Solomon and the queen of Sheba.",
        },
        { term: "Ge'ez", text: "The liturgical language and script of the Ethiopian church." },
        { term: "Adal", text: "The Muslim sultanate to the east that fought the highland kingdom." },
        {
          term: "tabot",
          text: "The altar slab of an Ethiopian church, carried in procession at Timkat.",
        },
      ],
    },
    fr: {
      essay: ["Alors qu'une grande partie de l'Europe se reconstruisait, un royaume chrétien des hauts plateaux éthiopiens creusait des églises dans la roche massive. Les murs, les piliers, les toits et les sols de chaque église étaient taillés vers le bas dans un seul morceau de la colline, si bien que le visiteur regarde en contrebas un bâtiment qu'on n'a jamais élevé.", "Les rois zagwé ont taillé les onze églises de Lalibela, puis la dynastie salomonide a pris le trône en 1270 et a régné plus de six siècles. La lignée se disait descendante de Salomon et de la reine de Saba, et ses empereurs étaient couronnés à Axoum, dans l'ancienne capitale du royaume qui l'avait précédée.", "Les hauts plateaux commerçaient avec la mer Rouge par Massawa, et les caravanes descendaient le café, l'ivoire et l'or jusqu'à la côte. L'Église possédait une grande partie des terres et tenait les écoles où l'on lisait et copiait le guèze, et elle gardait son propre calendrier, ses jeûnes et sa musique : c'est pourquoi le royaume a gardé sa forme quand d'autres autour de lui changeaient.", "Quand une armée du sultanat d'Adal a failli détruire le royaume dans les années 1530, l'Éthiopie a résisté avec l'aide d'une expédition portugaise et a gardé son écriture, son Église et son histoire. Au XVIIe siècle, la capitale s'est installée à Gondar, où les empereurs ont bâti des châteaux et l'Église rebâti ses écoles."],
      timeline: [
        { year: "v. 1200", text: "Les rois zagwé taillent dans la roche les églises de Lalibela." },
        { year: "1270", text: "Yekouno Amlak fonde la dynastie salomonide aux dépens des Zagwé." },
        {
          year: "années 1520",
          text: "Des envoyés portugais atteignent la cour et les premières armes à feu arrivent.",
        },
        { year: "1529", text: "Ahmad ibn Ibrahim d'Adal bat l'armée éthiopienne à Shimbra Kouré." },
        { year: "1543", text: "L'armée d'Adal est brisée à Wayna Daga et le royaume survit." },
        { year: "v. 1600", text: "La capitale s'installe à Gondar et le royaume rebâtit ses églises." },
      ],
      people: [
        { name: "Lalibela", text: "Le roi zagwé dont les églises rupestres portent le nom." },
        { name: "Yekouno Amlak", text: "Le roi qui a restauré la lignée salomonide en 1270." },
        {
          name: "Ahmad ibn Ibrahim",
          text: "Le chef d'Adal dont les armées ont failli prendre les hauts plateaux.",
        },
        { name: "Galawdéwos", text: "Le roi éthiopien qui a gagné à Wayna Daga en 1543." },
        {
          name: "Zar'a Ya'eqob",
          text: "L'empereur du XVe siècle qui a réformé l'Église et ses écoles.",
        },
      ],
      places: [
        { name: "Lalibela", text: "La ville des onze églises taillées vers le bas dans la roche." },
        { name: "Axoum", text: "L'ancienne capitale où les empereurs étaient couronnés." },
        { name: "Massawa", text: "Le port de la mer Rouge du commerce des hauts plateaux." },
        { name: "Gondar", text: "La capitale à partir du XVIIe siècle, avec ses châteaux." },
        { name: "Le lac Tana", text: "La source du Nil Bleu et les monastères de ses îles." },
      ],
      glossary: [
        {
          term: "Zagwé",
          text: "La dynastie qui a gouverné les hauts plateaux avant la lignée salomonide.",
        },
        {
          term: "salomonide",
          text: "La dynastie qui se disait descendante de Salomon et de la reine de Saba.",
        },
        { term: "guèze", text: "La langue liturgique et l'écriture de l'Église éthiopienne." },
        {
          term: "Adal",
          text: "Le sultanat musulman de l'est, adversaire du royaume des hauts plateaux.",
        },
        {
          term: "tabot",
          text: "La tablette d'autel d'une église éthiopienne, portée en procession à Timkat.",
        },
      ],
    },
  },
  questions: [
    {
      question: "Which dynasty ruled Ethiopia from 1137 and built the churches of Lalibela?",
      options: ["The Zagwe", "The Solomonic", "The Aksumite", "The Omani"],
      correct: 0,
      fact: "The Zagwe kings ruled from Roha, a town later renamed Lalibela after the most famous of them.",
      source: { label: "Encyclopaedia Britannica, \"Zagwe dynasty\"" },
    },
    {
      question: "How were the eleven churches of Lalibela built?",
      options: ["Carved downwards out of solid rock", "Built with bricks and cement", "Assembled from wood", "Dug as underground tunnels only"],
      correct: 0,
      fact: "Each church was cut from a single block of volcanic rock, so the roof, the walls and the floor all come from the same stone.",
      source: {
        label: "UNESCO World Heritage List, Rock-Hewn Churches, Lalibela",
        url: "https://whc.unesco.org/en/list/18/",
      },
    },
    {
      question: "Which dynasty took power in 1270 and claimed descent from Solomon and the Queen of Sheba?",
      options: ["The Solomonic dynasty", "The Zagwe dynasty", "The Askia dynasty", "The Sayfawa dynasty"],
      correct: 0,
      fact: "The claim to Solomon was written into the Kebra Nagast, the national epic of Ethiopia, and the dynasty lasted until 1974.",
      source: { label: "Encyclopaedia Britannica, \"Solomonic dynasty\"" },
    },
    {
      question: "Which Muslim sultanate, led by Ahmad ibn Ibrahim, almost conquered the Christian kingdom in the 1530s?",
      options: ["Adal", "Kilwa", "Mogadishu", "Kanem"],
      correct: 0,
      fact: "Ahmad ibn Ibrahim was called Gragn, meaning the left handed, and his army fought with firearms brought through the Red Sea trade.",
      source: {
        label: "UNESCO, General History of Africa, volume IV",
        url: "https://www.unesco.org/en/general-history-africa",
      },
    },
    {
      question: "In 1543, with a small Portuguese force, which Ethiopian emperor defeated and killed Ahmad Gragn?",
      options: ["Gelawdewos", "Lalibela", "Fasilides", "Menelik II"],
      correct: 0,
      fact: "The battle of Wayna Daga ended the war, and both Arabic and Portuguese chronicles describe it.",
      source: {
        label: "UNESCO, General History of Africa, volume IV",
        url: "https://www.unesco.org/en/general-history-africa",
      },
    },
    {
      question: "Which emperor made Gondar his capital in 1636 and started its line of castles?",
      options: ["Fasilides", "Gelawdewos", "Tewodros II", "Haile Selassie"],
      correct: 0,
      fact: "The castles of Gondar still stand, a reminder of a court that also produced poetry, painting and church music.",
      source: {
        label: "UNESCO World Heritage List, Fasil Ghebbi, Gondar Region",
        url: "https://whc.unesco.org/en/list/19/",
      },
    },
    {
      question: "In which script, still used today, is a large part of Ethiopian literature written?",
      options: ["Ge'ez", "Arabic", "Latin", "Coptic"],
      correct: 0,
      fact: "The Ge'ez script has been used in Ethiopia for over two thousand years, and each character stands for a syllable rather than a single sound.",
      source: { label: "Encyclopaedia Britannica, \"Ge'ez language\"" },
    },
    {
      question: "Which people moved into the Ethiopian highlands from the south in the 16th century and became a large part of the empire?",
      options: ["The Oromo", "The Somali", "The Nubians", "The Zulu"],
      correct: 0,
      fact: "The Oromo expansion followed the wars of the 16th century, and Oromo is today the most widely spoken first language of Ethiopia.",
      source: { label: "Encyclopaedia Britannica, \"Oromo\"" },
    },
    {
      question: "Which emperor, reigning from 1855 to 1868, tried to reunite and modernise Ethiopia?",
      options: ["Tewodros II", "Fasilides", "Menelik II", "Gelawdewos"],
      correct: 0,
      fact: "Tewodros II ended the era of princes and tried to build a national army, and he died at Magdala rather than surrender to a British expedition.",
      source: { label: "Encyclopaedia Britannica, \"Tewodros II\"" },
    },
    {
      question: "Which language, written in the Ge'ez script, is the working language of Ethiopia?",
      options: ["Amharic", "Oromo", "Tigrinya", "Somali"],
      correct: 0,
      fact: "Amharic is written with the Ge'ez script, whose characters stand for syllables, and it is one of the most widely spoken languages of the Horn.",
      source: { label: "Encyclopaedia Britannica, \"Amharic language\"" },
    },
    {
      question: "In which lake does the Blue Nile rise, in the Ethiopian highlands?",
      options: ["Lake Tana", "Lake Turkana", "Lake Chad", "Lake Victoria"],
      correct: 0,
      fact: "Lake Tana is the source of the Blue Nile, and the monasteries of its islands kept manuscripts that record a thousand years of Ethiopian history.",
      source: { label: "Encyclopaedia Britannica, \"Blue Nile River\"" },
    },
    {
      question: "Which Muslim sultanate of the Horn of Africa fought the Christian kingdom in the 14th century, before Adal?",
      options: ["Ifat", "Kanem", "Kilwa", "Mogadishu"],
      correct: 0,
      fact: "The sultanate of Ifat controlled the trade routes between the highlands and the Red Sea, and its wars with Ethiopia lasted for decades.",
      source: { label: "Encyclopaedia Britannica, \"Ifat\"" },
    },
    {
      question: "Which Red Sea port was the main gate of Ethiopia to Arabia and the wider world?",
      options: ["Massawa", "Mombasa", "Sofala", "Ouidah"],
      correct: 0,
      fact: "Caravans carried ivory, gold and coffee down to Massawa, and cloth, salt and books came back the same way.",
      source: { label: "Encyclopaedia Britannica, \"Massawa\"" },
    },
    {
      question: "Which language of northern Ethiopia, written in the Ge'ez script, is spoken in Tigray?",
      options: ["Tigrinya", "Oromo", "Somali", "Amharic"],
      correct: 0,
      fact: "Tigrinya is the everyday language of Tigray and of part of Eritrea, and it shares the old syllabic script of the kingdom.",
      source: { label: "Encyclopaedia Britannica, \"Tigrinya language\"" },
    },
    {
      question: "Which emperor founded the Solomonic dynasty in 1270?",
      options: ["Yekuno Amlak", "Lalibela", "Fasilides", "Gelawdewos"],
      correct: 0,
      fact: "Yekuno Amlak ended the rule of the Zagwe and claimed descent from Solomon and the Queen of Sheba, a claim his line kept for centuries.",
      source: { label: "Encyclopaedia Britannica, \"Ethiopia\"" },
    },
    {
      question: "Which Portuguese priest travelled to Ethiopia in the 1520s and wrote an account of its court?",
      options: ["Francisco Alvares", "Vasco da Gama", "Pedro da Covilha", "Gaspar Correa"],
      correct: 0,
      fact: "Alvares spent six years in Ethiopia and described the churches, the king's tents and the way the court moved with the army.",
      source: { label: "Encyclopaedia Britannica, \"Francisco Alvares\"" },
    },
    {
      question: "Which fortress of the emperor Tewodros II was stormed by a British expedition in 1868?",
      options: ["Magdala", "Adwa", "Gondar", "Lalibela"],
      correct: 0,
      fact: "Tewodros took his own life at Magdala rather than be captured, and the expedition carried away manuscripts and a golden crown.",
      source: { label: "Encyclopaedia Britannica, \"Tewodros II\"" },
    },
    {
      question: "Which Ethiopian emperor was reigning when Ahmad Gragn invaded the highlands in the 1520s?",
      options: ["Lebna Dengel", "Gelawdewos", "Fasilides", "Yekuno Amlak"],
      correct: 0,
      fact: "Lebna Dengel fought the sultanate of Adal for years and even asked Portugal for help, and his son Gelawdewos won the war back.",
      source: { label: "Encyclopaedia Britannica, \"Ethiopia\"" },
    },
    {
      question: "Which walled city of eastern Ethiopia, capital of the sultanate of Adal, is famous for its mosques and its books?",
      options: ["Harar", "Massawa", "Gondar", "Soba"],
      correct: 0,
      fact: "Harar keeps a whole library of manuscripts and a wall with five gates, and its old town is one of the holy places of Islam in the Horn.",
      source: { label: "Encyclopaedia Britannica, \"Harar\"" },
    },
    {
      question: "Which monastery, founded by Saint Takla Haymanot in the 13th century, is the greatest in Ethiopia?",
      options: ["Debre Libanos", "Debre Damo", "Magdala", "Lalibela"],
      correct: 0,
      fact: "Debre Libanos grew into the head of the Ethiopian monasteries, and its abbots crowned and advised emperors for centuries.",
      source: {
        label: "UNESCO, General History of Africa, volume III",
        url: "https://www.unesco.org/en/general-history-africa",
      },
    },
    {
      question: "Which Ge'ez text, the epic of the Solomonic kings, tells of the Queen of Sheba and the Ark of the Covenant?",
      options: ["The Kebra Nagast", "The Book of the Dead", "The Periplus", "The Tarikh al-Sudan"],
      correct: 0,
      fact: "The Kebra Nagast was written down in the 14th century, and it gave the dynasty its claim to the throne of Solomon.",
      source: { label: "Encyclopaedia Britannica, \"Kebra Nagast\"" },
    },
  ],
  fr: {
    title: "L'Éthiopie médiévale",
    subtitle: "Lalibela et la dynastie salomonide",
    region: "Corne de l'Afrique",
    questions: [
      {
        question: "Quelle dynastie a régné sur l'Éthiopie à partir de 1137 et fait bâtir les églises de Lalibela ?",
        options: ["Les Zagwé", "Les Salomonides", "Les Aksoumites", "Les Omanais"],
        fact: "Les rois zagwé régnaient depuis Roha, une ville rebaptisée Lalibela en l'honneur du plus célèbre d'entre eux.",
        source: "Encyclopaedia Britannica, notice « Zagwe dynasty »",
      },
      {
        question: "Comment les onze églises de Lalibela ont-elles été construites ?",
        options: ["Creusées vers le bas dans la roche massive", "Bâties en briques et en ciment", "Assemblées en bois", "Creusées uniquement en tunnels souterrains"],
        fact: "Chaque église a été taillée dans un seul bloc de roche volcanique : le toit, les murs et le sol viennent donc de la même pierre.",
        source: "Liste du patrimoine mondial de l'UNESCO, Eglises creusées dans le roc, Lalibela",
      },
      {
        question: "Quelle dynastie a pris le pouvoir en 1270 en se réclamant de Salomon et de la reine de Saba ?",
        options: ["La dynastie salomonide", "La dynastie zagwé", "La dynastie askia", "La dynastie sayfawa"],
        fact: "Cette filiation salomonienne a été inscrite dans le Kebra Nagast, l'épopée nationale de l'Éthiopie, et la dynastie a duré jusqu'en 1974.",
        source: "Encyclopaedia Britannica, notice « Solomonic dynasty »",
      },
      {
        question: "Quel sultanat musulman, mené par Ahmed ibn Ibrahim, a failli conquérir le royaume chrétien dans les années 1530 ?",
        options: ["Adal", "Kilwa", "Mogadiscio", "Kanem"],
        fact: "Ahmed ibn Ibrahim était surnommé Gragn, le gaucher, et son armée combattait avec des armes à feu venues du commerce de la mer Rouge.",
        source: "UNESCO, Histoire générale de l'Afrique, volume IV",
      },
      {
        question: "En 1543, avec un petit contingent portugais, quel empereur éthiopien a vaincu et tué Ahmed Gragn ?",
        options: ["Gelawdewos", "Lalibela", "Fasilides", "Ménélik II"],
        fact: "La bataille de Wayna Daga a mis fin à la guerre, et les chroniques arabes comme portugaises la décrivent.",
        source: "UNESCO, Histoire générale de l'Afrique, volume IV",
      },
      {
        question: "Quel empereur a fait de Gondar sa capitale en 1636 et lancé sa série de châteaux ?",
        options: ["Fasilides", "Gelawdewos", "Tewodros II", "Haïlé Sélassié"],
        fact: "Les châteaux de Gondar sont toujours debout, souvenir d'une cour qui produisait aussi poésie, peinture et musique religieuse.",
        source: "Liste du patrimoine mondial de l'UNESCO, Fasil Ghebbi, région de Gondar",
      },
      {
        question: "Dans quelle écriture, encore utilisée aujourd'hui, est rédigée une grande partie de la littérature éthiopienne ?",
        options: ["Le guèze", "L'arabe", "Le latin", "Le copte"],
        fact: "L'écriture guèze est utilisée en Éthiopie depuis plus de deux mille ans, et chaque caractère note une syllabe plutôt qu'un son isolé.",
        source: "Encyclopaedia Britannica, notice « Ge'ez language »",
      },
      {
        question: "Quel peuple est arrivé du sud dans les hauts plateaux éthiopiens au XVIe siècle et est devenu une grande partie de l'empire ?",
        options: ["Les Oromos", "Les Somaliens", "Les Nubiens", "Les Zoulous"],
        fact: "L'expansion oromo a suivi les guerres du XVIe siècle, et l'oromo est aujourd'hui la première langue maternelle la plus parlée d'Éthiopie.",
        source: "Encyclopaedia Britannica, notice « Oromo »",
      },
      {
        question: "Quel empereur, régnant de 1855 à 1868, a tenté de réunifier et de moderniser l'Éthiopie ?",
        options: ["Téwodros II", "Fasilidès", "Ménélik II", "Gelawdéwos"],
        fact: "Téwodros II a mis fin à l'ère des princes et tenté de bâtir une armée nationale, et il est mort à Magdala plutôt que de se rendre à l'expédition britannique.",
        source: "Encyclopaedia Britannica, notice « Tewodros II »",
      },
      {
        question: "Quelle langue, écrite en caractères guèze, est la langue de travail de l'Éthiopie ?",
        options: ["L'amharique", "L'oromo", "Le tigrinya", "Le somali"],
        fact: "L'amharique s'écrit avec l'écriture guèze, dont chaque caractère note une syllabe, et il est l'une des langues les plus parlées de la Corne.",
        source: "Encyclopaedia Britannica, notice « Amharic language »",
      },
      {
        question: "Dans quel lac le Nil bleu prend-il sa source, sur les hauts plateaux éthiopiens ?",
        options: ["Le lac Tana", "Le lac Turkana", "Le lac Tchad", "Le lac Victoria"],
        fact: "Le lac Tana est la source du Nil bleu, et les monastères de ses îles ont conservé des manuscrits qui racontent mille ans d'histoire éthiopienne.",
        source: "Encyclopaedia Britannica, notice « Blue Nile River »",
      },
      {
        question: "Quel sultanat musulman de la Corne de l'Afrique a combattu le royaume chrétien au XIVe siècle, avant l'Adal ?",
        options: ["Ifat", "Le Kanem", "Kilwa", "Mogadiscio"],
        fact: "Le sultanat d'Ifat contrôlait les routes commerciales entre les hauts plateaux et la mer Rouge, et ses guerres avec l'Éthiopie ont duré des décennies.",
        source: "Encyclopaedia Britannica, notice « Ifat »",
      },
      {
        question: "Quel port de la mer Rouge était la principale porte de l'Éthiopie vers l'Arabie et le reste du monde ?",
        options: ["Massawa", "Mombasa", "Sofala", "Ouidah"],
        fact: "Les caravanes descendaient l'ivoire, l'or et le café jusqu'à Massawa, et remontaient par le même chemin tissus, sel et livres.",
        source: "Encyclopaedia Britannica, notice « Massawa »",
      },
      {
        question: "Quelle langue du nord de l'Éthiopie, écrite en guèze, est parlée au Tigré ?",
        options: ["Le tigrinya", "L'oromo", "Le somali", "L'amharique"],
        fact: "Le tigrinya est la langue quotidienne du Tigré et d'une partie de l'Érythrée, et il partage l'ancienne écriture syllabique du royaume.",
        source: "Encyclopaedia Britannica, notice « Tigrinya language »",
      },
      {
        question: "Quel empereur a fondé la dynastie salomonienne en 1270 ?",
        options: ["Yekouno Amlak", "Lalibela", "Fasilidès", "Guelawdéwos"],
        fact: "Yekouno Amlak a mis fin au règne des Zagwé et revendiquait une descendance de Salomon et de la reine de Saba, une prétention que sa lignée a gardée pendant des siècles.",
        source: "Encyclopaedia Britannica, notice « Ethiopia »",
      },
      {
        question: "Quel prêtre portugais a voyagé en Éthiopie dans les années 1520 et écrit un récit de sa cour ?",
        options: ["Francisco Alvares", "Vasco de Gama", "Pedro da Covilha", "Gaspar Correa"],
        fact: "Alvares a passé six ans en Éthiopie et a décrit les églises, les tentes du roi et la façon dont la cour se déplaçait avec l'armée.",
        source: "Encyclopaedia Britannica, notice « Francisco Alvares »",
      },
      {
        question: "Quelle forteresse de l'empereur Tewodros II a été prise d'assaut par une expédition britannique en 1868 ?",
        options: ["Magdala", "Adoua", "Gondar", "Lalibela"],
        fact: "Tewodros s'est donné la mort à Magdala plutôt que d'être capturé, et l'expédition a emporté des manuscrits et une couronne d'or.",
        source: "Encyclopaedia Britannica, notice « Tewodros II »",
      },
      {
        question: "Quel empereur éthiopien régnait quand Ahmad Gragn a envahi les hauts plateaux dans les années 1520 ?",
        options: ["Lebna Dengel", "Guelawdéwos", "Fasilidès", "Yekouno Amlak"],
        fact: "Lebna Dengel a combattu le sultanat d'Adal pendant des années et a même demandé l'aide du Portugal, et son fils Guelawdéwos a reconquis le pays.",
        source: "Encyclopaedia Britannica, notice « Ethiopia »",
      },
      {
        question: "Quelle ville fortifiée de l'est de l'Éthiopie, capitale du sultanat d'Adal, est célèbre pour ses mosquées et ses livres ?",
        options: ["Harar", "Massawa", "Gondar", "Soba"],
        fact: "Harar garde toute une bibliothèque de manuscrits et une muraille à cinq portes, et sa vieille ville est l'un des lieux saints de l'islam dans la Corne.",
        source: "Encyclopaedia Britannica, notice « Harar »",
      },
      {
        question: "Quel monastère, fondé par saint Takla Haymanot au XIIIe siècle, est le plus grand d'Éthiopie ?",
        options: ["Debre Libanos", "Debre Damo", "Magdala", "Lalibela"],
        fact: "Debre Libanos est devenu la tête des monastères éthiopiens, et ses abbés ont couronné et conseillé les empereurs pendant des siècles.",
        source: "UNESCO, Histoire générale de l'Afrique, volume III",
      },
      {
        question: "Quel texte en guèze, épopée des rois salomoniens, raconte la reine de Saba et l'Arche d'alliance ?",
        options: ["Le Kebra Nagast", "Le Livre des morts", "Le Périple", "Le Tarikh al-Soudan"],
        fact: "Le Kebra Nagast a été mis par écrit au XIVe siècle, et il a donné à la dynastie sa prétention au trône de Salomon.",
        source: "Encyclopaedia Britannica, notice « Kebra Nagast »",
      },
    ],
  },
};
