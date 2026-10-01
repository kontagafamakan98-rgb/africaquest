/**
 * Human Origins: one level of the game, on its own.
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
import { Footprints } from "lucide-react";

export default {
  id: 9,
  order: 1,
  era: "origins",
  from: -300000,
  title: "Human Origins",
  subtitle: "Africa, cradle of humankind",
  region: "Whole of Africa",
  color: "from-stone-500 to-amber-800",
  icon: Footprints,
  gallery: {
    en: [
      {
        file: "/photos/level-9-1.jpg",
        caption: "The Olduvai Gorge in Tanzania, where some of the oldest stone tools of humankind were found.",
        credit: "Mike Krüger · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Mike Krüger",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Olduvai-Schlucht_Mike_Kr%C3%BCger_110126_1.jpg",
      },
      {
        file: "/photos/level-9-2.jpg",
        caption: "Inside the Sterkfontein caves in South Africa, where many hominin fossils have been dug out of the rock.",
        credit: "Mike Peel · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Mike Peel",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Sterkfontein_Caves_23.jpg",
      },
      {
        file: "/photos/level-9-3.jpg",
        caption: "A cast of the Taung Child, the skull of a young Australopithecus found in South Africa in 1924.",
        credit: "Gerbil · CC BY-SA 3.0 · Wikimedia Commons",
        author: "Gerbil",
        licence: "CC BY-SA 3.0",
        source: "https://commons.wikimedia.org/wiki/File:Taung_child_(Frankfurt_am_Main)_1-EditMylius.jpg",
      },
    ],
    fr: [
      {
        file: "/photos/level-9-1.jpg",
        caption: "La gorge d'Olduvai, en Tanzanie, où furent retrouvés certains des plus anciens outils de pierre de l'humanité.",
        credit: "Mike Krüger · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Mike Krüger",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Olduvai-Schlucht_Mike_Kr%C3%BCger_110126_1.jpg",
      },
      {
        file: "/photos/level-9-2.jpg",
        caption: "À l'intérieur des grottes de Sterkfontein, en Afrique du Sud, d'où de nombreux fossiles d'hominidés ont été extraits de la roche.",
        credit: "Mike Peel · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Mike Peel",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Sterkfontein_Caves_23.jpg",
      },
      {
        file: "/photos/level-9-3.jpg",
        caption: "Le moulage de l'enfant de Taung, le crâne d'un jeune australopithèque découvert en Afrique du Sud en 1924.",
        credit: "Gerbil · CC BY-SA 3.0 · Wikimedia Commons",
        author: "Gerbil",
        licence: "CC BY-SA 3.0",
        source: "https://commons.wikimedia.org/wiki/File:Taung_child_(Frankfurt_am_Main)_1-EditMylius.jpg",
      },
    ],
  },
  study: {
    en: {
      essay: ["Every human being alive today belongs to a species that was born in Africa. More than 300,000 years ago our ancestors lived across the whole continent, from the hills of Morocco to the Ethiopian rift valley, and the oldest known fossils of our own species come from Jebel Irhoud in Morocco.", "The earliest stone tools come from the shores of Lake Turkana, and hand axes of the Acheulean kind were made in Africa for more than a million years before anyone thought of farming. Knapping a hand axe takes a plan, a steady hand and a memory of how the last one was made, which is a way of saying that the human mind has a long African history.", "The people of those long ages were not waiting for history to begin. They buried their dead with care, painted on rock, and carried ochre and shells hundreds of kilometres from where they were found. The rock art of the Sahara, from Tassili n'Ajjer to the Nile, shows a green savannah of elephants, giraffes and cattle that the desert has since swallowed.", "Then, around a hundred thousand years ago, groups left the continent and their descendants settled the whole world. Long before any kingdom existed, Africa was already carrying the entire human story, and it is still the continent with more genetic variety than all the others put together."],
      timeline: [
        {
          year: "c. 3.3 million years ago",
          text: "The oldest known stone tools are made at Lomekwi, by Lake Turkana.",
        },
        {
          year: "c. 1.8 million years ago",
          text: "Hand axes of the Acheulean kind spread across the continent.",
        },
        {
          year: "c. 315,000 years ago",
          text: "The oldest fossils of our own species are buried at Jebel Irhoud.",
        },
        {
          year: "c. 100,000 years ago",
          text: "Groups leave Africa and their descendants settle the whole world.",
        },
        {
          year: "c. 20,000 years ago",
          text: "Painters work in the caves of the Sahara and of southern Africa.",
        },
      ],
      people: [
        {
          name: "The Lomekwi toolmakers",
          text: "The earliest known people to shape stone for a purpose.",
        },
        { name: "Homo erectus", text: "The species whose long legs carried it out of Africa." },
        { name: "The Jebel Irhoud people", text: "The oldest known members of our own species." },
        {
          name: "The San painters",
          text: "The artists of southern Africa whose rock art is among the oldest in the world.",
        },
      ],
      places: [
        { name: "Jebel Irhoud", text: "The Moroccan cave site of the oldest fossils of our species." },
        {
          name: "The Ethiopian rift valley",
          text: "The valley of early fossils such as Lucy, near Hadar.",
        },
        {
          name: "Lake Turkana",
          text: "The Kenyan lake on whose shores the earliest stone tools were found.",
        },
        {
          name: "Tassili n'Ajjer",
          text: "The Algerian plateau of thousands of rock paintings of a greener Sahara.",
        },
      ],
      glossary: [
        {
          term: "hominin",
          text: "A member of the human line, and of the lines that share its ancestry.",
        },
        { term: "Acheulean", text: "The long industry of large hand axes made across Africa." },
        {
          term: "stratigraphy",
          text: "The reading of layers of soil to put the things in them in order.",
        },
        { term: "fossil", text: "The remains of a living thing preserved in rock." },
        {
          term: "rock art",
          text: "Pictures painted or carved on stone, the oldest writing of the human mind.",
        },
      ],
    },
    fr: {
      essay: ["Tous les êtres humains vivants appartiennent à une espèce née en Afrique. Il y a plus de 300 000 ans, nos ancêtres vivaient sur tout le continent, des collines du Maroc à la vallée du Rift éthiopien, et les plus anciens fossiles connus de notre espèce viennent de Jebel Irhoud, au Maroc.", "Les plus anciens outils de pierre viennent des rives du lac Turkana, et on a fabriqué des bifaces acheuléens en Afrique pendant plus d'un million d'années avant que quiconque songe à cultiver la terre. Tailler un biface demande un plan, une main sûre et le souvenir de la façon dont le précédent a été fait : c'est une manière de dire que l'esprit humain a une longue histoire africaine.", "Les gens de ces temps longs n'attendaient pas que l'histoire commence. Ils enterraient leurs morts avec soin, peignaient sur la roche et transportaient de l'ocre et des coquillages à des centaines de kilomètres de leur origine. L'art rupestre du Sahara, du Tassili n'Ajjer au Nil, montre une savane verte d'éléphants, de girafes et de bovins que le désert a depuis engloutie.", "Puis, il y a environ cent mille ans, des groupes ont quitté le continent et leurs descendants ont peuplé le monde entier. Bien avant le premier royaume, l'Afrique portait déjà toute l'histoire humaine, et c'est encore le continent qui réunit plus de diversité génétique que tous les autres ensemble."],
      timeline: [
        {
          year: "v. 3,3 millions d'années",
          text: "Les plus anciens outils de pierre connus sont taillés à Lomekwi, près du lac Turkana.",
        },
        {
          year: "v. 1,8 million d'années",
          text: "Les bifaces acheuléens se répandent sur le continent.",
        },
        {
          year: "v. 315 000 ans",
          text: "Les plus anciens fossiles de notre espèce sont ensevelis à Jebel Irhoud.",
        },
        {
          year: "v. 100 000 ans",
          text: "Des groupes quittent l'Afrique et leurs descendants peuplent le monde entier.",
        },
        {
          year: "v. 20 000 ans",
          text: "Des peintres travaillent dans les grottes du Sahara et d'Afrique australe.",
        },
      ],
      people: [
        {
          name: "Les tailleurs de Lomekwi",
          text: "Les plus anciens êtres connus à façonner la pierre pour un usage.",
        },
        { name: "Homo erectus", text: "L'espèce dont les longues jambes l'ont portée hors d'Afrique." },
        {
          name: "Les habitants de Jebel Irhoud",
          text: "Les plus anciens membres connus de notre espèce.",
        },
        {
          name: "Les peintres san",
          text: "Les artistes d'Afrique australe dont l'art rupestre compte parmi les plus anciens du monde.",
        },
      ],
      places: [
        { name: "Jebel Irhoud", text: "La grotte marocaine des plus anciens fossiles de notre espèce." },
        {
          name: "La vallée du Rift éthiopien",
          text: "La vallée des premiers fossiles, comme Lucy, près de Hadar.",
        },
        {
          name: "Le lac Turkana",
          text: "Le lac kényan sur les rives duquel les plus anciens outils ont été trouvés.",
        },
        {
          name: "Le Tassili n'Ajjer",
          text: "Le plateau algérien aux milliers de peintures rupestres d'un Sahara plus vert.",
        },
      ],
      glossary: [
        {
          term: "homine",
          text: "Un membre de la lignée humaine et des lignées qui partagent son ascendance.",
        },
        {
          term: "acheuléen",
          text: "La longue industrie des grands bifaces taillés à travers l'Afrique.",
        },
        {
          term: "stratigraphie",
          text: "La lecture des couches de sol pour ordonner ce qu'elles contiennent.",
        },
        { term: "fossile", text: "Les restes d'un être vivant conservés dans la roche." },
        {
          term: "art rupestre",
          text: "Des images peintes ou gravées sur la pierre, la plus ancienne écriture de l'esprit humain.",
        },
      ],
    },
  },
  questions: [
    {
      question: "In which country were some of the oldest fossils of our own species, Homo sapiens, found?",
      options: ["Egypt", "Ethiopia", "Kenya", "Morocco"],
      correct: 1,
      fact: "The Omo Kibish remains in Ethiopia are about 230,000 years old, which makes them among the oldest known fossils of our species.",
      source: { label: "Encyclopaedia Britannica, \"human evolution\"" },
    },
    {
      question: "Which site in Morocco has yielded Homo sapiens fossils around 300,000 years old?",
      options: ["Jebel Irhoud", "Olduvai Gorge", "Blombos Cave", "Sterkfontein"],
      correct: 0,
      fact: "Jebel Irhoud pushed the origin of our species back to about 300,000 years and showed that early Homo sapiens lived all over the continent, not in one corner.",
      source: { label: "Encyclopaedia Britannica, \"human evolution\"" },
    },
    {
      question: "Which gorge in Tanzania, explored by Louis and Mary Leakey, is famous for early human fossils and stone tools?",
      options: ["Olduvai Gorge", "The Kalahari Basin", "The Nile Delta", "Lake Chad"],
      correct: 0,
      fact: "Olduvai Gorge gave its name to some of the earliest stone tools and hominin fossils ever found.",
      source: { label: "Encyclopaedia Britannica, \"Olduvai Gorge\"" },
    },
    {
      question: "What is the name of the oldest known stone tool tradition, first identified at Olduvai Gorge?",
      options: ["Oldowan", "Acheulean", "Neolithic", "Iron age"],
      correct: 0,
      fact: "Oldowan tools were simple flakes struck from a stone core more than 2.5 million years ago, long before our own species appeared.",
      source: { label: "Encyclopaedia Britannica, \"Olduvai Gorge\"" },
    },
    {
      question: "What did archaeologists find in Blombos Cave in South Africa that shows early symbolic thinking?",
      options: ["A stone pyramid", "A block of ochre engraved with a deliberate pattern", "A written alphabet", "A bronze statue"],
      correct: 1,
      fact: "The engraved ochre of Blombos Cave is about 77,000 years old and counts as one of the oldest known abstract designs in the world.",
      source: { label: "Encyclopaedia Britannica, \"human evolution\"" },
    },
    {
      question: "The rock paintings of the San, such as those of Tsodilo in Botswana, mostly show what?",
      options: ["Cities and palaces", "Animals, hunters and dancers", "Kings and queens", "Ships and harbours"],
      correct: 1,
      fact: "Tsodilo holds more than 4,500 paintings, and people have used the site for at least 100,000 years.",
      source: { label: "UNESCO World Heritage List, Tsodilo", url: "https://whc.unesco.org/en/list/1021/" },
    },
    {
      question: "Which of these food plants was first domesticated by farmers in Africa?",
      options: ["Wheat", "Barley", "Pearl millet", "Maize"],
      correct: 2,
      fact: "Pearl millet, sorghum, yams, teff and African rice were all domesticated in Africa thousands of years before wheat or maize reached the continent.",
      source: {
        label: "UNESCO, General History of Africa, volume I",
        url: "https://www.unesco.org/en/general-history-africa",
      },
    },
    {
      question: "What had people in parts of Africa already mastered more than 2,000 years ago?",
      options: ["Smelting iron", "Printing books", "Building steam engines", "Navigating with compasses"],
      correct: 0,
      fact: "Iron furnaces were working in the Great Lakes region by about 2000 BC and in West Africa by 500 BC, and iron tools changed farming and warfare.",
      source: {
        label: "UNESCO, General History of Africa, volume I",
        url: "https://www.unesco.org/en/general-history-africa",
      },
    },
    {
      question: "Which early human, whose name means 'handy man', is linked to the first stone tools?",
      options: ["Homo habilis", "Homo erectus", "Australopithecus afarensis", "Homo neanderthalensis"],
      correct: 0,
      fact: "Homo habilis lived in East Africa between about 2.4 and 1.4 million years ago, and its name was given for the tools found near its bones.",
      source: { label: "Encyclopaedia Britannica, \"Homo habilis\"" },
    },
    {
      question: "Whose 3.2-million-year-old skeleton, found in Ethiopia in 1974, is known as Lucy?",
      options: ["Australopithecus afarensis", "Homo sapiens", "Homo erectus", "Paranthropus"],
      correct: 0,
      fact: "Lucy belongs to Australopithecus afarensis, and her bones show a creature that walked upright long before our own species appeared.",
      source: { label: "Encyclopaedia Britannica, \"Lucy\"" },
    },
    {
      question: "In which country was the near-complete Homo erectus skeleton known as Turkana Boy found?",
      options: ["Kenya", "Egypt", "Morocco", "South Africa"],
      correct: 0,
      fact: "Turkana Boy was found west of Lake Turkana in Kenya in 1984, and he is the most complete early human skeleton ever discovered.",
      source: { label: "Encyclopaedia Britannica, \"Homo erectus\"" },
    },
    {
      question: "Which caves in South Africa, part of the Cradle of Humankind, have yielded hundreds of early human fossils?",
      options: ["Sterkfontein", "Blombos", "Tsodilo", "Olduvai"],
      correct: 0,
      fact: "The Sterkfontein caves have given up a large share of all early hominin fossils ever found, and the area is a World Heritage site.",
      source: {
        label: "UNESCO World Heritage List, Fossil Hominid Sites of South Africa",
        url: "https://whc.unesco.org/en/list/915/",
      },
    },
    {
      question: "Which 4.4-million-year-old hominin, found in Ethiopia, is older than Lucy?",
      options: ["Ardipithecus ramidus", "Australopithecus afarensis", "Homo habilis", "Homo erectus"],
      correct: 0,
      fact: "Ardipithecus ramidus, known as Ardi, showed that our ancestors could walk upright in woodland, not only on open grassland.",
      source: { label: "Encyclopaedia Britannica, \"Ardipithecus\"" },
    },
    {
      question: "Some of the oldest pottery in the world was made about 11,000 years ago at Ounjougou, in which present-day country?",
      options: ["Mali", "Kenya", "Tunisia", "Zimbabwe"],
      correct: 0,
      fact: "Potters at Ounjougou, in today's Mali, were making decorated vessels before farming reached most of the world.",
      source: {
        label: "UNESCO, General History of Africa, volume I",
        url: "https://www.unesco.org/en/general-history-africa",
      },
    },
    {
      question: "Which drink, now grown across the tropics, was first cultivated in the Ethiopian highlands?",
      options: ["Coffee", "Tea", "Cocoa", "Sugarcane"],
      correct: 0,
      fact: "Coffea arabica grows wild in the Ethiopian highlands, and the drink made from it spread first to Arabia and then across the world.",
      source: { label: "Encyclopaedia Britannica, \"coffee\"" },
    },
    {
      question: "Which stone tool tradition, named after a site in France, followed the Oldowan and is known for its large hand axes?",
      options: ["The Acheulean", "The Oldowan", "The Mesolithic", "The Neolithic"],
      correct: 0,
      fact: "Acheulean hand axes were made in Africa for more than a million years, and they are found from South Africa to Europe and India.",
      source: { label: "Encyclopaedia Britannica, \"Acheulean industry\"" },
    },
    {
      question: "In which country are the rock paintings of Tassili n'Ajjer, which show a Sahara full of cattle and giraffes?",
      options: ["Algeria", "Egypt", "Kenya", "Morocco"],
      correct: 0,
      fact: "The paintings of the Tassili plateau were made when the Sahara was grassland, and they show herds, hunters and the animals of a wetter world.",
      source: { label: "Encyclopaedia Britannica, \"Tassili n'Ajjer\"" },
    },
    {
      question: "Which early human species was the first to leave Africa and settle in Asia and Europe?",
      options: ["Homo erectus", "Homo habilis", "Australopithecus afarensis", "Homo neanderthalensis"],
      correct: 0,
      fact: "Homo erectus reached Georgia, Java and China within a few hundred thousand years of leaving Africa, which was the first great human journey.",
      source: { label: "Encyclopaedia Britannica, \"Homo erectus\"" },
    },
    {
      question: "Which cereal, with a tall head of grain and a hard stem, was domesticated in the savannah of the Sahel?",
      options: ["Sorghum", "Wheat", "Barley", "Maize"],
      correct: 0,
      fact: "Sorghum was first farmed south of the Sahara, and it is now grown on every continent because it stands up to drought.",
      source: { label: "Encyclopaedia Britannica, \"sorghum\"" },
    },
    {
      question: "Where did farmers first domesticate African rice?",
      options: ["In the inland delta of the Niger", "In the Nile delta", "On the Swahili coast", "In the Atlas mountains"],
      correct: 0,
      fact: "African rice was farmed in the marshlands of the inland Niger delta, and it is a different species from the rice that came later from Asia.",
      source: {
        label: "UNESCO, General History of Africa, volume I",
        url: "https://www.unesco.org/en/general-history-africa",
      },
    },
    {
      question: "Which lake in Kenya gives its name to a World Heritage site listed for the fossils in its beds?",
      options: ["Lake Turkana", "Lake Victoria", "Lake Naivasha", "Lake Baringo"],
      correct: 0,
      fact: "The shores of Lake Turkana have yielded fossils of humans and of the animals they lived among, and the lake is the largest desert lake in the world.",
      source: { label: "Encyclopaedia Britannica, \"Lake Turkana\"" },
    },
  ],
  fr: {
    title: "Les origines de l'humanité",
    subtitle: "L'Afrique, berceau de l'humanité",
    region: "Toute l'Afrique",
    questions: [
      {
        question: "Dans quel pays a-t-on trouvé certains des plus anciens fossiles de notre espèce, Homo sapiens ?",
        options: ["Égypte", "Éthiopie", "Kenya", "Maroc"],
        fact: "Les restes d'Omo Kibish, en Éthiopie, ont environ 230 000 ans, ce qui en fait l'un des plus anciens fossiles connus de notre espèce.",
        source: "Encyclopaedia Britannica, notice « human evolution »",
      },
      {
        question: "Quel site du Maroc a livré des fossiles d'Homo sapiens âgés d'environ 300 000 ans ?",
        options: ["Jebel Irhoud", "Les gorges d'Olduvai", "La grotte de Blombos", "Sterkfontein"],
        fact: "Jebel Irhoud a repoussé l'origine de notre espèce à environ 300 000 ans et montré que les premiers Homo sapiens vivaient partout sur le continent, et pas dans un seul coin.",
        source: "Encyclopaedia Britannica, notice « human evolution »",
      },
      {
        question: "Quelle gorge de Tanzanie, explorée par Louis et Mary Leakey, est célèbre pour ses fossiles humains et ses outils de pierre ?",
        options: ["Les gorges d'Olduvai", "Le bassin du Kalahari", "Le delta du Nil", "Le lac Tchad"],
        fact: "Les gorges d'Olduvai ont donné leur nom à quelques-uns des plus anciens outils de pierre et fossiles humains jamais découverts.",
        source: "Encyclopaedia Britannica, notice « Olduvai Gorge »",
      },
      {
        question: "Comment s'appelle la plus ancienne tradition d'outils de pierre connue, identifiée pour la première fois aux gorges d'Olduvai ?",
        options: ["Oldowayen", "Acheuléen", "Néolithique", "Âge du fer"],
        fact: "Les outils oldowayens étaient de simples éclats détachés d'un galet il y a plus de 2,5 millions d'années, bien avant l'apparition de notre espèce.",
        source: "Encyclopaedia Britannica, notice « Olduvai Gorge »",
      },
      {
        question: "Qu'ont découvert les archéologues dans la grotte de Blombos, en Afrique du Sud, qui témoigne d'une pensée symbolique précoce ?",
        options: ["Une pyramide de pierre", "Un bloc d'ocre gravé d'un motif volontaire", "Un alphabet écrit", "Une statue de bronze"],
        fact: "L'ocre gravé de Blombos a environ 77 000 ans et compte parmi les plus anciens dessins abstraits connus au monde.",
        source: "Encyclopaedia Britannica, notice « human evolution »",
      },
      {
        question: "Que montrent surtout les peintures rupestres des San, comme celles de Tsodilo au Botswana ?",
        options: ["Des villes et des palais", "Des animaux, des chasseurs et des danseurs", "Des rois et des reines", "Des navires et des ports"],
        fact: "Tsodilo abrite plus de 4 500 peintures, et ce site est fréquenté par les humains depuis au moins 100 000 ans.",
        source: "Liste du patrimoine mondial de l'UNESCO, Tsodilo",
      },
      {
        question: "Laquelle de ces plantes a d'abord été domestiquée par des agriculteurs en Afrique ?",
        options: ["Le blé", "L'orge", "Le millet perlé", "Le maïs"],
        fact: "Le millet perlé, le sorgho, l'igname, le teff et le riz africain ont tous été domestiqués en Afrique, des milliers d'années avant l'arrivée du blé et du maïs.",
        source: "UNESCO, Histoire générale de l'Afrique, volume I",
      },
      {
        question: "Que maîtrisaient déjà les habitants de certaines régions d'Afrique il y a plus de 2 000 ans ?",
        options: ["La fonte du fer", "L'impression de livres", "La machine à vapeur", "La navigation à la boussole"],
        fact: "Des fourneaux à fer fonctionnaient dans la région des Grands Lacs vers 2000 avant notre ère et en Afrique de l'Ouest vers 500 avant notre ère, et le fer a transformé l'agriculture comme la guerre.",
        source: "UNESCO, Histoire générale de l'Afrique, volume I",
      },
      {
        question: "Quel premier humain, dont le nom signifie « homme habile », est associé aux premiers outils de pierre ?",
        options: ["Homo habilis", "Homo erectus", "Australopithecus afarensis", "Homo neanderthalensis"],
        fact: "Homo habilis a vécu en Afrique de l'Est entre environ 2,4 et 1,4 million d'années, et son nom lui a été donné pour les outils retrouvés près de ses ossements.",
        source: "Encyclopaedia Britannica, notice « Homo habilis »",
      },
      {
        question: "À qui appartient le squelette vieux de 3,2 millions d'années, découvert en Éthiopie en 1974 et surnommé Lucy ?",
        options: ["Australopithecus afarensis", "Homo sapiens", "Homo erectus", "Paranthropus"],
        fact: "Lucy appartient à Australopithecus afarensis, et ses os montrent une créature qui marchait debout bien avant l'apparition de notre espèce.",
        source: "Encyclopaedia Britannica, notice « Lucy »",
      },
      {
        question: "Dans quel pays a-t-on trouvé le squelette presque complet d'Homo erectus surnommé l'enfant de Turkana ?",
        options: ["Le Kenya", "L'Égypte", "Le Maroc", "L'Afrique du Sud"],
        fact: "L'enfant de Turkana a été découvert en 1984 à l'ouest du lac Turkana, au Kenya, et c'est le squelette humain ancien le plus complet jamais mis au jour.",
        source: "Encyclopaedia Britannica, notice « Homo erectus »",
      },
      {
        question: "Quelles grottes d'Afrique du Sud, dans le berceau de l'humanité, ont livré des centaines de fossiles humains anciens ?",
        options: ["Sterkfontein", "Blombos", "Tsodilo", "Olduvai"],
        fact: "Les grottes de Sterkfontein ont livré une grande part de tous les fossiles d'homininés connus, et le site est inscrit au patrimoine mondial.",
        source: "Liste du patrimoine mondial de l'UNESCO, Sites des hominidés fossiles d'Afrique du Sud",
      },
      {
        question: "Quel homininé vieux de 4,4 millions d'années, découvert en Éthiopie, est plus ancien que Lucy ?",
        options: ["Ardipithecus ramidus", "Australopithecus afarensis", "Homo habilis", "Homo erectus"],
        fact: "Ardipithecus ramidus, surnommé Ardi, a montré que nos ancêtres pouvaient marcher debout en forêt, et pas seulement dans la savane ouverte.",
        source: "Encyclopaedia Britannica, notice « Ardipithecus »",
      },
      {
        question: "Certaines des plus anciennes poteries du monde ont été façonnées il y a environ 11 000 ans à Ounjougou, dans quel pays actuel ?",
        options: ["Le Mali", "Le Kenya", "La Tunisie", "Le Zimbabwe"],
        fact: "Les potiers d'Ounjougou, dans le Mali actuel, fabriquaient déjà des vases décorés avant que l'agriculture n'atteigne la plus grande partie du monde.",
        source: "UNESCO, Histoire générale de l'Afrique, volume I",
      },
      {
        question: "Quelle boisson, aujourd'hui cultivée sous tous les tropiques, a été domestiquée pour la première fois dans les hauts plateaux éthiopiens ?",
        options: ["Le café", "Le thé", "Le cacao", "La canne à sucre"],
        fact: "Le caféier arabica pousse à l'état sauvage dans les hauts plateaux éthiopiens, et la boisson s'est d'abord répandue en Arabie avant de gagner le monde.",
        source: "Encyclopaedia Britannica, notice « coffee »",
      },
      {
        question: "Quelle tradition d'outils de pierre, nommée d'après un site français, a suivi l'Oldowayen et se reconnaît à ses grands bifaces ?",
        options: ["L'acheuléen", "L'oldowayen", "Le mésolithique", "Le néolithique"],
        fact: "Les bifaces acheuléens ont été façonnés en Afrique pendant plus d'un million d'années, et on les trouve de l'Afrique du Sud jusqu'en Europe et en Inde.",
        source: "Encyclopaedia Britannica, notice « Acheulean industry »",
      },
      {
        question: "Dans quel pays se trouvent les peintures rupestres du Tassili n'Ajjer, qui montrent un Sahara plein de bovins et de girafes ?",
        options: ["L'Algérie", "L'Égypte", "Le Kenya", "Le Maroc"],
        fact: "Les peintures du plateau du Tassili ont été faites quand le Sahara était une savane, et elles montrent troupeaux, chasseurs et animaux d'un monde plus humide.",
        source: "Encyclopaedia Britannica, notice « Tassili n'Ajjer »",
      },
      {
        question: "Quelle espèce humaine ancienne a quitté l'Afrique la première pour s'installer en Asie et en Europe ?",
        options: ["Homo erectus", "Homo habilis", "Australopithecus afarensis", "Homo neanderthalensis"],
        fact: "Homo erectus a atteint la Géorgie, Java et la Chine en quelques centaines de milliers d'années après avoir quitté l'Afrique, premier grand voyage humain.",
        source: "Encyclopaedia Britannica, notice « Homo erectus »",
      },
      {
        question: "Quelle céréale, à haute tige et à grain en épi, a été domestiquée dans la savane du Sahel ?",
        options: ["Le sorgho", "Le blé", "L'orge", "Le maïs"],
        fact: "Le sorgho a d'abord été cultivé au sud du Sahara, et il pousse aujourd'hui sur tous les continents parce qu'il résiste à la sécheresse.",
        source: "Encyclopaedia Britannica, notice « sorghum »",
      },
      {
        question: "Où les agriculteurs ont-ils domestiqué pour la première fois le riz africain ?",
        options: ["Dans le delta intérieur du Niger", "Dans le delta du Nil", "Sur la côte swahili", "Dans les monts de l'Atlas"],
        fact: "Le riz africain était cultivé dans les zones marécageuses du delta intérieur du Niger, et c'est une espèce différente du riz venu plus tard d'Asie.",
        source: "UNESCO, Histoire générale de l'Afrique, volume I",
      },
      {
        question: "Quel lac du Kenya donne son nom à un site du patrimoine mondial inscrit pour les fossiles de ses rives ?",
        options: ["Le lac Turkana", "Le lac Victoria", "Le lac Naivasha", "Le lac Baringo"],
        fact: "Les rives du lac Turkana ont livré des fossiles d'humains et des animaux qui les entouraient, et c'est le plus grand lac désertique du monde.",
        source: "Encyclopaedia Britannica, notice « Lake Turkana »",
      },
    ],
  },
};
