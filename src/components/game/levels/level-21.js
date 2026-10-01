/**
 * The Amazigh Kingdoms: one level of the game, on its own.
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
  id: 21,
  order: 6,
  era: "ancient",
  from: -202,
  title: "The Amazigh Kingdoms",
  subtitle: "Numidia, Rome and the Maghreb",
  region: "Maghreb",
  color: "from-orange-500 to-amber-700",
  icon: Mountain,
  gallery: {
    en: [
      {
        file: "/photos/level-21-1.jpg",
        caption: "The High Atlas of Morocco, where Amazigh villages and languages have held on.",
        credit: "Mounir Neddi · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Mounir Neddi",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Djebel_Ayachi%2C_Eastern_High_Atlas%2C_Morocco.jpg",
      },
      {
        file: "/photos/level-21-2.jpg",
        caption: "The Roman city of Timgad, laid out in the Numidian land of the Atlas.",
        credit: "Yelles · CC BY-SA 3.0 · Wikimedia Commons",
        author: "Yelles",
        licence: "CC BY-SA 3.0",
        source: "https://commons.wikimedia.org/wiki/File:Timgad_ville.jpg",
      },
      {
        file: "/photos/level-21-3.jpg",
        caption: "A young Amazigh woman in the Atlas mountains of Morocco.",
        credit: "Tahirshah999 · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Tahirshah999",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:BERBER_GIRL%2C_ATLAS_MOUNTAINS%2C_MOROCCO.jpg",
      },
    ],
    fr: [
      {
        file: "/photos/level-21-1.jpg",
        caption: "Le Haut Atlas marocain, où les villages et les langues amazighes se sont maintenus.",
        credit: "Mounir Neddi · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Mounir Neddi",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Djebel_Ayachi%2C_Eastern_High_Atlas%2C_Morocco.jpg",
      },
      {
        file: "/photos/level-21-2.jpg",
        caption: "La cité romaine de Timgad, tracée sur la terre numide de l'Atlas.",
        credit: "Yelles · CC BY-SA 3.0 · Wikimedia Commons",
        author: "Yelles",
        licence: "CC BY-SA 3.0",
        source: "https://commons.wikimedia.org/wiki/File:Timgad_ville.jpg",
      },
      {
        file: "/photos/level-21-3.jpg",
        caption: "Une jeune femme amazighe dans les montagnes de l'Atlas, au Maroc.",
        credit: "Tahirshah999 · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Tahirshah999",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:BERBER_GIRL%2C_ATLAS_MOUNTAINS%2C_MOROCCO.jpg",
      },
    ],
  },
  study: {
    en: {
      essay: ["The Amazigh, who call themselves Imazighen, the free people, have lived across North Africa since long before Carthage or Rome. They speak languages of the Afro-Asiatic family, write in some places with the Tifinagh script, and hold the mountains and the oases from the Atlas to Siwa.", "In the third century BC the Numidian king Masinissa united the tribes of what is now Algeria and Tunisia, and his grandson Jugurtha fought Rome for years. Numidian horsemen, riding without saddle or bridle, served Carthage and then Rome, and a Roman emperor, Septimius Severus, was born at Leptis Magna on the coast.", "Roman Africa grew rich on grain and olive oil, and Christianity took root there early: Augustine, born at Thagaste, became bishop of Hippo. When the Arab armies came in the seventh century, Amazigh leaders such as Dihya al-Kahina resisted in the Aures before much of the region adopted Islam.", "Amazigh dynasties then ruled the Maghreb, and for a time Spain as well: the Almoravids, from their ribat on the Senegal, built Marrakesh in 1070, and the Almohads raised the Koutoubia. The mountains kept the languages alive, and millions of Moroccans and Algerians, and the Tuareg of the Sahara, still speak them today."],
      timeline: [
        { year: "202 BC", text: "Masinissa becomes king of Numidia and rules from Cirta." },
        { year: "112 BC", text: "Jugurtha begins his long war against Rome." },
        { year: "c. 200 AD", text: "Septimius Severus, born at Leptis Magna, rules Rome." },
        { year: "c. 400 AD", text: "Augustine becomes bishop of Hippo." },
        { year: "c. 700 AD", text: "Dihya al-Kahina leads the resistance in the Aures." },
        { year: "1070", text: "The Almoravids found Marrakesh." },
        { year: "1121", text: "The Almohad movement begins among the Masmuda of the Atlas." },
      ],
      people: [
        {
          name: "Masinissa",
          text: "The Numidian king who united the tribes and ruled from Cirta in the third century BC.",
        },
        {
          name: "Jugurtha",
          text: "The king who fought Rome for years and was betrayed by Bocchus of Mauretania.",
        },
        {
          name: "Septimius Severus",
          text: "The Roman emperor born at Leptis Magna, on the North African coast.",
        },
        {
          name: "Augustine",
          text: "Born at Thagaste, he became bishop of Hippo and shaped Latin Christianity.",
        },
        {
          name: "Dihya al-Kahina",
          text: "The Amazigh leader who resisted the Arab armies in the Aures.",
        },
      ],
      places: [
        {
          name: "Cirta",
          text: "The royal city of the Numidian kings, in what is today eastern Algeria.",
        },
        {
          name: "The Atlas Mountains",
          text: "The range across Morocco and Algeria where Amazigh villages and languages held on.",
        },
        {
          name: "Marrakesh",
          text: "The Almoravid capital founded in 1070, with the Koutoubia raised by the Almohads.",
        },
        {
          name: "Hippo Regius",
          text: "The port where Augustine was bishop, in what is today eastern Algeria.",
        },
        {
          name: "Leptis Magna",
          text: "The Roman city in what is today Libya, birthplace of Septimius Severus.",
        },
      ],
      glossary: [
        { term: "Amazigh", text: "The name a free people takes for itself, Imazighen in the plural." },
        { term: "Tifinagh", text: "The Amazigh script, still written by the Tuareg across the Sahara." },
        {
          term: "Numidia",
          text: "The kingdom of the Numidian kings, in what is today Algeria and Tunisia.",
        },
        {
          term: "ribat",
          text: "A fortified monastery on a frontier, from which the Almoravid movement grew.",
        },
        { term: "Maghreb", text: "The place of sunset, the region of North Africa west of Egypt." },
      ],
    },
    fr: {
      essay: ["Les Amazighs, qui se nomment Imazighen, le peuple libre, vivent en Afrique du Nord bien avant Carthage et Rome. Ils parlent des langues de la famille afro-asiatique, écrivent par endroits en tifinagh, et occupent les montagnes et les oasis de l'Atlas a Siwa.", "Au IIIe siècle av. J.-C., le roi numide Massinissa a unifié les tribus de l'actuelle Algérie et de la Tunisie, et son petit-fils Jugurtha a combattu Rome pendant des années. Les cavaliers numides, montant sans selle ni bride, ont servi Carthage puis Rome, et un empereur romain, Septime Sévère, est né à Leptis Magna.", "L'Afrique romaine s'est enrichie de blé et d'huile d'olive, et le christianisme s'y est enraciné tôt : Augustin, né à Thagaste, est devenu évêque d'Hippone. Quand les armées arabes sont arrivées au VIIe siècle, des chefs amazighs comme Dihya al-Kahina ont résisté dans les Aurès avant que la région n'adopte l'islam.", "Des dynasties amazighes ont ensuite régné sur le Maghreb, et un temps sur l'Espagne : les Almoravides, depuis leur ribat du Sénégal, ont fondé Marrakech en 1070, et les Almohades ont élevé la Koutoubia. Les montagnes ont gardé les langues vivantes, et des millions de Marocains et d'Algériens, comme les Touaregs du Sahara, les parlent encore."],
      timeline: [
        { year: "202 av. J.-C.", text: "Massinissa devient roi de Numidie et règne depuis Cirta." },
        { year: "112 av. J.-C.", text: "Jugurtha commence sa longue guerre contre Rome." },
        { year: "v. 200 apr. J.-C.", text: "Septime Sévère, né à Leptis Magna, règne sur Rome." },
        { year: "v. 400 apr. J.-C.", text: "Augustin devient évêque d'Hippone." },
        { year: "v. 700 apr. J.-C.", text: "Dihya al-Kahina conduit la résistance dans les Aurès." },
        { year: "1070", text: "Les Almoravides fondent Marrakech." },
        { year: "1121", text: "Le mouvement almohade commence chez les Masmouda de l'Atlas." },
      ],
      people: [
        {
          name: "Massinissa",
          text: "Le roi numide qui a unifié les tribus et régnait depuis Cirta au IIIe siècle av. J.-C.",
        },
        {
          name: "Jugurtha",
          text: "Le roi qui a combattu Rome pendant des années avant d'être livré par Bocchus de Maurétanie.",
        },
        {
          name: "Septime Sévère",
          text: "L'empereur romain né à Leptis Magna, sur la côte nord-africaine.",
        },
        {
          name: "Augustin",
          text: "Né à Thagaste, il est devenu évêque d'Hippone et a marqué le christianisme latin.",
        },
        {
          name: "Dihya al-Kahina",
          text: "La dirigeante amazighe qui a résisté aux armées arabes dans les Aurès.",
        },
      ],
      places: [
        { name: "Cirta", text: "La ville royale des rois numides, dans l'actuelle Algérie orientale." },
        {
          name: "L'Atlas",
          text: "La chaîne qui traverse le Maroc et l'Algérie, ou les villages et les langues amazighes se sont maintenus.",
        },
        {
          name: "Marrakech",
          text: "La capitale almoravide fondée en 1070, dotée de la Koutoubia par les Almohades.",
        },
        {
          name: "Hippone",
          text: "Le port où Augustin était évêque, dans l'actuelle Algérie orientale.",
        },
        {
          name: "Leptis Magna",
          text: "La cité romaine de l'actuelle Libye, lieu de naissance de Septime Sévère.",
        },
      ],
      glossary: [
        {
          term: "Amazigh",
          text: "Le nom qu'un peuple libre se donne à lui-même, Imazighen au pluriel.",
        },
        {
          term: "tifinagh",
          text: "L'écriture amazighe, encore tracée par les Touaregs à travers le Sahara.",
        },
        { term: "Numidie", text: "Le royaume des rois numides, dans l'actuelle Algérie et Tunisie." },
        {
          term: "ribat",
          text: "Un monastère fortifié de frontière, d'où le mouvement almoravide est né.",
        },
        {
          term: "Maghreb",
          text: "Le lieu du coucher du soleil, la région d'Afrique du Nord à l'ouest de l'Égypte.",
        },
      ],
    },
  },
  questions: [
    {
      question: "What does Imazighen, the name the Amazigh use for themselves, mean?",
      options: ["The free people", "The mountain dwellers", "The people of the sea", "The strangers"],
      correct: 0,
      fact: "Imazighen means the free people. The word Berber comes from the Greek barbaros, the name outsiders gave them.",
      source: { label: "Encyclopaedia Britannica, \"Berber\"" },
    },
    {
      question: "Which kingdom did the king Masinissa unite in the third century BC?",
      options: ["Numidia", "Carthage", "Mauretania", "Garamantia"],
      correct: 0,
      fact: "Masinissa united the Numidian tribes and ruled from Cirta, first beside Carthage and then beside Rome.",
      source: { label: "Encyclopaedia Britannica, \"Masinissa\"" },
    },
    {
      question: "Which Numidian king fought a long war against Rome between 112 and 105 BC?",
      options: ["Jugurtha", "Syphax", "Juba I", "Micipsa"],
      correct: 0,
      fact: "Jugurtha fought Rome for years and was finally betrayed by Bocchus of Mauretania and paraded through Rome in chains.",
      source: { label: "Encyclopaedia Britannica, \"Jugurtha\"" },
    },
    {
      question: "Which Roman emperor was born in the North African city of Leptis Magna?",
      options: ["Septimius Severus", "Trajan", "Hadrian", "Marcus Aurelius"],
      correct: 0,
      fact: "Septimius Severus was born at Leptis Magna, in what is today Libya, and ruled Rome from 193 to 211.",
      source: { label: "Encyclopaedia Britannica, \"Septimius Severus\"" },
    },
    {
      question: "Which Christian thinker, born in North Africa, became bishop of Hippo?",
      options: ["Augustine", "Ambrose", "Jerome", "Gregory the Great"],
      correct: 0,
      fact: "Augustine was born at Thagaste and became bishop of Hippo, and his writings shaped Latin Christianity.",
      source: { label: "Encyclopaedia Britannica, \"St. Augustine\"" },
    },
    {
      question: "Which ancient script, still written by the Tuareg, is used for the Amazigh language?",
      options: ["Tifinagh", "Coptic", "Ge'ez", "Cuneiform"],
      correct: 0,
      fact: "Tifinagh has letters of its own, and Tuareg communities have kept it alive across the Sahara.",
      source: { label: "Encyclopaedia Britannica, \"Tifinagh\"" },
    },
    {
      question: "Which Amazigh leader resisted the Arab armies in the Aures mountains in the seventh century?",
      options: ["Dihya al-Kahina", "Tin Hinan", "Cleopatra Selene", "Septimia Zenobia"],
      correct: 0,
      fact: "Dihya, called al-Kahina, led the resistance in the Aures before she was defeated around 702.",
      source: { label: "Encyclopaedia Britannica, \"al-Kahina\"" },
    },
    {
      question: "Which city did the Almoravids found as their capital in 1070?",
      options: ["Marrakesh", "Fes", "Kairouan", "Tlemcen"],
      correct: 0,
      fact: "The Almoravids founded Marrakesh in 1070 and made it the capital of an empire reaching from the Sahara to Spain.",
      source: { label: "Encyclopaedia Britannica, \"Marrakesh\"" },
    },
    {
      question: "Which mountain range is home to many Amazigh communities in Morocco and Algeria?",
      options: ["The Atlas Mountains", "The Drakensberg", "The Rwenzori", "The Simien Mountains"],
      correct: 0,
      fact: "The Atlas runs across Morocco and Algeria, and Amazigh villages and languages have held on in its valleys.",
      source: { label: "Encyclopaedia Britannica, \"Atlas Mountains\"" },
    },
    {
      question: "Which Amazigh dynasty built the Koutoubia mosque in Marrakesh?",
      options: ["The Almohads", "The Almoravids", "The Fatimids", "The Aghlabids"],
      correct: 0,
      fact: "The Almohads ruled from Marrakesh and raised the Koutoubia in the twelfth century.",
      source: { label: "Encyclopaedia Britannica, \"Almohads\"" },
    },
    {
      question: "What does the Arabic name Maghreb, given to the region, mean?",
      options: ["The place of sunset, or the west", "The land of the desert", "The middle sea", "The high plateau"],
      correct: 0,
      fact: "Maghreb means the place of sunset, the west, the region that lies west of Egypt.",
      source: { label: "Encyclopaedia Britannica, \"Maghreb\"" },
    },
    {
      question: "Which people of the desert, closely related to the Amazigh, live across the central Sahara?",
      options: ["The Tuareg", "The San", "The Oromo", "The Somali"],
      correct: 0,
      fact: "The Tuareg cross the Sahara with their herds, keep the Tifinagh script and call themselves the free people.",
      source: { label: "Encyclopaedia Britannica, \"Tuareg\"" },
    },
    {
      question: "Which Roman city in Morocco, near Meknes, is on the World Heritage List?",
      options: ["Volubilis", "Timgad", "Leptis Magna", "Dougga"],
      correct: 0,
      fact: "Volubilis was a Roman city on the edge of the empire, and its mosaics and arches still stand.",
      source: {
        label: "UNESCO World Heritage List, Archaeological Site of Volubilis",
        url: "https://whc.unesco.org/en/list/836/",
      },
    },
    {
      question: "Which valley of walled towns in Algeria is a World Heritage Site?",
      options: ["The M'Zab Valley", "The Draa Valley", "The Omo Valley", "The Nile Valley"],
      correct: 0,
      fact: "The M'Zab Valley holds five walled towns built by Mozabite communities from the eleventh century.",
      source: { label: "UNESCO World Heritage List, M'Zab Valley", url: "https://whc.unesco.org/en/list/188/" },
    },
    {
      question: "Which Amazigh language is spoken in the mountains of northern Algeria?",
      options: ["Kabyle", "Wolof", "Amharic", "Tigrinya"],
      correct: 0,
      fact: "Kabyle is one of the Amazigh languages of Algeria, and it has a written literature of its own.",
      source: { label: "Encyclopaedia Britannica, \"Kabyle\"" },
    },
    {
      question: "Which Almoravid leader began the movement from a fortified ribat in the Sahara?",
      options: ["Abdallah ibn Yasin", "Yusuf ibn Tashfin", "Tariq ibn Ziyad", "Idris I"],
      correct: 0,
      fact: "Abdallah ibn Yasin preached from a ribat on the Senegal river, and the movement took its name from that fortress.",
      source: { label: "Encyclopaedia Britannica, \"Almoravids\"" },
    },
    {
      question: "Which Amazigh queen is remembered by the Tuareg as their ancestor?",
      options: ["Tin Hinan", "Dihya", "Amanirenas", "Makeda"],
      correct: 0,
      fact: "Tin Hinan is honoured as the ancestor of the Tuareg, and her tomb stands at Abalessa in the Hoggar.",
      source: { label: "Encyclopaedia Britannica, \"Tuareg\"" },
    },
    {
      question: "What did the Numidians supply to Carthage and later to Rome that made them famous?",
      options: ["Light cavalry", "War elephants", "Siege engines", "Triremes"],
      correct: 0,
      fact: "Numidian horsemen rode without saddle or bridle and were among the most feared cavalry of the ancient Mediterranean.",
      source: { label: "Encyclopaedia Britannica, \"Numidia\"" },
    },
    {
      question: "Which language family do the Amazigh languages belong to?",
      options: ["Afro-Asiatic", "Niger-Congo", "Nilo-Saharan", "Indo-European"],
      correct: 0,
      fact: "Amazigh languages belong to the Afro-Asiatic family, along with Arabic, Hausa and Ancient Egyptian.",
      source: { label: "Encyclopaedia Britannica, \"Berber languages\"" },
    },
    {
      question: "Which North African city was the capital of the Numidian kings before Roman rule?",
      options: ["Cirta", "Carthage", "Thebes", "Alexandria"],
      correct: 0,
      fact: "Cirta, in what is today eastern Algeria, was the royal city of the Numidian kings.",
      source: { label: "Encyclopaedia Britannica, \"Cirta\"" },
    },
    {
      question: "Which crop did the Amazigh of the oases grow with irrigation?",
      options: ["Dates", "Rubber", "Cocoa", "Tea"],
      correct: 0,
      fact: "Date palms were the base of the oasis economy, and the fruit was traded across the Sahara.",
      source: { label: "Encyclopaedia Britannica, \"Sahara\"" },
    },
  ],
  fr: {
    title: "Les royaumes amazighs",
    subtitle: "Numidie, Rome et le Maghreb",
    region: "Le Maghreb",
    questions: [
      {
        question: "Que signifie Imazighen, le nom que les Amazighs se donnent à eux-mêmes ?",
        options: ["Le peuple libre", "Les gens de la montagne", "Le peuple de la mer", "Les étrangers"],
        fact: "Imazighen veut dire le peuple libre. Le mot berbère vient du grec barbaros, le nom que les étrangers leur donnaient.",
        source: "Encyclopaedia Britannica, notice « Berber »",
      },
      {
        question: "Quel royaume le roi Massinissa a-t-il unifié au IIIe siècle av. J.-C. ?",
        options: ["La Numidie", "Carthage", "La Maurétanie", "La Garamantide"],
        fact: "Massinissa a unifié les tribus numides et régnait depuis Cirta, d'abord aux côtés de Carthage, puis de Rome.",
        source: "Encyclopaedia Britannica, notice « Masinissa »",
      },
      {
        question: "Quel roi numide a mené une longue guerre contre Rome entre 112 et 105 av. J.-C. ?",
        options: ["Jugurtha", "Syphax", "Juba Ier", "Micipsa"],
        fact: "Jugurtha a combattu Rome pendant des années avant d'être livré par Bocchus de Maurétanie et exhibé à Rome.",
        source: "Encyclopaedia Britannica, notice « Jugurtha »",
      },
      {
        question: "Quel empereur romain est né dans la ville nord-africaine de Leptis Magna ?",
        options: ["Septime Sévère", "Trajan", "Hadrien", "Marc Aurèle"],
        fact: "Septime Sévère est né à Leptis Magna, dans l'actuelle Libye, et a régné sur Rome de 193 à 211.",
        source: "Encyclopaedia Britannica, notice « Septimius Severus »",
      },
      {
        question: "Quel penseur chrétien, né en Afrique du Nord, est devenu évêque d'Hippone ?",
        options: ["Augustin", "Ambroise", "Jérôme", "Grégoire le Grand"],
        fact: "Augustin est né à Thagaste et est devenu évêque d'Hippone, et ses écrits ont marqué le christianisme latin.",
        source: "Encyclopaedia Britannica, notice « St. Augustine »",
      },
      {
        question: "Quelle écriture ancienne, encore utilisée par les Touaregs, sert à la langue amazighe ?",
        options: ["Le tifinagh", "Le copte", "Le guèze", "Le cunéiforme"],
        fact: "Le tifinagh a ses propres lettres, et les communautés touarègues l'ont maintenu vivant à travers le Sahara.",
        source: "Encyclopaedia Britannica, notice « Tifinagh »",
      },
      {
        question: "Quelle dirigeante amazighe a résisté aux armées arabes dans les Aurès au VIIe siècle ?",
        options: ["Dihya al-Kahina", "Tin Hinan", "Cléopâtre Séléné", "Zénobie"],
        fact: "Dihya, appelée al-Kahina, a conduit la résistance dans les Aurès avant d'être vaincue vers 702.",
        source: "Encyclopaedia Britannica, notice « al-Kahina »",
      },
      {
        question: "Quelle ville les Almoravides ont-ils fondée comme capitale en 1070 ?",
        options: ["Marrakech", "Fès", "Kairouan", "Tlemcen"],
        fact: "Les Almoravides ont fondé Marrakech en 1070 et en ont fait la capitale d'un empire allant du Sahara à l'Espagne.",
        source: "Encyclopaedia Britannica, notice « Marrakesh »",
      },
      {
        question: "Quelle chaîne de montagnes abrite de nombreuses communautés amazighes au Maroc et en Algérie ?",
        options: ["L'Atlas", "Le Drakensberg", "Le Rwenzori", "Le Simien"],
        fact: "L'Atlas traverse le Maroc et l'Algérie, et les villages comme les langues amazighes se sont maintenus dans ses vallées.",
        source: "Encyclopaedia Britannica, notice « Atlas Mountains »",
      },
      {
        question: "Quelle dynastie amazighe a bâti la mosquée Koutoubia à Marrakech ?",
        options: ["Les Almohades", "Les Almoravides", "Les Fatimides", "Les Aghlabides"],
        fact: "Les Almohades régnaient depuis Marrakech et ont élevé la Koutoubia au XIIe siècle.",
        source: "Encyclopaedia Britannica, notice « Almohads »",
      },
      {
        question: "Que signifie le nom arabe Maghreb, donné à la région ?",
        options: ["Le lieu du coucher du soleil, ou l'ouest", "La terre du désert", "La mer du milieu", "Le haut plateau"],
        fact: "Maghreb veut dire le lieu du coucher du soleil, l'ouest, la région située à l'ouest de l'Égypte.",
        source: "Encyclopaedia Britannica, notice « Maghreb »",
      },
      {
        question: "Quel peuple du désert, proche des Amazighs, vit dans le Sahara central ?",
        options: ["Les Touaregs", "Les San", "Les Oromos", "Les Somalis"],
        fact: "Les Touaregs traversent le Sahara avec leurs troupeaux, gardent l'écriture tifinagh et se disent le peuple libre.",
        source: "Encyclopaedia Britannica, notice « Tuareg »",
      },
      {
        question: "Quelle cité romaine du Maroc, près de Meknès, figure sur la liste du patrimoine mondial ?",
        options: ["Volubilis", "Timgad", "Leptis Magna", "Dougga"],
        fact: "Volubilis était une cité romaine aux confins de l'empire, et ses mosaïques et ses arcs tiennent encore debout.",
        source: "Liste du patrimoine mondial de l'UNESCO, Site archéologique de Volubilis",
      },
      {
        question: "Quelle vallée de villes fortifiées en Algérie est un site du patrimoine mondial ?",
        options: ["La vallée du M'Zab", "La vallée du Draa", "La vallée de l'Omo", "La vallée du Nil"],
        fact: "La vallée du M'Zab compte cinq villes fortifiées bâties par les communautés mozabites à partir du XIe siècle.",
        source: "Liste du patrimoine mondial de l'UNESCO, Vallée du M'Zab",
      },
      {
        question: "Quelle langue amazighe est parlée dans les montagnes du nord de l'Algérie ?",
        options: ["Le kabyle", "Le wolof", "L'amharique", "Le tigrinya"],
        fact: "Le kabyle est l'une des langues amazighes d'Algérie, et il possède une littérature écrite qui lui est propre.",
        source: "Encyclopaedia Britannica, notice « Kabyle »",
      },
      {
        question: "Quel chef almoravide a lancé le mouvement depuis un ribat fortifié du Sahara ?",
        options: ["Abdallah ibn Yasin", "Yusuf ibn Tashfin", "Tariq ibn Ziyad", "Idris Ier"],
        fact: "Abdallah ibn Yasin prêchait depuis un ribat sur le fleuve Sénégal, et le mouvement a pris son nom à cette forteresse.",
        source: "Encyclopaedia Britannica, notice « Almoravids »",
      },
      {
        question: "Quelle reine amazighe les Touaregs considèrent-ils comme leur ancêtre ?",
        options: ["Tin Hinan", "Dihya", "Amanirenas", "Makeda"],
        fact: "Tin Hinan est honorée comme l'ancêtre des Touaregs, et son tombeau se trouve à Abalessa, dans le Hoggar.",
        source: "Encyclopaedia Britannica, notice « Tuareg »",
      },
      {
        question: "Que fournissaient les Numides à Carthage puis à Rome, ce qui les a rendus célèbres ?",
        options: ["Une cavalerie légère", "Des éléphants de guerre", "Des machines de siège", "Des trirèmes"],
        fact: "Les cavaliers numides montaient sans selle ni bride et comptaient parmi les plus redoutés de la Méditerranée antique.",
        source: "Encyclopaedia Britannica, notice « Numidia »",
      },
      {
        question: "À quelle famille de langues appartiennent les langues amazighes ?",
        options: ["Afro-asiatique", "Niger-congo", "Nilo-saharienne", "Indo-européenne"],
        fact: "Les langues amazighes appartiennent à la famille afro-asiatique, comme l'arabe, le haoussa et l'égyptien ancien.",
        source: "Encyclopaedia Britannica, notice « Berber languages »",
      },
      {
        question: "Quelle ville d'Afrique du Nord était la capitale des rois numides avant la domination romaine ?",
        options: ["Cirta", "Carthage", "Thèbes", "Alexandrie"],
        fact: "Cirta, dans l'actuelle Algérie orientale, était la ville royale des rois numides.",
        source: "Encyclopaedia Britannica, notice « Cirta »",
      },
      {
        question: "Quelle culture les Amazighs des oasis irriguaient-ils ?",
        options: ["Les dattes", "Le caoutchouc", "Le cacao", "Le thé"],
        fact: "Les palmiers-dattiers étaient la base de l'économie des oasis, et le fruit se vendait à travers le Sahara.",
        source: "Encyclopaedia Britannica, notice « Sahara »",
      },
    ],
  },
};
