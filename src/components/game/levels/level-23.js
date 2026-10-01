/**
 * The Great Lakes Kingdoms: one level of the game, on its own.
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
import { Ship } from "lucide-react";

export default {
  id: 23,
  order: 14,
  era: "medieval",
  from: 1200,
  title: "The Great Lakes Kingdoms",
  subtitle: "Buganda, Bunyoro and Rwanda",
  region: "Great Lakes",
  color: "from-cyan-600 to-teal-800",
  icon: Ship,
  gallery: {
    en: [
      {
        file: "/photos/level-23-1.jpg",
        caption: "Lake Victoria seen from the Ugandan shore, the heart of the interlacustrine kingdoms.",
        credit: "Monica2168 · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Monica2168",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Lake_Victoria-_Kampala-Uganda.jpg",
      },
      {
        file: "/photos/level-23-2.jpg",
        caption: "The tombs of the kabakas of Buganda at Kasubi, a World Heritage Site in Kampala.",
        credit: "Karl.Mustermann · Public domain · Wikimedia Commons",
        author: "Karl.Mustermann",
        licence: "Public domain",
        source: "https://commons.wikimedia.org/wiki/File:Kasubi_tombs.JPG",
      },
      {
        file: "/photos/level-23-3.jpg",
        caption: "Lake Tanganyika, the deepest lake in Africa, on the western edge of the kingdoms.",
        credit: "Orrling · CC BY-SA 3.0 · Wikimedia Commons",
        author: "Orrling",
        licence: "CC BY-SA 3.0",
        source: "https://commons.wikimedia.org/wiki/File:Lake_Tanganyika.jpg",
      },
    ],
    fr: [
      {
        file: "/photos/level-23-1.jpg",
        caption: "Le lac Victoria vu de la rive ougandaise, cœur des royaumes interlacustres.",
        credit: "Monica2168 · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Monica2168",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Lake_Victoria-_Kampala-Uganda.jpg",
      },
      {
        file: "/photos/level-23-2.jpg",
        caption: "Les tombeaux des kabakas du Buganda à Kasubi, site du patrimoine mondial à Kampala.",
        credit: "Karl.Mustermann · domaine public · Wikimedia Commons",
        author: "Karl.Mustermann",
        licence: "domaine public",
        source: "https://commons.wikimedia.org/wiki/File:Kasubi_tombs.JPG",
      },
      {
        file: "/photos/level-23-3.jpg",
        caption: "Le lac Tanganyika, le plus profond d'Afrique, à la lisière ouest des royaumes.",
        credit: "Orrling · CC BY-SA 3.0 · Wikimedia Commons",
        author: "Orrling",
        licence: "CC BY-SA 3.0",
        source: "https://commons.wikimedia.org/wiki/File:Lake_Tanganyika.jpg",
      },
    ],
  },
  study: {
    en: {
      essay: ["Between the great lakes of East Africa, a group of kingdoms grew up in the centuries after the year 1000. The oldest, Bunyoro-Kitara, looked back to the Bachwezi, and Buganda, Rwanda, Burundi and Karagwe each took their own shape between the water and the highlands.", "Cattle and bananas were the base of the economy: herds were lent in return for service, and the plantain gave the farmers a crop that came back year after year. Iron working was older than the kingdoms themselves, and the smiths made the hoes for the fields and the spears for the wars.", "The kabaka of Buganda ruled with his clans and a fleet of canoes, and by the nineteenth century his kingdom was the strongest of the region. In Rwanda and Burundi the mwami presided over a society of herders and farmers tied together by cattle clientage.", "The coast reached the lakes through Arab and Swahili caravans, which brought cloth, beads and firearms and carried away ivory and captives. German and then Belgian rule followed at the end of the nineteenth century, and the kingdoms survived in new forms."],
      timeline: [
        { year: "1200", text: "The Bachwezi rulers give Bunyoro-Kitara its first dynasty." },
        { year: "1350", text: "Buganda takes shape around the court of its first kabaka." },
        { year: "1600", text: "The earthworks of Bigo and Ntusi mark the capitals of the region." },
        { year: "1700", text: "Karagwe grows rich on the trade of salt, iron and coffee." },
        { year: "1800", text: "Buganda is the strongest of the kingdoms between the lakes." },
        { year: "1858", text: "John Hanning Speke reaches Lake Victoria and names it." },
        {
          year: "1894",
          text: "Britain makes Uganda a protectorate and German rule begins in Ruanda-Urundi.",
        },
      ],
      people: [
        { name: "Kintu", text: "The first kabaka of Buganda in the kingdom's own tradition." },
        {
          name: "Mutesa I",
          text: "The kabaka who received the first European visitors at his court in the 1860s.",
        },
        {
          name: "Kigeri Rwabugiri",
          text: "The Rwandan mwami who expanded his kingdom in the nineteenth century.",
        },
        {
          name: "John Hanning Speke",
          text: "The traveller who reached Lake Victoria in 1858 and traced the Nile from it.",
        },
        { name: "The Bachwezi", text: "The rulers from whom Bunyoro-Kitara traced its first dynasty." },
      ],
      places: [
        {
          name: "Lake Victoria",
          text: "The largest lake in Africa, the heart of the region and the source of the Nile.",
        },
        {
          name: "Lake Tanganyika",
          text: "The deepest lake in Africa, on the western edge of the kingdoms.",
        },
        {
          name: "Lake Kivu",
          text: "The lake below the Virunga volcanoes, between Rwanda and the Congo.",
        },
        {
          name: "Kasubi",
          text: "The tombs of the kabakas of Buganda, a World Heritage Site in Kampala.",
        },
        { name: "Bigo bya Mugenyi", text: "The great earthworks of a royal capital in western Uganda." },
      ],
      glossary: [
        { term: "kabaka", text: "The title of the king of Buganda, whose court ruled with the clans." },
        { term: "mwami", text: "The title of the kings of Rwanda and Burundi." },
        {
          term: "ubuhake",
          text: "The cattle clientage that tied a herder to a patron in return for service.",
        },
        { term: "Bachwezi", text: "The first rulers remembered in the traditions of Bunyoro-Kitara." },
        {
          term: "plantain",
          text: "The cooking banana that fed the region without clearing a new field each year.",
        },
      ],
    },
    fr: {
      essay: ["Entre les grands lacs d'Afrique de l'Est, plusieurs royaumes se sont formés dans les siècles qui ont suivi l'an 1000. Le plus ancien, le Bunyoro-Kitara, se réclamait des Bachwezi, et le Buganda, le Rwanda, le Burundi et le Karagwe ont pris chacun leur forme entre l'eau et les hauts plateaux.", "Le bétail et la banane étaient la base de l'économie : les troupeaux étaient prêtés en échange de services, et le plantain donnait aux agriculteurs une culture qui revenait chaque année. Le travail du fer était plus ancien que les royaumes, et les forgerons fabriquaient les houes des champs et les lances des guerres.", "Le kabaka du Buganda gouvernait avec ses clans et une flotte de pirogues, et au XIXe siècle son royaume était le plus fort de la région. Au Rwanda et au Burundi, le mwami présidait une société d'éleveurs et d'agriculteurs liés par la clientèle du bétail.", "La côte atteignait les lacs par les caravanes arabes et swahilies, qui apportaient tissus, perles et armes à feu et remportaient ivoire et captifs. La domination allemande, puis belge, a suivi à la fin du XIXe siècle, et les royaumes ont survécu sous de nouvelles formes."],
      timeline: [
        {
          year: "1200",
          text: "Les souverains bachwezi donnent au Bunyoro-Kitara sa première dynastie.",
        },
        { year: "1350", text: "Le Buganda prend forme autour de la cour de son premier kabaka." },
        {
          year: "1600",
          text: "Les terrassements de Bigo et Ntusi marquent les capitales de la région.",
        },
        { year: "1700", text: "Le Karagwe s'enrichit du commerce du sel, du fer et du café." },
        { year: "1800", text: "Le Buganda est le plus fort des royaumes entre les lacs." },
        { year: "1858", text: "John Hanning Speke atteint le lac Victoria et le nomme." },
        {
          year: "1894",
          text: "La Grande-Bretagne fait de l'Ouganda un protectorat et la domination allemande commence au Ruanda-Urundi.",
        },
      ],
      people: [
        { name: "Kintu", text: "Le premier kabaka du Buganda selon la tradition du royaume." },
        {
          name: "Mutesa Ier",
          text: "Le kabaka qui a reçu les premiers visiteurs européens à sa cour dans les années 1860.",
        },
        {
          name: "Kigeri Rwabugiri",
          text: "Le mwami du Rwanda qui a étendu son royaume au XIXe siècle.",
        },
        {
          name: "John Hanning Speke",
          text: "Le voyageur qui a atteint le lac Victoria en 1858 et suivi le Nil depuis ses rives.",
        },
        {
          name: "Les Bachwezi",
          text: "Les souverains dont le Bunyoro-Kitara faisait remonter sa première dynastie.",
        },
      ],
      places: [
        {
          name: "Le lac Victoria",
          text: "Le plus grand lac d'Afrique, cœur de la région et source du Nil.",
        },
        {
          name: "Le lac Tanganyika",
          text: "Le lac le plus profond d'Afrique, à la lisière ouest des royaumes.",
        },
        {
          name: "Le lac Kivu",
          text: "Le lac au pied des volcans des Virunga, entre le Rwanda et le Congo.",
        },
        {
          name: "Kasubi",
          text: "Les tombeaux des kabakas du Buganda, site du patrimoine mondial à Kampala.",
        },
        {
          name: "Bigo bya Mugenyi",
          text: "Les grands terrassements d'une capitale royale de l'ouest de l'Ouganda.",
        },
      ],
      glossary: [
        { term: "kabaka", text: "Le titre du roi du Buganda, dont la cour gouvernait avec les clans." },
        { term: "mwami", text: "Le titre des rois du Rwanda et du Burundi." },
        {
          term: "ubuhake",
          text: "La clientèle du bétail qui liait un éleveur à un patron en échange de services.",
        },
        {
          term: "Bachwezi",
          text: "Les premiers souverains retenus par les traditions du Bunyoro-Kitara.",
        },
        {
          term: "plantain",
          text: "La banane à cuire qui nourrissait la région sans défricher un nouveau champ chaque année.",
        },
      ],
    },
  },
  questions: [
    {
      question: "Which kingdom of the Great Lakes region traced its kings back to the Bachwezi rulers?",
      options: ["Bunyoro-Kitara", "Buganda", "Rwanda", "Burundi"],
      correct: 0,
      fact: "Bunyoro-Kitara looked back to the Bachwezi as its first rulers and was the oldest of the interlacustrine kingdoms.",
      source: { label: "Encyclopaedia Britannica, \"Bunyoro\"" },
    },
    {
      question: "What is the title of the ruler of Buganda?",
      options: ["Kabaka", "Omukama", "Mwami", "Sultan"],
      correct: 0,
      fact: "The king of Buganda is the kabaka, and his court and clans gave the kingdom its shape.",
      source: { label: "Encyclopaedia Britannica, \"Buganda\"" },
    },
    {
      question: "Which lake, the largest in Africa, lies at the centre of the region?",
      options: ["Lake Victoria", "Lake Tanganyika", "Lake Chad", "Lake Malawi"],
      correct: 0,
      fact: "Lake Victoria is shared by Uganda, Kenya and Tanzania, and its shores are the heartland of the Great Lakes kingdoms.",
      source: { label: "Encyclopaedia Britannica, \"Lake Victoria\"" },
    },
    {
      question: "Which of these lakes is the deepest in Africa?",
      options: ["Lake Tanganyika", "Lake Victoria", "Lake Kivu", "Lake Turkana"],
      correct: 0,
      fact: "Lake Tanganyika plunges more than 1,400 metres and holds the second largest volume of fresh water in the world.",
      source: { label: "Encyclopaedia Britannica, \"Lake Tanganyika\"" },
    },
    {
      question: "Which kingdom grew around the courts of its kings and their chiefs, and became the largest by the nineteenth century?",
      options: ["Buganda", "Bunyoro-Kitara", "Karagwe", "Burundi"],
      correct: 0,
      fact: "Buganda expanded through its clans and its fleet of canoes, and by the 1800s it was the strongest kingdom of the region.",
      source: { label: "Encyclopaedia Britannica, \"Buganda\"" },
    },
    {
      question: "Which crop, carried across the Indian Ocean from Southeast Asia, became a staple of the region?",
      options: ["The banana", "Maize", "Cassava", "Sweet potato"],
      correct: 0,
      fact: "Bananas reached the Great Lakes long before Europeans, and they joined the cattle herds as the base of the local diet.",
      source: { label: "Encyclopaedia Britannica, \"banana\"" },
    },
    {
      question: "Which animal was the measure of wealth and the basis of clientage in these kingdoms?",
      options: ["Cattle", "Camels", "Horses", "Sheep"],
      correct: 0,
      fact: "Herds were lent to poorer families in return for service, and a great herd was the surest sign of standing.",
      source: { label: "Encyclopaedia Britannica, \"cattle\"" },
    },
    {
      question: "What were the great earthworks at Bigo and Ntusi the remains of?",
      options: ["Royal capitals of a large state", "Roman forts", "Arab trading posts", "Missionary stations"],
      correct: 0,
      fact: "The ditches and mounds of Bigo and Ntusi show that a large and organised state ruled the region long before the coast was reached.",
      source: { label: "Encyclopaedia Britannica, \"Bigo bya Mugenyi\"" },
    },
    {
      question: "Which highland kingdom was ruled by a mwami?",
      options: ["Rwanda", "Buganda", "Bunyoro", "Karagwe"],
      correct: 0,
      fact: "Rwanda and Burundi were ruled by mwami, whose courts organised the herds, the land and the armies of the highlands.",
      source: { label: "Encyclopaedia Britannica, \"Rwanda\"" },
    },
    {
      question: "Which group in Rwanda and Burundi herded cattle and held many of the herds?",
      options: ["The Tutsi", "The Hutu", "The Twa", "The Luo"],
      correct: 0,
      fact: "The Tutsi were the pastoralists of the highlands, and cattle clientage tied herders and farmers together.",
      source: { label: "Encyclopaedia Britannica, \"Tutsi\"" },
    },
    {
      question: "Which forest people are remembered as the oldest inhabitants of the region?",
      options: ["The Twa", "The Tutsi", "The Hutu", "The Maasai"],
      correct: 0,
      fact: "The Twa lived by hunting and gathering in the forests before the farmers and the herders came to the highlands.",
      source: { label: "Encyclopaedia Britannica, \"Twa\"" },
    },
    {
      question: "Which kingdom south of Buganda traded salt, iron and coffee with its neighbours?",
      options: ["Karagwe", "Bunyoro", "Buganda", "Rwanda"],
      correct: 0,
      fact: "Karagwe controlled the trade routes south and westward, and its court was a meeting place of the region.",
      source: { label: "Encyclopaedia Britannica, \"Karagwe\"" },
    },
    {
      question: "Which tombs of the kings of Buganda are a World Heritage Site?",
      options: ["Kasubi", "Ntusi", "Bigo", "Namugongo"],
      correct: 0,
      fact: "The tombs of the kabakas at Kasubi, in Kampala, hold the royal graves and keep the ceremony of the kingdom.",
      source: {
        label: "UNESCO World Heritage List, Tombs of Buganda Kings at Kasubi",
        url: "https://whc.unesco.org/en/list/1022/",
      },
    },
    {
      question: "What did the smiths of the region make that gave its kingdoms an advantage?",
      options: ["Iron tools and weapons", "Bronze bells", "Glass beads", "Silver coins"],
      correct: 0,
      fact: "Iron working was older than the kingdoms themselves, and hoes and spears made from local ore fed the fields and the armies.",
      source: { label: "Encyclopaedia Britannica, \"iron\"" },
    },
    {
      question: "What was the system of cattle clientage in Rwanda and Burundi called?",
      options: ["Ubuhake", "Ujamaa", "Baraka", "Mwendo"],
      correct: 0,
      fact: "Under ubuhake a herder received cattle from a patron and gave service in return, a bond that shaped the highlands.",
      source: { label: "Encyclopaedia Britannica, \"Rwanda\"" },
    },
    {
      question: "Which lake, between Rwanda and the Congo, lies below a chain of volcanoes?",
      options: ["Lake Kivu", "Lake Edward", "Lake Albert", "Lake Rukwa"],
      correct: 0,
      fact: "Lake Kivu sits in the rift valley below the Virunga volcanoes, and its shores were part of the highland kingdoms.",
      source: { label: "Encyclopaedia Britannica, \"Lake Kivu\"" },
    },
    {
      question: "Which colony joined Rwanda and Burundi together under one administration?",
      options: ["Ruanda-Urundi", "Tanganyika", "Uganda", "Kivu"],
      correct: 0,
      fact: "Ruanda-Urundi was first a German and then a Belgian territory, and the two countries separated at independence in 1962.",
      source: { label: "Encyclopaedia Britannica, \"Ruanda-Urundi\"" },
    },
    {
      question: "Which traveller reached Lake Victoria in 1858 and named it after the British queen?",
      options: ["John Hanning Speke", "David Livingstone", "Henry Morton Stanley", "Richard Burton"],
      correct: 0,
      fact: "John Hanning Speke reached the lake in 1858 and named it Victoria, and later traced the Nile leaving it.",
      source: { label: "Encyclopaedia Britannica, \"Lake Victoria\"" },
    },
    {
      question: "Which goods from the coast reached the courts of the Great Lakes kings?",
      options: ["Cloth, beads and firearms", "Porcelain and tea", "Silk and spices", "Wine and olive oil"],
      correct: 0,
      fact: "Arab and Swahili caravans brought cloth, beads and guns inland, and carried ivory and captives back to the coast.",
      source: { label: "Encyclopaedia Britannica, \"Buganda\"" },
    },
    {
      question: "Which kind of boat carried people and goods across the lakes?",
      options: ["The canoe", "The dhow", "The steamer", "The junk"],
      correct: 0,
      fact: "Great canoes carried hundreds of paddlers, and a fleet was as important as an army to a lake kingdom.",
      source: { label: "Encyclopaedia Britannica, \"dugout canoe\"" },
    },
    {
      question: "Which coffee, native to the forests of the region, is grown around Lake Victoria?",
      options: ["Robusta", "Arabica", "Liberica", "Excelsa"],
      correct: 0,
      fact: "Robusta coffee grows wild in the forests of the region, and Uganda became one of its largest producers.",
      source: { label: "Encyclopaedia Britannica, \"coffee\"" },
    },
  ],
  fr: {
    title: "Les royaumes des Grands Lacs",
    subtitle: "Buganda, Bunyoro et le Rwanda",
    region: "Grands Lacs",
    questions: [
      {
        question: "Quel royaume des Grands Lacs faisait remonter ses rois aux souverains bachwezi ?",
        options: ["Le Bunyoro-Kitara", "Le Buganda", "Le Rwanda", "Le Burundi"],
        fact: "Le Bunyoro-Kitara se réclamait des Bachwezi comme premiers souverains et était le plus ancien des royaumes interlacustres.",
        source: "Encyclopaedia Britannica, notice « Bunyoro »",
      },
      {
        question: "Quel est le titre du souverain du Buganda ?",
        options: ["Kabaka", "Omukama", "Mwami", "Sultan"],
        fact: "Le roi du Buganda est le kabaka, et sa cour et ses clans ont donné sa forme au royaume.",
        source: "Encyclopaedia Britannica, notice « Buganda »",
      },
      {
        question: "Quel lac, le plus grand d'Afrique, se trouve au centre de la région ?",
        options: ["Le lac Victoria", "Le lac Tanganyika", "Le lac Tchad", "Le lac Malawi"],
        fact: "Le lac Victoria est partagé par l'Ouganda, le Kenya et la Tanzanie, et ses rives sont le cœur des royaumes des Grands Lacs.",
        source: "Encyclopaedia Britannica, notice « Lake Victoria »",
      },
      {
        question: "Lequel de ces lacs est le plus profond d'Afrique ?",
        options: ["Le lac Tanganyika", "Le lac Victoria", "Le lac Kivu", "Le lac Turkana"],
        fact: "Le lac Tanganyika descend à plus de 1 400 mètres et contient le deuxième volume d'eau douce du monde.",
        source: "Encyclopaedia Britannica, notice « Lake Tanganyika »",
      },
      {
        question: "Quel royaume s'est construit autour des cours de ses rois et de leurs chefs, et était le plus vaste au XIXe siècle ?",
        options: ["Le Buganda", "Le Bunyoro-Kitara", "Le Karagwe", "Le Burundi"],
        fact: "Le Buganda s'est étendu par ses clans et sa flotte de pirogues, et il était au XIXe siècle le plus fort de la région.",
        source: "Encyclopaedia Britannica, notice « Buganda »",
      },
      {
        question: "Quelle culture, apportée à travers l'océan Indien depuis l'Asie du Sud-Est, est devenue un aliment de base de la région ?",
        options: ["La banane", "Le maïs", "Le manioc", "La patate douce"],
        fact: "Les bananes sont arrivées dans les Grands Lacs bien avant les Européens, et elles ont rejoint les troupeaux comme base de l'alimentation.",
        source: "Encyclopaedia Britannica, notice « banana »",
      },
      {
        question: "Quel animal était la mesure de la richesse et la base des liens de clientèle dans ces royaumes ?",
        options: ["Le bétail", "Le chameau", "Le cheval", "Le mouton"],
        fact: "Des troupeaux étaient prêtés aux familles plus pauvres en échange de services, et un grand troupeau était le signe le plus sûr du rang.",
        source: "Encyclopaedia Britannica, notice « cattle »",
      },
      {
        question: "Que restait-il des grands terrassements de Bigo et Ntusi ?",
        options: ["Des capitales royales d'un grand État", "Des forts romains", "Des comptoirs arabes", "Des missions"],
        fact: "Les fossés et les tertres de Bigo et Ntusi montrent qu'un État vaste et organisé régnait sur la région bien avant l'arrivée des caravanes.",
        source: "Encyclopaedia Britannica, notice « Bigo bya Mugenyi »",
      },
      {
        question: "Quel royaume des hauts plateaux était gouverné par un mwami ?",
        options: ["Le Rwanda", "Le Buganda", "Le Bunyoro", "Le Karagwe"],
        fact: "Le Rwanda et le Burundi étaient gouvernés par des mwami, dont les cours organisaient les troupeaux, la terre et les armées.",
        source: "Encyclopaedia Britannica, notice « Rwanda »",
      },
      {
        question: "Quel groupe du Rwanda et du Burundi élevait du bétail et détenait la plupart des troupeaux ?",
        options: ["Les Tutsi", "Les Hutu", "Les Twa", "Les Luo"],
        fact: "Les Tutsi étaient les éleveurs des hauts plateaux, et la clientèle du bétail liait pasteurs et agriculteurs.",
        source: "Encyclopaedia Britannica, notice « Tutsi »",
      },
      {
        question: "Quel peuple de la forêt est retenu comme le plus ancien habitant de la région ?",
        options: ["Les Twa", "Les Tutsi", "Les Hutu", "Les Maasaï"],
        fact: "Les Twa vivaient de la chasse et de la cueillette dans les forêts avant l'arrivée des agriculteurs et des éleveurs.",
        source: "Encyclopaedia Britannica, notice « Twa »",
      },
      {
        question: "Quel royaume au sud du Buganda commerçait le sel, le fer et le café avec ses voisins ?",
        options: ["Le Karagwe", "Le Bunyoro", "Le Buganda", "Le Rwanda"],
        fact: "Le Karagwe contrôlait les routes commerciales vers le sud et l'ouest, et sa cour était un carrefour de la région.",
        source: "Encyclopaedia Britannica, notice « Karagwe »",
      },
      {
        question: "Quels tombeaux des rois du Buganda sont un site du patrimoine mondial ?",
        options: ["Kasubi", "Ntusi", "Bigo", "Namugongo"],
        fact: "Les tombeaux des kabakas à Kasubi, à Kampala, abritent les sépultures royales et perpétuent la cérémonie du royaume.",
        source: "Liste du patrimoine mondial de l'UNESCO, Tombeaux des rois du Buganda à Kasubi",
      },
      {
        question: "Que fabriquaient les forgerons de la région, donnant un avantage à ses royaumes ?",
        options: ["Des outils et des armes en fer", "Des cloches de bronze", "Des perles de verre", "Des pièces d'argent"],
        fact: "Le travail du fer était plus ancien que les royaumes, et les houes et les lances tirées du minerai local nourrissaient les champs et les armées.",
        source: "Encyclopaedia Britannica, notice « iron »",
      },
      {
        question: "Comment appelait-on le système de clientèle du bétail au Rwanda et au Burundi ?",
        options: ["L'ubuhake", "L'ujamaa", "La baraka", "Le mwendo"],
        fact: "Dans l'ubuhake, un éleveur recevait du bétail d'un patron et lui rendait des services, un lien qui a façonné les hauts plateaux.",
        source: "Encyclopaedia Britannica, notice « Rwanda »",
      },
      {
        question: "Quel lac, entre le Rwanda et le Congo, s'étend au pied d'une chaîne de volcans ?",
        options: ["Le lac Kivu", "Le lac Édouard", "Le lac Albert", "Le lac Rukwa"],
        fact: "Le lac Kivu occupe le rift au pied des volcans des Virunga, et ses rives faisaient partie des royaumes des hauts plateaux.",
        source: "Encyclopaedia Britannica, notice « Lake Kivu »",
      },
      {
        question: "Quelle colonie a réuni le Rwanda et le Burundi sous une même administration ?",
        options: ["Le Ruanda-Urundi", "Le Tanganyika", "L'Ouganda", "Le Kivu"],
        fact: "Le Ruanda-Urundi fut d'abord un territoire allemand, puis belge, et les deux pays se sont séparés à l'indépendance en 1962.",
        source: "Encyclopaedia Britannica, notice « Ruanda-Urundi »",
      },
      {
        question: "Quel voyageur a atteint le lac Victoria en 1858 et l'a nommé d'après la reine britannique ?",
        options: ["John Hanning Speke", "David Livingstone", "Henry Morton Stanley", "Richard Burton"],
        fact: "John Hanning Speke a atteint le lac en 1858 et l'a nommé Victoria, puis a suivi le Nil qui en sort.",
        source: "Encyclopaedia Britannica, notice « Lake Victoria »",
      },
      {
        question: "Quelles marchandises de la côte atteignaient les cours des rois des Grands Lacs ?",
        options: ["Tissus, perles et armes à feu", "Porcelaine et thé", "Soie et épices", "Vin et huile d'olive"],
        fact: "Les caravanes arabes et swahilies apportaient tissus, perles et fusils à l'intérieur, et remportaient ivoire et captifs vers la côte.",
        source: "Encyclopaedia Britannica, notice « Buganda »",
      },
      {
        question: "Quel type de bateau transportait les personnes et les biens sur les lacs ?",
        options: ["La pirogue", "Le boutre", "Le vapeur", "La jonque"],
        fact: "De grandes pirogues portaient des centaines de pagayeurs, et une flotte comptait autant qu'une armée pour un royaume lacustre.",
        source: "Encyclopaedia Britannica, notice « dugout canoe »",
      },
      {
        question: "Quel café, originaire des forêts de la région, pousse autour du lac Victoria ?",
        options: ["Le robusta", "L'arabica", "Le liberica", "L'excelsa"],
        fact: "Le café robusta pousse à l'état sauvage dans les forêts de la région, et l'Ouganda en est devenu l'un des premiers producteurs.",
        source: "Encyclopaedia Britannica, notice « coffee »",
      },
    ],
  },
};
