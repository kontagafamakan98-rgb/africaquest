/**
 * Songhai Empire: one level of the game, on its own.
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
import { Swords } from "lucide-react";

export default {
  id: 6,
  order: 17,
  era: "medieval",
  from: 1464,
  title: "Songhai Empire",
  subtitle: "Africa's Largest Empire",
  region: "West Africa",
  color: "from-teal-400 to-cyan-600",
  icon: Swords,
  gallery: {
    en: [
      {
        file: "/photos/level-6-1.jpg",
        caption: "Fishermen on the Niger River, the artery of the Songhai Empire.",
        credit: "T.K. Naliaka · CC BY-SA 4.0 · Wikimedia Commons",
        author: "T.K. Naliaka",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:FISHERMEN_RIVER_WEST_AFRICA.jpg",
      },
      {
        file: "/photos/level-6-2.jpg",
        caption: "The Tomb of Askia in Gao, the pyramid tomb of a Songhai emperor.",
        credit: "Gio53 · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Gio53",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Tombeau_askia.jpg",
      },
      {
        file: "/photos/level-6-3.jpg",
        caption: "The Djinguereber mosque in Timbuktu, built under Mali and enlarged under Songhai.",
        credit: "upyernoz · CC BY 2.0 · Wikimedia Commons",
        author: "upyernoz",
        licence: "CC BY 2.0",
        source: "https://commons.wikimedia.org/wiki/File:Djinguereber_Mosque%2C_Timbuktu.jpg",
      },
    ],
    fr: [
      {
        file: "/photos/level-6-1.jpg",
        caption: "Des pêcheurs sur le fleuve Niger, l'artère de l'empire songhaï.",
        credit: "T.K. Naliaka · CC BY-SA 4.0 · Wikimedia Commons",
        author: "T.K. Naliaka",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:FISHERMEN_RIVER_WEST_AFRICA.jpg",
      },
      {
        file: "/photos/level-6-2.jpg",
        caption: "Le tombeau d'Askia à Gao, la tombe pyramidale d'un empereur songhaï.",
        credit: "Gio53 · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Gio53",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Tombeau_askia.jpg",
      },
      {
        file: "/photos/level-6-3.jpg",
        caption: "La mosquée Djingareyber à Tombouctou, bâtie sous le Mali et agrandie sous les Songhaï.",
        credit: "upyernoz · CC BY 2.0 · Wikimedia Commons",
        author: "upyernoz",
        licence: "CC BY 2.0",
        source: "https://commons.wikimedia.org/wiki/File:Djinguereber_Mosque%2C_Timbuktu.jpg",
      },
    ],
  },
  study: {
    en: {
      essay: ["The largest empire in African history grew along the great bend of the Niger, where the caravan routes of the Sahara met the river. From there it could tax the salt that came south from the desert and the gold that came north from the forests, and hold the two together with cavalry and with boats.", "Under Sonni Ali, who took the towns of the Niger one after another, and then under Askia Muhammad, who took the throne in 1493, Songhai held Timbuktu and Djenne and made the desert caravans pay. Askia Muhammad divided the empire into provinces, appointed governors, and put the tax on salt at the centre of the state's income.", "Its army mixed cavalry and infantry with a fleet of river boats, and the boats counted as much as the horses. The scholars of Timbuktu wrote on law, astronomy, medicine and history, and the manuscripts they copied are still kept in the city today, in families and in libraries.", "In 1591 a Moroccan army crossed the Sahara with firearms and broke the Songhai cavalry at Tondibi. The empire came apart within a generation, its provinces became small states, and the trade routes of the Niger bend found other masters."],
      timeline: [
        {
          year: "c. 1464",
          text: "Sonni Ali becomes king of Songhai and begins to take the towns of the Niger.",
        },
        { year: "1493", text: "Askia Muhammad takes the throne and reforms the empire." },
        {
          year: "c. 1510",
          text: "Leo Africanus visits Timbuktu and describes its book trade and its scholars.",
        },
        { year: "1591", text: "A Moroccan army with firearms defeats Songhai at Tondibi." },
        { year: "c. 1600", text: "The empire breaks into smaller states and the trade routes shift." },
      ],
      people: [
        { name: "Sonni Ali", text: "The king who made Songhai the leading power of the Niger bend." },
        {
          name: "Askia Muhammad",
          text: "The reformer who organised the provinces and the tax on salt.",
        },
        {
          name: "Leo Africanus",
          text: "The traveller whose book carried Timbuktu to European readers.",
        },
        { name: "Ahmad al-Mansur", text: "The Moroccan sultan who sent his army across the Sahara." },
      ],
      places: [
        { name: "Gao", text: "The capital of the empire, on the Niger." },
        { name: "Timbuktu", text: "The city of the scholars and of the manuscript trade." },
        { name: "Djenne", text: "The trading town at the inland delta, with its mosque of earth." },
        { name: "Tondibi", text: "The battlefield where the Songhai cavalry met gunpowder." },
      ],
      glossary: [
        {
          term: "askia",
          text: "The title taken by the rulers after Askia Muhammad, the one who is not to be contested.",
        },
        {
          term: "salt caravan",
          text: "The train of camels that carried the slabs of desert salt south.",
        },
        {
          term: "cavalry",
          text: "Soldiers who fight from horseback, the arm the desert trade paid for.",
        },
        {
          term: "manuscript",
          text: "A book written by hand, the form every text took before printing.",
        },
        { term: "arquebus", text: "The early firearm whose fire broke the Songhai cavalry." },
      ],
    },
    fr: {
      essay: ["Le plus grand empire de l'histoire africaine s'est développé le long de la boucle du Niger, au croisement des routes caravanières du Sahara et du fleuve. De là, il pouvait taxer le sel qui descendait du désert et l'or qui remontait des forêts, et tenir les deux ensemble par la cavalerie et par les bateaux.", "Sous Sonni Ali, qui a pris les villes du Niger l'une après l'autre, puis sous Askia Muhammad, monté sur le trône en 1493, le Songhaï tenait Tombouctou et Djenné et faisait payer les caravanes du désert. Askia Muhammad a divisé l'empire en provinces, nommé des gouverneurs et placé l'impôt sur le sel au centre des revenus de l'État.", "Son armée mêlait cavalerie et infanterie à une flotte de bateaux fluviaux, et les bateaux comptaient autant que les chevaux. Les lettrés de Tombouctou écrivaient sur le droit, l'astronomie, la médecine et l'histoire, et les manuscrits qu'ils copiaient sont encore conservés dans la ville, dans les familles et dans les bibliothèques.", "En 1591, une armée marocaine a traversé le Sahara avec des armes à feu et a brisé la cavalerie songhaï à Tondibi. L'empire s'est disloqué en une génération, ses provinces sont devenues de petits États, et les routes commerciales de la boucle du Niger ont trouvé d'autres maîtres."],
      timeline: [
        {
          year: "v. 1464",
          text: "Sonni Ali devient roi du Songhaï et commence à prendre les villes du Niger.",
        },
        { year: "1493", text: "Askia Muhammad prend le trône et réforme l'empire." },
        {
          year: "v. 1510",
          text: "Léon l'Africain visite Tombouctou et décrit son commerce du livre et ses lettrés.",
        },
        { year: "1591", text: "Une armée marocaine armée d'armes à feu bat le Songhaï à Tondibi." },
        {
          year: "v. 1600",
          text: "L'empire se divise en États plus petits et les routes commerciales se déplacent.",
        },
      ],
      people: [
        {
          name: "Sonni Ali",
          text: "Le roi qui a fait du Songhaï la première puissance de la boucle du Niger.",
        },
        {
          name: "Askia Muhammad",
          text: "Le réformateur qui a organisé les provinces et l'impôt sur le sel.",
        },
        {
          name: "Léon l'Africain",
          text: "Le voyageur dont le livre a fait connaître Tombouctou aux lecteurs d'Europe.",
        },
        {
          name: "Ahmad al-Mansour",
          text: "Le sultan marocain qui a envoyé son armée à travers le Sahara.",
        },
      ],
      places: [
        { name: "Gao", text: "La capitale de l'empire, sur le Niger." },
        { name: "Tombouctou", text: "La ville des lettrés et du commerce des manuscrits." },
        { name: "Djenné", text: "La ville marchande du delta intérieur, avec sa mosquée de terre." },
        { name: "Tondibi", text: "Le champ de bataille où la cavalerie songhaï a rencontré la poudre." },
      ],
      glossary: [
        {
          term: "askia",
          text: "Le titre pris par les souverains après Askia Muhammad, celui qu'on ne conteste pas.",
        },
        {
          term: "caravane de sel",
          text: "Le convoi de chameaux qui descendait les plaques de sel du désert.",
        },
        {
          term: "cavalerie",
          text: "Les soldats qui combattent à cheval, l'arme que payait le commerce du désert.",
        },
        {
          term: "manuscrit",
          text: "Un livre écrit à la main, la forme de tout texte avant l'imprimerie.",
        },
        { term: "arquebuse", text: "L'arme à feu ancienne dont le tir a brisé la cavalerie songhaï." },
      ],
    },
  },
  questions: [
    {
      question: "The Songhai Empire was the largest empire in African history. Where was it?",
      options: ["East Africa", "West Africa", "Southern Africa", "North Africa"],
      correct: 1,
      fact: "The Songhai Empire covered over 1.4 million square kilometers!",
      source: { label: "Encyclopaedia Britannica, \"Songhai empire\"" },
    },
    {
      question: "Who was the great leader who expanded the Songhai Empire?",
      options: ["Mansa Musa", "Shaka Zulu", "Askia Muhammad", "Haile Selassie"],
      correct: 2,
      fact: "Askia Muhammad created provinces, a tax system, and promoted education!",
      source: {
        label: "UNESCO World Heritage List, Tomb of Askia",
        url: "https://whc.unesco.org/en/list/1139/",
      },
    },
    {
      question: "Which city remained an important center of learning under Songhai?",
      options: ["Lagos", "Timbuktu", "Accra", "Dar es Salaam"],
      correct: 1,
      fact: "Under Songhai, Timbuktu's Sankore University attracted scholars from across the world!",
      source: { label: "UNESCO World Heritage List, Timbuktu", url: "https://whc.unesco.org/en/list/119/" },
    },
    {
      question: "What river was vital to the Songhai Empire?",
      options: ["Nile", "Congo", "Niger", "Zambezi"],
      correct: 2,
      fact: "The Niger River provided water, food, and a highway for trade across the empire!",
      source: { label: "Encyclopaedia Britannica, \"Songhai empire\"" },
    },
    {
      question: "How did the Songhai Empire fall?",
      options: ["Earthquake", "Moroccan invasion", "Flood", "Volcano"],
      correct: 1,
      fact: "In 1591, Morocco invaded with guns and cannons, which Songhai had never seen before!",
      source: { label: "Encyclopaedia Britannica, \"Songhai empire\"" },
    },
    {
      question: "Before Askia Muhammad, who was the warrior-king who built the Songhai Empire by conquering the Mali Empire?",
      options: ["Sunni Ali", "Mansa Musa", "Sundiata", "Kankan Musa"],
      correct: 0,
      fact: "Sunni Ali (reigned 1464-1492) was a brilliant military genius who turned Songhai into the largest African empire through 28 years of near-constant warfare!",
      source: { label: "Encyclopaedia Britannica, \"Songhai empire\"" },
    },
    {
      question: "The Battle of Tondibi in 1591, which ended Songhai, was notable because Songhai's army used a secret weapon that backfired. What was it?",
      options: ["Elephants that stampeded their own army", "Poison arrows that killed their own men", "Flaming arrows", "War drums that deafened soldiers"],
      correct: 0,
      fact: "Songhai deployed cattle as a shield against Moroccan guns, but the noise of firearms caused the cattle to stampede back through their own army!",
      source: { label: "Encyclopaedia Britannica, \"Songhai empire\"" },
    },
    {
      question: "Timbuktu's scholars preserved manuscripts on which advanced subjects?",
      options: ["Only religion", "Astronomy, mathematics, medicine, and law", "Only history", "Only poetry"],
      correct: 1,
      fact: "Over 700,000 manuscripts survive from Timbuktu covering mathematics, astronomy, medicine, proving Africa's sophisticated intellectual tradition!",
      source: { label: "UNESCO World Heritage List, Timbuktu", url: "https://whc.unesco.org/en/list/119/" },
    },
    {
      question: "Askia Muhammad was eventually deposed. Who removed him from power?",
      options: ["The Moroccan army", "His own son Musa", "A slave revolt", "A rival king from Mali"],
      correct: 1,
      fact: "In 1528, Askia Muhammad's own son Musa staged a coup and overthrew his aging father, beginning a period of instability that weakened Songhai!",
      source: { label: "Encyclopaedia Britannica, \"Askia Muhammad I\"" },
    },
    {
      question: "The Moroccan invasion force at Tondibi was led by Judar Pasha. What was historically remarkable about him?",
      options: ["He was a woman disguised as a man", "He was a Spanish-born enslaved person who rose to become a general", "He was only 14 years old", "He was blind"],
      correct: 1,
      fact: "Judar Pasha was a Spanish-born former enslaved person who rose through the Moroccan court to command the invasion, a remarkable life story!",
      source: { label: "Encyclopaedia Britannica, \"Songhai empire\"" },
    },
    {
      question: "Which city on the Niger River was the political capital of the Songhai Empire?",
      options: ["Gao", "Timbuktu", "Djenne", "Kumbi Saleh"],
      correct: 0,
      fact: "Gao was the seat of government while Timbuktu served as the empire's great centre of trade and learning!",
      source: { label: "Encyclopaedia Britannica, \"Songhai empire\"" },
    },
    {
      question: "After his pilgrimage to Mecca, Askia Muhammad was granted which title?",
      options: ["Caliph of the Sudan", "King of Kings", "Emperor of the Niger", "Sultan of Songhai"],
      correct: 0,
      fact: "Recognition as caliph of the Sudan strengthened Songhai's standing in the Islamic world and boosted its trade and diplomacy!",
      source: { label: "Encyclopaedia Britannica, \"Askia Muhammad I\"" },
    },
    {
      question: "After the 1591 invasion, Moroccan forces ruled Timbuktu and Gao under which administration?",
      options: ["The Pashalik of Timbuktu", "The Kingdom of Ghana", "The Fatimid Caliphate", "The Kingdom of Kongo"],
      correct: 0,
      fact: "The Pashalik of Timbuktu was a Moroccan-run administration, though its control over the region faded over the following centuries!",
      source: { label: "Encyclopaedia Britannica, \"Songhai empire\"" },
    },
    {
      question: "Which Moroccan sultan sent the army that invaded Songhai in 1591?",
      options: ["Ahmad al-Mansur", "Idris Alooma", "Selim II", "Mansa Musa"],
      correct: 0,
      fact: "Ahmad al-Mansur armed his troops with muskets, and what he wanted was the gold and salt routes of the Niger rather than the land itself.",
      source: { label: "Encyclopaedia Britannica, \"Ahmad al-Mansur\"" },
    },
    {
      question: "What did Morocco mainly want from its conquest of Songhai?",
      options: ["Control of the gold and salt trade", "Land for settlers", "Fishing rights on the Niger", "Freed slaves for its army"],
      correct: 0,
      fact: "The Moroccan victory at Tondibi brought the empire down, but holding the trade routes across the desert proved far harder than winning them.",
      source: { label: "Encyclopaedia Britannica, \"Songhai empire\"" },
    },
    {
      question: "Which dynasty did Askia Muhammad take power from in 1493?",
      options: ["The Sonni dynasty", "The Sayfawa dynasty", "The Zagwe dynasty", "The Almoravids"],
      correct: 0,
      fact: "The Sonni kings had made Gao the centre of a new empire, and Askia Muhammad took the throne from the last of them.",
      source: { label: "Encyclopaedia Britannica, \"Songhai empire\"" },
    },
    {
      question: "Which language did the people of the Songhai empire speak, which is neither Mande nor Amazigh?",
      options: ["Songhai", "Mandinka", "Punic", "Ge'ez"],
      correct: 0,
      fact: "Songhai belongs to its own family of languages, spoken along the Niger from Gao downriver, and it is still spoken around Timbuktu and Gao today.",
      source: {
        label: "UNESCO, General History of Africa, volume IV",
        url: "https://www.unesco.org/en/general-history-africa",
      },
    },
    {
      question: "Which Saharan mine of copper brought metal to the towns of the Niger in the 14th century?",
      options: ["Takedda", "Taghaza", "Bilma", "Walata"],
      correct: 0,
      fact: "Caravans carried copper bars south from Takedda and salt north to the desert, and the mine is described by the same travellers who saw Timbuktu.",
      source: {
        label: "UNESCO, General History of Africa, volume IV",
        url: "https://www.unesco.org/en/general-history-africa",
      },
    },
    {
      question: "Which traveller, on a mission for Morocco in 1510, described the scholars and the markets of Timbuktu?",
      options: ["Leo Africanus", "Ibn Battuta", "Al-Bakri", "Marco Polo"],
      correct: 0,
      fact: "Leo Africanus travelled as a diplomat and wrote in Italian, and his book taught Europe most of what it knew about the Niger for centuries.",
      source: { label: "Encyclopaedia Britannica, \"Leo Africanus\"" },
    },
    {
      question: "What kind of force did the Songhai kings use to hold the Niger and the edge of the desert?",
      options: ["Cavalry, infantry and a river fleet", "Cavalry alone", "Archers alone", "War elephants"],
      correct: 0,
      fact: "The empire's army combined horsemen from the Sahel with foot soldiers and a fleet of boats, and the boats were as important as the horses.",
      source: {
        label: "UNESCO, General History of Africa, volume IV",
        url: "https://www.unesco.org/en/general-history-africa",
      },
    },
    {
      question: "In which century did the Songhai empire reach its greatest extent?",
      options: ["The 16th century", "The 11th century", "The 8th century", "The 19th century"],
      correct: 0,
      fact: "Askia Muhammad's conquests carried Songhai from the mouth of the Senegal river to the edges of the Hausa country.",
      source: { label: "Encyclopaedia Britannica, \"Songhai empire\"" },
    },
  ],
  fr: {
    title: "Empire songhaï",
    subtitle: "Le plus grand empire d'Afrique",
    region: "Afrique de l'Ouest",
    questions: [
      {
        question: "L'Empire songhaï était le plus grand empire de l'histoire africaine. Où se trouvait-il ?",
        options: ["En Afrique de l'Est", "En Afrique de l'Ouest", "En Afrique australe", "En Afrique du Nord"],
        fact: "L'Empire songhaï couvrait plus de 1,4 million de kilomètres carrés !",
        source: "Encyclopaedia Britannica, notice « Songhai empire »",
      },
      {
        question: "Quel grand dirigeant a étendu l'Empire songhaï ?",
        options: ["Mansa Moussa", "Chaka Zoulou", "Askia Muhammad", "Hailé Sélassié"],
        fact: "Askia Muhammad a créé des provinces et un système d'impôts, et il a encouragé l'éducation !",
        source: "Liste du patrimoine mondial de l'UNESCO, Tombeau des Askia",
      },
      {
        question: "Quelle ville est restée un grand centre du savoir sous les Songhaï ?",
        options: ["Lagos", "Tombouctou", "Accra", "Dar es Salam"],
        fact: "Sous les Songhaï, l'université de Sankoré à Tombouctou attirait des savants du monde entier !",
        source: "Liste du patrimoine mondial de l'UNESCO, Tombouctou",
      },
      {
        question: "Quel fleuve était vital pour l'Empire songhaï ?",
        options: ["Le Nil", "Le Congo", "Le Niger", "Le Zambèze"],
        fact: "Le fleuve Niger fournissait l'eau, la nourriture et une voie de commerce à travers tout l'empire !",
        source: "Encyclopaedia Britannica, notice « Songhai empire »",
      },
      {
        question: "Comment l'Empire songhaï est-il tombé ?",
        options: ["À cause d'un tremblement de terre", "À cause d'une invasion marocaine", "À cause d'une inondation", "À cause d'un volcan"],
        fact: "En 1591, le Maroc a envahi l'empire avec des armes à feu et des canons, que les Songhaï n'avaient jamais vus auparavant !",
        source: "Encyclopaedia Britannica, notice « Songhai empire »",
      },
      {
        question: "Avant Askia Muhammad, quel roi guerrier a bâti l'Empire songhaï en conquérant l'Empire du Mali ?",
        options: ["Sonni Ali", "Mansa Moussa", "Soundjata", "Kankan Moussa"],
        fact: "Sonni Ali, qui a régné de 1464 à 1492, était un génie militaire qui a fait de Songhaï le plus grand empire africain au terme de 28 années de guerre presque continue !",
        source: "Encyclopaedia Britannica, notice « Songhai empire »",
      },
      {
        question: "La bataille de Tondibi en 1591, qui a mis fin à Songhaï, est célèbre parce que l'armée songhaï a utilisé une arme qui s'est retournée contre elle. Laquelle ?",
        options: ["Des éléphants qui ont piétiné leur propre armée", "Des flèches empoisonnées", "Des flèches enflammées", "Des tambours de guerre assourdissants"],
        fact: "L'armée songhaï a utilisé du bétail comme bouclier face aux armes marocaines, mais le bruit des tirs a affolé les animaux, qui ont chargé à travers leurs propres troupes !",
        source: "Encyclopaedia Britannica, notice « Songhai empire »",
      },
      {
        question: "Sur quels sujets savants portaient les manuscrits conservés à Tombouctou ?",
        options: ["Uniquement la religion", "L'astronomie, les mathématiques, la médecine et le droit", "Uniquement l'histoire", "Uniquement la poésie"],
        fact: "Plus de 700 000 manuscrits de Tombouctou ont survécu, traitant de mathématiques, d'astronomie et de médecine, preuve de la tradition intellectuelle raffinée de l'Afrique !",
        source: "Liste du patrimoine mondial de l'UNESCO, Tombouctou",
      },
      {
        question: "Askia Muhammad a fini par être renversé. Qui l'a destitué ?",
        options: ["L'armée marocaine", "Son propre fils Moussa", "Une révolte d'esclaves", "Un roi rival du Mali"],
        fact: "En 1528, Moussa, le propre fils d'Askia Muhammad, a organisé un coup d'État contre son père vieillissant, ouvrant une période d'instabilité qui a affaibli Songhaï !",
        source: "Encyclopaedia Britannica, notice « Askia Muhammad I »",
      },
      {
        question: "La force d'invasion marocaine à Tondibi était commandée par Judar Pacha. Qu'avait-il de remarquable ?",
        options: ["C'était une femme déguisée en homme", "Il était né en Espagne, réduit en esclavage, et il est devenu général", "Il n'avait que 14 ans", "Il était aveugle"],
        fact: "Judar Pacha était né en Espagne et avait été réduit en esclavage avant de s'élever dans la cour marocaine jusqu'au commandement de l'invasion, un destin remarquable !",
        source: "Encyclopaedia Britannica, notice « Songhai empire »",
      },
      {
        question: "Quelle ville sur le fleuve Niger était la capitale politique de l'Empire songhaï ?",
        options: ["Gao", "Tombouctou", "Djenné", "Koumbi Saleh"],
        fact: "Gao était le siège du gouvernement, tandis que Tombouctou servait de grand centre commercial et intellectuel de l'empire !",
        source: "Encyclopaedia Britannica, notice « Songhai empire »",
      },
      {
        question: "Après son pèlerinage à La Mecque, quel titre Askia Muhammad a-t-il reçu ?",
        options: ["Calife du Soudan", "Roi des rois", "Empereur du Niger", "Sultan de Songhaï"],
        fact: "Sa reconnaissance comme calife du Soudan a renforcé la position de Songhaï dans le monde islamique et stimulé son commerce et sa diplomatie !",
        source: "Encyclopaedia Britannica, notice « Askia Muhammad I »",
      },
      {
        question: "Après l'invasion de 1591, sous quelle administration les forces marocaines gouvernaient-elles Tombouctou et Gao ?",
        options: ["Le pachalik de Tombouctou", "Le royaume du Ghana", "Le califat fatimide", "Le royaume du Kongo"],
        fact: "Le pachalik de Tombouctou était une administration dirigée par le Maroc, dont le contrôle sur la région s'est ensuite effacé au fil des siècles !",
        source: "Encyclopaedia Britannica, notice « Songhai empire »",
      },
      {
        question: "Quel sultan marocain a envoyé l'armée qui a envahi le Songhaï en 1591 ?",
        options: ["Ahmed al-Mansour", "Idriss Alooma", "Sélim II", "Mansa Moussa"],
        fact: "Ahmed al-Mansour a équipé ses troupes de mousquets, et ce qu'il voulait, c'était les routes de l'or et du sel du Niger plutôt que la terre elle-même.",
        source: "Encyclopaedia Britannica, notice « Ahmad al-Mansur »",
      },
      {
        question: "Que cherchait surtout le Maroc dans sa conquête du Songhaï ?",
        options: ["Le contrôle du commerce de l'or et du sel", "Des terres pour s'installer", "Des droits de pêche sur le Niger", "Des esclaves affranchis pour son armée"],
        fact: "La victoire marocaine de Tondibi a fait tomber l'empire, mais tenir les routes caravanières à travers le désert s'est révélé bien plus difficile que de les conquérir.",
        source: "Encyclopaedia Britannica, notice « Songhai empire »",
      },
      {
        question: "Quelle dynastie Askia Muhammad a-t-il écartée du pouvoir en 1493 ?",
        options: ["La dynastie sonni", "La dynastie sayfawa", "La dynastie zagwé", "Les Almoravides"],
        fact: "Les rois sonni avaient fait de Gao le centre d'un empire nouveau, et Askia Muhammad a pris le trône au dernier d'entre eux.",
        source: "Encyclopaedia Britannica, notice « Songhai empire »",
      },
      {
        question: "Quelle langue les habitants de l'empire songhaï parlaient-ils, qui n'est ni mandé ni amazighe ?",
        options: ["Le songhaï", "Le mandinka", "Le punique", "Le guèze"],
        fact: "Le songhaï appartient à sa propre famille de langues, parlée le long du Niger depuis Gao vers l'aval, et il se parle encore autour de Tombouctou et de Gao.",
        source: "UNESCO, Histoire générale de l'Afrique, volume IV",
      },
      {
        question: "Quelle mine de cuivre du Sahara apportait le métal aux villes du Niger au XIVe siècle ?",
        options: ["Takedda", "Taghaza", "Bilma", "Walata"],
        fact: "Les caravanes descendaient les barres de cuivre de Takedda et remontaient le sel vers le désert, et la mine est décrite par les mêmes voyageurs que Tombouctou.",
        source: "UNESCO, Histoire générale de l'Afrique, volume IV",
      },
      {
        question: "Quel voyageur, en mission pour le Maroc en 1510, a décrit les lettrés et les marchés de Tombouctou ?",
        options: ["Léon l'Africain", "Ibn Battuta", "Al-Bakri", "Marco Polo"],
        fact: "Léon l'Africain voyageait comme diplomate et écrivait en italien, et son livre a appris à l'Europe presque tout ce qu'elle savait du Niger.",
        source: "Encyclopaedia Britannica, notice « Leo Africanus »",
      },
      {
        question: "De quel type de force les rois songhaï se servaient-ils pour tenir le Niger et la lisière du désert ?",
        options: ["De cavalerie, d'infanterie et d'une flotte fluviale", "De cavalerie seule", "D'archers seuls", "D'éléphants de guerre"],
        fact: "L'armée de l'empire mêlait des cavaliers du Sahel, des fantassins et une flotte de bateaux, et les bateaux comptaient autant que les chevaux.",
        source: "UNESCO, Histoire générale de l'Afrique, volume IV",
      },
      {
        question: "Au cours de quel siècle l'empire songhaï a-t-il atteint sa plus grande étendue ?",
        options: ["Au XVIe siècle", "Au XIe siècle", "Au VIIIe siècle", "Au XIXe siècle"],
        fact: "Les conquêtes d'Askia Muhammad ont porté l'empire songhaï de l'embouchure du Sénégal jusqu'aux confins du pays haoussa.",
        source: "Encyclopaedia Britannica, notice « Songhai empire »",
      },
    ],
  },
};
