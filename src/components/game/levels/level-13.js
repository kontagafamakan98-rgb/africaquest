/**
 * The Ghana Empire: one level of the game, on its own.
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
import { Gem } from "lucide-react";

export default {
  id: 13,
  order: 7,
  era: "medieval",
  from: 700,
  title: "The Ghana Empire",
  subtitle: "Wagadu, land of gold",
  region: "West Africa",
  color: "from-yellow-400 to-amber-600",
  icon: Gem,
  gallery: {
    en: [
      {
        file: "/photos/level-13-1.jpg",
        caption: "Blocks of salt for sale at Mopti, in Mali, the same load the caravans of the Sahara carried south.",
        credit: "Robin Taylor · CC BY 2.0 · Wikimedia Commons",
        author: "Robin Taylor",
        licence: "CC BY 2.0",
        source: "https://commons.wikimedia.org/wiki/File:Salt_selling_Mopti_Mali.jpg",
      },
      {
        file: "/photos/level-13-2.jpg",
        caption: "A grinding stone on a site of Dhar Tichitt, where farmers settled long before the empire of Ghana.",
        credit: "Sylvie Amblard-Pison · CC BY 4.0 · Wikimedia Commons",
        author: "Sylvie Amblard-Pison",
        licence: "CC BY 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Meule_sur_un_site_du_Baten_de_Tichitt.jpg",
      },
      {
        file: "/photos/level-13-3.jpg",
        caption: "The burial ground of Koumbi Saleh, capital of the empire of Ghana, seen from a satellite.",
        credit: "Chloé Capel · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Chloé Capel",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Satellite_view_of_part_of_the_western_necropolis_of_Koumbi_Saleh_showing_the_density_of_funerary_structures.jpg",
      },
    ],
    fr: [
      {
        file: "/photos/level-13-1.jpg",
        caption: "Des blocs de sel en vente à Mopti, au Mali, la même charge que les caravanes du Sahara descendaient vers le sud.",
        credit: "Robin Taylor · CC BY 2.0 · Wikimedia Commons",
        author: "Robin Taylor",
        licence: "CC BY 2.0",
        source: "https://commons.wikimedia.org/wiki/File:Salt_selling_Mopti_Mali.jpg",
      },
      {
        file: "/photos/level-13-2.jpg",
        caption: "Une meule sur un site du Dhar Tichitt, où des agriculteurs s'installèrent bien avant l'empire du Ghana.",
        credit: "Sylvie Amblard-Pison · CC BY 4.0 · Wikimedia Commons",
        author: "Sylvie Amblard-Pison",
        licence: "CC BY 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Meule_sur_un_site_du_Baten_de_Tichitt.jpg",
      },
      {
        file: "/photos/level-13-3.jpg",
        caption: "Le cimetière de Koumbi Saleh, capitale de l'empire du Ghana, vu depuis un satellite.",
        credit: "Chloé Capel · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Chloé Capel",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Satellite_view_of_part_of_the_western_necropolis_of_Koumbi_Saleh_showing_the_density_of_funerary_structures.jpg",
      },
    ],
  },
  study: {
    en: {
      essay: ["In the western Sahel, a kingdom grew rich on two things everybody needed: gold and salt. The salt came from the mines of the deep Sahara, cut into slabs and carried south on camels, and the gold came from the forests of the south, and neither place had the other, which is what made the middle so valuable.", "Caravans carried Saharan salt south and forest gold north, and Ghana taxed every load that passed. Its capital, Koumbi Saleh, had a royal town and a merchant town, and the Arab geographers who described it wrote of a court with horses, gold and a king who was approached to the sound of drums.", "The king himself was called Ghana, and his title gave the empire its name. He kept the gold nuggets for himself and let the merchants deal in dust, so that the price never fell, and the trade up from the forests was carried on in silence, with no word exchanged between the parties.", "The Soninke farmers of Wagadu grew millet and sorghum on the edge of the desert and paid for the empire's horses and its army. When the Almoravids sacked the capital in 1076, the empire began to fade, its provinces broke away, and Mali rose in its place on the same gold routes."],
      timeline: [
        { year: "c. 300 AD", text: "The Soninke kingdom of Wagadu forms on the edge of the Sahara." },
        {
          year: "c. 800",
          text: "Koumbi Saleh is a twin town, with a royal quarter and a merchant quarter.",
        },
        { year: "c. 1050", text: "al-Bakri describes the court and the gold trade of Ghana." },
        { year: "1076", text: "The Almoravids take the capital and the empire begins to break up." },
        { year: "c. 1235", text: "Mali takes the gold routes north of the Niger and Ghana fades." },
      ],
      people: [
        { name: "The Ghana king", text: "The ruler whose title gave the empire its name." },
        { name: "al-Bakri", text: "The Andalusian geographer whose book describes the court of Ghana." },
        { name: "The Soninke", text: "The farmers and traders of Wagadu, the people of the empire." },
        { name: "The Almoravids", text: "The Berber movement whose armies took Koumbi Saleh in 1076." },
      ],
      places: [
        { name: "Koumbi Saleh", text: "The capital, with a royal town and a merchant town." },
        { name: "Wagadu", text: "The Soninke name for the empire and its heartland." },
        { name: "Aoudaghost", text: "The desert town that linked Ghana to the salt mines." },
        {
          name: "The Sahara",
          text: "The desert whose caravans carried the salt that made the empire rich.",
        },
      ],
      glossary: [
        {
          term: "Sahel",
          text: "The dry belt south of the Sahara, where the grassland and the desert meet.",
        },
        {
          term: "gold dust",
          text: "The form of gold the merchants handled, the nuggets being the king's own.",
        },
        {
          term: "silent trade",
          text: "The exchange of goods without speech, reported along the western routes.",
        },
        { term: "Almoravid", text: "The Berber reform movement that took the capital in 1076." },
        { term: "Soninke", text: "The language and the people of Wagadu." },
      ],
    },
    fr: {
      essay: ["Dans le Sahel occidental, un royaume s'est enrichi grâce à deux produits dont tout le monde avait besoin : l'or et le sel. Le sel venait des mines du Sahara profond, découpé en plaques et descendu vers le sud à dos de chameau, et l'or venait des forêts du sud, et ni l'un ni l'autre lieu n'avait ce que l'autre possédait : c'est ce qui rendait le milieu si précieux.", "Les caravanes descendaient le sel du Sahara vers le sud et remontaient l'or des forêts vers le nord, et le Ghana taxait chaque charge qui passait. Sa capitale, Koumbi Saleh, comptait une ville royale et une ville marchande, et les géographes arabes qui l'ont décrite parlent d'une cour avec des chevaux, de l'or et un roi qu'on approchait au son des tambours.", "Le roi lui-même portait le titre de Ghana, qui a donné son nom à l'empire. Il gardait les pépites pour lui et laissait aux marchands la poudre d'or, pour que le prix ne baisse jamais, et le commerce venu des forêts se faisait sans qu'un mot soit échangé entre les parties.", "Les paysans soninké du Wagadou cultivaient le mil et le sorgho à la lisière du désert et payaient les chevaux et l'armée de l'empire. Quand les Almoravides ont pillé la capitale en 1076, l'empire a commencé à s'effacer, ses provinces se sont détachées, et le Mali a pris sa place sur les mêmes routes de l'or."],
      timeline: [
        {
          year: "v. 300 apr. J.-C.",
          text: "Le royaume soninké du Wagadou se forme à la lisière du Sahara.",
        },
        {
          year: "v. 800",
          text: "Koumbi Saleh est une ville double, avec un quartier royal et un quartier marchand.",
        },
        { year: "v. 1050", text: "al-Bakri décrit la cour et le commerce de l'or du Ghana." },
        {
          year: "1076",
          text: "Les Almoravides prennent la capitale et l'empire commence à se disloquer.",
        },
        {
          year: "v. 1235",
          text: "Le Mali prend les routes de l'or au nord du Niger et le Ghana s'efface.",
        },
      ],
      people: [
        { name: "Le roi du Ghana", text: "Le souverain dont le titre a donné son nom à l'empire." },
        { name: "al-Bakri", text: "Le géographe andalou dont le livre décrit la cour du Ghana." },
        { name: "Les Soninké", text: "Les paysans et marchands du Wagadou, le peuple de l'empire." },
        {
          name: "Les Almoravides",
          text: "Le mouvement berbère dont les armées ont pris Koumbi Saleh en 1076.",
        },
      ],
      places: [
        { name: "Koumbi Saleh", text: "La capitale, avec une ville royale et une ville marchande." },
        { name: "Le Wagadou", text: "Le nom soninké de l'empire et de son coeur." },
        { name: "Aoudaghost", text: "La ville du désert qui reliait le Ghana aux mines de sel." },
        {
          name: "Le Sahara",
          text: "Le désert dont les caravanes portaient le sel qui fit la richesse de l'empire.",
        },
      ],
      glossary: [
        {
          term: "Sahel",
          text: "La bande sèche au sud du Sahara, où se rencontrent la savane et le désert.",
        },
        {
          term: "poudre d'or",
          text: "La forme de l'or que les marchands maniaient, les pépites étant au roi.",
        },
        {
          term: "commerce muet",
          text: "L'échange de marchandises sans parole, rapporté le long des routes de l'ouest.",
        },
        { term: "almoravide", text: "Le mouvement réformateur berbère qui a pris la capitale en 1076." },
        { term: "soninké", text: "La langue et le peuple du Wagadou." },
      ],
    },
  },
  questions: [
    {
      question: "What did the people of the empire call their own land?",
      options: ["Wagadu", "Mali", "Songhay", "Bornu"],
      correct: 0,
      fact: "Ghana was the title of the king, and Arab writers used it to name the whole kingdom, while its own people said Wagadu.",
      source: { label: "Encyclopaedia Britannica, \"Ghana, historical empire\"" },
    },
    {
      question: "What was the capital city of the Ghana Empire?",
      options: ["Koumbi Saleh", "Timbuktu", "Gao", "Djenne"],
      correct: 0,
      fact: "Koumbi Saleh stood in today's southern Mauritania, and archaeologists have found both a royal town and a merchant town there.",
      source: {
        label: "UNESCO, General History of Africa, volume III",
        url: "https://www.unesco.org/en/general-history-africa",
      },
    },
    {
      question: "Which two goods made the Ghana Empire rich?",
      options: ["Gold and salt", "Cotton and tea", "Ivory and glass", "Copper and silk"],
      correct: 0,
      fact: "Gold came from the forests to the south and salt from the Sahara to the north, and Ghana taxed every load that crossed its land.",
      source: { label: "Encyclopaedia Britannica, \"Ghana, historical empire\"" },
    },
    {
      question: "In which part of the empire was the salt mined?",
      options: ["In the Sahara to the north", "On the coast to the south", "In the rainforest", "Along the Niger river"],
      correct: 0,
      fact: "The salt mines of Taghaza were so valuable that salt was sometimes traded weight for weight against gold.",
      source: {
        label: "UNESCO, General History of Africa, volume III",
        url: "https://www.unesco.org/en/general-history-africa",
      },
    },
    {
      question: "The title Ghana belonged to whom?",
      options: ["The king", "The capital", "The gold", "The army"],
      correct: 0,
      fact: "Arab geographers explained that Ghana meant the ruler, the man who guarded the trade routes and collected the taxes.",
      source: { label: "Encyclopaedia Britannica, \"Ghana, historical empire\"" },
    },
    {
      question: "Which Arab writer described the court, the gold and the taxes of Ghana in the 11th century?",
      options: ["Al-Bakri", "Ibn Battuta", "Al-Idrisi", "Leo Africanus"],
      correct: 0,
      fact: "Al-Bakri wrote in Cordoba from the reports of travellers, and his account remains the best description of medieval Ghana.",
      source: { label: "Encyclopaedia Britannica, \"al-Bakri\"" },
    },
    {
      question: "Which movement from the Sahara attacked and sacked Koumbi Saleh in 1076?",
      options: ["The Almoravids", "The Ottomans", "The Portuguese", "The Zulu"],
      correct: 0,
      fact: "The Almoravids came out of the desert preaching a strict reading of Islam, and the empire never fully recovered from the attack.",
      source: { label: "Encyclopaedia Britannica, \"Almoravids\"" },
    },
    {
      question: "Which empire took over the remains of Ghana in the 13th century?",
      options: ["Mali", "Songhay", "Kanem", "Benin"],
      correct: 0,
      fact: "After the short lived kingdom of Sosso, the Mali of Sundiata Keita took control of the gold and salt routes and built an empire of its own.",
      source: {
        label: "UNESCO, General History of Africa, volume III",
        url: "https://www.unesco.org/en/general-history-africa",
      },
    },
    {
      question: "In which centuries did the Ghana Empire reach the height of its power?",
      options: ["The 9th to 11th centuries", "The 15th century", "The 3rd century BC", "The 18th century"],
      correct: 0,
      fact: "Arab writers of the 9th to 11th centuries describe a rich kingdom whose king taxed every load of gold and salt that crossed it.",
      source: { label: "Encyclopaedia Britannica, \"Ghana, historical empire\"" },
    },
    {
      question: "What did the king of Ghana tax as goods crossed the empire?",
      options: ["Every load of gold and salt", "Only boats on the Niger", "Only foreign houses", "Nothing at all"],
      correct: 0,
      fact: "Gold came north from the forests and salt came south from the Sahara, and each load paid a duty at the frontier and again at the capital.",
      source: {
        label: "UNESCO, General History of Africa, volume III",
        url: "https://www.unesco.org/en/general-history-africa",
      },
    },
    {
      question: "Which people founded the empire they called Wagadu?",
      options: ["The Soninke", "The Hausa", "The Tuareg", "The Kanuri"],
      correct: 0,
      fact: "The Soninke were farmers and traders of the Sahel, and their language carried the name Wagadu for centuries after the empire fell.",
      source: { label: "Encyclopaedia Britannica, \"Soninke\"" },
    },
    {
      question: "Which animal made the desert crossing between the salt mines and the goldfields possible?",
      options: ["The camel", "The horse", "The ox", "The donkey"],
      correct: 0,
      fact: "A camel can go for days without water, and the caravans that carried salt south and gold north depended on it.",
      source: { label: "Encyclopaedia Britannica, \"camel\"" },
    },
    {
      question: "Which Saharan mining centre supplied the salt that the empire traded southward?",
      options: ["Taghaza", "Bilma", "Timbuktu", "Gao"],
      correct: 0,
      fact: "At Taghaza the salt was cut into blocks, and the mines were so remote that food and water had to be carried to the miners.",
      source: { label: "Encyclopaedia Britannica, \"Taghaza\"" },
    },
    {
      question: "Where did the gold that made the empire rich come from?",
      options: ["Goldfields south of the empire", "Mines in the Sahara", "Rivers of the Sahel", "Trade with Egypt alone"],
      correct: 0,
      fact: "The gold came from the lands to the south, and the king kept the trade to himself and forbade anyone to say where the market really was.",
      source: { label: "Encyclopaedia Britannica, \"Ghana, historical empire\"" },
    },
    {
      question: "In which present-day country are the ruins of Koumbi Saleh?",
      options: ["Mauritania", "Mali", "Senegal", "Niger"],
      correct: 0,
      fact: "Koumbi Saleh, the capital of Ghana, lies in south-eastern Mauritania, where the stone houses of its merchants have been excavated.",
      source: { label: "Encyclopaedia Britannica, \"Ghana, historical empire\"" },
    },
    {
      question: "Which river, the great artery of the western Sahel, carried the trade of the empire's neighbours?",
      options: ["The Niger", "The Nile", "The Congo", "The Zambezi"],
      correct: 0,
      fact: "The Niger made a great bend across the Sahel, and the towns along it grew into the markets where the desert trade met the river boats.",
      source: { label: "Encyclopaedia Britannica, \"Ghana, historical empire\"" },
    },
    {
      question: "Which movement from the Sahara, strict in its faith, took Koumbi Saleh in 1076?",
      options: ["A revival of Islam", "A new kingdom of the forest", "The trade in ivory", "The cult of the ancestors"],
      correct: 0,
      fact: "The Almoravids preached a return to the first years of Islam, and their armies took the desert routes and the northern edge of the empire with them.",
      source: {
        label: "UNESCO, General History of Africa, volume III",
        url: "https://www.unesco.org/en/general-history-africa",
      },
    },
    {
      question: "Which town on the Niger became the great market of the gold and salt trade after the empire faded?",
      options: ["Timbuktu", "Taghaza", "Ouidah", "Massawa"],
      correct: 0,
      fact: "Timbuktu began as a camp where the desert caravans met the river, and it grew into the city of scholars the world still remembers.",
      source: { label: "Encyclopaedia Britannica, \"Timbuktu\"" },
    },
    {
      question: "Which people of the desert, who spoke Amazigh, handled the caravans between the salt mines and the Sahel?",
      options: ["The Tuareg", "The Yoruba", "The Swahili", "The Oromo"],
      correct: 0,
      fact: "The Tuareg knew the wells and the paths of the desert, and every caravan needed their guides and their camels.",
      source: { label: "Encyclopaedia Britannica, \"Tuareg\"" },
    },
    {
      question: "What did the Muslim merchants of Koumbi Saleh build in their own quarter of the town?",
      options: ["A mosque", "A cathedral", "A temple of the ancestors", "A castle"],
      correct: 0,
      fact: "The king kept his own religion in the royal town, and the mosque stood in the merchants' town with its own scholars and teachers.",
      source: {
        label: "UNESCO, General History of Africa, volume III",
        url: "https://www.unesco.org/en/general-history-africa",
      },
    },
    {
      question: "Which market town on the Niger, later a capital of Songhai, lay at the southern edge of the Sahel trade?",
      options: ["Gao", "Ouidah", "Massawa", "Zanzibar"],
      correct: 0,
      fact: "Gao stood where the river was easiest to cross, and the kings of Songhai made it the seat of their power for six hundred years.",
      source: { label: "Encyclopaedia Britannica, \"Gao\"" },
    },
  ],
  fr: {
    title: "L'empire du Ghana",
    subtitle: "Wagadu, pays de l'or",
    region: "Afrique de l'Ouest",
    questions: [
      {
        question: "Comment les habitants de l'empire appelaient-ils leur propre pays ?",
        options: ["Wagadu", "Mali", "Songhaï", "Bornou"],
        fact: "Ghana était le titre du roi, et les auteurs arabes l'ont utilisé pour désigner tout le royaume, alors que son peuple disait Wagadu.",
        source: "Encyclopaedia Britannica, notice « Ghana, historical empire »",
      },
      {
        question: "Quelle était la capitale de l'empire du Ghana ?",
        options: ["Koumbi Saleh", "Tombouctou", "Gao", "Djenné"],
        fact: "Koumbi Saleh se trouvait dans l'actuelle Mauritanie du sud, et les archéologues y ont retrouvé une ville royale et une ville marchande.",
        source: "UNESCO, Histoire générale de l'Afrique, volume III",
      },
      {
        question: "Quels deux produits ont enrichi l'empire du Ghana ?",
        options: ["L'or et le sel", "Le coton et le thé", "L'ivoire et le verre", "Le cuivre et la soie"],
        fact: "L'or venait des forêts du sud et le sel du Sahara au nord, et le Ghana taxait chaque charge qui traversait son territoire.",
        source: "Encyclopaedia Britannica, notice « Ghana, historical empire »",
      },
      {
        question: "Dans quelle région de l'empire le sel était-il extrait ?",
        options: ["Au Sahara, au nord", "Sur la côte, au sud", "Dans la forêt équatoriale", "Le long du fleuve Niger"],
        fact: "Les mines de sel de Taghaza étaient si précieuses que le sel s'échangeait parfois poids pour poids contre de l'or.",
        source: "UNESCO, Histoire générale de l'Afrique, volume III",
      },
      {
        question: "À qui appartenait le titre de Ghana ?",
        options: ["Au roi", "À la capitale", "À l'or", "À l'armée"],
        fact: "Les géographes arabes expliquaient que Ghana désignait le souverain, l'homme qui gardait les routes commerciales et percevait les taxes.",
        source: "Encyclopaedia Britannica, notice « Ghana, historical empire »",
      },
      {
        question: "Quel auteur arabe a décrit la cour, l'or et les taxes du Ghana au XIe siècle ?",
        options: ["Al-Bakri", "Ibn Battuta", "Al-Idrissi", "Léon l'Africain"],
        fact: "Al-Bakri écrivait à Cordoue à partir des récits de voyageurs, et son texte reste la meilleure description du Ghana médiéval.",
        source: "Encyclopaedia Britannica, notice « al-Bakri »",
      },
      {
        question: "Quel mouvement venu du Sahara a attaqué et pillé Koumbi Saleh en 1076 ?",
        options: ["Les Almoravides", "Les Ottomans", "Les Portugais", "Les Zoulous"],
        fact: "Les Almoravides sont sortis du désert avec une lecture stricte de l'islam, et l'empire ne s'est jamais vraiment remis de cette attaque.",
        source: "Encyclopaedia Britannica, notice « Almoravids »",
      },
      {
        question: "Quel empire a repris ce qui restait du Ghana au XIIIe siècle ?",
        options: ["Le Mali", "Le Songhaï", "Le Kanem", "Le Bénin"],
        fact: "Après le bref royaume de Sosso, le Mali de Soundjata Keïta a pris le contrôle des routes de l'or et du sel et a bâti son propre empire.",
        source: "UNESCO, Histoire générale de l'Afrique, volume III",
      },
      {
        question: "À quels siècles l'empire du Ghana a-t-il atteint l'apogée de sa puissance ?",
        options: ["Du IXe au XIe siècle", "Le XVe siècle", "Le IIIe siècle av. J.-C.", "Le XVIIIe siècle"],
        fact: "Les auteurs arabes des IXe au XIe siècles décrivent un royaume riche dont le roi taxait chaque charge d'or et de sel qui le traversait.",
        source: "Encyclopaedia Britannica, notice « Ghana, historical empire »",
      },
      {
        question: "Que taxait le roi du Ghana au passage des marchandises ?",
        options: ["Chaque charge d'or et de sel", "Seulement les bateaux sur le Niger", "Seulement les maisons étrangères", "Rien du tout"],
        fact: "L'or venait du sud, des forêts, et le sel du nord, du Sahara, et chaque charge payait un droit à la frontière puis de nouveau à la capitale.",
        source: "UNESCO, Histoire générale de l'Afrique, volume III",
      },
      {
        question: "Quel peuple a fondé l'empire qu'il appelait Wagadou ?",
        options: ["Les Soninké", "Les Haoussa", "Les Touareg", "Les Kanouri"],
        fact: "Les Soninké étaient des agriculteurs et des commerçants du Sahel, et leur langue a porté le nom de Wagadou pendant des siècles après la chute de l'empire.",
        source: "Encyclopaedia Britannica, notice « Soninke »",
      },
      {
        question: "Quel animal rendait possible la traversée du désert entre les mines de sel et les zones aurifères ?",
        options: ["Le chameau", "Le cheval", "Le bœuf", "L'âne"],
        fact: "Un chameau peut passer des jours sans boire, et les caravanes qui portaient le sel vers le sud et l'or vers le nord dépendaient de lui.",
        source: "Encyclopaedia Britannica, notice « camel »",
      },
      {
        question: "Quel centre minier du Sahara fournissait le sel que l'empire commerçait vers le sud ?",
        options: ["Taghaza", "Bilma", "Tombouctou", "Gao"],
        fact: "À Taghaza, le sel était découpé en blocs, et les mines étaient si isolées qu'il fallait y transporter la nourriture et l'eau.",
        source: "Encyclopaedia Britannica, notice « Taghaza »",
      },
      {
        question: "D'où venait l'or qui a fait la richesse de l'empire ?",
        options: ["Des zones aurifères au sud de l'empire", "Des mines du Sahara", "Des fleuves du Sahel", "Du seul commerce avec l'Égypte"],
        fact: "L'or venait des terres du sud, et le roi gardait ce commerce pour lui en interdisant de dire où se trouvait le vrai marché.",
        source: "Encyclopaedia Britannica, notice « Ghana, historical empire »",
      },
      {
        question: "Dans quel pays actuel se trouvent les ruines de Koumbi Saleh ?",
        options: ["La Mauritanie", "Le Mali", "Le Sénégal", "Le Niger"],
        fact: "Koumbi Saleh, la capitale du Ghana, se trouve dans le sud-est de la Mauritanie, où les maisons de pierre de ses marchands ont été fouillées.",
        source: "Encyclopaedia Britannica, notice « Ghana, historical empire »",
      },
      {
        question: "Quel fleuve, grande artère du Sahel occidental, portait le commerce des voisins de l'empire ?",
        options: ["Le Niger", "Le Nil", "Le Congo", "Le Zambèze"],
        fact: "Le Niger décrit une grande boucle à travers le Sahel, et les villes de ses rives sont devenues les marchés où le commerce du désert rencontrait les bateaux.",
        source: "Encyclopaedia Britannica, notice « Ghana, historical empire »",
      },
      {
        question: "Quel mouvement venu du Sahara, strict dans sa foi, a pris Koumbi Saleh en 1076 ?",
        options: ["Un renouveau de l'islam", "Un nouveau royaume de la forêt", "Le commerce de l'ivoire", "Le culte des ancêtres"],
        fact: "Les Almoravides prêchaient un retour aux premières années de l'islam, et leurs armées ont pris avec elles les routes du désert et le nord de l'empire.",
        source: "UNESCO, Histoire générale de l'Afrique, volume III",
      },
      {
        question: "Quelle ville du Niger est devenue le grand marché de l'or et du sel après l'effacement de l'empire ?",
        options: ["Tombouctou", "Taghaza", "Ouidah", "Massawa"],
        fact: "Tombouctou a commencé comme un camp où les caravanes du désert rencontraient le fleuve, et elle est devenue la ville de lettrés que le monde se rappelle encore.",
        source: "Encyclopaedia Britannica, notice « Timbuktu »",
      },
      {
        question: "Quel peuple du désert, qui parlait amazighe, conduisait les caravanes entre les mines de sel et le Sahel ?",
        options: ["Les Touareg", "Les Yoruba", "Les Swahili", "Les Oromo"],
        fact: "Les Touareg connaissaient les puits et les pistes du désert, et chaque caravane avait besoin de leurs guides et de leurs chameaux.",
        source: "Encyclopaedia Britannica, notice « Tuareg »",
      },
      {
        question: "Qu'ont bâti les marchands musulmans de Koumbi Saleh dans leur propre quartier de la ville ?",
        options: ["Une mosquée", "Une cathédrale", "Un temple des ancêtres", "Un château"],
        fact: "Le roi gardait sa religion dans la ville royale, et la mosquée se trouvait dans la ville marchande avec ses propres lettrés et maîtres.",
        source: "UNESCO, Histoire générale de l'Afrique, volume III",
      },
      {
        question: "Quelle ville marchande du Niger, plus tard capitale du Songhaï, se trouvait à la lisière sud du commerce sahélien ?",
        options: ["Gao", "Ouidah", "Massawa", "Zanzibar"],
        fact: "Gao se trouvait là où le fleuve était le plus facile à traverser, et les rois du Songhaï en ont fait le siège de leur puissance pendant six cents ans.",
        source: "Encyclopaedia Britannica, notice « Gao »",
      },
    ],
  },
};
