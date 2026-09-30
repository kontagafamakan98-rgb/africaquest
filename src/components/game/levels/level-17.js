/**
 * The Atlantic Slave Trade: one level of the game, on its own.
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
import { Globe } from "lucide-react";

export default {
  id: 17,
  order: 15,
  era: "earlyModern",
  from: 1500,
  title: "The Atlantic Slave Trade",
  subtitle: "Exile, resistance and abolition",
  region: "Atlantic Africa",
  color: "from-slate-500 to-slate-800",
  icon: Globe,
  gallery: {
    en: [
      {
        file: "/photos/level-17-1.jpg",
        caption: "The gate of Elmina Castle in Ghana, through which captive Africans were led down to the ships.",
        credit: "Kurt Dundy · CC BY-SA 3.0 · Wikimedia Commons",
        author: "Kurt Dundy",
        licence: "CC BY-SA 3.0",
        source: "https://commons.wikimedia.org/wiki/File:Ghana_Elmina_Castle_Slave_Export_Gate.JPG",
      },
      {
        file: "/photos/level-17-2.jpg",
        caption: "Cape Coast Castle, another of the forts built on the Gold Coast for the trade in human beings.",
        credit: "Matti Blume · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Matti Blume",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Castle%2C_Cape_Coast_(P1100221).jpg",
      },
      {
        file: "/photos/level-17-3.jpg",
        caption: "The island of Goree, off Dakar in Senegal, kept today as a place of remembrance.",
        credit: "Focale Emotions · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Focale Emotions",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Ile_de_Gor%C3%A9e_S%C3%A9n%C3%A9gal.jpg",
      },
    ],
    fr: [
      {
        file: "/photos/level-17-1.jpg",
        caption: "La porte du château d'Elmina, au Ghana, par laquelle les Africains captifs étaient conduits vers les navires.",
        credit: "Kurt Dundy · CC BY-SA 3.0 · Wikimedia Commons",
        author: "Kurt Dundy",
        licence: "CC BY-SA 3.0",
        source: "https://commons.wikimedia.org/wiki/File:Ghana_Elmina_Castle_Slave_Export_Gate.JPG",
      },
      {
        file: "/photos/level-17-2.jpg",
        caption: "Le château de Cape Coast, un autre des forts bâtis sur la Côte de l'Or pour le commerce des êtres humains.",
        credit: "Matti Blume · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Matti Blume",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Castle%2C_Cape_Coast_(P1100221).jpg",
      },
      {
        file: "/photos/level-17-3.jpg",
        caption: "L'île de Gorée, au large de Dakar au Sénégal, conservée aujourd'hui comme un lieu de mémoire.",
        credit: "Focale Emotions · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Focale Emotions",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Ile_de_Gor%C3%A9e_S%C3%A9n%C3%A9gal.jpg",
      },
    ],
  },
  study: {
    en: {
      essay: ["For more than three centuries, ships carried Africans across the Atlantic against their will. Roughly 12.5 million people were put on board, and about 10.7 million reached the Americas alive, which means that for every person who arrived, one did not survive the crossing.", "Behind the ships they left villages emptied of their young people, fields unworked and families divided, and ahead of them lay slavery on plantations and in mines. The trade fed on wars and on debts, and the rulers who sold captives were very often paying for the goods and the firearms the same trade had brought them.", "Yet the trade was resisted at every step, by kings who wrote to Lisbon, by uprisings at sea and on land, by writers such as Olaudah Equiano, and finally by the abolitionists who ended it. Captives seized ships, as on the Amistad in 1839, and communities of escaped people, the Maroons of Jamaica among them, held their own ground for generations.", "Brazil took more captives than any other country and was the last in the Americas to abolish slavery, in 1888. The profits of the trade built ports and banks in Europe, and its memory is a road of departure, a door of no return, and a debate about what is owed that is still going on."],
      timeline: [
        { year: "1444", text: "The first large cargo of captives is carried from Africa to Portugal." },
        { year: "1619", text: "The first recorded Africans are landed in Virginia." },
        { year: "1791", text: "The rising in Saint-Domingue begins the end of slavery in Haiti." },
        { year: "1807", text: "Britain forbids its own subjects to trade in captives." },
        { year: "1839", text: "Captives seize the Amistad and win their freedom in an American court." },
        { year: "1888", text: "Brazil becomes the last country in the Americas to abolish slavery." },
      ],
      people: [
        {
          name: "Olaudah Equiano",
          text: "The writer whose account of his own captivity helped the abolitionists.",
        },
        { name: "Nzinga Mbande", text: "The queen of Ndongo who fought the Portuguese for decades." },
        { name: "Toussaint Louverture", text: "The leader of the rising that made Haiti free." },
        {
          name: "William Wilberforce",
          text: "The British politician who carried the abolition of the trade through parliament.",
        },
      ],
      places: [
        { name: "Ouidah", text: "The port whose gate to the beach was called the door of no return." },
        {
          name: "Elmina",
          text: "The Portuguese castle on the Gold Coast, the first of the trading forts.",
        },
        {
          name: "Ile de Goree",
          text: "The small island off Dakar used as a holding place before the crossing.",
        },
        {
          name: "Salvador da Bahia",
          text: "The Brazilian port that received more captives than any other.",
        },
      ],
      glossary: [
        { term: "the Middle Passage", text: "The crossing of the Atlantic that carried the captives." },
        { term: "abolition", text: "The ending of the trade, and later of slavery itself." },
        { term: "asiento", text: "The Spanish licence to carry captives to the American colonies." },
        { term: "Maroon", text: "A community of people who escaped slavery and held their own ground." },
        {
          term: "triangular trade",
          text: "The route that carried goods to Africa, captives to the Americas and sugar home.",
        },
      ],
    },
    fr: {
      essay: ["Pendant plus de trois siècles, des navires ont transporté des Africains à travers l'Atlantique contre leur volonté. Environ 12,5 millions de personnes ont été embarquées, et environ 10,7 millions ont atteint les Amériques vivantes : pour chaque personne arrivée, une n'a pas survécu à la traversée.", "Derrière les navires, elles laissaient des villages vidés de leurs jeunes, des champs en friche et des familles séparées, et devant elles s'ouvrait l'esclavage des plantations et des mines. La traite se nourrissait des guerres et des dettes, et les souverains qui vendaient des captifs payaient le plus souvent les marchandises et les armes à feu que la même traite leur avait apportées.", "Pourtant la traite a été combattue à chaque étape, par des rois qui écrivaient à Lisbonne, par des révoltes en mer et sur terre, par des auteurs comme Olaudah Equiano, et enfin par les abolitionnistes qui l'ont fait cesser. Des captifs se sont emparés de navires, comme sur l'Amistad en 1839, et des communautés d'évadés, les Marrons de Jamaïque entre autres, ont tenu leur propre territoire pendant des générations.", "Le Brésil a reçu plus de captifs que tout autre pays et a été le dernier des Amériques à abolir l'esclavage, en 1888. Les profits de la traite ont bâti des ports et des banques en Europe, et son souvenir est une route de départ, une porte du Non-Retour et un débat sur ce qui reste dû, qui se poursuit encore."],
      timeline: [
        {
          year: "1444",
          text: "Le premier grand chargement de captifs est transporté d'Afrique au Portugal.",
        },
        { year: "1619", text: "Les premiers Africains attestés sont débarqués en Virginie." },
        {
          year: "1791",
          text: "L'insurrection de Saint-Domingue commence la fin de l'esclavage à Haïti.",
        },
        { year: "1807", text: "La Grande-Bretagne interdit à ses sujets le commerce des captifs." },
        {
          year: "1839",
          text: "Des captifs s'emparent de l'Amistad et gagnent leur liberté devant un tribunal américain.",
        },
        { year: "1888", text: "Le Brésil devient le dernier pays des Amériques à abolir l'esclavage." },
      ],
      people: [
        {
          name: "Olaudah Equiano",
          text: "L'écrivain dont le récit de sa propre captivité a aidé les abolitionnistes.",
        },
        {
          name: "Nzinga Mbande",
          text: "La reine du Ndongo qui a combattu les Portugais pendant des décennies.",
        },
        { name: "Toussaint Louverture", text: "Le chef de l'insurrection qui a rendu Haïti libre." },
        {
          name: "William Wilberforce",
          text: "L'homme politique britannique qui a fait voter l'abolition de la traite.",
        },
      ],
      places: [
        {
          name: "Ouidah",
          text: "Le port dont la porte vers la plage a été appelée la porte du Non-Retour.",
        },
        { name: "Elmina", text: "Le fort portugais de la Côte de l'Or, le premier des comptoirs." },
        {
          name: "L'île de Gorée",
          text: "La petite île au large de Dakar, utilisée comme lieu de rétention avant la traversée.",
        },
        { name: "Salvador de Bahia", text: "Le port brésilien qui a reçu le plus de captifs." },
      ],
      glossary: [
        {
          term: "la traversée du milieu",
          text: "La traversée de l'Atlantique qui portait les captifs.",
        },
        { term: "abolition", text: "La fin de la traite, puis de l'esclavage lui-même." },
        {
          term: "asiento",
          text: "La licence espagnole autorisant le transport de captifs vers les colonies américaines.",
        },
        {
          term: "marron",
          text: "Une communauté de personnes échappées de l'esclavage, qui tenait son propre territoire.",
        },
        {
          term: "commerce triangulaire",
          text: "La route qui portait les marchandises en Afrique, les captifs aux Amériques et le sucre en Europe.",
        },
      ],
    },
  },
  questions: [
    {
      question: "According to the Slave Voyages database, how many Africans were forced onto ships across the Atlantic?",
      options: ["About 1.2 million", "About 12.5 million", "About 125 million", "About 500,000"],
      correct: 1,
      fact: "The database counts more than 36,000 voyages between 1514 and 1866, and roughly 12.5 million people were put on board.",
      source: {
        label: "Slave Voyages, the Trans-Atlantic Slave Trade Database",
        url: "https://www.slavevoyages.org/",
      },
    },
    {
      question: "How many of those forced onto the ships reached the Americas alive?",
      options: ["About 10.7 million", "About 2 million", "About 12.5 million", "About 50 million"],
      correct: 0,
      fact: "Roughly one person in six died during the crossing, a loss rate the database documents voyage by voyage.",
      source: {
        label: "Slave Voyages, the Trans-Atlantic Slave Trade Database",
        url: "https://www.slavevoyages.org/",
      },
    },
    {
      question: "Which small island off Senegal, long used as a trading post, is today a place of memory of the trade?",
      options: ["Goree", "Zanzibar", "Robben Island", "Kilwa"],
      correct: 0,
      fact: "Goree was one of many departure points, and it is preserved today so that the scale of the trade is not forgotten.",
      source: {
        label: "UNESCO World Heritage List, Island of Gorée",
        url: "https://whc.unesco.org/en/list/26/",
      },
    },
    {
      question: "Which country made the slave trade illegal for its ships and subjects in 1807?",
      options: ["Britain", "Portugal", "Spain", "Brazil"],
      correct: 0,
      fact: "The Abolition of the Slave Trade Act was followed by naval patrols, though slavery itself was only abolished in the British colonies in 1833.",
      source: { label: "Encyclopaedia Britannica, \"Slavery Abolition Act\"" },
    },
    {
      question: "Which formerly enslaved African wrote an autobiography published in London in 1789?",
      options: ["Olaudah Equiano", "Toussaint Louverture", "Frederick Douglass", "Phillis Wheatley"],
      correct: 0,
      fact: "Equiano bought his freedom, campaigned with the abolitionists, and his book helped turn British opinion against the trade.",
      source: { label: "Encyclopaedia Britannica, \"Olaudah Equiano\"" },
    },
    {
      question: "Which Caribbean country was born from an uprising of enslaved people and declared independence in 1804?",
      options: ["Haiti", "Jamaica", "Cuba", "Barbados"],
      correct: 0,
      fact: "The revolution led by Toussaint Louverture and then Jean-Jacques Dessalines created the first Black republic, and it frightened slave owners across the Atlantic world.",
      source: { label: "Encyclopaedia Britannica, \"Haiti\"" },
    },
    {
      question: "Which country in the Americas was the last to abolish slavery, in 1888?",
      options: ["Brazil", "Cuba", "The United States", "Britain"],
      correct: 0,
      fact: "The Golden Law of 1888 freed the last enslaved people in the Americas, almost four centuries after the first slave ships crossed the ocean.",
      source: {
        label: "UNESCO, General History of Africa, volume V",
        url: "https://www.unesco.org/en/general-history-africa",
      },
    },
    {
      question: "Which town, settled in 1792 for freed slaves on the coast of Sierra Leone, became a centre of African education?",
      options: ["Freetown", "Monrovia", "Accra", "Lagos"],
      correct: 0,
      fact: "Freetown was founded by Black Loyalists from Nova Scotia, joined later by Maroons and by Africans freed from slave ships.",
      source: {
        label: "UNESCO, General History of Africa, volume V",
        url: "https://www.unesco.org/en/general-history-africa",
      },
    },
    {
      question: "Which castle on the coast of today's Ghana was the seat of the British slave trade there?",
      options: ["Cape Coast Castle", "Goree", "Kilwa", "Lamu"],
      correct: 0,
      fact: "Cape Coast Castle held enslaved people in its dungeons before they were carried across the Atlantic, and it is a UNESCO World Heritage site.",
      source: {
        label: "UNESCO World Heritage List, Forts and Castles, Volta, Greater Accra, Central and Western Regions",
        url: "https://whc.unesco.org/en/list/34/",
      },
    },
    {
      question: "Which revolt of enslaved Africans aboard a ship in 1839 became a famous court case in the United States?",
      options: ["The Amistad revolt", "The Zong massacre", "The Nat Turner rebellion", "The Haitian revolution"],
      correct: 0,
      fact: "Led by Joseph Cinque, the captives of the Amistad seized the ship, and a court ruled they had been illegally enslaved and set them free.",
      source: { label: "Encyclopaedia Britannica, \"Amistad\"" },
    },
    {
      question: "Which kingdom, ruled from Abomey in today's Benin, grew rich through the sale of captives?",
      options: ["Dahomey", "Kanem-Bornu", "Kuba", "Kilwa"],
      correct: 0,
      fact: "Dahomey conquered its neighbours, and the kings used the goods they received for prisoners to arm their army and to pay their officials.",
      source: { label: "Encyclopaedia Britannica, \"Dahomey\"" },
    },
    {
      question: "Which town in today's Benin was one of the great ports of the trade, remembered today by its Door of No Return?",
      options: ["Ouidah", "Cape Coast", "Goree", "Freetown"],
      correct: 0,
      fact: "Captives were walked to Ouidah and held there before they were carried out to the ships, and the town keeps the memory of that road.",
      source: { label: "Encyclopaedia Britannica, \"Ouidah\"" },
    },
    {
      question: "What was the name of the three-legged route that carried ships from Europe to Africa, then to the Americas, then home?",
      options: ["The triangular trade", "The monsoon route", "The Silk Road", "The Grand Trunk Road"],
      correct: 0,
      fact: "Manufactured goods went to Africa, captives were carried across to the Americas, and sugar, tobacco and cotton came back to Europe.",
      source: { label: "Encyclopaedia Britannica, \"triangular trade\"" },
    },
    {
      question: "Which island was home to the Maroons, communities of escaped enslaved people who fought the British for decades?",
      options: ["Jamaica", "Barbados", "Cuba", "Haiti"],
      correct: 0,
      fact: "The Maroons of Jamaica held their own territory in the mountains and signed treaties with the British in 1739, keeping their freedom.",
      source: { label: "Encyclopaedia Britannica, \"Maroons\"" },
    },
    {
      question: "Which country in the Americas received more enslaved Africans than any other?",
      options: ["Brazil", "The United States", "Cuba", "Mexico"],
      correct: 0,
      fact: "Brazil took nearly half of all the captives carried across the Atlantic, and its sugar and coffee plantations worked them in terrible conditions.",
      source: { label: "Encyclopaedia Britannica, \"Atlantic slave trade\"" },
    },
    {
      question: "Which older trade carried enslaved people north across the Sahara before the Atlantic trade began?",
      options: ["The trans-Saharan slave trade", "The Silk Road", "The monsoon trade", "The Baltic trade"],
      correct: 0,
      fact: "Caravans took captives north to the Mediterranean for centuries before any European ship reached the Atlantic coast.",
      source: { label: "Encyclopaedia Britannica, \"slavery\"" },
    },
    {
      question: "Which port of Angola, founded by the Portuguese in 1576, was the main point of departure for Brazil?",
      options: ["Luanda", "Benguela", "Sofala", "Ouidah"],
      correct: 0,
      fact: "Luanda was built as a fort and a harbour, and for two centuries most of the captives taken to Brazil left from its bay.",
      source: { label: "Encyclopaedia Britannica, \"Luanda\"" },
    },
    {
      question: "Which region of today's Nigeria, with its ports of Bonny and Calabar, sent many captives overseas?",
      options: ["The Niger delta", "The Sahel", "The Swahili coast", "The Great Lakes"],
      correct: 0,
      fact: "The creeks of the delta hid the ships, and the states along them traded palm oil as well as people when the trade changed.",
      source: {
        label: "UNESCO, General History of Africa, volume V",
        url: "https://www.unesco.org/en/general-history-africa",
      },
    },
    {
      question: "Which crop from the Americas, carried on the same ships, became a staple food in Africa?",
      options: ["Cassava", "Yams", "Millet", "Sorghum"],
      correct: 0,
      fact: "Cassava came from Brazil and grew well in poor soil, and it fed the villages that the trade had emptied.",
      source: {
        label: "UNESCO, General History of Africa, volume V",
        url: "https://www.unesco.org/en/general-history-africa",
      },
    },
    {
      question: "Which congress of 1815 declared the slave trade a violation of humanity?",
      options: ["The Congress of Vienna", "The Berlin Conference", "The Congress of Utrecht", "The League of Nations"],
      correct: 0,
      fact: "The powers at Vienna condemned the trade in principle, and Britain then spent fifty years persuading the rest of the world to enforce the ban.",
      source: { label: "Encyclopaedia Britannica, \"Congress of Vienna\"" },
    },
    {
      question: "Which country of West Africa was founded in 1822 for freed people from the United States?",
      options: ["Liberia", "Sierra Leone", "Ghana", "Senegal"],
      correct: 0,
      fact: "Freed African Americans settled on the coast under the American Colonization Society, and the republic of Liberia was proclaimed in 1847.",
      source: { label: "Encyclopaedia Britannica, \"Liberia\"" },
    },
  ],
  fr: {
    title: "La traite atlantique",
    subtitle: "Exil, résistance et abolition",
    region: "Afrique atlantique",
    questions: [
      {
        question: "Selon la base Slave Voyages, combien d'Africains ont été embarqués de force sur l'Atlantique ?",
        options: ["Environ 1,2 million", "Environ 12,5 millions", "Environ 125 millions", "Environ 500 000"],
        fact: "La base recense plus de 36 000 voyages entre 1514 et 1866, et environ 12,5 millions de personnes ont été embarquées.",
        source: "Slave Voyages, base de données de la traite transatlantique",
      },
      {
        question: "Combien de ces personnes embarquées de force ont atteint les Amériques vivantes ?",
        options: ["Environ 10,7 millions", "Environ 2 millions", "Environ 12,5 millions", "Environ 50 millions"],
        fact: "Près d'une personne sur six est morte pendant la traversée, un taux de perte que la base documente voyage par voyage.",
        source: "Slave Voyages, base de données de la traite transatlantique",
      },
      {
        question: "Quelle petite île au large du Sénégal, longtemps utilisée comme comptoir, est aujourd'hui un lieu de mémoire de la traite ?",
        options: ["Gorée", "Zanzibar", "Robben Island", "Kilwa"],
        fact: "Gorée était l'un des nombreux points de départ, et elle est aujourd'hui préservée pour que l'ampleur de la traite ne soit pas oubliée.",
        source: "Liste du patrimoine mondial de l'UNESCO, Île de Gorée",
      },
      {
        question: "Quel pays a rendu la traite illégale pour ses navires et ses sujets en 1807 ?",
        options: ["La Grande-Bretagne", "Le Portugal", "L'Espagne", "Le Brésil"],
        fact: "La loi sur l'abolition de la traite a été suivie de patrouilles navales, mais l'esclavage lui-même n'a été aboli dans les colonies britanniques qu'en 1833.",
        source: "Encyclopaedia Britannica, notice « Slavery Abolition Act »",
      },
      {
        question: "Quel Africain anciennement réduit en esclavage a publié son autobiographie à Londres en 1789 ?",
        options: ["Olaudah Equiano", "Toussaint Louverture", "Frederick Douglass", "Phillis Wheatley"],
        fact: "Equiano a racheté sa liberté, milité avec les abolitionnistes, et son livre a contribué à retourner l'opinion britannique contre la traite.",
        source: "Encyclopaedia Britannica, notice « Olaudah Equiano »",
      },
      {
        question: "Quel pays des Caraïbes est né d'un soulèvement de personnes réduites en esclavage et a déclaré son indépendance en 1804 ?",
        options: ["Haïti", "La Jamaïque", "Cuba", "La Barbade"],
        fact: "La révolution menée par Toussaint Louverture puis Jean-Jacques Dessalines a créé la première république noire et a effrayé les propriétaires d'esclaves de tout l'Atlantique.",
        source: "Encyclopaedia Britannica, notice « Haiti »",
      },
      {
        question: "Quel pays des Amériques a aboli l'esclavage en dernier, en 1888 ?",
        options: ["Le Brésil", "Cuba", "Les États-Unis", "La Grande-Bretagne"],
        fact: "La loi d'or de 1888 a libéré les derniers esclaves des Amériques, presque quatre siècles après l'arrivée des premiers navires négriers.",
        source: "UNESCO, Histoire générale de l'Afrique, volume V",
      },
      {
        question: "Quelle ville, peuplée en 1792 par des affranchis sur la côte de la Sierra Leone, est devenue un centre africain d'éducation ?",
        options: ["Freetown", "Monrovia", "Accra", "Lagos"],
        fact: "Freetown a été fondée par des loyalistes noirs venus de Nouvelle-Écosse, rejoints plus tard par des Marrons et par des Africains libérés des navires négriers.",
        source: "UNESCO, Histoire générale de l'Afrique, volume V",
      },
      {
        question: "Quel château, sur la côte du Ghana actuel, était le siège de la traite britannique dans la région ?",
        options: ["Le château de Cape Coast", "Gorée", "Kilwa", "Lamu"],
        fact: "Le château de Cape Coast retenait les captifs dans ses cachots avant la traversée de l'Atlantique, et il est inscrit au patrimoine mondial.",
        source: "Liste du patrimoine mondial de l'UNESCO, Forts et châteaux de Volta, d'Accra et des régions centrale et occidentale",
      },
      {
        question: "Quelle révolte d'Africains réduits en esclavage à bord d'un navire, en 1839, a donné lieu à un célèbre procès aux États-Unis ?",
        options: ["La révolte de l'Amistad", "Le massacre du Zong", "La rébellion de Nat Turner", "La révolution haïtienne"],
        fact: "Menés par Joseph Cinque, les captifs de l'Amistad se sont emparés du navire, et un tribunal a jugé qu'ils avaient été illégalement réduits en esclavage et les a libérés.",
        source: "Encyclopaedia Britannica, notice « Amistad »",
      },
      {
        question: "Quel royaume, gouverné depuis Abomey dans le Bénin actuel, s'est enrichi par la vente de captifs ?",
        options: ["Le Dahomey", "Le Kanem-Bornou", "Le Kouba", "Kilwa"],
        fact: "Le Dahomey conquérait ses voisins, et les rois utilisaient les marchandises reçues pour les prisonniers afin d'armer leur armée et de payer leurs fonctionnaires.",
        source: "Encyclopaedia Britannica, notice « Dahomey »",
      },
      {
        question: "Quelle ville du Bénin actuel était l'un des grands ports de ce commerce, dont la porte du Non-Retour garde la mémoire ?",
        options: ["Ouidah", "Cape Coast", "Gorée", "Freetown"],
        fact: "Les captifs étaient conduits à pied jusqu'à Ouidah et y étaient retenus avant d'être emmenés vers les navires, et la ville conserve le souvenir de cette route.",
        source: "Encyclopaedia Britannica, notice « Ouidah »",
      },
      {
        question: "Comment appelait-on la route en trois étapes qui menait les navires d'Europe en Afrique, puis en Amérique, puis chez eux ?",
        options: ["Le commerce triangulaire", "La route de la mousson", "La route de la soie", "La route du Gange"],
        fact: "Les produits manufacturés allaient en Afrique, les captifs traversaient vers les Amériques, et le sucre, le tabac et le coton revenaient en Europe.",
        source: "Encyclopaedia Britannica, notice « triangular trade »",
      },
      {
        question: "Quelle île abritait les Marrons, ces communautés d'esclaves évadés qui ont combattu les Britanniques pendant des décennies ?",
        options: ["La Jamaïque", "La Barbade", "Cuba", "Haïti"],
        fact: "Les Marrons de Jamaïque tenaient leur propre territoire dans les montagnes et ont signé des traités avec les Britanniques en 1739, gardant leur liberté.",
        source: "Encyclopaedia Britannica, notice « Maroons »",
      },
      {
        question: "Quel pays des Amériques a reçu plus d'Africains réduits en esclavage que tout autre ?",
        options: ["Le Brésil", "Les États-Unis", "Cuba", "Le Mexique"],
        fact: "Le Brésil a reçu près de la moitié de tous les captifs transportés à travers l'Atlantique, et ses plantations de sucre et de café les faisaient travailler dans des conditions terribles.",
        source: "Encyclopaedia Britannica, notice « Atlantic slave trade »",
      },
      {
        question: "Quel commerce plus ancien transportait des captifs vers le nord du Sahara avant la traite atlantique ?",
        options: ["La traite transsaharienne", "La route de la soie", "Le commerce de la mousson", "Le commerce de la Baltique"],
        fact: "Les caravanes emmenaient des captifs vers la Méditerranée pendant des siècles avant qu'un navire européen n'atteigne la côte atlantique.",
        source: "Encyclopaedia Britannica, notice « slavery »",
      },
      {
        question: "Quel port d'Angola, fondé par les Portugais en 1576, était le principal point de départ vers le Brésil ?",
        options: ["Luanda", "Benguela", "Sofala", "Ouidah"],
        fact: "Luanda a été bâtie comme fort et comme port, et pendant deux siècles la plupart des captifs emmenés au Brésil partaient de sa baie.",
        source: "Encyclopaedia Britannica, notice « Luanda »",
      },
      {
        question: "Quelle région du Nigeria actuel, avec ses ports de Bonny et de Calabar, a envoyé de nombreux captifs outre-mer ?",
        options: ["Le delta du Niger", "Le Sahel", "La côte swahili", "La région des Grands Lacs"],
        fact: "Les creeks du delta cachaient les navires, et les États de la région ont commerçé l'huile de palme quand la traite a changé de forme.",
        source: "UNESCO, Histoire générale de l'Afrique, volume V",
      },
      {
        question: "Quelle plante venue des Amériques, transportée par les mêmes navires, est devenue un aliment de base en Afrique ?",
        options: ["Le manioc", "Les ignames", "Le mil", "Le sorgho"],
        fact: "Le manioc venait du Brésil et poussait bien dans les sols pauvres, et il a nourri les villages que la traite avait vidés.",
        source: "UNESCO, Histoire générale de l'Afrique, volume V",
      },
      {
        question: "Quel congrès de 1815 a déclaré la traite une violation de l'humanité ?",
        options: ["Le congrès de Vienne", "La conférence de Berlin", "Le congrès d'Utrecht", "La Société des Nations"],
        fact: "Les puissances réunies à Vienne ont condamné la traite en principe, et l'Angleterre a ensuite passé cinquante ans à convaincre le reste du monde de l'appliquer.",
        source: "Encyclopaedia Britannica, notice « Congress of Vienna »",
      },
      {
        question: "Quel pays d'Afrique de l'Ouest a été fondé en 1822 pour des affranchis venus des États-Unis ?",
        options: ["Le Liberia", "La Sierra Leone", "Le Ghana", "Le Sénégal"],
        fact: "Des Afro-Américains affranchis se sont installés sur la côte sous l'égide de l'American Colonization Society, et la république du Liberia a été proclamée en 1847.",
        source: "Encyclopaedia Britannica, notice « Liberia »",
      },
    ],
  },
};
