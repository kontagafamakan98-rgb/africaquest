/**
 * The Swahili Coast: one level of the game, on its own.
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
import { Ship } from "lucide-react";

export default {
  id: 15,
  order: 11,
  era: "medieval",
  from: 900,
  title: "The Swahili Coast",
  subtitle: "Kilwa, Zanzibar and the monsoon trade",
  region: "East African coast",
  color: "from-cyan-500 to-teal-700",
  icon: Ship,
  gallery: {
    en: [
      {
        file: "/photos/level-15-1.jpg",
        caption: "The great mosque of Kilwa Kisiwani, built and rebuilt between the 11th and the 18th century.",
        credit: "Richard Mortel · CC BY 2.0 · Wikimedia Commons",
        author: "Richard Mortel",
        licence: "CC BY 2.0",
        source: "https://commons.wikimedia.org/wiki/File:Great_Mosque_of_Kilwa_Kisiwani%2C_11th_-_18th_cents_(20)_(28781091310).jpg",
      },
      {
        file: "/photos/level-15-2.jpg",
        caption: "A carved wooden door of Stone Town, in Zanzibar, studded with brass like those of the monsoon traders.",
        credit: "Eric Kilby · CC BY-SA 2.0 · Wikimedia Commons",
        author: "Eric Kilby",
        licence: "CC BY-SA 2.0",
        source: "https://commons.wikimedia.org/wiki/File:Ornate_Carved_Door_in_Zanzibar.jpg",
      },
      {
        file: "/photos/level-15-3.jpg",
        caption: "The ruined palace of the sultans of Kilwa, which travellers compared to a great city of stone.",
        credit: "David Stanley · CC BY 2.0 · Wikimedia Commons",
        author: "David Stanley",
        licence: "CC BY 2.0",
        source: "https://commons.wikimedia.org/wiki/File:Kilwa_Kisiwani_Palace_(33433637294).jpg",
      },
    ],
    fr: [
      {
        file: "/photos/level-15-1.jpg",
        caption: "La grande mosquée de Kilwa Kisiwani, bâtie et rebâtie entre le XIe et le XVIIIe siècle.",
        credit: "Richard Mortel · CC BY 2.0 · Wikimedia Commons",
        author: "Richard Mortel",
        licence: "CC BY 2.0",
        source: "https://commons.wikimedia.org/wiki/File:Great_Mosque_of_Kilwa_Kisiwani%2C_11th_-_18th_cents_(20)_(28781091310).jpg",
      },
      {
        file: "/photos/level-15-2.jpg",
        caption: "Une porte de bois sculptée de Stone Town, à Zanzibar, cloutée de laiton comme celles des marchands de la mousson.",
        credit: "Eric Kilby · CC BY-SA 2.0 · Wikimedia Commons",
        author: "Eric Kilby",
        licence: "CC BY-SA 2.0",
        source: "https://commons.wikimedia.org/wiki/File:Ornate_Carved_Door_in_Zanzibar.jpg",
      },
      {
        file: "/photos/level-15-3.jpg",
        caption: "Le palais en ruine des sultans de Kilwa, que des voyageurs comparaient à une grande cité de pierre.",
        credit: "David Stanley · CC BY 2.0 · Wikimedia Commons",
        author: "David Stanley",
        licence: "CC BY 2.0",
        source: "https://commons.wikimedia.org/wiki/File:Kilwa_Kisiwani_Palace_(33433637294).jpg",
      },
    ],
  },
  study: {
    en: {
      essay: ["The monsoon blew the dhows south in one season and north in the other, and along that rhythm a string of ports grew on the East African coast. A ship that sailed with the wind could make the round trip in a year, and the harbours, the wells and the coral lime houses were built for that traffic.", "Kilwa traded the gold of the interior for Chinese porcelain and Persian pottery, and Ibn Battuta called it one of the finest towns in the world. Its great mosque, its palace of Husuni Kubwa and its coral walls were paid for by the gold that came down from the plateau and was loaded at Sofala.", "Each town had its sultan, its great mosque and its houses built from coral lime, and each one answered to the same winds, the same language and the same faith. Mombasa, Malindi, Kilwa and the smaller ports shared traders, scholars and marriages, and a person could sail from one to the next and be understood everywhere.", "Gold came down from the Zimbabwe plateau to Sofala, and the dhows carried it to Arabia, India and China, where a fleet under the admiral Zheng He reached the coast in the fifteenth century. The Swahili spoke a Bantu language, wrote it in Arabic script, and built a shared culture that still defines the coast."],
      timeline: [
        { year: "c. 900", text: "Merchants of the Persian Gulf settle at Kilwa and on the coast." },
        {
          year: "c. 1000",
          text: "The Swahili towns mint their own coins and build their great mosques.",
        },
        { year: "c. 1331", text: "Ibn Battuta visits Kilwa and praises its buildings and its people." },
        { year: "c. 1415", text: "A Chinese fleet under Zheng He reaches the coast." },
        { year: "1505", text: "The Portuguese take Kilwa and Mombasa and the old trade is broken." },
      ],
      people: [
        {
          name: "Ibn Battuta",
          text: "The traveller who called Kilwa one of the finest towns in the world.",
        },
        {
          name: "Zheng He",
          text: "The Chinese admiral whose fleet reached the coast in the fifteenth century.",
        },
        {
          name: "The sultans of Kilwa",
          text: "The rulers whose coins and buildings made the town rich.",
        },
        { name: "Al-Hasan ibn Sulaiman", text: "The sultan of Kilwa who built the Great Mosque." },
      ],
      places: [
        {
          name: "Kilwa",
          text: "The island port whose gold trade made it the richest town on the coast.",
        },
        { name: "Mombasa", text: "The second great harbour, on the Kenyan coast." },
        { name: "Sofala", text: "The southern port that took the gold of the plateau." },
        {
          name: "Husuni Kubwa",
          text: "The palace of the sultan of Kilwa, one of the largest buildings in Africa.",
        },
      ],
      glossary: [
        { term: "Swahili", text: "The Bantu language of the coast, written in Arabic script." },
        { term: "dhow", text: "The lateen sailed ship of the Indian Ocean monsoon trade." },
        { term: "monsoon", text: "The wind that blows south in one season and north in the other." },
        { term: "sultanate", text: "A state ruled by a sultan." },
        { term: "coral rag", text: "The building stone cut from old coral and set in lime mortar." },
      ],
    },
    fr: {
      essay: ["La mousson poussait les boutres vers le sud pendant une saison et vers le nord pendant l'autre, et sur ce rythme une chaîne de ports a grandi sur la côte est-africaine. Un navire qui naviguait avec le vent pouvait faire l'aller et le retour en une année, et les ports, les puits et les maisons de corail étaient bâtis pour ce trafic.", "Kilwa échangeait l'or de l'intérieur contre de la porcelaine chinoise et de la poterie perse, et Ibn Battuta l'a décrite comme l'une des plus belles villes du monde. Sa grande mosquée, son palais de Husuni Kubwa et ses murs de corail étaient payés par l'or qui descendait du plateau et qu'on chargeait à Sofala.", "Chaque ville avait son sultan, sa grande mosquée et ses maisons liées au corail, et chacune répondait aux mêmes vents, à la même langue et à la même foi. Mombasa, Malindi, Kilwa et les ports plus petits partageaient marchands, savants et mariages, et l'on pouvait naviguer de l'un à l'autre en étant compris partout.", "L'or descendait du plateau du Zimbabwe vers Sofala, et les boutres le portaient en Arabie, en Inde et en Chine, où une flotte commandée par l'amiral Zheng He a atteint la côte au XVe siècle. Les Swahili parlaient une langue bantoue, l'écrivaient en caractères arabes et ont bâti une culture commune qui définit encore la côte."],
      timeline: [
        { year: "v. 900", text: "Des marchands du golfe Persique s'installent à Kilwa et sur la côte." },
        {
          year: "v. 1000",
          text: "Les villes swahili frappent leurs propres monnaies et bâtissent leurs grandes mosquées.",
        },
        { year: "v. 1331", text: "Ibn Battuta visite Kilwa et en loue les bâtiments et les habitants." },
        { year: "v. 1415", text: "Une flotte chinoise commandée par Zheng He atteint la côte." },
        { year: "1505", text: "Les Portugais prennent Kilwa et Mombasa et l'ancien commerce se brise." },
      ],
      people: [
        {
          name: "Ibn Battuta",
          text: "Le voyageur qui a appelé Kilwa l'une des plus belles villes du monde.",
        },
        { name: "Zheng He", text: "L'amiral chinois dont la flotte a atteint la côte au XVe siècle." },
        {
          name: "Les sultans de Kilwa",
          text: "Les souverains dont les monnaies et les bâtiments ont fait la richesse de la ville.",
        },
        {
          name: "Al-Hasan ibn Sulaiman",
          text: "Le sultan de Kilwa qui a fait bâtir la Grande Mosquée.",
        },
      ],
      places: [
        {
          name: "Kilwa",
          text: "Le port de l'île dont le commerce de l'or a fait la ville la plus riche de la côte.",
        },
        { name: "Mombasa", text: "Le second grand port, sur la côte kényane." },
        { name: "Sofala", text: "Le port du sud qui recevait l'or du plateau." },
        {
          name: "Husuni Kubwa",
          text: "Le palais du sultan de Kilwa, l'un des plus grands édifices d'Afrique.",
        },
      ],
      glossary: [
        { term: "swahili", text: "La langue bantoue de la côte, écrite en caractères arabes." },
        { term: "boutre", text: "Le navire à voile latine du commerce de mousson de l'océan Indien." },
        {
          term: "mousson",
          text: "Le vent qui souffle vers le sud pendant une saison et vers le nord pendant l'autre.",
        },
        { term: "sultanat", text: "Un État gouverné par un sultan." },
        {
          term: "corail",
          text: "La pierre de construction taillée dans le vieux corail et liée à la chaux.",
        },
      ],
    },
  },
  questions: [
    {
      question: "Which language developed along the East African coast and was long written in Arabic script?",
      options: ["Swahili", "Amharic", "Ge'ez", "Zulu"],
      correct: 0,
      fact: "Swahili is a Bantu language with many Arabic loan words, born from the meeting of African farmers, fishermen and Muslim traders.",
      source: { label: "Encyclopaedia Britannica, \"Swahili language\"" },
    },
    {
      question: "Which island port, in today's Tanzania, was famous for its great mosque and its gold trade?",
      options: ["Kilwa", "Lamu", "Mombasa", "Sofala"],
      correct: 0,
      fact: "From the 13th to the 16th century, much of the gold and ivory of the interior passed through the port of Kilwa.",
      source: {
        label: "UNESCO World Heritage List, Ruins of Kilwa Kisiwani and Ruins of Songo Mnara",
        url: "https://whc.unesco.org/en/list/144/",
      },
    },
    {
      question: "Which traveller from Tangier described Kilwa in 1331?",
      options: ["Ibn Battuta", "Al-Bakri", "Marco Polo", "Ibn Khaldun"],
      correct: 0,
      fact: "Ibn Battuta called Kilwa one of the most beautiful and best built towns he had seen.",
      source: { label: "Encyclopaedia Britannica, \"Ibn Battuta\"" },
    },
    {
      question: "What did the merchants of the coast buy from the African interior?",
      options: ["Gold, ivory and enslaved people", "Porcelain and silk", "Wheat and olive oil", "Books and horses"],
      correct: 0,
      fact: "Caravans from as far away as the copper belt and the goldfields brought metal, ivory and enslaved people down to the ports.",
      source: {
        label: "UNESCO, General History of Africa, volume IV",
        url: "https://www.unesco.org/en/general-history-africa",
      },
    },
    {
      question: "Which goods from Asia were found in the houses of Swahili merchants?",
      options: ["Chinese porcelain and Persian pottery", "Salt and copper", "Cattle and hides", "Gold and iron"],
      correct: 0,
      fact: "Archaeologists still find Chinese porcelain and Persian earthenware in the ruins of Swahili houses, proof of trade across the Indian Ocean.",
      source: {
        label: "UNESCO World Heritage List, Ruins of Kilwa Kisiwani and Ruins of Songo Mnara",
        url: "https://whc.unesco.org/en/list/144/",
      },
    },
    {
      question: "Which Portuguese navigator reached the East African coast in 1498 on his way to India?",
      options: ["Vasco da Gama", "Christopher Columbus", "Ferdinand Magellan", "James Cook"],
      correct: 0,
      fact: "Vasco da Gama's ships were guided along the coast by a Swahili pilot who knew the monsoon winds.",
      source: { label: "Encyclopaedia Britannica, \"Vasco da Gama\"" },
    },
    {
      question: "What happened to Kilwa in 1505?",
      options: ["It was sacked by the Portuguese", "It was destroyed by an earthquake", "It became the capital of Mali", "It was abandoned by its people"],
      correct: 0,
      fact: "The Portuguese took the town to control the Indian Ocean trade, and the great days of Kilwa came to an end.",
      source: {
        label: "UNESCO World Heritage List, Ruins of Kilwa Kisiwani and Ruins of Songo Mnara",
        url: "https://whc.unesco.org/en/list/144/",
      },
    },
    {
      question: "Which Omani sultan moved his capital to Zanzibar in 1840?",
      options: ["Sayyid Said", "Idris Alooma", "Ewuare", "Fasilides"],
      correct: 0,
      fact: "Zanzibar became the hub of the clove trade and of the caravan routes into the interior, with its own diplomatic relations with Europe.",
      source: { label: "Encyclopaedia Britannica, \"Zanzibar\"" },
    },
    {
      question: "What were the houses of the Swahili trading towns built from?",
      options: ["Coral stone and lime", "Mud brick", "Timber", "Cut granite"],
      correct: 0,
      fact: "Coral rag and lime mortar gave the coastal towns their tall, cool houses, and many of them still stand as ruins along the coast.",
      source: {
        label: "UNESCO World Heritage List, Ruins of Kilwa Kisiwani and Ruins of Songo Mnara",
        url: "https://whc.unesco.org/en/list/144/",
      },
    },
    {
      question: "Which Portuguese fort, built after 1593, still stands on the island of Mombasa?",
      options: ["Fort Jesus", "Elmina Castle", "Cape Coast Castle", "Fort Sao Sebastiao"],
      correct: 0,
      fact: "Fort Jesus guarded the East African coast for Portugal, then for Oman, and it is now a UNESCO World Heritage site.",
      source: {
        label: "UNESCO World Heritage List, Fort Jesus, Mombasa",
        url: "https://whc.unesco.org/en/list/1295/",
      },
    },
    {
      question: "Which sailing ship of the Indian Ocean carried goods on the monsoon winds?",
      options: ["The dhow", "The caravel", "The galleon", "The junk"],
      correct: 0,
      fact: "A dhow has a lateen sail that catches the monsoon, and the same wind carried traders to the coast and home again months later.",
      source: { label: "Encyclopaedia Britannica, \"dhow\"" },
    },
    {
      question: "Which Chinese admiral's fleet reached the East African coast in the 15th century?",
      options: ["Zheng He", "Ibn Battuta", "Marco Polo", "Vasco da Gama"],
      correct: 0,
      fact: "The ships of Zheng He carried porcelain and silk to Malindi and Mogadishu, and brought back a giraffe for the emperor's court.",
      source: { label: "Encyclopaedia Britannica, \"Zheng He\"" },
    },
    {
      question: "Which port in today's Mozambique was the southern end of the gold trade of the coast?",
      options: ["Sofala", "Kilwa", "Lamu", "Massawa"],
      correct: 0,
      fact: "Arab writers knew Sofala as the port where the gold of the interior reached the sea, and the Portuguese took it for the same reason.",
      source: { label: "Encyclopaedia Britannica, \"Sofala\"" },
    },
    {
      question: "Which island town of today's Kenya is the oldest Swahili settlement still lived in?",
      options: ["Lamu", "Zanzibar", "Mombasa", "Songo Mnara"],
      correct: 0,
      fact: "Lamu has been lived in for more than seven hundred years, and its lanes are too narrow for a car.",
      source: {
        label: "UNESCO World Heritage List, Lamu Old Town",
        url: "https://whc.unesco.org/en/list/1055/",
      },
    },
    {
      question: "From which inland region did most of the gold exported by the coast come?",
      options: ["The Zimbabwe plateau", "The Ethiopian highlands", "The Congo basin", "The Rift Valley"],
      correct: 0,
      fact: "Gold from the plateau behind Sofala reached Kilwa by canoe and by caravan, and it paid for the stone houses and the great mosque.",
      source: {
        label: "UNESCO World Heritage List, Great Zimbabwe National Monument",
        url: "https://whc.unesco.org/en/list/364/",
      },
    },
    {
      question: "Which town of the Swahili coast, in today's Somalia, was a great port of the Indian Ocean trade?",
      options: ["Mogadishu", "Lamu", "Sofala", "Massawa"],
      correct: 0,
      fact: "Mogadishu minted its own coins and its merchants traded cloth woven on the coast for the goods of Arabia, India and China.",
      source: { label: "Encyclopaedia Britannica, \"Mogadishu\"" },
    },
    {
      question: "Which crop did the Omani sultans of Zanzibar grow on plantations worked by enslaved people?",
      options: ["Cloves", "Coffee", "Cocoa", "Tea"],
      correct: 0,
      fact: "Clove trees were planted across Zanzibar in the 19th century, and the island became the largest source of cloves in the world.",
      source: { label: "Encyclopaedia Britannica, \"Zanzibar\"" },
    },
    {
      question: "Which river carried the ivory and the gold of the interior down towards Sofala?",
      options: ["The Zambezi", "The Nile", "The Congo", "The Niger"],
      correct: 0,
      fact: "The trade followed the Zambezi and then the paths beside it, and the Portuguese built their fairs at the points where the canoes had to stop.",
      source: { label: "Encyclopaedia Britannica, \"Zambezi River\"" },
    },
    {
      question: "What was Husuni Kubwa, built at Kilwa in the 14th century?",
      options: ["A palace of the sultan", "A Portuguese fort", "A church", "A lighthouse"],
      correct: 0,
      fact: "Husuni Kubwa had more than a hundred rooms, a stepped courtyard and one of the first swimming pools built on the coast.",
      source: {
        label: "UNESCO World Heritage List, Ruins of Kilwa Kisiwani and Ruins of Songo Mnara",
        url: "https://whc.unesco.org/en/list/144/",
      },
    },
    {
      question: "Which language gave Swahili many of its words for trade, religion and the sea?",
      options: ["Arabic", "Latin", "English", "Zulu"],
      correct: 0,
      fact: "Swahili kept its Bantu grammar and took thousands of words from Arabic, which is what makes it the language of a trading coast.",
      source: { label: "Encyclopaedia Britannica, \"Swahili language\"" },
    },
    {
      question: "Which of these countries has a Swahili-speaking population on its coast, far from the East African ports?",
      options: ["Mozambique", "Ghana", "Senegal", "Morocco"],
      correct: 0,
      fact: "The northern coast of Mozambique belonged to the same trading world, and its island ports spoke the same language as Kilwa and Mombasa.",
      source: { label: "Encyclopaedia Britannica, \"Swahili language\"" },
    },
  ],
  fr: {
    title: "La côte swahili",
    subtitle: "Kilwa, Zanzibar et le commerce de mousson",
    region: "Côte est-africaine",
    questions: [
      {
        question: "Quelle langue s'est développée sur la côte est-africaine et s'écrivait autrefois en caractères arabes ?",
        options: ["Le swahili", "L'amharique", "Le guèze", "Le zoulou"],
        fact: "Le swahili est une langue bantoue riche en emprunts arabes, née de la rencontre entre agriculteurs, pêcheurs africains et marchands musulmans.",
        source: "Encyclopaedia Britannica, notice « Swahili language »",
      },
      {
        question: "Quel port insulaire, dans l'actuelle Tanzanie, était célèbre pour sa grande mosquée et son commerce de l'or ?",
        options: ["Kilwa", "Lamu", "Mombasa", "Sofala"],
        fact: "Du XIIIe au XVIe siècle, une grande partie de l'or et de l'ivoire de l'intérieur passait par le port de Kilwa.",
        source: "Liste du patrimoine mondial de l'UNESCO, Ruines de Kilwa Kisiwani et de Songo Mnara",
      },
      {
        question: "Quel voyageur venu de Tanger a décrit Kilwa en 1331 ?",
        options: ["Ibn Battuta", "Al-Bakri", "Marco Polo", "Ibn Khaldoun"],
        fact: "Ibn Battuta a décrit Kilwa comme l'une des villes les plus belles et les mieux bâties qu'il ait vues.",
        source: "Encyclopaedia Britannica, notice « Ibn Battuta »",
      },
      {
        question: "Qu'achetaient les marchands de la côte à l'intérieur de l'Afrique ?",
        options: ["De l'or, de l'ivoire et des personnes réduites en esclavage", "De la porcelaine et de la soie", "Du blé et de l'huile d'olive", "Des livres et des chevaux"],
        fact: "Des caravanes venues de la ceinture du cuivre et des régions aurifères descendaient le métal, l'ivoire et des captifs jusqu'aux ports.",
        source: "UNESCO, Histoire générale de l'Afrique, volume IV",
      },
      {
        question: "Quels produits venus d'Asie a-t-on retrouvés dans les maisons des marchands swahili ?",
        options: ["De la porcelaine chinoise et de la poterie perse", "Du sel et du cuivre", "Du bétail et des peaux", "De l'or et du fer"],
        fact: "Les archéologues trouvent encore de la porcelaine chinoise et de la faïence perse dans les ruines des maisons swahili, preuve du commerce à travers l'océan Indien.",
        source: "Liste du patrimoine mondial de l'UNESCO, Ruines de Kilwa Kisiwani et de Songo Mnara",
      },
      {
        question: "Quel navigateur portugais a atteint la côte est-africaine en 1498 en route vers l'Inde ?",
        options: ["Vasco de Gama", "Christophe Colomb", "Ferdinand Magellan", "James Cook"],
        fact: "Les navires de Vasco de Gama ont été guidés le long de la côte par un pilote swahili qui connaissait les vents de mousson.",
        source: "Encyclopaedia Britannica, notice « Vasco da Gama »",
      },
      {
        question: "Que s'est-il passé à Kilwa en 1505 ?",
        options: ["La ville a été pillée par les Portugais", "Elle a été détruite par un tremblement de terre", "Elle est devenue la capitale du Mali", "Ses habitants l'ont abandonnée"],
        fact: "Les Portugais ont pris la ville pour contrôler le commerce de l'océan Indien, et la grande époque de Kilwa s'est achevée.",
        source: "Liste du patrimoine mondial de l'UNESCO, Ruines de Kilwa Kisiwani et de Songo Mnara",
      },
      {
        question: "Quel sultan omanais a transféré sa capitale à Zanzibar en 1840 ?",
        options: ["Sayyid Saïd", "Idris Alooma", "Ewuare", "Fasilides"],
        fact: "Zanzibar est devenue le centre du commerce des clous de girofle et des routes caravanières vers l'intérieur, avec ses propres relations diplomatiques avec l'Europe.",
        source: "Encyclopaedia Britannica, notice « Zanzibar »",
      },
      {
        question: "En quoi étaient construites les maisons des cités marchandes swahili ?",
        options: ["En pierre de corail et chaux", "En briques de terre", "En bois", "En granite taillé"],
        fact: "Le corail et le mortier de chaux donnaient aux villes côtières leurs maisons hautes et fraîches, dont beaucoup subsistent aujourd'hui en ruines.",
        source: "Liste du patrimoine mondial de l'UNESCO, Ruines de Kilwa Kisiwani et de Songo Mnara",
      },
      {
        question: "Quel fort portugais, bâti après 1593, se dresse encore sur l'île de Mombasa ?",
        options: ["Fort Jesus", "Le château d'Elmina", "Le château de Cape Coast", "Fort São Sebastião"],
        fact: "Fort Jesus a gardé la côte est-africaine pour le Portugal, puis pour Oman, et il est aujourd'hui inscrit au patrimoine mondial.",
        source: "Liste du patrimoine mondial de l'UNESCO, Fort Jesus, Mombasa",
      },
      {
        question: "Quel voilier de l'océan Indien transportait les marchandises grâce aux vents de mousson ?",
        options: ["Le boutre", "La caravelle", "Le galion", "La jonque"],
        fact: "Le boutre porte une voile latine qui capte la mousson, et le même vent ramenait les marchands sur la côte quelques mois plus tard.",
        source: "Encyclopaedia Britannica, notice « dhow »",
      },
      {
        question: "Quelle flotte d'un amiral chinois a atteint la côte est-africaine au XVe siècle ?",
        options: ["Celle de Zheng He", "Celle d'Ibn Battuta", "Celle de Marco Polo", "Celle de Vasco de Gama"],
        fact: "Les navires de Zheng He ont apporté porcelaine et soie à Malindi et à Mogadiscio, et ils ont ramené une girafe pour la cour de l'empereur.",
        source: "Encyclopaedia Britannica, notice « Zheng He »",
      },
      {
        question: "Quel port du Mozambique actuel était le point le plus au sud du commerce de l'or sur la côte ?",
        options: ["Sofala", "Kilwa", "Lamu", "Massawa"],
        fact: "Les auteurs arabes connaissaient Sofala comme le port où l'or de l'intérieur atteignait la mer, et les Portugais s'en sont emparés pour la même raison.",
        source: "Encyclopaedia Britannica, notice « Sofala »",
      },
      {
        question: "Quelle ville insulaire du Kenya actuel est la plus ancienne cité swahili encore habitée ?",
        options: ["Lamu", "Zanzibar", "Mombasa", "Songo Mnara"],
        fact: "Lamu est habitée depuis plus de sept cents ans, et ses ruelles sont trop étroites pour une voiture.",
        source: "Liste du patrimoine mondial de l'UNESCO, Vieille ville de Lamu",
      },
      {
        question: "De quelle région intérieure venait la plus grande partie de l'or exporté par la côte ?",
        options: ["Du plateau du Zimbabwe", "Des hauts plateaux éthiopiens", "Du bassin du Congo", "De la vallée du Rift"],
        fact: "L'or du plateau derrière Sofala atteignait Kilwa en pirogue et en caravane, et il payait les maisons de pierre et la grande mosquée.",
        source: "Liste du patrimoine mondial de l'UNESCO, Monument national du Grand Zimbabwe",
      },
      {
        question: "Quelle ville de la côte swahili, dans l'actuelle Somalie, était un grand port du commerce de l'océan Indien ?",
        options: ["Mogadiscio", "Lamu", "Sofala", "Massawa"],
        fact: "Mogadiscio frappait sa propre monnaie, et ses marchands échangeaient le tissu tissé sur la côte contre les marchandises d'Arabie, d'Inde et de Chine.",
        source: "Encyclopaedia Britannica, notice « Mogadishu »",
      },
      {
        question: "Quelle culture les sultans omanais de Zanzibar faisaient-ils pousser dans des plantations travaillées par des esclaves ?",
        options: ["Le girofle", "Le café", "Le cacao", "Le thé"],
        fact: "Des girofliers ont été plantés dans tout Zanzibar au XIXe siècle, et l'île est devenue la première source de girofle du monde.",
        source: "Encyclopaedia Britannica, notice « Zanzibar »",
      },
      {
        question: "Quel fleuve portait l'ivoire et l'or de l'intérieur vers Sofala ?",
        options: ["Le Zambèze", "Le Nil", "Le Congo", "Le Niger"],
        fact: "Le commerce suivait le Zambèze puis les pistes qui le longent, et les Portugais ont bâti leurs foires là où les pirogues devaient s'arrêter.",
        source: "Encyclopaedia Britannica, notice « Zambezi River »",
      },
      {
        question: "Qu'était Husuni Kubwa, bâti à Kilwa au XIVe siècle ?",
        options: ["Un palais du sultan", "Un fort portugais", "Une église", "Un phare"],
        fact: "Husuni Kubwa comptait plus de cent pièces, une cour en escalier et l'une des premières piscines construites sur la côte.",
        source: "Liste du patrimoine mondial de l'UNESCO, Ruines de Kilwa Kisiwani et de Songo Mnara",
      },
      {
        question: "Quelle langue a donné au swahili beaucoup de ses mots de commerce, de religion et de mer ?",
        options: ["L'arabe", "Le latin", "L'anglais", "Le zoulou"],
        fact: "Le swahili a gardé sa grammaire bantoue et pris des milliers de mots à l'arabe, ce qui en fait la langue d'une côte commerçante.",
        source: "Encyclopaedia Britannica, notice « Swahili language »",
      },
      {
        question: "Lequel de ces pays a une population de langue swahili sur sa côte, loin des ports d'Afrique de l'Est ?",
        options: ["Le Mozambique", "Le Ghana", "Le Sénégal", "Le Maroc"],
        fact: "La côte nord du Mozambique appartenait au même monde commerçant, et ses ports insulaires parlaient la même langue que Kilwa et Mombasa.",
        source: "Encyclopaedia Britannica, notice « Swahili language »",
      },
    ],
  },
};
