/**
 * The Sokoto Caliphate: one level of the game, on its own.
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
  id: 26,
  order: 21,
  era: "modern",
  from: 1804,
  title: "The Sokoto Caliphate",
  subtitle: "Hausaland and the Fulani reform",
  region: "Hausaland",
  color: "from-emerald-500 to-green-800",
  icon: Scroll,
  gallery: {
    en: [
      {
        file: "/photos/level-26-1.jpg",
        caption: "The palace of the Sultan of Sokoto, the seat of the caliphate founded in 1809.",
        credit: "el-siddeeq lame · CC BY 3.0 · Wikimedia Commons",
        author: "el-siddeeq lame",
        licence: "CC BY 3.0",
        source: "https://commons.wikimedia.org/wiki/File:SULTAN_OF_SOKOTO'S_PALACE_SOKOTO_NIGERIA_-_panoramio.jpg",
      },
      {
        file: "/photos/level-26-2.jpg",
        caption: "The ancient earthen walls of Kano, the city of weavers and dyers of the caliphate.",
        credit: "Anasskoko · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Anasskoko",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Ancient_Walls_of_Kano_Emirate_03.jpg",
      },
      {
        file: "/photos/level-26-3.jpg",
        caption: "The gateway to the terraced hill of Sukur, a World Heritage Site of the Mandara mountains.",
        credit: "Culture Hero · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Culture Hero",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Gateway_to_Sukur_Cultural_Landscape.jpg",
      },
    ],
    fr: [
      {
        file: "/photos/level-26-1.jpg",
        caption: "Le palais du sultan de Sokoto, siège du califat fondé en 1809.",
        credit: "el-siddeeq lame · CC BY 3.0 · Wikimedia Commons",
        author: "el-siddeeq lame",
        licence: "CC BY 3.0",
        source: "https://commons.wikimedia.org/wiki/File:SULTAN_OF_SOKOTO'S_PALACE_SOKOTO_NIGERIA_-_panoramio.jpg",
      },
      {
        file: "/photos/level-26-2.jpg",
        caption: "Les anciens remparts de terre de Kano, la ville des tisserands et des teinturiers du califat.",
        credit: "Anasskoko · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Anasskoko",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Ancient_Walls_of_Kano_Emirate_03.jpg",
      },
      {
        file: "/photos/level-26-3.jpg",
        caption: "La porte du village en terrasses de Sukur, site du patrimoine mondial des monts Mandara.",
        credit: "Culture Hero · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Culture Hero",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Gateway_to_Sukur_Cultural_Landscape.jpg",
      },
    ],
  },
  study: {
    en: {
      essay: ["In the Hausa cities of the Sahel, a scholar named Usman dan Fodio taught and wrote for years before 1804, when he left Gobir and called his followers to reform. The movement he began became the Sokoto Caliphate, the largest state in nineteenth century Africa.", "Sokoto was its capital, and Muhammad Bello ruled the east while Abdullahi governed the west from Gwandu. The emirates founded across Hausaland answered to Sokoto, and the courts judged by the sharia. Usman dan Fodio's daughter Nana Asma'u taught women and wrote in three languages.", "The economy rested on farming, on the weaving and dyeing of Kano, which sent its blue cloth across the Sahara, and on captives taken in the wars. Fulani herders and Hausa farmers shared the land, and Hausa became the common tongue of the north.", "Bornu held out to the east, but in 1903 a British force under Frederick Lugard took Sokoto and ended the caliphate. The sultan and the emirs were kept under British rule, and their courts and titles survive in northern Nigeria today."],
      timeline: [
        { year: "1804", text: "Usman dan Fodio leaves Gobir and begins his call to reform." },
        { year: "1809", text: "Sokoto is founded and becomes the capital of the caliphate." },
        { year: "1817", text: "Muhammad Bello succeeds his father at Sokoto." },
        { year: "1837", text: "Nana Asma'u and the schools of the caliphate spread across Hausaland." },
        { year: "1903", text: "A British force takes Sokoto and ends the caliphate." },
        { year: "1960", text: "Northern Nigeria enters independence with its emirates intact." },
      ],
      people: [
        {
          name: "Usman dan Fodio",
          text: "The scholar and leader who began the reform and founded the caliphate.",
        },
        { name: "Muhammad Bello", text: "His son, who ruled the eastern caliphate from Sokoto." },
        {
          name: "Abdullahi dan Fodio",
          text: "His brother, who governed the western emirates from Gwandu.",
        },
        {
          name: "Nana Asma'u",
          text: "His daughter, who taught women and wrote in Hausa, Fulfulde and Arabic.",
        },
        { name: "Frederick Lugard", text: "The British officer whose campaign took Sokoto in 1903." },
      ],
      places: [
        { name: "Sokoto", text: "The capital of the caliphate, and still the seat of its sultan." },
        { name: "Kano", text: "The city of weavers and dyers whose blue cloth crossed the Sahara." },
        { name: "Gwandu", text: "The western capital from which Abdullahi governed the emirates." },
        { name: "Gobir", text: "The Hausa kingdom the movement first fought." },
        {
          name: "Sukur",
          text: "The terraced hill settlement of the Mandara mountains, a World Heritage Site.",
        },
      ],
      glossary: [
        {
          term: "caliphate",
          text: "A state ruled in the name of Islam, here the one whose capital was Sokoto.",
        },
        { term: "emir", text: "The governor of one emirate, who answered to Sokoto." },
        { term: "sharia", text: "The Islamic law the courts of the caliphate judged by." },
        { term: "Fulani", text: "The herders and scholars at the centre of the reform movement." },
        {
          term: "jihad",
          text: "The struggle the movement declared, which turned a teaching into a state.",
        },
      ],
    },
    fr: {
      essay: ["Dans les cités haoussa du Sahel, un savant nommé Usman dan Fodio a enseigné et écrit pendant des années avant 1804, quand il a quitté le Gobir et appelé ses partisans à la réforme. Le mouvement qu'il a lancé est devenu le califat de Sokoto, le plus grand État de l'Afrique du XIXe siècle.", "Sokoto en était la capitale, et Muhammad Bello gouvernait l'est tandis qu'Abdullahi régnait sur l'ouest depuis Gwandu. Les émirats fondés à travers le Hausaland répondaient à Sokoto, et les tribunaux jugeaient selon la charia. La fille d'Usman dan Fodio, Nana Asma'u, enseignait aux femmes et écrivait en trois langues.", "L'économie reposait sur l'agriculture, sur le tissage et la teinture de Kano, qui envoyait son tissu bleu à travers le Sahara, et sur les captifs pris dans les guerres. Éleveurs peuls et agriculteurs haoussa partageaient la terre, et le haoussa est devenu la langue commune du nord.", "Le Bornou a résisté à l'est, mais en 1903 une force britannique commandée par Frederick Lugard a pris Sokoto et mis fin au califat. Le sultan et les émirs ont été maintenus sous la domination britannique, et leurs tribunaux et leurs titres subsistent dans le nord du Nigeria."],
      timeline: [
        { year: "1804", text: "Usman dan Fodio quitte le Gobir et lance son appel à la réforme." },
        { year: "1809", text: "Sokoto est fondée et devient la capitale du califat." },
        { year: "1817", text: "Muhammad Bello succède à son père à Sokoto." },
        { year: "1837", text: "Nana Asma'u et les écoles du califat se répandent dans le Hausaland." },
        { year: "1903", text: "Une force britannique prend Sokoto et met fin au califat." },
        { year: "1960", text: "Le nord du Nigeria entre dans l'indépendance avec ses émirats intacts." },
      ],
      people: [
        {
          name: "Usman dan Fodio",
          text: "Le savant et dirigeant qui a lancé la réforme et fondé le califat.",
        },
        { name: "Muhammad Bello", text: "Son fils, qui a gouverné l'est du califat depuis Sokoto." },
        {
          name: "Abdullahi dan Fodio",
          text: "Son frère, qui a gouverné les émirats de l'ouest depuis Gwandu.",
        },
        {
          name: "Nana Asma'u",
          text: "Sa fille, qui enseignait aux femmes et écrivait en haoussa, en peul et en arabe.",
        },
        {
          name: "Frederick Lugard",
          text: "L'officier britannique dont la campagne a pris Sokoto en 1903.",
        },
      ],
      places: [
        { name: "Sokoto", text: "La capitale du califat, toujours siège de son sultan." },
        {
          name: "Kano",
          text: "La ville des tisserands et des teinturiers dont le tissu bleu traversait le Sahara.",
        },
        { name: "Gwandu", text: "La capitale de l'ouest d'où Abdullahi gouvernait les émirats." },
        { name: "Gobir", text: "Le royaume haoussa que le mouvement a combattu en premier." },
        {
          name: "Sukur",
          text: "Le village en terrasses des monts Mandara, site du patrimoine mondial.",
        },
      ],
      glossary: [
        {
          term: "califat",
          text: "Un État gouverné au nom de l'islam, ici celui dont Sokoto était la capitale.",
        },
        { term: "émir", text: "Le gouverneur d'un émirat, qui répondait à Sokoto." },
        { term: "charia", text: "La loi islamique selon laquelle jugeaient les tribunaux du califat." },
        { term: "Peuls", text: "Les éleveurs et savants au cœur du mouvement de réforme." },
        {
          term: "jihad",
          text: "La lutte déclarée par le mouvement, qui a transformé un enseignement en État.",
        },
      ],
    },
  },
  questions: [
    {
      question: "Which Fulani scholar began the movement that founded the Sokoto Caliphate?",
      options: ["Usman dan Fodio", "Muhammad Bello", "Seku Amadu", "al-Hajj Umar"],
      correct: 0,
      fact: "Usman dan Fodio taught and wrote across Hausaland before he called his followers to reform in 1804.",
      source: { label: "Encyclopaedia Britannica, \"Usman dan Fodio\"" },
    },
    {
      question: "In which year did Usman dan Fodio begin the struggle that founded the caliphate?",
      options: ["1804", "1789", "1812", "1854"],
      correct: 0,
      fact: "In 1804 Usman dan Fodio left Gobir and was proclaimed leader, and the movement grew into a state.",
      source: { label: "Encyclopaedia Britannica, \"Usman dan Fodio\"" },
    },
    {
      question: "Which Hausa kingdom did the movement first fight?",
      options: ["Gobir", "Kano", "Bornu", "Oyo"],
      correct: 0,
      fact: "The quarrel with Gobir and its king Yunfa turned a reform movement into a war that spread across Hausaland.",
      source: { label: "Encyclopaedia Britannica, \"Gobir\"" },
    },
    {
      question: "What title was used for Usman dan Fodio as the religious leader?",
      options: ["Shehu", "Sultan", "Emir", "Alaafin"],
      correct: 0,
      fact: "His followers called him the Shehu, and his authority was that of a scholar and a guide before it was that of a king.",
      source: { label: "Encyclopaedia Britannica, \"Usman dan Fodio\"" },
    },
    {
      question: "Which city became the capital of the caliphate?",
      options: ["Sokoto", "Kano", "Katsina", "Gwandu"],
      correct: 0,
      fact: "Usman dan Fodio founded Sokoto in 1809, and from it the caliphate ruled the emirates it had made.",
      source: { label: "Encyclopaedia Britannica, \"Sokoto\"" },
    },
    {
      question: "Which son of Usman dan Fodio led the caliphate after him?",
      options: ["Muhammad Bello", "Nana Asma'u", "Abdullahi", "Ali"],
      correct: 0,
      fact: "Muhammad Bello succeeded his father at Sokoto and governed the east of the caliphate.",
      source: { label: "Encyclopaedia Britannica, \"Muhammad Bello\"" },
    },
    {
      question: "Which brother and commander governed the western half from Gwandu?",
      options: ["Abdullahi dan Fodio", "Muhammad Bello", "Seku Amadu", "Nana Asma'u"],
      correct: 0,
      fact: "Abdullahi dan Fodio ruled the western emirates from Gwandu, and the two courts shared the caliphate.",
      source: { label: "Encyclopaedia Britannica, \"Sokoto Caliphate\"" },
    },
    {
      question: "Which scholar and poet, a daughter of Usman dan Fodio, taught women across the caliphate?",
      options: ["Nana Asma'u", "Amina of Zaria", "Aisha", "Fatima"],
      correct: 0,
      fact: "Nana Asma'u wrote in Hausa, Fulfulde and Arabic, and trained the women teachers who carried her teaching into the villages.",
      source: { label: "Encyclopaedia Britannica, \"Nana Asma'u\"" },
    },
    {
      question: "What were the states ruled by the caliphate's governors called?",
      options: ["Emirates", "Sultanates only", "Kingdoms", "Provinces"],
      correct: 0,
      fact: "Each emirate was ruled by an emir who answered to Sokoto, and the emirs raised taxes, troops and judges of their own.",
      source: { label: "Encyclopaedia Britannica, \"Sokoto Caliphate\"" },
    },
    {
      question: "Which people, herders as well as scholars, were at the centre of the movement?",
      options: ["The Fulani", "The Tuareg", "The Yoruba", "The Igbo"],
      correct: 0,
      fact: "The Fulani had spread across the Sahel as herders and teachers, and the movement gave them a state of their own.",
      source: { label: "Encyclopaedia Britannica, \"Fulani\"" },
    },
    {
      question: "Which language served as a common tongue across the caliphate?",
      options: ["Hausa", "Arabic only", "Fulfulde only", "Kanuri"],
      correct: 0,
      fact: "Hausa was the language of the markets and much of the new writing, and it remains the common tongue of the north.",
      source: { label: "Encyclopaedia Britannica, \"Hausa\"" },
    },
    {
      question: "Which product of Kano was traded across the Sahara?",
      options: ["Dyed cloth", "Porcelain", "Silk", "Coffee"],
      correct: 0,
      fact: "Kano was famous for its dye pits and its woven cloth, and its caravans carried it north to the desert and the Mediterranean.",
      source: { label: "Encyclopaedia Britannica, \"Kano\"" },
    },
    {
      question: "Which law did the caliphate follow in its courts?",
      options: ["Islamic law, the sharia", "Akan custom", "Portuguese law", "Roman law"],
      correct: 0,
      fact: "Qadis judged by the sharia, and the reform movement was as much about courts and learning as about war.",
      source: { label: "Encyclopaedia Britannica, \"Sokoto Caliphate\"" },
    },
    {
      question: "Which neighbouring empire resisted the Sokoto armies for decades?",
      options: ["Bornu", "Oyo", "Dahomey", "Mali"],
      correct: 0,
      fact: "Bornu, west of Lake Chad, held out against the caliphate and kept its own dynasty and its own scholars.",
      source: { label: "Encyclopaedia Britannica, \"Bornu\"" },
    },
    {
      question: "Which British officer took Sokoto in 1903 and ended the caliphate?",
      options: ["Frederick Lugard", "Garnet Wolseley", "Charles Gordon", "Robert Baden-Powell"],
      correct: 0,
      fact: "Frederick Lugard led the campaign that took Sokoto in 1903 and joined the north to the British protectorate of Nigeria.",
      source: { label: "Encyclopaedia Britannica, \"Frederick Lugard\"" },
    },
    {
      question: "In which year did a British force capture Sokoto?",
      options: ["1903", "1897", "1884", "1914"],
      correct: 0,
      fact: "Sokoto fell in 1903, and the caliphate's hundred years ended with a cavalry charge broken by rifle fire.",
      source: { label: "Encyclopaedia Britannica, \"Sokoto\"" },
    },
    {
      question: "Which hilltop settlement in Nigeria, of the same era, is a World Heritage Site?",
      options: ["Sukur", "Bigo", "Ntusi", "Ambohimanga"],
      correct: 0,
      fact: "Sukur in the Mandara mountains is a terraced landscape with a palace, shrines and iron smelting of its own.",
      source: {
        label: "UNESCO World Heritage List, Sukur Cultural Landscape",
        url: "https://whc.unesco.org/en/list/938/",
      },
    },
    {
      question: "Which title did the ruler of Sokoto keep under British rule?",
      options: ["Sultan of Sokoto", "Shehu of Kano", "Emir of Kumasi", "Kabaka"],
      correct: 0,
      fact: "The British kept the sultan and the emirs in place under supervision, and the Sultan of Sokoto is still a leading figure in Nigeria.",
      source: { label: "Encyclopaedia Britannica, \"Sokoto\"" },
    },
    {
      question: "Which trade grew out of the captives taken in the caliphate's wars?",
      options: ["The slave trade", "The salt trade", "The gold trade", "The ivory trade"],
      correct: 0,
      fact: "Captives were sold within the caliphate and across the Sahara, and slavery was part of the economy the British moved against.",
      source: { label: "Encyclopaedia Britannica, \"Sokoto Caliphate\"" },
    },
    {
      question: "Which part of modern Nigeria still keeps the emirates the caliphate founded?",
      options: ["The north", "The east", "The delta", "The southwest"],
      correct: 0,
      fact: "The northern emirates survived the conquest and the colonial period, and their courts and titles remain today.",
      source: { label: "Encyclopaedia Britannica, \"Nigeria\"" },
    },
    {
      question: "What did the movement of Usman dan Fodio set out to reform?",
      options: ["Practice and government according to Islam", "Taxes on cocoa", "The slave castles", "The Portuguese forts"],
      correct: 0,
      fact: "The reform aimed at corrupt rule and mixed practice, and it produced a state, a court system and a body of writing.",
      source: { label: "Encyclopaedia Britannica, \"Usman dan Fodio\"" },
    },
  ],
  fr: {
    title: "Le califat de Sokoto",
    subtitle: "Le Hausaland et la réforme peule",
    region: "Pays haoussa",
    questions: [
      {
        question: "Quel savant peul a lancé le mouvement qui a fondé le califat de Sokoto ?",
        options: ["Usman dan Fodio", "Muhammad Bello", "Seku Amadu", "al-Hajj Umar"],
        fact: "Usman dan Fodio a enseigné et écrit à travers le Hausaland avant d'appeler ses partisans à la réforme en 1804.",
        source: "Encyclopaedia Britannica, notice « Usman dan Fodio »",
      },
      {
        question: "En quelle année Usman dan Fodio a-t-il commencé la lutte qui a fondé le califat ?",
        options: ["1804", "1789", "1812", "1854"],
        fact: "En 1804, Usman dan Fodio a quitté le Gobir et a été proclamé chef, et le mouvement est devenu un État.",
        source: "Encyclopaedia Britannica, notice « Usman dan Fodio »",
      },
      {
        question: "Quel royaume haoussa le mouvement a-t-il combattu en premier ?",
        options: ["Le Gobir", "Kano", "Le Bornou", "L'Oyo"],
        fact: "La querelle avec le Gobir et son roi Yunfa a transformé un mouvement de réforme en une guerre qui s'est répandue sur tout le Hausaland.",
        source: "Encyclopaedia Britannica, notice « Gobir »",
      },
      {
        question: "Quel titre désignait Usman dan Fodio comme chef religieux ?",
        options: ["Cheikhou", "Sultan", "Émir", "Alaafin"],
        fact: "Ses partisans l'appelaient le Cheikhou, et son autorité était celle d'un savant et d'un guide avant celle d'un roi.",
        source: "Encyclopaedia Britannica, notice « Usman dan Fodio »",
      },
      {
        question: "Quelle ville est devenue la capitale du califat ?",
        options: ["Sokoto", "Kano", "Katsina", "Gwandu"],
        fact: "Usman dan Fodio a fondé Sokoto en 1809, et c'est de là que le califat gouvernait les émirats qu'il avait créés.",
        source: "Encyclopaedia Britannica, notice « Sokoto »",
      },
      {
        question: "Quel fils d'Usman dan Fodio a dirigé le califat après lui ?",
        options: ["Muhammad Bello", "Nana Asma'u", "Abdullahi", "Ali"],
        fact: "Muhammad Bello a succédé à son père à Sokoto et gouvernait l'est du califat.",
        source: "Encyclopaedia Britannica, notice « Muhammad Bello »",
      },
      {
        question: "Quel frère et chef militaire gouvernait la moitié ouest depuis Gwandu ?",
        options: ["Abdullahi dan Fodio", "Muhammad Bello", "Seku Amadu", "Nana Asma'u"],
        fact: "Abdullahi dan Fodio régnait sur les émirats de l'ouest depuis Gwandu, et les deux cours partageaient le califat.",
        source: "Encyclopaedia Britannica, notice « Sokoto Caliphate »",
      },
      {
        question: "Quelle savante et poétesse, fille d'Usman dan Fodio, enseignait aux femmes dans tout le califat ?",
        options: ["Nana Asma'u", "Amina de Zaria", "Aisha", "Fatima"],
        fact: "Nana Asma'u écrivait en haoussa, en peul et en arabe, et formait les femmes enseignantes qui portaient son savoir dans les villages.",
        source: "Encyclopaedia Britannica, notice « Nana Asma'u »",
      },
      {
        question: "Comment appelait-on les États gouvernés par les gouverneurs du califat ?",
        options: ["Des émirats", "Des sultanats seulement", "Des royaumes", "Des provinces"],
        fact: "Chaque émirat était dirigé par un émir qui répondait à Sokoto, et les émirs levaient leurs impôts, leurs troupes et leurs juges.",
        source: "Encyclopaedia Britannica, notice « Sokoto Caliphate »",
      },
      {
        question: "Quel peuple, à la fois éleveurs et savants, était au cœur du mouvement ?",
        options: ["Les Peuls", "Les Touaregs", "Les Yoruba", "Les Igbo"],
        fact: "Les Peuls s'étaient répandus dans le Sahel comme éleveurs et enseignants, et le mouvement leur a donné un État.",
        source: "Encyclopaedia Britannica, notice « Fulani »",
      },
      {
        question: "Quelle langue servait de langue commune dans tout le califat ?",
        options: ["Le haoussa", "L'arabe seulement", "Le peul seulement", "Le kanouri"],
        fact: "Le haoussa était la langue des marchés et d'une grande partie des nouveaux écrits, et il reste la langue commune du nord.",
        source: "Encyclopaedia Britannica, notice « Hausa »",
      },
      {
        question: "Quel produit de Kano se vendait à travers le Sahara ?",
        options: ["Le tissu teint", "La porcelaine", "La soie", "Le café"],
        fact: "Kano était célèbre pour ses fosses de teinture et ses tissus, et ses caravanes les portaient au nord, vers le désert et la Méditerranée.",
        source: "Encyclopaedia Britannica, notice « Kano »",
      },
      {
        question: "Quelle loi le califat appliquait-il dans ses tribunaux ?",
        options: ["La loi islamique, la charia", "La coutume akan", "Le droit portugais", "Le droit romain"],
        fact: "Les cadis jugeaient selon la charia, et le mouvement de réforme portait autant sur les tribunaux et le savoir que sur la guerre.",
        source: "Encyclopaedia Britannica, notice « Sokoto Caliphate »",
      },
      {
        question: "Quel empire voisin a résisté aux armées de Sokoto pendant des décennies ?",
        options: ["Le Bornou", "L'Oyo", "Le Dahomey", "Le Mali"],
        fact: "Le Bornou, à l'ouest du lac Tchad, a résisté au califat et a gardé sa propre dynastie et ses savants.",
        source: "Encyclopaedia Britannica, notice « Bornu »",
      },
      {
        question: "Quel officier britannique a pris Sokoto en 1903 et mis fin au califat ?",
        options: ["Frederick Lugard", "Garnet Wolseley", "Charles Gordon", "Robert Baden-Powell"],
        fact: "Frederick Lugard a conduit la campagne qui a pris Sokoto en 1903 et a rattaché le nord au protectorat britannique du Nigeria.",
        source: "Encyclopaedia Britannica, notice « Frederick Lugard »",
      },
      {
        question: "En quelle année une force britannique a-t-elle pris Sokoto ?",
        options: ["1903", "1897", "1884", "1914"],
        fact: "Sokoto est tombée en 1903, et les cent ans du califat se sont achevés sur une charge de cavalerie brisée par les fusils.",
        source: "Encyclopaedia Britannica, notice « Sokoto »",
      },
      {
        question: "Quel village fortifié du Nigeria, de la même époque, est un site du patrimoine mondial ?",
        options: ["Sukur", "Bigo", "Ntusi", "Ambohimanga"],
        fact: "Sukur, dans les monts Mandara, est un paysage en terrasses avec un palais, des sanctuaires et sa propre métallurgie du fer.",
        source: "Liste du patrimoine mondial de l'UNESCO, Paysage culturel de Sukur",
      },
      {
        question: "Quel titre le souverain de Sokoto a-t-il gardé sous la domination britannique ?",
        options: ["Sultan de Sokoto", "Cheikhou de Kano", "Émir de Kumasi", "Kabaka"],
        fact: "Les Britanniques ont gardé le sultan et les émirs sous surveillance, et le sultan de Sokoto reste une grande figure du Nigeria.",
        source: "Encyclopaedia Britannica, notice « Sokoto »",
      },
      {
        question: "Quel commerce s'est développé à partir des captifs pris dans les guerres du califat ?",
        options: ["La traite des esclaves", "Le commerce du sel", "Le commerce de l'or", "Le commerce de l'ivoire"],
        fact: "Les captifs étaient vendus dans le califat et à travers le Sahara, et l'esclavage faisait partie de l'économie que les Britanniques ont attaquée.",
        source: "Encyclopaedia Britannica, notice « Sokoto Caliphate »",
      },
      {
        question: "Quelle partie du Nigeria actuel garde encore les émirats fondés par le califat ?",
        options: ["Le nord", "L'est", "Le delta", "Le sud-ouest"],
        fact: "Les émirats du nord ont survécu à la conquête et à la période coloniale, et leurs tribunaux et leurs titres subsistent aujourd'hui.",
        source: "Encyclopaedia Britannica, notice « Nigeria »",
      },
      {
        question: "Qu'est-ce que le mouvement d'Usman dan Fodio voulait réformer ?",
        options: ["La pratique et le gouvernement selon l'islam", "Les impôts sur le cacao", "Les châteaux des esclaves", "Les forts portugais"],
        fact: "La réforme visait un pouvoir corrompu et des pratiques mêlées, et elle a produit un État, un système de tribunaux et une œuvre écrite.",
        source: "Encyclopaedia Britannica, notice « Usman dan Fodio »",
      },
    ],
  },
};
