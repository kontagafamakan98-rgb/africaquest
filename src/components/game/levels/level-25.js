/**
 * The Asante Empire: one level of the game, on its own.
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
  id: 25,
  order: 20,
  era: "earlyModern",
  from: 1670,
  title: "The Asante Empire",
  subtitle: "Kumasi and the Golden Stool",
  region: "Akan Forest",
  color: "from-yellow-500 to-orange-600",
  icon: Crown,
  gallery: {
    en: [
      {
        file: "/photos/level-25-1.jpg",
        caption: "A shrine of the Asante Traditional Buildings beside Kumasi, a World Heritage Site.",
        credit: "Joy Agyepong · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Joy Agyepong",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Kentikrono_Shrine%2C_Kumasi.jpg",
      },
      {
        file: "/photos/level-25-2.jpg",
        caption: "Kente cloth woven in narrow strips, each pattern carrying a name and a meaning.",
        credit: "Warmglow · CC0 · Wikimedia Commons",
        author: "Warmglow",
        licence: "CC0",
        source: "https://commons.wikimedia.org/wiki/File:Kente_patterns%2C_Tafi%2C_Volta_region.jpg",
      },
      {
        file: "/photos/level-25-3.jpg",
        caption: "A street in Kumasi, the capital of the Asante kingdom and its great market.",
        credit: "Maven Egote · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Maven Egote",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Kronum_Kumasi_2018-11-08_(130246).jpg",
      },
    ],
    fr: [
      {
        file: "/photos/level-25-1.jpg",
        caption: "Un sanctuaire des bâtiments traditionnels asante près de Kumasi, site du patrimoine mondial.",
        credit: "Joy Agyepong · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Joy Agyepong",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Kentikrono_Shrine%2C_Kumasi.jpg",
      },
      {
        file: "/photos/level-25-2.jpg",
        caption: "Le tissu kente tissé en bandes étroites, chaque motif portant un nom et un sens.",
        credit: "Warmglow · CC0 · Wikimedia Commons",
        author: "Warmglow",
        licence: "CC0",
        source: "https://commons.wikimedia.org/wiki/File:Kente_patterns%2C_Tafi%2C_Volta_region.jpg",
      },
      {
        file: "/photos/level-25-3.jpg",
        caption: "Une rue de Kumasi, capitale du royaume asante et de son grand marché.",
        credit: "Maven Egote · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Maven Egote",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Kronum_Kumasi_2018-11-08_(130246).jpg",
      },
    ],
  },
  study: {
    en: {
      essay: ["In the forests of what is now Ghana, the Akan peoples were organised in small states when Osei Tutu and his priest Okomfo Anokye united them around 1700. The Golden Stool, said to have come down from the sky, stood for the whole nation rather than for the king.", "Kumasi became the capital of a kingdom that grew on gold, kola and, later, cocoa, and the Asantehene ruled with the queen mother and a council of chiefs. Kente cloth, adinkra symbols and the Odwira festival gave the kingdom a culture of its own, and inheritance passed through the mother's line.", "Britain held forts on the coast and fought a series of wars with Asante through the nineteenth century. Wolseley burned Kumasi in 1874, and in 1896 Prempeh I was exiled; in 1900 the queen mother Yaa Asantewaa led the last war against a governor who demanded the Golden Stool.", "The kingdom became part of the Gold Coast colony, and the Asante region joined the independent Ghana of Kwame Nkrumah in 1957. The Asantehene still holds his office, and the surviving shrines and courtyard houses are a World Heritage Site."],
      timeline: [
        { year: "1701", text: "The Asante defeat Denkyira at Feyiase and win their freedom." },
        { year: "1874", text: "Wolseley takes and burns Kumasi." },
        { year: "1896", text: "The British exile Prempeh I and declare a protectorate." },
        { year: "1900", text: "Yaa Asantewaa leads the war of the Golden Stool." },
        { year: "1901", text: "Asante is annexed to the Gold Coast colony." },
        { year: "1957", text: "Ghana becomes independent, with the Asante region inside it." },
      ],
      people: [
        {
          name: "Osei Tutu",
          text: "The Asante king who united the Akan states and made Kumasi his capital.",
        },
        {
          name: "Okomfo Anokye",
          text: "The priest and counsellor who is bound to the coming of the Golden Stool.",
        },
        {
          name: "Yaa Asantewaa",
          text: "The queen mother of Ejisu who led the war of 1900 against the British.",
        },
        { name: "Prempeh I", text: "The Asante king exiled to the Seychelles in 1896." },
        { name: "Opoku Ware", text: "The Asante king who extended the kingdom after Osei Tutu." },
      ],
      places: [
        { name: "Kumasi", text: "The capital of Asante, with its royal court and its great market." },
        {
          name: "Cape Coast Castle",
          text: "The British fort on the coast that faced the Asante across the forest.",
        },
        {
          name: "Lake Bosumtwi",
          text: "The crater lake near Kumasi that the Asante hold to be sacred.",
        },
        {
          name: "The Asante Traditional Buildings",
          text: "The last shrines and courtyard houses of the kingdom, a World Heritage Site.",
        },
        { name: "Feyiase", text: "The battlefield of 1701 where the Asante defeated Denkyira." },
      ],
      glossary: [
        {
          term: "Asantehene",
          text: "The title of the ruler of Asante, who governs with the queen mother and the chiefs.",
        },
        {
          term: "Golden Stool",
          text: "The object that stands for the whole Asante nation, and not for the king.",
        },
        {
          term: "kente",
          text: "The cloth woven in narrow strips and sewn together, worn for ceremonies.",
        },
        { term: "adinkra", text: "The stamped symbols that carry the proverbs of the Akan." },
        { term: "Odwira", text: "The festival that renews the nation and honours the ancestors." },
      ],
    },
    fr: {
      essay: ["Dans les forêts de l'actuel Ghana, les peuples akan étaient organisés en petits États quand Osei Tutu et son prêtre Okomfo Anokye les ont unis vers 1700. Le Tabouret d'or, dit descendu du ciel, représentait la nation entière plutôt que le roi.", "Kumasi est devenue la capitale d'un royaume qui s'est enrichi de l'or, de la kola et, plus tard, du cacao, et l'Asantehene gouvernait avec la reine mère et un conseil de chefs. Le kente, les symboles adinkra et la fête de l'Odwira ont donné au royaume une culture propre, et l'héritage passait par la ligne maternelle.", "La Grande-Bretagne tenait des forts sur la côte et a mené une série de guerres contre l'Asante tout au long du XIXe siècle. Wolseley a brûlé Kumasi en 1874, et en 1896 Prempeh Ier a été exilé ; en 1900, la reine mère Yaa Asantewaa a conduit la dernière guerre, contre un gouverneur qui exigeait le Tabouret d'or.", "Le royaume a été rattaché à la colonie de la Côte de l'Or, et la région asante a rejoint le Ghana indépendant de Kwame Nkrumah en 1957. L'Asantehene exerce encore sa charge, et les sanctuaires et maisons à cour survivants sont un site du patrimoine mondial."],
      timeline: [
        { year: "1701", text: "Les Asante battent le Denkyira à Feyiase et conquièrent leur liberté." },
        { year: "1874", text: "Wolseley prend et brûle Kumasi." },
        { year: "1896", text: "Les Britanniques exilent Prempeh Ier et déclarent un protectorat." },
        { year: "1900", text: "Yaa Asantewaa conduit la guerre du Tabouret d'or." },
        { year: "1901", text: "L'Asante est annexé à la colonie de la Côte de l'Or." },
        { year: "1957", text: "Le Ghana devient indépendant, avec la région asante." },
      ],
      people: [
        {
          name: "Osei Tutu",
          text: "Le roi asante qui a uni les États akan et fait de Kumasi sa capitale.",
        },
        { name: "Okomfo Anokye", text: "Le prêtre et conseiller lié à la venue du Tabouret d'or." },
        {
          name: "Yaa Asantewaa",
          text: "La reine mère d'Ejisu qui a conduit la guerre de 1900 contre les Britanniques.",
        },
        { name: "Prempeh Ier", text: "Le roi asante exilé aux Seychelles en 1896." },
        { name: "Opoku Ware", text: "Le roi asante qui a étendu le royaume après Osei Tutu." },
      ],
      places: [
        { name: "Kumasi", text: "La capitale de l'Asante, avec sa cour royale et son grand marché." },
        {
          name: "Cape Coast Castle",
          text: "Le fort britannique de la côte, face à l'Asante à travers la forêt.",
        },
        { name: "Le lac Bosumtwi", text: "Le lac de cratère près de Kumasi, sacré pour les Asante." },
        {
          name: "Les bâtiments traditionnels asante",
          text: "Les derniers sanctuaires et maisons à cour du royaume, site du patrimoine mondial.",
        },
        { name: "Feyiase", text: "Le champ de bataille de 1701 où les Asante ont vaincu le Denkyira." },
      ],
      glossary: [
        {
          term: "Asantehene",
          text: "Le titre du souverain de l'Asante, qui gouverne avec la reine mère et les chefs.",
        },
        {
          term: "Tabouret d'or",
          text: "L'objet qui représente la nation asante entière, et non le roi.",
        },
        {
          term: "kente",
          text: "Le tissu tissé en bandes étroites et cousues ensemble, porté lors des cérémonies.",
        },
        { term: "adinkra", text: "Les symboles imprimés qui portent les proverbes akan." },
        { term: "Odwira", text: "La fête qui renouvelle la nation et honore les ancêtres." },
      ],
    },
  },
  questions: [
    {
      question: "Which people founded the Asante kingdom in the forests of what is now Ghana?",
      options: ["The Akan", "The Yoruba", "The Fon", "The Ewe"],
      correct: 0,
      fact: "The Asante were one of the Akan peoples, who shared a language, a matrilineal family and a gold trade.",
      source: { label: "Encyclopaedia Britannica, \"Akan\"" },
    },
    {
      question: "Which object, said to have come down from the sky, is held to be the soul of the Asante nation?",
      options: ["The Golden Stool", "The Sword of State", "The royal umbrella", "The brass pan"],
      correct: 0,
      fact: "The Golden Stool stands for the whole nation rather than for the king, and nobody is allowed to sit on it.",
      source: { label: "Encyclopaedia Britannica, \"Golden Stool\"" },
    },
    {
      question: "Which Asante king joined the Akan states into one kingdom around 1700?",
      options: ["Osei Tutu", "Osei Bonsu", "Opoku Ware", "Prempeh I"],
      correct: 0,
      fact: "Osei Tutu made Kumasi his capital and united the Akan states under the Golden Stool.",
      source: { label: "Encyclopaedia Britannica, \"Osei Tutu\"" },
    },
    {
      question: "Which priest is remembered as the one who called down the Golden Stool?",
      options: ["Okomfo Anokye", "Tano", "Ntim Gyakari", "Osei Kofi"],
      correct: 0,
      fact: "Okomfo Anokye was the priest and counsellor of Osei Tutu, and the Golden Stool is bound to his name.",
      source: { label: "Encyclopaedia Britannica, \"Asante\"" },
    },
    {
      question: "Which city became the capital of the Asante kingdom?",
      options: ["Kumasi", "Accra", "Cape Coast", "Tamale"],
      correct: 0,
      fact: "Kumasi grew around the royal court, its great market and the guilds of goldsmiths, weavers and drummers.",
      source: { label: "Encyclopaedia Britannica, \"Kumasi\"" },
    },
    {
      question: "What is the title of the ruler of Asante?",
      options: ["Asantehene", "Oba", "Alaafin", "Kabaka"],
      correct: 0,
      fact: "The Asantehene rules with the queen mother and a council of chiefs, and the office still exists in Ghana today.",
      source: { label: "Encyclopaedia Britannica, \"Asante\"" },
    },
    {
      question: "Which neighbouring kingdom did the Asante defeat to win their freedom in 1701?",
      options: ["Denkyira", "Dahomey", "Benin", "Oyo"],
      correct: 0,
      fact: "The defeat of Denkyira at Feyiase in 1701 made Asante the leading power of the Gold Coast interior.",
      source: { label: "Encyclopaedia Britannica, \"Denkyira\"" },
    },
    {
      question: "Which cloth, woven in narrow strips, is worn for Asante ceremonies?",
      options: ["Kente", "Bogolan", "Raffia", "Dyed wrapper"],
      correct: 0,
      fact: "Kente is woven in strips that are sewn together, and each pattern carries a name and a meaning.",
      source: { label: "Encyclopaedia Britannica, \"kente\"" },
    },
    {
      question: "Which stamped symbols carry the proverbs of the Akan?",
      options: ["Adinkra symbols", "Cuneiform", "Hieroglyphs", "Tifinagh"],
      correct: 0,
      fact: "Adinkra are printed on cloth with a calabash stamp, and each symbol stands for a proverb or a principle.",
      source: { label: "Encyclopaedia Britannica, \"adinkra\"" },
    },
    {
      question: "What did the Asante use as their main money?",
      options: ["Gold dust", "Cowrie shells alone", "Silver coins", "Salt bars"],
      correct: 0,
      fact: "Gold dust was weighed with brass weights, and every market kept its own scales and its own weigher.",
      source: { label: "Encyclopaedia Britannica, \"Asante\"" },
    },
    {
      question: "Which festival renews the Asante nation and honours the ancestors?",
      options: ["Odwira", "Famadihana", "Timkat", "Eid"],
      correct: 0,
      fact: "At Odwira the chiefs renew their allegiance, the ancestors are remembered and the nation is cleansed.",
      source: { label: "Encyclopaedia Britannica, \"Odwira\"" },
    },
    {
      question: "How was inheritance counted in the Asante kingdom?",
      options: ["Through the mother's line", "Through the father's line", "Through the elders", "Through the king"],
      correct: 0,
      fact: "The Asante traced descent through the mother, and the abusua, the matrilineal family, owned land and offices.",
      source: { label: "Encyclopaedia Britannica, \"Akan\"" },
    },
    {
      question: "Which crater lake lies near Kumasi?",
      options: ["Lake Bosumtwi", "Lake Volta", "Lake Chad", "Lake Malawi"],
      correct: 0,
      fact: "Lake Bosumtwi fills an old meteorite crater, and the Asante hold it to be sacred.",
      source: { label: "Encyclopaedia Britannica, \"Lake Bosumtwi\"" },
    },
    {
      question: "Which British officer led the expedition that burned Kumasi in 1874?",
      options: ["Garnet Wolseley", "Charles Gordon", "Robert Baden-Powell", "Frederick Lugard"],
      correct: 0,
      fact: "Garnet Wolseley took and burned Kumasi in 1874, and the palace was destroyed with it.",
      source: { label: "Encyclopaedia Britannica, \"Asante\"" },
    },
    {
      question: "Which queen mother led the Asante in the war of 1900?",
      options: ["Yaa Asantewaa", "Nana Yaa", "Akosua", "Ama"],
      correct: 0,
      fact: "Yaa Asantewaa, the queen mother of Ejisu, led the last great war against the British in 1900.",
      source: { label: "Encyclopaedia Britannica, \"Yaa Asantewaa\"" },
    },
    {
      question: "What did the British governor demand in 1900 that helped start the war?",
      options: ["The Golden Stool", "The kente cloth", "The crown jewels", "The war drums"],
      correct: 0,
      fact: "The governor demanded to sit on the Golden Stool, a demand no Asante could accept.",
      source: { label: "Encyclopaedia Britannica, \"Yaa Asantewaa\"" },
    },
    {
      question: "Which Asante king was exiled by the British in 1896?",
      options: ["Prempeh I", "Osei Tutu", "Opoku Ware", "Osei Bonsu"],
      correct: 0,
      fact: "Prempeh I was arrested and exiled to the Seychelles, and the kingdom was declared a British protectorate.",
      source: { label: "Encyclopaedia Britannica, \"Prempeh I\"" },
    },
    {
      question: "Which surviving Asante shrines and courtyard houses are a World Heritage Site?",
      options: ["The Asante Traditional Buildings", "The forts of Elmina", "The royal palace of Kumasi", "The slave castles"],
      correct: 0,
      fact: "The Asante Traditional Buildings are the last shrines and houses of their kind, built from earth and timber.",
      source: {
        label: "UNESCO World Heritage List, Asante Traditional Buildings",
        url: "https://whc.unesco.org/en/list/35/",
      },
    },
    {
      question: "Which crop, brought from the Americas, became the great export of the Gold Coast?",
      options: ["Cocoa", "Coffee", "Cotton", "Rubber"],
      correct: 0,
      fact: "Cocoa was brought in from Fernando Po in 1879, and farmers of the Asante and Akyem forests made Ghana its leading grower.",
      source: { label: "Encyclopaedia Britannica, \"cocoa\"" },
    },
    {
      question: "Which country, the first in West Africa to win independence, grew out of the Gold Coast?",
      options: ["Ghana", "Nigeria", "Sierra Leone", "Togo"],
      correct: 0,
      fact: "Ghana became independent in 1957, and the Asante region was part of the new country from the start.",
      source: { label: "Encyclopaedia Britannica, \"Ghana\"" },
    },
    {
      question: "Which European power kept forts on the Gold Coast and fought the Asante wars?",
      options: ["Britain", "Portugal", "Spain", "Belgium"],
      correct: 0,
      fact: "Britain held forts such as Cape Coast Castle and fought the Asante in a series of wars through the nineteenth century.",
      source: { label: "Encyclopaedia Britannica, \"Cape Coast Castle\"" },
    },
  ],
  fr: {
    title: "L'empire asante",
    subtitle: "Kumasi et le Tabouret d'or",
    region: "Forêt akan",
    questions: [
      {
        question: "Quel peuple a fondé le royaume asante dans les forêts de l'actuel Ghana ?",
        options: ["Les Akan", "Les Yoruba", "Les Fon", "Les Ewe"],
        fact: "Les Asante étaient l'un des peuples akan, qui partageaient une langue, une famille matrilinéaire et le commerce de l'or.",
        source: "Encyclopaedia Britannica, notice « Akan »",
      },
      {
        question: "Quel objet, dit descendu du ciel, est tenu pour l'âme de la nation asante ?",
        options: ["Le Tabouret d'or", "L'épée d'État", "Le parasol royal", "Le plateau de laiton"],
        fact: "Le Tabouret d'or représente la nation entière plutôt que le roi, et personne n'a le droit de s'y asseoir.",
        source: "Encyclopaedia Britannica, notice « Golden Stool »",
      },
      {
        question: "Quel roi asante a réuni les États akan en un royaume vers 1700 ?",
        options: ["Osei Tutu", "Osei Bonsu", "Opoku Ware", "Prempeh Ier"],
        fact: "Osei Tutu a fait de Kumasi sa capitale et a uni les États akan sous le Tabouret d'or.",
        source: "Encyclopaedia Britannica, notice « Osei Tutu »",
      },
      {
        question: "Quel prêtre est resté célèbre pour avoir fait descendre le Tabouret d'or ?",
        options: ["Okomfo Anokye", "Tano", "Ntim Gyakari", "Osei Kofi"],
        fact: "Okomfo Anokye était le prêtre et le conseiller d'Osei Tutu, et le Tabouret d'or est lié à son nom.",
        source: "Encyclopaedia Britannica, notice « Asante »",
      },
      {
        question: "Quelle ville est devenue la capitale du royaume asante ?",
        options: ["Kumasi", "Accra", "Cape Coast", "Tamale"],
        fact: "Kumasi s'est développée autour de la cour royale, de son grand marché et des corps d'orfèvres, de tisserands et de tambours.",
        source: "Encyclopaedia Britannica, notice « Kumasi »",
      },
      {
        question: "Quel est le titre du souverain de l'Asante ?",
        options: ["Asantehene", "Oba", "Alaafin", "Kabaka"],
        fact: "L'Asantehene gouverne avec la reine mère et un conseil de chefs, et la charge existe encore au Ghana aujourd'hui.",
        source: "Encyclopaedia Britannica, notice « Asante »",
      },
      {
        question: "Quel royaume voisin les Asante ont-ils vaincu pour conquérir leur liberté en 1701 ?",
        options: ["Le Denkyira", "Le Dahomey", "Le Bénin", "L'Oyo"],
        fact: "La défaite du Denkyira à Feyiase en 1701 a fait de l'Asante la première puissance de l'intérieur de la Côte de l'Or.",
        source: "Encyclopaedia Britannica, notice « Denkyira »",
      },
      {
        question: "Quel tissu, tissé en bandes étroites, se porte lors des cérémonies asante ?",
        options: ["Le kente", "Le bogolan", "Le raphia", "Le pagne teint"],
        fact: "Le kente est tissé en bandes cousues ensemble, et chaque motif porte un nom et un sens.",
        source: "Encyclopaedia Britannica, notice « kente »",
      },
      {
        question: "Quels symboles imprimés portent les proverbes akan ?",
        options: ["Les symboles adinkra", "Le cunéiforme", "Les hiéroglyphes", "Le tifinagh"],
        fact: "Les adinkra sont imprimés sur le tissu avec un tampon de calebasse, et chaque symbole tient un proverbe ou un principe.",
        source: "Encyclopaedia Britannica, notice « adinkra »",
      },
      {
        question: "Qu'utilisaient les Asante comme principale monnaie ?",
        options: ["La poudre d'or", "Les cauris seuls", "Les pièces d'argent", "Les barres de sel"],
        fact: "La poudre d'or se pesait avec des poids de laiton, et chaque marché tenait sa propre balance et son peseur.",
        source: "Encyclopaedia Britannica, notice « Asante »",
      },
      {
        question: "Quelle fête renouvelle la nation asante et honore les ancêtres ?",
        options: ["L'Odwira", "Le famadihana", "Le timkat", "L'aïd"],
        fact: "À l'Odwira, les chefs renouvellent leur allégeance, les ancêtres sont honorés et la nation est purifiée.",
        source: "Encyclopaedia Britannica, notice « Odwira »",
      },
      {
        question: "Comment comptait-on l'héritage dans le royaume asante ?",
        options: ["Par la ligne maternelle", "Par la ligne paternelle", "Par les anciens", "Par le roi"],
        fact: "Les Asante comptaient la descendance par la mère, et l'abusua, la famille matrilinéaire, détenait terres et charges.",
        source: "Encyclopaedia Britannica, notice « Akan »",
      },
      {
        question: "Quel lac de cratère se trouve près de Kumasi ?",
        options: ["Le lac Bosumtwi", "Le lac Volta", "Le lac Tchad", "Le lac Malawi"],
        fact: "Le lac Bosumtwi remplit un ancien cratère de météorite, et les Asante le tiennent pour sacré.",
        source: "Encyclopaedia Britannica, notice « Lake Bosumtwi »",
      },
      {
        question: "Quel officier britannique a conduit l'expédition qui a brûlé Kumasi en 1874 ?",
        options: ["Garnet Wolseley", "Charles Gordon", "Robert Baden-Powell", "Frederick Lugard"],
        fact: "Garnet Wolseley a pris et brûlé Kumasi en 1874, et le palais a été détruit avec la ville.",
        source: "Encyclopaedia Britannica, notice « Asante »",
      },
      {
        question: "Quelle reine mère a dirigé les Asante dans la guerre de 1900 ?",
        options: ["Yaa Asantewaa", "Nana Yaa", "Akosua", "Ama"],
        fact: "Yaa Asantewaa, reine mère d'Ejisu, a conduit la dernière grande guerre contre les Britanniques en 1900.",
        source: "Encyclopaedia Britannica, notice « Yaa Asantewaa »",
      },
      {
        question: "Que le gouverneur britannique a-t-il exigé en 1900, contribuant au déclenchement de la guerre ?",
        options: ["Le Tabouret d'or", "Le tissu kente", "Les joyaux de la couronne", "Les tambours de guerre"],
        fact: "Le gouverneur a exigé de s'asseoir sur le Tabouret d'or, une demande qu'aucun Asante ne pouvait accepter.",
        source: "Encyclopaedia Britannica, notice « Yaa Asantewaa »",
      },
      {
        question: "Quel roi asante a été exilé par les Britanniques en 1896 ?",
        options: ["Prempeh Ier", "Osei Tutu", "Opoku Ware", "Osei Bonsu"],
        fact: "Prempeh Ier a été arrêté et exilé aux Seychelles, et le royaume a été déclaré protectorat britannique.",
        source: "Encyclopaedia Britannica, notice « Prempeh I »",
      },
      {
        question: "Quels sanctuaires et maisons à cour asante subsistants sont un site du patrimoine mondial ?",
        options: ["Les bâtiments traditionnels asante", "Les forts d'Elmina", "Le palais royal de Kumasi", "Les châteaux des esclaves"],
        fact: "Les bâtiments traditionnels asante sont les derniers sanctuaires et maisons de leur genre, bâtis de terre et de bois.",
        source: "Liste du patrimoine mondial de l'UNESCO, Bâtiments traditionnels ashantis",
      },
      {
        question: "Quelle culture, venue des Amériques, est devenue la grande exportation de la Côte de l'Or ?",
        options: ["Le cacao", "Le café", "Le coton", "Le caoutchouc"],
        fact: "Le cacao a été introduit depuis Fernando Po en 1879, et les paysans des forêts asante et akyem ont fait du Ghana le premier producteur.",
        source: "Encyclopaedia Britannica, notice « cocoa »",
      },
      {
        question: "Quel pays, le premier d'Afrique de l'Ouest à conquérir son indépendance, est né de la Côte de l'Or ?",
        options: ["Le Ghana", "Le Nigeria", "La Sierra Leone", "Le Togo"],
        fact: "Le Ghana est devenu indépendant en 1957, et la région asante faisait partie du nouveau pays dès le départ.",
        source: "Encyclopaedia Britannica, notice « Ghana »",
      },
      {
        question: "Quelle puissance européenne tenait des forts sur la Côte de l'Or et a fait les guerres asante ?",
        options: ["La Grande-Bretagne", "Le Portugal", "L'Espagne", "La Belgique"],
        fact: "La Grande-Bretagne tenait des forts comme Cape Coast Castle et a combattu les Asante lors d'une série de guerres au XIXe siècle.",
        source: "Encyclopaedia Britannica, notice « Cape Coast Castle »",
      },
    ],
  },
};
