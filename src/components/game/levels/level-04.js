/**
 * Mali Empire: one level of the game, on its own.
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
import { Coins } from "lucide-react";

export default {
  id: 4,
  order: 12,
  era: "medieval",
  from: 1235,
  title: "Mali Empire",
  subtitle: "Mansa Musa's Golden Age",
  region: "West Africa",
  color: "from-yellow-500 to-orange-500",
  icon: Coins,
  gallery: {
    en: [
      {
        file: "/photos/level-4-1.jpg",
        caption: "The Great Mosque of Djenne, rebuilt in 1907 and repaired by hand every year.",
        credit: "Andy Gilham · CC BY-SA 3.0 · Wikimedia Commons",
        author: "Andy Gilham",
        licence: "CC BY-SA 3.0",
        source: "https://commons.wikimedia.org/wiki/File:Great_Mosque_of_Djenn%C3%A9_1.jpg",
      },
      {
        file: "/photos/level-4-2.jpg",
        caption: "The Sankore mosque in Timbuktu, at the heart of its university.",
        credit: "Ondřej Havelka · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Ondřej Havelka",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Sankore_Madrasah.jpg",
      },
      {
        file: "/photos/level-4-3.jpg",
        caption: "A manuscript of Timbuktu, one of thousands kept by local families.",
        credit: "Mark Fischer · CC BY-SA 2.0 · Wikimedia Commons",
        author: "Mark Fischer",
        licence: "CC BY-SA 2.0",
        source: "https://commons.wikimedia.org/wiki/File:Timbuktu_Manuscript_(48522180467).jpg",
      },
    ],
    fr: [
      {
        file: "/photos/level-4-1.jpg",
        caption: "La grande mosquée de Djenné, reconstruite en 1907 et réparée à la main chaque année.",
        credit: "Andy Gilham · CC BY-SA 3.0 · Wikimedia Commons",
        author: "Andy Gilham",
        licence: "CC BY-SA 3.0",
        source: "https://commons.wikimedia.org/wiki/File:Great_Mosque_of_Djenn%C3%A9_1.jpg",
      },
      {
        file: "/photos/level-4-2.jpg",
        caption: "La mosquée Sankoré à Tombouctou, au cœur de son université.",
        credit: "Ondřej Havelka · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Ondřej Havelka",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Sankore_Madrasah.jpg",
      },
      {
        file: "/photos/level-4-3.jpg",
        caption: "Un manuscrit de Tombouctou, l'un des milliers conservés par les familles.",
        credit: "Mark Fischer · CC BY-SA 2.0 · Wikimedia Commons",
        author: "Mark Fischer",
        licence: "CC BY-SA 2.0",
        source: "https://commons.wikimedia.org/wiki/File:Timbuktu_Manuscript_(48522180467).jpg",
      },
    ],
  },
  study: {
    en: {
      essay: ["In the thirteenth century, Sundiata Keita united the Mandinka kingdoms and founded an empire that reached from the Atlantic to the bend of the Niger. Its wealth came from two things everybody needed, gold from the forests of the south and salt from the mines of the Sahara, and the empire taxed both as they passed through.", "Its cities became centres of learning. Timbuktu and Djenne drew students and jurists from across the western Sudan, and the books copied and sold there are still kept in the city. The scholars of Sankore wrote on law, astronomy, medicine and history, and the trade in manuscripts was a trade like any other, with its own market and its own prices.", "Mansa Musa, who ruled in the fourteenth century, is remembered for his pilgrimage to Mecca. He took so much gold with him that its price in Cairo fell for years, and he came back with architects, scholars and books. His journey put the empire on the maps of Europe, where a king of Mali appears holding a gold nugget.", "After the death of its strongest kings the subject peoples broke away one by one. Songhai took the cities of the Niger bend in the fifteenth century, and the empire that had held the whole western Sudan shrank back to its Mandinka heartland, where its memory was kept by the griots and by the epic of Sundiata."],
      timeline: [
        { year: "c. 1235", text: "Sundiata Keita wins at Kirina and the empire of Mali is founded." },
        {
          year: "1324",
          text: "Mansa Musa makes his pilgrimage and spends so much gold that Cairo's price falls.",
        },
        {
          year: "c. 1327",
          text: "The Sankore mosque and its schools make Timbuktu a centre of learning.",
        },
        {
          year: "1353",
          text: "Ibn Battuta travels through Mali and describes its court and its customs.",
        },
        { year: "c. 1468", text: "Songhai takes Timbuktu and Mali loses the cities of the Niger bend." },
      ],
      people: [
        {
          name: "Sundiata Keita",
          text: "The founder of the empire, remembered in the epic of the Mandinka.",
        },
        {
          name: "Mansa Musa",
          text: "The pilgrim king whose gold shook the price of the metal in Cairo.",
        },
        {
          name: "Ibn Battuta",
          text: "The traveller from Tangier whose account is one of the best pictures of Mali.",
        },
        { name: "Sonni Ali", text: "The Songhai king who took Timbuktu from the empire of Mali." },
      ],
      places: [
        { name: "Niani", text: "The capital of the empire, on a tributary of the upper Niger." },
        {
          name: "Timbuktu",
          text: "The city of the Sankore schools, the book trade and the desert caravans.",
        },
        {
          name: "Djenne",
          text: "The market town with the great mud mosque, at the edge of the inland delta.",
        },
        { name: "Gao", text: "The eastern end of the Niger trade, later the capital of Songhai." },
      ],
      glossary: [
        { term: "mansa", text: "The Mande word for king, the title the rulers of Mali carried." },
        {
          term: "griot",
          text: "The hereditary storyteller and musician who kept the history of a family.",
        },
        {
          term: "trans-Saharan trade",
          text: "The caravan route that carried salt south and gold north.",
        },
        { term: "Sankore", text: "The mosque and school of Timbuktu where the scholars taught." },
        {
          term: "inland delta",
          text: "The wide marsh of the Niger where the river spreads out before the desert.",
        },
      ],
    },
    fr: {
      essay: ["Au XIIIe siècle, Soundjata Keïta a unifié les royaumes mandingues et fondé un empire qui allait de l'Atlantique à la boucle du Niger. Sa richesse venait de deux produits dont tout le monde avait besoin, l'or des forêts du sud et le sel des mines du Sahara, et l'empire taxait l'un et l'autre à leur passage.", "Ses villes sont devenues des centres de savoir. Tombouctou et Djenné attiraient étudiants et juristes de tout le Soudan occidental, et les livres copiés et vendus là sont encore conservés dans la ville. Les lettrés de Sankoré écrivaient sur le droit, l'astronomie, la médecine et l'histoire, et le commerce des manuscrits était un commerce comme un autre, avec son marché et ses prix.", "Mansa Moussa, qui a régné au XIVe siècle, reste connu pour son pèlerinage à La Mecque. Il emportait tant d'or que son prix a baissé au Caire pendant des années, et il est revenu avec des architectes, des savants et des livres. Son voyage a mis l'empire sur les cartes d'Europe, où un roi du Mali apparaît tenant une pépite.", "Après la mort de ses rois les plus forts, les peuples soumis se sont détachés l'un après l'autre. Le Songhaï a pris les villes de la boucle du Niger au XVe siècle, et l'empire qui avait tenu tout le Soudan occidental s'est replié sur son coeur mandingue, où sa mémoire a été gardée par les griots et par l'épopée de Soundjata."],
      timeline: [
        { year: "v. 1235", text: "Soundjata Keïta l'emporte à Kirina et l'empire du Mali est fondé." },
        {
          year: "1324",
          text: "Mansa Moussa fait son pèlerinage et dépense tant d'or que son prix baisse au Caire.",
        },
        {
          year: "v. 1327",
          text: "La mosquée de Sankoré et ses écoles font de Tombouctou un centre de savoir.",
        },
        { year: "1353", text: "Ibn Battuta traverse le Mali et en décrit la cour et les coutumes." },
        {
          year: "v. 1468",
          text: "Le Songhaï prend Tombouctou et le Mali perd les villes de la boucle du Niger.",
        },
      ],
      people: [
        { name: "Soundjata Keïta", text: "Le fondateur de l'empire, chanté dans l'épopée mandingue." },
        {
          name: "Mansa Moussa",
          text: "Le roi pèlerin dont l'or a fait chuter le prix du métal au Caire.",
        },
        {
          name: "Ibn Battuta",
          text: "Le voyageur de Tanger, dont le récit est l'un des meilleurs portraits du Mali.",
        },
        { name: "Sonni Ali", text: "Le roi songhaï qui a pris Tombouctou à l'empire du Mali." },
      ],
      places: [
        { name: "Niani", text: "La capitale de l'empire, sur un affluent du haut Niger." },
        {
          name: "Tombouctou",
          text: "La ville des écoles de Sankoré, du commerce du livre et des caravanes du désert.",
        },
        {
          name: "Djenné",
          text: "La ville-marché à la grande mosquée de terre, à la lisière du delta intérieur.",
        },
        {
          name: "Gao",
          text: "Le terminus oriental du commerce du Niger, plus tard capitale du Songhaï.",
        },
      ],
      glossary: [
        { term: "mansa", text: "Le mot mandé pour roi, le titre que portaient les souverains du Mali." },
        {
          term: "griot",
          text: "Le conteur et musicien héréditaire qui gardait l'histoire d'une famille.",
        },
        {
          term: "commerce transsaharien",
          text: "La route caravanière qui portait le sel vers le sud et l'or vers le nord.",
        },
        { term: "Sankoré", text: "La mosquée et l'école de Tombouctou où enseignaient les lettrés." },
        {
          term: "delta intérieur",
          text: "La vaste zone marécageuse où le Niger s'étale avant le désert.",
        },
      ],
    },
  },
  questions: [
    {
      question: "Who was the richest person in history from the Mali Empire?",
      options: ["Sundiata Keita", "Mansa Musa", "Askia Muhammad", "Shaka Zulu"],
      correct: 1,
      fact: "Mansa Musa was so rich that when he visited Cairo, he gave away so much gold it crashed the gold market for years!",
      source: { label: "Encyclopaedia Britannica, \"Musa I of Mali\"" },
    },
    {
      question: "What famous city of learning was part of the Mali Empire?",
      options: ["Cairo", "Timbuktu", "Cape Town", "Nairobi"],
      correct: 1,
      fact: "Timbuktu had one of the world's oldest universities and housed hundreds of thousands of manuscripts!",
      source: { label: "UNESCO World Heritage List, Timbuktu", url: "https://whc.unesco.org/en/list/119/" },
    },
    {
      question: "Who founded the Mali Empire?",
      options: ["Mansa Musa", "Sundiata Keita", "Ibn Battuta", "Askia the Great"],
      correct: 1,
      fact: "Sundiata Keita is known as the 'Lion King' of Mali and his story inspired many legends!",
      source: { label: "Encyclopaedia Britannica, \"Sundiata Keita\"" },
    },
    {
      question: "What religion did Mansa Musa follow?",
      options: ["Christianity", "Islam", "Traditional African religions", "Buddhism"],
      correct: 1,
      fact: "Mansa Musa made a famous pilgrimage to Mecca in 1324 with thousands of followers!",
      source: { label: "Encyclopaedia Britannica, \"Musa I of Mali\"" },
    },
    {
      question: "The Mali Empire was rich because of trade in what two things?",
      options: ["Fish and wood", "Gold and salt", "Iron and copper", "Silk and spices"],
      correct: 1,
      fact: "Salt was so valuable in West Africa that it was sometimes worth its weight in gold!",
      source: { label: "Encyclopaedia Britannica, \"Mali empire\"" },
    },
    {
      question: "Mansa Musa's pilgrimage to Mecca in 1324 included an enormous entourage. Approximately how many people accompanied him?",
      options: ["1,000", "10,000", "60,000", "500,000"],
      correct: 2,
      fact: "Mansa Musa traveled with an estimated 60,000 people including soldiers, servants, and 12,000 enslaved people carrying gold!",
      source: { label: "Encyclopaedia Britannica, \"Musa I of Mali\"" },
    },
    {
      question: "The University of Sankore in Timbuktu could accommodate how many students at its peak?",
      options: ["500", "5,000", "25,000", "100,000"],
      correct: 2,
      fact: "Sankore University had up to 25,000 students, it was one of the largest universities in the medieval world!",
      source: { label: "UNESCO World Heritage List, Timbuktu", url: "https://whc.unesco.org/en/list/119/" },
    },
    {
      question: "The epic of Sundiata Keita describes his childhood disability. What was it?",
      options: ["He was blind", "He could not walk until age 7", "He could not speak", "He was deaf"],
      correct: 1,
      fact: "According to legend, Sundiata could not walk until age 7, then rose to become the greatest warrior-king of West Africa!",
      source: { label: "Encyclopaedia Britannica, \"Sundiata Keita\"" },
    },
    {
      question: "Which trans-Saharan trade route connected the Mali Empire to North Africa and the Mediterranean world?",
      options: ["The Silk Road", "The Gold Road through Sijilmasa", "The Incense Route", "The Amber Road"],
      correct: 1,
      fact: "The route through Sijilmasa (Morocco) was the main artery connecting Mali's gold fields to Mediterranean merchants!",
      source: { label: "Encyclopaedia Britannica, \"Mali empire\"" },
    },
    {
      question: "Ibn Battuta, who visited the Mali Empire in 1352, noted what unusual practice at the Malian court?",
      options: ["Everyone wore masks", "Subjects covered themselves in dust when greeting the king", "The king ate alone in public", "Women ran all the markets"],
      correct: 1,
      fact: "Ibn Battuta described subjects prostrating themselves and throwing dust on their heads as a sign of respect before the Mali king!",
      source: { label: "Encyclopaedia Britannica, \"Ibn Battuta\"" },
    },
    {
      question: "Which mosque, built in Timbuktu under Mali rule, is still standing and is a UNESCO World Heritage site?",
      options: ["Djinguereber Mosque", "Great Mosque of Kairouan", "Al-Azhar Mosque", "Blue Mosque"],
      correct: 0,
      fact: "The Djinguereber Mosque was built around 1327 and is one of Timbuktu's most famous landmarks, made largely of mud brick!",
      source: { label: "UNESCO World Heritage List, Timbuktu", url: "https://whc.unesco.org/en/list/119/" },
    },
    {
      question: "What royal title did the rulers of Mali use, meaning 'king of kings'?",
      options: ["Negus", "Mansa", "Sultan", "Pharaoh"],
      correct: 1,
      fact: "The Mali rulers were called Mansa, meaning king of kings; Mansa Musa is the most famous of them!",
      source: { label: "Encyclopaedia Britannica, \"Mali empire\"" },
    },
    {
      question: "Which Saharan settlement, famous for its salt mines, was a key trade partner of the Mali Empire?",
      options: ["Taghaza", "Axum", "Zanzibar", "Djenne"],
      correct: 0,
      fact: "Salt from the mines of Taghaza travelled south by camel caravan and was often traded weight for weight with gold!",
      source: { label: "Encyclopaedia Britannica, \"Mali empire\"" },
    },
    {
      question: "Which town was the capital of the Mali Empire, the seat of the mansa?",
      options: ["Niani", "Timbuktu", "Gao", "Djenne"],
      correct: 0,
      fact: "Niani, on the upper Niger, was the political capital, while Timbuktu grew into the empire's great centre of trade and scholarship.",
      source: { label: "Encyclopaedia Britannica, \"Mali empire\"" },
    },
    {
      question: "What did Mansa Musa's spending do to the price of gold in Cairo?",
      options: ["It lowered it for years", "It doubled it", "It changed nothing", "It made gold illegal"],
      correct: 0,
      fact: "Cairo's chroniclers complained that so much gold was given away in 1324 that its value fell and took more than a decade to recover.",
      source: { label: "Encyclopaedia Britannica, \"Musa I of Mali\"" },
    },
    {
      question: "Which profession keeps the epic of Sundiata and recites it for kings?",
      options: ["The jeli, or griot", "The blacksmith", "The weaver", "The marabout"],
      correct: 0,
      fact: "The jeli remembers the names, the marriages and the wars of the families he serves, and the epic of Sundiata is still sung rather than read.",
      source: {
        label: "UNESCO, General History of Africa, volume IV",
        url: "https://www.unesco.org/en/general-history-africa",
      },
    },
    {
      question: "Which city of the inland delta, whose great mosque is rebuilt in mud by hand each year, belonged to the Mali empire?",
      options: ["Djenne", "Gao", "Niani", "Walata"],
      correct: 0,
      fact: "The mosque of Djenne is the largest building in the world made of mud brick, and a whole town replasters it at the end of every rainy season.",
      source: { label: "Encyclopaedia Britannica, \"Djenne\"" },
    },
    {
      question: "Which Saharan town, south of the salt mines, was where the caravans gathered before crossing the desert for Mali?",
      options: ["Walata", "Bilma", "Ghat", "Ouidah"],
      correct: 0,
      fact: "Walata was the first town a caravan reached after the desert, and its houses were built of the same red stone as the cliffs beside it.",
      source: {
        label: "UNESCO, General History of Africa, volume IV",
        url: "https://www.unesco.org/en/general-history-africa",
      },
    },
    {
      question: "Which history written at Timbuktu is one of our main sources for the empires of the Niger?",
      options: ["The Tarikh al-Sudan", "The Periplus of the Erythraean Sea", "The Kebra Nagast", "The Book of the Dead"],
      correct: 0,
      fact: "The Tarikh al-Sudan was written by a Timbuktu scholar in the 17th century, and its pages are kept with the city's other manuscripts.",
      source: {
        label: "UNESCO, General History of Africa, volume IV",
        url: "https://www.unesco.org/en/general-history-africa",
      },
    },
    {
      question: "Which Timbuktu scholar was taken to Morocco after the invasion of 1591?",
      options: ["Ahmad Baba", "Ibn Battuta", "Al-Bakri", "Leo Africanus"],
      correct: 0,
      fact: "Ahmad Baba wrote on law and on the history of the Sudan, and his exile emptied the city of one of its most respected teachers.",
      source: {
        label: "UNESCO, General History of Africa, volume IV",
        url: "https://www.unesco.org/en/general-history-africa",
      },
    },
    {
      question: "Which script did the scholars of Mali use for their letters and their books?",
      options: ["The Arabic script", "Latin letters", "Ge'ez", "Meroitic"],
      correct: 0,
      fact: "Arabic was the language of the book and of the law, and the works written at Timbuktu are still stored in the city's libraries.",
      source: {
        label: "UNESCO, General History of Africa, volume IV",
        url: "https://www.unesco.org/en/general-history-africa",
      },
    },
  ],
  fr: {
    title: "Empire du Mali",
    subtitle: "L'âge d'or de Mansa Moussa",
    region: "Afrique de l'Ouest",
    questions: [
      {
        question: "Qui était l'homme le plus riche de l'histoire, issu de l'Empire du Mali ?",
        options: ["Soundjata Keïta", "Mansa Moussa", "Askia Muhammad", "Chaka Zoulou"],
        fact: "Mansa Moussa était si riche qu'à son passage au Caire, il a distribué tant d'or que le cours du métal précieux s'est effondré pendant des années !",
        source: "Encyclopaedia Britannica, notice « Musa I of Mali »",
      },
      {
        question: "Quelle célèbre cité du savoir faisait partie de l'Empire du Mali ?",
        options: ["Le Caire", "Tombouctou", "Le Cap", "Nairobi"],
        fact: "Tombouctou abritait l'une des plus anciennes universités du monde et des centaines de milliers de manuscrits !",
        source: "Liste du patrimoine mondial de l'UNESCO, Tombouctou",
      },
      {
        question: "Qui a fondé l'Empire du Mali ?",
        options: ["Mansa Moussa", "Soundjata Keïta", "Ibn Battûta", "Askia le Grand"],
        fact: "Soundjata Keïta est surnommé le roi lion du Mali, et son histoire a inspiré de nombreuses légendes !",
        source: "Encyclopaedia Britannica, notice « Sundiata Keita »",
      },
      {
        question: "Quelle religion pratiquait Mansa Moussa ?",
        options: ["Le christianisme", "L'islam", "Les religions africaines traditionnelles", "Le bouddhisme"],
        fact: "Mansa Moussa a accompli un pèlerinage célèbre à La Mecque en 1324, entouré de milliers de fidèles !",
        source: "Encyclopaedia Britannica, notice « Musa I of Mali »",
      },
      {
        question: "Grâce au commerce de quelles deux marchandises l'Empire du Mali était-il riche ?",
        options: ["Le poisson et le bois", "L'or et le sel", "Le fer et le cuivre", "La soie et les épices"],
        fact: "Le sel était si précieux en Afrique de l'Ouest qu'il valait parfois son poids en or !",
        source: "Encyclopaedia Britannica, notice « Mali empire »",
      },
      {
        question: "Le pèlerinage de Mansa Moussa à La Mecque en 1324 s'est fait avec une suite immense. Combien de personnes l'accompagnaient environ ?",
        options: ["1 000", "10 000", "60 000", "500 000"],
        fact: "Mansa Moussa voyageait avec environ 60 000 personnes, dont des soldats, des serviteurs et 12 000 personnes réduites en esclavage qui portaient l'or !",
        source: "Encyclopaedia Britannica, notice « Musa I of Mali »",
      },
      {
        question: "Combien d'étudiants l'université de Sankoré, à Tombouctou, pouvait-elle accueillir à son apogée ?",
        options: ["500", "5 000", "25 000", "100 000"],
        fact: "L'université de Sankoré comptait jusqu'à 25 000 étudiants, l'une des plus grandes universités du monde médiéval !",
        source: "Liste du patrimoine mondial de l'UNESCO, Tombouctou",
      },
      {
        question: "L'épopée de Soundjata Keïta raconte son handicap d'enfance. Quel était-il ?",
        options: ["Il était aveugle", "Il ne pouvait pas marcher avant l'âge de 7 ans", "Il ne pouvait pas parler", "Il était sourd"],
        fact: "Selon la légende, Soundjata ne marchait pas avant 7 ans, avant de devenir le plus grand roi guerrier d'Afrique de l'Ouest !",
        source: "Encyclopaedia Britannica, notice « Sundiata Keita »",
      },
      {
        question: "Quelle route transsaharienne reliait l'Empire du Mali à l'Afrique du Nord et au monde méditerranéen ?",
        options: ["La route de la soie", "La route de l'or passant par Sijilmassa", "La route de l'encens", "La route de l'ambre"],
        fact: "La route passant par Sijilmassa, au Maroc, était l'artère principale qui reliait les zones aurifères du Mali aux marchands méditerranéens !",
        source: "Encyclopaedia Britannica, notice « Mali empire »",
      },
      {
        question: "Ibn Battûta, qui a visité l'Empire du Mali en 1352, a décrit une coutume surprenante de la cour malienne. Laquelle ?",
        options: ["Tout le monde portait un masque", "Les sujets se couvraient de poussière pour saluer le roi", "Le roi mangeait seul en public", "Les femmes tenaient tous les marchés"],
        fact: "Ibn Battûta décrit des sujets se prosternant et jetant de la poussière sur leur tête en signe de respect devant le roi du Mali !",
        source: "Encyclopaedia Britannica, notice « Ibn Battuta »",
      },
      {
        question: "Quelle mosquée, construite à Tombouctou sous la domination malienne, est toujours debout et classée au patrimoine mondial ?",
        options: ["La mosquée Djinguereber", "La grande mosquée de Kairouan", "La mosquée Al-Azhar", "La mosquée bleue"],
        fact: "La mosquée Djinguereber a été construite vers 1327 et reste l'un des monuments les plus célèbres de Tombouctou, faite en grande partie de briques de terre crue !",
        source: "Liste du patrimoine mondial de l'UNESCO, Tombouctou",
      },
      {
        question: "Quel titre royal, qui signifie roi des rois, portaient les souverains du Mali ?",
        options: ["Négus", "Mansa", "Sultan", "Pharaon"],
        fact: "Les souverains du Mali portaient le titre de Mansa, c'est-à-dire roi des rois, et Mansa Moussa est le plus célèbre d'entre eux !",
        source: "Encyclopaedia Britannica, notice « Mali empire »",
      },
      {
        question: "Quelle cité saharienne, célèbre pour ses mines de sel, était un partenaire commercial essentiel de l'Empire du Mali ?",
        options: ["Taghaza", "Axoum", "Zanzibar", "Djenné"],
        fact: "Le sel des mines de Taghaza descendait vers le sud par caravanes de chameaux et s'échangeait souvent poids pour poids contre de l'or !",
        source: "Encyclopaedia Britannica, notice « Mali empire »",
      },
      {
        question: "Quelle ville était la capitale de l'empire du Mali, le siège du mansa ?",
        options: ["Niani", "Tombouctou", "Gao", "Djenné"],
        fact: "Niani, sur le haut Niger, était la capitale politique, tandis que Tombouctou est devenue le grand centre du commerce et du savoir de l'empire.",
        source: "Encyclopaedia Britannica, notice « Mali empire »",
      },
      {
        question: "Quel effet les dépenses de Mansa Moussa ont-elles eu sur le prix de l'or au Caire ?",
        options: ["Il l'a fait baisser pendant des années", "Il l'a doublé", "Il n'a rien changé", "Il a rendu l'or illégal"],
        fact: "Les chroniqueurs du Caire se plaignaient qu'en 1324 tant d'or avait été distribué que sa valeur avait chuté et qu'il fallut plus de dix ans pour s'en remettre.",
        source: "Encyclopaedia Britannica, notice « Musa I of Mali »",
      },
      {
        question: "Quel métier garde l'épopée de Soundjata et la récite pour les rois ?",
        options: ["Le jeli, ou griot", "Le forgeron", "Le tisserand", "Le marabout"],
        fact: "Le jeli retient les noms, les mariages et les guerres des familles qu'il sert, et l'épopée de Soundjata se chante encore au lieu de se lire.",
        source: "UNESCO, Histoire générale de l'Afrique, volume IV",
      },
      {
        question: "Quelle ville du delta intérieur, dont la grande mosquée est reconstruite en banco à la main chaque année, appartenait à l'empire du Mali ?",
        options: ["Djenné", "Gao", "Niani", "Walata"],
        fact: "La mosquée de Djenné est le plus grand bâtiment du monde en briques de terre crue, et toute une ville la replâtre à la fin de chaque saison des pluies.",
        source: "Encyclopaedia Britannica, notice « Djenne »",
      },
      {
        question: "Quelle ville du Sahara, au sud des mines de sel, était le point de rassemblement des caravanes avant la traversée vers le Mali ?",
        options: ["Walata", "Bilma", "Ghat", "Ouidah"],
        fact: "Walata était la première ville qu'une caravane atteignait après le désert, et ses maisons étaient bâties de la même pierre rouge que les falaises voisines.",
        source: "UNESCO, Histoire générale de l'Afrique, volume IV",
      },
      {
        question: "Quelle histoire écrite à Tombouctou est l'une de nos principales sources sur les empires du Niger ?",
        options: ["Le Tarikh al-Soudan", "Le Périple de la mer Érythrée", "Le Kebra Nagast", "Le Livre des morts"],
        fact: "Le Tarikh al-Soudan a été écrit par un lettré de Tombouctou au XVIIe siècle, et ses pages sont conservées avec les autres manuscrits de la ville.",
        source: "UNESCO, Histoire générale de l'Afrique, volume IV",
      },
      {
        question: "Quel lettré de Tombouctou a été emmené au Maroc après l'invasion de 1591 ?",
        options: ["Ahmad Baba", "Ibn Battuta", "Al-Bakri", "Léon l'Africain"],
        fact: "Ahmad Baba a écrit sur le droit et sur l'histoire du Soudan, et son exil a privé la ville de l'un de ses maîtres les plus respectés.",
        source: "UNESCO, Histoire générale de l'Afrique, volume IV",
      },
      {
        question: "Quelle écriture les lettrés du Mali utilisaient-ils pour leurs lettres et leurs livres ?",
        options: ["L'écriture arabe", "Les lettres latines", "Le guèze", "Le méroïtique"],
        fact: "L'arabe était la langue du livre et du droit, et les œuvres écrites à Tombouctou sont toujours conservées dans les bibliothèques de la ville.",
        source: "UNESCO, Histoire générale de l'Afrique, volume IV",
      },
    ],
  },
};
