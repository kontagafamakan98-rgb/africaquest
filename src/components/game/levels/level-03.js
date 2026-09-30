/**
 * Great Zimbabwe: one level of the game, on its own.
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
import { Castle } from "lucide-react";

export default {
  id: 3,
  order: 10,
  era: "medieval",
  from: 1100,
  title: "Great Zimbabwe",
  subtitle: "City of Stone",
  region: "Southern Africa",
  color: "from-emerald-400 to-green-600",
  icon: Castle,
  gallery: {
    en: [
      {
        file: "/photos/level-3-1.jpg",
        caption: "The Great Enclosure of Great Zimbabwe, seen from the air.",
        credit: "Janice Bell · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Janice Bell",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Great-zim-aerial-looking-West.JPG",
      },
      {
        file: "/photos/level-3-2.jpg",
        caption: "The conical tower of the Great Enclosure, built without any mortar.",
        credit: "Fanny Schertzer · CC BY 3.0 · Wikimedia Commons",
        author: "Fanny Schertzer",
        licence: "CC BY 3.0",
        source: "https://commons.wikimedia.org/wiki/File:Conical_tower_%E2%80%93_Great_Zimbabwe.jpg",
      },
      {
        file: "/photos/level-3-3.jpg",
        caption: "A soapstone bird, the emblem of Great Zimbabwe.",
        credit: "Cliff · CC BY 2.0 · Wikimedia Commons",
        author: "Cliff",
        licence: "CC BY 2.0",
        source: "https://commons.wikimedia.org/wiki/File:Figure%2C_Possibly_Shona_peoples%2C_possibly_Zimbabwe%2C_Date_unknown%2C_Stone_(2923620556).jpg",
      },
    ],
    fr: [
      {
        file: "/photos/level-3-1.jpg",
        caption: "La Grande Enceinte de Grand Zimbabwe, vue du ciel.",
        credit: "Janice Bell · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Janice Bell",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Great-zim-aerial-looking-West.JPG",
      },
      {
        file: "/photos/level-3-2.jpg",
        caption: "La tour conique de la Grande Enceinte, montée sans aucun mortier.",
        credit: "Fanny Schertzer · CC BY 3.0 · Wikimedia Commons",
        author: "Fanny Schertzer",
        licence: "CC BY 3.0",
        source: "https://commons.wikimedia.org/wiki/File:Conical_tower_%E2%80%93_Great_Zimbabwe.jpg",
      },
      {
        file: "/photos/level-3-3.jpg",
        caption: "Un oiseau de stéatite, l'emblème de Grand Zimbabwe.",
        credit: "Cliff · CC BY 2.0 · Wikimedia Commons",
        author: "Cliff",
        licence: "CC BY 2.0",
        source: "https://commons.wikimedia.org/wiki/File:Figure%2C_Possibly_Shona_peoples%2C_possibly_Zimbabwe%2C_Date_unknown%2C_Stone_(2923620556).jpg",
      },
    ],
  },
  study: {
    en: {
      essay: ["Between the eleventh and fifteenth centuries, in the granite hills of southern Africa, a stone city rose that traded gold and ivory as far as the Indian Ocean. Great Zimbabwe was the capital of a state that held the gold routes of the interior, and its merchants were paid in glass beads, porcelain and cloth carried up from the coast.", "Its walls were built of blocks cut to fit together without mortar. The Hill Complex was the royal and ceremonial centre, and the Great Enclosure below it, with its high curved wall and its conical tower, is the largest ancient structure south of the Sahara. Between the two, in the valley, more than eighteen thousand people lived at the height of the city.", "The wealth of the state came from cattle and from gold, and the gold went down to Sofala, where it was loaded onto the monsoon dhows. The rulers drew their authority from the religion of Mwari, and the priests of the shrines gave the mambo, as the ruler was called, his right to rule. Soapstone birds stood on the walls, and each was a monument to a reign.", "Too many cattle and too many fields wore out the land around the capital, and in the fifteenth century the gold trade moved north towards the Zambezi. The court moved with it, and the stone city was left standing. European explorers found it in 1871 and spent decades refusing to believe that Africans had built it, until archaeology put the question beyond doubt."],
      timeline: [
        { year: "c. 1100", text: "The first stone walls are raised on the hill of Great Zimbabwe." },
        {
          year: "c. 1300",
          text: "The Great Enclosure is built and the city reaches its widest extent.",
        },
        { year: "c. 1350", text: "More than eighteen thousand people live in and around the capital." },
        { year: "c. 1450", text: "The gold trade shifts north and the court moves with it." },
        {
          year: "1871",
          text: "Karl Mauch reaches the ruins and Europe begins to argue about who built them.",
        },
        {
          year: "1905",
          text: "David Randall-MacIver shows that the walls are the work of African builders.",
        },
      ],
      people: [
        {
          name: "The mambo",
          text: "The title of the ruler of the plateau state, honoured from a stone enclosure.",
        },
        {
          name: "The Mwari priests",
          text: "The religious authority whose shrines gave the rulers their right to rule.",
        },
        {
          name: "Karl Mauch",
          text: "The German explorer who reached the ruins in 1871 and misread them.",
        },
        {
          name: "David Randall-MacIver",
          text: "The archaeologist who showed in 1905 that the walls were African work.",
        },
      ],
      places: [
        {
          name: "Great Zimbabwe",
          text: "The stone capital of the plateau, with the Hill Complex and the Great Enclosure.",
        },
        { name: "Sofala", text: "The port where the gold of the interior was loaded onto the dhows." },
        {
          name: "Mapungubwe",
          text: "The earlier hilltop kingdom to the south, where the gold work begins.",
        },
        {
          name: "The Zambezi",
          text: "The river valley that took the trade, and the court, north in the fifteenth century.",
        },
      ],
      glossary: [
        { term: "dry stone", text: "Walling built of shaped blocks laid together without mortar." },
        { term: "mambo", text: "The title of the ruler of the Zimbabwe state." },
        {
          term: "soapstone",
          text: "The soft stone the birds and the monoliths of the site are carved from.",
        },
        {
          term: "Indian Ocean trade",
          text: "The monsoon route that carried gold, beads, porcelain and cloth.",
        },
        {
          term: "dzimbabwe",
          text: "The Shona word for the stone houses the rulers built, which gave the site its name.",
        },
      ],
    },
    fr: {
      essay: ["Entre le XIe et le XVe siècle, dans les collines de granite de l'Afrique australe, une cité de pierre s'est élevée, qui commerçait l'or et l'ivoire jusqu'à l'océan Indien. Le Grand Zimbabwe était la capitale d'un État qui contrôlait les routes de l'or de l'intérieur, et ses marchands étaient payés en perles de verre, en porcelaine et en tissus remontés de la côte.", "Ses murs sont faits de blocs taillés pour s'emboîter sans mortier. Le complexe de la colline était le centre royal et cérémoniel, et la Grande Enceinte en contrebas, avec sa haute muraille courbe et sa tour conique, est le plus grand édifice ancien au sud du Sahara. Entre les deux, dans la vallée, plus de dix-huit mille personnes vivaient à l'apogée de la cité.", "La richesse de l'État venait du bétail et de l'or, et l'or descendait vers Sofala, où on le chargeait sur les boutres de mousson. Les souverains tiraient leur autorité de la religion de Mwari, et les prêtres des sanctuaires donnaient au mambo, comme on appelait le roi, son droit de gouverner. Des oiseaux de stéatite se dressaient sur les murs, chacun monument d'un règne.", "Trop de bétail et trop de champs ont épuisé la terre autour de la capitale, et au XVe siècle le commerce de l'or s'est déplacé vers le nord, vers le Zambèze. La cour a suivi, et la cité de pierre est restée debout. Les explorateurs européens l'ont trouvée en 1871 et ont passé des décennies à refuser de croire que des Africains l'avaient bâtie, jusqu'à ce que l'archéologie tranche la question."],
      timeline: [
        {
          year: "v. 1100",
          text: "Les premiers murs de pierre sont élevés sur la colline du Grand Zimbabwe.",
        },
        {
          year: "v. 1300",
          text: "La Grande Enceinte est construite et la cité atteint sa plus large étendue.",
        },
        {
          year: "v. 1350",
          text: "Plus de dix-huit mille personnes vivent dans la capitale et autour d'elle.",
        },
        { year: "v. 1450", text: "Le commerce de l'or se déplace vers le nord et la cour suit." },
        {
          year: "1871",
          text: "Karl Mauch atteint les ruines et l'Europe commence à disputer de leurs bâtisseurs.",
        },
        {
          year: "1905",
          text: "David Randall-MacIver démontre que les murs sont l'oeuvre de bâtisseurs africains.",
        },
      ],
      people: [
        {
          name: "Le mambo",
          text: "Le titre du souverain de l'État du plateau, honoré depuis une enceinte de pierre.",
        },
        {
          name: "Les prêtres de Mwari",
          text: "L'autorité religieuse dont les sanctuaires donnaient aux rois leur droit de régner.",
        },
        {
          name: "Karl Mauch",
          text: "L'explorateur allemand qui a atteint les ruines en 1871 et les a mal comprises.",
        },
        {
          name: "David Randall-MacIver",
          text: "L'archéologue qui a montré en 1905 que les murs étaient une oeuvre africaine.",
        },
      ],
      places: [
        {
          name: "Le Grand Zimbabwe",
          text: "La capitale de pierre du plateau, avec le complexe de la colline et la Grande Enceinte.",
        },
        { name: "Sofala", text: "Le port où l'on chargeait l'or de l'intérieur sur les boutres." },
        {
          name: "Mapungubwe",
          text: "Le royaume plus ancien, sur une hauteur au sud, où commence le travail de l'or.",
        },
        {
          name: "Le Zambèze",
          text: "La vallée fluviale qui a emporté le commerce, et la cour, vers le nord au XVe siècle.",
        },
      ],
      glossary: [
        { term: "pierre sèche", text: "Une maçonnerie de blocs taillés posés sans mortier." },
        { term: "mambo", text: "Le titre du souverain de l'État du Zimbabwe." },
        {
          term: "stéatite",
          text: "La pierre tendre dans laquelle sont taillés les oiseaux et les monolithes du site.",
        },
        {
          term: "commerce de l'océan Indien",
          text: "La route de mousson qui portait l'or, les perles, la porcelaine et les tissus.",
        },
        {
          term: "dzimbabwe",
          text: "Le mot shona pour les maisons de pierre des souverains, qui a donné son nom au site.",
        },
      ],
    },
  },
  questions: [
    {
      question: "What does 'Zimbabwe' mean?",
      options: ["Big river", "Great stone houses", "Tall mountains", "Green land"],
      correct: 1,
      fact: "Zimbabwe comes from 'dzimba dza mabwe' meaning 'great stone houses'!",
      source: { label: "Encyclopaedia Britannica, \"Great Zimbabwe\"" },
    },
    {
      question: "Great Zimbabwe was a center for trading what?",
      options: ["Only food", "Gold, ivory, and cattle", "Only weapons", "Only cloth"],
      correct: 1,
      fact: "Great Zimbabwe was a wealthy trading center connected to trade routes reaching China and India!",
      source: {
        label: "UNESCO World Heritage List, Great Zimbabwe National Monument",
        url: "https://whc.unesco.org/en/list/364/",
      },
    },
    {
      question: "When was Great Zimbabwe at its peak?",
      options: ["100 BC", "500 AD", "1100-1450 AD", "1800 AD"],
      correct: 2,
      fact: "At its peak, over 18,000 people lived in and around Great Zimbabwe!",
      source: {
        label: "UNESCO World Heritage List, Great Zimbabwe National Monument",
        url: "https://whc.unesco.org/en/list/364/",
      },
    },
    {
      question: "What was special about Great Zimbabwe's walls?",
      options: ["Made of wood", "Built without mortar", "Made of clay", "Painted gold"],
      correct: 1,
      fact: "The walls were built from granite blocks fitted together without any mortar, amazing engineering!",
      source: {
        label: "UNESCO World Heritage List, Great Zimbabwe National Monument",
        url: "https://whc.unesco.org/en/list/364/",
      },
    },
    {
      question: "What famous bird sculpture was found at Great Zimbabwe?",
      options: ["Eagle", "Zimbabwe Bird", "Flamingo", "Parrot"],
      correct: 1,
      fact: "The Zimbabwe Bird is now the national emblem of Zimbabwe and appears on their flag!",
      source: {
        label: "UNESCO World Heritage List, Great Zimbabwe National Monument",
        url: "https://whc.unesco.org/en/list/364/",
      },
    },
    {
      question: "The people who built Great Zimbabwe belonged to which ethnic group?",
      options: ["Zulu", "Shona", "Xhosa", "Ndebele"],
      correct: 1,
      fact: "The Shona people built and inhabited Great Zimbabwe, their descendants still live in Zimbabwe today!",
      source: { label: "Encyclopaedia Britannica, \"Shona\"" },
    },
    {
      question: "Chinese porcelain was found at Great Zimbabwe. What does this tell us?",
      options: ["Chinese people built it", "Zimbabwe traded across the Indian Ocean", "It was a gift from Egypt", "Porcelain was made locally"],
      correct: 1,
      fact: "Chinese and Persian artifacts at Great Zimbabwe prove it was connected to vast Indian Ocean trade networks!",
      source: {
        label: "UNESCO World Heritage List, Great Zimbabwe National Monument",
        url: "https://whc.unesco.org/en/list/364/",
      },
    },
    {
      question: "The 'Great Enclosure' at Great Zimbabwe is the largest ancient structure south of the Sahara. What was its wall height?",
      options: ["3 metres", "6 metres", "11 metres", "20 metres"],
      correct: 2,
      fact: "The Great Enclosure's walls reach up to 11 metres high and stretch over 250 metres, built with over a million granite blocks!",
      source: {
        label: "UNESCO World Heritage List, Great Zimbabwe National Monument",
        url: "https://whc.unesco.org/en/list/364/",
      },
    },
    {
      question: "European colonizers in the 19th century falsely claimed Great Zimbabwe was built by which civilization?",
      options: ["Romans", "Phoenicians or Queen of Sheba's people", "Greeks", "Persians"],
      correct: 1,
      fact: "Racist colonial theories denied African authorship of Great Zimbabwe, claiming Phoenicians or the Queen of Sheba built it, all debunked by archaeology!",
      source: {
        label: "UNESCO World Heritage List, Great Zimbabwe National Monument",
        url: "https://whc.unesco.org/en/list/364/",
      },
    },
    {
      question: "What was the Mutapa state, which succeeded Great Zimbabwe's power?",
      options: ["A kingdom in West Africa", "A successor Shona kingdom controlling gold trade", "An Egyptian colony", "A Swahili city-state"],
      correct: 1,
      fact: "The Kingdom of Mutapa (or Mwene Mutapa) emerged after Great Zimbabwe's decline and controlled the gold-rich plateau until Portuguese interference in the 1600s!",
      source: {
        label: "UNESCO, General History of Africa, volume IV",
        url: "https://www.unesco.org/en/general-history-africa",
      },
    },
    {
      question: "Inside the Great Enclosure stands a tall solid structure with no entrance. What shape is it?",
      options: ["A conical tower", "An obelisk", "A pyramid", "A colonnade"],
      correct: 0,
      fact: "The Great Enclosure's solid conical tower is about 9 metres tall, and its exact purpose is still debated by archaeologists!",
      source: {
        label: "UNESCO World Heritage List, Great Zimbabwe National Monument",
        url: "https://whc.unesco.org/en/list/364/",
      },
    },
    {
      question: "Around which period was Great Zimbabwe largely abandoned?",
      options: ["The early 1200s", "The mid 1400s", "The late 1700s", "The early 1900s"],
      correct: 1,
      fact: "By around 1450 the city was mostly abandoned as trade routes shifted and the surrounding land was exhausted; power moved to the Mutapa state!",
      source: {
        label: "UNESCO, General History of Africa, volume IV",
        url: "https://www.unesco.org/en/general-history-africa",
      },
    },
    {
      question: "The Zimbabwe Bird sculptures were carved from what kind of stone?",
      options: ["Soapstone", "Marble", "Granite", "Sandstone"],
      correct: 0,
      fact: "Eight soapstone birds were found at Great Zimbabwe, and they are among the most celebrated works of art from pre-colonial southern Africa!",
      source: {
        label: "UNESCO World Heritage List, Great Zimbabwe National Monument",
        url: "https://whc.unesco.org/en/list/364/",
      },
    },
    {
      question: "Which kingdom on the Limpopo, dated to about 1075 to 1220, came before Great Zimbabwe?",
      options: ["Mapungubwe", "Kilwa", "Djenne", "Sofala"],
      correct: 0,
      fact: "Mapungubwe traded ivory and gold with the coast and is seen as the first kingdom of the region that Great Zimbabwe would inherit from.",
      source: {
        label: "UNESCO World Heritage List, Mapungubwe Cultural Landscape",
        url: "https://whc.unesco.org/en/list/1099/",
      },
    },
    {
      question: "On what did the kings of Great Zimbabwe build their main residence?",
      options: ["A rocky hill, the Hill Complex", "A river island", "An artificial lake", "A sand dune"],
      correct: 0,
      fact: "The Hill Complex was the royal and ritual centre, and the Great Enclosure below it held the king's wives and the community's most important ceremonies.",
      source: {
        label: "UNESCO World Heritage List, Great Zimbabwe National Monument",
        url: "https://whc.unesco.org/en/list/364/",
      },
    },
    {
      question: "Which small imported objects, made of glass, were kept as ornaments and as wealth at Great Zimbabwe?",
      options: ["Glass beads", "Coins", "Mirrors", "Iron nails"],
      correct: 0,
      fact: "Thousands of glass beads were found in the ruins, and they came up the coast from India and Arabia along the same route as the gold.",
      source: {
        label: "UNESCO World Heritage List, Great Zimbabwe National Monument",
        url: "https://whc.unesco.org/en/list/364/",
      },
    },
    {
      question: "From which stone, found in the hills around the city, were the walls of Great Zimbabwe built?",
      options: ["Granite", "Marble", "Sandstone", "Limestone"],
      correct: 0,
      fact: "The builders split the granite of the hills into flat blocks and laid them so evenly that the walls bend and never fall.",
      source: {
        label: "UNESCO World Heritage List, Great Zimbabwe National Monument",
        url: "https://whc.unesco.org/en/list/364/",
      },
    },
    {
      question: "Which present-day town of Zimbabwe stands close to the ruins?",
      options: ["Masvingo", "Harare", "Bulawayo", "Mutare"],
      correct: 0,
      fact: "The town was founded as Fort Victoria in 1890, and it was renamed Masvingo after independence, from the Shona name of the ruins.",
      source: { label: "Encyclopaedia Britannica, \"Masvingo\"" },
    },
    {
      question: "Which European power's traders reached the plateau in the 16th century, after the city had been left?",
      options: ["Portugal", "Britain", "France", "The Netherlands"],
      correct: 0,
      fact: "Portuguese captains trading up the Zambezi wrote the first European accounts of the stone walls, long after the court had moved away.",
      source: {
        label: "UNESCO World Heritage List, Great Zimbabwe National Monument",
        url: "https://whc.unesco.org/en/list/364/",
      },
    },
    {
      question: "Why was Great Zimbabwe left in the 15th century?",
      options: ["The gold trade moved north and the land was worn out", "An earthquake destroyed the walls", "The Portuguese burned the city", "A flood covered the ruins"],
      correct: 0,
      fact: "Too many people and too many cattle had worn out the soil, and the gold trade was shifting northward, so the court moved to the Mutapa state.",
      source: {
        label: "UNESCO World Heritage List, Great Zimbabwe National Monument",
        url: "https://whc.unesco.org/en/list/364/",
      },
    },
    {
      question: "Which metal, worked by smiths on the plateau, made the tools and weapons of the city?",
      options: ["Iron", "Bronze", "Tin", "Lead"],
      correct: 0,
      fact: "Iron ore was smelted in furnaces across the plateau, and the smiths who worked it were among the most respected craftsmen of the state.",
      source: {
        label: "UNESCO, General History of Africa, volume III",
        url: "https://www.unesco.org/en/general-history-africa",
      },
    },
  ],
  fr: {
    title: "Grand Zimbabwe",
    subtitle: "La cité de pierre",
    region: "Afrique australe",
    questions: [
      {
        question: "Que signifie le nom Zimbabwe ?",
        options: ["Grande rivière", "Grandes maisons de pierre", "Hautes montagnes", "Terre verte"],
        fact: "Zimbabwe vient de dzimba dza mabwe, qui signifie les grandes maisons de pierre !",
        source: "Encyclopaedia Britannica, notice « Great Zimbabwe »",
      },
      {
        question: "Que commerçait-on au Grand Zimbabwe ?",
        options: ["Uniquement de la nourriture", "De l'or, de l'ivoire et du bétail", "Uniquement des armes", "Uniquement du tissu"],
        fact: "Le Grand Zimbabwe était un riche centre commercial relié à des routes qui atteignaient la Chine et l'Inde !",
        source: "Liste du patrimoine mondial de l'UNESCO, Monument national du Grand Zimbabwe",
      },
      {
        question: "À quelle époque le Grand Zimbabwe était-il à son apogée ?",
        options: ["100 av. J.-C.", "500 apr. J.-C.", "1100 à 1450 apr. J.-C.", "1800 apr. J.-C."],
        fact: "À son apogée, plus de 18 000 personnes vivaient dans le Grand Zimbabwe et alentour !",
        source: "Liste du patrimoine mondial de l'UNESCO, Monument national du Grand Zimbabwe",
      },
      {
        question: "Qu'avaient de particulier les murs du Grand Zimbabwe ?",
        options: ["Ils étaient en bois", "Ils étaient construits sans mortier", "Ils étaient en argile", "Ils étaient peints en or"],
        fact: "Les murs étaient faits de blocs de granit ajustés les uns aux autres sans le moindre mortier, une vraie prouesse d'ingénierie !",
        source: "Liste du patrimoine mondial de l'UNESCO, Monument national du Grand Zimbabwe",
      },
      {
        question: "Quelle célèbre sculpture d'oiseau a été retrouvée au Grand Zimbabwe ?",
        options: ["Un aigle", "L'oiseau du Zimbabwe", "Un flamant rose", "Un perroquet"],
        fact: "L'oiseau du Zimbabwe est aujourd'hui l'emblème national du pays et il figure sur son drapeau !",
        source: "Liste du patrimoine mondial de l'UNESCO, Monument national du Grand Zimbabwe",
      },
      {
        question: "À quel peuple appartenaient les bâtisseurs du Grand Zimbabwe ?",
        options: ["Les Zoulous", "Les Shona", "Les Xhosa", "Les Ndébélés"],
        fact: "Ce sont les Shona qui ont bâti et habité le Grand Zimbabwe, et leurs descendants vivent toujours au Zimbabwe !",
        source: "Encyclopaedia Britannica, notice « Shona »",
      },
      {
        question: "On a retrouvé de la porcelaine chinoise au Grand Zimbabwe. Qu'est-ce que cela nous apprend ?",
        options: ["Que des Chinois l'ont construit", "Que le Zimbabwe commerçait à travers l'océan Indien", "Que c'était un cadeau de l'Égypte", "Que la porcelaine était fabriquée sur place"],
        fact: "Les objets chinois et persans retrouvés au Grand Zimbabwe prouvent qu'il était relié aux vastes réseaux commerciaux de l'océan Indien !",
        source: "Liste du patrimoine mondial de l'UNESCO, Monument national du Grand Zimbabwe",
      },
      {
        question: "La grande enceinte du Grand Zimbabwe est la plus vaste construction ancienne au sud du Sahara. Quelle hauteur atteignent ses murs ?",
        options: ["3 mètres", "6 mètres", "11 mètres", "20 mètres"],
        fact: "Les murs de la grande enceinte montent jusqu'à 11 mètres et s'étendent sur plus de 250 mètres, bâtis avec plus d'un million de blocs de granit !",
        source: "Liste du patrimoine mondial de l'UNESCO, Monument national du Grand Zimbabwe",
      },
      {
        question: "Quelle civilisation les colonisateurs européens du XIXe siècle attribuaient-ils faussement au Grand Zimbabwe ?",
        options: ["Les Romains", "Les Phéniciens ou le peuple de la reine de Saba", "Les Grecs", "Les Perses"],
        fact: "Des théories coloniales racistes refusaient aux Africains la paternité du Grand Zimbabwe et l'attribuaient aux Phéniciens ou à la reine de Saba, ce que l'archéologie a entièrement démenti !",
        source: "Liste du patrimoine mondial de l'UNESCO, Monument national du Grand Zimbabwe",
      },
      {
        question: "Qu'était l'État du Mutapa, qui a succédé à la puissance du Grand Zimbabwe ?",
        options: ["Un royaume d'Afrique de l'Ouest", "Un royaume shona successeur qui contrôlait le commerce de l'or", "Une colonie égyptienne", "Une cité-État swahilie"],
        fact: "Le royaume du Mutapa est né après le déclin du Grand Zimbabwe et a contrôlé le plateau riche en or jusqu'à l'intervention portugaise au XVIIe siècle !",
        source: "UNESCO, Histoire générale de l'Afrique, volume IV",
      },
      {
        question: "À l'intérieur de la grande enceinte se dresse une haute construction pleine, sans entrée. Quelle est sa forme ?",
        options: ["Une tour conique", "Un obélisque", "Une pyramide", "Une colonnade"],
        fact: "La tour conique pleine de la grande enceinte mesure environ 9 mètres de haut, et les archéologues débattent encore de sa fonction exacte !",
        source: "Liste du patrimoine mondial de l'UNESCO, Monument national du Grand Zimbabwe",
      },
      {
        question: "Vers quelle période le Grand Zimbabwe a-t-il été largement abandonné ?",
        options: ["Au début des années 1200", "Au milieu des années 1400", "À la fin des années 1700", "Au début des années 1900"],
        fact: "Vers 1450, la cité était presque abandonnée car les routes commerciales s'étaient déplacées et les terres alentour étaient épuisées ; le pouvoir est passé à l'État du Mutapa !",
        source: "UNESCO, Histoire générale de l'Afrique, volume IV",
      },
      {
        question: "Dans quelle pierre les sculptures de l'oiseau du Zimbabwe ont-elles été taillées ?",
        options: ["La stéatite", "Le marbre", "Le granit", "Le grès"],
        fact: "Huit oiseaux de stéatite ont été retrouvés au Grand Zimbabwe, ils comptent parmi les œuvres d'art les plus célèbres de l'Afrique australe précoloniale !",
        source: "Liste du patrimoine mondial de l'UNESCO, Monument national du Grand Zimbabwe",
      },
      {
        question: "Quel royaume du Limpopo, daté d'environ 1075 à 1220, a précédé le Grand Zimbabwe ?",
        options: ["Mapungubwe", "Kilwa", "Djenné", "Sofala"],
        fact: "Mapungubwe commerçait l'ivoire et l'or avec la côte et est considéré comme le premier royaume de la région dont le Grand Zimbabwe a hérité.",
        source: "Liste du patrimoine mondial de l'UNESCO, Paysage culturel de Mapungubwe",
      },
      {
        question: "Sur quoi les rois du Grand Zimbabwe ont-ils bâti leur résidence principale ?",
        options: ["Le complexe de la colline", "Une île fluviale", "Un lac artificiel", "Une dune de sable"],
        fact: "Le complexe de la colline était le centre royal et rituel, et le Grand Enclos, en contrebas, abritait les épouses du roi et les cérémonies les plus importantes.",
        source: "Liste du patrimoine mondial de l'UNESCO, Monument national du Grand Zimbabwe",
      },
      {
        question: "Quels petits objets importés, faits de verre, servaient de parure et de richesse au Grand Zimbabwe ?",
        options: ["Les perles de verre", "Les pièces de monnaie", "Les miroirs", "Les clous de fer"],
        fact: "Des milliers de perles de verre ont été retrouvées dans les ruines, et elles remontaient la côte depuis l'Inde et l'Arabie par la route de l'or.",
        source: "Liste du patrimoine mondial de l'UNESCO, Monument national du Grand Zimbabwe",
      },
      {
        question: "Dans quelle pierre, trouvée dans les collines alentour, les murs du Grand Zimbabwe ont-ils été bâtis ?",
        options: ["Le granite", "Le marbre", "Le grès", "Le calcaire"],
        fact: "Les bâtisseurs fendaient le granite des collines en blocs plats et les posaient si régulièrement que les murs ondulent sans jamais tomber.",
        source: "Liste du patrimoine mondial de l'UNESCO, Monument national du Grand Zimbabwe",
      },
      {
        question: "Quelle ville actuelle du Zimbabwe se trouve près des ruines ?",
        options: ["Masvingo", "Harare", "Bulawayo", "Mutare"],
        fact: "La ville a été fondée en 1890 sous le nom de Fort Victoria, et elle a été rebaptisée Masvingo après l'indépendance, d'après le nom shona des ruines.",
        source: "Encyclopaedia Britannica, notice « Masvingo »",
      },
      {
        question: "Quelle puissance européenne a atteint le plateau au XVIe siècle, après l'abandon de la cité ?",
        options: ["Le Portugal", "La Grande-Bretagne", "La France", "Les Pays-Bas"],
        fact: "Les capitaines portugais qui commerçaient sur le Zambèze ont écrit les premiers récits européens des murs de pierre, longtemps après le départ de la cour.",
        source: "Liste du patrimoine mondial de l'UNESCO, Monument national du Grand Zimbabwe",
      },
      {
        question: "Pourquoi le Grand Zimbabwe a-t-il été abandonné au XVe siècle ?",
        options: ["Le commerce de l'or s'est déplacé au nord et la terre était épuisée", "Un tremblement de terre a détruit les murs", "Les Portugais ont brûlé la cité", "Une inondation a recouvert les ruines"],
        fact: "Trop de monde et trop de bétail avaient épuisé le sol, et le commerce de l'or remontait vers le nord, si bien que la cour s'est installée dans l'État du Mutapa.",
        source: "Liste du patrimoine mondial de l'UNESCO, Monument national du Grand Zimbabwe",
      },
      {
        question: "Quel métal, travaillé par les forgerons du plateau, faisait les outils et les armes de la cité ?",
        options: ["Le fer", "Le bronze", "L'étain", "Le plomb"],
        fact: "Le minerai de fer était fondu dans des fourneaux sur tout le plateau, et les forgerons qui le travaillaient comptaient parmi les artisans les plus respectés de l'État.",
        source: "UNESCO, Histoire générale de l'Afrique, volume III",
      },
    ],
  },
};
