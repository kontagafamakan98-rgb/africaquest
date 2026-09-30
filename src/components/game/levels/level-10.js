/**
 * Carthage and Ancient North Africa: one level of the game, on its own.
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
import { Anchor } from "lucide-react";

export default {
  id: 10,
  order: 5,
  era: "ancient",
  from: -814,
  title: "Carthage and Ancient North Africa",
  subtitle: "Rome's rival across the sea",
  region: "North Africa",
  color: "from-sky-500 to-blue-700",
  icon: Anchor,
  gallery: {
    en: [
      {
        file: "/photos/level-10-1.jpg",
        caption: "The Baths of Antoninus at Carthage, the largest Roman baths ever raised on African soil.",
        credit: "Silar · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Silar",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:01996_Ruins_of_Antonine_Baths_at_Carthage.jpg",
      },
      {
        file: "/photos/level-10-2.jpg",
        caption: "A Punic stela from the tophet of Carthage, marked with the sign of the goddess Tanit.",
        credit: "Shoestring · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Shoestring",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:A_Punic_stela_with_a_symbol_of_Tanit%2C_Carthage%2C_Tunisia.JPG",
      },
      {
        file: "/photos/level-10-3.jpg",
        caption: "Punic stonework kept in the museum of Carthage, the city Rome destroyed in 146 BC.",
        credit: "damian entwistle · CC BY-SA 2.0 · Wikimedia Commons",
        author: "damian entwistle",
        licence: "CC BY-SA 2.0",
        source: "https://commons.wikimedia.org/wiki/File:Carthage_Museum_punic_ruins.jpg",
      },
    ],
    fr: [
      {
        file: "/photos/level-10-1.jpg",
        caption: "Les thermes d'Antonin à Carthage, les plus grands thermes romains jamais élevés sur le sol africain.",
        credit: "Silar · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Silar",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:01996_Ruins_of_Antonine_Baths_at_Carthage.jpg",
      },
      {
        file: "/photos/level-10-2.jpg",
        caption: "Une stèle punique du tophet de Carthage, marquée du signe de la déesse Tanit.",
        credit: "Shoestring · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Shoestring",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:A_Punic_stela_with_a_symbol_of_Tanit%2C_Carthage%2C_Tunisia.JPG",
      },
      {
        file: "/photos/level-10-3.jpg",
        caption: "Des pierres puniques conservées au musée de Carthage, la ville que Rome détruisit en 146 avant notre ère.",
        credit: "damian entwistle · CC BY-SA 2.0 · Wikimedia Commons",
        author: "damian entwistle",
        licence: "CC BY-SA 2.0",
        source: "https://commons.wikimedia.org/wiki/File:Carthage_Museum_punic_ruins.jpg",
      },
    ],
  },
  study: {
    en: {
      essay: ["On the coast of what is now Tunisia, Phoenician sailors founded a city that would challenge Rome for the mastery of the Mediterranean. Carthage grew from a landing place on the trade route to the silver of Spain into the centre of a merchant empire with its own fleets and its own war.", "Its two harbours were cut by hand: a rectangular one for the merchant ships, and behind it a round basin ringed with ship sheds where the warships were kept, so that a fleet could be launched without a sail being seen from the sea. Its estates grew the olives and the grain that paid for the fleets, and its merchants dealt in gold, ivory and slaves along the African coast.", "With Hannibal, the city came closest to winning. His army crossed the Alps with elephants in 218 BC and beat the Romans in Italy again and again, but Carthage could not replace the soldiers, and Rome could. In 146 BC the city was destroyed, its ground ploughed and salted in the Roman story, and its land became the province of Africa.", "Beyond Carthage lay the Berber kingdoms of Numidia and Mauretania, whose kings, writers and one emperor left their mark on Rome itself. The province that followed Carthage fed the capital for centuries, and its harvest was carried across the sea in the grain ships that Rome counted on."],
      timeline: [
        { year: "c. 814 BC", text: "Phoenician settlers from Tyre found the city of Carthage." },
        {
          year: "c. 600 BC",
          text: "Carthaginian ships explore the Atlantic coast of Africa and of Europe.",
        },
        { year: "264 BC", text: "The First Punic War begins between Carthage and Rome." },
        { year: "218 BC", text: "Hannibal crosses the Alps with elephants and invades Italy." },
        { year: "146 BC", text: "Rome destroys Carthage and makes the land a province." },
        {
          year: "c. 200 AD",
          text: "Rome's African provinces are among its richest and their grain feeds the capital.",
        },
      ],
      people: [
        {
          name: "Dido",
          text: "The legendary founder of the city, remembered in the Roman story of Aeneas.",
        },
        { name: "Hannibal Barca", text: "The general who took an army and elephants across the Alps." },
        {
          name: "Hamilcar Barca",
          text: "Hannibal's father, who held Sicily and then Spain for Carthage.",
        },
        {
          name: "Juba I",
          text: "A king of Numidia who took the side of Carthage and lost his kingdom.",
        },
        { name: "Apuleius", text: "The Latin writer born in Numidia whose novel is a classic of Rome." },
      ],
      places: [
        { name: "Carthage", text: "The city itself, with its two harbours and its hill of Byrsa." },
        {
          name: "Utica",
          text: "The older Phoenician port, north of Carthage, that later sided with Rome.",
        },
        {
          name: "El Jem",
          text: "The Roman amphitheatre of the province of Africa, one of the largest ever built.",
        },
        {
          name: "Numidia",
          text: "The Berber kingdom to the west, at times an ally and at times an enemy.",
        },
      ],
      glossary: [
        { term: "Punic", text: "The Roman name for the Carthaginians, and for their language." },
        {
          term: "cothon",
          text: "The artificial basin, ringed with ship sheds, where the warships were kept.",
        },
        { term: "amphora", text: "The tall pot in which oil, wine and fish sauce travelled by sea." },
        { term: "suffete", text: "The chief magistrate of Carthage, elected by its citizens." },
        {
          term: "tophet",
          text: "The sacred precinct of Carthage whose burials are debated to this day.",
        },
      ],
    },
    fr: {
      essay: ["Sur la côte de l'actuelle Tunisie, des marins phéniciens ont fondé une ville qui allait disputer à Rome la maîtrise de la Méditerranée. Carthage est passée d'une escale sur la route de l'argent d'Espagne au centre d'un empire marchand, avec ses propres flottes et sa propre guerre.", "Ses deux ports étaient creusés à la main : l'un, rectangulaire, pour les navires marchands, et derrière lui un bassin rond entouré de cales où l'on gardait les navires de guerre, si bien qu'une flotte pouvait sortir sans qu'on en vît une voile depuis le large. Ses domaines produisaient l'huile et le blé qui payaient les flottes, et ses marchands traitaient l'or, l'ivoire et les captifs le long de la côte africaine.", "Avec Hannibal, la ville est passée au plus près de la victoire. Son armée a franchi les Alpes avec des éléphants en 218 av. J.-C. et a battu les Romains en Italie à plusieurs reprises, mais Carthage ne pouvait pas remplacer ses soldats, et Rome le pouvait. En 146 av. J.-C., la ville a été détruite, son sol labouré selon le récit romain, et sa terre est devenue la province d'Afrique.", "Au-delà de Carthage s'étendaient les royaumes berbères de Numidie et de Maurétanie, dont les rois, les écrivains et un empereur ont marqué Rome elle-même. La province qui a succédé à Carthage a nourri la capitale pendant des siècles, et sa récolte traversait la mer sur les navires de blé sur lesquels Rome comptait."],
      timeline: [
        {
          year: "v. 814 av. J.-C.",
          text: "Des colons phéniciens venus de Tyr fondent la ville de Carthage.",
        },
        {
          year: "v. 600 av. J.-C.",
          text: "Les navires carthaginois explorent la côte atlantique de l'Afrique et de l'Europe.",
        },
        { year: "264 av. J.-C.", text: "La première guerre punique commence entre Carthage et Rome." },
        {
          year: "218 av. J.-C.",
          text: "Hannibal franchit les Alpes avec ses éléphants et envahit l'Italie.",
        },
        { year: "146 av. J.-C.", text: "Rome détruit Carthage et fait de la région une province." },
        {
          year: "v. 200 apr. J.-C.",
          text: "Les provinces africaines de Rome comptent parmi les plus riches et leur blé nourrit la capitale.",
        },
      ],
      people: [
        { name: "Didon", text: "La fondatrice légendaire de la ville, liée au récit romain d'Énée." },
        {
          name: "Hannibal Barca",
          text: "Le général qui a fait passer une armée et des éléphants par les Alpes.",
        },
        {
          name: "Hamilcar Barca",
          text: "Le père d'Hannibal, qui a tenu la Sicile puis l'Espagne pour Carthage.",
        },
        {
          name: "Juba Ier",
          text: "Un roi de Numidie qui a pris le parti de Carthage et perdu son royaume.",
        },
        {
          name: "Apulée",
          text: "L'écrivain latin né en Numidie, dont le roman est un classique de Rome.",
        },
      ],
      places: [
        { name: "Carthage", text: "La ville elle-même, avec ses deux ports et sa colline de Byrsa." },
        {
          name: "Utique",
          text: "Le port phénicien plus ancien, au nord de Carthage, passé plus tard au camp de Rome.",
        },
        {
          name: "El Jem",
          text: "L'amphithéâtre romain de la province d'Afrique, l'un des plus grands jamais bâtis.",
        },
        { name: "Numidie", text: "Le royaume berbère de l'ouest, tour à tour allié et adversaire." },
      ],
      glossary: [
        { term: "punique", text: "Le nom romain des Carthaginois, et de leur langue." },
        {
          term: "cothon",
          text: "Le bassin artificiel, entouré de cales, où l'on gardait les navires de guerre.",
        },
        {
          term: "amphore",
          text: "Le grand vase dans lequel l'huile, le vin et la sauce de poisson voyageaient par mer.",
        },
        { term: "suffète", text: "Le magistrat en chef de Carthage, élu par ses citoyens." },
        {
          term: "tophèt",
          text: "L'enceinte sacrée de Carthage dont les sépultures sont encore discutées.",
        },
      ],
    },
  },
  questions: [
    {
      question: "Which people from the eastern Mediterranean founded Carthage in the 9th century BC?",
      options: ["Greeks", "Phoenicians", "Romans", "Persians"],
      correct: 1,
      fact: "Carthage was founded by traders from Tyre, in today's Lebanon, and grew into the greatest sea power of the western Mediterranean.",
      source: { label: "Encyclopaedia Britannica, \"Carthage\"" },
    },
    {
      question: "Which Carthaginian general crossed the Alps with war elephants to attack Rome in 218 BC?",
      options: ["Hannibal", "Scipio", "Hamilcar", "Masinissa"],
      correct: 0,
      fact: "Hannibal marched from Spain through the Alps and won battle after battle in Italy, but he never managed to take Rome itself.",
      source: { label: "Encyclopaedia Britannica, \"Hannibal\"" },
    },
    {
      question: "In which year did Rome destroy Carthage at the end of the Punic Wars?",
      options: ["146 BC", "100 BC", "44 BC", "476 AD"],
      correct: 0,
      fact: "Rome razed the city in 146 BC and sold its inhabitants into slavery, then rebuilt a Roman Carthage on the same site a century later.",
      source: {
        label: "UNESCO World Heritage List, Archaeological Site of Carthage",
        url: "https://whc.unesco.org/en/list/37/",
      },
    },
    {
      question: "Which king of Numidia united the Berber tribes and ruled for more than fifty years?",
      options: ["Masinissa", "Jugurtha", "Septimius Severus", "Augustine"],
      correct: 0,
      fact: "Masinissa first fought Carthage, then allied with Rome, and his kingdom produced much of the grain that fed the empire.",
      source: { label: "Encyclopaedia Britannica, \"Masinissa\"" },
    },
    {
      question: "Which Numidian king fought a long war against Rome between 111 and 105 BC?",
      options: ["Jugurtha", "Masinissa", "Hannibal", "Syphax"],
      correct: 0,
      fact: "Jugurtha's guerrilla war forced Rome to reform its army, and the historian Sallust wrote a famous book about the conflict.",
      source: { label: "Encyclopaedia Britannica, \"Jugurtha\"" },
    },
    {
      question: "Which Roman emperor, born in Leptis Magna in today's Libya, ruled from 193 to 211?",
      options: ["Septimius Severus", "Trajan", "Hadrian", "Augustus"],
      correct: 0,
      fact: "Septimius Severus was of Berber and Italian descent and remains the only African to have ruled the whole Roman Empire.",
      source: { label: "Encyclopaedia Britannica, \"Septimius Severus\"" },
    },
    {
      question: "Which Berber bishop of North Africa wrote The City of God and is one of the most influential Christian writers?",
      options: ["Augustine", "Tertullian", "Cyprian", "Athanasius"],
      correct: 0,
      fact: "Augustine was bishop of Hippo, in today's Algeria, and he died while the Vandals were besieging the city in 430.",
      source: { label: "Encyclopaedia Britannica, \"St. Augustine\"" },
    },
    {
      question: "What do we call the indigenous peoples of North Africa, whose languages are still spoken today?",
      options: ["The Amazigh, also called Berbers", "The Swahili", "The Bantu", "The Oromo"],
      correct: 0,
      fact: "Amazigh means free people, and Amazigh languages are spoken from the Siwa oasis in Egypt to the Atlas mountains and the Sahel.",
      source: { label: "Encyclopaedia Britannica, \"Berber\"" },
    },
    {
      question: "What was the main language of Carthage and its trading colonies?",
      options: ["Punic", "Latin", "Greek", "Coptic"],
      correct: 0,
      fact: "Punic was a Phoenician language, and it survived in North Africa for centuries after Rome destroyed the city.",
      source: { label: "Encyclopaedia Britannica, \"Punic language\"" },
    },
    {
      question: "Which queen of Carthage is remembered in Virgil's Aeneid as guiding the city's founding?",
      options: ["Dido", "Cleopatra", "Zenobia", "Amanirenas"],
      correct: 0,
      fact: "Dido, also called Elissa, was said to have led the founding of Carthage, and her story became one of the best known of the ancient world.",
      source: { label: "Encyclopaedia Britannica, \"Dido\"" },
    },
    {
      question: "Which city in today's Lebanon was the mother city of Carthage?",
      options: ["Tyre", "Byblos", "Sidon", "Ugarit"],
      correct: 0,
      fact: "Carthage was founded by settlers from Tyre, and the new city kept the Phoenician language and trading habits of its homeland.",
      source: { label: "Encyclopaedia Britannica, \"Tyre\"" },
    },
    {
      question: "Which battle of 202 BC ended the Second Punic War in Rome's favour?",
      options: ["Zama", "Cannae", "Actium", "Alesia"],
      correct: 0,
      fact: "At Zama, Scipio Africanus defeated Hannibal, and Carthage lost its fleet and its empire outside Africa.",
      source: { label: "Encyclopaedia Britannica, \"Battle of Zama\"" },
    },
    {
      question: "Before the wars with Rome, what made Carthage one of the richest cities of the Mediterranean?",
      options: ["Trade by sea", "Silver mines in Italy", "Grain from Egypt", "Tribute from Greece"],
      correct: 0,
      fact: "Carthaginian ships carried wine, oil, pottery and metals between Spain, Sicily, Sardinia and the African coast.",
      source: { label: "Encyclopaedia Britannica, \"Carthage\"" },
    },
    {
      question: "Which Roman province covered roughly the land of today's Tunisia?",
      options: ["Africa Proconsularis", "Numidia", "Mauretania", "Cyrenaica"],
      correct: 0,
      fact: "Rome made the land around Carthage the province of Africa, and its grain fed the city of Rome for centuries.",
      source: { label: "Encyclopaedia Britannica, \"Africa, Roman province of\"" },
    },
    {
      question: "Which king of Mauretania, educated in Rome, ruled as a Roman ally and wrote books on history?",
      options: ["Juba II", "Masinissa", "Jugurtha", "Syphax"],
      correct: 0,
      fact: "Juba II ruled Mauretania from the city of Iol, renamed Caesarea, and his court was a centre of learning in the Roman world.",
      source: { label: "Encyclopaedia Britannica, \"Juba II\"" },
    },
    {
      question: "What was the name of the walled inner basin where Carthage kept its warships?",
      options: ["The cothon", "The emporium", "The agora", "The casbah"],
      correct: 0,
      fact: "The cothon held two hundred warships in its rings, and the outline of the harbour can still be traced on the coast of Tunis.",
      source: { label: "Encyclopaedia Britannica, \"Carthage\"" },
    },
    {
      question: "Which tree, still grown across Tunisia, supplied the oil that Carthage traded?",
      options: ["The olive", "The date palm", "The fig", "The cork oak"],
      correct: 0,
      fact: "Olive groves covered the Carthaginian countryside, and Rome took over the same estates and the same trade after the city fell.",
      source: { label: "Encyclopaedia Britannica, \"Carthage\"" },
    },
    {
      question: "Which Numidian king, the father of Juba II, was defeated by Caesar at Thapsus in 46 BC?",
      options: ["Juba I", "Masinissa", "Jugurtha", "Syphax"],
      correct: 0,
      fact: "Juba I backed the losing side in the Roman civil war, and his kingdom was made a province after his defeat.",
      source: { label: "Encyclopaedia Britannica, \"Juba I\"" },
    },
    {
      question: "Which Carthaginian general in Spain was Hannibal's father?",
      options: ["Hamilcar Barca", "Hasdrubal", "Hanno", "Mago"],
      correct: 0,
      fact: "Hamilcar Barca built the Carthaginian empire in Spain, and his son Hannibal inherited both the army and the quarrel with Rome.",
      source: { label: "Encyclopaedia Britannica, \"Hamilcar Barca\"" },
    },
    {
      question: "Which writer of Roman Africa, author of the Metamorphoses, was born in the region?",
      options: ["Apuleius", "Augustine", "Tertullian", "Cyprian"],
      correct: 0,
      fact: "Apuleius was born at Madauros in today's Algeria and studied in Carthage and Athens, and his novel is the only Latin one to survive whole.",
      source: { label: "Encyclopaedia Britannica, \"Apuleius\"" },
    },
    {
      question: "Which Roman town in today's Tunisia is famous for its amphitheatre, which held about thirty thousand people?",
      options: ["El Jem", "Dougga", "Carthage", "Leptis Magna"],
      correct: 0,
      fact: "The amphitheatre of El Jem was built into a hillside, and its walls are among the tallest Roman structures in Africa.",
      source: { label: "Encyclopaedia Britannica, \"El Jem\"" },
    },
  ],
  fr: {
    title: "Carthage et l'Afrique du Nord antique",
    subtitle: "La rivale de Rome",
    region: "Afrique du Nord",
    questions: [
      {
        question: "Quel peuple de la Méditerranée orientale a fondé Carthage au IXe siècle avant notre ère ?",
        options: ["Les Grecs", "Les Phéniciens", "Les Romains", "Les Perses"],
        fact: "Carthage a été fondée par des marchands de Tyr, dans l'actuel Liban, et elle est devenue la première puissance maritime de la Méditerranée occidentale.",
        source: "Encyclopaedia Britannica, notice « Carthage »",
      },
      {
        question: "Quel général carthaginois a traversé les Alpes avec des éléphants de guerre pour attaquer Rome en 218 avant notre ère ?",
        options: ["Hannibal", "Scipion", "Hamilcar", "Massinissa"],
        fact: "Hannibal est parti d'Espagne, a franchi les Alpes et a gagné bataille sur bataille en Italie, sans jamais réussir à prendre Rome.",
        source: "Encyclopaedia Britannica, notice « Hannibal »",
      },
      {
        question: "En quelle année Rome a-t-elle détruit Carthage, à la fin des guerres puniques ?",
        options: ["146 av. J.-C.", "100 av. J.-C.", "44 av. J.-C.", "476 apr. J.-C."],
        fact: "Rome a rasé la ville en 146 avant notre ère et vendu ses habitants comme esclaves, puis a reconstruit une Carthage romaine au même endroit un siècle plus tard.",
        source: "Liste du patrimoine mondial de l'UNESCO, Site archéologique de Carthage",
      },
      {
        question: "Quel roi de Numidie a uni les tribus berbères et régné plus de cinquante ans ?",
        options: ["Massinissa", "Jugurtha", "Septime Sévère", "Augustin"],
        fact: "Massinissa a d'abord combattu Carthage, puis s'est allié à Rome, et son royaume a produit une grande partie du blé qui nourrissait l'empire.",
        source: "Encyclopaedia Britannica, notice « Masinissa »",
      },
      {
        question: "Quel roi numide a mené une longue guerre contre Rome entre 111 et 105 avant notre ère ?",
        options: ["Jugurtha", "Massinissa", "Hannibal", "Syphax"],
        fact: "La guérilla de Jugurtha a forcé Rome à réformer son armée, et l'historien Salluste a écrit un livre célèbre sur ce conflit.",
        source: "Encyclopaedia Britannica, notice « Jugurtha »",
      },
      {
        question: "Quel empereur romain, né à Leptis Magna dans l'actuelle Libye, a régné de 193 à 211 ?",
        options: ["Septime Sévère", "Trajan", "Hadrien", "Auguste"],
        fact: "Septime Sévère était d'ascendance berbère et italienne, et il reste le seul Africain à avoir gouverné l'ensemble de l'Empire romain.",
        source: "Encyclopaedia Britannica, notice « Septimius Severus »",
      },
      {
        question: "Quel évêque berbère d'Afrique du Nord a écrit La Cité de Dieu et compte parmi les écrivains chrétiens les plus influents ?",
        options: ["Augustin", "Tertullien", "Cyprien", "Athanase"],
        fact: "Augustin était évêque d'Hippone, dans l'actuelle Algérie, et il est mort pendant le siège de la ville par les Vandales en 430.",
        source: "Encyclopaedia Britannica, notice « St. Augustine »",
      },
      {
        question: "Comment appelle-t-on les peuples autochtones d'Afrique du Nord, dont les langues se parlent encore aujourd'hui ?",
        options: ["Les Amazighs, aussi appelés Berbères", "Les Swahili", "Les Bantous", "Les Oromos"],
        fact: "Amazigh signifie peuple libre, et les langues amazighes se parlent de l'oasis de Siwa en Égypte jusqu'à l'Atlas et au Sahel.",
        source: "Encyclopaedia Britannica, notice « Berber »",
      },
      {
        question: "Quelle était la principale langue de Carthage et de ses colonies commerçantes ?",
        options: ["Le punique", "Le latin", "Le grec", "Le copte"],
        fact: "Le punique était une langue phénicienne, et il a survécu en Afrique du Nord des siècles après la destruction de la ville par Rome.",
        source: "Encyclopaedia Britannica, notice « Punic language »",
      },
      {
        question: "Quelle reine de Carthage est célébrée dans l'Énéide de Virgile ?",
        options: ["Didon", "Cléopâtre", "Zénobie", "Amanirenas"],
        fact: "Didon, aussi appelée Élissa, aurait guidé la fondation de Carthage, et son histoire est devenue l'une des plus connues de l'Antiquité.",
        source: "Encyclopaedia Britannica, notice « Dido »",
      },
      {
        question: "Quelle ville du Liban actuel était la cité mère de Carthage ?",
        options: ["Tyr", "Byblos", "Sidon", "Ougarit"],
        fact: "Carthage a été fondée par des colons venus de Tyr, et la nouvelle cité a gardé la langue phénicienne et les habitudes commerciales de sa patrie.",
        source: "Encyclopaedia Britannica, notice « Tyre »",
      },
      {
        question: "Quelle bataille de 202 av. J.-C. a mis fin à la deuxième guerre punique au profit de Rome ?",
        options: ["Zama", "Cannes", "Actium", "Alésia"],
        fact: "À Zama, Scipion l'Africain a vaincu Hannibal, et Carthage a perdu sa flotte et son empire hors d'Afrique.",
        source: "Encyclopaedia Britannica, notice « Battle of Zama »",
      },
      {
        question: "Avant les guerres contre Rome, qu'est-ce qui faisait de Carthage l'une des villes les plus riches de la Méditerranée ?",
        options: ["Le commerce maritime", "Des mines d'argent en Italie", "Le blé d'Égypte", "Le tribut de la Grèce"],
        fact: "Les navires carthaginois transportaient vin, huile, poteries et métaux entre l'Espagne, la Sicile, la Sardaigne et la côte africaine.",
        source: "Encyclopaedia Britannica, notice « Carthage »",
      },
      {
        question: "Quelle province romaine correspondait à peu près au territoire de la Tunisie actuelle ?",
        options: ["L'Afrique proconsulaire", "La Numidie", "La Maurétanie", "La Cyrénaïque"],
        fact: "Rome a fait de la région de Carthage la province d'Afrique, et son blé a nourri la ville de Rome pendant des siècles.",
        source: "Encyclopaedia Britannica, notice « Africa, Roman province of »",
      },
      {
        question: "Quel roi de Maurétanie, éduqué à Rome, régnait comme allié des Romains et écrivait des ouvrages d'histoire ?",
        options: ["Juba II", "Massinissa", "Jugurtha", "Syphax"],
        fact: "Juba II régnait sur la Maurétanie depuis Iol, rebaptisée Césarée, et sa cour était un foyer de savoir du monde romain.",
        source: "Encyclopaedia Britannica, notice « Juba II »",
      },
      {
        question: "Comment s'appelait le bassin intérieur fortifié où Carthage gardait ses navires de guerre ?",
        options: ["Le cothon", "L'emporion", "L'agora", "La casbah"],
        fact: "Le cothon abritait deux cents navires de guerre dans ses anneaux, et le tracé du port se devine encore sur la côte de Tunis.",
        source: "Encyclopaedia Britannica, notice « Carthage »",
      },
      {
        question: "Quel arbre, encore cultivé dans toute la Tunisie, fournissait l'huile que Carthage commerçait ?",
        options: ["L'olivier", "Le palmier dattier", "Le figuier", "Le chêne-liège"],
        fact: "Les oliveraies couvraient la campagne carthaginoise, et Rome a repris les mêmes domaines et le même commerce après la chute de la ville.",
        source: "Encyclopaedia Britannica, notice « Carthage »",
      },
      {
        question: "Quel roi numide, père de Juba II, a été vaincu par César à Thapsus en 46 av. J.-C. ?",
        options: ["Juba Ier", "Massinissa", "Jugurtha", "Syphax"],
        fact: "Juba Ier avait pris le parti perdant de la guerre civile romaine, et son royaume est devenu une province après sa défaite.",
        source: "Encyclopaedia Britannica, notice « Juba I »",
      },
      {
        question: "Quel général carthaginois d'Espagne était le père d'Hannibal ?",
        options: ["Hamilcar Barca", "Hasdrubal", "Hannon", "Magon"],
        fact: "Hamilcar Barca a bâti l'empire carthaginois en Espagne, et son fils Hannibal a hérité de l'armée comme du différend avec Rome.",
        source: "Encyclopaedia Britannica, notice « Hamilcar Barca »",
      },
      {
        question: "Quel écrivain d'Afrique romaine, auteur des Métamorphoses, est né dans la région ?",
        options: ["Apulée", "Augustin", "Tertullien", "Cyprien"],
        fact: "Apulée est né à Madauros, dans l'Algérie actuelle, il a étudié à Carthage et à Athènes, et son roman est le seul roman latin conservé en entier.",
        source: "Encyclopaedia Britannica, notice « Apuleius »",
      },
      {
        question: "Quelle ville romaine de la Tunisie actuelle est célèbre pour son amphithéâtre, qui accueillait environ trente mille personnes ?",
        options: ["El Jem", "Dougga", "Carthage", "Leptis Magna"],
        fact: "L'amphithéâtre d'El Jem est adossé à une colline, et ses murs comptent parmi les plus hautes constructions romaines d'Afrique.",
        source: "Encyclopaedia Britannica, notice « El Jem »",
      },
    ],
  },
};
