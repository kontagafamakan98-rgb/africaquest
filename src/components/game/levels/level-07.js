/**
 * Zulu Kingdom: one level of the game, on its own.
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
import { Shield } from "lucide-react";

export default {
  id: 7,
  order: 22,
  era: "modern",
  from: 1816,
  title: "Zulu Kingdom",
  subtitle: "Warriors of the South",
  region: "Southern Africa",
  color: "from-orange-400 to-red-500",
  icon: Shield,
  gallery: {
    en: [
      {
        file: "/photos/level-7-1.jpg",
        caption: "The battlefield of Isandlwana, where the Zulu army won in 1879.",
        credit: "RedNovember82 · CC BY-SA 3.0 · Wikimedia Commons",
        author: "RedNovember82",
        licence: "CC BY-SA 3.0",
        source: "https://commons.wikimedia.org/wiki/File:Isandlwana_Battlefield.JPG",
      },
      {
        file: "/photos/level-7-2.jpg",
        caption: "King Cetshwayo, who led the Zulu kingdom during the war of 1879.",
        credit: "Carl Rudolph Sohn · Public domain · Wikimedia Commons",
        author: "Carl Rudolph Sohn",
        licence: "Public domain",
        source: "https://commons.wikimedia.org/wiki/File:Cetshwayo%2C_King_of_the_Zulus_(d._1884)%2C_Carl_Rudolph_Sohn%2C_1882.jpg",
      },
      {
        file: "/photos/level-7-3.jpg",
        caption: "A Zulu shield of cowhide, carried with the spear of the royal regiments.",
        credit: "Daderot · Public domain · Wikimedia Commons",
        author: "Daderot",
        licence: "Public domain",
        source: "https://commons.wikimedia.org/wiki/File:Shield%2C_Zulu%2C_Southern_Africa%2C_cow_hide_-_Peabody_Museum%2C_Harvard_University_-_DSC05996.jpg",
      },
    ],
    fr: [
      {
        file: "/photos/level-7-1.jpg",
        caption: "Le champ de bataille d'Isandlwana, où l'armée zouloue l'emporta en 1879.",
        credit: "RedNovember82 · CC BY-SA 3.0 · Wikimedia Commons",
        author: "RedNovember82",
        licence: "CC BY-SA 3.0",
        source: "https://commons.wikimedia.org/wiki/File:Isandlwana_Battlefield.JPG",
      },
      {
        file: "/photos/level-7-2.jpg",
        caption: "Le roi Cetshwayo, qui mena le royaume zoulou pendant la guerre de 1879.",
        credit: "Carl Rudolph Sohn · domaine public · Wikimedia Commons",
        author: "Carl Rudolph Sohn",
        licence: "domaine public",
        source: "https://commons.wikimedia.org/wiki/File:Cetshwayo%2C_King_of_the_Zulus_(d._1884)%2C_Carl_Rudolph_Sohn%2C_1882.jpg",
      },
      {
        file: "/photos/level-7-3.jpg",
        caption: "Un bouclier zoulou en cuir de vache, porté avec la sagaie des régiments royaux.",
        credit: "Daderot · domaine public · Wikimedia Commons",
        author: "Daderot",
        licence: "domaine public",
        source: "https://commons.wikimedia.org/wiki/File:Shield%2C_Zulu%2C_Southern_Africa%2C_cow_hide_-_Peabody_Museum%2C_Harvard_University_-_DSC05996.jpg",
      },
    ],
  },
  study: {
    en: {
      essay: ["In the hills of what is now KwaZulu-Natal, a young chief named Shaka turned a small clan into a kingdom in the early nineteenth century. He organised the army by age, so that men served together all their lives, and had the regiments live in royal towns that answered to the king alone.", "He shortened the throwing spear into a stabbing weapon for close fighting, and drilled the regiments to advance behind their shields in a closed line. The amabutho, the age regiments, were the nation in arms: young men served in them before they could marry, and the king held the cattle and the land in trust for all.", "After Shaka died in 1828 the kingdom held its ground against Boer trekkers and then against British columns. At the Ncome river in 1838 the Zulu army defeated a Boer commando, and in 1879 Cetshwayo's regiments destroyed a British camp at Isandlwana on the same day.", "The kingdom could not replace what it lost in that war, and Ulundi was burnt the same year. Zululand was divided into thirteen chiefdoms, then annexed to Natal in 1897, and its name survives in the province of KwaZulu-Natal."],
      timeline: [
        { year: "c. 1816", text: "Shaka becomes chief of the Zulu and begins to build a kingdom." },
        { year: "1828", text: "Shaka dies and Dingane takes the throne." },
        { year: "1838", text: "Zulu regiments defeat a Boer commando at the Ncome river." },
        { year: "1879", text: "The British invade; the army wins at Isandlwana and Ulundi is burnt." },
        { year: "1897", text: "Zululand is annexed to Natal and the kingdom ends." },
      ],
      people: [
        { name: "Shaka", text: "The chief who built the Zulu kingdom and remade its army." },
        { name: "Dingane", text: "Shaka's successor, who faced the Boer trekkers." },
        { name: "Cetshwayo", text: "The king whose army destroyed the British camp at Isandlwana." },
        { name: "Mpande", text: "The king who ruled between Dingane and Cetshwayo." },
      ],
      places: [
        { name: "Ulundi", text: "The royal town and the seat of the kingdom, burnt in 1879." },
        { name: "Isandlwana", text: "The hill where the Zulu army destroyed a British column." },
        { name: "The Ncome", text: "The river where the Voortrekkers were defeated in 1838." },
        { name: "KwaZulu-Natal", text: "The province that carries the name of the kingdom today." },
      ],
      glossary: [
        {
          term: "amabutho",
          text: "The age regiments, the young men who served the king before they could marry.",
        },
        { term: "iklwa", text: "The short stabbing spear introduced for close fighting." },
        { term: "induna", text: "An officer or a chief appointed by the king." },
        { term: "kraal", text: "A homestead, or a royal enclosure of huts." },
        { term: "Voortrekker", text: "A Boer settler who moved inland from the Cape in the 1830s." },
      ],
    },
    fr: {
      essay: ["Dans les collines de l'actuel KwaZulu-Natal, un jeune chef nommé Shaka a transformé un petit clan en royaume au début du XIXe siècle. Il a organisé l'armée par classes d'âge, si bien que les hommes servaient ensemble toute leur vie, et installé les régiments dans des villes royales qui ne répondaient qu'au roi.", "Il a raccourci la lance de jet en arme d'estoc pour le combat rapproché, et il a entraîné les régiments à avancer derrière leurs boucliers en ligne serrée. Les amabutho, les régiments d'âge, étaient la nation en armes : les jeunes hommes y servaient avant de pouvoir se marier, et le roi détenait le bétail et la terre pour tous.", "Après la mort de Shaka en 1828, le royaume a tenu tête aux trekboers puis aux colonnes britanniques. À la rivière Ncome en 1838, l'armée zouloue a défait un commando boer, et en 1879 les régiments de Cetshwayo ont détruit un camp britannique à Isandlwana le même jour.", "Le royaume ne pouvait pas remplacer ce qu'il avait perdu dans cette guerre, et Ulundi a été brûlé la même année. Le Zoulouland a été partagé en treize chefferies, puis annexé au Natal en 1897, et son nom survit dans la province du KwaZulu-Natal."],
      timeline: [
        { year: "v. 1816", text: "Shaka devient chef des Zoulous et commence à bâtir un royaume." },
        { year: "1828", text: "Shaka meurt et Dingane prend le trône." },
        { year: "1838", text: "Les régiments zoulous défont un commando boer à la rivière Ncome." },
        {
          year: "1879",
          text: "Les Britanniques envahissent le pays ; l'armée gagne à Isandlwana et Ulundi est brûlé.",
        },
        { year: "1897", text: "Le Zoulouland est annexé au Natal et le royaume prend fin." },
      ],
      people: [
        { name: "Shaka", text: "Le chef qui a bâti le royaume zoulou et refondu son armée." },
        { name: "Dingane", text: "Le successeur de Shaka, qui a affronté les trekboers." },
        { name: "Cetshwayo", text: "Le roi dont l'armée a détruit le camp britannique d'Isandlwana." },
        { name: "Mpande", text: "Le roi qui a gouverné entre Dingane et Cetshwayo." },
      ],
      places: [
        { name: "Ulundi", text: "La ville royale et le siège du royaume, brûlée en 1879." },
        { name: "Isandlwana", text: "La colline où l'armée zouloue a détruit une colonne britannique." },
        { name: "La Ncome", text: "La rivière où les Voortrekkers ont été défaits en 1838." },
        { name: "KwaZulu-Natal", text: "La province qui porte aujourd'hui le nom du royaume." },
      ],
      glossary: [
        {
          term: "amabutho",
          text: "Les régiments d'âge, les jeunes hommes qui servaient le roi avant de pouvoir se marier.",
        },
        { term: "iklwa", text: "La lance courte d'estoc introduite pour le combat rapproché." },
        { term: "induna", text: "Un officier ou un chef nommé par le roi." },
        { term: "kraal", text: "Un enclos d'habitations, ou l'enceinte royale des cases." },
        {
          term: "Voortrekker",
          text: "Un colon boer parti du Cap vers l'intérieur dans les années 1830.",
        },
      ],
    },
  },
  questions: [
    {
      question: "Who was the famous leader who united the Zulu people?",
      options: ["Nelson Mandela", "Shaka Zulu", "Mansa Musa", "Haile Selassie"],
      correct: 1,
      fact: "Shaka Zulu transformed a small clan into one of the most powerful nations in southern Africa!",
      source: { label: "Encyclopaedia Britannica, \"Shaka\"" },
    },
    {
      question: "What fighting formation did Shaka Zulu create?",
      options: ["Circle formation", "Bull horn formation", "Square formation", "Line formation"],
      correct: 1,
      fact: "The 'horns of the buffalo' formation surrounded enemies from both sides!",
      source: { label: "Encyclopaedia Britannica, \"Shaka\"" },
    },
    {
      question: "Where was the Zulu Kingdom located?",
      options: ["Nigeria", "Kenya", "South Africa", "Egypt"],
      correct: 2,
      fact: "The Zulu Kingdom was in what is now KwaZulu-Natal province in South Africa!",
      source: {
        label: "South African History Online, The Zulu Kingdom",
        url: "https://sahistory.org.za/article/zulu-kingdom-and-colony-natal",
      },
    },
    {
      question: "What weapon was most associated with Zulu warriors?",
      options: ["Bow and arrow", "Short stabbing spear (iklwa)", "Sword", "Cannon"],
      correct: 1,
      fact: "The iklwa spear was named after the sound it made, Shaka invented this close-combat weapon!",
      source: { label: "Encyclopaedia Britannica, \"Shaka\"" },
    },
    {
      question: "The Zulu famously defeated the British in which 1879 battle?",
      options: ["Battle of Waterloo", "Battle of Isandlwana", "Battle of Hastings", "Battle of Adwa"],
      correct: 1,
      fact: "At Isandlwana, 20,000 Zulu warriors defeated a well-armed British force, a stunning victory!",
      source: { label: "Encyclopaedia Britannica, \"Battle of Isandlwana\"" },
    },
    {
      question: "The same day as Isandlwana, the British successfully defended which small outpost against 4,000 Zulu warriors?",
      options: ["Ulundi", "Rorke's Drift", "Durban", "Pretoria"],
      correct: 1,
      fact: "At Rorke's Drift, just 150 British soldiers held off 4,000 Zulu warriors, 11 Victoria Crosses were awarded, the most for any single engagement!",
      source: { label: "Encyclopaedia Britannica, \"Battle of Rorke's Drift\"" },
    },
    {
      question: "Shaka Zulu abolished a traditional Zulu custom requiring warriors to do what before they could marry?",
      options: ["Build their own home", "Pay cattle to the bride's father", "Kill a lion", "Serve 10 years in the army"],
      correct: 3,
      fact: "Shaka reformed the age-regiment system, warriors could not marry until he gave permission, keeping them loyal to the state rather than families!",
      source: { label: "Encyclopaedia Britannica, \"Shaka\"" },
    },
    {
      question: "What was the name of the Zulu king who fought the British at the Anglo-Zulu War in 1879?",
      options: ["Shaka", "Dingane", "Cetshwayo", "Mpande"],
      correct: 2,
      fact: "King Cetshwayo kaMpande led the Zulu nation during the 1879 war, he was later captured, exiled to London, and met Queen Victoria!",
      source: { label: "Encyclopaedia Britannica, \"Cetshwayo\"" },
    },
    {
      question: "The 'Mfecane' (crushing/scattering) refers to a period of widespread chaos triggered partly by Zulu expansion. Which regions were most affected?",
      options: ["North Africa and Egypt", "Southern and Central Africa", "East Africa coast", "West Africa"],
      correct: 1,
      fact: "The Mfecane displaced millions across southern and central Africa in the 1820s-1830s, creating new kingdoms like the Sotho nation and Swazi kingdom!",
      source: { label: "Encyclopaedia Britannica, \"Mfecane\"" },
    },
    {
      question: "Shaka's assassination in 1828 was carried out by whom?",
      options: ["British soldiers", "His half-brothers Dingane and Mhlangana", "A rival Zulu chief", "His personal bodyguard"],
      correct: 1,
      fact: "Shaka was stabbed to death by his half-brothers Dingane and Mhlangana, with the help of his personal servant, ending his 12-year reign!",
      source: { label: "Encyclopaedia Britannica, \"Shaka\"" },
    },
    {
      question: "Shaka organized his warriors into age-based regiments. What were these regiments called?",
      options: ["Amabutho", "Induna", "Isibongo", "Kraal"],
      correct: 0,
      fact: "The amabutho system grouped young men by age and trained them as full-time soldiers loyal to the king rather than to local chiefs!",
      source: { label: "Encyclopaedia Britannica, \"Shaka\"" },
    },
    {
      question: "Who succeeded Shaka as king of the Zulu after his assassination in 1828?",
      options: ["Dingane", "Mpande", "Cetshwayo", "Senzangakhona"],
      correct: 0,
      fact: "Dingane ruled from 1828 until 1840, when he was defeated by his half-brother Mpande and the Boers!",
      source: {
        label: "South African History Online, The Zulu Kingdom",
        url: "https://sahistory.org.za/article/zulu-kingdom-and-colony-natal",
      },
    },
    {
      question: "What happened to Zululand after the Anglo-Zulu War of 1879?",
      options: ["It remained fully independent", "It was divided into chiefdoms and later annexed by Britain", "It became part of Mozambique", "It was returned to Shaka's heirs"],
      correct: 1,
      fact: "Britain split Zululand into thirteen chiefdoms after 1879 and finally annexed it in 1897, ending Zulu independence!",
      source: {
        label: "South African History Online, The Zulu Kingdom",
        url: "https://sahistory.org.za/article/zulu-kingdom-and-colony-natal",
      },
    },
    {
      question: "Who was Shaka's father, the chief of the small Zulu clan before him?",
      options: ["Senzangakhona", "Dingane", "Mpande", "Cetshwayo"],
      correct: 0,
      fact: "Shaka was the son of Senzangakhona, and it was from that single small clan that he built a kingdom that shook southern Africa.",
      source: { label: "Encyclopaedia Britannica, \"Shaka\"" },
    },
    {
      question: "Which battle in 1838 did the Boers win against the Zulu at the Ncome river?",
      options: ["The Battle of Blood River", "The Battle of Ulundi", "The Battle of Isandlwana", "The Battle of Adwa"],
      correct: 0,
      fact: "At Blood River, a Boer laager held off a far larger Zulu force, and the defeat led Dingane to lose his throne to Mpande.",
      source: { label: "Encyclopaedia Britannica, \"Battle of Blood River\"" },
    },
    {
      question: "Which river marks the southern edge of Zululand?",
      options: ["The Tugela", "The Orange", "The Zambezi", "The Limpopo"],
      correct: 0,
      fact: "The Tugela separated Zululand from Natal, and the crossings of the river were watched by both the Zulu kings and the British colony.",
      source: { label: "Encyclopaedia Britannica, \"Zululand\"" },
    },
    {
      question: "Which royal homestead of the Zulu kings, the capital of Cetshwayo, was burnt after the last battle of the war?",
      options: ["Ulundi", "Isandlwana", "Rorke's Drift", "Ncome"],
      correct: 0,
      fact: "British troops burned Ulundi in 1879, and with the royal homestead gone the war was over and the kingdom was broken up.",
      source: { label: "Encyclopaedia Britannica, \"Ulundi\"" },
    },
    {
      question: "Which people, moving inland from the Cape in the 1830s, clashed with the Zulu kingdom?",
      options: ["The Voortrekkers", "The British navy", "The Portuguese", "The Swahili traders"],
      correct: 0,
      fact: "The Voortrekkers crossed the Drakensberg looking for land, and their defeat at Blood River changed the balance between the two peoples.",
      source: { label: "Encyclopaedia Britannica, \"Voortrekker\"" },
    },
    {
      question: "Which province of modern South Africa joins the kingdom's name to that of a colonial territory?",
      options: ["KwaZulu-Natal", "Gauteng", "Limpopo", "Free State"],
      correct: 0,
      fact: "The province was created in 1994 by joining the Zulu homeland to Natal, and its name keeps both histories side by side.",
      source: { label: "Encyclopaedia Britannica, \"KwaZulu-Natal\"" },
    },
    {
      question: "Which rival kingdom did Shaka's army defeat at Gqokli Hill in 1818?",
      options: ["The Ndwandwe", "The British", "The Boers", "The Xhosa"],
      correct: 0,
      fact: "The Ndwandwe under Zwide were the strongest power in the region, and their defeat left Shaka free to build the Zulu kingdom.",
      source: { label: "Encyclopaedia Britannica, \"Shaka\"" },
    },
    {
      question: "What did the British demand of Cetshwayo at the end of 1878, before they invaded?",
      options: ["The surrender of men accused of border raids", "A share of the gold mines", "Rights to the coast", "A yearly tribute in cattle"],
      correct: 0,
      fact: "The ultimatum asked for far more than the border dispute it was said to settle, and it was written to be refused.",
      source: { label: "Encyclopaedia Britannica, \"Cetshwayo\"" },
    },
  ],
  fr: {
    title: "Royaume zoulou",
    subtitle: "Les guerriers du Sud",
    region: "Afrique australe",
    questions: [
      {
        question: "Quel chef célèbre a unifié le peuple zoulou ?",
        options: ["Nelson Mandela", "Chaka Zoulou", "Mansa Moussa", "Hailé Sélassié"],
        fact: "Chaka Zoulou a transformé un petit clan en l'une des nations les plus puissantes d'Afrique australe !",
        source: "Encyclopaedia Britannica, notice « Shaka »",
      },
      {
        question: "Quelle formation de combat Chaka Zoulou a-t-il créée ?",
        options: ["La formation en cercle", "La formation en cornes de buffle", "La formation en carré", "La formation en ligne"],
        fact: "La formation en cornes de buffle encerclait l'ennemi en le prenant sur les deux ailes !",
        source: "Encyclopaedia Britannica, notice « Shaka »",
      },
      {
        question: "Où se trouvait le royaume zoulou ?",
        options: ["Au Nigeria", "Au Kenya", "En Afrique du Sud", "En Égypte"],
        fact: "Le royaume zoulou se trouvait dans l'actuelle province du KwaZulu-Natal, en Afrique du Sud !",
        source: "South African History Online, The Zulu Kingdom",
      },
      {
        question: "Quelle arme est le plus souvent associée aux guerriers zoulous ?",
        options: ["L'arc et les flèches", "La lance courte de corps à corps, l'iklwa", "L'épée", "Le canon"],
        fact: "La lance iklwa tirait son nom du bruit qu'elle faisait, et Chaka a inventé cette arme de corps à corps !",
        source: "Encyclopaedia Britannica, notice « Shaka »",
      },
      {
        question: "Lors de quelle bataille de 1879 les Zoulous ont-ils vaincu les Britanniques ?",
        options: ["La bataille de Waterloo", "La bataille d'Isandhlwana", "La bataille de Hastings", "La bataille d'Adoua"],
        fact: "À Isandhlwana, 20 000 guerriers zoulous ont vaincu une force britannique bien armée, une victoire stupéfiante !",
        source: "Encyclopaedia Britannica, notice « Battle of Isandlwana »",
      },
      {
        question: "Le jour même d'Isandhlwana, quel petit poste les Britanniques ont-ils défendu avec succès contre 4 000 guerriers zoulous ?",
        options: ["Ouloundi", "Rorke's Drift", "Durban", "Pretoria"],
        fact: "À Rorke's Drift, seulement 150 soldats britanniques ont repoussé 4 000 guerriers zoulous, et 11 croix de Victoria ont été décernées, un record pour un seul combat !",
        source: "Encyclopaedia Britannica, notice « Battle of Rorke's Drift »",
      },
      {
        question: "Quelle obligation les guerriers zoulous devaient-ils remplir avant de pouvoir se marier ?",
        options: ["Construire leur propre maison", "Payer du bétail au père de la mariée", "Tuer un lion", "Servir 10 ans dans l'armée"],
        fact: "Chaka a réformé le système des régiments d'âge : les guerriers ne pouvaient pas se marier sans son autorisation, ce qui les rendait loyaux à l'État plutôt qu'à leur famille !",
        source: "Encyclopaedia Britannica, notice « Shaka »",
      },
      {
        question: "Comment s'appelait le roi zoulou qui a combattu les Britanniques pendant la guerre anglo-zouloue de 1879 ?",
        options: ["Chaka", "Dingane", "Cetshwayo", "Mpande"],
        fact: "Le roi Cetshwayo kaMpande a dirigé la nation zouloue pendant la guerre de 1879, avant d'être capturé, exilé à Londres et de rencontrer la reine Victoria !",
        source: "Encyclopaedia Britannica, notice « Cetshwayo »",
      },
      {
        question: "Le Mfecane, période de grands bouleversements en partie liée à l'expansion zouloue, a surtout touché quelles régions ?",
        options: ["L'Afrique du Nord et l'Égypte", "L'Afrique australe et centrale", "La côte d'Afrique de l'Est", "L'Afrique de l'Ouest"],
        fact: "Le Mfecane a déplacé des millions de personnes en Afrique australe et centrale dans les années 1820-1830, donnant naissance à de nouveaux royaumes comme la nation sotho et le royaume swazi !",
        source: "Encyclopaedia Britannica, notice « Mfecane »",
      },
      {
        question: "Par qui Chaka a-t-il été assassiné en 1828 ?",
        options: ["Des soldats britanniques", "Ses demi-frères Dingane et Mhlangana", "Un chef zoulou rival", "Son garde du corps"],
        fact: "Chaka a été poignardé par ses demi-frères Dingane et Mhlangana, aidés de son serviteur personnel, ce qui a mis fin à ses douze années de règne !",
        source: "Encyclopaedia Britannica, notice « Shaka »",
      },
      {
        question: "Chaka a organisé ses guerriers en régiments fondés sur l'âge. Comment s'appelaient ces régiments ?",
        options: ["Les amabutho", "Les induna", "Les isibongo", "Les kraal"],
        fact: "Le système des amabutho regroupait les jeunes hommes par âge et les formait comme soldats à plein temps, loyaux au roi plutôt qu'aux chefs locaux !",
        source: "Encyclopaedia Britannica, notice « Shaka »",
      },
      {
        question: "Qui a succédé à Chaka comme roi des Zoulous après son assassinat en 1828 ?",
        options: ["Dingane", "Mpande", "Cetshwayo", "Senzangakhona"],
        fact: "Dingane a régné de 1828 à 1840, avant d'être vaincu par son demi-frère Mpande et les Boers !",
        source: "South African History Online, The Zulu Kingdom",
      },
      {
        question: "Qu'est-il arrivé au Zoulouland après la guerre anglo-zouloue de 1879 ?",
        options: ["Il est resté totalement indépendant", "Il a été divisé en chefferies puis annexé par la Grande-Bretagne", "Il est devenu une partie du Mozambique", "Il a été rendu aux héritiers de Chaka"],
        fact: "La Grande-Bretagne a divisé le Zoulouland en treize chefferies après 1879 et l'a finalement annexé en 1897, mettant fin à l'indépendance zouloue !",
        source: "South African History Online, The Zulu Kingdom",
      },
      {
        question: "Qui était le père de Chaka, chef du petit clan zoulou avant lui ?",
        options: ["Senzangakhona", "Dingane", "Mpande", "Cetshwayo"],
        fact: "Chaka était le fils de Senzangakhona, et c'est de ce seul petit clan qu'il a bâti un royaume qui a ébranlé l'Afrique australe.",
        source: "Encyclopaedia Britannica, notice « Shaka »",
      },
      {
        question: "Quelle bataille de 1838 les Boers ont-ils remportée contre les Zoulous à la rivière Ncome ?",
        options: ["La bataille de Blood River", "La bataille d'Ulundi", "La bataille d'Isandlwana", "La bataille d'Adoua"],
        fact: "À Blood River, un laager boer a repoussé une force zouloue bien plus nombreuse, et cette défaite a coûté son trône à Dingane, au profit de Mpande.",
        source: "Encyclopaedia Britannica, notice « Battle of Blood River »",
      },
      {
        question: "Quel fleuve marque la limite sud du Zoulouland ?",
        options: ["La Tugela", "L'Orange", "Le Zambèze", "Le Limpopo"],
        fact: "La Tugela séparait le Zoulouland du Natal, et les passages du fleuve étaient surveillés par les rois zoulous comme par la colonie britannique.",
        source: "Encyclopaedia Britannica, notice « Zululand »",
      },
      {
        question: "Quel kraal royal des rois zoulous, capitale de Cetshwayo, a été brûlé après la dernière bataille de la guerre ?",
        options: ["Ulundi", "Isandlwana", "Rorke's Drift", "Ncome"],
        fact: "Les troupes britanniques ont brûlé Ulundi en 1879, et le kraal royal détruit, la guerre était finie et le royaume démembré.",
        source: "Encyclopaedia Britannica, notice « Ulundi »",
      },
      {
        question: "Quel peuple, parti du Cap vers l'intérieur dans les années 1830, s'est heurté au royaume zoulou ?",
        options: ["Les Voortrekkers", "La marine britannique", "Les Portugais", "Les marchands swahili"],
        fact: "Les Voortrekkers ont franchi le Drakensberg en quête de terres, et leur défaite à Blood River a changé l'équilibre entre les deux peuples.",
        source: "Encyclopaedia Britannica, notice « Voortrekker »",
      },
      {
        question: "Quelle province de l'Afrique du Sud actuelle joint le nom du royaume à celui d'un territoire colonial ?",
        options: ["Le KwaZulu-Natal", "Le Gauteng", "Le Limpopo", "L'État libre"],
        fact: "La province a été créée en 1994 en réunissant le homeland zoulou au Natal, et son nom garde les deux histoires côte à côte.",
        source: "Encyclopaedia Britannica, notice « KwaZulu-Natal »",
      },
      {
        question: "Quel royaume rival l'armée de Shaka a-t-elle vaincu à Gqokli Hill en 1818 ?",
        options: ["Les Ndwandwe", "Les Britanniques", "Les Boers", "Les Xhosa"],
        fact: "Les Ndwandwe de Zwide étaient la puissance la plus forte de la région, et leur défaite a laissé Shaka libre de bâtir le royaume zoulou.",
        source: "Encyclopaedia Britannica, notice « Shaka »",
      },
      {
        question: "Que les Britanniques ont-ils exigé de Cetshwayo fin 1878, avant d'envahir le Zoulouland ?",
        options: ["La remise des hommes accusés de raids frontaliers", "Une part des mines d'or", "Des droits sur la côte", "Un tribut annuel en bétail"],
        fact: "L'ultimatum demandait bien plus que le litige frontalier qu'il prétendait régler, et il était écrit pour être refusé.",
        source: "Encyclopaedia Britannica, notice « Cetshwayo »",
      },
    ],
  },
};
