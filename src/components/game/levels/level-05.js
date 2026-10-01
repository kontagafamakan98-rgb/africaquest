/**
 * Kingdom of Axum: one level of the game, on its own.
 *
 * WRITTEN BY scripts/generate-level-content.mjs. Do not edit by hand. The
 * questions, their references, the study pack and the gallery are read out of
 * gameData.js, content-fr.js, level-study.js and level-images.js, and
 * `npm run verify` regenerates this file and fails when it no longer matches
 * them. Run `npm run level:content` after changing one of those.
 *
 * A lesson opens one level, so this is what it downloads: not the other
 * nineteen, and not the screens that need every level.
 */
import { Church } from "lucide-react";

export default {
  id: 5,
  order: 7,
  era: "ancient",
  from: 100,
  title: "Kingdom of Axum",
  subtitle: "Ethiopia's Ancient Power",
  region: "East Africa",
  color: "from-red-500 to-orange-600",
  icon: Church,
  gallery: {
    en: [
      {
        file: "/photos/level-5-1.jpg",
        caption: "The Rome Stele, one of the obelisks of Axum, carved from a single block of granite.",
        credit: "Ondřej Žváček · CC BY 2.5 · Wikimedia Commons",
        author: "Ondřej Žváček",
        licence: "CC BY 2.5",
        source: "https://commons.wikimedia.org/wiki/File:Rome_Stele.jpg",
      },
      {
        file: "/photos/level-5-2.jpg",
        caption: "The ruins of the oldest church at St Mary of Zion, where Ethiopian Christianity began.",
        credit: "Sailko · CC BY 3.0 · Wikimedia Commons",
        author: "Sailko",
        licence: "CC BY 3.0",
        source: "https://commons.wikimedia.org/wiki/File:Aksum%2C_resti_della_chiesa_pi%C3%B9_antica_di_re_ezana_presso_santa_maria_di_zion%2C_00.jpg",
      },
      {
        file: "/photos/level-5-3.jpg",
        caption: "A gold coin of King Ezana, the first Aksumite ruler to strike the cross.",
        credit: "Ismoon · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Ismoon",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Ezana_gold_coin_with_cross._British_Museum._1921%2C0316.1.jpg",
      },
    ],
    fr: [
      {
        file: "/photos/level-5-1.jpg",
        caption: "La stèle de Rome, l'un des obélisques d'Axoum, taillée dans un seul bloc de granit.",
        credit: "Ondřej Žváček · CC BY 2.5 · Wikimedia Commons",
        author: "Ondřej Žváček",
        licence: "CC BY 2.5",
        source: "https://commons.wikimedia.org/wiki/File:Rome_Stele.jpg",
      },
      {
        file: "/photos/level-5-2.jpg",
        caption: "Les ruines de la plus ancienne église de Sainte-Marie-de-Sion, où naquit le christianisme éthiopien.",
        credit: "Sailko · CC BY 3.0 · Wikimedia Commons",
        author: "Sailko",
        licence: "CC BY 3.0",
        source: "https://commons.wikimedia.org/wiki/File:Aksum%2C_resti_della_chiesa_pi%C3%B9_antica_di_re_ezana_presso_santa_maria_di_zion%2C_00.jpg",
      },
      {
        file: "/photos/level-5-3.jpg",
        caption: "Une pièce d'or du roi Ezana, premier souverain d'Axoum à frapper la croix.",
        credit: "Ismoon · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Ismoon",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Ezana_gold_coin_with_cross._British_Museum._1921%2C0316.1.jpg",
      },
    ],
  },
  study: {
    en: {
      essay: ["In the highlands of what are now Ethiopia and Eritrea, the kingdom of Axum grew rich on the trade of the Red Sea. From its port of Adulis it sent ivory, gold, incense and hides to Rome, India and Arabia, and brought back cloth, glass, wine and metalwork. A handbook written for sailors in the first century lists exactly what was bought and sold there.", "The kingdom minted its own coins in gold, silver and bronze, which almost no other state outside Rome and Persia did. Its kings raised obelisks cut from single blocks of stone, the tallest ever attempted by human hands, and their tombs lie beneath the field of stelae. The script of its inscriptions grew into the Ge'ez writing that Ethiopia still uses.", "In the fourth century King Ezana adopted Christianity, making Axum one of the first states in the world to do so. Frumentius, a Syrian who had been shipwrecked on the coast, became the first bishop, and the church he founded kept its own liturgy and its own language through every century that followed.", "For a few decades in the sixth century Axum ruled part of southern Arabia across the water. But when Islam spread along the Red Sea in the seventh century, the trade that had made the kingdom rich slipped away from Adulis, and the centre of power moved south into the highlands, where the Christian kingdom went on for another thousand years."],
      timeline: [
        {
          year: "c. 100 AD",
          text: "The Periplus of the Erythraean Sea describes Adulis and the goods traded there.",
        },
        {
          year: "c. 270",
          text: "Axum strikes coins of gold, silver and bronze in the name of its own kings.",
        },
        { year: "c. 330", text: "King Ezana adopts Christianity and the kingdom is baptised." },
        { year: "c. 520", text: "Kaleb of Axum crosses the Red Sea and rules part of southern Arabia." },
        { year: "c. 640", text: "The spread of Islam turns the Red Sea trade away from Adulis." },
      ],
      people: [
        { name: "Ezana", text: "The king who made Christianity the religion of the kingdom of Axum." },
        {
          name: "Frumentius",
          text: "The Syrian teacher who became the first bishop of the Ethiopian church.",
        },
        { name: "Kaleb", text: "The Axumite king whose armies crossed the sea to Himyar." },
        {
          name: "Ella Amida",
          text: "The king whose coins carry the first Christian symbols struck in the kingdom.",
        },
      ],
      places: [
        { name: "Adulis", text: "The Red Sea port where the goods of the interior met the ships." },
        { name: "Axum", text: "The capital of the kingdom, with its obelisks and its royal tombs." },
        { name: "Yeha", text: "The older temple town of the highlands, a capital before Axum." },
        { name: "Himyar", text: "The kingdom in southern Arabia ruled by Axum for a few decades." },
      ],
      glossary: [
        {
          term: "Ge'ez",
          text: "The written language of the kingdom, still the language of the Ethiopian liturgy.",
        },
        {
          term: "obelisk",
          text: "A tall pillar cut from a single block of stone and raised as a royal monument.",
        },
        {
          term: "incense",
          text: "The fragrant resin, above all frankincense, that the highlands traded to the sea.",
        },
        { term: "coinage", text: "The striking of metal money in the name of the king." },
        {
          term: "Periplus",
          text: "The sailors' handbook that lists the ports and the goods of the Red Sea route.",
        },
      ],
    },
    fr: {
      essay: ["Dans les hauts plateaux de l'actuelle Éthiopie et de l'Érythrée, le royaume d'Axoum s'est enrichi par le commerce de la mer Rouge. De son port d'Adoulis, il envoyait ivoire, or, encens et peaux vers Rome, l'Inde et l'Arabie, et rapportait tissus, verre, vin et ouvrages de métal. Un manuel écrit pour les marins au Ier siècle énumère précisément ce qu'on y achetait et y vendait.", "Le royaume frappait sa propre monnaie, en or, en argent et en bronze, ce que presque aucun autre État hors de Rome et de Perse ne faisait. Ses rois dressaient des obélisques taillés dans un seul bloc de pierre, les plus hauts jamais tentés par des mains humaines, et leurs tombeaux s'étendent sous le champ de stèles. L'écriture de ses inscriptions est devenue le guèze, que l'Éthiopie utilise encore.", "Au IVe siècle, le roi Ézana a adopté le christianisme, faisant d'Axoum l'un des premiers États du monde à le faire. Frumentius, un Syrien naufragé sur la côte, est devenu le premier évêque, et l'Église qu'il a fondée a gardé sa liturgie et sa langue à travers tous les siècles suivants.", "Pendant quelques décennies du VIe siècle, Axoum a gouverné une partie du sud de l'Arabie, de l'autre côté de l'eau. Mais quand l'islam s'est répandu le long de la mer Rouge au VIIe siècle, le commerce qui avait fait la richesse du royaume a glissé loin d'Adoulis, et le centre du pouvoir s'est déplacé vers le sud, dans les hauts plateaux, où le royaume chrétien a duré mille ans de plus."],
      timeline: [
        {
          year: "v. 100 apr. J.-C.",
          text: "Le Périple de la mer Érythrée décrit Adoulis et les marchandises qu'on y échange.",
        },
        {
          year: "v. 270",
          text: "Axoum frappe des monnaies d'or, d'argent et de bronze au nom de ses propres rois.",
        },
        { year: "v. 330", text: "Le roi Ézana adopte le christianisme et le royaume est baptisé." },
        {
          year: "v. 520",
          text: "Kaléb d'Axoum traverse la mer Rouge et gouverne une partie du sud de l'Arabie.",
        },
        {
          year: "v. 640",
          text: "L'expansion de l'islam détourne d'Adoulis le commerce de la mer Rouge.",
        },
      ],
      people: [
        { name: "Ézana", text: "Le roi qui a fait du christianisme la religion du royaume d'Axoum." },
        {
          name: "Frumentius",
          text: "Le maître syrien devenu le premier évêque de l'Église éthiopienne.",
        },
        { name: "Kaléb", text: "Le roi axoumite dont les armées ont traversé la mer jusqu'à Himyar." },
        {
          name: "Ella Amida",
          text: "Le roi dont les monnaies portent les premiers symboles chrétiens frappés dans le royaume.",
        },
      ],
      places: [
        {
          name: "Adoulis",
          text: "Le port de la mer Rouge où les marchandises de l'intérieur rencontraient les navires.",
        },
        { name: "Axoum", text: "La capitale du royaume, avec ses obélisques et ses tombeaux royaux." },
        {
          name: "Yeha",
          text: "La plus ancienne ville de temples des hauts plateaux, une capitale avant Axoum.",
        },
        {
          name: "Himyar",
          text: "Le royaume du sud de l'Arabie gouverné par Axoum pendant quelques décennies.",
        },
      ],
      glossary: [
        { term: "guèze", text: "La langue écrite du royaume, encore celle de la liturgie éthiopienne." },
        {
          term: "obélisque",
          text: "Un haut pilier taillé dans un seul bloc de pierre et dressé comme monument royal.",
        },
        {
          term: "encens",
          text: "La résine odorante, surtout l'oliban, que les hauts plateaux vendaient à la mer.",
        },
        { term: "monnayage", text: "La frappe de la monnaie de métal au nom du roi." },
        {
          term: "Périple",
          text: "Le manuel des marins qui énumère les ports et les marchandises de la route de la mer Rouge.",
        },
      ],
    },
  },
  questions: [
    {
      question: "Where was the Kingdom of Axum located?",
      options: ["West Africa", "Modern-day Ethiopia and Eritrea", "South Africa", "North Africa"],
      correct: 1,
      fact: "Axum was one of the most powerful kingdoms in the ancient world!",
      source: { label: "Encyclopaedia Britannica, \"Aksum\"" },
    },
    {
      question: "What tall stone monuments did Axum build?",
      options: ["Pyramids", "Obelisks (Stelae)", "Castles", "Bridges"],
      correct: 1,
      fact: "The tallest Axumite stela was 33 meters tall, taller than most buildings!",
      source: { label: "UNESCO World Heritage List, Aksum", url: "https://whc.unesco.org/en/list/15/" },
    },
    {
      question: "Axum was one of the first kingdoms to adopt which religion?",
      options: ["Islam", "Buddhism", "Christianity", "Hinduism"],
      correct: 2,
      fact: "Axum became Christian in the 4th century, making it one of the first Christian nations!",
      source: { label: "Encyclopaedia Britannica, \"Ezana\"" },
    },
    {
      question: "What important trade item did Axum export?",
      options: ["Diamonds", "Ivory", "Silver", "Rubber"],
      correct: 1,
      fact: "Axum traded ivory, gold, and spices with Rome, India, and Arabia!",
      source: { label: "Encyclopaedia Britannica, \"Aksum\"" },
    },
    {
      question: "Axum created its own system of what?",
      options: ["Coins", "Computers", "Cars", "Telephones"],
      correct: 0,
      fact: "Axum was one of the first African kingdoms to mint its own coins!",
      source: { label: "Encyclopaedia Britannica, \"Aksum\"" },
    },
    {
      question: "The Axumite king who converted to Christianity in the 4th century was:",
      options: ["Ezana", "Kaleb", "Gadarat", "Zoscales"],
      correct: 0,
      fact: "King Ezana of Axum converted to Christianity around 330 AD and inscribed the cross on Axumite coins!",
      source: { label: "Encyclopaedia Britannica, \"Ezana\"" },
    },
    {
      question: "Axum's port city, essential for its Indian Ocean trade, was called:",
      options: ["Mogadishu", "Adulis", "Zanzibar", "Mombasa"],
      correct: 1,
      fact: "Adulis on the Red Sea was Axum's main port, making it a hub connecting Africa, Arabia, India, and the Roman Empire!",
      source: { label: "Encyclopaedia Britannica, \"Aksum\"" },
    },
    {
      question: "The Axumites are traditionally believed to have been the guardians of which famous religious relic?",
      options: ["The Holy Grail", "The Ark of the Covenant", "The Shroud of Turin", "The True Cross"],
      correct: 1,
      fact: "Ethiopian tradition holds that the Ark of the Covenant was brought to Axum by Menelik I, son of King Solomon and the Queen of Sheba!",
      source: { label: "UNESCO World Heritage List, Aksum", url: "https://whc.unesco.org/en/list/15/" },
    },
    {
      question: "Which ancient script used exclusively in Ethiopia and Eritrea was developed from the Axumite writing system?",
      options: ["Arabic", "Ge'ez (Ethiopic)", "Coptic", "Amharic alphabet"],
      correct: 1,
      fact: "Ge'ez is one of the oldest continuously used writing systems in the world, still used today in Ethiopian Orthodox Church liturgy!",
      source: { label: "Encyclopaedia Britannica, \"Ge'ez language\"" },
    },
    {
      question: "Axum's King Kaleb invaded the Arabian Peninsula in 525 AD to defend which persecuted group?",
      options: ["Muslims", "Jewish traders", "Christians in Yemen", "Buddhist monks"],
      correct: 2,
      fact: "King Kaleb crossed the Red Sea to defeat the Yemeni king Dhu Nuwas who was massacring Christians, an extraordinary projection of African military power!",
      source: { label: "Encyclopaedia Britannica, \"Aksum\"" },
    },
    {
      question: "The tallest and most famous Axumite stelae were carved from single blocks of what stone?",
      options: ["Granite", "Marble", "Limestone", "Basalt"],
      correct: 0,
      fact: "The Obelisk of Axum stands about 24 metres tall and was carved from a single block of granite, while a larger 33 metre stela lies broken on the ground!",
      source: { label: "UNESCO World Heritage List, Aksum", url: "https://whc.unesco.org/en/list/15/" },
    },
    {
      question: "What title did the kings of Axum use, meaning 'king' in Ge'ez?",
      options: ["Mansa", "Negus", "Sultan", "Pharaoh"],
      correct: 1,
      fact: "The Axumite kings were called Negus, and the expanded title 'Negusa Nagast' meant king of kings!",
      source: { label: "Encyclopaedia Britannica, \"Aksum\"" },
    },
    {
      question: "The rise of which religion in Arabia in the 7th century helped weaken Axum's control of Red Sea trade?",
      options: ["Islam", "Buddhism", "Hinduism", "Judaism"],
      correct: 0,
      fact: "The spread of Islam after the 7th century shifted trade networks across the Red Sea, and Axum's power declined as a result!",
      source: { label: "Encyclopaedia Britannica, \"Aksum\"" },
    },
    {
      question: "Whose kingdom did Axum defeat in the 4th century to open the Nile trade route?",
      options: ["Kush", "Rome", "Persia", "Kanem"],
      correct: 0,
      fact: "The Axumite army destroyed the kingdom of Kush at Meroe around 350, an event recorded on an inscription at Aksum.",
      source: { label: "Encyclopaedia Britannica, \"Aksum\"" },
    },
    {
      question: "From which script, used in southern Arabia, did the Ge'ez script of Axum develop?",
      options: ["The South Arabian script", "Latin", "Coptic", "Greek"],
      correct: 0,
      fact: "Ge'ez grew out of the South Arabian writing of the traders who crossed the Red Sea, and it is still read in Ethiopian churches today.",
      source: { label: "Encyclopaedia Britannica, \"Ge'ez language\"" },
    },
    {
      question: "Which Greek handbook of the first century AD describes the trade of Adulis and the Red Sea?",
      options: ["The Periplus of the Erythraean Sea", "The Book of the Dead", "The Tarikh al-Sudan", "The Kebra Nagast"],
      correct: 0,
      fact: "The Periplus was written for merchants, and its list of what Adulis sold and bought is the earliest account of the trade of Axum.",
      source: { label: "Encyclopaedia Britannica, \"Periplus of the Erythraean Sea\"" },
    },
    {
      question: "Which Christian teacher, later a bishop, is credited with bringing the new faith to the court of Axum?",
      options: ["Frumentius", "Athanasius", "Origen", "Eusebius"],
      correct: 0,
      fact: "Frumentius was a Syrian who had been shipwrecked on the coast, and the Ethiopian church still remembers him as its first bishop.",
      source: { label: "Encyclopaedia Britannica, \"Ethiopia\"" },
    },
    {
      question: "Which obelisk of Axum, taken to Rome in 1937, was returned to Ethiopia in 2005?",
      options: ["The Obelisk of Axum", "The Lateran Obelisk", "The Obelisk of Theodosius", "The Luxor Obelisk"],
      correct: 0,
      fact: "Italian troops carried the stele away in pieces and it stood in Rome for nearly seventy years before it was flown back and raised again.",
      source: { label: "UNESCO World Heritage List, Aksum", url: "https://whc.unesco.org/en/list/15/" },
    },
    {
      question: "Which kingdom of southern Arabia, across the Red Sea, did Axum rule in the 6th century?",
      options: ["Himyar", "Saba", "Nabataea", "Punt"],
      correct: 0,
      fact: "Axum held Himyar for a few decades, and the inscriptions its kings left in Yemen are still read today.",
      source: { label: "Encyclopaedia Britannica, \"Himyar\"" },
    },
    {
      question: "Which resin, burned as incense and carried by the ships of Adulis, came from the highlands of Axum?",
      options: ["Frankincense", "Amber", "Camphor", "Sandalwood"],
      correct: 0,
      fact: "Frankincense trees grow on the dry slopes of the Horn, and the incense they gave was worth as much as the ivory of the interior.",
      source: { label: "Encyclopaedia Britannica, \"frankincense\"" },
    },
    {
      question: "Which tiny grain, native to the Ethiopian highlands, is used to make the flat bread injera?",
      options: ["Teff", "Millet", "Sorghum", "Barley"],
      correct: 0,
      fact: "Teff was first grown in the Ethiopian highlands, and it makes a flour that ferments into the spongy injera eaten with almost every meal.",
      source: { label: "Encyclopaedia Britannica, \"Ethiopia\"" },
    },
  ],
  fr: {
    title: "Royaume d'Axoum",
    subtitle: "La puissance antique d'Éthiopie",
    region: "Afrique de l'Est",
    questions: [
      {
        question: "Où se trouvait le royaume d'Axoum ?",
        options: ["En Afrique de l'Ouest", "Dans l'actuelle Éthiopie et en Érythrée", "En Afrique du Sud", "En Afrique du Nord"],
        fact: "Axoum était l'un des royaumes les plus puissants du monde antique !",
        source: "Encyclopaedia Britannica, notice « Aksum »",
      },
      {
        question: "Quels hauts monuments de pierre les Axoumites ont-ils érigés ?",
        options: ["Des pyramides", "Des obélisques, appelés stèles", "Des châteaux", "Des ponts"],
        fact: "La plus haute stèle d'Axoum mesurait 33 mètres, plus haut que la plupart des bâtiments !",
        source: "Liste du patrimoine mondial de l'UNESCO, Aksoum",
      },
      {
        question: "Quelle religion le royaume d'Axoum a-t-il été l'un des premiers au monde à adopter ?",
        options: ["L'islam", "Le bouddhisme", "Le christianisme", "L'hindouisme"],
        fact: "Axoum est devenu chrétien au IVe siècle, ce qui en fait l'une des premières nations chrétiennes !",
        source: "Encyclopaedia Britannica, notice « Ezana »",
      },
      {
        question: "Quelle marchandise importante Axoum exportait-il ?",
        options: ["Les diamants", "L'ivoire", "L'argent", "Le caoutchouc"],
        fact: "Axoum commerçait l'ivoire, l'or et les épices avec Rome, l'Inde et l'Arabie !",
        source: "Encyclopaedia Britannica, notice « Aksum »",
      },
      {
        question: "Quel système Axoum a-t-il créé lui-même ?",
        options: ["Sa propre monnaie", "Les ordinateurs", "Les voitures", "Les téléphones"],
        fact: "Axoum a été l'un des premiers royaumes africains à frapper sa propre monnaie !",
        source: "Encyclopaedia Britannica, notice « Aksum »",
      },
      {
        question: "Quel roi d'Axoum s'est converti au christianisme au IVe siècle ?",
        options: ["Ézana", "Kaléb", "Gadarat", "Zoscales"],
        fact: "Le roi Ézana d'Axoum s'est converti au christianisme vers 330 apr. J.-C. et a fait graver la croix sur les pièces axoumites !",
        source: "Encyclopaedia Britannica, notice « Ezana »",
      },
      {
        question: "Comment s'appelait la cité portuaire d'Axoum, essentielle à son commerce dans l'océan Indien ?",
        options: ["Mogadiscio", "Adoulis", "Zanzibar", "Mombasa"],
        fact: "Adoulis, sur la mer Rouge, était le principal port d'Axoum, un carrefour reliant l'Afrique, l'Arabie, l'Inde et l'Empire romain !",
        source: "Encyclopaedia Britannica, notice « Aksum »",
      },
      {
        question: "Quelle célèbre relique religieuse les Axoumites sont-ils traditionnellement censés garder ?",
        options: ["Le saint Graal", "L'arche d'alliance", "Le suaire de Turin", "La vraie Croix"],
        fact: "La tradition éthiopienne raconte que l'arche d'alliance a été apportée à Axoum par Ménélik Ier, fils du roi Salomon et de la reine de Saba !",
        source: "Liste du patrimoine mondial de l'UNESCO, Aksoum",
      },
      {
        question: "Quelle écriture ancienne, utilisée uniquement en Éthiopie et en Érythrée, est issue du système d'écriture axoumite ?",
        options: ["L'arabe", "Le guèze, ou éthiopien", "Le copte", "L'alphabet amharique"],
        fact: "Le guèze est l'un des plus anciens systèmes d'écriture encore utilisés au monde, toujours employé aujourd'hui dans la liturgie de l'Église orthodoxe éthiopienne !",
        source: "Encyclopaedia Britannica, notice « Ge'ez language »",
      },
      {
        question: "Le roi Kaléb d'Axoum a envahi la péninsule Arabique en 525 apr. J.-C. pour défendre quel groupe persécuté ?",
        options: ["Les musulmans", "Les marchands juifs", "Les chrétiens du Yémen", "Les moines bouddhistes"],
        fact: "Le roi Kaléb a traversé la mer Rouge pour vaincre le roi yéménite Dhu Nuwas, qui massacrait les chrétiens, une projection extraordinaire de la puissance militaire africaine !",
        source: "Encyclopaedia Britannica, notice « Aksum »",
      },
      {
        question: "Dans quelle pierre les stèles axoumites les plus hautes ont-elles été taillées d'un seul bloc ?",
        options: ["Le granit", "Le marbre", "Le calcaire", "Le basalte"],
        fact: "L'obélisque d'Axoum mesure environ 24 mètres et a été taillé dans un seul bloc de granit, tandis qu'une stèle plus grande de 33 mètres gît brisée au sol !",
        source: "Liste du patrimoine mondial de l'UNESCO, Aksoum",
      },
      {
        question: "Quel titre, qui signifie roi en guèze, portaient les souverains d'Axoum ?",
        options: ["Mansa", "Négus", "Sultan", "Pharaon"],
        fact: "Les rois axoumites portaient le titre de Négus, et le titre développé Negusa Nagast signifiait roi des rois !",
        source: "Encyclopaedia Britannica, notice « Aksum »",
      },
      {
        question: "L'essor de quelle religion en Arabie au VIIe siècle a-t-il contribué à affaiblir le contrôle d'Axoum sur le commerce de la mer Rouge ?",
        options: ["L'islam", "Le bouddhisme", "L'hindouisme", "Le judaïsme"],
        fact: "L'expansion de l'islam après le VIIe siècle a déplacé les réseaux commerciaux de la mer Rouge, et la puissance d'Axoum s'en est trouvée affaiblie !",
        source: "Encyclopaedia Britannica, notice « Aksum »",
      },
      {
        question: "Quel royaume Aksoum a-t-il vaincu au IVe siècle pour ouvrir la route commerciale du Nil ?",
        options: ["Kouch", "Rome", "La Perse", "Kanem"],
        fact: "L'armée axoumite a détruit le royaume de Kouch à Méroé vers 350, un événement gravé dans une inscription d'Aksoum.",
        source: "Encyclopaedia Britannica, notice « Aksum »",
      },
      {
        question: "De quelle écriture, utilisée en Arabie du Sud, l'écriture guèze d'Aksoum est-elle issue ?",
        options: ["L'écriture sud-arabique", "Le latin", "Le copte", "Le grec"],
        fact: "Le guèze est né de l'écriture sud-arabique des marchands qui traversaient la mer Rouge, et il se lit encore aujourd'hui dans les églises éthiopiennes.",
        source: "Encyclopaedia Britannica, notice « Ge'ez language »",
      },
      {
        question: "Quel manuel grec du premier siècle décrit le commerce d'Adoulis et de la mer Rouge ?",
        options: ["Le Périple de la mer Érythrée", "Le Livre des morts", "Le Tarikh al-Soudan", "Le Kebra Nagast"],
        fact: "Le Périple était écrit pour les marchands, et sa liste de ce qu'Adoulis vendait et achetait est le plus ancien récit du commerce d'Axoum.",
        source: "Encyclopaedia Britannica, notice « Periplus of the Erythraean Sea »",
      },
      {
        question: "Quel maître chrétien, devenu évêque, est crédité d'avoir apporté la nouvelle foi à la cour d'Axoum ?",
        options: ["Frumentius", "Athanase", "Origène", "Eusèbe"],
        fact: "Frumentius était un Syrien jeté par un naufrage sur la côte, et l'Église éthiopienne se souvient encore de lui comme de son premier évêque.",
        source: "Encyclopaedia Britannica, notice « Ethiopia »",
      },
      {
        question: "Quel obélisque d'Axoum, emporté à Rome en 1937, a été rendu à l'Éthiopie en 2005 ?",
        options: ["L'obélisque d'Axoum", "L'obélisque du Latran", "L'obélisque de Théodose", "L'obélisque de Louxor"],
        fact: "Les troupes italiennes ont emporté la stèle en morceaux et elle est restée à Rome près de soixante-dix ans avant d'être rapportée par avion et redressée.",
        source: "Liste du patrimoine mondial de l'UNESCO, Aksoum",
      },
      {
        question: "Quel royaume du sud de l'Arabie, de l'autre côté de la mer Rouge, Axoum a-t-il gouverné au VIe siècle ?",
        options: ["Himyar", "Saba", "La Nabatène", "Le Pount"],
        fact: "Axoum a tenu Himyar quelques décennies, et les inscriptions que ses rois ont laissées au Yémen se lisent encore aujourd'hui.",
        source: "Encyclopaedia Britannica, notice « Himyar »",
      },
      {
        question: "Quelle résine, brûlée comme encens et transportée par les navires d'Adoulis, venait des hauts plateaux d'Axoum ?",
        options: ["L'encens", "L'ambre", "Le camphre", "Le santal"],
        fact: "Les arbres à encens poussent sur les pentes sèches de la Corne, et l'encens qu'ils donnaient valait autant que l'ivoire de l'intérieur.",
        source: "Encyclopaedia Britannica, notice « frankincense »",
      },
      {
        question: "Quelle minuscule céréale, originaire des hauts plateaux éthiopiens, sert à faire la galette injera ?",
        options: ["Le teff", "Le mil", "Le sorgho", "L'orge"],
        fact: "Le teff a d'abord été cultivé dans les hauts plateaux éthiopiens, et sa farine fermente en une galette spongieuse mangée à presque tous les repas.",
        source: "Encyclopaedia Britannica, notice « Ethiopia »",
      },
    ],
  },
};
