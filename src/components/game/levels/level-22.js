/**
 * Madagascar: one level of the game, on its own.
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
  id: 22,
  order: 8,
  era: "medieval",
  from: 500,
  title: "Madagascar",
  subtitle: "An island between two oceans",
  region: "Indian Ocean",
  color: "from-lime-500 to-green-700",
  icon: Gem,
  gallery: {
    en: [
      {
        file: "/photos/level-22-1.jpg",
        caption: "The avenue of the baobabs near Morondava, the trees that grow only on the island.",
        credit: "Cactus0625 · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Cactus0625",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:All%C3%A9e_des_baobabs_Morondava_Madagascar.jpg",
      },
      {
        file: "/photos/level-22-2.jpg",
        caption: "The royal enclosure on the hill of Ambohimanga, the World Heritage hill of the Merina kings.",
        credit: "Lemurbaby · CC BY-SA 3.0 · Wikimedia Commons",
        author: "Lemurbaby",
        licence: "CC BY-SA 3.0",
        source: "https://commons.wikimedia.org/wiki/File:Madagascar_Rova_of_Ambohimanga_Nanjakana_compound.jpg",
      },
      {
        file: "/photos/level-22-3.jpg",
        caption: "A zebu market in the highlands, where cattle measure a family's wealth.",
        credit: "JialiangGao · CC BY-SA 4.0 · Wikimedia Commons",
        author: "JialiangGao",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Zebu_Market_Ambalavao_Madagascar.jpg",
      },
    ],
    fr: [
      {
        file: "/photos/level-22-1.jpg",
        caption: "L'allée des baobabs près de Morondava, ces arbres qui ne poussent que sur l'île.",
        credit: "Cactus0625 · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Cactus0625",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:All%C3%A9e_des_baobabs_Morondava_Madagascar.jpg",
      },
      {
        file: "/photos/level-22-2.jpg",
        caption: "L'enceinte royale de la colline d'Ambohimanga, site du patrimoine mondial des rois mérinas.",
        credit: "Lemurbaby · CC BY-SA 3.0 · Wikimedia Commons",
        author: "Lemurbaby",
        licence: "CC BY-SA 3.0",
        source: "https://commons.wikimedia.org/wiki/File:Madagascar_Rova_of_Ambohimanga_Nanjakana_compound.jpg",
      },
      {
        file: "/photos/level-22-3.jpg",
        caption: "Un marché de zébus sur les hauts plateaux, où le bétail mesure la richesse d'une famille.",
        credit: "JialiangGao · CC BY-SA 4.0 · Wikimedia Commons",
        author: "JialiangGao",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Zebu_Market_Ambalavao_Madagascar.jpg",
      },
    ],
  },
  study: {
    en: {
      essay: ["Madagascar was settled around 500 AD by sailors from the Indonesian archipelago, who crossed the Indian Ocean in outrigger canoes. They brought the banana, the taro and their language, and the Malagasy spoken today is closest to the languages of Borneo.", "Farmers speaking Bantu languages followed from the mainland and brought cattle, and the island became a land of rice fields in the highlands and herds on the plains. The zebu became the measure of a family's wealth, while the lemur and the baobab were found nowhere else on earth.", "The Merina kingdom of the central highlands, united by Andrianampoinimerina at the end of the eighteenth century, made Antananarivo its capital. His son Radama I opened the island to European missions and trade, and Ranavalona I then ruled for more than thirty years, keeping foreigners at a distance.", "France invaded in 1895 and abolished the monarchy in 1896, and the island stayed a colony until 1960. The royal hill of Ambohimanga and the memory of the Merina kings remain, and families still gather for the famadihana to wrap their ancestors in new cloth."],
      timeline: [
        { year: "c. 500", text: "Sailors from Indonesia reach Madagascar in outrigger canoes." },
        { year: "c. 800", text: "Bantu speaking farmers raise cattle and grow crops on the island." },
        { year: "c. 1600", text: "The Sakalava kingdoms of the west coast trade with foreign ships." },
        { year: "1787", text: "Andrianampoinimerina unites the Merina highlands." },
        { year: "1810", text: "Radama I opens the island to European missions and trade." },
        {
          year: "1828",
          text: "Ranavalona I begins her long reign and closes the island to foreigners.",
        },
        { year: "1896", text: "France abolishes the Merina monarchy and makes the island a colony." },
      ],
      people: [
        {
          name: "Andrianampoinimerina",
          text: "The Merina king who joined the highland princedoms and founded the kingdom.",
        },
        {
          name: "Radama I",
          text: "His son, who opened the island to European missions, schools and trade.",
        },
        {
          name: "Ranavalona I",
          text: "The queen who ruled for more than thirty years and kept foreigners at a distance.",
        },
        {
          name: "Rainilaiarivony",
          text: "The prime minister who governed with the last queens of the Merina kingdom for decades.",
        },
        { name: "Ranavalona III", text: "The last queen of Madagascar, deposed by the French in 1897." },
      ],
      places: [
        {
          name: "Antananarivo",
          text: "The Merina capital on the highlands, still the capital of Madagascar.",
        },
        {
          name: "Ambohimanga",
          text: "The royal hill of the Merina kings, a World Heritage Site above the capital.",
        },
        {
          name: "The central highlands",
          text: "The rice growing heart of the island, home of the Merina kingdom.",
        },
        {
          name: "The Mozambique Channel",
          text: "The sea between the island and the mainland, crossed by traders and settlers.",
        },
        {
          name: "Ile Sainte-Marie",
          text: "The island off the east coast used by European ships on the route to India.",
        },
      ],
      glossary: [
        { term: "famadihana", text: "The turning and rewrapping of the ancestors' bones in new cloth." },
        {
          term: "Merina",
          text: "The people of the central highlands, whose kings ruled most of the island.",
        },
        {
          term: "zebu",
          text: "Humped cattle brought from the mainland, the measure of wealth on the island.",
        },
        { term: "baobab", text: "The vast trunked tree that stores water, a symbol of Madagascar." },
        {
          term: "Austronesian",
          text: "The language family of Southeast Asia to which Malagasy belongs.",
        },
      ],
    },
    fr: {
      essay: ["Madagascar a été peuplée vers 500 apr. J.-C. par des marins de l'archipel indonésien, qui ont traversé l'océan Indien en pirogue à balancier. Ils ont apporté la banane, le taro et leur langue, et le malgache actuel est le plus proche des langues de Bornéo.", "Des agriculteurs de langue bantoue ont suivi depuis le continent et ont apporté le bétail, et l'île est devenue une terre de rizières sur les hauts plateaux et de troupeaux sur les plaines. Le zébu est devenu la mesure de la richesse d'une famille, tandis que le lémurien et le baobab ne se trouvaient nulle part ailleurs.", "Le royaume mérina des hauts plateaux, unifié par Andrianampoinimerina à la fin du XVIIIe siècle, a fait d'Antananarivo sa capitale. Son fils Radama Ier a ouvert l'île aux missions et au commerce européens, puis Ranavalona Ire a régné plus de trente ans en tenant les étrangers à distance.", "La France a envahi l'île en 1895 et aboli la monarchie en 1896, et l'île est restée une colonie jusqu'en 1960. La colline royale d'Ambohimanga et le souvenir des rois mérinas demeurent, et les familles se réunissent encore pour le famadihana et enveloppent leurs ancêtres dans un drap neuf."],
      timeline: [
        { year: "v. 500", text: "Des marins d'Indonésie atteignent Madagascar en pirogue à balancier." },
        { year: "v. 800", text: "Des agriculteurs bantous élèvent du bétail et cultivent l'île." },
        {
          year: "v. 1600",
          text: "Les royaumes sakalavas de la côte ouest commercent avec les navires étrangers.",
        },
        { year: "1787", text: "Andrianampoinimerina unifie les hauts plateaux mérinas." },
        { year: "1810", text: "Radama Ier ouvre l'île aux missions et au commerce européens." },
        { year: "1828", text: "Ranavalona Ire commence son long règne et ferme l'île aux étrangers." },
        { year: "1896", text: "La France abolit la monarchie mérina et fait de l'île une colonie." },
      ],
      people: [
        {
          name: "Andrianampoinimerina",
          text: "Le roi mérina qui a réuni les principautés des hauts plateaux et fondé le royaume.",
        },
        {
          name: "Radama Ier",
          text: "Son fils, qui a ouvert l'île aux missions, aux écoles et au commerce européens.",
        },
        {
          name: "Ranavalona Ire",
          text: "La reine qui a régné plus de trente ans en tenant les étrangers à distance.",
        },
        {
          name: "Rainilaiarivony",
          text: "Le premier ministre qui a gouverné avec les dernières reines mérinas pendant des décennies.",
        },
        {
          name: "Ranavalona III",
          text: "La dernière reine de Madagascar, déposée par les Français en 1897.",
        },
      ],
      places: [
        {
          name: "Antananarivo",
          text: "La capitale mérina des hauts plateaux, toujours capitale de Madagascar.",
        },
        {
          name: "Ambohimanga",
          text: "La colline royale des rois mérinas, site du patrimoine mondial au-dessus de la capitale.",
        },
        { name: "Les hauts plateaux", text: "Le cœur rizicole de l'île, patrie du royaume mérina." },
        {
          name: "Le canal du Mozambique",
          text: "La mer entre l'île et le continent, traversée par les marchands et les colons.",
        },
        {
          name: "Ile Sainte-Marie",
          text: "L'île de la côte est utilisée par les navires européens de la route des Indes.",
        },
      ],
      glossary: [
        {
          term: "famadihana",
          text: "Le retournement et le réenveloppement des ossements des ancêtres dans un drap neuf.",
        },
        {
          term: "Mérina",
          text: "Le peuple des hauts plateaux du centre, dont les rois ont régné sur presque toute l'île.",
        },
        { term: "zébu", text: "Le bétail à bosse venu du continent, mesure de la richesse sur l'île." },
        { term: "baobab", text: "L'arbre au tronc immense qui stocke l'eau, un symbole de Madagascar." },
        {
          term: "austronésien",
          text: "La famille des langues d'Asie du Sud-Est à laquelle appartient le malgache.",
        },
      ],
    },
  },
  questions: [
    {
      question: "Where did the first settlers of Madagascar come from, more than a thousand years ago?",
      options: ["The islands of Southeast Asia", "The east coast of Africa", "The Arabian peninsula", "The Indian subcontinent"],
      correct: 0,
      fact: "Sailors from the Indonesian archipelago crossed the Indian Ocean in outrigger canoes and reached Madagascar around 500 AD.",
      source: { label: "Encyclopaedia Britannica, \"Madagascar\"" },
    },
    {
      question: "Which kind of boat carried the first settlers across the Indian Ocean?",
      options: ["The outrigger canoe", "The dhow", "The trireme", "The caravel"],
      correct: 0,
      fact: "An outrigger canoe steadies itself with a float held out on a spar, a design carried from Indonesia across the ocean.",
      source: { label: "Encyclopaedia Britannica, \"outrigger\"" },
    },
    {
      question: "Which language spoken in Madagascar shows its Southeast Asian origin?",
      options: ["Malagasy", "Swahili", "Amharic", "Somali"],
      correct: 0,
      fact: "Malagasy belongs to the Austronesian family, and its closest relatives are spoken on Borneo in Indonesia.",
      source: { label: "Encyclopaedia Britannica, \"Malagasy languages\"" },
    },
    {
      question: "Which staple crop did the people of the highlands grow in flooded fields?",
      options: ["Rice", "Maize", "Wheat", "Barley"],
      correct: 0,
      fact: "Wet rice was grown in terraced and flooded fields, and it remains the food at the centre of the Malagasy meal.",
      source: { label: "Encyclopaedia Britannica, \"rice\"" },
    },
    {
      question: "Which humped cattle, brought from the mainland, became a measure of wealth on the island?",
      options: ["The zebu", "The Ankole", "The Nguni", "The Sanga"],
      correct: 0,
      fact: "Zebu cattle were both farmed and raided, and a herd was the surest sign of a family's standing.",
      source: { label: "Encyclopaedia Britannica, \"zebu\"" },
    },
    {
      question: "Which animal lives only on Madagascar and its neighbouring islands?",
      options: ["The lemur", "The zebra", "The gorilla", "The camel"],
      correct: 0,
      fact: "Lemurs evolved only on Madagascar, cut off from the mainland, and more than a hundred kinds are known.",
      source: { label: "Encyclopaedia Britannica, \"lemur\"" },
    },
    {
      question: "Which tree with a vast trunk is a symbol of Madagascar?",
      options: ["The baobab", "The acacia", "The cedar", "The olive"],
      correct: 0,
      fact: "The baobab stores water in its trunk, and several kinds of it grow only on Madagascar and nearby.",
      source: { label: "Encyclopaedia Britannica, \"baobab\"" },
    },
    {
      question: "Which kingdom of the central highlands built its capital at Antananarivo?",
      options: ["The Merina kingdom", "The Sakalava kingdom", "The Betsimisaraka kingdom", "The Boina kingdom"],
      correct: 0,
      fact: "The Merina kingdom grew in the highlands and made Antananarivo, the city of a thousand, its capital.",
      source: { label: "Encyclopaedia Britannica, \"Merina\"" },
    },
    {
      question: "Which Merina king united the highlands at the end of the eighteenth century?",
      options: ["Andrianampoinimerina", "Radama I", "Ranavalona I", "Andriamanelo"],
      correct: 0,
      fact: "Andrianampoinimerina joined the Merina princedoms and began the expansion his son Radama I carried on.",
      source: { label: "Encyclopaedia Britannica, \"Andrianampoinimerina\"" },
    },
    {
      question: "Which Merina queen ruled for more than thirty years and kept European powers at a distance?",
      options: ["Ranavalona I", "Ranavalona III", "Rasoherina", "Ranavalona II"],
      correct: 0,
      fact: "Ranavalona I ruled from 1828 to 1861 and resisted foreign missions and settlement on the island.",
      source: { label: "Encyclopaedia Britannica, \"Ranavalona I\"" },
    },
    {
      question: "Which hill of the Merina kings, near Antananarivo, is a World Heritage Site?",
      options: ["Ambohimanga", "Antongona", "Ambondrombe", "Isalo"],
      correct: 0,
      fact: "The royal hill of Ambohimanga holds the tombs and the enclosure of the Merina kings and is a place of pilgrimage.",
      source: {
        label: "UNESCO World Heritage List, Royal Hill of Ambohimanga",
        url: "https://whc.unesco.org/en/list/950/",
      },
    },
    {
      question: "In which year did French troops take Antananarivo and end the Merina monarchy?",
      options: ["1896", "1879", "1914", "1840"],
      correct: 0,
      fact: "France invaded in 1895 and abolished the monarchy in 1896, and the island became a French colony.",
      source: { label: "Encyclopaedia Britannica, \"Madagascar\"" },
    },
    {
      question: "Which kingdom of the west coast traded with Arab and European ships?",
      options: ["The Sakalava kingdom", "The Merina kingdom", "The Betsimisaraka kingdom", "The Antemoro kingdom"],
      correct: 0,
      fact: "The Sakalava kingdoms of the west coast grew rich on the trade of their ports, captives and cattle among it.",
      source: { label: "Encyclopaedia Britannica, \"Sakalava\"" },
    },
    {
      question: "Which confederation of the east coast was founded in the eighteenth century?",
      options: ["The Betsimisaraka", "The Imerina", "The Boina", "The Antemoro"],
      correct: 0,
      fact: "The Betsimisaraka confederation united the peoples of the east coast against slave raiders and foreign traders.",
      source: { label: "Encyclopaedia Britannica, \"Betsimisaraka\"" },
    },
    {
      question: "Which precious pod, grown on the island, became a leading export?",
      options: ["Vanilla", "Pepper", "Cinnamon", "Cloves"],
      correct: 0,
      fact: "Vanilla was introduced in the nineteenth century, and Madagascar became one of the largest producers in the world.",
      source: { label: "Encyclopaedia Britannica, \"vanilla\"" },
    },
    {
      question: "Which people are remembered in tradition as the earliest inhabitants of the island?",
      options: ["The Vazimba", "The Merina", "The Sakalava", "The Antandroy"],
      correct: 0,
      fact: "The Vazimba are remembered in Malagasy tradition as the first people of the interior, before the Merina kings.",
      source: { label: "Encyclopaedia Britannica, \"Madagascar\"" },
    },
    {
      question: "Why did European ships stop at Madagascar on the way to India?",
      options: ["To take on food and water", "To mine for gold", "To buy silk", "To build shipyards"],
      correct: 0,
      fact: "The island lay on the route round the Cape to India, and its ports supplied ships with rice, cattle and water.",
      source: { label: "Encyclopaedia Britannica, \"Madagascar\"" },
    },
    {
      question: "Which ceremony of turning and rewrapping the bones of the dead is practised in the highlands?",
      options: ["Famadihana", "Fitampoha", "Fandroana", "Sambatra"],
      correct: 0,
      fact: "At famadihana families open the tomb, wrap the remains in new cloth and celebrate their ancestors.",
      source: { label: "Encyclopaedia Britannica, \"famadihana\"" },
    },
    {
      question: "Which mostly dry part of the island is the home of the Antandroy?",
      options: ["The south", "The central highlands", "The east coast", "The far north"],
      correct: 0,
      fact: "The arid south, the home of the Antandroy, is the driest part of Madagascar and has shaped its own way of life.",
      source: { label: "Encyclopaedia Britannica, \"Antandroy\"" },
    },
    {
      question: "Which crop from the Americas, carried by the same ships, became a food of the island?",
      options: ["Cassava", "Rice", "Sorghum", "Millet"],
      correct: 0,
      fact: "Cassava arrived from the Americas in the Atlantic trade and spread across the island as a crop that survives drought.",
      source: { label: "Encyclopaedia Britannica, \"cassava\"" },
    },
    {
      question: "What did Madagascar become after the French abolished the Merina monarchy?",
      options: ["A French colony", "A British protectorate", "An independent kingdom", "A German territory"],
      correct: 0,
      fact: "After 1896 the island was ruled from Paris as a colony until it became independent in 1960.",
      source: { label: "Encyclopaedia Britannica, \"Madagascar\"" },
    },
  ],
  fr: {
    title: "Madagascar, la Grande Île",
    subtitle: "Une île entre deux océans",
    region: "Océan Indien",
    questions: [
      {
        question: "D'où venaient les premiers habitants de Madagascar, il y a plus de mille ans ?",
        options: ["Des îles d'Asie du Sud-Est", "De la côte est de l'Afrique", "De la péninsule Arabique", "Du sous-continent indien"],
        fact: "Des marins de l'archipel indonésien ont traversé l'océan Indien en pirogue à balancier et ont atteint Madagascar vers 500 apr. J.-C.",
        source: "Encyclopaedia Britannica, notice « Madagascar »",
      },
      {
        question: "Quel type de bateau a porté les premiers habitants à travers l'océan Indien ?",
        options: ["La pirogue à balancier", "Le boutre", "La trirème", "La caravelle"],
        fact: "La pirogue à balancier se stabilise grâce à un flotteur tenu par un espar, une conception venue d'Indonésie.",
        source: "Encyclopaedia Britannica, notice « outrigger »",
      },
      {
        question: "Quelle langue parlée à Madagascar montre son origine sud-est asiatique ?",
        options: ["Le malgache", "Le swahili", "L'amharique", "Le somali"],
        fact: "Le malgache appartient à la famille austronésienne, et ses plus proches parents sont parlés à Bornéo, en Indonésie.",
        source: "Encyclopaedia Britannica, notice « Malagasy languages »",
      },
      {
        question: "Quelle culture de base les habitants des hauts plateaux faisaient-ils pousser dans des champs inondés ?",
        options: ["Le riz", "Le maïs", "Le blé", "L'orge"],
        fact: "Le riz irrigué était cultivé dans des champs en terrasses et inondés, et il reste au centre du repas malgache.",
        source: "Encyclopaedia Britannica, notice « rice »",
      },
      {
        question: "Quel bétail à bosse, venu du continent, est devenu une mesure de richesse sur l'île ?",
        options: ["Le zébu", "L'ankolé", "Le nguni", "Le sanga"],
        fact: "Les zébus étaient à la fois élevés et razziés, et un troupeau était le signe le plus sûr de la position d'une famille.",
        source: "Encyclopaedia Britannica, notice « zebu »",
      },
      {
        question: "Quel animal ne vit qu'à Madagascar et dans les îles voisines ?",
        options: ["Le lémurien", "Le zèbre", "Le gorille", "Le chameau"],
        fact: "Les lémuriens n'ont évolué qu'à Madagascar, coupée du continent, et plus de cent espèces sont connues.",
        source: "Encyclopaedia Britannica, notice « lemur »",
      },
      {
        question: "Quel arbre au tronc immense est un symbole de Madagascar ?",
        options: ["Le baobab", "L'acacia", "Le cèdre", "L'olivier"],
        fact: "Le baobab stocke l'eau dans son tronc, et plusieurs de ses espèces ne poussent qu'à Madagascar et alentour.",
        source: "Encyclopaedia Britannica, notice « baobab »",
      },
      {
        question: "Quel royaume des hauts plateaux avait sa capitale à Antananarivo ?",
        options: ["Le royaume mérina", "Le royaume sakalava", "Le royaume betsimisaraka", "Le royaume boina"],
        fact: "Le royaume mérina s'est développé sur les hauts plateaux et a fait d'Antananarivo, la ville des mille, sa capitale.",
        source: "Encyclopaedia Britannica, notice « Merina »",
      },
      {
        question: "Quel roi mérina a unifié les hauts plateaux à la fin du XVIIIe siècle ?",
        options: ["Andrianampoinimerina", "Radama Ier", "Ranavalona Ire", "Andriamanelo"],
        fact: "Andrianampoinimerina a réuni les principautés mérinas et a commencé l'expansion que son fils Radama Ier a poursuivie.",
        source: "Encyclopaedia Britannica, notice « Andrianampoinimerina »",
      },
      {
        question: "Quelle reine mérina a régné plus de trente ans en tenant les puissances européennes à distance ?",
        options: ["Ranavalona Ire", "Ranavalona III", "Rasoherina", "Ranavalona II"],
        fact: "Ranavalona Ire a régné de 1828 à 1861 et a résisté aux missions et aux installations étrangères sur l'île.",
        source: "Encyclopaedia Britannica, notice « Ranavalona I »",
      },
      {
        question: "Quelle colline des rois mérinas, près d'Antananarivo, est un site du patrimoine mondial ?",
        options: ["Ambohimanga", "Antongona", "Ambondrombe", "Isalo"],
        fact: "La colline royale d'Ambohimanga abrite les tombeaux et l'enceinte des rois mérinas et reste un lieu de pèlerinage.",
        source: "Liste du patrimoine mondial de l'UNESCO, Colline royale d'Ambohimanga",
      },
      {
        question: "En quelle année les troupes françaises ont-elles pris Antananarivo et mis fin à la monarchie mérina ?",
        options: ["1896", "1879", "1914", "1840"],
        fact: "La France a envahi l'île en 1895 et aboli la monarchie en 1896, et Madagascar est devenue une colonie française.",
        source: "Encyclopaedia Britannica, notice « Madagascar »",
      },
      {
        question: "Quel royaume de la côte ouest commerçait avec les navires arabes et européens ?",
        options: ["Le royaume sakalava", "Le royaume mérina", "Le royaume betsimisaraka", "Le royaume antemoro"],
        fact: "Les royaumes sakalavas de la côte ouest se sont enrichis grâce au commerce de leurs ports, captifs et bétail compris.",
        source: "Encyclopaedia Britannica, notice « Sakalava »",
      },
      {
        question: "Quelle confédération de la côte est a été fondée au XVIIIe siècle ?",
        options: ["Les Betsimisaraka", "Les Imerina", "Les Boina", "Les Antemoro"],
        fact: "La confédération betsimisaraka a uni les peuples de la côte est contre les ravisseurs d'esclaves et les marchands étrangers.",
        source: "Encyclopaedia Britannica, notice « Betsimisaraka »",
      },
      {
        question: "Quelle gousse précieuse, cultivée sur l'île, est devenue une grande exportation ?",
        options: ["La vanille", "Le poivre", "La cannelle", "Le girofle"],
        fact: "La vanille a été introduite au XIXe siècle, et Madagascar est devenu l'un des premiers producteurs du monde.",
        source: "Encyclopaedia Britannica, notice « vanilla »",
      },
      {
        question: "Quel peuple la tradition retient-elle comme le premier habitant de l'île ?",
        options: ["Les Vazimba", "Les Mérinas", "Les Sakalavas", "Les Antandroy"],
        fact: "Les Vazimba sont retenus par la tradition malgache comme le premier peuple de l'intérieur, avant les rois mérinas.",
        source: "Encyclopaedia Britannica, notice « Madagascar »",
      },
      {
        question: "Pourquoi les navires européens faisaient-ils escale à Madagascar sur la route des Indes ?",
        options: ["Pour se ravitailler en vivres et en eau", "Pour y extraire de l'or", "Pour y acheter de la soie", "Pour y construire des chantiers navals"],
        fact: "L'île se trouvait sur la route du cap vers l'Inde, et ses ports fournissaient riz, bétail et eau aux navires.",
        source: "Encyclopaedia Britannica, notice « Madagascar »",
      },
      {
        question: "Quelle cérémonie de retournement et de réenveloppement des ossements des morts se pratique sur les hauts plateaux ?",
        options: ["Le famadihana", "Le fitampoha", "Le fandroana", "Le sambatra"],
        fact: "Au famadihana, les familles ouvrent le tombeau, enveloppent les restes dans un drap neuf et célèbrent leurs ancêtres.",
        source: "Encyclopaedia Britannica, notice « famadihana »",
      },
      {
        question: "Quelle partie sèche de l'île est le pays des Antandroy ?",
        options: ["Le sud", "Les hauts plateaux du centre", "La côte est", "Le grand nord"],
        fact: "Le sud aride, pays des Antandroy, est la région la plus sèche de Madagascar et a forgé son propre mode de vie.",
        source: "Encyclopaedia Britannica, notice « Antandroy »",
      },
      {
        question: "Quelle culture venue des Amériques, portée par les mêmes navires, est devenue un aliment de l'île ?",
        options: ["Le manioc", "Le riz", "Le sorgho", "Le mil"],
        fact: "Le manioc est arrivé des Amériques par la traite atlantique et s'est répandu sur l'île comme une culture résistant à la sécheresse.",
        source: "Encyclopaedia Britannica, notice « cassava »",
      },
      {
        question: "Qu'est devenue Madagascar après l'abolition de la monarchie mérina par la France ?",
        options: ["Une colonie française", "Un protectorat britannique", "Un royaume indépendant", "Un territoire allemand"],
        fact: "Après 1896, l'île était gouvernée depuis Paris comme une colonie, jusqu'à son indépendance en 1960.",
        source: "Encyclopaedia Britannica, notice « Madagascar »",
      },
    ],
  },
};
