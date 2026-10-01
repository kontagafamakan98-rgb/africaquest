/**
 * Kingdom of Kush: one level of the game, on its own.
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
import { Crown } from "lucide-react";

export default {
  id: 2,
  order: 3,
  era: "ancient",
  from: -1070,
  title: "Kingdom of Kush",
  subtitle: "Nubia's Golden Empire",
  region: "Northeast Africa",
  color: "from-amber-600 to-orange-800",
  icon: Crown,
  gallery: {
    en: [
      {
        file: "/photos/level-2-1.jpg",
        caption: "The Nubian pyramids of Meroe, seen from the air.",
        credit: "B N Chagny · CC BY-SA 1.0 · Wikimedia Commons",
        author: "B N Chagny",
        licence: "CC BY-SA 1.0",
        source: "https://commons.wikimedia.org/wiki/File:Sudan_Meroe_Pyramids_2001.JPG",
      },
      {
        file: "/photos/level-2-2.jpg",
        caption: "A royal pyramid at Nuri, one of the burial places of the kings of Kush.",
        credit: "Sue Fleckney · CC BY-SA 2.0 · Wikimedia Commons",
        author: "Sue Fleckney",
        licence: "CC BY-SA 2.0",
        source: "https://commons.wikimedia.org/wiki/File:Anlamani's_pyramid%2C_Nuri%2C_Sudan%2C_North-east_Africa.jpg",
      },
      {
        file: "/photos/level-2-3.jpg",
        caption: "A bronze of King Taharqa, who also ruled Egypt as a pharaoh.",
        credit: "Hans Ollermann · CC BY-SA 2.0 · Wikimedia Commons",
        author: "Hans Ollermann",
        licence: "CC BY-SA 2.0",
        source: "https://commons.wikimedia.org/wiki/File:0690-0664_302_PHARAOHS_OF_EGYPT_%E2%80%93_Bronze_Statuette_of_Pharaoh_TAHARQA._From_Gebel_Barkal_(Nubia)%2C_Napata_Period.jpg",
      },
    ],
    fr: [
      {
        file: "/photos/level-2-1.jpg",
        caption: "Les pyramides nubiennes de Méroé, vues du ciel.",
        credit: "B N Chagny · CC BY-SA 1.0 · Wikimedia Commons",
        author: "B N Chagny",
        licence: "CC BY-SA 1.0",
        source: "https://commons.wikimedia.org/wiki/File:Sudan_Meroe_Pyramids_2001.JPG",
      },
      {
        file: "/photos/level-2-2.jpg",
        caption: "Une pyramide royale à Nuri, l'un des lieux de sépulture des rois de Kouch.",
        credit: "Sue Fleckney · CC BY-SA 2.0 · Wikimedia Commons",
        author: "Sue Fleckney",
        licence: "CC BY-SA 2.0",
        source: "https://commons.wikimedia.org/wiki/File:Anlamani's_pyramid%2C_Nuri%2C_Sudan%2C_North-east_Africa.jpg",
      },
      {
        file: "/photos/level-2-3.jpg",
        caption: "Un bronze du roi Taharqa, qui régna aussi sur l'Égypte comme pharaon.",
        credit: "Hans Ollermann · CC BY-SA 2.0 · Wikimedia Commons",
        author: "Hans Ollermann",
        licence: "CC BY-SA 2.0",
        source: "https://commons.wikimedia.org/wiki/File:0690-0664_302_PHARAOHS_OF_EGYPT_%E2%80%93_Bronze_Statuette_of_Pharaoh_TAHARQA._From_Gebel_Barkal_(Nubia)%2C_Napata_Period.jpg",
      },
    ],
  },
  study: {
    en: {
      essay: ["South of Egypt, on the Nile of what is today Sudan, the kingdom of Kush grew strong. Its first capital was Napata, below the holy mountain of Jebel Barkal, and its kings were buried in steep pyramids at El-Kurru and Nuri. The river gave it the same grain and the same route north that Egypt had, and the desert around it could be crossed but not farmed.", "In the eighth century BC the kings of Kush turned that route into a road of conquest. Piye marched north and took Egypt, and his successors ruled it for about a century as the twenty-fifth dynasty. They restored the temples of Thebes and Memphis, and their queens, the kandakes, commanded armies of their own.", "The court later moved south to Meroe, at the mouth of the Atbara, where the kingdom worked iron, traded gold and ivory to the Red Sea, and wrote a script of its own. Meroitic can be read by sound, and the language behind it is still not fully understood, which is one of the great open doors of African history.", "Axum to the east and the desert to the north wore the kingdom down, and in the fourth century Kush came apart. Three Christian Nubian kingdoms, Nobatia, Makuria and Alwa, took its place along the river, and their churches and painted walls carried the old world on for another eight hundred years."],
      timeline: [
        { year: "c. 1070 BC", text: "Kush breaks free of Egypt and its kings rule from Napata." },
        {
          year: "c. 730 BC",
          text: "Piye of Kush marches north and founds the twenty-fifth dynasty of Egypt.",
        },
        { year: "c. 590 BC", text: "The court moves south to Meroe after an Egyptian raid on Napata." },
        { year: "c. 300 AD", text: "Meroe is a centre of iron working and of a writing of its own." },
        { year: "c. 350 AD", text: "Axum defeats Kush and the kingdom comes apart." },
      ],
      people: [
        {
          name: "Piye",
          text: "The Kushite king who took Egypt and left the record of the campaign on a stela.",
        },
        {
          name: "Taharqa",
          text: "The best known pharaoh of the dynasty, a builder at Karnak and in Nubia.",
        },
        {
          name: "Amanirenas",
          text: "A kandake who fought Rome, and whose bronze head was buried beneath a temple floor.",
        },
        {
          name: "Ezana",
          text: "The Axumite king whose inscriptions record the end of the kingdom of Kush.",
        },
      ],
      places: [
        {
          name: "Jebel Barkal",
          text: "The holy mountain above Napata, with its temples and its royal pyramids.",
        },
        { name: "Napata", text: "The first capital, on the fourth cataract of the Nile." },
        { name: "Meroe", text: "The later capital, ringed by steep pyramids and by iron furnaces." },
        {
          name: "Naqa",
          text: "A temple town in the desert between the two capitals, with a Roman style kiosk.",
        },
      ],
      glossary: [
        { term: "kandake", text: "The title of the Kushite queen, who ruled in her own right." },
        { term: "Meroitic", text: "The script of Kush, read by sound but not yet fully understood." },
        { term: "Nubia", text: "The stretch of the Nile between Aswan and the meeting of the rivers." },
        {
          term: "cataract",
          text: "A run of rapids and rocks that boats are carried past rather than sailed.",
        },
        { term: "stela", text: "A slab of stone carved with an official record." },
      ],
    },
    fr: {
      essay: ["Au sud de l'Égypte, sur le Nil de l'actuel Soudan, le royaume de Koush s'est renforcé. Sa première capitale était Napata, sous la montagne sainte du Djebel Barkal, et ses rois étaient enterrés dans des pyramides à pentes raides, à El-Kourrou et à Nouri. Le fleuve lui donnait le même grain et la même route vers le nord que l'Égypte, et le désert alentour se traversait sans pouvoir se cultiver.", "Au VIIIe siècle av. J.-C., les rois de Koush ont changé cette route en chemin de conquête. Piânkhy est monté vers le nord et a pris l'Égypte, et ses successeurs l'ont gouvernée environ un siècle, comme vingt-cinquième dynastie. Ils ont restauré les temples de Thèbes et de Memphis, et leurs reines, les kandakés, commandaient leurs propres armées.", "La cour s'est ensuite installée plus au sud, à Méroé, à l'embouchure de l'Atbara, où le royaume travaillait le fer, commerçait l'or et l'ivoire vers la mer Rouge et écrivait une écriture à lui. Le méroïtique se lit par le son, et la langue qu'il note n'est pas encore pleinement comprise : c'est l'une des grandes portes ouvertes de l'histoire africaine.", "Axoum, à l'est, et le désert, au nord, ont usé le royaume, et au IVe siècle Koush s'est disloqué. Trois royaumes chrétiens nubiens, la Nobatie, la Makourie et Alwa, ont pris sa place le long du fleuve, et leurs églises et leurs murs peints ont porté l'ancien monde huit cents ans de plus."],
      timeline: [
        {
          year: "v. 1070 av. J.-C.",
          text: "Koush s'affranchit de l'Égypte et ses rois gouvernent depuis Napata.",
        },
        {
          year: "v. 730 av. J.-C.",
          text: "Piânkhy de Koush monte vers le nord et fonde la XXVe dynastie d'Égypte.",
        },
        { year: "v. 590 av. J.-C.", text: "La cour descend à Méroé après un raid égyptien sur Napata." },
        {
          year: "v. 300 apr. J.-C.",
          text: "Méroé est un centre du travail du fer et d'une écriture qui lui est propre.",
        },
        { year: "v. 350 apr. J.-C.", text: "Axoum l'emporte sur Koush et le royaume se disloque." },
      ],
      people: [
        {
          name: "Piânkhy",
          text: "Le roi koushite qui a pris l'Égypte et laissé le récit de la campagne sur une stèle.",
        },
        {
          name: "Taharqa",
          text: "Le pharaon le plus connu de la dynastie, bâtisseur à Karnak et en Nubie.",
        },
        {
          name: "Amanirenas",
          text: "Une kandaké qui a combattu Rome, et dont la tête de bronze a été enterrée sous un temple.",
        },
        {
          name: "Ézana",
          text: "Le roi axoumite dont les inscriptions rapportent la fin du royaume de Koush.",
        },
      ],
      places: [
        {
          name: "Djebel Barkal",
          text: "La montagne sainte au-dessus de Napata, avec ses temples et ses pyramides royales.",
        },
        { name: "Napata", text: "La première capitale, sur la quatrième cataracte du Nil." },
        {
          name: "Méroé",
          text: "La capitale suivante, entourée de pyramides raides et de fourneaux à fer.",
        },
        {
          name: "Naqa",
          text: "Une ville de temples dans le désert entre les deux capitales, avec un kiosque de style romain.",
        },
      ],
      glossary: [
        { term: "kandaké", text: "Le titre de la reine koushite, qui gouvernait en son propre nom." },
        {
          term: "méroïtique",
          text: "L'écriture de Koush, lue par le son mais pas encore entièrement comprise.",
        },
        { term: "Nubie", text: "Le ruban du Nil entre Assouan et la rencontre des fleuves." },
        {
          term: "cataracte",
          text: "Une suite de rapides et de rochers que les bateaux sont portés plutôt que navigués.",
        },
        { term: "stèle", text: "Une dalle de pierre gravée d'un texte officiel." },
      ],
    },
  },
  questions: [
    {
      question: "Where was the Kingdom of Kush located?",
      options: ["West Africa", "Modern-day Sudan", "South Africa", "Madagascar"],
      correct: 1,
      fact: "Kush was located in modern-day Sudan, south of Egypt!",
      source: { label: "Encyclopaedia Britannica, \"Kush\"" },
    },
    {
      question: "What was the capital city of Kush?",
      options: ["Cairo", "Meroë", "Timbuktu", "Axum"],
      correct: 1,
      fact: "Meroë was famous for its iron-working and pyramids!",
      source: { label: "Encyclopaedia Britannica, \"Meroe\"" },
    },
    {
      question: "Kush was known for trading which valuable material?",
      options: ["Diamonds", "Gold", "Silver", "Platinum"],
      correct: 1,
      fact: "Gold was so abundant that Kush was sometimes called the 'Land of Gold'!",
      source: { label: "Encyclopaedia Britannica, \"Kush\"" },
    },
    {
      question: "The Kushites built their own style of what famous structure?",
      options: ["Castles", "Pyramids", "Bridges", "Lighthouses"],
      correct: 1,
      fact: "Kush had more pyramids than Egypt, over 200 of them!",
      source: { label: "Encyclopaedia Britannica, \"Meroe\"" },
    },
    {
      question: "What powerful group of women ruled parts of Kush?",
      options: ["Princesses", "Kandakes (Queens)", "Priestesses", "Warriors"],
      correct: 1,
      fact: "Kandakes were powerful queens who sometimes led armies into battle!",
      source: { label: "Encyclopaedia Britannica, \"Kush\"" },
    },
    {
      question: "Which Kandake of Kush famously fought against the Roman army around 24 BC?",
      options: ["Amanirenas", "Shanakdakhete", "Amanitore", "Nawidemak"],
      correct: 0,
      fact: "Kandake Amanirenas led her army against Rome after they tried to tax Nubian territory, and negotiated a favorable peace treaty!",
      source: { label: "Encyclopaedia Britannica, \"Kush\"" },
    },
    {
      question: "The Meroitic script used in Kush was deciphered in terms of its sounds, but what remains a mystery?",
      options: ["The alphabet", "The meaning of most words", "The direction of writing", "Who invented it"],
      correct: 1,
      fact: "Scholars can read Meroitic letters phonetically but still cannot fully understand the language, it remains largely undeciphered!",
      source: { label: "Encyclopaedia Britannica, \"Meroe\"" },
    },
    {
      question: "Kush conquered and ruled Egypt for nearly a century. Which dynasty did Kushite pharaohs form?",
      options: ["24th Dynasty", "25th Dynasty", "26th Dynasty", "23rd Dynasty"],
      correct: 1,
      fact: "The Kushite 25th Dynasty, called the 'Black Pharaohs', ruled Egypt from around 747 to 656 BC!",
      source: {
        label: "UNESCO World Heritage List, Gebel Barkal and the Sites of the Napatan Region",
        url: "https://whc.unesco.org/en/list/1073/",
      },
    },
    {
      question: "What was the primary fuel source for Kush's iron-smelting industry at Meroë?",
      options: ["Coal", "Charcoal from acacia trees", "Oil", "Wind power"],
      correct: 1,
      fact: "The forests around Meroë were so heavily used for iron smelting that the area eventually became deforested!",
      source: { label: "Encyclopaedia Britannica, \"Meroe\"" },
    },
    {
      question: "Kush adopted the Egyptian system of writing hieroglyphics, then developed their own script. What was unique about Meroitic script structurally?",
      options: ["It was written in circles", "It used an alphabet with vowel signs", "It had no punctuation", "It was written vertically only"],
      correct: 1,
      fact: "Unlike Egyptian hieroglyphics, Meroitic was an alphabetic system with signs for vowels, a revolutionary linguistic development in Africa!",
      source: { label: "Encyclopaedia Britannica, \"Meroe\"" },
    },
    {
      question: "Which Kushite king completed the conquest of Egypt around 727 BC, founding the 25th Dynasty?",
      options: ["Piye", "Taharqa", "Alara", "Ezana"],
      correct: 0,
      fact: "Piye recorded his conquest on a victory stela, and his dynasty, the 25th, ruled both Kush and Egypt for nearly a century!",
      source: {
        label: "UNESCO World Heritage List, Gebel Barkal and the Sites of the Napatan Region",
        url: "https://whc.unesco.org/en/list/1073/",
      },
    },
    {
      question: "The war between Kush and Rome ended with a peace treaty. Which Roman ruler was emperor at that time?",
      options: ["Julius Caesar", "Augustus", "Nero", "Trajan"],
      correct: 1,
      fact: "The treaty, made around 21 BC during the reign of Augustus, recognized Kushite independence, and Rome never occupied Nubia!",
      source: { label: "Encyclopaedia Britannica, \"Kush\"" },
    },
    {
      question: "Many of the pyramids at Meroë were damaged in 1834 by what?",
      options: ["An earthquake", "A treasure hunter searching for gold", "A flood", "A modern quarry"],
      correct: 1,
      fact: "The Italian treasure hunter Giuseppe Ferlini demolished the tops of many Meroë pyramids looking for gold; most had already been looted in ancient times!",
      source: { label: "Encyclopaedia Britannica, \"Meroe\"" },
    },
    {
      question: "Which Kushite king of the 25th Dynasty fought the Assyrians for control of Egypt?",
      options: ["Taharqa", "Piye", "Alara", "Ezana"],
      correct: 0,
      fact: "Taharqa ruled both Kush and Egypt and met the Assyrian armies in battle, a war recorded in Egyptian and Assyrian texts alike.",
      source: { label: "Encyclopaedia Britannica, \"Taharqa\"" },
    },
    {
      question: "Which Christian Nubian kingdom, with its capital at Soba, followed Kush in the Nile Valley?",
      options: ["Alodia", "Axum", "Kanem", "Kongo"],
      correct: 0,
      fact: "After Kush, three Christian kingdoms arose in Nubia, Nobatia, Makuria and Alodia, and their churches and frescoes are among Africa's oldest Christian art.",
      source: { label: "Encyclopaedia Britannica, \"Nubia\"" },
    },
    {
      question: "Which Egyptian town at the first cataract marked the northern border of Kush?",
      options: ["Aswan", "Cairo", "Alexandria", "Memphis"],
      correct: 0,
      fact: "Aswan stood where the granite of the cataract blocked boats, and the frontier with Kush ran through its rapids.",
      source: { label: "Encyclopaedia Britannica, \"Kush\"" },
    },
    {
      question: "Which city was the capital of Kush before Meroe, with royal pyramids at El-Kurru and Nuri?",
      options: ["Napata", "Alodia", "Soba", "Adulis"],
      correct: 0,
      fact: "Napata stood close to the holy mountain of Jebel Barkal, and the kings of the twenty-fifth dynasty were buried at El-Kurru and Nuri.",
      source: { label: "Encyclopaedia Britannica, \"Kush\"" },
    },
    {
      question: "Which lion-headed god of Meroe had temples at Naqa and Musawwarat?",
      options: ["Apedemak", "Amun", "Osiris", "Isis"],
      correct: 0,
      fact: "Apedemak was a god of war with a lion's head, and no other Nubian deity has temples so full of reliefs still standing.",
      source: {
        label: "UNESCO, General History of Africa, volume II",
        url: "https://www.unesco.org/en/general-history-africa",
      },
    },
    {
      question: "Which sacred mountain in today's Sudan was the coronation place of the kings of Kush?",
      options: ["Jebel Barkal", "Kilimanjaro", "Mount Kenya", "The Ahaggar"],
      correct: 0,
      fact: "Egyptians and Kushites both saw Jebel Barkal as the home of Amun, and every new king of Kush went there to be crowned.",
      source: {
        label: "UNESCO World Heritage List, Gebel Barkal and the Sites of the Napatan Region",
        url: "https://whc.unesco.org/en/list/1073/",
      },
    },
    {
      question: "Which Roman commander marched on Napata in 23 BC, before the peace treaty with the Kandake?",
      options: ["Publius Petronius", "Julius Caesar", "Mark Antony", "Trajan"],
      correct: 0,
      fact: "Petronius took Napata and withdrew, and the treaty that followed let the Kushites keep their own kings and religion.",
      source: { label: "Encyclopaedia Britannica, \"Kush\"" },
    },
    {
      question: "Which simple device, a lever with a bucket on one end, lifted Nile water into the fields of Kush?",
      options: ["The shaduf", "The waterwheel", "The windmill", "The Archimedes screw"],
      correct: 0,
      fact: "A shaduf needs one person and two posts, and it still lifts river water onto the fields along the Nile today.",
      source: { label: "Encyclopaedia Britannica, \"shaduf\"" },
    },
  ],
  fr: {
    title: "Royaume de Kouch",
    subtitle: "L'empire doré de Nubie",
    region: "Afrique du Nord-Est",
    questions: [
      {
        question: "Où se trouvait le royaume de Kouch ?",
        options: ["En Afrique de l'Ouest", "Dans l'actuel Soudan", "En Afrique du Sud", "À Madagascar"],
        fact: "Kouch se trouvait dans l'actuel Soudan, au sud de l'Égypte !",
        source: "Encyclopaedia Britannica, notice « Kush »",
      },
      {
        question: "Quelle était la capitale du royaume de Kouch ?",
        options: ["Le Caire", "Méroé", "Tombouctou", "Axoum"],
        fact: "Méroé était célèbre pour son travail du fer et pour ses pyramides !",
        source: "Encyclopaedia Britannica, notice « Meroe »",
      },
      {
        question: "Quelle matière précieuse faisait la renommée du commerce de Kouch ?",
        options: ["Les diamants", "L'or", "L'argent", "Le platine"],
        fact: "L'or était si abondant que Kouch était parfois appelé le pays de l'or !",
        source: "Encyclopaedia Britannica, notice « Kush »",
      },
      {
        question: "Quelle construction célèbre les Kouchites ont-ils bâtie dans leur propre style ?",
        options: ["Des châteaux", "Des pyramides", "Des ponts", "Des phares"],
        fact: "Le royaume de Kouch comptait plus de pyramides que l'Égypte, plus de 200 !",
        source: "Encyclopaedia Britannica, notice « Meroe »",
      },
      {
        question: "Quel groupe de femmes puissantes régnait sur une partie de Kouch ?",
        options: ["Des princesses", "Les Kandakes, des reines", "Des prêtresses", "Des guerrières"],
        fact: "Les Kandakes étaient des reines puissantes qui menaient parfois leurs armées au combat !",
        source: "Encyclopaedia Britannica, notice « Kush »",
      },
      {
        question: "Quelle Kandake de Kouch a combattu l'armée romaine vers 24 av. J.-C. ?",
        options: ["Amanirenas", "Shanakdakhete", "Amanitore", "Nawidemak"],
        fact: "La Kandake Amanirenas a mené son armée contre Rome après que celle-ci a voulu taxer le territoire nubien, et elle a obtenu un traité de paix avantageux !",
        source: "Encyclopaedia Britannica, notice « Kush »",
      },
      {
        question: "On sait lire les sons de l'écriture méroïtique de Kouch, mais qu'est-ce qui reste un mystère ?",
        options: ["L'alphabet", "Le sens de la plupart des mots", "Le sens de lecture", "Qui l'a inventée"],
        fact: "Les chercheurs savent lire phonétiquement les lettres méroïtiques, mais la langue reste en grande partie incomprise et non déchiffrée !",
        source: "Encyclopaedia Britannica, notice « Meroe »",
      },
      {
        question: "Kouch a conquis et gouverné l'Égypte pendant près d'un siècle. Quelle dynastie les pharaons kouchites ont-ils formée ?",
        options: ["La XXIVe dynastie", "La XXVe dynastie", "La XXVIe dynastie", "La XXIIIe dynastie"],
        fact: "La XXVe dynastie kouchite, appelée les pharaons noirs, a gouverné l'Égypte d'environ 747 à 656 av. J.-C. !",
        source: "Liste du patrimoine mondial de l'UNESCO, Gebel Barkal et les sites de la région napatéenne",
      },
      {
        question: "Quel était le principal combustible de la métallurgie du fer à Méroé ?",
        options: ["Le charbon", "Le charbon de bois des acacias", "Le pétrole", "L'énergie du vent"],
        fact: "Les forêts autour de Méroé ont été tant exploitées pour fondre le fer que la région a fini par être déboisée !",
        source: "Encyclopaedia Britannica, notice « Meroe »",
      },
      {
        question: "Kouch a adopté les hiéroglyphes égyptiens, puis a créé sa propre écriture. Qu'avait d'unique l'écriture méroïtique ?",
        options: ["Elle s'écrivait en cercles", "C'était un alphabet avec des signes pour les voyelles", "Elle n'avait aucune ponctuation", "Elle s'écrivait uniquement à la verticale"],
        fact: "Contrairement aux hiéroglyphes égyptiens, le méroïtique était un système alphabétique avec des signes pour les voyelles, une avancée linguistique remarquable en Afrique !",
        source: "Encyclopaedia Britannica, notice « Meroe »",
      },
      {
        question: "Quel roi kouchite a achevé la conquête de l'Égypte vers 727 av. J.-C. en fondant la XXVe dynastie ?",
        options: ["Piye", "Taharqa", "Alara", "Ézana"],
        fact: "Piye a fait graver sa conquête sur une stèle de victoire, et sa dynastie a régné sur Kouch et l'Égypte pendant près d'un siècle !",
        source: "Liste du patrimoine mondial de l'UNESCO, Gebel Barkal et les sites de la région napatéenne",
      },
      {
        question: "La guerre entre Kouch et Rome s'est achevée par un traité de paix. Quel dirigeant romain était empereur à cette époque ?",
        options: ["Jules César", "Auguste", "Néron", "Trajan"],
        fact: "Le traité, conclu vers 21 av. J.-C. sous le règne d'Auguste, reconnaissait l'indépendance de Kouch, et Rome n'a jamais occupé la Nubie !",
        source: "Encyclopaedia Britannica, notice « Kush »",
      },
      {
        question: "Qu'est-ce qui a endommagé de nombreuses pyramides de Méroé en 1834 ?",
        options: ["Un tremblement de terre", "Un chasseur de trésors en quête d'or", "Une inondation", "Une carrière moderne"],
        fact: "Le chasseur de trésors italien Giuseppe Ferlini a fait démolir le sommet de nombreuses pyramides de Méroé pour trouver de l'or, alors que la plupart avaient déjà été pillées dans l'Antiquité !",
        source: "Encyclopaedia Britannica, notice « Meroe »",
      },
      {
        question: "Quel roi kouchite de la 25e dynastie a combattu les Assyriens pour le contrôle de l'Égypte ?",
        options: ["Taharqa", "Piye", "Alara", "Ézana"],
        fact: "Taharqa régnait à la fois sur Kouch et sur l'Égypte et a affronté les armées assyriennes, une guerre décrite par les textes égyptiens et assyriens.",
        source: "Encyclopaedia Britannica, notice « Taharqa »",
      },
      {
        question: "Quel royaume chrétien de Nubie, avec sa capitale à Soba, a succédé à Kouch dans la vallée du Nil ?",
        options: ["Alodia", "Axoum", "Kanem", "Kongo"],
        fact: "Après Kouch, trois royaumes chrétiens nubiens sont nés, Nobatie, Makouria et Alodia, et leurs églises et leurs fresques comptent parmi les plus anciens arts chrétiens d'Afrique.",
        source: "Encyclopaedia Britannica, notice « Nubia »",
      },
      {
        question: "Quelle ville égyptienne, à la première cataracte, marquait la frontière nord de Koush ?",
        options: ["Assouan", "Le Caire", "Alexandrie", "Memphis"],
        fact: "Assouan se trouvait là où le granite de la cataracte arrêtait les bateaux, et la frontière avec Koush passait par ses rapides.",
        source: "Encyclopaedia Britannica, notice « Kush »",
      },
      {
        question: "Quelle ville était la capitale de Koush avant Méroé, avec ses pyramides royales à El-Kourrou et à Nouri ?",
        options: ["Napata", "Alodia", "Soba", "Adoulis"],
        fact: "Napata se trouvait près de la montagne sainte du Djebel Barkal, et les rois de la vingt-cinquième dynastie sont enterrés à El-Kourrou et à Nouri.",
        source: "Encyclopaedia Britannica, notice « Kush »",
      },
      {
        question: "Quel dieu de Méroé à tête de lion avait des temples à Naqa et à Musawwarat ?",
        options: ["Apedemak", "Amon", "Osiris", "Isis"],
        fact: "Apedemak était un dieu de la guerre à tête de lion, et aucun autre dieu nubien n'a des temples aussi riches en reliefs encore debout.",
        source: "UNESCO, Histoire générale de l'Afrique, volume II",
      },
      {
        question: "Quelle montagne sacrée du Soudan actuel était le lieu du couronnement des rois de Koush ?",
        options: ["Le Djebel Barkal", "Le Kilimandjaro", "Le mont Kenya", "L'Ahaggar"],
        fact: "Égyptiens et Koushites voyaient dans le Djebel Barkal la demeure d'Amon, et chaque nouveau roi de Koush venait s'y faire couronner.",
        source: "Liste du patrimoine mondial de l'UNESCO, Gebel Barkal et les sites de la région napatéenne",
      },
      {
        question: "Quel commandant romain a marché sur Napata en 23 av. J.-C., avant le traité de paix avec la Kandaké ?",
        options: ["Publius Petronius", "Jules César", "Marc Antoine", "Trajan"],
        fact: "Pétronius a pris Napata puis s'est retiré, et le traité qui a suivi a laissé aux Koushites leurs rois et leur religion.",
        source: "Encyclopaedia Britannica, notice « Kush »",
      },
      {
        question: "Quel appareil simple, un levier avec un seau à l'une des extrémités, montait l'eau du Nil dans les champs de Koush ?",
        options: ["Le chadouf", "La roue hydraulique", "Le moulin à vent", "La vis d'Archimède"],
        fact: "Le chadouf demande une personne et deux poteaux, et il monte encore aujourd'hui l'eau du fleuve sur les champs du Nil.",
        source: "Encyclopaedia Britannica, notice « shaduf »",
      },
    ],
  },
};
