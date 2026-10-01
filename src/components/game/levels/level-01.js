/**
 * Ancient Egypt: one level of the game, on its own.
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
import { Landmark } from "lucide-react";

export default {
  id: 1,
  order: 2,
  era: "ancient",
  from: -3100,
  title: "Ancient Egypt",
  subtitle: "Land of the Pharaohs",
  region: "North Africa",
  color: "from-amber-400 to-yellow-500",
  icon: Landmark,
  gallery: {
    en: [
      {
        file: "/photos/level-1-1.jpg",
        caption: "The pyramids of Giza, built as royal tombs more than 4,500 years ago.",
        credit: "Unsplash",
        author: "Unsplash",
        licence: "Unsplash",
        source: "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800&q=80",
      },
      {
        file: "/photos/level-1-2.jpg",
        caption: "The Great Sphinx, carved from a single block of limestone.",
        credit: "Petar Milošević · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Petar Milošević",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Great_Sphinx_of_Giza_(%D8%A3%D8%A8%D9%88_%D8%A7%D9%84%D9%87%D9%88%D9%84).jpg",
      },
      {
        file: "/photos/level-1-3.jpg",
        caption: "The funeral mask of Tutankhamun, found in his tomb in 1922.",
        credit: "Dawid Wdowczyk · CC BY 4.0 · Wikimedia Commons",
        author: "Dawid Wdowczyk",
        licence: "CC BY 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Mask_of_Tutankhamun_in_2025.jpg",
      },
    ],
    fr: [
      {
        file: "/photos/level-1-1.jpg",
        caption: "Les pyramides de Gizeh, construites comme tombeaux royaux il y a plus de 4 500 ans.",
        credit: "Unsplash",
        author: "Unsplash",
        licence: "Unsplash",
        source: "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800&q=80",
      },
      {
        file: "/photos/level-1-2.jpg",
        caption: "Le grand Sphinx, taillé dans un seul bloc de calcaire.",
        credit: "Petar Milošević · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Petar Milošević",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Great_Sphinx_of_Giza_(%D8%A3%D8%A8%D9%88_%D8%A7%D9%84%D9%87%D9%88%D9%84).jpg",
      },
      {
        file: "/photos/level-1-3.jpg",
        caption: "Le masque funéraire de Toutânkhamon, retrouvé dans sa tombe en 1922.",
        credit: "Dawid Wdowczyk · CC BY 4.0 · Wikimedia Commons",
        author: "Dawid Wdowczyk",
        licence: "CC BY 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Mask_of_Tutankhamun_in_2025.jpg",
      },
    ],
  },
  study: {
    en: {
      essay: ["Ancient Egypt grew along the Nile, the river that flooded every summer and left the black silt the fields were planted in. The Egyptians called their country Kemet, the black land, after that soil, and the flood was the centre of their year. Around 3100 BC the kings of the south united Upper and Lower Egypt, and from then on one crown ruled the whole valley.", "The Old Kingdom raised the pyramids at Giza, the largest stone buildings the world had yet made. The pharaoh was held to be a god on earth, and the state around him organised the labour, the grain and the writing. Scribes learned the hundreds of signs of the hieroglyphic script and kept the accounts on rolls of papyrus.", "The Middle and New Kingdoms moved the capital south to Thebes. Hatshepsut ruled as pharaoh and sent a fleet down the Red Sea to Punt, Akhenaten raised the sun disk above the other gods, and Ramesses II covered the valley with temples and colossal statues. Armies reached Nubia, Libya and Syria, and the empire of the Nile met the empires of the Euphrates.", "In the last centuries Egypt was ruled from outside, first by Nubians, then by Persians, then by the Greek dynasty of the Ptolemies. Cleopatra VII, the last of them, lost her kingdom to Rome in 30 BC. The writing was forgotten until the Rosetta Stone, carved with the same text in three scripts, let Champollion read it again in 1822."],
      timeline: [
        {
          year: "c. 3100 BC",
          text: "Narmer unites Upper and Lower Egypt and the first dynasty rules from Memphis.",
        },
        { year: "c. 2560 BC", text: "The Great Pyramid of Khufu is finished on the plateau of Giza." },
        {
          year: "c. 1479 BC",
          text: "Hatshepsut takes the throne and sends a trading fleet to the land of Punt.",
        },
        { year: "1279 BC", text: "Ramesses II begins his reign and builds at Abu Simbel and Karnak." },
        { year: "196 BC", text: "The Rosetta Stone is carved with one text in three scripts." },
        { year: "30 BC", text: "Cleopatra VII dies and Egypt becomes a province of Rome." },
      ],
      people: [
        {
          name: "Narmer",
          text: "The king of the first dynasty, remembered for joining the two lands under one crown.",
        },
        {
          name: "Hatshepsut",
          text: "A pharaoh of the eighteenth dynasty who ruled in her own name and traded with Punt.",
        },
        {
          name: "Akhenaten",
          text: "The pharaoh who set the sun disk Aten above the other gods of Egypt.",
        },
        {
          name: "Ramesses II",
          text: "The long reigning builder of Abu Simbel, Karnak and the great mortuary temples.",
        },
        { name: "Champollion", text: "The scholar who read the hieroglyphs again in 1822." },
      ],
      places: [
        {
          name: "The Nile",
          text: "The river that flooded and made the fields, and carried the stone and the grain.",
        },
        {
          name: "Giza",
          text: "The plateau of the three great pyramids and the Sphinx, beside modern Cairo.",
        },
        {
          name: "Thebes",
          text: "The southern capital, with Karnak, Luxor temple and the Valley of the Kings.",
        },
        {
          name: "Abu Simbel",
          text: "The rock temple of Ramesses II, cut apart and raised when the dam was built.",
        },
        {
          name: "Rosetta",
          text: "The Nile town where the stone that broke the code was found in 1799.",
        },
      ],
      glossary: [
        {
          term: "hieroglyph",
          text: "A sign of the Egyptian writing, one of hundreds standing for a word or a sound.",
        },
        {
          term: "pharaoh",
          text: "The king of Egypt, first called per-aa, which means the great house.",
        },
        { term: "Kemet", text: "The black land, the name the Egyptians gave their own country." },
        {
          term: "papyrus",
          text: "Sheets pressed from river reeds, the writing surface of the scrolls.",
        },
        {
          term: "mummification",
          text: "The drying and wrapping of a body so that it could be buried whole.",
        },
      ],
    },
    fr: {
      essay: ["L'Égypte ancienne est née le long du Nil, le fleuve qui débordait chaque été et laissait le limon noir où l'on semait. Les Égyptiens appelaient leur pays Kemet, la terre noire, d'après ce limon, et la crue était le centre de leur année. Vers 3100 av. J.-C., les rois du sud ont uni la Haute et la Basse-Égypte, et une seule couronne a dès lors gouverné toute la vallée.", "L'Ancien Empire a élevé les pyramides de Gizeh, les plus grands édifices de pierre que le monde eût encore construits. Le pharaon passait pour un dieu sur terre, et l'État qui l'entourait organisait le travail, le grain et l'écriture. Les scribes apprenaient les centaines de signes de l'écriture hiéroglyphique et tenaient les comptes sur des rouleaux de papyrus.", "Le Moyen et le Nouvel Empire ont installé la capitale plus au sud, à Thèbes. Hatchepsout a régné comme pharaon et envoyé une flotte en mer Rouge vers le pays de Pount, Akhenaton a placé le disque solaire au-dessus des autres dieux, et Ramsès II a couvert la vallée de temples et de statues colossales. Ses armées ont atteint la Nubie, la Libye et la Syrie, et l'empire du Nil a rencontré ceux de l'Euphrate.", "Dans les derniers siècles, l'Égypte a été gouvernée de l'extérieur, d'abord par les Nubiens, puis par les Perses, puis par la dynastie grecque des Ptolémées. Cléopâtre VII, la dernière d'entre eux, a perdu son royaume au profit de Rome en 30 av. J.-C. L'écriture a été oubliée jusqu'à ce que la pierre de Rosette, gravée du même texte en trois écritures, permette à Champollion de la relire en 1822."],
      timeline: [
        {
          year: "v. 3100 av. J.-C.",
          text: "Narmer unit la Haute et la Basse-Égypte, et la première dynastie règne depuis Memphis.",
        },
        {
          year: "v. 2560 av. J.-C.",
          text: "La grande pyramide de Khoufou est achevée sur le plateau de Gizeh.",
        },
        {
          year: "v. 1479 av. J.-C.",
          text: "Hatchepsout monte sur le trône et envoie une flotte commerciale au pays de Pount.",
        },
        {
          year: "1279 av. J.-C.",
          text: "Ramsès II commence son règne et bâtit à Abou Simbel et à Karnak.",
        },
        {
          year: "196 av. J.-C.",
          text: "La pierre de Rosette est gravée d'un même texte en trois écritures.",
        },
        { year: "30 av. J.-C.", text: "Cléopâtre VII meurt et l'Égypte devient une province romaine." },
      ],
      people: [
        {
          name: "Narmer",
          text: "Le roi de la première dynastie, resté célèbre pour avoir réuni les deux pays sous une seule couronne.",
        },
        {
          name: "Hatchepsout",
          text: "Un pharaon de la XVIIIe dynastie, qui a régné en son propre nom et commerçait avec Pount.",
        },
        {
          name: "Akhenaton",
          text: "Le pharaon qui a placé le disque solaire Aton au-dessus des autres dieux d'Égypte.",
        },
        {
          name: "Ramsès II",
          text: "Le bâtisseur au long règne, auteur d'Abou Simbel, de Karnak et des grands temples funéraires.",
        },
        { name: "Champollion", text: "Le savant qui a relu les hiéroglyphes en 1822." },
      ],
      places: [
        {
          name: "Le Nil",
          text: "Le fleuve qui débordait, faisait les récoltes et portait la pierre comme le grain.",
        },
        {
          name: "Gizeh",
          text: "Le plateau des trois grandes pyramides et du Sphinx, aux portes du Caire actuel.",
        },
        {
          name: "Thèbes",
          text: "La capitale du sud, avec Karnak, le temple de Louxor et la Vallée des Rois.",
        },
        {
          name: "Abou Simbel",
          text: "Le temple rupestre de Ramsès II, découpé et remonté lors de la construction du barrage.",
        },
        {
          name: "Rosette",
          text: "La ville du delta où la pierre qui a brisé le code a été trouvée en 1799.",
        },
      ],
      glossary: [
        {
          term: "hiéroglyphe",
          text: "Un signe de l'écriture égyptienne, l'un des centaines qui notent un mot ou un son.",
        },
        {
          term: "pharaon",
          text: "Le roi d'Égypte, d'abord appelé per-aa, ce qui veut dire la grande maison.",
        },
        {
          term: "Kemet",
          text: "La terre noire, le nom que les Égyptiens donnaient à leur propre pays.",
        },
        {
          term: "papyrus",
          text: "Des feuilles pressées dans les roseaux du fleuve, la surface des rouleaux.",
        },
        {
          term: "momification",
          text: "Le séchage et l'enveloppement d'un corps pour qu'il soit enterré entier.",
        },
      ],
    },
  },
  questions: [
    {
      question: "Which river was essential to Ancient Egyptian civilization?",
      options: ["Amazon River", "Nile River", "Congo River", "Niger River"],
      correct: 1,
      fact: "The Nile River is the longest river in Africa and was the lifeline of Ancient Egypt!",
      source: { label: "Encyclopaedia Britannica, \"Ancient Egypt\"" },
    },
    {
      question: "What are the Great Pyramids of Giza?",
      options: ["Temples", "Tombs for Pharaohs", "Marketplaces", "Schools"],
      correct: 1,
      fact: "The pyramids were built as tombs for pharaohs and are over 4,500 years old!",
      source: {
        label: "UNESCO World Heritage List, Memphis and its Necropolis",
        url: "https://whc.unesco.org/en/list/86/",
      },
    },
    {
      question: "Who was the famous young pharaoh whose tomb was discovered in 1922?",
      options: ["Ramesses II", "Cleopatra", "Tutankhamun", "Khufu"],
      correct: 2,
      fact: "Tutankhamun became pharaoh at just 9 years old!",
      source: { label: "Encyclopaedia Britannica, \"Tutankhamun\"" },
    },
    {
      question: "What writing system did Ancient Egyptians use?",
      options: ["Alphabet", "Hieroglyphics", "Cuneiform", "Roman numerals"],
      correct: 1,
      fact: "Hieroglyphics used over 700 different symbols to write words and sounds!",
      source: { label: "Encyclopaedia Britannica, \"Ancient Egypt\"" },
    },
    {
      question: "What was the Sphinx?",
      options: ["A type of boat", "A mythical creature statue", "A weapon", "A musical instrument"],
      correct: 1,
      fact: "The Great Sphinx has the body of a lion and the head of a human!",
      source: { label: "Encyclopaedia Britannica, \"Great Sphinx of Giza\"" },
    },
    {
      question: "Which pharaoh is believed to have commissioned the Great Sphinx of Giza?",
      options: ["Khufu", "Khafre", "Menkaure", "Ramesses II"],
      correct: 1,
      fact: "The Sphinx is widely believed to bear the face of Pharaoh Khafre, who built the second pyramid at Giza!",
      source: { label: "Encyclopaedia Britannica, \"Great Sphinx of Giza\"" },
    },
    {
      question: "What is the ancient Egyptian word for pharaoh, meaning 'Great House'?",
      options: ["Ankh", "Per-aa", "Maat", "Djed"],
      correct: 1,
      fact: "'Per-aa' originally referred to the royal palace, not the ruler, it later evolved to mean the king himself!",
      source: { label: "Encyclopaedia Britannica, \"Ancient Egypt\"" },
    },
    {
      question: "In what year did the Rosetta Stone allow scholars to finally decode hieroglyphics?",
      options: ["1799", "1822", "1901", "1755"],
      correct: 1,
      fact: "Jean-François Champollion cracked the hieroglyphic code in 1822 using the Rosetta Stone, which had the same text in three scripts!",
      source: { label: "Encyclopaedia Britannica, \"Rosetta Stone\"" },
    },
    {
      question: "Which goddess of Ancient Egypt was associated with magic, motherhood, and was the sister-wife of Osiris?",
      options: ["Hathor", "Sekhmet", "Isis", "Nephthys"],
      correct: 2,
      fact: "Isis was one of the most important goddesses, her cult spread beyond Egypt into the Roman Empire!",
      source: { label: "Encyclopaedia Britannica, \"Ancient Egypt\"" },
    },
    {
      question: "The 'Book of the Dead' was a collection of magical spells used for what purpose?",
      options: ["Cursing enemies", "Guiding the soul through the afterlife", "Teaching children", "Predicting harvests"],
      correct: 1,
      fact: "The Book of the Dead contained over 200 spells to help the deceased navigate the dangers of the Duat (underworld)!",
      source: { label: "Encyclopaedia Britannica, \"Ancient Egypt\"" },
    },
    {
      question: "Which pharaoh is credited with building the Great Pyramid at Giza?",
      options: ["Khufu", "Ramesses II", "Akhenaten", "Tutankhamun"],
      correct: 0,
      fact: "The Great Pyramid of Khufu was the tallest human-made structure in the world for about 3,800 years!",
      source: {
        label: "UNESCO World Heritage List, Memphis and its Necropolis",
        url: "https://whc.unesco.org/en/list/86/",
      },
    },
    {
      question: "What writing material did the ancient Egyptians make from the papyrus plant?",
      options: ["Parchment", "Papyrus", "Clay tablets", "Bamboo strips"],
      correct: 1,
      fact: "Papyrus sheets were made by pressing strips of the plant stem together, and the word 'paper' comes from the name of this plant!",
      source: { label: "Encyclopaedia Britannica, \"Ancient Egypt\"" },
    },
    {
      question: "Who was the last active pharaoh of Ancient Egypt before it became a Roman province?",
      options: ["Nefertiti", "Hatshepsut", "Cleopatra VII", "Nefertari"],
      correct: 2,
      fact: "Cleopatra VII ruled until 30 BC; after her death Egypt became a province of the Roman Empire, ending nearly 3,000 years of native rule!",
      source: { label: "Encyclopaedia Britannica, \"Cleopatra\"" },
    },
    {
      question: "Which temple in Nubia was moved block by block in the 1960s to save it from Lake Nasser?",
      options: ["Abu Simbel", "Karnak", "The Sphinx", "The pyramid of Menkaure"],
      correct: 0,
      fact: "The temples of Abu Simbel were cut apart and rebuilt higher up in a UNESCO campaign, the largest archaeological rescue ever mounted.",
      source: {
        label: "UNESCO World Heritage List, Nubian Monuments from Abu Simbel to Philae",
        url: "https://whc.unesco.org/en/list/88/",
      },
    },
    {
      question: "Which woman ruled Egypt as pharaoh and sent a trading expedition to the land of Punt?",
      options: ["Hatshepsut", "Nefertiti", "Cleopatra VII", "Nefertari"],
      correct: 0,
      fact: "Hatshepsut ruled in the 15th century BC, was shown with a pharaoh's beard, and recorded her Punt expedition on the walls of her temple.",
      source: { label: "Encyclopaedia Britannica, \"Hatshepsut\"" },
    },
    {
      question: "Which queen of Egypt, the wife of Akhenaten, is known from a painted bust found at Amarna?",
      options: ["Nefertiti", "Hatshepsut", "Nefertari", "Cleopatra VII"],
      correct: 0,
      fact: "The bust of Nefertiti, found in a sculptor's workshop at Amarna in 1912, is one of the best known works of ancient Egyptian art.",
      source: { label: "Encyclopaedia Britannica, \"Nefertiti\"" },
    },
    {
      question: "Which pharaoh moved the capital to a new city at Amarna and worshipped the sun disk Aten?",
      options: ["Akhenaten", "Khufu", "Ramesses II", "Tutankhamun"],
      correct: 0,
      fact: "Akhenaten put the Aten above the other gods and built a whole city for it, and the capital was abandoned soon after his death.",
      source: { label: "Encyclopaedia Britannica, \"Akhenaten\"" },
    },
    {
      question: "What did the ancient Egyptians call their own country, after the black soil left by the Nile flood?",
      options: ["Kemet, the black land", "Deshret, the red land", "Ta-Seti, the land of the bow", "Irem, the land of the south"],
      correct: 0,
      fact: "Kemet was the black land of the flood plain, and the red land of the desert was called Deshret, so the names of Egypt came from the soil itself.",
      source: { label: "Encyclopaedia Britannica, \"Egypt\"" },
    },
    {
      question: "Who designed the step pyramid at Saqqara, the first pyramid raised in Egypt?",
      options: ["Imhotep", "Khufu", "Khafre", "Sneferu"],
      correct: 0,
      fact: "Imhotep built the step pyramid for king Djoser, and later Egyptians remembered him as a sage and a healer.",
      source: { label: "Encyclopaedia Britannica, \"Djoser\"" },
    },
    {
      question: "Which pharaoh signed the earliest surviving peace treaty, with the Hittites?",
      options: ["Ramesses II", "Tutankhamun", "Thutmose III", "Cleopatra VII"],
      correct: 0,
      fact: "Ramesses II and the Hittite king drew up a treaty after the battle of Kadesh, and copies of it survive in both capitals.",
      source: { label: "Encyclopaedia Britannica, \"Ramesses II\"" },
    },
    {
      question: "Where were the pharaohs of the New Kingdom buried, in tombs cut into rock near Thebes?",
      options: ["The Valley of the Kings", "The Great Pyramid", "The Nile delta", "The Fayyum"],
      correct: 0,
      fact: "Sixty or more tombs were cut into the Valley of the Kings, and most of them were robbed in antiquity.",
      source: { label: "Encyclopaedia Britannica, \"Valley of the Kings\"" },
    },
  ],
  fr: {
    title: "Égypte antique",
    subtitle: "Terre des pharaons",
    region: "Afrique du Nord",
    questions: [
      {
        question: "Quel fleuve était essentiel à la civilisation de l'Égypte antique ?",
        options: ["L'Amazone", "Le Nil", "Le Congo", "Le Niger"],
        fact: "Le Nil est le plus long fleuve d'Afrique et il était le cordon vital de l'Égypte antique !",
        source: "Encyclopaedia Britannica, notice « Ancient Egypt »",
      },
      {
        question: "Que sont les grandes pyramides de Gizeh ?",
        options: ["Des temples", "Des tombeaux de pharaons", "Des marchés", "Des écoles"],
        fact: "Les pyramides ont été construites comme tombeaux pour les pharaons et elles ont plus de 4 500 ans !",
        source: "Liste du patrimoine mondial de l'UNESCO, Memphis et sa nécropole",
      },
      {
        question: "Quel est ce jeune pharaon célèbre dont le tombeau a été découvert en 1922 ?",
        options: ["Ramsès II", "Cléopâtre", "Toutânkhamon", "Khéops"],
        fact: "Toutânkhamon est devenu pharaon à seulement 9 ans !",
        source: "Encyclopaedia Britannica, notice « Tutankhamun »",
      },
      {
        question: "Quel système d'écriture utilisaient les anciens Égyptiens ?",
        options: ["L'alphabet", "Les hiéroglyphes", "L'écriture cunéiforme", "Les chiffres romains"],
        fact: "Les hiéroglyphes comptaient plus de 700 symboles différents pour écrire des mots et des sons !",
        source: "Encyclopaedia Britannica, notice « Ancient Egypt »",
      },
      {
        question: "Qu'était le Sphinx ?",
        options: ["Un type de bateau", "Une statue de créature mythique", "Une arme", "Un instrument de musique"],
        fact: "Le grand Sphinx a un corps de lion et une tête humaine !",
        source: "Encyclopaedia Britannica, notice « Great Sphinx of Giza »",
      },
      {
        question: "Quel pharaon aurait fait construire le grand Sphinx de Gizeh ?",
        options: ["Khéops", "Khéphren", "Mykérinos", "Ramsès II"],
        fact: "On pense que le Sphinx porte le visage du pharaon Khéphren, qui a fait bâtir la deuxième pyramide de Gizeh !",
        source: "Encyclopaedia Britannica, notice « Great Sphinx of Giza »",
      },
      {
        question: "Quel mot de l'Égypte antique désignait le pharaon et signifiait la grande maison ?",
        options: ["Ankh", "Per-aa", "Maât", "Djed"],
        fact: "Per-aa désignait d'abord le palais royal et non le souverain, avant de finir par désigner le roi lui-même !",
        source: "Encyclopaedia Britannica, notice « Ancient Egypt »",
      },
      {
        question: "En quelle année la pierre de Rosette a-t-elle permis de déchiffrer enfin les hiéroglyphes ?",
        options: ["1799", "1822", "1901", "1755"],
        fact: "Jean-François Champollion a percé le secret des hiéroglyphes en 1822 grâce à la pierre de Rosette, qui portait le même texte en trois écritures !",
        source: "Encyclopaedia Britannica, notice « Rosetta Stone »",
      },
      {
        question: "Quelle déesse de l'Égypte antique était liée à la magie et à la maternité, et était la sœur et l'épouse d'Osiris ?",
        options: ["Hathor", "Sekhmet", "Isis", "Nephthys"],
        fact: "Isis était l'une des déesses les plus importantes, et son culte s'est répandu bien au-delà de l'Égypte, jusque dans l'Empire romain !",
        source: "Encyclopaedia Britannica, notice « Ancient Egypt »",
      },
      {
        question: "À quoi servait le Livre des morts, un recueil de formules magiques ?",
        options: ["À maudire les ennemis", "À guider l'âme dans l'au-delà", "À instruire les enfants", "À prédire les récoltes"],
        fact: "Le Livre des morts contenait plus de 200 formules pour aider le défunt à traverser les dangers de la Douat, le monde souterrain !",
        source: "Encyclopaedia Britannica, notice « Ancient Egypt »",
      },
      {
        question: "Quel pharaon a fait construire la grande pyramide de Gizeh ?",
        options: ["Khéops", "Ramsès II", "Akhénaton", "Toutânkhamon"],
        fact: "La grande pyramide de Khéops est restée la plus haute construction humaine du monde pendant environ 3 800 ans !",
        source: "Liste du patrimoine mondial de l'UNESCO, Memphis et sa nécropole",
      },
      {
        question: "Quel support d'écriture les anciens Égyptiens fabriquaient-ils avec la plante de papyrus ?",
        options: ["Le parchemin", "Le papyrus", "Les tablettes d'argile", "Les lamelles de bambou"],
        fact: "Les feuilles de papyrus étaient obtenues en pressant des lamelles de la tige, et le mot papier vient du nom de cette plante !",
        source: "Encyclopaedia Britannica, notice « Ancient Egypt »",
      },
      {
        question: "Qui fut le dernier pharaon régnant d'Égypte avant qu'elle ne devienne une province romaine ?",
        options: ["Néfertiti", "Hatchepsout", "Cléopâtre VII", "Néfertari"],
        fact: "Cléopâtre VII a régné jusqu'en 30 av. J.-C. ; après sa mort, l'Égypte est devenue une province romaine, mettant fin à près de 3 000 ans de pouvoir local !",
        source: "Encyclopaedia Britannica, notice « Cleopatra »",
      },
      {
        question: "Quel temple de Nubie a été déplacé bloc par bloc dans les années 1960 pour le sauver du lac Nasser ?",
        options: ["Abou Simbel", "Karnak", "Le Sphinx", "La pyramide de Mykérinos"],
        fact: "Les temples d'Abou Simbel ont été découpés et remontés plus haut lors d'une campagne de l'UNESCO, le plus grand sauvetage archéologique jamais entrepris.",
        source: "Liste du patrimoine mondial de l'UNESCO, Monuments de Nubie d'Abou Simbel à Philae",
      },
      {
        question: "Quelle femme a régné sur l'Égypte comme pharaon et envoyé une expédition commerciale au pays de Pount ?",
        options: ["Hatchepsout", "Néfertiti", "Cléopâtre VII", "Néfertari"],
        fact: "Hatchepsout a régné au XVe siècle av. J.-C., était représentée avec la barbe du pharaon et a fait graver son expédition de Pount sur les murs de son temple.",
        source: "Encyclopaedia Britannica, notice « Hatshepsut »",
      },
      {
        question: "Quelle reine d'Égypte, épouse d'Akhénaton, est connue par un buste peint découvert à Amarna ?",
        options: ["Néfertiti", "Hatchepsout", "Néfertari", "Cléopâtre VII"],
        fact: "Le buste de Néfertiti, trouvé en 1912 dans l'atelier d'un sculpteur à Amarna, est l'une des œuvres les plus connues de l'art égyptien antique.",
        source: "Encyclopaedia Britannica, notice « Nefertiti »",
      },
      {
        question: "Quel pharaon a transféré sa capitale dans une ville nouvelle à Amarna et adoré le disque solaire Aton ?",
        options: ["Akhénaton", "Khéops", "Ramsès II", "Toutânkhamon"],
        fact: "Akhénaton a placé Aton au-dessus des autres dieux et bâti une ville entière pour lui, et la capitale a été abandonnée peu après sa mort.",
        source: "Encyclopaedia Britannica, notice « Akhenaten »",
      },
      {
        question: "Comment les anciens Égyptiens appelaient-ils leur propre pays, d'après la terre noire laissée par la crue du Nil ?",
        options: ["Kemet, la terre noire", "Deshret, la terre rouge", "Ta-Seti, la terre de l'arc", "Irem, la terre du sud"],
        fact: "Kemet était la terre noire de la plaine inondable et Deshret la terre rouge du désert, si bien que les noms de l'Égypte venaient du sol lui-même.",
        source: "Encyclopaedia Britannica, notice « Egypt »",
      },
      {
        question: "Qui a conçu la pyramide à degrés de Saqqarah, la première pyramide élevée en Égypte ?",
        options: ["Imhotep", "Khéops", "Khéphren", "Snéfrou"],
        fact: "Imhotep a bâti la pyramide à degrés pour le roi Djéser, et les Égyptiens l'ont ensuite honoré comme un sage et un guérisseur.",
        source: "Encyclopaedia Britannica, notice « Djoser »",
      },
      {
        question: "Quel pharaon a signé le plus ancien traité de paix conservé, avec les Hittites ?",
        options: ["Ramsès II", "Toutânkhamon", "Thoutmosis III", "Cléopâtre VII"],
        fact: "Ramsès II et le roi hittite ont conclu un traité après la bataille de Qadesh, et des copies en subsistent dans les deux capitales.",
        source: "Encyclopaedia Britannica, notice « Ramesses II »",
      },
      {
        question: "Où les pharaons du Nouvel Empire étaient-ils enterrés, dans des tombes creusées dans la roche près de Thèbes ?",
        options: ["La vallée des Rois", "La grande pyramide", "Le delta du Nil", "Le Fayoum"],
        fact: "Soixante tombes ou plus ont été creusées dans la vallée des Rois, et la plupart ont été pillées dès l'Antiquité.",
        source: "Encyclopaedia Britannica, notice « Valley of the Kings »",
      },
    ],
  },
};
