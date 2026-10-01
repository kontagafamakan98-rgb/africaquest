/**
 * The Iron Age: one level of the game, on its own.
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
import { Hammer } from "lucide-react";

export default {
  id: 11,
  order: 4,
  era: "ancient",
  from: -1000,
  title: "The Iron Age",
  subtitle: "Nok terracottas and the Bantu expansion",
  region: "Central and Southern Africa",
  color: "from-orange-700 to-red-800",
  icon: Hammer,
  gallery: {
    en: [
      {
        file: "/photos/level-11-1.jpg",
        caption: "A Nok terracotta standing near the village of Nok, in central Nigeria, where this culture was first recognised.",
        credit: "Zbobai · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Zbobai",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Erected_Nok_Terracotta.jpg",
      },
      {
        file: "/photos/level-11-2.jpg",
        caption: "A head of fired clay of the Nok culture, shaped by hand more than two thousand years ago.",
        credit: "Hiart · CC0 · Wikimedia Commons",
        author: "Hiart",
        licence: "CC0",
        source: "https://commons.wikimedia.org/wiki/File:Head%2C_Nok_culture%2C_terracotta%2C_Honolulu_Museum_of_Art%2C_8349.1.JPG",
      },
      {
        file: "/photos/level-11-3.jpg",
        caption: "A two-headed reptile of fired clay, dug up at a Nok site in Nigeria.",
        credit: "Friday musa · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Friday musa",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:A_double_headed_reptile_terracotta.jpg",
      },
    ],
    fr: [
      {
        file: "/photos/level-11-1.jpg",
        caption: "Une terre cuite nok dressée près du village de Nok, dans le centre du Nigeria, où cette culture fut identifiée.",
        credit: "Zbobai · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Zbobai",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Erected_Nok_Terracotta.jpg",
      },
      {
        file: "/photos/level-11-2.jpg",
        caption: "Une tête de terre cuite de la culture nok, façonnée à la main il y a plus de deux mille ans.",
        credit: "Hiart · CC0 · Wikimedia Commons",
        author: "Hiart",
        licence: "CC0",
        source: "https://commons.wikimedia.org/wiki/File:Head%2C_Nok_culture%2C_terracotta%2C_Honolulu_Museum_of_Art%2C_8349.1.JPG",
      },
      {
        file: "/photos/level-11-3.jpg",
        caption: "Un reptile à deux têtes de terre cuite, mis au jour sur un site nok du Nigeria.",
        credit: "Friday musa · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Friday musa",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:A_double_headed_reptile_terracotta.jpg",
      },
    ],
  },
  study: {
    en: {
      essay: ["Around three thousand years ago, farmers in the borderlands of Nigeria and Cameroon began to move. They carried iron tools, seed crops and their languages, and over two thousand years their descendants settled from the Great Lakes to the Cape, which is one of the largest movements of people the world has known.", "In central Nigeria, the Nok artists modelled heads of astonishing size and detail in clay. Their figures show people wearing beads and bracelets, and their furnaces show that iron was being smelted on the plateau at the same time as the farming spread, and that the two things travelled together.", "Iron made the difference: an axe that would clear woodland, a hoe that would break new soil, and a spear for hunting and for war. The Bantu languages travelled with the farmers, which is why more than three hundred million people speak one today, from Cameroon to Kenya and from Angola to South Africa.", "Where the farmers met hunter-gatherers such as the San or the Mbuti, the two ways of life traded and borrowed from each other. The farmers crossed the great rainforest of the Congo before they could reach the south, and the languages of the forest still carry the memory of that meeting."],
      timeline: [
        {
          year: "c. 1000 BC",
          text: "Iron working and farming spread west of the Niger and in the Cameroon highlands.",
        },
        {
          year: "c. 500 BC",
          text: "Farming communities move into the rainforest and down the Congo river.",
        },
        {
          year: "c. 500 BC to 200 AD",
          text: "The Nok culture makes terracotta heads and iron tools on the Jos plateau.",
        },
        { year: "c. 300 AD", text: "Farmers reach the Great Lakes and the eastern savannah." },
        {
          year: "c. 500 AD",
          text: "Iron and farming reach southern Africa, and the ancestors of the Sotho and Tswana settle there.",
        },
      ],
      people: [
        { name: "The Nok artists", text: "The sculptors of the terracotta heads of the Jos plateau." },
        {
          name: "The early Bantu farmers",
          text: "The communities whose speech became three hundred languages.",
        },
        {
          name: "The Mbuti",
          text: "The forest hunter-gatherers of the Congo basin, who traded with the farmers.",
        },
        {
          name: "The San",
          text: "The hunter-gatherers of southern Africa, whose languages carry click sounds.",
        },
      ],
      places: [
        {
          name: "The Jos plateau",
          text: "The highland of the Nok terracottas and of the early iron furnaces.",
        },
        { name: "The Congo basin", text: "The rainforest the farmers crossed on their way south." },
        {
          name: "The Great Lakes",
          text: "The region of the earliest Bantu farming communities in the east.",
        },
        { name: "The Cameroon highlands", text: "One of the homelands of the Bantu languages." },
      ],
      glossary: [
        { term: "Bantu", text: "The family of languages that travelled with the farmers." },
        { term: "bloomery", text: "The furnace in which ore was smelted into a spongy mass of iron." },
        {
          term: "hunter-gatherer",
          text: "A way of life that lives from wild plants and animals rather than from fields.",
        },
        { term: "terracotta", text: "Clay baked into a hard figure or a hard pot." },
        {
          term: "slash and burn",
          text: "The clearing of a field by fire, farmed for a few years and then left to recover.",
        },
      ],
    },
    fr: {
      essay: ["Il y a environ trois mille ans, des agriculteurs des confins du Nigeria et du Cameroun se sont mis en marche. Ils emportaient des outils de fer, des semences et leurs langues, et en deux mille ans leurs descendants se sont installés des Grands Lacs jusqu'au Cap, l'un des plus grands mouvements de peuples que le monde ait connus.", "Au centre du Nigeria, les artistes nok ont modelé dans l'argile des têtes d'une taille et d'une finesse surprenantes. Leurs figures montrent des personnes portant perles et bracelets, et leurs fourneaux montrent que le fer était fondu sur le plateau en même temps que s'étendait l'agriculture, et que les deux voyageaient ensemble.", "Le fer a fait la différence : une hache pour défricher la forêt, une houe pour ouvrir une terre nouvelle, et une lance pour la chasse comme pour la guerre. Les langues bantoues ont voyagé avec les agriculteurs, et c'est pourquoi plus de trois cents millions de personnes en parlent une aujourd'hui, du Cameroun au Kenya et de l'Angola à l'Afrique du Sud.", "Là où les agriculteurs ont rencontré des chasseurs-cueilleurs comme les San ou les Mbuti, les deux façons de vivre ont commerçé et emprunté l'une à l'autre. Les agriculteurs ont traversé la grande forêt du Congo avant d'atteindre le sud, et les langues de la forêt portent encore la mémoire de cette rencontre."],
      timeline: [
        {
          year: "v. 1000 av. J.-C.",
          text: "Le travail du fer et l'agriculture se répandent à l'ouest du Niger et dans les monts du Cameroun.",
        },
        {
          year: "v. 500 av. J.-C.",
          text: "Des communautés agricoles entrent dans la forêt et descendent le fleuve Congo.",
        },
        {
          year: "v. 500 av. J.-C. à 200 apr. J.-C.",
          text: "La culture nok produit des têtes de terre cuite et des outils de fer sur le plateau de Jos.",
        },
        {
          year: "v. 300 apr. J.-C.",
          text: "Les agriculteurs atteignent les Grands Lacs et la savane de l'est.",
        },
        {
          year: "v. 500 apr. J.-C.",
          text: "Le fer et l'agriculture atteignent l'Afrique australe, et les ancêtres des Sotho et des Tswana s'y installent.",
        },
      ],
      people: [
        { name: "Les artistes nok", text: "Les sculpteurs des têtes de terre cuite du plateau de Jos." },
        {
          name: "Les premiers agriculteurs bantous",
          text: "Les communautés dont la parole est devenue trois cents langues.",
        },
        {
          name: "Les Mbuti",
          text: "Les chasseurs-cueilleurs de la forêt du bassin du Congo, qui commerçaient avec les agriculteurs.",
        },
        {
          name: "Les San",
          text: "Les chasseurs-cueilleurs d'Afrique australe, dont les langues portent des clics.",
        },
      ],
      places: [
        {
          name: "Le plateau de Jos",
          text: "Les hautes terres des terres cuites nok et des premiers fourneaux à fer.",
        },
        { name: "Le bassin du Congo", text: "La forêt que les agriculteurs ont traversée vers le sud." },
        {
          name: "Les Grands Lacs",
          text: "La région des premières communautés agricoles bantoues de l'est.",
        },
        { name: "Les monts du Cameroun", text: "L'une des patries des langues bantoues." },
      ],
      glossary: [
        { term: "bantou", text: "La famille de langues qui a voyagé avec les agriculteurs." },
        {
          term: "bas fourneau",
          text: "Le four où l'on fondait le minerai en une masse d'éponge de fer.",
        },
        {
          term: "chasseur-cueilleur",
          text: "Un mode de vie qui vit des plantes et des animaux sauvages plutôt que des champs.",
        },
        { term: "terre cuite", text: "De l'argile cuite en une figure ou un pot durs." },
        {
          term: "essartage",
          text: "Le défrichement d'un champ par le feu, cultivé quelques années puis laissé se refaire.",
        },
      ],
    },
  },
  questions: [
    {
      question: "In which country were the Nok terracotta sculptures discovered?",
      options: ["Nigeria", "Kenya", "Ghana", "Sudan"],
      correct: 0,
      fact: "The Nok figures were found on the Jos Plateau in central Nigeria and are between 2,000 and 3,000 years old.",
      source: { label: "Encyclopaedia Britannica, \"Nok culture\"" },
    },
    {
      question: "What did the Nok artists model in clay?",
      options: ["Large human heads and figures", "Boats and oars", "Musical instruments", "Clay coins"],
      correct: 0,
      fact: "The heads wear elaborate hairstyles and jewellery, which tells us that Nok society already had rank and skilled craftsmen.",
      source: { label: "Encyclopaedia Britannica, \"Nok culture\"" },
    },
    {
      question: "What else were the Nok people among the first in West Africa to do?",
      options: ["Smelt iron", "Write books", "Build stone cities", "Sail to India"],
      correct: 0,
      fact: "An iron furnace found at Taruga, on the Jos Plateau, was working around 500 BC, one of the oldest known in West Africa.",
      source: { label: "Encyclopaedia Britannica, \"Nok culture\"" },
    },
    {
      question: "From where did the Bantu-speaking peoples begin to spread about 3,000 years ago?",
      options: ["The borderlands of Nigeria and Cameroon", "The Sahara Desert", "The Nile Delta", "The Ethiopian highlands"],
      correct: 0,
      fact: "From that homeland, farming communities moved south and east for nearly two thousand years, carrying their languages with them.",
      source: { label: "Encyclopaedia Britannica, \"Bantu peoples\"" },
    },
    {
      question: "Which two innovations helped Bantu-speaking farmers spread across the continent?",
      options: ["Iron tools and farming", "Gunpowder and horses", "Sailing ships and writing", "Coins and paved roads"],
      correct: 0,
      fact: "Iron axes cleared the forest and iron hoes fed more people, so villages grew, split, and settled further away.",
      source: { label: "Encyclopaedia Britannica, \"Bantu peoples\"" },
    },
    {
      question: "About how many people speak a Bantu language today?",
      options: ["About three million", "About thirty million", "More than three hundred million", "More than three billion"],
      correct: 2,
      fact: "Swahili, Zulu, Shona, Lingala and Kikuyu are all Bantu languages, spoken from Cameroon to South Africa.",
      source: { label: "Encyclopaedia Britannica, \"Bantu peoples\"" },
    },
    {
      question: "By about which date had farming communities speaking Bantu languages reached southern Africa?",
      options: ["300 AD", "1500 AD", "500 BC", "1900 AD"],
      correct: 0,
      fact: "Iron-using farmers were settling south of the Limpopo by about 300 AD, more than a thousand years before the first European ships arrived.",
      source: {
        label: "UNESCO, General History of Africa, volume II",
        url: "https://www.unesco.org/en/general-history-africa",
      },
    },
    {
      question: "Which hunter-gatherer peoples were already living in southern Africa when the farmers arrived?",
      options: ["The San and the Khoikhoi", "The Zulu and the Xhosa", "The Oromo and the Somali", "The Tuareg and the Fulani"],
      correct: 0,
      fact: "The San and the Khoikhoi speak non-Bantu languages, and their rock art and place names are part of the oldest heritage of the region.",
      source: { label: "Encyclopaedia Britannica, \"San\"" },
    },
    {
      question: "Which language family do most languages of central and southern Africa belong to?",
      options: ["Niger-Congo", "Afroasiatic", "Khoisan", "Indo-European"],
      correct: 0,
      fact: "The Bantu languages are one branch of the Niger-Congo family, and the expansion of their speakers spread them across half the continent.",
      source: { label: "Encyclopaedia Britannica, \"Bantu peoples\"" },
    },
    {
      question: "Which food crop, carried across the Indian Ocean, became a staple of Bantu farming?",
      options: ["Bananas", "Olives", "Dates", "Grapes"],
      correct: 0,
      fact: "Bananas reached Africa from Southeast Asia through Madagascar and the East African coast, and they fed farming villages as they spread.",
      source: {
        label: "UNESCO, General History of Africa, volume II",
        url: "https://www.unesco.org/en/general-history-africa",
      },
    },
    {
      question: "In 1928, which activity brought the first Nok terracotta heads to light?",
      options: ["Tin mining", "Road building", "Farming", "Well digging"],
      correct: 0,
      fact: "Tin mining near the village of Nok, in central Nigeria, brought the first terracotta heads to light in 1928, and the culture took the name of the village.",
      source: { label: "Encyclopaedia Britannica, \"Nok culture\"" },
    },
    {
      question: "The Nok are described as an ancient culture of which age?",
      options: ["The Iron Age", "The Bronze Age", "The Stone Age", "The Copper Age"],
      correct: 0,
      fact: "Britannica calls the Nok an ancient Iron Age culture, whose people grew crops, kept cattle and worked iron in the centre of today's Nigeria.",
      source: { label: "Encyclopaedia Britannica, \"Nok culture\"" },
    },
    {
      question: "Which family of southern African languages, spoken by hunter-gatherers before the farmers arrived, is famous for its click sounds?",
      options: ["Khoisan", "Niger-Congo", "Afroasiatic", "Nilo-Saharan"],
      correct: 0,
      fact: "Khoisan is the name given to the click languages of the San and the Khoikhoi, the oldest known speech of southern Africa.",
      source: { label: "Encyclopaedia Britannica, \"Khoisan languages\"" },
    },
    {
      question: "Which of these languages belongs to the Bantu group?",
      options: ["Zulu", "Wolof", "Amazigh", "Amharic"],
      correct: 0,
      fact: "Zulu is one of the Bantu languages, and it shares the shape of its words with tongues spoken thousands of kilometres away.",
      source: { label: "Encyclopaedia Britannica, \"Zulu language\"" },
    },
    {
      question: "Which great forest basin did Bantu-speaking farmers have to cross as they moved from the Great Lakes towards the south?",
      options: ["The Congo basin", "The Niger delta", "The Okavango", "The Horn of Africa"],
      correct: 0,
      fact: "The Congo basin, with its rivers and its heavy rain, took centuries to cross, and the farmers followed the waterways through it.",
      source: {
        label: "UNESCO, General History of Africa, volume II",
        url: "https://www.unesco.org/en/general-history-africa",
      },
    },
    {
      question: "Which of these countries lies outside the area where Bantu languages are spoken?",
      options: ["Senegal", "Angola", "Uganda", "Zambia"],
      correct: 0,
      fact: "The Bantu languages cover the centre, the east and the south of the continent, and West Africa as far as Senegal kept its own older families.",
      source: { label: "Encyclopaedia Britannica, \"Bantu peoples\"" },
    },
    {
      question: "Which animal, raised in great herds, spread with the farmers and is still at the centre of farming life across Africa?",
      options: ["Cattle", "Camels", "Reindeer", "Llamas"],
      correct: 0,
      fact: "Cattle gave the farmers milk and meat and a store of wealth, and the villages that kept them could move when the pasture was exhausted.",
      source: {
        label: "UNESCO, General History of Africa, volume II",
        url: "https://www.unesco.org/en/general-history-africa",
      },
    },
    {
      question: "Which crop from Asia reached East Africa with the same trade that brought the banana?",
      options: ["Asian rice", "Maize", "Cassava", "Cocoa"],
      correct: 0,
      fact: "Rice from Asia came with the ships of the Indian Ocean; maize, cassava and cocoa only reached Africa much later, from the Americas.",
      source: {
        label: "UNESCO, General History of Africa, volume II",
        url: "https://www.unesco.org/en/general-history-africa",
      },
    },
    {
      question: "Which people of the central African forest kept hunting and gathering while farmers settled around them?",
      options: ["The Mbuti", "The Zulu", "The Tuareg", "The Swahili"],
      correct: 0,
      fact: "The Mbuti and their neighbours knew the forest in a way the farmers never did, and the two ways of life traded with each other for centuries.",
      source: { label: "Encyclopaedia Britannica, \"Mbuti\"" },
    },
    {
      question: "Which tubers, dug from the wet lands, fed the farming villages of the Congo basin?",
      options: ["Yams", "Potatoes", "Beetroot", "Carrots"],
      correct: 0,
      fact: "African yams were domesticated in the forest and the savannah edge, and they grow well where the rain is heavy and the soil is soft.",
      source: {
        label: "UNESCO, General History of Africa, volume II",
        url: "https://www.unesco.org/en/general-history-africa",
      },
    },
    {
      question: "Which kingdom of the Great Lakes region, with earthworks at Bigo in Uganda, was an early state of the Iron Age?",
      options: ["Bunyoro-Kitara", "Kongo", "Songhai", "Kilwa"],
      correct: 0,
      fact: "The earthworks at Bigo ran for kilometres, and the kingdom of Bunyoro-Kitara ruled the pasture lands between the lakes.",
      source: { label: "Encyclopaedia Britannica, \"Bunyoro\"" },
    },
  ],
  fr: {
    title: "L'âge du fer",
    subtitle: "Terres cuites nok et expansion bantoue",
    region: "Afrique centrale et australe",
    questions: [
      {
        question: "Dans quel pays a-t-on découvert les sculptures en terre cuite nok ?",
        options: ["Nigeria", "Kenya", "Ghana", "Soudan"],
        fact: "Les figures nok ont été trouvées sur le plateau de Jos, au centre du Nigeria, et elles ont entre 2 000 et 3 000 ans.",
        source: "Encyclopaedia Britannica, notice « Nok culture »",
      },
      {
        question: "Que représentaient les artistes nok dans l'argile ?",
        options: ["De grandes têtes et figures humaines", "Des pirogues et des rames", "Des instruments de musique", "Des pièces de monnaie en argile"],
        fact: "Les têtes portent des coiffures et des bijoux élaborés, ce qui montre que la société nok connaissait déjà les rangs et les artisans spécialisés.",
        source: "Encyclopaedia Britannica, notice « Nok culture »",
      },
      {
        question: "Qu'ont aussi été parmi les premiers les Nok à faire en Afrique de l'Ouest ?",
        options: ["Fondre le fer", "Écrire des livres", "Bâtir des villes de pierre", "Naviguer jusqu'en Inde"],
        fact: "Un fourneau à fer retrouvé à Taruga, sur le plateau de Jos, fonctionnait vers 500 avant notre ère, l'un des plus anciens connus en Afrique de l'Ouest.",
        source: "Encyclopaedia Britannica, notice « Nok culture »",
      },
      {
        question: "D'où les peuples bantous ont-ils commencé à se répandre il y a environ 3 000 ans ?",
        options: ["Des confins du Nigeria et du Cameroun", "Du désert du Sahara", "Du delta du Nil", "Des hauts plateaux éthiopiens"],
        fact: "Depuis cette région d'origine, des communautés agricoles ont migré vers le sud et l'est pendant près de deux mille ans, en emportant leurs langues.",
        source: "Encyclopaedia Britannica, notice « Bantu peoples »",
      },
      {
        question: "Quelles deux innovations ont aidé les agriculteurs bantous à se répandre sur le continent ?",
        options: ["Les outils en fer et l'agriculture", "La poudre à canon et les chevaux", "Les navires et l'écriture", "La monnaie et les routes pavées"],
        fact: "Les haches de fer défrichaient la forêt et les houes de fer nourrissaient plus de monde, si bien que les villages grandissaient, se séparaient et s'installaient plus loin.",
        source: "Encyclopaedia Britannica, notice « Bantu peoples »",
      },
      {
        question: "Combien de personnes parlent aujourd'hui une langue bantoue ?",
        options: ["Environ trois millions", "Environ trente millions", "Plus de trois cents millions", "Plus de trois milliards"],
        fact: "Le swahili, le zoulou, le shona, le lingala et le kikuyu sont des langues bantoues, parlées du Cameroun à l'Afrique du Sud.",
        source: "Encyclopaedia Britannica, notice « Bantu peoples »",
      },
      {
        question: "Vers quelle date les communautés bantoues ont-elles atteint l'Afrique australe ?",
        options: ["Vers 300 apr. J.-C.", "Vers 1500 apr. J.-C.", "Vers 500 av. J.-C.", "Vers 1900 apr. J.-C."],
        fact: "Des agriculteurs utilisant le fer s'installaient au sud du Limpopo vers 300 de notre ère, plus de mille ans avant l'arrivée des premiers navires européens.",
        source: "UNESCO, Histoire générale de l'Afrique, volume II",
      },
      {
        question: "Quels peuples de chasseurs-cueilleurs vivaient déjà en Afrique australe à l'arrivée des agriculteurs ?",
        options: ["Les San et les Khoïkhoï", "Les Zoulous et les Xhosas", "Les Oromos et les Somaliens", "Les Touaregs et les Peuls"],
        fact: "Les San et les Khoïkhoï parlent des langues non bantoues, et leur art rupestre comme leurs noms de lieux font partie du plus ancien patrimoine de la région.",
        source: "Encyclopaedia Britannica, notice « San »",
      },
      {
        question: "À quelle famille appartiennent la plupart des langues d'Afrique centrale et australe ?",
        options: ["Le nigéro-congolais", "L'afroasiatique", "Le khoïsan", "L'indo-européen"],
        fact: "Les langues bantoues sont une branche de la famille nigéro-congolaise, et l'expansion de leurs locuteurs les a répandues sur la moitié du continent.",
        source: "Encyclopaedia Britannica, notice « Bantu peoples »",
      },
      {
        question: "Quelle plante vivrière, apportée à travers l'océan Indien, est devenue une base de l'agriculture bantoue ?",
        options: ["La banane", "L'olive", "La datte", "Le raisin"],
        fact: "La banane est arrivée en Afrique depuis l'Asie du Sud-Est par Madagascar et la côte est-africaine, et elle a nourri les villages d'agriculteurs au fil de leur expansion.",
        source: "UNESCO, Histoire générale de l'Afrique, volume II",
      },
      {
        question: "En 1928, quelle activité a fait apparaître les premières têtes nok en terre cuite ?",
        options: ["L'extraction de l'étain", "La construction de routes", "L'agriculture", "Le creusement de puits"],
        fact: "L'extraction de l'étain près du village de Nok, au centre du Nigeria, a fait apparaître les premières têtes en terre cuite en 1928, et la culture a pris le nom du village.",
        source: "Encyclopaedia Britannica, notice « Nok culture »",
      },
      {
        question: "La culture nok est décrite comme une culture ancienne de quel âge ?",
        options: ["L'âge du fer", "L'âge du bronze", "L'âge de la pierre", "L'âge du cuivre"],
        fact: "Britannica qualifie les Nok de culture ancienne de l'âge du fer, dont les habitants cultivaient la terre, élevaient des bovins et travaillaient le fer au centre du Nigeria actuel.",
        source: "Encyclopaedia Britannica, notice « Nok culture »",
      },
      {
        question: "Quelle famille de langues d'Afrique australe, parlée par des chasseurs-cueilleurs avant l'arrivée des agriculteurs, est célèbre pour ses clics ?",
        options: ["Le khoisan", "Le niger-congo", "L'afroasiatique", "Le nilo-saharien"],
        fact: "Le khoisan est le nom donné aux langues à clics des San et des Khoikhoi, la plus ancienne parole connue d'Afrique australe.",
        source: "Encyclopaedia Britannica, notice « Khoisan languages »",
      },
      {
        question: "Laquelle de ces langues appartient au groupe bantou ?",
        options: ["Le zoulou", "Le wolof", "L'amazighe", "L'amharique"],
        fact: "Le zoulou est une langue bantoue, et il partage la forme de ses mots avec des langues parlées à des milliers de kilomètres.",
        source: "Encyclopaedia Britannica, notice « Zulu language »",
      },
      {
        question: "Quel grand bassin forestier les agriculteurs bantous ont-ils dû traverser pour aller des grands lacs vers le sud ?",
        options: ["Le bassin du Congo", "Le delta du Niger", "L'Okavango", "La Corne de l'Afrique"],
        fact: "Le bassin du Congo, avec ses rivières et ses fortes pluies, a demandé des siècles à traverser, et les agriculteurs suivaient les cours d'eau.",
        source: "UNESCO, Histoire générale de l'Afrique, volume II",
      },
      {
        question: "Lequel de ces pays se trouve hors de l'aire où l'on parle des langues bantoues ?",
        options: ["Le Sénégal", "L'Angola", "L'Ouganda", "La Zambie"],
        fact: "Les langues bantoues couvrent le centre, l'est et le sud du continent, et l'Afrique de l'Ouest jusqu'au Sénégal a gardé ses familles plus anciennes.",
        source: "Encyclopaedia Britannica, notice « Bantu peoples »",
      },
      {
        question: "Quel animal, élevé en grands troupeaux, a suivi les agriculteurs et reste au centre de la vie paysanne en Afrique ?",
        options: ["Les bovins", "Les chameaux", "Les rennes", "Les lamas"],
        fact: "Les bovins donnaient aux agriculteurs du lait, de la viande et une réserve de richesse, et les villages qui les élevaient pouvaient se déplacer quand les pâturages s'épuisaient.",
        source: "UNESCO, Histoire générale de l'Afrique, volume II",
      },
      {
        question: "Quelle plante venue d'Asie est arrivée en Afrique de l'Est par le même commerce que la banane ?",
        options: ["Le riz asiatique", "Le maïs", "Le manioc", "Le cacao"],
        fact: "Le riz d'Asie est venu avec les navires de l'océan Indien ; le maïs, le manioc et le cacao ne sont arrivés en Afrique que bien plus tard, depuis les Amériques.",
        source: "UNESCO, Histoire générale de l'Afrique, volume II",
      },
      {
        question: "Quel peuple de la forêt d'Afrique centrale a continué à chasser et à cueillir tandis que des agriculteurs s'installaient autour de lui ?",
        options: ["Les Mbuti", "Les Zoulou", "Les Touareg", "Les Swahili"],
        fact: "Les Mbuti et leurs voisins connaissaient la forêt comme les agriculteurs ne la connaîtraient jamais, et les deux façons de vivre ont commerçé pendant des siècles.",
        source: "Encyclopaedia Britannica, notice « Mbuti »",
      },
      {
        question: "Quels tubercules, arrachés aux terres humides, nourrissaient les villages d'agriculteurs du bassin du Congo ?",
        options: ["Les ignames", "Les pommes de terre", "Les betteraves", "Les carottes"],
        fact: "Les ignames africaines ont été domestiquées dans la forêt et à la lisière de la savane, et elles poussent bien là où la pluie est forte et le sol meuble.",
        source: "UNESCO, Histoire générale de l'Afrique, volume II",
      },
      {
        question: "Quel royaume de la région des Grands Lacs, avec les terrassements de Bigo en Ouganda, fut un État ancien de l'âge du fer ?",
        options: ["Le Bunyoro-Kitara", "Le Kongo", "Le Songhaï", "Kilwa"],
        fact: "Les terrassements de Bigo courent sur des kilomètres, et le royaume du Bunyoro-Kitara gouvernait les pâturages entre les lacs.",
        source: "Encyclopaedia Britannica, notice « Bunyoro »",
      },
    ],
  },
};
