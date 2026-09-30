/**
 * Kanem-Bornu and the Hausa Cities: one level of the game, on its own.
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
import { Scroll } from "lucide-react";

export default {
  id: 14,
  order: 8,
  era: "medieval",
  from: 800,
  title: "Kanem-Bornu and the Hausa Cities",
  subtitle: "Riders, scholars and city walls",
  region: "Central Sahel",
  color: "from-lime-600 to-emerald-800",
  icon: Scroll,
  gallery: {
    en: [
      {
        file: "/photos/level-14-1.jpg",
        caption: "The gate of the palace of the emir of Kano, in a Hausa city whose walls and palace date from the 15th century.",
        credit: "Uncle Bash007 · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Uncle Bash007",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Emir's_Palace_Gate%2C_Kano.jpg",
      },
      {
        file: "/photos/level-14-2.jpg",
        caption: "One of the old walls that ringed Kano, raised to shelter the city and its markets.",
        credit: "Anasskoko · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Anasskoko",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Ancient_Walls_of_Kano_Emirate_02.jpg",
      },
      {
        file: "/photos/level-14-3.jpg",
        caption: "The same palace gate as the explorer Parfait-Louis Monteil drew it in 1890.",
        credit: "Monteil, P.-L. · Public domain · Wikimedia Commons",
        author: "Monteil, P.-L.",
        licence: "Public domain",
        source: "https://commons.wikimedia.org/wiki/File:Gate_to_the_palace_of_Sarkin_Kano.jpg",
      },
    ],
    fr: [
      {
        file: "/photos/level-14-1.jpg",
        caption: "La porte du palais de l'émir de Kano, dans une cité haoussa dont les murs et le palais remontent au XVe siècle.",
        credit: "Uncle Bash007 · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Uncle Bash007",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Emir's_Palace_Gate%2C_Kano.jpg",
      },
      {
        file: "/photos/level-14-2.jpg",
        caption: "L'un des vieux murs qui ceinturaient Kano, élevés pour abriter la ville et ses marchés.",
        credit: "Anasskoko · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Anasskoko",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Ancient_Walls_of_Kano_Emirate_02.jpg",
      },
      {
        file: "/photos/level-14-3.jpg",
        caption: "La même porte de palais, telle que l'explorateur Parfait-Louis Monteil la dessina en 1890.",
        credit: "Monteil, P.-L. · domaine public · Wikimedia Commons",
        author: "Monteil, P.-L.",
        licence: "domaine public",
        source: "https://commons.wikimedia.org/wiki/File:Gate_to_the_palace_of_Sarkin_Kano.jpg",
      },
    ],
  },
  study: {
    en: {
      essay: ["South of the Sahara and west of the Nile, two worlds met: the grasslands around Lake Chad and the caravan routes to the Mediterranean. From the lake came fish, grain and cattle, and from the north came horses, salt, cloth and, in time, books and firearms.", "Kanem-Bornu ruled that meeting place for about a thousand years, from the Sayfawa dynasty to the musketeers of Idris Alooma. The kings took the title mai, and their dynasty lasted longer than almost any other in African history, moving its capital west from Kanem to Bornu when the desert pressed on the old one.", "Idris Alooma bought his muskets through the Ottoman empire and trained a corps of riflemen, the first in the central Sudan, and used them with cavalry and with a fleet of canoes on the lake. A chronicle written at his own court describes his wars, his building and his reforms, which makes his reign one of the best documented of the period.", "To the west, the walled cities of the Hausa traded cloth, leather, horses and books behind earthen walls with gates. Their markets were the meeting point of the desert caravans and the forest trade, and several of them, such as the dye pits of Kano, are still open and still working today."],
      timeline: [
        { year: "c. 1000", text: "The Sayfawa dynasty rules Kanem from the north of Lake Chad." },
        { year: "c. 1390", text: "The court moves west to Bornu after losing Kanem." },
        { year: "c. 1570", text: "Idris Alooma arms his army with muskets and reforms the state." },
        { year: "c. 1590", text: "The Bornu chronicle records the wars and the building of the reign." },
        {
          year: "1823",
          text: "Hugh Clapperton reaches the court of Bornu and leaves an account of it.",
        },
      ],
      people: [
        {
          name: "Idris Alooma",
          text: "The mai who armed a corps of musketeers and reformed the state.",
        },
        {
          name: "The Sayfawa",
          text: "The dynasty that ruled Kanem and then Bornu for a thousand years.",
        },
        { name: "Mai Dunama", text: "The king who strengthened the dynasty in the thirteenth century." },
        {
          name: "Hugh Clapperton",
          text: "The British explorer who reached the court of Bornu in 1823.",
        },
      ],
      places: [
        { name: "Ngazargamu", text: "The capital of Bornu, founded when the court moved west." },
        { name: "Lake Chad", text: "The freshwater lake whose grasslands and fish fed the kingdom." },
        { name: "Kano", text: "The greatest of the Hausa cities, with its dye pits and its market." },
        { name: "Takedda", text: "The Saharan town whose copper and salt joined the routes south." },
      ],
      glossary: [
        { term: "mai", text: "The title of the kings of Kanem-Bornu." },
        { term: "Hausa", text: "The language and the people of the walled cities west of Lake Chad." },
        { term: "musketeer", text: "A soldier armed with a firearm, the corps Idris Alooma trained." },
        { term: "city wall", text: "The earthen rampart with gates that ringed a Hausa city." },
        {
          term: "kola",
          text: "The forest nut carried north and chewed through the Sahel as a stimulant.",
        },
      ],
    },
    fr: {
      essay: ["Au sud du Sahara et à l'ouest du Nil, deux mondes se rencontraient : les savanes autour du lac Tchad et les routes caravanières vers la Méditerranée. Du lac venaient le poisson, le grain et le bétail, et du nord venaient les chevaux, le sel, les tissus et, avec le temps, les livres et les armes à feu.", "Kanem-Bornou a gouverné ce carrefour pendant environ mille ans, de la dynastie sayfawa aux mousquetaires d'Idriss Alooma. Les rois portaient le titre de maï, et leur dynastie a duré plus longtemps que presque toute autre de l'histoire africaine, déplaçant sa capitale de l'est du Kanem vers le Bornou quand le désert a pressé l'ancienne.", "Idriss Alooma achetait ses mousquets par l'Empire ottoman et entraînait un corps de fusiliers, le premier du Soudan central, qu'il employait avec la cavalerie et une flottille de pirogues sur le lac. Une chronique écrite à sa propre cour décrit ses guerres, ses constructions et ses réformes, ce qui fait de son règne l'un des mieux documentés de la période.", "À l'ouest, les cités fortifiées haoussa commerçaient tissus, cuir, chevaux et livres derrière des murs de terre percés de portes. Leurs marchés étaient le point de rencontre des caravanes du désert et du commerce de la forêt, et plusieurs d'entre eux, comme les fosses de teinture de Kano, sont encore ouverts et encore en usage aujourd'hui."],
      timeline: [
        { year: "v. 1000", text: "La dynastie sayfawa gouverne le Kanem, au nord du lac Tchad." },
        {
          year: "v. 1390",
          text: "La cour se déplace vers l'ouest, au Bornou, après la perte du Kanem.",
        },
        { year: "v. 1570", text: "Idriss Alooma arme son armée de mousquets et réforme l'État." },
        {
          year: "v. 1590",
          text: "La chronique du Bornou rapporte les guerres et les constructions du règne.",
        },
        { year: "1823", text: "Hugh Clapperton atteint la cour du Bornou et en laisse un récit." },
      ],
      people: [
        {
          name: "Idriss Alooma",
          text: "Le maï qui a armé un corps de mousquetaires et réformé l'État.",
        },
        {
          name: "Les Sayfawa",
          text: "La dynastie qui a gouverné le Kanem puis le Bornou mille ans durant.",
        },
        { name: "Maï Doumama", text: "Le roi qui a renforcé la dynastie au XIIIe siècle." },
        {
          name: "Hugh Clapperton",
          text: "L'explorateur britannique qui a atteint la cour du Bornou en 1823.",
        },
      ],
      places: [
        {
          name: "Ngazargamou",
          text: "La capitale du Bornou, fondée lorsque la cour s'est installée à l'ouest.",
        },
        {
          name: "Le lac Tchad",
          text: "Le lac d'eau douce dont les savanes et le poisson nourrissaient le royaume.",
        },
        {
          name: "Kano",
          text: "La plus grande des cités haoussa, avec ses fosses de teinture et son marché.",
        },
        {
          name: "Takedda",
          text: "La ville saharienne dont le cuivre et le sel rejoignaient les routes du sud.",
        },
      ],
      glossary: [
        { term: "maï", text: "Le titre des rois du Kanem-Bornou." },
        { term: "haoussa", text: "La langue et le peuple des cités fortifiées à l'ouest du lac Tchad." },
        {
          term: "mousquetaire",
          text: "Un soldat armé d'une arme à feu, le corps qu'Idriss Alooma a entraîné.",
        },
        { term: "rempart", text: "Le mur de terre percé de portes qui entourait une cité haoussa." },
        {
          term: "kola",
          text: "La noix de la forêt portée vers le nord et mâchée dans tout le Sahel comme stimulant.",
        },
      ],
    },
  },
  questions: [
    {
      question: "Which empire dominated the lands around Lake Chad for about a thousand years?",
      options: ["Kanem-Bornu", "Ghana", "Kongo", "Kilwa"],
      correct: 0,
      fact: "Kanem, north of the lake, and Bornu, to its west, were ruled by the Sayfawa dynasty for roughly a thousand years.",
      source: { label: "Encyclopaedia Britannica, \"Kanem-Bornu\"" },
    },
    {
      question: "Which religion did the kings of Kanem adopt in the 11th century?",
      options: ["Islam", "Christianity", "Hinduism", "Buddhism"],
      correct: 0,
      fact: "Muslim scholars, judges and traders were welcomed at court, and Kanem became a centre of learning in the Sahel.",
      source: { label: "Encyclopaedia Britannica, \"Kanem-Bornu\"" },
    },
    {
      question: "Which ruler of Bornu, reigning from 1580 to 1617, is famous for his wars and his reforms?",
      options: ["Idris Alooma", "Dunama", "Sonni Ali", "Askia Muhammad"],
      correct: 0,
      fact: "Idris Alooma reorganised the army, set the law in writing and kept records, and his reign is remembered as the golden age of Bornu.",
      source: { label: "Encyclopaedia Britannica, \"Kanem-Bornu\"" },
    },
    {
      question: "What new weapon did Idris Alooma obtain through the Ottoman empire?",
      options: ["Muskets and a corps of riflemen", "Steel swords", "Cannons mounted on ships", "War elephants"],
      correct: 0,
      fact: "A Turkish military mission helped train his musketeers, which made Bornu one of the first Sahelian states to use firearms.",
      source: { label: "Encyclopaedia Britannica, \"Kanem-Bornu\"" },
    },
    {
      question: "Which of these was a great Hausa city-state, famous for its walls and its market?",
      options: ["Kano", "Kilwa", "Loango", "Mapungubwe"],
      correct: 0,
      fact: "Kano, Katsina, Zaria, Gobir and Daura were the main Hausa states, each with its own king and its own walled capital.",
      source: { label: "Encyclopaedia Britannica, \"Hausa states\"" },
    },
    {
      question: "What surrounded the Hausa cities to protect them?",
      options: ["Earthen walls with gates", "Moats filled with sea water", "Stone mountains", "Wooden towers"],
      correct: 0,
      fact: "The wall of Kano, the ganuwar Kano, was begun in the 11th century and later stretched for dozens of kilometres.",
      source: { label: "Encyclopaedia Britannica, \"Kano\"" },
    },
    {
      question: "Which market in Kano has been trading since the 15th century?",
      options: ["The Kurmi market", "The gold souk of Taghaza", "The ivory quay of Sofala", "The salt market of Bilma"],
      correct: 0,
      fact: "The Kurmi market was founded in the 15th century under Muhammad Rumfa and it still opens every morning.",
      source: { label: "Encyclopaedia Britannica, \"Kano\"" },
    },
    {
      question: "Which routes carried salt, cloth, horses and books between the Sahel and the Mediterranean?",
      options: ["The trans-Saharan caravan routes", "The monsoon sea routes", "The river boats of the Congo", "The Atlantic sea route"],
      correct: 0,
      fact: "Camels crossed the desert for the best part of two thousand years, and the Hausa cities grew rich on that traffic.",
      source: {
        label: "UNESCO, General History of Africa, volume III",
        url: "https://www.unesco.org/en/general-history-africa",
      },
    },
    {
      question: "Which title did the rulers of Kanem-Bornu carry?",
      options: ["Mai", "Mansa", "Negus", "Oba"],
      correct: 0,
      fact: "The kings of Kanem-Bornu were called mai, and their Sayfawa dynasty ruled the lands around Lake Chad for about a thousand years.",
      source: { label: "Encyclopaedia Britannica, \"Kanem-Bornu\"" },
    },
    {
      question: "In which century did the Sayfawa dynasty begin to rule Kanem?",
      options: ["The 11th century", "The 5th century", "The 16th century", "The 19th century"],
      correct: 0,
      fact: "The Sayfawa kings of Kanem adopted Islam in the 11th century, and their dynasty lasted longer than almost any other in African history.",
      source: { label: "Encyclopaedia Britannica, \"Kanem-Bornu\"" },
    },
    {
      question: "Which Hausa city was a famous centre of Islamic learning, with its own scholars and mosques?",
      options: ["Katsina", "Lagos", "Ouidah", "Massawa"],
      correct: 0,
      fact: "Katsina drew students from across the Sahel and the Sahara, and its scholars wrote on law, grammar and history.",
      source: { label: "Encyclopaedia Britannica, \"Katsina\"" },
    },
    {
      question: "Which people speak the language of Kanem-Bornu?",
      options: ["The Kanuri", "The Soninke", "The Yoruba", "The Swahili"],
      correct: 0,
      fact: "Kanuri is still spoken around Lake Chad, and it carried the words of a thousand-year-old court into the present day.",
      source: { label: "Encyclopaedia Britannica, \"Kanuri\"" },
    },
    {
      question: "Which craft, still practised today, made the leather of Kano famous across the Sahara?",
      options: ["Tanning and dyeing", "Glass blowing", "Paper making", "Silk weaving"],
      correct: 0,
      fact: "Skins were tanned and dyed in pits on the edge of Kano, and the coloured leather travelled north with the caravans.",
      source: { label: "Encyclopaedia Britannica, \"Kano\"" },
    },
    {
      question: "Which mai of Bornu moved the capital to Ngazargamu in the 15th century?",
      options: ["Ali Ghaji", "Idris Alooma", "Dunama", "Osei Tutu"],
      correct: 0,
      fact: "Ali Ghaji rebuilt the state after years of war and made Ngazargamu the seat of a dynasty that lasted until the 19th century.",
      source: { label: "Encyclopaedia Britannica, \"Kanem-Bornu\"" },
    },
    {
      question: "Which desert town, in today's Niger, was the main source of salt for Kanem-Bornu?",
      options: ["Bilma", "Taghaza", "Ghat", "Murzuk"],
      correct: 0,
      fact: "Bilma was the southern anchor of the salt route, and the caravan that left it for Lake Chad was one of the largest of the Sahara.",
      source: { label: "Encyclopaedia Britannica, \"Bilma\"" },
    },
    {
      question: "Which two animals were the wealth of the herdsmen of Kanem?",
      options: ["Cattle and horses", "Reindeer and yaks", "Llamas and alpacas", "Elephants and zebras"],
      correct: 0,
      fact: "Cattle gave the herdsmen their milk and their brides' price, and the horses of the Sahel made the cavalry that held the grassland.",
      source: { label: "Encyclopaedia Britannica, \"Kanem-Bornu\"" },
    },
    {
      question: "What did the scholars of the Hausa cities write and copy in their thousands?",
      options: ["Manuscripts on law, grammar and history", "Printed newspapers", "Novels in French", "Maps of the ocean"],
      correct: 0,
      fact: "The books of Kano and Katsina were copied by hand and sold in the markets, and many of them are still kept in the towns that wrote them.",
      source: {
        label: "UNESCO, General History of Africa, volume III",
        url: "https://www.unesco.org/en/general-history-africa",
      },
    },
    {
      question: "Where did the Sayfawa kings move the centre of their power in the 14th century, when they lost Kanem?",
      options: ["To Bornu, west of Lake Chad", "To Fez in Morocco", "To Cairo", "To the Swahili coast"],
      correct: 0,
      fact: "The court moved west to Bornu and the dynasty took the name of its new province, which is why the kingdom is called Kanem-Bornu.",
      source: { label: "Encyclopaedia Britannica, \"Kanem-Bornu\"" },
    },
    {
      question: "Which language, still spoken across northern Nigeria and southern Niger, was the trade language of the Hausa cities?",
      options: ["Hausa", "Kanuri", "Songhai", "Amharic"],
      correct: 0,
      fact: "Hausa is written in Latin letters today and was written in Arabic script before that, and tens of millions of people still speak it as a first language.",
      source: { label: "Encyclopaedia Britannica, \"Hausa language\"" },
    },
    {
      question: "Which British explorer reached Bornu in 1823 and left an account of its court?",
      options: ["Hugh Clapperton", "Mungo Park", "David Livingstone", "Ibn Battuta"],
      correct: 0,
      fact: "Clapperton crossed the desert from Tripoli with Denham, and their journals are among the first descriptions of Kanem-Bornu from inside.",
      source: { label: "Encyclopaedia Britannica, \"Hugh Clapperton\"" },
    },
    {
      question: "Which forest product did the caravans carry north from the south to the Hausa markets?",
      options: ["Kola nuts", "Olives", "Dates", "Wheat"],
      correct: 0,
      fact: "Kola nuts were chewed across the Sahel for their stimulant, and the trade made the towns on the route rich for centuries.",
      source: { label: "Encyclopaedia Britannica, \"kola nut\"" },
    },
  ],
  fr: {
    title: "Kanem-Bornou et les cités haoussa",
    subtitle: "Cavaliers, savants et remparts",
    region: "Sahel central",
    questions: [
      {
        question: "Quel empire a dominé les rives du lac Tchad pendant environ mille ans ?",
        options: ["Kanem-Bornou", "Le Ghana", "Le Kongo", "Kilwa"],
        fact: "Le Kanem, au nord du lac, et le Bornou, à l'ouest, ont été gouvernés par la dynastie sayfawa pendant près de mille ans.",
        source: "Encyclopaedia Britannica, notice « Kanem-Bornu »",
      },
      {
        question: "Quelle religion les rois du Kanem ont-ils adoptée au XIe siècle ?",
        options: ["L'islam", "Le christianisme", "L'hindouisme", "Le bouddhisme"],
        fact: "Savants, juges et marchands musulmans étaient accueillis à la cour, et le Kanem est devenu un foyer de savoir du Sahel.",
        source: "Encyclopaedia Britannica, notice « Kanem-Bornu »",
      },
      {
        question: "Quel souverain du Bornou, qui a régné de 1580 à 1617, est célèbre pour ses guerres et ses réformes ?",
        options: ["Idris Alooma", "Dunama", "Sonni Ali", "Askia Muhammad"],
        fact: "Idris Alooma a réorganisé l'armée, mis la loi par écrit et tenu des registres, et son règne reste l'âge d'or du Bornou.",
        source: "Encyclopaedia Britannica, notice « Kanem-Bornu »",
      },
      {
        question: "Quelle nouvelle arme Idris Alooma a-t-il obtenue par l'empire ottoman ?",
        options: ["Des mousquets et un corps de fusiliers", "Des épées d'acier", "Des canons montés sur des navires", "Des éléphants de guerre"],
        fact: "Une mission militaire turque a aidé à entraîner ses mousquetaires, ce qui a fait du Bornou l'un des premiers États sahéliens à utiliser les armes à feu.",
        source: "Encyclopaedia Britannica, notice « Kanem-Bornu »",
      },
      {
        question: "Laquelle de ces villes était une grande cité-État haoussa, célèbre pour ses remparts et son marché ?",
        options: ["Kano", "Kilwa", "Loango", "Mapungubwe"],
        fact: "Kano, Katsina, Zaria, Gobir et Daura étaient les principales cités haoussa, chacune avec son roi et sa capitale fortifiée.",
        source: "Encyclopaedia Britannica, notice « Hausa states »",
      },
      {
        question: "Qu'est-ce qui entourait les cités haoussa pour les protéger ?",
        options: ["Des remparts de terre avec des portes", "Des douves remplies d'eau de mer", "Des montagnes de pierre", "Des tours en bois"],
        fact: "Le rempart de Kano, le ganuwar Kano, a été commencé au XIe siècle et mesurait plus tard des dizaines de kilomètres.",
        source: "Encyclopaedia Britannica, notice « Kano »",
      },
      {
        question: "Quel marché de Kano commerce depuis le XVe siècle ?",
        options: ["Le marché Kurmi", "Le souk de l'or de Taghaza", "Le quai d'ivoire de Sofala", "Le marché du sel de Bilma"],
        fact: "Le marché Kurmi a été fondé au XVe siècle sous Muhammad Rumfa et il ouvre encore chaque matin.",
        source: "Encyclopaedia Britannica, notice « Kano »",
      },
      {
        question: "Quelles routes transportaient le sel, les tissus, les chevaux et les livres entre le Sahel et la Méditerranée ?",
        options: ["Les routes caravanières transsahariennes", "Les routes maritimes de la mousson", "Les pirogues du Congo", "La route maritime atlantique"],
        fact: "Les caravanes de chameaux ont traversé le désert pendant près de deux mille ans, et les cités haoussa se sont enrichies grâce à ce trafic.",
        source: "UNESCO, Histoire générale de l'Afrique, volume III",
      },
      {
        question: "Quel titre portaient les souverains du Kanem-Bornou ?",
        options: ["Mai", "Mansa", "Négus", "Oba"],
        fact: "Les rois du Kanem-Bornou étaient appelés mai, et leur dynastie sayfawa a régné sur les terres autour du lac Tchad pendant environ mille ans.",
        source: "Encyclopaedia Britannica, notice « Kanem-Bornu »",
      },
      {
        question: "À quel siècle la dynastie sayfawa a-t-elle commencé à régner sur le Kanem ?",
        options: ["Au XIe siècle", "Au Ve siècle", "Au XVIe siècle", "Au XIXe siècle"],
        fact: "Les rois sayfawa du Kanem ont adopté l'islam au XIe siècle, et leur dynastie a duré plus longtemps que presque toute autre de l'histoire africaine.",
        source: "Encyclopaedia Britannica, notice « Kanem-Bornu »",
      },
      {
        question: "Quelle ville haoussa était un grand centre de savoir islamique, avec ses savants et ses mosquées ?",
        options: ["Katsina", "Lagos", "Ouidah", "Massawa"],
        fact: "Katsina attirait des étudiants de tout le Sahel et du Sahara, et ses savants écrivaient sur le droit, la grammaire et l'histoire.",
        source: "Encyclopaedia Britannica, notice « Katsina »",
      },
      {
        question: "Quel peuple parle la langue du Kanem-Bornou ?",
        options: ["Les Kanouri", "Les Soninké", "Les Yoruba", "Les Swahili"],
        fact: "Le kanouri se parle encore autour du lac Tchad, et il a porté jusqu'à aujourd'hui les mots d'une cour vieille de mille ans.",
        source: "Encyclopaedia Britannica, notice « Kanuri »",
      },
      {
        question: "Quel métier, encore pratiqué aujourd'hui, a rendu le cuir de Kano célèbre dans tout le Sahara ?",
        options: ["Le tannage et la teinture", "Le soufflage du verre", "La fabrication du papier", "Le tissage de la soie"],
        fact: "Les peaux étaient tannées et teintes dans des fosses à la lisière de Kano, et le cuir coloré partait vers le nord avec les caravanes.",
        source: "Encyclopaedia Britannica, notice « Kano »",
      },
      {
        question: "Quel maï du Bornou a transféré sa capitale à Ngazargamu au XVe siècle ?",
        options: ["Ali Ghaji", "Idriss Alooma", "Dounama", "Osei Toutou"],
        fact: "Ali Ghaji a reconstruit l'État après des années de guerre et a fait de Ngazargamu le siège d'une dynastie qui a duré jusqu'au XIXe siècle.",
        source: "Encyclopaedia Britannica, notice « Kanem-Bornu »",
      },
      {
        question: "Quelle ville du désert, dans le Niger actuel, était la principale source de sel du Kanem-Bornou ?",
        options: ["Bilma", "Taghaza", "Ghat", "Mourzouk"],
        fact: "Bilma était l'ancrage sud de la route du sel, et la caravane qui en partait vers le lac Tchad était l'une des plus grandes du Sahara.",
        source: "Encyclopaedia Britannica, notice « Bilma »",
      },
      {
        question: "Quels deux animaux faisaient la richesse des éleveurs du Kanem ?",
        options: ["Les bovins et les chevaux", "Les rennes et les yacks", "Les lamas et les alpagas", "Les éléphants et les zèbres"],
        fact: "Les bovins donnaient aux éleveurs leur lait et le prix de la mariée, et les chevaux du Sahel formaient la cavalerie qui tenait la savane.",
        source: "Encyclopaedia Britannica, notice « Kanem-Bornu »",
      },
      {
        question: "Que les lettrés des villes haoussa copiaient-ils et écrivaient-ils par milliers ?",
        options: ["Des manuscrits de droit, de grammaire et d'histoire", "Des journaux imprimés", "Des romans en français", "Des cartes de l'océan"],
        fact: "Les livres de Kano et de Katsina étaient copiés à la main et vendus sur les marchés, et beaucoup sont encore conservés dans les villes qui les ont écrits.",
        source: "UNESCO, Histoire générale de l'Afrique, volume III",
      },
      {
        question: "Où les rois sayfawa ont-ils déplacé le centre de leur pouvoir au XIVe siècle, quand ils ont perdu le Kanem ?",
        options: ["Au Bornou, à l'ouest du lac Tchad", "À Fès, au Maroc", "Au Caire", "Sur la côte swahili"],
        fact: "La cour s'est installée à l'ouest, au Bornou, et la dynastie a pris le nom de sa nouvelle province, d'où le nom de Kanem-Bornou.",
        source: "Encyclopaedia Britannica, notice « Kanem-Bornu »",
      },
      {
        question: "Quelle langue, encore parlée dans le nord du Nigeria et le sud du Niger, était la langue de commerce des cités haoussa ?",
        options: ["Le haoussa", "Le kanouri", "Le songhaï", "L'amharique"],
        fact: "Le haoussa s'écrit aujourd'hui en lettres latines et s'écrivait auparavant en caractères arabes, et des dizaines de millions de personnes le parlent encore comme langue maternelle.",
        source: "Encyclopaedia Britannica, notice « Hausa language »",
      },
      {
        question: "Quel explorateur britannique a atteint le Bornou en 1823 et laissé un récit de sa cour ?",
        options: ["Hugh Clapperton", "Mungo Park", "David Livingstone", "Ibn Battuta"],
        fact: "Clapperton a traversé le désert depuis Tripoli avec Denham, et leurs carnets comptent parmi les premières descriptions du Kanem-Bornou vues de l'intérieur.",
        source: "Encyclopaedia Britannica, notice « Hugh Clapperton »",
      },
      {
        question: "Quel produit de la forêt les caravanes remontaient-elles du sud vers les marchés haoussa ?",
        options: ["Les noix de kola", "Les olives", "Les dattes", "Le blé"],
        fact: "Les noix de kola se mâchaient dans tout le Sahel pour leur effet stimulant, et ce commerce a enrichi les villes de la route pendant des siècles.",
        source: "Encyclopaedia Britannica, notice « kola nut »",
      },
    ],
  },
};
