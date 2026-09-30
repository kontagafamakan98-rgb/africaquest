/**
 * Forest Kingdoms: one level of the game, on its own.
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
import { Building2 } from "lucide-react";

export default {
  id: 16,
  order: 13,
  era: "medieval",
  from: 1390,
  title: "Forest Kingdoms",
  subtitle: "Kongo, Benin, Ife and Oyo",
  region: "Central and West Africa",
  color: "from-green-600 to-emerald-800",
  icon: Building2,
  gallery: {
    en: [
      {
        file: "/photos/level-16-1.jpg",
        caption: "Brass plaques of Benin, cast for the palace of the oba and shown today in the British Museum.",
        credit: "Warofdreams · CC BY-SA 3.0 · Wikimedia Commons",
        author: "Warofdreams",
        licence: "CC BY-SA 3.0",
        source: "https://commons.wikimedia.org/wiki/File:Benin_Bronzes.jpg",
      },
      {
        file: "/photos/level-16-2.jpg",
        caption: "A brass head of Ife, in what is now Nigeria, cast with a face close to life.",
        credit: "FA2010 · Public domain · Wikimedia Commons",
        author: "FA2010",
        licence: "Public domain",
        source: "https://commons.wikimedia.org/wiki/File:Africa_Ife_Head_1_Kimbell.jpg",
      },
      {
        file: "/photos/level-16-3.jpg",
        caption: "The royal enclosure of the king of Kongo at Mbanza Kongo, drawn for an atlas of 1745.",
        credit: "Thomas Astley · Public domain · Wikimedia Commons",
        author: "Thomas Astley",
        licence: "Public domain",
        source: "https://commons.wikimedia.org/wiki/File:The_Bansa%2C_or_residence_of_the_King_of_Kongo%2C_called_St._Salvador_(M'Banza_Kongo)%2C_Astley_1745.jpg",
      },
    ],
    fr: [
      {
        file: "/photos/level-16-1.jpg",
        caption: "Des plaques de laiton du Bénin, fondues pour le palais de l'oba et exposées aujourd'hui au British Museum.",
        credit: "Warofdreams · CC BY-SA 3.0 · Wikimedia Commons",
        author: "Warofdreams",
        licence: "CC BY-SA 3.0",
        source: "https://commons.wikimedia.org/wiki/File:Benin_Bronzes.jpg",
      },
      {
        file: "/photos/level-16-2.jpg",
        caption: "Une tête de laiton d'Ifé, dans l'actuel Nigeria, coulée avec un visage tout proche du vivant.",
        credit: "FA2010 · domaine public · Wikimedia Commons",
        author: "FA2010",
        licence: "domaine public",
        source: "https://commons.wikimedia.org/wiki/File:Africa_Ife_Head_1_Kimbell.jpg",
      },
      {
        file: "/photos/level-16-3.jpg",
        caption: "L'enceinte royale du roi du Kongo à Mbanza Kongo, dessinée pour un atlas de 1745.",
        credit: "Thomas Astley · domaine public · Wikimedia Commons",
        author: "Thomas Astley",
        licence: "domaine public",
        source: "https://commons.wikimedia.org/wiki/File:The_Bansa%2C_or_residence_of_the_King_of_Kongo%2C_called_St._Salvador_(M'Banza_Kongo)%2C_Astley_1745.jpg",
      },
    ],
  },
  study: {
    en: {
      essay: ["Behind the Atlantic coast, in the forests and the savannah beyond them, some of the most remarkable states of Africa took shape. They grew on farming and on trade, on copper, salt, gold, cloth and ivory, and several of them kept written records, or sent embassies to Europe, long before the first European set foot in their capitals.", "The Kongo kings wrote to Lisbon as equals, in Portuguese, and complained when the trade in captives grew beyond anything they had agreed to. In Benin, brass casters produced the plaques and heads that British troops would loot in 1897, and the guilds of the city governed the crafts, the palace and the market in their own quarters.", "In Ife, artists modelled faces of a calm and startling realism, and the horsemen of Oyo held the savannah for centuries. Further south the Kuba embroidered raffia cloth so finely that a single piece could take a year, and the Lunda empire traded copper and salt out of the savannah on its own routes.", "Each of these states governed by its own custom: the manikongo through governors and a council of nobles, the oba of Benin through the guilds of a great city, and the alaafin of Oyo through a council of chiefs that could check him. What they shared was a habit of government that survived the loss of power, and that their heirs carry on today."],
      timeline: [
        {
          year: "c. 1390",
          text: "The kingdom of Kongo takes shape around its capital at Mbanza Kongo.",
        },
        {
          year: "c. 1500",
          text: "The brass casters of Benin make the plaques and heads of the royal court.",
        },
        { year: "c. 1600", text: "The cavalry of Oyo dominate the savannah west of the Niger." },
        { year: "1704", text: "Kimpa Vita begins preaching unity and is executed two years later." },
        { year: "c. 1750", text: "The Kuba kingdom reaches its height on the Kasai river." },
        {
          year: "1897",
          text: "British troops loot the palace of Benin and take its bronzes to Europe.",
        },
      ],
      people: [
        {
          name: "Afonso I",
          text: "The Kongo king who wrote to Lisbon and complained of the slave trade.",
        },
        {
          name: "Kimpa Vita",
          text: "The prophetess who called for the unity of Kongo and was burnt for it.",
        },
        { name: "Osei Tutu", text: "The founder of Asante, whose golden stool united the Akan states." },
        { name: "Oranmiyan", text: "The legendary founder of the dynasty of Oyo." },
        {
          name: "Shyaam aMbul aNgoong",
          text: "The Kuba king who brought new crops and crafts to the kingdom.",
        },
      ],
      places: [
        { name: "Mbanza Kongo", text: "The capital of the kingdom of Kongo." },
        {
          name: "Benin City",
          text: "The city of the oba, with its walls and its brass casting quarter.",
        },
        { name: "Ife", text: "The Yoruba city of the sacred kings and of the naturalistic heads." },
        { name: "Oyo Ile", text: "The capital of the cavalry kingdom of Oyo." },
        { name: "The Kasai", text: "The river of the Kuba kingdom and of its raffia cloth." },
      ],
      glossary: [
        { term: "manikongo", text: "The title of the king of Kongo." },
        { term: "oba", text: "The title of the king in Benin and in other Yoruba and Edo states." },
        {
          term: "lost wax casting",
          text: "The method used to cast the heads and the plaques of Benin.",
        },
        {
          term: "raffia",
          text: "The fibre of the palm leaf, woven and embroidered into cloth in the Kuba kingdom.",
        },
        { term: "guild", text: "The corporation of craftsmen that governed a trade in a great city." },
      ],
    },
    fr: {
      essay: ["Derrière la côte atlantique, dans les forêts et les savanes qui les prolongent, quelques-uns des États les plus remarquables d'Afrique ont pris forme. Ils vivaient de l'agriculture et du commerce, du cuivre, du sel, de l'or, des tissus et de l'ivoire, et plusieurs ont tenu des archives écrites, ou envoyé des ambassades en Europe, bien avant qu'un Européen mette le pied dans leurs capitales.", "Les rois du Kongo écrivaient à Lisbonne d'égal à égal, en portugais, et se plaignaient quand la traite des captifs dépassait tout ce qu'ils avaient accepté. Au Bénin, les fondeurs de laiton ont produit les plaques et les têtes que les troupes britanniques allaient piller en 1897, et les corporations de la ville gouvernaient les métiers, le palais et le marché dans leurs quartiers propres.", "À Ifé, les artistes modelaient des visages d'un réalisme calme et saisissant, et les cavaliers d'Oyo ont tenu la savane pendant des siècles. Plus au sud, les Kouba brodaient le raphia si finement qu'une seule pièce pouvait demander un an, et l'empire lounda commerçait le cuivre et le sel de la savane sur ses propres routes.", "Chacun de ces États gouvernait selon sa propre coutume : le manikongo par des gouverneurs et un conseil de nobles, l'oba du Bénin par les corporations d'une grande ville, et l'alaafin d'Oyo par un conseil de chefs qui pouvait le contrôler. Ce qu'ils partageaient, c'est une manière de gouverner qui a survécu à la perte du pouvoir, et que leurs héritiers poursuivent aujourd'hui."],
      timeline: [
        {
          year: "v. 1390",
          text: "Le royaume du Kongo prend forme autour de sa capitale, Mbanza Kongo.",
        },
        {
          year: "v. 1500",
          text: "Les fondeurs de laiton du Bénin produisent les plaques et les têtes de la cour royale.",
        },
        { year: "v. 1600", text: "La cavalerie d'Oyo domine la savane à l'ouest du Niger." },
        {
          year: "1704",
          text: "Kimpa Vita commence à prêcher l'unité et est exécutée deux ans plus tard.",
        },
        { year: "v. 1750", text: "Le royaume kouba atteint son apogée sur la rivière Kasaï." },
        {
          year: "1897",
          text: "Les troupes britanniques pillent le palais du Bénin et emportent ses bronzes en Europe.",
        },
      ],
      people: [
        {
          name: "Afonso Ier",
          text: "Le roi du Kongo qui a écrit à Lisbonne pour protester contre la traite.",
        },
        {
          name: "Kimpa Vita",
          text: "La prophétesse qui a appelé à l'unité du Kongo et qui a été brûlée pour cela.",
        },
        {
          name: "Osei Toutou",
          text: "Le fondateur de l'Asante, dont le tabouret d'or a uni les États akan.",
        },
        { name: "Oranmiyan", text: "Le fondateur légendaire de la dynastie d'Oyo." },
        {
          name: "Shyaam aMbul aNgoong",
          text: "Le roi kouba qui a apporté de nouvelles cultures et de nouveaux métiers au royaume.",
        },
      ],
      places: [
        { name: "Mbanza Kongo", text: "La capitale du royaume du Kongo." },
        { name: "Bénin", text: "La ville de l'oba, avec ses murs et son quartier des fondeurs." },
        { name: "Ifé", text: "La ville yoruba des rois sacrés et des têtes naturalistes." },
        { name: "Oyo Ile", text: "La capitale du royaume cavalier d'Oyo." },
        { name: "Le Kasaï", text: "La rivière du royaume kouba et de son tissu de raphia." },
      ],
      glossary: [
        { term: "manikongo", text: "Le titre du roi du Kongo." },
        { term: "oba", text: "Le titre du roi au Bénin et dans d'autres États yoruba et édo." },
        {
          term: "fonte à la cire perdue",
          text: "La méthode employée pour couler les têtes et les plaques du Bénin.",
        },
        {
          term: "raphia",
          text: "La fibre de la feuille de palmier, tissée et brodée en étoffe dans le royaume kouba.",
        },
        {
          term: "corporation",
          text: "L'association des artisans qui gouvernait un métier dans une grande ville.",
        },
      ],
    },
  },
  questions: [
    {
      question: "Which kingdom was founded around 1390 with its capital at Mbanza Kongo?",
      options: ["The Kingdom of Kongo", "The Kingdom of Benin", "The Kingdom of Ife", "The Empire of Oyo"],
      correct: 0,
      fact: "Nimi a Lukeni built the kingdom by uniting several small states on the plateau of northern Angola.",
      source: { label: "UNESCO World Heritage List, Mbanza Kongo", url: "https://whc.unesco.org/en/list/1511/" },
    },
    {
      question: "Which Kongo king made Christianity a state religion and wrote to the king of Portugal?",
      options: ["Afonso I", "Nimi a Lukeni", "Kimpa Vita", "Ewuare"],
      correct: 0,
      fact: "Afonso I, born Nzinga a Mvemba, learned Portuguese, opened schools, and wrote to Lisbon to protest against the slave trade.",
      source: { label: "Encyclopaedia Britannica, \"Afonso I\"" },
    },
    {
      question: "Which prophetess preached a reform of the church in Kongo and was executed in 1706?",
      options: ["Kimpa Vita", "Nzinga Mbandi", "Yaa Asantewaa", "Amina"],
      correct: 0,
      fact: "Kimpa Vita said that Saint Anthony spoke through her, called on the Kongolese to unite, and was burned with her companion.",
      source: {
        label: "The Metropolitan Museum of Art, Dona Beatriz, Kongo Prophet",
        url: "https://www.metmuseum.org/essays/dona-beatriz-kongo-prophet",
      },
    },
    {
      question: "In which kingdom did British troops loot the royal palace in 1897?",
      options: ["Benin", "Kongo", "Ife", "Kanem-Bornu"],
      correct: 0,
      fact: "The punitive expedition of 1897 took thousands of brass plaques, heads and ivory carvings, now scattered among museums in Europe and America.",
      source: { label: "Encyclopaedia Britannica, \"Benin\"" },
    },
    {
      question: "Which oba of Benin, ruling from 1440 to 1473, built up the palace and the city?",
      options: ["Ewuare the Great", "Ovonramwen", "Oduduwa", "Alaafin Sango"],
      correct: 0,
      fact: "Ewuare rebuilt the capital, dug moats and earthworks, and turned Benin into one of the best organised states of West Africa.",
      source: { label: "Encyclopaedia Britannica, \"Benin\"" },
    },
    {
      question: "Which Yoruba city is seen as the cradle of the Yoruba and is famous for its brass heads?",
      options: ["Ife", "Kano", "Oyo", "Abomey"],
      correct: 0,
      fact: "The naturalistic brass heads of Ile-Ife date from the 13th to the 15th century and count among the great works of world art.",
      source: { label: "Encyclopaedia Britannica, \"Ife\"" },
    },
    {
      question: "Which Yoruba empire of cavalrymen dominated the savannah north of the forest for centuries?",
      options: ["Oyo", "Benin", "Kongo", "Dahomey"],
      correct: 0,
      fact: "Oyo's horsemen controlled the trade with the Sahel, and the empire only broke up in the 19th century under civil wars and outside pressure.",
      source: { label: "Encyclopaedia Britannica, \"Oyo empire\"" },
    },
    {
      question: "Which guild of craftsmen in Benin cast the commemorative heads of the obas?",
      options: ["The brass casters of Igun Street", "The wood carvers of Ife", "The weavers of Kano", "The boat builders of Lamu"],
      correct: 0,
      fact: "The craft guilds of Benin lived in their own quarters of the city and passed their skills from father to son.",
      source: { label: "Encyclopaedia Britannica, \"Benin\"" },
    },
    {
      question: "Which queen ruled Ndongo and Matamba in today's Angola and fought the Portuguese for decades?",
      options: ["Njinga Mbandi", "Kimpa Vita", "Yaa Asantewaa", "Amina"],
      correct: 0,
      fact: "Njinga Mbandi negotiated with the Portuguese as an equal, then fought them for years, and she is remembered as a symbol of resistance.",
      source: { label: "Encyclopaedia Britannica, \"Nzinga\"" },
    },
    {
      question: "Which forest kingdom of today's Ghana is famous for its Golden Stool?",
      options: ["Asante", "Kongo", "Ife", "Kanem"],
      correct: 0,
      fact: "The Golden Stool stands for the soul of the Asante nation, and the kingdom grew rich on gold and on the trade routes to the coast.",
      source: { label: "Encyclopaedia Britannica, \"Asante empire\"" },
    },
    {
      question: "What was the title of the ruler of the Kongo kingdom?",
      options: ["Manikongo", "Oba", "Mansa", "Mai"],
      correct: 0,
      fact: "The manikongo ruled from Mbanza Kongo through governors and a council of nobles, and he was a judge and a war leader as well as a king.",
      source: { label: "Encyclopaedia Britannica, \"Kongo kingdom\"" },
    },
    {
      question: "Which kingdom of the Congo basin was famous for its raffia cloth and its royal masks?",
      options: ["Kuba", "Ife", "Oyo", "Kilwa"],
      correct: 0,
      fact: "The Kuba made cloth from raffia palm fibre, embroidered so finely that a single piece could take a year, and every king had a mask of his own.",
      source: { label: "Encyclopaedia Britannica, \"Kuba\"" },
    },
    {
      question: "Which empire of the savannah south of the forest grew rich on copper and salt?",
      options: ["Lunda", "Asante", "Kongo", "Benin"],
      correct: 0,
      fact: "The Lunda empire grew out of the Luba kingdom, and its trade in copper and salt linked the mineral belt to the coasts.",
      source: { label: "Encyclopaedia Britannica, \"Lunda empire\"" },
    },
    {
      question: "According to tradition, from which city did the bronze casters of Benin learn their craft?",
      options: ["Ife", "Oyo", "Kano", "Timbuktu"],
      correct: 0,
      fact: "Benin tradition says the oba sent to Ife for a master caster, and that is why the two courts share a style of brass heads.",
      source: { label: "Encyclopaedia Britannica, \"Benin\"" },
    },
    {
      question: "Who, in the 17th century, united the Asante states into a single kingdom?",
      options: ["Osei Tutu", "Ewuare", "Idris Alooma", "Sundiata Keita"],
      correct: 0,
      fact: "Osei Tutu and his priest Komfo Anokye drew the states together around Kumasi, and the Golden Stool became the sign of their union.",
      source: { label: "Encyclopaedia Britannica, \"Osei Tutu\"" },
    },
    {
      question: "Which ancestor king do the Yoruba trace their rulers back to?",
      options: ["Oduduwa", "Osei Tutu", "Kimpa Vita", "Sundiata Keita"],
      correct: 0,
      fact: "Oduduwa is remembered as the founder of Ife and the father of the crowned kings of Yorubaland, and every ruling house claims him.",
      source: { label: "Encyclopaedia Britannica, \"Oduduwa\"" },
    },
    {
      question: "Which title did the kings of Oyo use?",
      options: ["Alaafin", "Manikongo", "Mai", "Negus"],
      correct: 0,
      fact: "The alaafin ruled from Oyo with a council of chiefs who could check him, and his cavalry controlled the savannah for centuries.",
      source: { label: "Encyclopaedia Britannica, \"Oyo empire\"" },
    },
    {
      question: "Which Yoruba system of divination, built on 256 signs, is still consulted today?",
      options: ["Ifa", "Vodun", "Kebra", "Minkisi"],
      correct: 0,
      fact: "An Ifa priest casts palm nuts or a chain to reach one of the signs, and each sign carries a poem that has been learned by heart.",
      source: { label: "Encyclopaedia Britannica, \"Ifa\"" },
    },
    {
      question: "Which European traders appear on the brass plaques of Benin, showing the contact of the 16th century?",
      options: ["Portuguese", "British", "Dutch", "French"],
      correct: 0,
      fact: "Portuguese merchants and soldiers are shown on the plaques with their long hair and their guns, and the oba traded pepper and ivory with them.",
      source: { label: "Encyclopaedia Britannica, \"Benin\"" },
    },
    {
      question: "Which kingdom of the coast north of Kongo traded cloth and ivory with Europe?",
      options: ["Loango", "Kuba", "Lunda", "Oyo"],
      correct: 0,
      fact: "Loango stretched from the coast into today's Congo and Gabon, and its ports sold raffia cloth and ivory for centuries before the Atlantic trade.",
      source: { label: "Encyclopaedia Britannica, \"Loango\"" },
    },
    {
      question: "Which kingdom did the Asante defeat in 1701 to take control of the gold trade?",
      options: ["Denkyira", "Kuba", "Ife", "Lunda"],
      correct: 0,
      fact: "Denkyira had ruled the gold-bearing lands to the south, and the Asante victory at Feyiase made Kumasi the centre of the gold trade.",
      source: { label: "Encyclopaedia Britannica, \"Asante empire\"" },
    },
  ],
  fr: {
    title: "Les royaumes de la forêt",
    subtitle: "Kongo, Bénin, Ifé et Oyo",
    region: "Afrique centrale et de l'Ouest",
    questions: [
      {
        question: "Quel royaume a été fondé vers 1390 avec pour capitale Mbanza Kongo ?",
        options: ["Le royaume du Kongo", "Le royaume du Bénin", "Le royaume d'Ifé", "L'empire d'Oyo"],
        fact: "Nimi a Lukeni a bâti ce royaume en réunissant plusieurs petits États sur le plateau du nord de l'Angola.",
        source: "Liste du patrimoine mondial de l'UNESCO, Mbanza Kongo",
      },
      {
        question: "Quel roi du Kongo a fait du christianisme une religion d'État et écrit au roi du Portugal ?",
        options: ["Afonso Ier", "Nimi a Lukeni", "Kimpa Vita", "Ewuare"],
        fact: "Afonso Ier, né Nzinga a Mvemba, a appris le portugais, ouvert des écoles et écrit à Lisbonne pour protester contre la traite.",
        source: "Encyclopaedia Britannica, notice « Afonso I »",
      },
      {
        question: "Quelle prophétesse a prêché une réforme de l'Église au Kongo et a été exécutée en 1706 ?",
        options: ["Kimpa Vita", "Nzinga Mbandi", "Yaa Asantewaa", "Amina"],
        fact: "Kimpa Vita disait que saint Antoine parlait par sa bouche, appelait les Kongolais à s'unir, et elle a été brûlée avec son compagnon.",
        source: "The Metropolitan Museum of Art, Dona Beatriz, Kongo Prophet",
      },
      {
        question: "Dans quel royaume des troupes britanniques ont-elles pillé le palais royal en 1897 ?",
        options: ["Le Bénin", "Le Kongo", "Ifé", "Le Kanem-Bornou"],
        fact: "L'expédition punitive de 1897 a emporté des milliers de plaques, de têtes et d'objets d'ivoire, aujourd'hui dispersés dans les musées d'Europe et d'Amérique.",
        source: "Encyclopaedia Britannica, notice « Benin »",
      },
      {
        question: "Quel oba du Bénin, qui a régné de 1440 à 1473, a développé le palais et la ville ?",
        options: ["Ewuare le Grand", "Ovonramwen", "Oduduwa", "Alaafin Sango"],
        fact: "Ewuare a reconstruit la capitale, creusé des douves et des terrassements, et fait du Bénin l'un des États les mieux organisés d'Afrique de l'Ouest.",
        source: "Encyclopaedia Britannica, notice « Benin »",
      },
      {
        question: "Quelle ville yoruba est considérée comme le berceau des Yoruba et est célèbre pour ses têtes en laiton ?",
        options: ["Ifé", "Kano", "Oyo", "Abomey"],
        fact: "Les têtes en laiton naturalistes d'Ile-Ifé datent du XIIIe au XVe siècle et comptent parmi les grandes œuvres de l'art mondial.",
        source: "Encyclopaedia Britannica, notice « Ife »",
      },
      {
        question: "Quel empire yoruba de cavaliers a dominé la savane au nord de la forêt pendant des siècles ?",
        options: ["Oyo", "Le Bénin", "Le Kongo", "Le Dahomey"],
        fact: "Les cavaliers d'Oyo contrôlaient le commerce avec le Sahel, et l'empire ne s'est disloqué qu'au XIXe siècle, entre guerres civiles et pressions extérieures.",
        source: "Encyclopaedia Britannica, notice « Oyo empire »",
      },
      {
        question: "Quelle corporation d'artisans du Bénin coulait les têtes commémoratives des obas ?",
        options: ["Les fondeurs de laiton de la rue Igun", "Les sculpteurs sur bois d'Ifé", "Les tisserands de Kano", "Les constructeurs de pirogues de Lamu"],
        fact: "Les corporations d'artisans du Bénin vivaient dans leurs propres quartiers de la ville et transmettaient leur savoir de père en fils.",
        source: "Encyclopaedia Britannica, notice « Benin »",
      },
      {
        question: "Quelle reine a régné sur le Ndongo et le Matamba, dans l'Angola actuel, et combattu les Portugais pendant des décennies ?",
        options: ["Njinga Mbandi", "Kimpa Vita", "Yaa Asantewaa", "Amina"],
        fact: "Njinga Mbandi a négocié d'égal à égal avec les Portugais, puis les a combattus des années durant, et elle reste un symbole de résistance.",
        source: "Encyclopaedia Britannica, notice « Nzinga »",
      },
      {
        question: "Quel royaume forestier du Ghana actuel est célèbre pour son Tabouret d'or ?",
        options: ["L'Asante", "Le Kongo", "Ifé", "Le Kanem"],
        fact: "Le Tabouret d'or incarne l'âme de la nation asante, et le royaume s'est enrichi grâce à l'or et aux routes commerciales vers la côte.",
        source: "Encyclopaedia Britannica, notice « Asante empire »",
      },
      {
        question: "Quel était le titre du souverain du royaume kongo ?",
        options: ["Manikongo", "Oba", "Mansa", "Maï"],
        fact: "Le manikongo régnait depuis Mbanza Kongo par des gouverneurs et un conseil de nobles, et il était juge et chef de guerre autant que roi.",
        source: "Encyclopaedia Britannica, notice « Kongo kingdom »",
      },
      {
        question: "Quel royaume du bassin du Congo était célèbre pour son tissu de raphia et ses masques royaux ?",
        options: ["Le Kouba", "Ifé", "Oyo", "Kilwa"],
        fact: "Les Kouba fabriquaient un tissu de fibre de raphia, brodé si finement qu'une pièce pouvait demander un an, et chaque roi avait son propre masque.",
        source: "Encyclopaedia Britannica, notice « Kuba »",
      },
      {
        question: "Quel empire de la savane au sud de la forêt s'est enrichi grâce au cuivre et au sel ?",
        options: ["Le Lounda", "L'Asante", "Le Kongo", "Le Bénin"],
        fact: "L'empire lounda est né du royaume louba, et son commerce du cuivre et du sel reliait la ceinture minérale aux côtes.",
        source: "Encyclopaedia Britannica, notice « Lunda empire »",
      },
      {
        question: "Selon la tradition, de quelle ville les fondeurs de bronze du Bénin tenaient-ils leur art ?",
        options: ["Ifé", "Oyo", "Kano", "Tombouctou"],
        fact: "La tradition du Bénin raconte que l'oba a envoyé chercher un maître fondeur à Ifé, et c'est pourquoi les deux cours partagent un même style de têtes en laiton.",
        source: "Encyclopaedia Britannica, notice « Benin »",
      },
      {
        question: "Qui, au XVIIe siècle, a uni les États asante en un seul royaume ?",
        options: ["Osei Toutou", "Ewuare", "Idriss Alooma", "Sundiata Keïta"],
        fact: "Osei Toutou et son prêtre Komfo Anokye ont rassemblé les États autour de Koumassi, et le Tabouret d'or est devenu le signe de leur union.",
        source: "Encyclopaedia Britannica, notice « Osei Tutu »",
      },
      {
        question: "À quel roi ancêtre les Yoruba rattachent-ils leurs souverains ?",
        options: ["Oduduwa", "Osei Toutou", "Kimpa Vita", "Sundiata Keïta"],
        fact: "Oduduwa est le fondateur du pays d'Ifé dans la mémoire des Yoruba, et chaque maison royale se rattache à lui.",
        source: "Encyclopaedia Britannica, notice « Oduduwa »",
      },
      {
        question: "Quel titre les rois d'Oyo portaient-ils ?",
        options: ["Alaafin", "Manikongo", "Maï", "Négus"],
        fact: "L'alaafin régnait depuis Oyo avec un conseil de chefs qui pouvait le contrôler, et sa cavalerie tenait la savane pendant des siècles.",
        source: "Encyclopaedia Britannica, notice « Oyo empire »",
      },
      {
        question: "Quel système de divination yoruba, fondé sur 256 signes, est encore consulté aujourd'hui ?",
        options: ["Le Ifa", "Le vodoun", "Le kebra", "Les minkisi"],
        fact: "Le devin d'Ifa jette des noix de palme ou une chaîne pour atteindre un signe, et chaque signe porte un poème appris par cœur.",
        source: "Encyclopaedia Britannica, notice « Ifa »",
      },
      {
        question: "Quels marchands européens figurent sur les plaques de laiton du Bénin, témoins du contact du XVIe siècle ?",
        options: ["Les Portugais", "Les Britanniques", "Les Néerlandais", "Les Français"],
        fact: "Les marchands et les soldats portugais sont montrés sur les plaques avec leurs longs cheveux et leurs armes, et l'oba commerçait avec eux le poivre et l'ivoire.",
        source: "Encyclopaedia Britannica, notice « Benin »",
      },
      {
        question: "Quel royaume de la côte au nord du Kongo commerçait le tissu et l'ivoire avec l'Europe ?",
        options: ["Le Loango", "Le Kouba", "Le Lounda", "Oyo"],
        fact: "Le Loango s'étendait de la côte jusqu'au Congo et au Gabon actuels, et ses ports vendaient du tissu de raphia et de l'ivoire bien avant la traite atlantique.",
        source: "Encyclopaedia Britannica, notice « Loango »",
      },
      {
        question: "Quel royaume les Asante ont-ils vaincu en 1701 pour prendre le contrôle du commerce de l'or ?",
        options: ["Le Denkyira", "Le Kouba", "Ifé", "Le Lounda"],
        fact: "Le Denkyira régnait sur les terres aurifères du sud, et la victoire asante a fait de Koumassi le centre du commerce de l'or.",
        source: "Encyclopaedia Britannica, notice « Asante empire »",
      },
    ],
  },
};
