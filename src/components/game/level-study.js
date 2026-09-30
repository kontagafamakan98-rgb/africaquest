/**
 * The study material of a level: everything a player reads before the quiz.
 *
 * A level is one lesson about one period, and a lesson is more than a paragraph
 * and a list of answers. What is kept here is the material a teacher would hand
 * out for that period, in five parts:
 *
 *   - the essay, in several paragraphs, which is the history itself;
 *   - the timeline, the dated moments that hold the period together;
 *   - the people, the names worth carrying away from the level;
 *   - the places, the same for the map;
 *   - the words, the vocabulary a reader needs to read the sources.
 *
 * Both languages are written side by side in one entry, so a level that is
 * translated in one direction and not the other is visible in the file itself
 * rather than in a screen somebody has to open. The lesson screen draws them in
 * that order, and the tests read the same structure back.
 *
 * It is a module of its own, read by the lesson screen and by nothing else: the
 * map draws the levels from the brief and never downloads a word of this.
 */

/**
 * The shape of one language of one level.
 *
 * Written out as a comment rather than as a type because this is a browser
 * program with no type declarations of its own, and the tests read the same
 * fields back from the real content.
 *
 * @typedef {object} Study
 * @property {string[]} essay      the history, one paragraph per entry
 * @property {{ year: string, text: string }[]} timeline
 * @property {{ name: string, text: string }[]} people
 * @property {{ name: string, text: string }[]} places
 * @property {{ term: string, text: string }[]} glossary
 */

export const LEVEL_STUDY = {
  1: {
    en: {
      essay: [
        "Ancient Egypt grew along the Nile, the river that flooded every summer and left the black silt the fields were planted in. The Egyptians called their country Kemet, the black land, after that soil, and the flood was the centre of their year. Around 3100 BC the kings of the south united Upper and Lower Egypt, and from then on one crown ruled the whole valley.",
        "The Old Kingdom raised the pyramids at Giza, the largest stone buildings the world had yet made. The pharaoh was held to be a god on earth, and the state around him organised the labour, the grain and the writing. Scribes learned the hundreds of signs of the hieroglyphic script and kept the accounts on rolls of papyrus.",
        "The Middle and New Kingdoms moved the capital south to Thebes. Hatshepsut ruled as pharaoh and sent a fleet down the Red Sea to Punt, Akhenaten raised the sun disk above the other gods, and Ramesses II covered the valley with temples and colossal statues. Armies reached Nubia, Libya and Syria, and the empire of the Nile met the empires of the Euphrates.",
        "In the last centuries Egypt was ruled from outside, first by Nubians, then by Persians, then by the Greek dynasty of the Ptolemies. Cleopatra VII, the last of them, lost her kingdom to Rome in 30 BC. The writing was forgotten until the Rosetta Stone, carved with the same text in three scripts, let Champollion read it again in 1822.",
      ],
      timeline: [
        { year: "c. 3100 BC", text: "Narmer unites Upper and Lower Egypt and the first dynasty rules from Memphis." },
        { year: "c. 2560 BC", text: "The Great Pyramid of Khufu is finished on the plateau of Giza." },
        { year: "c. 1479 BC", text: "Hatshepsut takes the throne and sends a trading fleet to the land of Punt." },
        { year: "1279 BC", text: "Ramesses II begins his reign and builds at Abu Simbel and Karnak." },
        { year: "196 BC", text: "The Rosetta Stone is carved with one text in three scripts." },
        { year: "30 BC", text: "Cleopatra VII dies and Egypt becomes a province of Rome." },
      ],
      people: [
        { name: "Narmer", text: "The king of the first dynasty, remembered for joining the two lands under one crown." },
        { name: "Hatshepsut", text: "A pharaoh of the eighteenth dynasty who ruled in her own name and traded with Punt." },
        { name: "Akhenaten", text: "The pharaoh who set the sun disk Aten above the other gods of Egypt." },
        { name: "Ramesses II", text: "The long reigning builder of Abu Simbel, Karnak and the great mortuary temples." },
        { name: "Champollion", text: "The scholar who read the hieroglyphs again in 1822." },
      ],
      places: [
        { name: "The Nile", text: "The river that flooded and made the fields, and carried the stone and the grain." },
        { name: "Giza", text: "The plateau of the three great pyramids and the Sphinx, beside modern Cairo." },
        { name: "Thebes", text: "The southern capital, with Karnak, Luxor temple and the Valley of the Kings." },
        { name: "Abu Simbel", text: "The rock temple of Ramesses II, cut apart and raised when the dam was built." },
        { name: "Rosetta", text: "The Nile town where the stone that broke the code was found in 1799." },
      ],
      glossary: [
        { term: "hieroglyph", text: "A sign of the Egyptian writing, one of hundreds standing for a word or a sound." },
        { term: "pharaoh", text: "The king of Egypt, first called per-aa, which means the great house." },
        { term: "Kemet", text: "The black land, the name the Egyptians gave their own country." },
        { term: "papyrus", text: "Sheets pressed from river reeds, the writing surface of the scrolls." },
        { term: "mummification", text: "The drying and wrapping of a body so that it could be buried whole." },
      ],
    },
    fr: {
      essay: [
        "L'Égypte ancienne est née le long du Nil, le fleuve qui débordait chaque été et laissait le limon noir où l'on semait. Les Égyptiens appelaient leur pays Kemet, la terre noire, d'après ce limon, et la crue était le centre de leur année. Vers 3100 av. J.-C., les rois du sud ont uni la Haute et la Basse-Égypte, et une seule couronne a dès lors gouverné toute la vallée.",
        "L'Ancien Empire a élevé les pyramides de Gizeh, les plus grands édifices de pierre que le monde eût encore construits. Le pharaon passait pour un dieu sur terre, et l'État qui l'entourait organisait le travail, le grain et l'écriture. Les scribes apprenaient les centaines de signes de l'écriture hiéroglyphique et tenaient les comptes sur des rouleaux de papyrus.",
        "Le Moyen et le Nouvel Empire ont installé la capitale plus au sud, à Thèbes. Hatchepsout a régné comme pharaon et envoyé une flotte en mer Rouge vers le pays de Pount, Akhenaton a placé le disque solaire au-dessus des autres dieux, et Ramsès II a couvert la vallée de temples et de statues colossales. Ses armées ont atteint la Nubie, la Libye et la Syrie, et l'empire du Nil a rencontré ceux de l'Euphrate.",
        "Dans les derniers siècles, l'Égypte a été gouvernée de l'extérieur, d'abord par les Nubiens, puis par les Perses, puis par la dynastie grecque des Ptolémées. Cléopâtre VII, la dernière d'entre eux, a perdu son royaume au profit de Rome en 30 av. J.-C. L'écriture a été oubliée jusqu'à ce que la pierre de Rosette, gravée du même texte en trois écritures, permette à Champollion de la relire en 1822.",
      ],
      timeline: [
        { year: "v. 3100 av. J.-C.", text: "Narmer unit la Haute et la Basse-Égypte, et la première dynastie règne depuis Memphis." },
        { year: "v. 2560 av. J.-C.", text: "La grande pyramide de Khoufou est achevée sur le plateau de Gizeh." },
        { year: "v. 1479 av. J.-C.", text: "Hatchepsout monte sur le trône et envoie une flotte commerciale au pays de Pount." },
        { year: "1279 av. J.-C.", text: "Ramsès II commence son règne et bâtit à Abou Simbel et à Karnak." },
        { year: "196 av. J.-C.", text: "La pierre de Rosette est gravée d'un même texte en trois écritures." },
        { year: "30 av. J.-C.", text: "Cléopâtre VII meurt et l'Égypte devient une province romaine." },
      ],
      people: [
        { name: "Narmer", text: "Le roi de la première dynastie, resté célèbre pour avoir réuni les deux pays sous une seule couronne." },
        { name: "Hatchepsout", text: "Un pharaon de la XVIIIe dynastie, qui a régné en son propre nom et commerçait avec Pount." },
        { name: "Akhenaton", text: "Le pharaon qui a placé le disque solaire Aton au-dessus des autres dieux d'Égypte." },
        { name: "Ramsès II", text: "Le bâtisseur au long règne, auteur d'Abou Simbel, de Karnak et des grands temples funéraires." },
        { name: "Champollion", text: "Le savant qui a relu les hiéroglyphes en 1822." },
      ],
      places: [
        { name: "Le Nil", text: "Le fleuve qui débordait, faisait les récoltes et portait la pierre comme le grain." },
        { name: "Gizeh", text: "Le plateau des trois grandes pyramides et du Sphinx, aux portes du Caire actuel." },
        { name: "Thèbes", text: "La capitale du sud, avec Karnak, le temple de Louxor et la Vallée des Rois." },
        { name: "Abou Simbel", text: "Le temple rupestre de Ramsès II, découpé et remonté lors de la construction du barrage." },
        { name: "Rosette", text: "La ville du delta où la pierre qui a brisé le code a été trouvée en 1799." },
      ],
      glossary: [
        { term: "hiéroglyphe", text: "Un signe de l'écriture égyptienne, l'un des centaines qui notent un mot ou un son." },
        { term: "pharaon", text: "Le roi d'Égypte, d'abord appelé per-aa, ce qui veut dire la grande maison." },
        { term: "Kemet", text: "La terre noire, le nom que les Égyptiens donnaient à leur propre pays." },
        { term: "papyrus", text: "Des feuilles pressées dans les roseaux du fleuve, la surface des rouleaux." },
        { term: "momification", text: "Le séchage et l'enveloppement d'un corps pour qu'il soit enterré entier." },
      ],
    },
  },

  2: {
    en: {
      essay: [
        "South of Egypt, on the Nile of what is today Sudan, the kingdom of Kush grew strong. Its first capital was Napata, below the holy mountain of Jebel Barkal, and its kings were buried in steep pyramids at El-Kurru and Nuri. The river gave it the same grain and the same route north that Egypt had, and the desert around it could be crossed but not farmed.",
        "In the eighth century BC the kings of Kush turned that route into a road of conquest. Piye marched north and took Egypt, and his successors ruled it for about a century as the twenty-fifth dynasty. They restored the temples of Thebes and Memphis, and their queens, the kandakes, commanded armies of their own.",
        "The court later moved south to Meroe, at the mouth of the Atbara, where the kingdom worked iron, traded gold and ivory to the Red Sea, and wrote a script of its own. Meroitic can be read by sound, and the language behind it is still not fully understood, which is one of the great open doors of African history.",
        "Axum to the east and the desert to the north wore the kingdom down, and in the fourth century Kush came apart. Three Christian Nubian kingdoms, Nobatia, Makuria and Alwa, took its place along the river, and their churches and painted walls carried the old world on for another eight hundred years.",
      ],
      timeline: [
        { year: "c. 1070 BC", text: "Kush breaks free of Egypt and its kings rule from Napata." },
        { year: "c. 730 BC", text: "Piye of Kush marches north and founds the twenty-fifth dynasty of Egypt." },
        { year: "c. 590 BC", text: "The court moves south to Meroe after an Egyptian raid on Napata." },
        { year: "c. 300 AD", text: "Meroe is a centre of iron working and of a writing of its own." },
        { year: "c. 350 AD", text: "Axum defeats Kush and the kingdom comes apart." },
      ],
      people: [
        { name: "Piye", text: "The Kushite king who took Egypt and left the record of the campaign on a stela." },
        { name: "Taharqa", text: "The best known pharaoh of the dynasty, a builder at Karnak and in Nubia." },
        { name: "Amanirenas", text: "A kandake who fought Rome, and whose bronze head was buried beneath a temple floor." },
        { name: "Ezana", text: "The Axumite king whose inscriptions record the end of the kingdom of Kush." },
      ],
      places: [
        { name: "Jebel Barkal", text: "The holy mountain above Napata, with its temples and its royal pyramids." },
        { name: "Napata", text: "The first capital, on the fourth cataract of the Nile." },
        { name: "Meroe", text: "The later capital, ringed by steep pyramids and by iron furnaces." },
        { name: "Naqa", text: "A temple town in the desert between the two capitals, with a Roman style kiosk." },
      ],
      glossary: [
        { term: "kandake", text: "The title of the Kushite queen, who ruled in her own right." },
        { term: "Meroitic", text: "The script of Kush, read by sound but not yet fully understood." },
        { term: "Nubia", text: "The stretch of the Nile between Aswan and the meeting of the rivers." },
        { term: "cataract", text: "A run of rapids and rocks that boats are carried past rather than sailed." },
        { term: "stela", text: "A slab of stone carved with an official record." },
      ],
    },
    fr: {
      essay: [
        "Au sud de l'Égypte, sur le Nil de l'actuel Soudan, le royaume de Koush s'est renforcé. Sa première capitale était Napata, sous la montagne sainte du Djebel Barkal, et ses rois étaient enterrés dans des pyramides à pentes raides, à El-Kourrou et à Nouri. Le fleuve lui donnait le même grain et la même route vers le nord que l'Égypte, et le désert alentour se traversait sans pouvoir se cultiver.",
        "Au VIIIe siècle av. J.-C., les rois de Koush ont changé cette route en chemin de conquête. Piânkhy est monté vers le nord et a pris l'Égypte, et ses successeurs l'ont gouvernée environ un siècle, comme vingt-cinquième dynastie. Ils ont restauré les temples de Thèbes et de Memphis, et leurs reines, les kandakés, commandaient leurs propres armées.",
        "La cour s'est ensuite installée plus au sud, à Méroé, à l'embouchure de l'Atbara, où le royaume travaillait le fer, commerçait l'or et l'ivoire vers la mer Rouge et écrivait une écriture à lui. Le méroïtique se lit par le son, et la langue qu'il note n'est pas encore pleinement comprise : c'est l'une des grandes portes ouvertes de l'histoire africaine.",
        "Axoum, à l'est, et le désert, au nord, ont usé le royaume, et au IVe siècle Koush s'est disloqué. Trois royaumes chrétiens nubiens, la Nobatie, la Makourie et Alwa, ont pris sa place le long du fleuve, et leurs églises et leurs murs peints ont porté l'ancien monde huit cents ans de plus.",
      ],
      timeline: [
        { year: "v. 1070 av. J.-C.", text: "Koush s'affranchit de l'Égypte et ses rois gouvernent depuis Napata." },
        { year: "v. 730 av. J.-C.", text: "Piânkhy de Koush monte vers le nord et fonde la XXVe dynastie d'Égypte." },
        { year: "v. 590 av. J.-C.", text: "La cour descend à Méroé après un raid égyptien sur Napata." },
        { year: "v. 300 apr. J.-C.", text: "Méroé est un centre du travail du fer et d'une écriture qui lui est propre." },
        { year: "v. 350 apr. J.-C.", text: "Axoum l'emporte sur Koush et le royaume se disloque." },
      ],
      people: [
        { name: "Piânkhy", text: "Le roi koushite qui a pris l'Égypte et laissé le récit de la campagne sur une stèle." },
        { name: "Taharqa", text: "Le pharaon le plus connu de la dynastie, bâtisseur à Karnak et en Nubie." },
        { name: "Amanirenas", text: "Une kandaké qui a combattu Rome, et dont la tête de bronze a été enterrée sous un temple." },
        { name: "Ézana", text: "Le roi axoumite dont les inscriptions rapportent la fin du royaume de Koush." },
      ],
      places: [
        { name: "Djebel Barkal", text: "La montagne sainte au-dessus de Napata, avec ses temples et ses pyramides royales." },
        { name: "Napata", text: "La première capitale, sur la quatrième cataracte du Nil." },
        { name: "Méroé", text: "La capitale suivante, entourée de pyramides raides et de fourneaux à fer." },
        { name: "Naqa", text: "Une ville de temples dans le désert entre les deux capitales, avec un kiosque de style romain." },
      ],
      glossary: [
        { term: "kandaké", text: "Le titre de la reine koushite, qui gouvernait en son propre nom." },
        { term: "méroïtique", text: "L'écriture de Koush, lue par le son mais pas encore entièrement comprise." },
        { term: "Nubie", text: "Le ruban du Nil entre Assouan et la rencontre des fleuves." },
        { term: "cataracte", text: "Une suite de rapides et de rochers que les bateaux sont portés plutôt que navigués." },
        { term: "stèle", text: "Une dalle de pierre gravée d'un texte officiel." },
      ],
    },
  },

  3: {
    en: {
      essay: [
        "Between the eleventh and fifteenth centuries, in the granite hills of southern Africa, a stone city rose that traded gold and ivory as far as the Indian Ocean. Great Zimbabwe was the capital of a state that held the gold routes of the interior, and its merchants were paid in glass beads, porcelain and cloth carried up from the coast.",
        "Its walls were built of blocks cut to fit together without mortar. The Hill Complex was the royal and ceremonial centre, and the Great Enclosure below it, with its high curved wall and its conical tower, is the largest ancient structure south of the Sahara. Between the two, in the valley, more than eighteen thousand people lived at the height of the city.",
        "The wealth of the state came from cattle and from gold, and the gold went down to Sofala, where it was loaded onto the monsoon dhows. The rulers drew their authority from the religion of Mwari, and the priests of the shrines gave the mambo, as the ruler was called, his right to rule. Soapstone birds stood on the walls, and each was a monument to a reign.",
        "Too many cattle and too many fields wore out the land around the capital, and in the fifteenth century the gold trade moved north towards the Zambezi. The court moved with it, and the stone city was left standing. European explorers found it in 1871 and spent decades refusing to believe that Africans had built it, until archaeology put the question beyond doubt.",
      ],
      timeline: [
        { year: "c. 1100", text: "The first stone walls are raised on the hill of Great Zimbabwe." },
        { year: "c. 1300", text: "The Great Enclosure is built and the city reaches its widest extent." },
        { year: "c. 1350", text: "More than eighteen thousand people live in and around the capital." },
        { year: "c. 1450", text: "The gold trade shifts north and the court moves with it." },
        { year: "1871", text: "Karl Mauch reaches the ruins and Europe begins to argue about who built them." },
        { year: "1905", text: "David Randall-MacIver shows that the walls are the work of African builders." },
      ],
      people: [
        { name: "The mambo", text: "The title of the ruler of the plateau state, honoured from a stone enclosure." },
        { name: "The Mwari priests", text: "The religious authority whose shrines gave the rulers their right to rule." },
        { name: "Karl Mauch", text: "The German explorer who reached the ruins in 1871 and misread them." },
        { name: "David Randall-MacIver", text: "The archaeologist who showed in 1905 that the walls were African work." },
      ],
      places: [
        { name: "Great Zimbabwe", text: "The stone capital of the plateau, with the Hill Complex and the Great Enclosure." },
        { name: "Sofala", text: "The port where the gold of the interior was loaded onto the dhows." },
        { name: "Mapungubwe", text: "The earlier hilltop kingdom to the south, where the gold work begins." },
        { name: "The Zambezi", text: "The river valley that took the trade, and the court, north in the fifteenth century." },
      ],
      glossary: [
        { term: "dry stone", text: "Walling built of shaped blocks laid together without mortar." },
        { term: "mambo", text: "The title of the ruler of the Zimbabwe state." },
        { term: "soapstone", text: "The soft stone the birds and the monoliths of the site are carved from." },
        { term: "Indian Ocean trade", text: "The monsoon route that carried gold, beads, porcelain and cloth." },
        { term: "dzimbabwe", text: "The Shona word for the stone houses the rulers built, which gave the site its name." },
      ],
    },
    fr: {
      essay: [
        "Entre le XIe et le XVe siècle, dans les collines de granite de l'Afrique australe, une cité de pierre s'est élevée, qui commerçait l'or et l'ivoire jusqu'à l'océan Indien. Le Grand Zimbabwe était la capitale d'un État qui contrôlait les routes de l'or de l'intérieur, et ses marchands étaient payés en perles de verre, en porcelaine et en tissus remontés de la côte.",
        "Ses murs sont faits de blocs taillés pour s'emboîter sans mortier. Le complexe de la colline était le centre royal et cérémoniel, et la Grande Enceinte en contrebas, avec sa haute muraille courbe et sa tour conique, est le plus grand édifice ancien au sud du Sahara. Entre les deux, dans la vallée, plus de dix-huit mille personnes vivaient à l'apogée de la cité.",
        "La richesse de l'État venait du bétail et de l'or, et l'or descendait vers Sofala, où on le chargeait sur les boutres de mousson. Les souverains tiraient leur autorité de la religion de Mwari, et les prêtres des sanctuaires donnaient au mambo, comme on appelait le roi, son droit de gouverner. Des oiseaux de stéatite se dressaient sur les murs, chacun monument d'un règne.",
        "Trop de bétail et trop de champs ont épuisé la terre autour de la capitale, et au XVe siècle le commerce de l'or s'est déplacé vers le nord, vers le Zambèze. La cour a suivi, et la cité de pierre est restée debout. Les explorateurs européens l'ont trouvée en 1871 et ont passé des décennies à refuser de croire que des Africains l'avaient bâtie, jusqu'à ce que l'archéologie tranche la question.",
      ],
      timeline: [
        { year: "v. 1100", text: "Les premiers murs de pierre sont élevés sur la colline du Grand Zimbabwe." },
        { year: "v. 1300", text: "La Grande Enceinte est construite et la cité atteint sa plus large étendue." },
        { year: "v. 1350", text: "Plus de dix-huit mille personnes vivent dans la capitale et autour d'elle." },
        { year: "v. 1450", text: "Le commerce de l'or se déplace vers le nord et la cour suit." },
        { year: "1871", text: "Karl Mauch atteint les ruines et l'Europe commence à disputer de leurs bâtisseurs." },
        { year: "1905", text: "David Randall-MacIver démontre que les murs sont l'oeuvre de bâtisseurs africains." },
      ],
      people: [
        { name: "Le mambo", text: "Le titre du souverain de l'État du plateau, honoré depuis une enceinte de pierre." },
        { name: "Les prêtres de Mwari", text: "L'autorité religieuse dont les sanctuaires donnaient aux rois leur droit de régner." },
        { name: "Karl Mauch", text: "L'explorateur allemand qui a atteint les ruines en 1871 et les a mal comprises." },
        { name: "David Randall-MacIver", text: "L'archéologue qui a montré en 1905 que les murs étaient une oeuvre africaine." },
      ],
      places: [
        { name: "Le Grand Zimbabwe", text: "La capitale de pierre du plateau, avec le complexe de la colline et la Grande Enceinte." },
        { name: "Sofala", text: "Le port où l'on chargeait l'or de l'intérieur sur les boutres." },
        { name: "Mapungubwe", text: "Le royaume plus ancien, sur une hauteur au sud, où commence le travail de l'or." },
        { name: "Le Zambèze", text: "La vallée fluviale qui a emporté le commerce, et la cour, vers le nord au XVe siècle." },
      ],
      glossary: [
        { term: "pierre sèche", text: "Une maçonnerie de blocs taillés posés sans mortier." },
        { term: "mambo", text: "Le titre du souverain de l'État du Zimbabwe." },
        { term: "stéatite", text: "La pierre tendre dans laquelle sont taillés les oiseaux et les monolithes du site." },
        { term: "commerce de l'océan Indien", text: "La route de mousson qui portait l'or, les perles, la porcelaine et les tissus." },
        { term: "dzimbabwe", text: "Le mot shona pour les maisons de pierre des souverains, qui a donné son nom au site." },
      ],
    },
  },

  4: {
    en: {
      essay: [
        "In the thirteenth century, Sundiata Keita united the Mandinka kingdoms and founded an empire that reached from the Atlantic to the bend of the Niger. Its wealth came from two things everybody needed, gold from the forests of the south and salt from the mines of the Sahara, and the empire taxed both as they passed through.",
        "Its cities became centres of learning. Timbuktu and Djenne drew students and jurists from across the western Sudan, and the books copied and sold there are still kept in the city. The scholars of Sankore wrote on law, astronomy, medicine and history, and the trade in manuscripts was a trade like any other, with its own market and its own prices.",
        "Mansa Musa, who ruled in the fourteenth century, is remembered for his pilgrimage to Mecca. He took so much gold with him that its price in Cairo fell for years, and he came back with architects, scholars and books. His journey put the empire on the maps of Europe, where a king of Mali appears holding a gold nugget.",
        "After the death of its strongest kings the subject peoples broke away one by one. Songhai took the cities of the Niger bend in the fifteenth century, and the empire that had held the whole western Sudan shrank back to its Mandinka heartland, where its memory was kept by the griots and by the epic of Sundiata.",
      ],
      timeline: [
        { year: "c. 1235", text: "Sundiata Keita wins at Kirina and the empire of Mali is founded." },
        { year: "1324", text: "Mansa Musa makes his pilgrimage and spends so much gold that Cairo's price falls." },
        { year: "c. 1327", text: "The Sankore mosque and its schools make Timbuktu a centre of learning." },
        { year: "1353", text: "Ibn Battuta travels through Mali and describes its court and its customs." },
        { year: "c. 1468", text: "Songhai takes Timbuktu and Mali loses the cities of the Niger bend." },
      ],
      people: [
        { name: "Sundiata Keita", text: "The founder of the empire, remembered in the epic of the Mandinka." },
        { name: "Mansa Musa", text: "The pilgrim king whose gold shook the price of the metal in Cairo." },
        { name: "Ibn Battuta", text: "The traveller from Tangier whose account is one of the best pictures of Mali." },
        { name: "Sonni Ali", text: "The Songhai king who took Timbuktu from the empire of Mali." },
      ],
      places: [
        { name: "Niani", text: "The capital of the empire, on a tributary of the upper Niger." },
        { name: "Timbuktu", text: "The city of the Sankore schools, the book trade and the desert caravans." },
        { name: "Djenne", text: "The market town with the great mud mosque, at the edge of the inland delta." },
        { name: "Gao", text: "The eastern end of the Niger trade, later the capital of Songhai." },
      ],
      glossary: [
        { term: "mansa", text: "The Mande word for king, the title the rulers of Mali carried." },
        { term: "griot", text: "The hereditary storyteller and musician who kept the history of a family." },
        { term: "trans-Saharan trade", text: "The caravan route that carried salt south and gold north." },
        { term: "Sankore", text: "The mosque and school of Timbuktu where the scholars taught." },
        { term: "inland delta", text: "The wide marsh of the Niger where the river spreads out before the desert." },
      ],
    },
    fr: {
      essay: [
        "Au XIIIe siècle, Soundjata Keïta a unifié les royaumes mandingues et fondé un empire qui allait de l'Atlantique à la boucle du Niger. Sa richesse venait de deux produits dont tout le monde avait besoin, l'or des forêts du sud et le sel des mines du Sahara, et l'empire taxait l'un et l'autre à leur passage.",
        "Ses villes sont devenues des centres de savoir. Tombouctou et Djenné attiraient étudiants et juristes de tout le Soudan occidental, et les livres copiés et vendus là sont encore conservés dans la ville. Les lettrés de Sankoré écrivaient sur le droit, l'astronomie, la médecine et l'histoire, et le commerce des manuscrits était un commerce comme un autre, avec son marché et ses prix.",
        "Mansa Moussa, qui a régné au XIVe siècle, reste connu pour son pèlerinage à La Mecque. Il emportait tant d'or que son prix a baissé au Caire pendant des années, et il est revenu avec des architectes, des savants et des livres. Son voyage a mis l'empire sur les cartes d'Europe, où un roi du Mali apparaît tenant une pépite.",
        "Après la mort de ses rois les plus forts, les peuples soumis se sont détachés l'un après l'autre. Le Songhaï a pris les villes de la boucle du Niger au XVe siècle, et l'empire qui avait tenu tout le Soudan occidental s'est replié sur son coeur mandingue, où sa mémoire a été gardée par les griots et par l'épopée de Soundjata.",
      ],
      timeline: [
        { year: "v. 1235", text: "Soundjata Keïta l'emporte à Kirina et l'empire du Mali est fondé." },
        { year: "1324", text: "Mansa Moussa fait son pèlerinage et dépense tant d'or que son prix baisse au Caire." },
        { year: "v. 1327", text: "La mosquée de Sankoré et ses écoles font de Tombouctou un centre de savoir." },
        { year: "1353", text: "Ibn Battuta traverse le Mali et en décrit la cour et les coutumes." },
        { year: "v. 1468", text: "Le Songhaï prend Tombouctou et le Mali perd les villes de la boucle du Niger." },
      ],
      people: [
        { name: "Soundjata Keïta", text: "Le fondateur de l'empire, chanté dans l'épopée mandingue." },
        { name: "Mansa Moussa", text: "Le roi pèlerin dont l'or a fait chuter le prix du métal au Caire." },
        { name: "Ibn Battuta", text: "Le voyageur de Tanger, dont le récit est l'un des meilleurs portraits du Mali." },
        { name: "Sonni Ali", text: "Le roi songhaï qui a pris Tombouctou à l'empire du Mali." },
      ],
      places: [
        { name: "Niani", text: "La capitale de l'empire, sur un affluent du haut Niger." },
        { name: "Tombouctou", text: "La ville des écoles de Sankoré, du commerce du livre et des caravanes du désert." },
        { name: "Djenné", text: "La ville-marché à la grande mosquée de terre, à la lisière du delta intérieur." },
        { name: "Gao", text: "Le terminus oriental du commerce du Niger, plus tard capitale du Songhaï." },
      ],
      glossary: [
        { term: "mansa", text: "Le mot mandé pour roi, le titre que portaient les souverains du Mali." },
        { term: "griot", text: "Le conteur et musicien héréditaire qui gardait l'histoire d'une famille." },
        { term: "commerce transsaharien", text: "La route caravanière qui portait le sel vers le sud et l'or vers le nord." },
        { term: "Sankoré", text: "La mosquée et l'école de Tombouctou où enseignaient les lettrés." },
        { term: "delta intérieur", text: "La vaste zone marécageuse où le Niger s'étale avant le désert." },
      ],
    },
  },

  5: {
    en: {
      essay: [
        "In the highlands of what are now Ethiopia and Eritrea, the kingdom of Axum grew rich on the trade of the Red Sea. From its port of Adulis it sent ivory, gold, incense and hides to Rome, India and Arabia, and brought back cloth, glass, wine and metalwork. A handbook written for sailors in the first century lists exactly what was bought and sold there.",
        "The kingdom minted its own coins in gold, silver and bronze, which almost no other state outside Rome and Persia did. Its kings raised obelisks cut from single blocks of stone, the tallest ever attempted by human hands, and their tombs lie beneath the field of stelae. The script of its inscriptions grew into the Ge'ez writing that Ethiopia still uses.",
        "In the fourth century King Ezana adopted Christianity, making Axum one of the first states in the world to do so. Frumentius, a Syrian who had been shipwrecked on the coast, became the first bishop, and the church he founded kept its own liturgy and its own language through every century that followed.",
        "For a few decades in the sixth century Axum ruled part of southern Arabia across the water. But when Islam spread along the Red Sea in the seventh century, the trade that had made the kingdom rich slipped away from Adulis, and the centre of power moved south into the highlands, where the Christian kingdom went on for another thousand years.",
      ],
      timeline: [
        { year: "c. 100 AD", text: "The Periplus of the Erythraean Sea describes Adulis and the goods traded there." },
        { year: "c. 270", text: "Axum strikes coins of gold, silver and bronze in the name of its own kings." },
        { year: "c. 330", text: "King Ezana adopts Christianity and the kingdom is baptised." },
        { year: "c. 520", text: "Kaleb of Axum crosses the Red Sea and rules part of southern Arabia." },
        { year: "c. 640", text: "The spread of Islam turns the Red Sea trade away from Adulis." },
      ],
      people: [
        { name: "Ezana", text: "The king who made Christianity the religion of the kingdom of Axum." },
        { name: "Frumentius", text: "The Syrian teacher who became the first bishop of the Ethiopian church." },
        { name: "Kaleb", text: "The Axumite king whose armies crossed the sea to Himyar." },
        { name: "Ella Amida", text: "The king whose coins carry the first Christian symbols struck in the kingdom." },
      ],
      places: [
        { name: "Adulis", text: "The Red Sea port where the goods of the interior met the ships." },
        { name: "Axum", text: "The capital of the kingdom, with its obelisks and its royal tombs." },
        { name: "Yeha", text: "The older temple town of the highlands, a capital before Axum." },
        { name: "Himyar", text: "The kingdom in southern Arabia ruled by Axum for a few decades." },
      ],
      glossary: [
        { term: "Ge'ez", text: "The written language of the kingdom, still the language of the Ethiopian liturgy." },
        { term: "obelisk", text: "A tall pillar cut from a single block of stone and raised as a royal monument." },
        { term: "incense", text: "The fragrant resin, above all frankincense, that the highlands traded to the sea." },
        { term: "coinage", text: "The striking of metal money in the name of the king." },
        { term: "Periplus", text: "The sailors' handbook that lists the ports and the goods of the Red Sea route." },
      ],
    },
    fr: {
      essay: [
        "Dans les hauts plateaux de l'actuelle Éthiopie et de l'Érythrée, le royaume d'Axoum s'est enrichi par le commerce de la mer Rouge. De son port d'Adoulis, il envoyait ivoire, or, encens et peaux vers Rome, l'Inde et l'Arabie, et rapportait tissus, verre, vin et ouvrages de métal. Un manuel écrit pour les marins au Ier siècle énumère précisément ce qu'on y achetait et y vendait.",
        "Le royaume frappait sa propre monnaie, en or, en argent et en bronze, ce que presque aucun autre État hors de Rome et de Perse ne faisait. Ses rois dressaient des obélisques taillés dans un seul bloc de pierre, les plus hauts jamais tentés par des mains humaines, et leurs tombeaux s'étendent sous le champ de stèles. L'écriture de ses inscriptions est devenue le guèze, que l'Éthiopie utilise encore.",
        "Au IVe siècle, le roi Ézana a adopté le christianisme, faisant d'Axoum l'un des premiers États du monde à le faire. Frumentius, un Syrien naufragé sur la côte, est devenu le premier évêque, et l'Église qu'il a fondée a gardé sa liturgie et sa langue à travers tous les siècles suivants.",
        "Pendant quelques décennies du VIe siècle, Axoum a gouverné une partie du sud de l'Arabie, de l'autre côté de l'eau. Mais quand l'islam s'est répandu le long de la mer Rouge au VIIe siècle, le commerce qui avait fait la richesse du royaume a glissé loin d'Adoulis, et le centre du pouvoir s'est déplacé vers le sud, dans les hauts plateaux, où le royaume chrétien a duré mille ans de plus.",
      ],
      timeline: [
        { year: "v. 100 apr. J.-C.", text: "Le Périple de la mer Érythrée décrit Adoulis et les marchandises qu'on y échange." },
        { year: "v. 270", text: "Axoum frappe des monnaies d'or, d'argent et de bronze au nom de ses propres rois." },
        { year: "v. 330", text: "Le roi Ézana adopte le christianisme et le royaume est baptisé." },
        { year: "v. 520", text: "Kaléb d'Axoum traverse la mer Rouge et gouverne une partie du sud de l'Arabie." },
        { year: "v. 640", text: "L'expansion de l'islam détourne d'Adoulis le commerce de la mer Rouge." },
      ],
      people: [
        { name: "Ézana", text: "Le roi qui a fait du christianisme la religion du royaume d'Axoum." },
        { name: "Frumentius", text: "Le maître syrien devenu le premier évêque de l'Église éthiopienne." },
        { name: "Kaléb", text: "Le roi axoumite dont les armées ont traversé la mer jusqu'à Himyar." },
        { name: "Ella Amida", text: "Le roi dont les monnaies portent les premiers symboles chrétiens frappés dans le royaume." },
      ],
      places: [
        { name: "Adoulis", text: "Le port de la mer Rouge où les marchandises de l'intérieur rencontraient les navires." },
        { name: "Axoum", text: "La capitale du royaume, avec ses obélisques et ses tombeaux royaux." },
        { name: "Yeha", text: "La plus ancienne ville de temples des hauts plateaux, une capitale avant Axoum." },
        { name: "Himyar", text: "Le royaume du sud de l'Arabie gouverné par Axoum pendant quelques décennies." },
      ],
      glossary: [
        { term: "guèze", text: "La langue écrite du royaume, encore celle de la liturgie éthiopienne." },
        { term: "obélisque", text: "Un haut pilier taillé dans un seul bloc de pierre et dressé comme monument royal." },
        { term: "encens", text: "La résine odorante, surtout l'oliban, que les hauts plateaux vendaient à la mer." },
        { term: "monnayage", text: "La frappe de la monnaie de métal au nom du roi." },
        { term: "Périple", text: "Le manuel des marins qui énumère les ports et les marchandises de la route de la mer Rouge." },
      ],
    },
  },

  6: {
    en: {
      essay: [
        "The largest empire in African history grew along the great bend of the Niger, where the caravan routes of the Sahara met the river. From there it could tax the salt that came south from the desert and the gold that came north from the forests, and hold the two together with cavalry and with boats.",
        "Under Sonni Ali, who took the towns of the Niger one after another, and then under Askia Muhammad, who took the throne in 1493, Songhai held Timbuktu and Djenne and made the desert caravans pay. Askia Muhammad divided the empire into provinces, appointed governors, and put the tax on salt at the centre of the state's income.",
        "Its army mixed cavalry and infantry with a fleet of river boats, and the boats counted as much as the horses. The scholars of Timbuktu wrote on law, astronomy, medicine and history, and the manuscripts they copied are still kept in the city today, in families and in libraries.",
        "In 1591 a Moroccan army crossed the Sahara with firearms and broke the Songhai cavalry at Tondibi. The empire came apart within a generation, its provinces became small states, and the trade routes of the Niger bend found other masters.",
      ],
      timeline: [
        { year: "c. 1464", text: "Sonni Ali becomes king of Songhai and begins to take the towns of the Niger." },
        { year: "1493", text: "Askia Muhammad takes the throne and reforms the empire." },
        { year: "c. 1510", text: "Leo Africanus visits Timbuktu and describes its book trade and its scholars." },
        { year: "1591", text: "A Moroccan army with firearms defeats Songhai at Tondibi." },
        { year: "c. 1600", text: "The empire breaks into smaller states and the trade routes shift." },
      ],
      people: [
        { name: "Sonni Ali", text: "The king who made Songhai the leading power of the Niger bend." },
        { name: "Askia Muhammad", text: "The reformer who organised the provinces and the tax on salt." },
        { name: "Leo Africanus", text: "The traveller whose book carried Timbuktu to European readers." },
        { name: "Ahmad al-Mansur", text: "The Moroccan sultan who sent his army across the Sahara." },
      ],
      places: [
        { name: "Gao", text: "The capital of the empire, on the Niger." },
        { name: "Timbuktu", text: "The city of the scholars and of the manuscript trade." },
        { name: "Djenne", text: "The trading town at the inland delta, with its mosque of earth." },
        { name: "Tondibi", text: "The battlefield where the Songhai cavalry met gunpowder." },
      ],
      glossary: [
        { term: "askia", text: "The title taken by the rulers after Askia Muhammad, the one who is not to be contested." },
        { term: "salt caravan", text: "The train of camels that carried the slabs of desert salt south." },
        { term: "cavalry", text: "Soldiers who fight from horseback, the arm the desert trade paid for." },
        { term: "manuscript", text: "A book written by hand, the form every text took before printing." },
        { term: "arquebus", text: "The early firearm whose fire broke the Songhai cavalry." },
      ],
    },
    fr: {
      essay: [
        "Le plus grand empire de l'histoire africaine s'est développé le long de la boucle du Niger, au croisement des routes caravanières du Sahara et du fleuve. De là, il pouvait taxer le sel qui descendait du désert et l'or qui remontait des forêts, et tenir les deux ensemble par la cavalerie et par les bateaux.",
        "Sous Sonni Ali, qui a pris les villes du Niger l'une après l'autre, puis sous Askia Muhammad, monté sur le trône en 1493, le Songhaï tenait Tombouctou et Djenné et faisait payer les caravanes du désert. Askia Muhammad a divisé l'empire en provinces, nommé des gouverneurs et placé l'impôt sur le sel au centre des revenus de l'État.",
        "Son armée mêlait cavalerie et infanterie à une flotte de bateaux fluviaux, et les bateaux comptaient autant que les chevaux. Les lettrés de Tombouctou écrivaient sur le droit, l'astronomie, la médecine et l'histoire, et les manuscrits qu'ils copiaient sont encore conservés dans la ville, dans les familles et dans les bibliothèques.",
        "En 1591, une armée marocaine a traversé le Sahara avec des armes à feu et a brisé la cavalerie songhaï à Tondibi. L'empire s'est disloqué en une génération, ses provinces sont devenues de petits États, et les routes commerciales de la boucle du Niger ont trouvé d'autres maîtres.",
      ],
      timeline: [
        { year: "v. 1464", text: "Sonni Ali devient roi du Songhaï et commence à prendre les villes du Niger." },
        { year: "1493", text: "Askia Muhammad prend le trône et réforme l'empire." },
        { year: "v. 1510", text: "Léon l'Africain visite Tombouctou et décrit son commerce du livre et ses lettrés." },
        { year: "1591", text: "Une armée marocaine armée d'armes à feu bat le Songhaï à Tondibi." },
        { year: "v. 1600", text: "L'empire se divise en États plus petits et les routes commerciales se déplacent." },
      ],
      people: [
        { name: "Sonni Ali", text: "Le roi qui a fait du Songhaï la première puissance de la boucle du Niger." },
        { name: "Askia Muhammad", text: "Le réformateur qui a organisé les provinces et l'impôt sur le sel." },
        { name: "Léon l'Africain", text: "Le voyageur dont le livre a fait connaître Tombouctou aux lecteurs d'Europe." },
        { name: "Ahmad al-Mansour", text: "Le sultan marocain qui a envoyé son armée à travers le Sahara." },
      ],
      places: [
        { name: "Gao", text: "La capitale de l'empire, sur le Niger." },
        { name: "Tombouctou", text: "La ville des lettrés et du commerce des manuscrits." },
        { name: "Djenné", text: "La ville marchande du delta intérieur, avec sa mosquée de terre." },
        { name: "Tondibi", text: "Le champ de bataille où la cavalerie songhaï a rencontré la poudre." },
      ],
      glossary: [
        { term: "askia", text: "Le titre pris par les souverains après Askia Muhammad, celui qu'on ne conteste pas." },
        { term: "caravane de sel", text: "Le convoi de chameaux qui descendait les plaques de sel du désert." },
        { term: "cavalerie", text: "Les soldats qui combattent à cheval, l'arme que payait le commerce du désert." },
        { term: "manuscrit", text: "Un livre écrit à la main, la forme de tout texte avant l'imprimerie." },
        { term: "arquebuse", text: "L'arme à feu ancienne dont le tir a brisé la cavalerie songhaï." },
      ],
    },
  },

  7: {
    en: {
      essay: [
        "In the hills of what is now KwaZulu-Natal, a young chief named Shaka turned a small clan into a kingdom in the early nineteenth century. He organised the army by age, so that men served together all their lives, and had the regiments live in royal towns that answered to the king alone.",
        "He shortened the throwing spear into a stabbing weapon for close fighting, and drilled the regiments to advance behind their shields in a closed line. The amabutho, the age regiments, were the nation in arms: young men served in them before they could marry, and the king held the cattle and the land in trust for all.",
        "After Shaka died in 1828 the kingdom held its ground against Boer trekkers and then against British columns. At the Ncome river in 1838 the Zulu army defeated a Boer commando, and in 1879 Cetshwayo's regiments destroyed a British camp at Isandlwana on the same day.",
        "The kingdom could not replace what it lost in that war, and Ulundi was burnt the same year. Zululand was divided into thirteen chiefdoms, then annexed to Natal in 1897, and its name survives in the province of KwaZulu-Natal.",
      ],
      timeline: [
        { year: "c. 1816", text: "Shaka becomes chief of the Zulu and begins to build a kingdom." },
        { year: "1828", text: "Shaka dies and Dingane takes the throne." },
        { year: "1838", text: "Zulu regiments defeat a Boer commando at the Ncome river." },
        { year: "1879", text: "The British invade; the army wins at Isandlwana and Ulundi is burnt." },
        { year: "1897", text: "Zululand is annexed to Natal and the kingdom ends." },
      ],
      people: [
        { name: "Shaka", text: "The chief who built the Zulu kingdom and remade its army." },
        { name: "Dingane", text: "Shaka's successor, who faced the Boer trekkers." },
        { name: "Cetshwayo", text: "The king whose army destroyed the British camp at Isandlwana." },
        { name: "Mpande", text: "The king who ruled between Dingane and Cetshwayo." },
      ],
      places: [
        { name: "Ulundi", text: "The royal town and the seat of the kingdom, burnt in 1879." },
        { name: "Isandlwana", text: "The hill where the Zulu army destroyed a British column." },
        { name: "The Ncome", text: "The river where the Voortrekkers were defeated in 1838." },
        { name: "KwaZulu-Natal", text: "The province that carries the name of the kingdom today." },
      ],
      glossary: [
        { term: "amabutho", text: "The age regiments, the young men who served the king before they could marry." },
        { term: "iklwa", text: "The short stabbing spear introduced for close fighting." },
        { term: "induna", text: "An officer or a chief appointed by the king." },
        { term: "kraal", text: "A homestead, or a royal enclosure of huts." },
        { term: "Voortrekker", text: "A Boer settler who moved inland from the Cape in the 1830s." },
      ],
    },
    fr: {
      essay: [
        "Dans les collines de l'actuel KwaZulu-Natal, un jeune chef nommé Shaka a transformé un petit clan en royaume au début du XIXe siècle. Il a organisé l'armée par classes d'âge, si bien que les hommes servaient ensemble toute leur vie, et installé les régiments dans des villes royales qui ne répondaient qu'au roi.",
        "Il a raccourci la lance de jet en arme d'estoc pour le combat rapproché, et il a entraîné les régiments à avancer derrière leurs boucliers en ligne serrée. Les amabutho, les régiments d'âge, étaient la nation en armes : les jeunes hommes y servaient avant de pouvoir se marier, et le roi détenait le bétail et la terre pour tous.",
        "Après la mort de Shaka en 1828, le royaume a tenu tête aux trekboers puis aux colonnes britanniques. À la rivière Ncome en 1838, l'armée zouloue a défait un commando boer, et en 1879 les régiments de Cetshwayo ont détruit un camp britannique à Isandlwana le même jour.",
        "Le royaume ne pouvait pas remplacer ce qu'il avait perdu dans cette guerre, et Ulundi a été brûlé la même année. Le Zoulouland a été partagé en treize chefferies, puis annexé au Natal en 1897, et son nom survit dans la province du KwaZulu-Natal.",
      ],
      timeline: [
        { year: "v. 1816", text: "Shaka devient chef des Zoulous et commence à bâtir un royaume." },
        { year: "1828", text: "Shaka meurt et Dingane prend le trône." },
        { year: "1838", text: "Les régiments zoulous défont un commando boer à la rivière Ncome." },
        { year: "1879", text: "Les Britanniques envahissent le pays ; l'armée gagne à Isandlwana et Ulundi est brûlé." },
        { year: "1897", text: "Le Zoulouland est annexé au Natal et le royaume prend fin." },
      ],
      people: [
        { name: "Shaka", text: "Le chef qui a bâti le royaume zoulou et refondu son armée." },
        { name: "Dingane", text: "Le successeur de Shaka, qui a affronté les trekboers." },
        { name: "Cetshwayo", text: "Le roi dont l'armée a détruit le camp britannique d'Isandlwana." },
        { name: "Mpande", text: "Le roi qui a gouverné entre Dingane et Cetshwayo." },
      ],
      places: [
        { name: "Ulundi", text: "La ville royale et le siège du royaume, brûlée en 1879." },
        { name: "Isandlwana", text: "La colline où l'armée zouloue a détruit une colonne britannique." },
        { name: "La Ncome", text: "La rivière où les Voortrekkers ont été défaits en 1838." },
        { name: "KwaZulu-Natal", text: "La province qui porte aujourd'hui le nom du royaume." },
      ],
      glossary: [
        { term: "amabutho", text: "Les régiments d'âge, les jeunes hommes qui servaient le roi avant de pouvoir se marier." },
        { term: "iklwa", text: "La lance courte d'estoc introduite pour le combat rapproché." },
        { term: "induna", text: "Un officier ou un chef nommé par le roi." },
        { term: "kraal", text: "Un enclos d'habitations, ou l'enceinte royale des cases." },
        { term: "Voortrekker", text: "Un colon boer parti du Cap vers l'intérieur dans les années 1830." },
      ],
    },
  },

  8: {
    en: {
      essay: [
        "After the Second World War the demand for independence spread across the continent. African soldiers had fought for their rulers in Europe and Asia, and they came home to colonies that still had no vote, no flag and no say in their own affairs. What had been a hope became a programme, with parties, newspapers and rallies.",
        "Ghana won its independence in 1957, the first country in West Africa to do so, and seventeen African states became independent in 1960 alone. France and Britain gave way in most of their colonies, some quickly, some after long argument, and the new states took their seats at the United Nations.",
        "Where the settlers would not go, the road was a war. Algeria won its independence in 1962 after eight years of fighting, Kenya in 1963 after the Mau Mau rising, and the Portuguese colonies only in 1975, after long armed struggles in Angola, Mozambique and Guinea-Bissau.",
        "The process was not finished in 1975. Zimbabwe became independent in 1980, Namibia in 1990, and South Sudan in 2011, which is how long it took in all. The decades that followed were not simple: the borders, the economies and the institutions all came out of colonial rule, and each new state had to build itself from there.",
      ],
      timeline: [
        { year: "1951", text: "Libya becomes the first African country to win independence after the war." },
        { year: "1957", text: "Ghana becomes independent, the first country in West Africa." },
        { year: "1960", text: "Seventeen African states become independent in a single year." },
        { year: "1962", text: "Algeria wins its independence after eight years of war." },
        { year: "1975", text: "The Portuguese colonies become independent after long armed struggles." },
        { year: "1994", text: "South Africa holds its first election in which everyone may vote." },
      ],
      people: [
        { name: "Kwame Nkrumah", text: "The leader of Ghana, the first country in West Africa to be free." },
        { name: "Ahmed Ben Bella", text: "A leader of the Algerian war and the country's first president." },
        { name: "Jomo Kenyatta", text: "The leader of Kenya at its independence in 1963." },
        { name: "Amilcar Cabral", text: "The thinker of the liberation of Guinea-Bissau and Cape Verde." },
      ],
      places: [
        { name: "Accra", text: "The capital of Ghana, where the first flag of a free West Africa was raised." },
        { name: "Algiers", text: "The capital of Algeria, the scene of the war of independence." },
        { name: "Nairobi", text: "The capital of Kenya, independent in 1963." },
        { name: "Windhoek", text: "The capital of Namibia, independent in 1990." },
      ],
      glossary: [
        { term: "independence", text: "Rule by a country's own government rather than by a foreign power." },
        { term: "nationalism", text: "The belief that a people should govern themselves." },
        { term: "pan-Africanism", text: "The idea that the peoples of Africa share a cause and should act together." },
        { term: "the OAU", text: "The Organisation of African Unity, founded in 1963 by the new states." },
        { term: "transition", text: "The years in which a colony became a state." },
      ],
    },
    fr: {
      essay: [
        "Après la Seconde Guerre mondiale, l'exigence d'indépendance s'est répandue sur tout le continent. Des soldats africains avaient combattu pour leurs maîtres en Europe et en Asie, et ils sont rentrés dans des colonies qui n'avaient toujours ni vote, ni drapeau, ni voix dans leurs propres affaires. Ce qui était un espoir est devenu un programme, avec des partis, des journaux et des meetings.",
        "Le Ghana a obtenu l'indépendance en 1957, le premier pays d'Afrique de l'Ouest à y parvenir, et dix-sept États africains sont devenus indépendants en 1960 seulement. La France et la Grande-Bretagne ont cédé dans la plupart de leurs colonies, certaines vite, d'autres après de longs débats, et les nouveaux États ont pris leur siège aux Nations unies.",
        "Là où les colons ne voulaient pas partir, la route était la guerre. L'Algérie a gagné son indépendance en 1962 après huit ans de combats, le Kenya en 1963 après la révolte des Mau Mau, et les colonies portugaises seulement en 1975, après de longues luttes armées en Angola, au Mozambique et en Guinée-Bissau.",
        "Le processus ne s'est pas achevé en 1975. Le Zimbabwe est devenu indépendant en 1980, la Namibie en 1990, et le Soudan du Sud en 2011 : c'est le temps qu'il a fallu en tout. Les décennies qui ont suivi n'ont pas été simples : les frontières, les économies et les institutions venaient toutes de la domination coloniale, et chaque nouvel État a dû se construire à partir de là.",
      ],
      timeline: [
        { year: "1951", text: "La Libye devient le premier pays africain indépendant après la guerre." },
        { year: "1957", text: "Le Ghana devient indépendant, le premier d'Afrique de l'Ouest." },
        { year: "1960", text: "Dix-sept États africains deviennent indépendants en une seule année." },
        { year: "1962", text: "L'Algérie gagne son indépendance après huit ans de guerre." },
        { year: "1975", text: "Les colonies portugaises deviennent indépendantes après de longues luttes armées." },
        { year: "1994", text: "L'Afrique du Sud tient sa première élection où tous peuvent voter." },
      ],
      people: [
        { name: "Kwame Nkrumah", text: "Le dirigeant du Ghana, premier pays libre d'Afrique de l'Ouest." },
        { name: "Ahmed Ben Bella", text: "Un dirigeant de la guerre d'Algérie et le premier président du pays." },
        { name: "Jomo Kenyatta", text: "Le dirigeant du Kenya à son indépendance en 1963." },
        { name: "Amilcar Cabral", text: "Le penseur de la libération de la Guinée-Bissau et du Cap-Vert." },
      ],
      places: [
        { name: "Accra", text: "La capitale du Ghana, où le premier drapeau d'une Afrique de l'Ouest libre a été hissé." },
        { name: "Alger", text: "La capitale de l'Algérie, théâtre de la guerre d'indépendance." },
        { name: "Nairobi", text: "La capitale du Kenya, indépendant en 1963." },
        { name: "Windhoek", text: "La capitale de la Namibie, indépendante en 1990." },
      ],
      glossary: [
        { term: "indépendance", text: "Le gouvernement d'un pays par ses propres institutions et non par une puissance étrangère." },
        { term: "nationalisme", text: "L'idée qu'un peuple doit se gouverner lui-même." },
        { term: "panafricanisme", text: "L'idée que les peuples d'Afrique partagent une cause et doivent agir ensemble." },
        { term: "l'OUA", text: "L'Organisation de l'unité africaine, fondée en 1963 par les nouveaux États." },
        { term: "transition", text: "Les années où une colonie est devenue un État." },
      ],
    },
  },

  9: {
    en: {
      essay: [
        "Every human being alive today belongs to a species that was born in Africa. More than 300,000 years ago our ancestors lived across the whole continent, from the hills of Morocco to the Ethiopian rift valley, and the oldest known fossils of our own species come from Jebel Irhoud in Morocco.",
        "The earliest stone tools come from the shores of Lake Turkana, and hand axes of the Acheulean kind were made in Africa for more than a million years before anyone thought of farming. Knapping a hand axe takes a plan, a steady hand and a memory of how the last one was made, which is a way of saying that the human mind has a long African history.",
        "The people of those long ages were not waiting for history to begin. They buried their dead with care, painted on rock, and carried ochre and shells hundreds of kilometres from where they were found. The rock art of the Sahara, from Tassili n'Ajjer to the Nile, shows a green savannah of elephants, giraffes and cattle that the desert has since swallowed.",
        "Then, around a hundred thousand years ago, groups left the continent and their descendants settled the whole world. Long before any kingdom existed, Africa was already carrying the entire human story, and it is still the continent with more genetic variety than all the others put together.",
      ],
      timeline: [
        { year: "c. 3.3 million years ago", text: "The oldest known stone tools are made at Lomekwi, by Lake Turkana." },
        { year: "c. 1.8 million years ago", text: "Hand axes of the Acheulean kind spread across the continent." },
        { year: "c. 315,000 years ago", text: "The oldest fossils of our own species are buried at Jebel Irhoud." },
        { year: "c. 100,000 years ago", text: "Groups leave Africa and their descendants settle the whole world." },
        { year: "c. 20,000 years ago", text: "Painters work in the caves of the Sahara and of southern Africa." },
      ],
      people: [
        { name: "The Lomekwi toolmakers", text: "The earliest known people to shape stone for a purpose." },
        { name: "Homo erectus", text: "The species whose long legs carried it out of Africa." },
        { name: "The Jebel Irhoud people", text: "The oldest known members of our own species." },
        { name: "The San painters", text: "The artists of southern Africa whose rock art is among the oldest in the world." },
      ],
      places: [
        { name: "Jebel Irhoud", text: "The Moroccan cave site of the oldest fossils of our species." },
        { name: "The Ethiopian rift valley", text: "The valley of early fossils such as Lucy, near Hadar." },
        { name: "Lake Turkana", text: "The Kenyan lake on whose shores the earliest stone tools were found." },
        { name: "Tassili n'Ajjer", text: "The Algerian plateau of thousands of rock paintings of a greener Sahara." },
      ],
      glossary: [
        { term: "hominin", text: "A member of the human line, and of the lines that share its ancestry." },
        { term: "Acheulean", text: "The long industry of large hand axes made across Africa." },
        { term: "stratigraphy", text: "The reading of layers of soil to put the things in them in order." },
        { term: "fossil", text: "The remains of a living thing preserved in rock." },
        { term: "rock art", text: "Pictures painted or carved on stone, the oldest writing of the human mind." },
      ],
    },
    fr: {
      essay: [
        "Tous les êtres humains vivants appartiennent à une espèce née en Afrique. Il y a plus de 300 000 ans, nos ancêtres vivaient sur tout le continent, des collines du Maroc à la vallée du Rift éthiopien, et les plus anciens fossiles connus de notre espèce viennent de Jebel Irhoud, au Maroc.",
        "Les plus anciens outils de pierre viennent des rives du lac Turkana, et on a fabriqué des bifaces acheuléens en Afrique pendant plus d'un million d'années avant que quiconque songe à cultiver la terre. Tailler un biface demande un plan, une main sûre et le souvenir de la façon dont le précédent a été fait : c'est une manière de dire que l'esprit humain a une longue histoire africaine.",
        "Les gens de ces temps longs n'attendaient pas que l'histoire commence. Ils enterraient leurs morts avec soin, peignaient sur la roche et transportaient de l'ocre et des coquillages à des centaines de kilomètres de leur origine. L'art rupestre du Sahara, du Tassili n'Ajjer au Nil, montre une savane verte d'éléphants, de girafes et de bovins que le désert a depuis engloutie.",
        "Puis, il y a environ cent mille ans, des groupes ont quitté le continent et leurs descendants ont peuplé le monde entier. Bien avant le premier royaume, l'Afrique portait déjà toute l'histoire humaine, et c'est encore le continent qui réunit plus de diversité génétique que tous les autres ensemble.",
      ],
      timeline: [
        { year: "v. 3,3 millions d'années", text: "Les plus anciens outils de pierre connus sont taillés à Lomekwi, près du lac Turkana." },
        { year: "v. 1,8 million d'années", text: "Les bifaces acheuléens se répandent sur le continent." },
        { year: "v. 315 000 ans", text: "Les plus anciens fossiles de notre espèce sont ensevelis à Jebel Irhoud." },
        { year: "v. 100 000 ans", text: "Des groupes quittent l'Afrique et leurs descendants peuplent le monde entier." },
        { year: "v. 20 000 ans", text: "Des peintres travaillent dans les grottes du Sahara et d'Afrique australe." },
      ],
      people: [
        { name: "Les tailleurs de Lomekwi", text: "Les plus anciens êtres connus à façonner la pierre pour un usage." },
        { name: "Homo erectus", text: "L'espèce dont les longues jambes l'ont portée hors d'Afrique." },
        { name: "Les habitants de Jebel Irhoud", text: "Les plus anciens membres connus de notre espèce." },
        { name: "Les peintres san", text: "Les artistes d'Afrique australe dont l'art rupestre compte parmi les plus anciens du monde." },
      ],
      places: [
        { name: "Jebel Irhoud", text: "La grotte marocaine des plus anciens fossiles de notre espèce." },
        { name: "La vallée du Rift éthiopien", text: "La vallée des premiers fossiles, comme Lucy, près de Hadar." },
        { name: "Le lac Turkana", text: "Le lac kényan sur les rives duquel les plus anciens outils ont été trouvés." },
        { name: "Le Tassili n'Ajjer", text: "Le plateau algérien aux milliers de peintures rupestres d'un Sahara plus vert." },
      ],
      glossary: [
        { term: "homine", text: "Un membre de la lignée humaine et des lignées qui partagent son ascendance." },
        { term: "acheuléen", text: "La longue industrie des grands bifaces taillés à travers l'Afrique." },
        { term: "stratigraphie", text: "La lecture des couches de sol pour ordonner ce qu'elles contiennent." },
        { term: "fossile", text: "Les restes d'un être vivant conservés dans la roche." },
        { term: "art rupestre", text: "Des images peintes ou gravées sur la pierre, la plus ancienne écriture de l'esprit humain." },
      ],
    },
  },

  10: {
    en: {
      essay: [
        "On the coast of what is now Tunisia, Phoenician sailors founded a city that would challenge Rome for the mastery of the Mediterranean. Carthage grew from a landing place on the trade route to the silver of Spain into the centre of a merchant empire with its own fleets and its own war.",
        "Its two harbours were cut by hand: a rectangular one for the merchant ships, and behind it a round basin ringed with ship sheds where the warships were kept, so that a fleet could be launched without a sail being seen from the sea. Its estates grew the olives and the grain that paid for the fleets, and its merchants dealt in gold, ivory and slaves along the African coast.",
        "With Hannibal, the city came closest to winning. His army crossed the Alps with elephants in 218 BC and beat the Romans in Italy again and again, but Carthage could not replace the soldiers, and Rome could. In 146 BC the city was destroyed, its ground ploughed and salted in the Roman story, and its land became the province of Africa.",
        "Beyond Carthage lay the Berber kingdoms of Numidia and Mauretania, whose kings, writers and one emperor left their mark on Rome itself. The province that followed Carthage fed the capital for centuries, and its harvest was carried across the sea in the grain ships that Rome counted on.",
      ],
      timeline: [
        { year: "c. 814 BC", text: "Phoenician settlers from Tyre found the city of Carthage." },
        { year: "c. 600 BC", text: "Carthaginian ships explore the Atlantic coast of Africa and of Europe." },
        { year: "264 BC", text: "The First Punic War begins between Carthage and Rome." },
        { year: "218 BC", text: "Hannibal crosses the Alps with elephants and invades Italy." },
        { year: "146 BC", text: "Rome destroys Carthage and makes the land a province." },
        { year: "c. 200 AD", text: "Rome's African provinces are among its richest and their grain feeds the capital." },
      ],
      people: [
        { name: "Dido", text: "The legendary founder of the city, remembered in the Roman story of Aeneas." },
        { name: "Hannibal Barca", text: "The general who took an army and elephants across the Alps." },
        { name: "Hamilcar Barca", text: "Hannibal's father, who held Sicily and then Spain for Carthage." },
        { name: "Juba I", text: "A king of Numidia who took the side of Carthage and lost his kingdom." },
        { name: "Apuleius", text: "The Latin writer born in Numidia whose novel is a classic of Rome." },
      ],
      places: [
        { name: "Carthage", text: "The city itself, with its two harbours and its hill of Byrsa." },
        { name: "Utica", text: "The older Phoenician port, north of Carthage, that later sided with Rome." },
        { name: "El Jem", text: "The Roman amphitheatre of the province of Africa, one of the largest ever built." },
        { name: "Numidia", text: "The Berber kingdom to the west, at times an ally and at times an enemy." },
      ],
      glossary: [
        { term: "Punic", text: "The Roman name for the Carthaginians, and for their language." },
        { term: "cothon", text: "The artificial basin, ringed with ship sheds, where the warships were kept." },
        { term: "amphora", text: "The tall pot in which oil, wine and fish sauce travelled by sea." },
        { term: "suffete", text: "The chief magistrate of Carthage, elected by its citizens." },
        { term: "tophet", text: "The sacred precinct of Carthage whose burials are debated to this day." },
      ],
    },
    fr: {
      essay: [
        "Sur la côte de l'actuelle Tunisie, des marins phéniciens ont fondé une ville qui allait disputer à Rome la maîtrise de la Méditerranée. Carthage est passée d'une escale sur la route de l'argent d'Espagne au centre d'un empire marchand, avec ses propres flottes et sa propre guerre.",
        "Ses deux ports étaient creusés à la main : l'un, rectangulaire, pour les navires marchands, et derrière lui un bassin rond entouré de cales où l'on gardait les navires de guerre, si bien qu'une flotte pouvait sortir sans qu'on en vît une voile depuis le large. Ses domaines produisaient l'huile et le blé qui payaient les flottes, et ses marchands traitaient l'or, l'ivoire et les captifs le long de la côte africaine.",
        "Avec Hannibal, la ville est passée au plus près de la victoire. Son armée a franchi les Alpes avec des éléphants en 218 av. J.-C. et a battu les Romains en Italie à plusieurs reprises, mais Carthage ne pouvait pas remplacer ses soldats, et Rome le pouvait. En 146 av. J.-C., la ville a été détruite, son sol labouré selon le récit romain, et sa terre est devenue la province d'Afrique.",
        "Au-delà de Carthage s'étendaient les royaumes berbères de Numidie et de Maurétanie, dont les rois, les écrivains et un empereur ont marqué Rome elle-même. La province qui a succédé à Carthage a nourri la capitale pendant des siècles, et sa récolte traversait la mer sur les navires de blé sur lesquels Rome comptait.",
      ],
      timeline: [
        { year: "v. 814 av. J.-C.", text: "Des colons phéniciens venus de Tyr fondent la ville de Carthage." },
        { year: "v. 600 av. J.-C.", text: "Les navires carthaginois explorent la côte atlantique de l'Afrique et de l'Europe." },
        { year: "264 av. J.-C.", text: "La première guerre punique commence entre Carthage et Rome." },
        { year: "218 av. J.-C.", text: "Hannibal franchit les Alpes avec ses éléphants et envahit l'Italie." },
        { year: "146 av. J.-C.", text: "Rome détruit Carthage et fait de la région une province." },
        { year: "v. 200 apr. J.-C.", text: "Les provinces africaines de Rome comptent parmi les plus riches et leur blé nourrit la capitale." },
      ],
      people: [
        { name: "Didon", text: "La fondatrice légendaire de la ville, liée au récit romain d'Énée." },
        { name: "Hannibal Barca", text: "Le général qui a fait passer une armée et des éléphants par les Alpes." },
        { name: "Hamilcar Barca", text: "Le père d'Hannibal, qui a tenu la Sicile puis l'Espagne pour Carthage." },
        { name: "Juba Ier", text: "Un roi de Numidie qui a pris le parti de Carthage et perdu son royaume." },
        { name: "Apulée", text: "L'écrivain latin né en Numidie, dont le roman est un classique de Rome." },
      ],
      places: [
        { name: "Carthage", text: "La ville elle-même, avec ses deux ports et sa colline de Byrsa." },
        { name: "Utique", text: "Le port phénicien plus ancien, au nord de Carthage, passé plus tard au camp de Rome." },
        { name: "El Jem", text: "L'amphithéâtre romain de la province d'Afrique, l'un des plus grands jamais bâtis." },
        { name: "Numidie", text: "Le royaume berbère de l'ouest, tour à tour allié et adversaire." },
      ],
      glossary: [
        { term: "punique", text: "Le nom romain des Carthaginois, et de leur langue." },
        { term: "cothon", text: "Le bassin artificiel, entouré de cales, où l'on gardait les navires de guerre." },
        { term: "amphore", text: "Le grand vase dans lequel l'huile, le vin et la sauce de poisson voyageaient par mer." },
        { term: "suffète", text: "Le magistrat en chef de Carthage, élu par ses citoyens." },
        { term: "tophèt", text: "L'enceinte sacrée de Carthage dont les sépultures sont encore discutées." },
      ],
    },
  },

  11: {
    en: {
      essay: [
        "Around three thousand years ago, farmers in the borderlands of Nigeria and Cameroon began to move. They carried iron tools, seed crops and their languages, and over two thousand years their descendants settled from the Great Lakes to the Cape, which is one of the largest movements of people the world has known.",
        "In central Nigeria, the Nok artists modelled heads of astonishing size and detail in clay. Their figures show people wearing beads and bracelets, and their furnaces show that iron was being smelted on the plateau at the same time as the farming spread, and that the two things travelled together.",
        "Iron made the difference: an axe that would clear woodland, a hoe that would break new soil, and a spear for hunting and for war. The Bantu languages travelled with the farmers, which is why more than three hundred million people speak one today, from Cameroon to Kenya and from Angola to South Africa.",
        "Where the farmers met hunter-gatherers such as the San or the Mbuti, the two ways of life traded and borrowed from each other. The farmers crossed the great rainforest of the Congo before they could reach the south, and the languages of the forest still carry the memory of that meeting.",
      ],
      timeline: [
        { year: "c. 1000 BC", text: "Iron working and farming spread west of the Niger and in the Cameroon highlands." },
        { year: "c. 500 BC", text: "Farming communities move into the rainforest and down the Congo river." },
        { year: "c. 500 BC to 200 AD", text: "The Nok culture makes terracotta heads and iron tools on the Jos plateau." },
        { year: "c. 300 AD", text: "Farmers reach the Great Lakes and the eastern savannah." },
        { year: "c. 500 AD", text: "Iron and farming reach southern Africa, and the ancestors of the Sotho and Tswana settle there." },
      ],
      people: [
        { name: "The Nok artists", text: "The sculptors of the terracotta heads of the Jos plateau." },
        { name: "The early Bantu farmers", text: "The communities whose speech became three hundred languages." },
        { name: "The Mbuti", text: "The forest hunter-gatherers of the Congo basin, who traded with the farmers." },
        { name: "The San", text: "The hunter-gatherers of southern Africa, whose languages carry click sounds." },
      ],
      places: [
        { name: "The Jos plateau", text: "The highland of the Nok terracottas and of the early iron furnaces." },
        { name: "The Congo basin", text: "The rainforest the farmers crossed on their way south." },
        { name: "The Great Lakes", text: "The region of the earliest Bantu farming communities in the east." },
        { name: "The Cameroon highlands", text: "One of the homelands of the Bantu languages." },
      ],
      glossary: [
        { term: "Bantu", text: "The family of languages that travelled with the farmers." },
        { term: "bloomery", text: "The furnace in which ore was smelted into a spongy mass of iron." },
        { term: "hunter-gatherer", text: "A way of life that lives from wild plants and animals rather than from fields." },
        { term: "terracotta", text: "Clay baked into a hard figure or a hard pot." },
        { term: "slash and burn", text: "The clearing of a field by fire, farmed for a few years and then left to recover." },
      ],
    },
    fr: {
      essay: [
        "Il y a environ trois mille ans, des agriculteurs des confins du Nigeria et du Cameroun se sont mis en marche. Ils emportaient des outils de fer, des semences et leurs langues, et en deux mille ans leurs descendants se sont installés des Grands Lacs jusqu'au Cap, l'un des plus grands mouvements de peuples que le monde ait connus.",
        "Au centre du Nigeria, les artistes nok ont modelé dans l'argile des têtes d'une taille et d'une finesse surprenantes. Leurs figures montrent des personnes portant perles et bracelets, et leurs fourneaux montrent que le fer était fondu sur le plateau en même temps que s'étendait l'agriculture, et que les deux voyageaient ensemble.",
        "Le fer a fait la différence : une hache pour défricher la forêt, une houe pour ouvrir une terre nouvelle, et une lance pour la chasse comme pour la guerre. Les langues bantoues ont voyagé avec les agriculteurs, et c'est pourquoi plus de trois cents millions de personnes en parlent une aujourd'hui, du Cameroun au Kenya et de l'Angola à l'Afrique du Sud.",
        "Là où les agriculteurs ont rencontré des chasseurs-cueilleurs comme les San ou les Mbuti, les deux façons de vivre ont commerçé et emprunté l'une à l'autre. Les agriculteurs ont traversé la grande forêt du Congo avant d'atteindre le sud, et les langues de la forêt portent encore la mémoire de cette rencontre.",
      ],
      timeline: [
        { year: "v. 1000 av. J.-C.", text: "Le travail du fer et l'agriculture se répandent à l'ouest du Niger et dans les monts du Cameroun." },
        { year: "v. 500 av. J.-C.", text: "Des communautés agricoles entrent dans la forêt et descendent le fleuve Congo." },
        { year: "v. 500 av. J.-C. à 200 apr. J.-C.", text: "La culture nok produit des têtes de terre cuite et des outils de fer sur le plateau de Jos." },
        { year: "v. 300 apr. J.-C.", text: "Les agriculteurs atteignent les Grands Lacs et la savane de l'est." },
        { year: "v. 500 apr. J.-C.", text: "Le fer et l'agriculture atteignent l'Afrique australe, et les ancêtres des Sotho et des Tswana s'y installent." },
      ],
      people: [
        { name: "Les artistes nok", text: "Les sculpteurs des têtes de terre cuite du plateau de Jos." },
        { name: "Les premiers agriculteurs bantous", text: "Les communautés dont la parole est devenue trois cents langues." },
        { name: "Les Mbuti", text: "Les chasseurs-cueilleurs de la forêt du bassin du Congo, qui commerçaient avec les agriculteurs." },
        { name: "Les San", text: "Les chasseurs-cueilleurs d'Afrique australe, dont les langues portent des clics." },
      ],
      places: [
        { name: "Le plateau de Jos", text: "Les hautes terres des terres cuites nok et des premiers fourneaux à fer." },
        { name: "Le bassin du Congo", text: "La forêt que les agriculteurs ont traversée vers le sud." },
        { name: "Les Grands Lacs", text: "La région des premières communautés agricoles bantoues de l'est." },
        { name: "Les monts du Cameroun", text: "L'une des patries des langues bantoues." },
      ],
      glossary: [
        { term: "bantou", text: "La famille de langues qui a voyagé avec les agriculteurs." },
        { term: "bas fourneau", text: "Le four où l'on fondait le minerai en une masse d'éponge de fer." },
        { term: "chasseur-cueilleur", text: "Un mode de vie qui vit des plantes et des animaux sauvages plutôt que des champs." },
        { term: "terre cuite", text: "De l'argile cuite en une figure ou un pot durs." },
        { term: "essartage", text: "Le défrichement d'un champ par le feu, cultivé quelques années puis laissé se refaire." },
      ],
    },
  },

  12: {
    en: {
      essay: [
        "While much of Europe was rebuilding, a Christian kingdom in the Ethiopian highlands was carving churches into solid rock. The walls, the pillars, the roofs and the floors of each church were cut downwards out of one piece of the hillside, so that a visitor looks down on a building that was never raised.",
        "The Zagwe kings cut the eleven churches of Lalibela, and then the Solomonic dynasty took the throne in 1270 and ruled for more than six centuries. The line claimed descent from Solomon and the queen of Sheba, and its emperors were crowned at Axum, in the old capital of the kingdom that had come before them.",
        "The highlands traded with the Red Sea through Massawa, and caravans carried coffee, ivory and gold down to the coast. The church owned much of the land and ran the schools where Ge'ez was read and copied, and it kept its own calendar, its own fasts and its own music, which is why the kingdom kept its shape while others around it changed.",
        "When an army from the sultanate of Adal almost destroyed the kingdom in the 1530s, Ethiopia fought back with the help of a Portuguese expedition and kept its own script, its own church and its own history. In the seventeenth century the capital moved to Gondar, where the emperors built castles and the church rebuilt its schools.",
      ],
      timeline: [
        { year: "c. 1200", text: "The Zagwe kings carve the churches of Lalibela out of the rock." },
        { year: "1270", text: "Yekuno Amlak founds the Solomonic dynasty at the expense of the Zagwe." },
        { year: "1520s", text: "Portuguese envoys reach the court and the first firearms arrive." },
        { year: "1529", text: "Ahmad ibn Ibrahim of Adal defeats the Ethiopian army at Shimbra Kure." },
        { year: "1543", text: "The Adalite army is broken at Wayna Daga and the kingdom survives." },
        { year: "c. 1600", text: "The capital moves to Gondar and the kingdom rebuilds its churches." },
      ],
      people: [
        { name: "Lalibela", text: "The Zagwe king whose name the rock churches carry." },
        { name: "Yekuno Amlak", text: "The king who restored the Solomonic line in 1270." },
        { name: "Ahmad ibn Ibrahim", text: "The Adalite leader whose armies nearly took the highlands." },
        { name: "Galawdewos", text: "The Ethiopian king who won at Wayna Daga in 1543." },
        { name: "Zara Yaqob", text: "The fifteenth century emperor who reformed the church and its schools." },
      ],
      places: [
        { name: "Lalibela", text: "The town of the eleven churches cut downwards into the rock." },
        { name: "Axum", text: "The old capital where the emperors were crowned." },
        { name: "Massawa", text: "The Red Sea port of the highland trade." },
        { name: "Gondar", text: "The capital from the seventeenth century, with its castles." },
        { name: "Lake Tana", text: "The source of the Blue Nile, and the monasteries on its islands." },
      ],
      glossary: [
        { term: "Zagwe", text: "The dynasty that ruled the highlands before the Solomonic line." },
        { term: "Solomonic", text: "The dynasty that claimed descent from Solomon and the queen of Sheba." },
        { term: "Ge'ez", text: "The liturgical language and script of the Ethiopian church." },
        { term: "Adal", text: "The Muslim sultanate to the east that fought the highland kingdom." },
        { term: "tabot", text: "The altar slab of an Ethiopian church, carried in procession at Timkat." },
      ],
    },
    fr: {
      essay: [
        "Alors qu'une grande partie de l'Europe se reconstruisait, un royaume chrétien des hauts plateaux éthiopiens creusait des églises dans la roche massive. Les murs, les piliers, les toits et les sols de chaque église étaient taillés vers le bas dans un seul morceau de la colline, si bien que le visiteur regarde en contrebas un bâtiment qu'on n'a jamais élevé.",
        "Les rois zagwé ont taillé les onze églises de Lalibela, puis la dynastie salomonide a pris le trône en 1270 et a régné plus de six siècles. La lignée se disait descendante de Salomon et de la reine de Saba, et ses empereurs étaient couronnés à Axoum, dans l'ancienne capitale du royaume qui l'avait précédée.",
        "Les hauts plateaux commerçaient avec la mer Rouge par Massawa, et les caravanes descendaient le café, l'ivoire et l'or jusqu'à la côte. L'Église possédait une grande partie des terres et tenait les écoles où l'on lisait et copiait le guèze, et elle gardait son propre calendrier, ses jeûnes et sa musique : c'est pourquoi le royaume a gardé sa forme quand d'autres autour de lui changeaient.",
        "Quand une armée du sultanat d'Adal a failli détruire le royaume dans les années 1530, l'Éthiopie a résisté avec l'aide d'une expédition portugaise et a gardé son écriture, son Église et son histoire. Au XVIIe siècle, la capitale s'est installée à Gondar, où les empereurs ont bâti des châteaux et l'Église rebâti ses écoles.",
      ],
      timeline: [
        { year: "v. 1200", text: "Les rois zagwé taillent dans la roche les églises de Lalibela." },
        { year: "1270", text: "Yekouno Amlak fonde la dynastie salomonide aux dépens des Zagwé." },
        { year: "années 1520", text: "Des envoyés portugais atteignent la cour et les premières armes à feu arrivent." },
        { year: "1529", text: "Ahmad ibn Ibrahim d'Adal bat l'armée éthiopienne à Shimbra Kouré." },
        { year: "1543", text: "L'armée d'Adal est brisée à Wayna Daga et le royaume survit." },
        { year: "v. 1600", text: "La capitale s'installe à Gondar et le royaume rebâtit ses églises." },
      ],
      people: [
        { name: "Lalibela", text: "Le roi zagwé dont les églises rupestres portent le nom." },
        { name: "Yekouno Amlak", text: "Le roi qui a restauré la lignée salomonide en 1270." },
        { name: "Ahmad ibn Ibrahim", text: "Le chef d'Adal dont les armées ont failli prendre les hauts plateaux." },
        { name: "Galawdéwos", text: "Le roi éthiopien qui a gagné à Wayna Daga en 1543." },
        { name: "Zar'a Ya'eqob", text: "L'empereur du XVe siècle qui a réformé l'Église et ses écoles." },
      ],
      places: [
        { name: "Lalibela", text: "La ville des onze églises taillées vers le bas dans la roche." },
        { name: "Axoum", text: "L'ancienne capitale où les empereurs étaient couronnés." },
        { name: "Massawa", text: "Le port de la mer Rouge du commerce des hauts plateaux." },
        { name: "Gondar", text: "La capitale à partir du XVIIe siècle, avec ses châteaux." },
        { name: "Le lac Tana", text: "La source du Nil Bleu et les monastères de ses îles." },
      ],
      glossary: [
        { term: "Zagwé", text: "La dynastie qui a gouverné les hauts plateaux avant la lignée salomonide." },
        { term: "salomonide", text: "La dynastie qui se disait descendante de Salomon et de la reine de Saba." },
        { term: "guèze", text: "La langue liturgique et l'écriture de l'Église éthiopienne." },
        { term: "Adal", text: "Le sultanat musulman de l'est, adversaire du royaume des hauts plateaux." },
        { term: "tabot", text: "La tablette d'autel d'une église éthiopienne, portée en procession à Timkat." },
      ],
    },
  },

  13: {
    en: {
      essay: [
        "In the western Sahel, a kingdom grew rich on two things everybody needed: gold and salt. The salt came from the mines of the deep Sahara, cut into slabs and carried south on camels, and the gold came from the forests of the south, and neither place had the other, which is what made the middle so valuable.",
        "Caravans carried Saharan salt south and forest gold north, and Ghana taxed every load that passed. Its capital, Koumbi Saleh, had a royal town and a merchant town, and the Arab geographers who described it wrote of a court with horses, gold and a king who was approached to the sound of drums.",
        "The king himself was called Ghana, and his title gave the empire its name. He kept the gold nuggets for himself and let the merchants deal in dust, so that the price never fell, and the trade up from the forests was carried on in silence, with no word exchanged between the parties.",
        "The Soninke farmers of Wagadu grew millet and sorghum on the edge of the desert and paid for the empire's horses and its army. When the Almoravids sacked the capital in 1076, the empire began to fade, its provinces broke away, and Mali rose in its place on the same gold routes.",
      ],
      timeline: [
        { year: "c. 300 AD", text: "The Soninke kingdom of Wagadu forms on the edge of the Sahara." },
        { year: "c. 800", text: "Koumbi Saleh is a twin town, with a royal quarter and a merchant quarter." },
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
        { name: "The Sahara", text: "The desert whose caravans carried the salt that made the empire rich." },
      ],
      glossary: [
        { term: "Sahel", text: "The dry belt south of the Sahara, where the grassland and the desert meet." },
        { term: "gold dust", text: "The form of gold the merchants handled, the nuggets being the king's own." },
        { term: "silent trade", text: "The exchange of goods without speech, reported along the western routes." },
        { term: "Almoravid", text: "The Berber reform movement that took the capital in 1076." },
        { term: "Soninke", text: "The language and the people of Wagadu." },
      ],
    },
    fr: {
      essay: [
        "Dans le Sahel occidental, un royaume s'est enrichi grâce à deux produits dont tout le monde avait besoin : l'or et le sel. Le sel venait des mines du Sahara profond, découpé en plaques et descendu vers le sud à dos de chameau, et l'or venait des forêts du sud, et ni l'un ni l'autre lieu n'avait ce que l'autre possédait : c'est ce qui rendait le milieu si précieux.",
        "Les caravanes descendaient le sel du Sahara vers le sud et remontaient l'or des forêts vers le nord, et le Ghana taxait chaque charge qui passait. Sa capitale, Koumbi Saleh, comptait une ville royale et une ville marchande, et les géographes arabes qui l'ont décrite parlent d'une cour avec des chevaux, de l'or et un roi qu'on approchait au son des tambours.",
        "Le roi lui-même portait le titre de Ghana, qui a donné son nom à l'empire. Il gardait les pépites pour lui et laissait aux marchands la poudre d'or, pour que le prix ne baisse jamais, et le commerce venu des forêts se faisait sans qu'un mot soit échangé entre les parties.",
        "Les paysans soninké du Wagadou cultivaient le mil et le sorgho à la lisière du désert et payaient les chevaux et l'armée de l'empire. Quand les Almoravides ont pillé la capitale en 1076, l'empire a commencé à s'effacer, ses provinces se sont détachées, et le Mali a pris sa place sur les mêmes routes de l'or.",
      ],
      timeline: [
        { year: "v. 300 apr. J.-C.", text: "Le royaume soninké du Wagadou se forme à la lisière du Sahara." },
        { year: "v. 800", text: "Koumbi Saleh est une ville double, avec un quartier royal et un quartier marchand." },
        { year: "v. 1050", text: "al-Bakri décrit la cour et le commerce de l'or du Ghana." },
        { year: "1076", text: "Les Almoravides prennent la capitale et l'empire commence à se disloquer." },
        { year: "v. 1235", text: "Le Mali prend les routes de l'or au nord du Niger et le Ghana s'efface." },
      ],
      people: [
        { name: "Le roi du Ghana", text: "Le souverain dont le titre a donné son nom à l'empire." },
        { name: "al-Bakri", text: "Le géographe andalou dont le livre décrit la cour du Ghana." },
        { name: "Les Soninké", text: "Les paysans et marchands du Wagadou, le peuple de l'empire." },
        { name: "Les Almoravides", text: "Le mouvement berbère dont les armées ont pris Koumbi Saleh en 1076." },
      ],
      places: [
        { name: "Koumbi Saleh", text: "La capitale, avec une ville royale et une ville marchande." },
        { name: "Le Wagadou", text: "Le nom soninké de l'empire et de son coeur." },
        { name: "Aoudaghost", text: "La ville du désert qui reliait le Ghana aux mines de sel." },
        { name: "Le Sahara", text: "Le désert dont les caravanes portaient le sel qui fit la richesse de l'empire." },
      ],
      glossary: [
        { term: "Sahel", text: "La bande sèche au sud du Sahara, où se rencontrent la savane et le désert." },
        { term: "poudre d'or", text: "La forme de l'or que les marchands maniaient, les pépites étant au roi." },
        { term: "commerce muet", text: "L'échange de marchandises sans parole, rapporté le long des routes de l'ouest." },
        { term: "almoravide", text: "Le mouvement réformateur berbère qui a pris la capitale en 1076." },
        { term: "soninké", text: "La langue et le peuple du Wagadou." },
      ],
    },
  },

  14: {
    en: {
      essay: [
        "South of the Sahara and west of the Nile, two worlds met: the grasslands around Lake Chad and the caravan routes to the Mediterranean. From the lake came fish, grain and cattle, and from the north came horses, salt, cloth and, in time, books and firearms.",
        "Kanem-Bornu ruled that meeting place for about a thousand years, from the Sayfawa dynasty to the musketeers of Idris Alooma. The kings took the title mai, and their dynasty lasted longer than almost any other in African history, moving its capital west from Kanem to Bornu when the desert pressed on the old one.",
        "Idris Alooma bought his muskets through the Ottoman empire and trained a corps of riflemen, the first in the central Sudan, and used them with cavalry and with a fleet of canoes on the lake. A chronicle written at his own court describes his wars, his building and his reforms, which makes his reign one of the best documented of the period.",
        "To the west, the walled cities of the Hausa traded cloth, leather, horses and books behind earthen walls with gates. Their markets were the meeting point of the desert caravans and the forest trade, and several of them, such as the dye pits of Kano, are still open and still working today.",
      ],
      timeline: [
        { year: "c. 1000", text: "The Sayfawa dynasty rules Kanem from the north of Lake Chad." },
        { year: "c. 1390", text: "The court moves west to Bornu after losing Kanem." },
        { year: "c. 1570", text: "Idris Alooma arms his army with muskets and reforms the state." },
        { year: "c. 1590", text: "The Bornu chronicle records the wars and the building of the reign." },
        { year: "1823", text: "Hugh Clapperton reaches the court of Bornu and leaves an account of it." },
      ],
      people: [
        { name: "Idris Alooma", text: "The mai who armed a corps of musketeers and reformed the state." },
        { name: "The Sayfawa", text: "The dynasty that ruled Kanem and then Bornu for a thousand years." },
        { name: "Mai Dunama", text: "The king who strengthened the dynasty in the thirteenth century." },
        { name: "Hugh Clapperton", text: "The British explorer who reached the court of Bornu in 1823." },
      ],
      places: [
        { name: "Ngazargamu", text: "The capital of Bornu, founded when the court moved west." },
        { name: "Lake Chad", text: "The freshwater lake whose grasslands and fish fed the kingdom." },
        { name: "Kano", text: "The greatest of the Hausa cities, with its dye pits and its market." },
        { name: "Takedda", text: "The Saharan town whose copper and salt joined the routes south." },
      ],
      glossary: [
        { term: "mai", text: "The title of the kings of Kanem-Bornu." },
        { term: "Hausa", text: "The language and the people of the walled cities west of Lake Chad." },
        { term: "musketeer", text: "A soldier armed with a firearm, the corps Idris Alooma trained." },
        { term: "city wall", text: "The earthen rampart with gates that ringed a Hausa city." },
        { term: "kola", text: "The forest nut carried north and chewed through the Sahel as a stimulant." },
      ],
    },
    fr: {
      essay: [
        "Au sud du Sahara et à l'ouest du Nil, deux mondes se rencontraient : les savanes autour du lac Tchad et les routes caravanières vers la Méditerranée. Du lac venaient le poisson, le grain et le bétail, et du nord venaient les chevaux, le sel, les tissus et, avec le temps, les livres et les armes à feu.",
        "Kanem-Bornou a gouverné ce carrefour pendant environ mille ans, de la dynastie sayfawa aux mousquetaires d'Idriss Alooma. Les rois portaient le titre de maï, et leur dynastie a duré plus longtemps que presque toute autre de l'histoire africaine, déplaçant sa capitale de l'est du Kanem vers le Bornou quand le désert a pressé l'ancienne.",
        "Idriss Alooma achetait ses mousquets par l'Empire ottoman et entraînait un corps de fusiliers, le premier du Soudan central, qu'il employait avec la cavalerie et une flottille de pirogues sur le lac. Une chronique écrite à sa propre cour décrit ses guerres, ses constructions et ses réformes, ce qui fait de son règne l'un des mieux documentés de la période.",
        "À l'ouest, les cités fortifiées haoussa commerçaient tissus, cuir, chevaux et livres derrière des murs de terre percés de portes. Leurs marchés étaient le point de rencontre des caravanes du désert et du commerce de la forêt, et plusieurs d'entre eux, comme les fosses de teinture de Kano, sont encore ouverts et encore en usage aujourd'hui.",
      ],
      timeline: [
        { year: "v. 1000", text: "La dynastie sayfawa gouverne le Kanem, au nord du lac Tchad." },
        { year: "v. 1390", text: "La cour se déplace vers l'ouest, au Bornou, après la perte du Kanem." },
        { year: "v. 1570", text: "Idriss Alooma arme son armée de mousquets et réforme l'État." },
        { year: "v. 1590", text: "La chronique du Bornou rapporte les guerres et les constructions du règne." },
        { year: "1823", text: "Hugh Clapperton atteint la cour du Bornou et en laisse un récit." },
      ],
      people: [
        { name: "Idriss Alooma", text: "Le maï qui a armé un corps de mousquetaires et réformé l'État." },
        { name: "Les Sayfawa", text: "La dynastie qui a gouverné le Kanem puis le Bornou mille ans durant." },
        { name: "Maï Doumama", text: "Le roi qui a renforcé la dynastie au XIIIe siècle." },
        { name: "Hugh Clapperton", text: "L'explorateur britannique qui a atteint la cour du Bornou en 1823." },
      ],
      places: [
        { name: "Ngazargamou", text: "La capitale du Bornou, fondée lorsque la cour s'est installée à l'ouest." },
        { name: "Le lac Tchad", text: "Le lac d'eau douce dont les savanes et le poisson nourrissaient le royaume." },
        { name: "Kano", text: "La plus grande des cités haoussa, avec ses fosses de teinture et son marché." },
        { name: "Takedda", text: "La ville saharienne dont le cuivre et le sel rejoignaient les routes du sud." },
      ],
      glossary: [
        { term: "maï", text: "Le titre des rois du Kanem-Bornou." },
        { term: "haoussa", text: "La langue et le peuple des cités fortifiées à l'ouest du lac Tchad." },
        { term: "mousquetaire", text: "Un soldat armé d'une arme à feu, le corps qu'Idriss Alooma a entraîné." },
        { term: "rempart", text: "Le mur de terre percé de portes qui entourait une cité haoussa." },
        { term: "kola", text: "La noix de la forêt portée vers le nord et mâchée dans tout le Sahel comme stimulant." },
      ],
    },
  },

  15: {
    en: {
      essay: [
        "The monsoon blew the dhows south in one season and north in the other, and along that rhythm a string of ports grew on the East African coast. A ship that sailed with the wind could make the round trip in a year, and the harbours, the wells and the coral lime houses were built for that traffic.",
        "Kilwa traded the gold of the interior for Chinese porcelain and Persian pottery, and Ibn Battuta called it one of the finest towns in the world. Its great mosque, its palace of Husuni Kubwa and its coral walls were paid for by the gold that came down from the plateau and was loaded at Sofala.",
        "Each town had its sultan, its great mosque and its houses built from coral lime, and each one answered to the same winds, the same language and the same faith. Mombasa, Malindi, Kilwa and the smaller ports shared traders, scholars and marriages, and a person could sail from one to the next and be understood everywhere.",
        "Gold came down from the Zimbabwe plateau to Sofala, and the dhows carried it to Arabia, India and China, where a fleet under the admiral Zheng He reached the coast in the fifteenth century. The Swahili spoke a Bantu language, wrote it in Arabic script, and built a shared culture that still defines the coast.",
      ],
      timeline: [
        { year: "c. 900", text: "Merchants of the Persian Gulf settle at Kilwa and on the coast." },
        { year: "c. 1000", text: "The Swahili towns mint their own coins and build their great mosques." },
        { year: "c. 1331", text: "Ibn Battuta visits Kilwa and praises its buildings and its people." },
        { year: "c. 1415", text: "A Chinese fleet under Zheng He reaches the coast." },
        { year: "1505", text: "The Portuguese take Kilwa and Mombasa and the old trade is broken." },
      ],
      people: [
        { name: "Ibn Battuta", text: "The traveller who called Kilwa one of the finest towns in the world." },
        { name: "Zheng He", text: "The Chinese admiral whose fleet reached the coast in the fifteenth century." },
        { name: "The sultans of Kilwa", text: "The rulers whose coins and buildings made the town rich." },
        { name: "Al-Hasan ibn Sulaiman", text: "The sultan of Kilwa who built the Great Mosque." },
      ],
      places: [
        { name: "Kilwa", text: "The island port whose gold trade made it the richest town on the coast." },
        { name: "Mombasa", text: "The second great harbour, on the Kenyan coast." },
        { name: "Sofala", text: "The southern port that took the gold of the plateau." },
        { name: "Husuni Kubwa", text: "The palace of the sultan of Kilwa, one of the largest buildings in Africa." },
      ],
      glossary: [
        { term: "Swahili", text: "The Bantu language of the coast, written in Arabic script." },
        { term: "dhow", text: "The lateen sailed ship of the Indian Ocean monsoon trade." },
        { term: "monsoon", text: "The wind that blows south in one season and north in the other." },
        { term: "sultanate", text: "A state ruled by a sultan." },
        { term: "coral rag", text: "The building stone cut from old coral and set in lime mortar." },
      ],
    },
    fr: {
      essay: [
        "La mousson poussait les boutres vers le sud pendant une saison et vers le nord pendant l'autre, et sur ce rythme une chaîne de ports a grandi sur la côte est-africaine. Un navire qui naviguait avec le vent pouvait faire l'aller et le retour en une année, et les ports, les puits et les maisons de corail étaient bâtis pour ce trafic.",
        "Kilwa échangeait l'or de l'intérieur contre de la porcelaine chinoise et de la poterie perse, et Ibn Battuta l'a décrite comme l'une des plus belles villes du monde. Sa grande mosquée, son palais de Husuni Kubwa et ses murs de corail étaient payés par l'or qui descendait du plateau et qu'on chargeait à Sofala.",
        "Chaque ville avait son sultan, sa grande mosquée et ses maisons liées au corail, et chacune répondait aux mêmes vents, à la même langue et à la même foi. Mombasa, Malindi, Kilwa et les ports plus petits partageaient marchands, savants et mariages, et l'on pouvait naviguer de l'un à l'autre en étant compris partout.",
        "L'or descendait du plateau du Zimbabwe vers Sofala, et les boutres le portaient en Arabie, en Inde et en Chine, où une flotte commandée par l'amiral Zheng He a atteint la côte au XVe siècle. Les Swahili parlaient une langue bantoue, l'écrivaient en caractères arabes et ont bâti une culture commune qui définit encore la côte.",
      ],
      timeline: [
        { year: "v. 900", text: "Des marchands du golfe Persique s'installent à Kilwa et sur la côte." },
        { year: "v. 1000", text: "Les villes swahili frappent leurs propres monnaies et bâtissent leurs grandes mosquées." },
        { year: "v. 1331", text: "Ibn Battuta visite Kilwa et en loue les bâtiments et les habitants." },
        { year: "v. 1415", text: "Une flotte chinoise commandée par Zheng He atteint la côte." },
        { year: "1505", text: "Les Portugais prennent Kilwa et Mombasa et l'ancien commerce se brise." },
      ],
      people: [
        { name: "Ibn Battuta", text: "Le voyageur qui a appelé Kilwa l'une des plus belles villes du monde." },
        { name: "Zheng He", text: "L'amiral chinois dont la flotte a atteint la côte au XVe siècle." },
        { name: "Les sultans de Kilwa", text: "Les souverains dont les monnaies et les bâtiments ont fait la richesse de la ville." },
        { name: "Al-Hasan ibn Sulaiman", text: "Le sultan de Kilwa qui a fait bâtir la Grande Mosquée." },
      ],
      places: [
        { name: "Kilwa", text: "Le port de l'île dont le commerce de l'or a fait la ville la plus riche de la côte." },
        { name: "Mombasa", text: "Le second grand port, sur la côte kényane." },
        { name: "Sofala", text: "Le port du sud qui recevait l'or du plateau." },
        { name: "Husuni Kubwa", text: "Le palais du sultan de Kilwa, l'un des plus grands édifices d'Afrique." },
      ],
      glossary: [
        { term: "swahili", text: "La langue bantoue de la côte, écrite en caractères arabes." },
        { term: "boutre", text: "Le navire à voile latine du commerce de mousson de l'océan Indien." },
        { term: "mousson", text: "Le vent qui souffle vers le sud pendant une saison et vers le nord pendant l'autre." },
        { term: "sultanat", text: "Un État gouverné par un sultan." },
        { term: "corail", text: "La pierre de construction taillée dans le vieux corail et liée à la chaux." },
      ],
    },
  },

  16: {
    en: {
      essay: [
        "Behind the Atlantic coast, in the forests and the savannah beyond them, some of the most remarkable states of Africa took shape. They grew on farming and on trade, on copper, salt, gold, cloth and ivory, and several of them kept written records, or sent embassies to Europe, long before the first European set foot in their capitals.",
        "The Kongo kings wrote to Lisbon as equals, in Portuguese, and complained when the trade in captives grew beyond anything they had agreed to. In Benin, brass casters produced the plaques and heads that British troops would loot in 1897, and the guilds of the city governed the crafts, the palace and the market in their own quarters.",
        "In Ife, artists modelled faces of a calm and startling realism, and the horsemen of Oyo held the savannah for centuries. Further south the Kuba embroidered raffia cloth so finely that a single piece could take a year, and the Lunda empire traded copper and salt out of the savannah on its own routes.",
        "Each of these states governed by its own custom: the manikongo through governors and a council of nobles, the oba of Benin through the guilds of a great city, and the alaafin of Oyo through a council of chiefs that could check him. What they shared was a habit of government that survived the loss of power, and that their heirs carry on today.",
      ],
      timeline: [
        { year: "c. 1390", text: "The kingdom of Kongo takes shape around its capital at Mbanza Kongo." },
        { year: "c. 1500", text: "The brass casters of Benin make the plaques and heads of the royal court." },
        { year: "c. 1600", text: "The cavalry of Oyo dominate the savannah west of the Niger." },
        { year: "1704", text: "Kimpa Vita begins preaching unity and is executed two years later." },
        { year: "c. 1750", text: "The Kuba kingdom reaches its height on the Kasai river." },
        { year: "1897", text: "British troops loot the palace of Benin and take its bronzes to Europe." },
      ],
      people: [
        { name: "Afonso I", text: "The Kongo king who wrote to Lisbon and complained of the slave trade." },
        { name: "Kimpa Vita", text: "The prophetess who called for the unity of Kongo and was burnt for it." },
        { name: "Osei Tutu", text: "The founder of Asante, whose golden stool united the Akan states." },
        { name: "Oranmiyan", text: "The legendary founder of the dynasty of Oyo." },
        { name: "Shyaam aMbul aNgoong", text: "The Kuba king who brought new crops and crafts to the kingdom." },
      ],
      places: [
        { name: "Mbanza Kongo", text: "The capital of the kingdom of Kongo." },
        { name: "Benin City", text: "The city of the oba, with its walls and its brass casting quarter." },
        { name: "Ife", text: "The Yoruba city of the sacred kings and of the naturalistic heads." },
        { name: "Oyo Ile", text: "The capital of the cavalry kingdom of Oyo." },
        { name: "The Kasai", text: "The river of the Kuba kingdom and of its raffia cloth." },
      ],
      glossary: [
        { term: "manikongo", text: "The title of the king of Kongo." },
        { term: "oba", text: "The title of the king in Benin and in other Yoruba and Edo states." },
        { term: "lost wax casting", text: "The method used to cast the heads and the plaques of Benin." },
        { term: "raffia", text: "The fibre of the palm leaf, woven and embroidered into cloth in the Kuba kingdom." },
        { term: "guild", text: "The corporation of craftsmen that governed a trade in a great city." },
      ],
    },
    fr: {
      essay: [
        "Derrière la côte atlantique, dans les forêts et les savanes qui les prolongent, quelques-uns des États les plus remarquables d'Afrique ont pris forme. Ils vivaient de l'agriculture et du commerce, du cuivre, du sel, de l'or, des tissus et de l'ivoire, et plusieurs ont tenu des archives écrites, ou envoyé des ambassades en Europe, bien avant qu'un Européen mette le pied dans leurs capitales.",
        "Les rois du Kongo écrivaient à Lisbonne d'égal à égal, en portugais, et se plaignaient quand la traite des captifs dépassait tout ce qu'ils avaient accepté. Au Bénin, les fondeurs de laiton ont produit les plaques et les têtes que les troupes britanniques allaient piller en 1897, et les corporations de la ville gouvernaient les métiers, le palais et le marché dans leurs quartiers propres.",
        "À Ifé, les artistes modelaient des visages d'un réalisme calme et saisissant, et les cavaliers d'Oyo ont tenu la savane pendant des siècles. Plus au sud, les Kouba brodaient le raphia si finement qu'une seule pièce pouvait demander un an, et l'empire lounda commerçait le cuivre et le sel de la savane sur ses propres routes.",
        "Chacun de ces États gouvernait selon sa propre coutume : le manikongo par des gouverneurs et un conseil de nobles, l'oba du Bénin par les corporations d'une grande ville, et l'alaafin d'Oyo par un conseil de chefs qui pouvait le contrôler. Ce qu'ils partageaient, c'est une manière de gouverner qui a survécu à la perte du pouvoir, et que leurs héritiers poursuivent aujourd'hui.",
      ],
      timeline: [
        { year: "v. 1390", text: "Le royaume du Kongo prend forme autour de sa capitale, Mbanza Kongo." },
        { year: "v. 1500", text: "Les fondeurs de laiton du Bénin produisent les plaques et les têtes de la cour royale." },
        { year: "v. 1600", text: "La cavalerie d'Oyo domine la savane à l'ouest du Niger." },
        { year: "1704", text: "Kimpa Vita commence à prêcher l'unité et est exécutée deux ans plus tard." },
        { year: "v. 1750", text: "Le royaume kouba atteint son apogée sur la rivière Kasaï." },
        { year: "1897", text: "Les troupes britanniques pillent le palais du Bénin et emportent ses bronzes en Europe." },
      ],
      people: [
        { name: "Afonso Ier", text: "Le roi du Kongo qui a écrit à Lisbonne pour protester contre la traite." },
        { name: "Kimpa Vita", text: "La prophétesse qui a appelé à l'unité du Kongo et qui a été brûlée pour cela." },
        { name: "Osei Toutou", text: "Le fondateur de l'Asante, dont le tabouret d'or a uni les États akan." },
        { name: "Oranmiyan", text: "Le fondateur légendaire de la dynastie d'Oyo." },
        { name: "Shyaam aMbul aNgoong", text: "Le roi kouba qui a apporté de nouvelles cultures et de nouveaux métiers au royaume." },
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
        { term: "fonte à la cire perdue", text: "La méthode employée pour couler les têtes et les plaques du Bénin." },
        { term: "raphia", text: "La fibre de la feuille de palmier, tissée et brodée en étoffe dans le royaume kouba." },
        { term: "corporation", text: "L'association des artisans qui gouvernait un métier dans une grande ville." },
      ],
    },
  },

  17: {
    en: {
      essay: [
        "For more than three centuries, ships carried Africans across the Atlantic against their will. Roughly 12.5 million people were put on board, and about 10.7 million reached the Americas alive, which means that for every person who arrived, one did not survive the crossing.",
        "Behind the ships they left villages emptied of their young people, fields unworked and families divided, and ahead of them lay slavery on plantations and in mines. The trade fed on wars and on debts, and the rulers who sold captives were very often paying for the goods and the firearms the same trade had brought them.",
        "Yet the trade was resisted at every step, by kings who wrote to Lisbon, by uprisings at sea and on land, by writers such as Olaudah Equiano, and finally by the abolitionists who ended it. Captives seized ships, as on the Amistad in 1839, and communities of escaped people, the Maroons of Jamaica among them, held their own ground for generations.",
        "Brazil took more captives than any other country and was the last in the Americas to abolish slavery, in 1888. The profits of the trade built ports and banks in Europe, and its memory is a road of departure, a door of no return, and a debate about what is owed that is still going on.",
      ],
      timeline: [
        { year: "1444", text: "The first large cargo of captives is carried from Africa to Portugal." },
        { year: "1619", text: "The first recorded Africans are landed in Virginia." },
        { year: "1791", text: "The rising in Saint-Domingue begins the end of slavery in Haiti." },
        { year: "1807", text: "Britain forbids its own subjects to trade in captives." },
        { year: "1839", text: "Captives seize the Amistad and win their freedom in an American court." },
        { year: "1888", text: "Brazil becomes the last country in the Americas to abolish slavery." },
      ],
      people: [
        { name: "Olaudah Equiano", text: "The writer whose account of his own captivity helped the abolitionists." },
        { name: "Nzinga Mbande", text: "The queen of Ndongo who fought the Portuguese for decades." },
        { name: "Toussaint Louverture", text: "The leader of the rising that made Haiti free." },
        { name: "William Wilberforce", text: "The British politician who carried the abolition of the trade through parliament." },
      ],
      places: [
        { name: "Ouidah", text: "The port whose gate to the beach was called the door of no return." },
        { name: "Elmina", text: "The Portuguese castle on the Gold Coast, the first of the trading forts." },
        { name: "Ile de Goree", text: "The small island off Dakar used as a holding place before the crossing." },
        { name: "Salvador da Bahia", text: "The Brazilian port that received more captives than any other." },
      ],
      glossary: [
        { term: "the Middle Passage", text: "The crossing of the Atlantic that carried the captives." },
        { term: "abolition", text: "The ending of the trade, and later of slavery itself." },
        { term: "asiento", text: "The Spanish licence to carry captives to the American colonies." },
        { term: "Maroon", text: "A community of people who escaped slavery and held their own ground." },
        { term: "triangular trade", text: "The route that carried goods to Africa, captives to the Americas and sugar home." },
      ],
    },
    fr: {
      essay: [
        "Pendant plus de trois siècles, des navires ont transporté des Africains à travers l'Atlantique contre leur volonté. Environ 12,5 millions de personnes ont été embarquées, et environ 10,7 millions ont atteint les Amériques vivantes : pour chaque personne arrivée, une n'a pas survécu à la traversée.",
        "Derrière les navires, elles laissaient des villages vidés de leurs jeunes, des champs en friche et des familles séparées, et devant elles s'ouvrait l'esclavage des plantations et des mines. La traite se nourrissait des guerres et des dettes, et les souverains qui vendaient des captifs payaient le plus souvent les marchandises et les armes à feu que la même traite leur avait apportées.",
        "Pourtant la traite a été combattue à chaque étape, par des rois qui écrivaient à Lisbonne, par des révoltes en mer et sur terre, par des auteurs comme Olaudah Equiano, et enfin par les abolitionnistes qui l'ont fait cesser. Des captifs se sont emparés de navires, comme sur l'Amistad en 1839, et des communautés d'évadés, les Marrons de Jamaïque entre autres, ont tenu leur propre territoire pendant des générations.",
        "Le Brésil a reçu plus de captifs que tout autre pays et a été le dernier des Amériques à abolir l'esclavage, en 1888. Les profits de la traite ont bâti des ports et des banques en Europe, et son souvenir est une route de départ, une porte du Non-Retour et un débat sur ce qui reste dû, qui se poursuit encore.",
      ],
      timeline: [
        { year: "1444", text: "Le premier grand chargement de captifs est transporté d'Afrique au Portugal." },
        { year: "1619", text: "Les premiers Africains attestés sont débarqués en Virginie." },
        { year: "1791", text: "L'insurrection de Saint-Domingue commence la fin de l'esclavage à Haïti." },
        { year: "1807", text: "La Grande-Bretagne interdit à ses sujets le commerce des captifs." },
        { year: "1839", text: "Des captifs s'emparent de l'Amistad et gagnent leur liberté devant un tribunal américain." },
        { year: "1888", text: "Le Brésil devient le dernier pays des Amériques à abolir l'esclavage." },
      ],
      people: [
        { name: "Olaudah Equiano", text: "L'écrivain dont le récit de sa propre captivité a aidé les abolitionnistes." },
        { name: "Nzinga Mbande", text: "La reine du Ndongo qui a combattu les Portugais pendant des décennies." },
        { name: "Toussaint Louverture", text: "Le chef de l'insurrection qui a rendu Haïti libre." },
        { name: "William Wilberforce", text: "L'homme politique britannique qui a fait voter l'abolition de la traite." },
      ],
      places: [
        { name: "Ouidah", text: "Le port dont la porte vers la plage a été appelée la porte du Non-Retour." },
        { name: "Elmina", text: "Le fort portugais de la Côte de l'Or, le premier des comptoirs." },
        { name: "L'île de Gorée", text: "La petite île au large de Dakar, utilisée comme lieu de rétention avant la traversée." },
        { name: "Salvador de Bahia", text: "Le port brésilien qui a reçu le plus de captifs." },
      ],
      glossary: [
        { term: "la traversée du milieu", text: "La traversée de l'Atlantique qui portait les captifs." },
        { term: "abolition", text: "La fin de la traite, puis de l'esclavage lui-même." },
        { term: "asiento", text: "La licence espagnole autorisant le transport de captifs vers les colonies américaines." },
        { term: "marron", text: "Une communauté de personnes échappées de l'esclavage, qui tenait son propre territoire." },
        { term: "commerce triangulaire", text: "La route qui portait les marchandises en Afrique, les captifs aux Amériques et le sucre en Europe." },
      ],
    },
  },

  18: {
    en: {
      essay: [
        "In a few decades, European armies conquered almost the whole continent. The machine gun, the railway and the steamboat made it possible, and the quarrels of Europe made it urgent: each power wanted to hold the ground before its neighbours could.",
        "Borders were drawn in Berlin in 1884 and 1885, with no African in the room. Lines were ruled across deserts, mountains and the territories of peoples who had never been at war with each other, and one people could be split between two colonies or two enemies pushed into one.",
        "Resistance was immediate and often heroic: Samori Toure in the west, the Maji Maji rising in the east, the Herero and Nama in the south. Ethiopia alone won its war, at Adwa in 1896, where an African army equipped with modern rifles defeated a European one in the field.",
        "The colonisers drew the borders they wanted, ruled through appointed chiefs, and laid railways from the mines and the plantations down to the sea. The land was taken, families were moved, and the schools taught the language of the conqueror. Ethiopia entered the twentieth century as the one country in Africa governed by its own rulers, until Italy occupied it from 1936 to 1941.",
      ],
      timeline: [
        { year: "1884", text: "The Berlin conference opens to agree the rules of the partition." },
        { year: "1896", text: "Ethiopia defeats an Italian army at Adwa and keeps its independence." },
        { year: "1897", text: "British troops take Benin City and carry away its bronzes." },
        { year: "1905", text: "The Maji Maji rising begins in German East Africa." },
        { year: "1907", text: "The Herero and Nama are crushed in German South West Africa." },
        { year: "1936", text: "Italy occupies Ethiopia, which is freed again in 1941." },
      ],
      people: [
        { name: "Samori Toure", text: "The Mandinka leader who fought the French for two decades." },
        { name: "Menelik II", text: "The emperor of Ethiopia whose army won at Adwa." },
        { name: "Kinjikitile Ngwale", text: "The prophet of the Maji Maji rising." },
        { name: "Samuel Maharero", text: "The leader of the Herero against the German colony." },
      ],
      places: [
        { name: "Berlin", text: "The city where the rules of the partition were agreed." },
        { name: "Adwa", text: "The battlefield in the Ethiopian highlands where Italy was defeated." },
        { name: "Benin City", text: "The capital taken by British troops in 1897." },
        { name: "German South West Africa", text: "The colony where the Herero and Nama were destroyed." },
      ],
      glossary: [
        { term: "partition", text: "The division of the continent into colonies by the European powers." },
        { term: "protectorate", text: "A territory ruled by a foreign power under an agreement with a local ruler." },
        { term: "indirect rule", text: "Governing through existing chiefs and institutions rather than directly." },
        { term: "concession", text: "A large area of land granted to a company to exploit." },
        { term: "Maji", text: "The water, and the medicine, that the rising of 1905 took its name from." },
      ],
    },
    fr: {
      essay: [
        "En quelques décennies, les armées européennes ont conquis presque tout le continent. La mitrailleuse, le chemin de fer et le vapeur l'ont rendu possible, et les querelles de l'Europe l'ont rendu urgent : chaque puissance voulait tenir le terrain avant ses voisins.",
        "Les frontières ont été tracées à Berlin en 1884 et 1885, sans aucun Africain dans la salle. On a tiré des lignes à travers les déserts, les montagnes et les territoires de peuples qui n'avaient jamais été en guerre les uns contre les autres, et un même peuple a pu être partagé entre deux colonies, ou deux ennemis réunis dans une seule.",
        "La résistance a été immédiate et souvent héroïque : Samori Touré à l'ouest, la révolte des Maji Maji à l'est, les Herero et les Nama au sud. Seule l'Éthiopie a gagné sa guerre, à Adoua en 1896, où une armée africaine équipée de fusils modernes a battu une armée européenne en rase campagne.",
        "Les colonisateurs ont tracé les frontières qu'ils voulaient, gouverné par des chefs nommés et bâti des chemins de fer des mines et des plantations jusqu'à la mer. La terre a été prise, des familles déplacées, et les écoles ont enseigné la langue du vainqueur. L'Éthiopie est entrée dans le XXe siècle comme le seul pays d'Afrique gouverné par ses propres souverains, jusqu'à l'occupation italienne de 1936 à 1941.",
      ],
      timeline: [
        { year: "1884", text: "La conférence de Berlin s'ouvre pour fixer les règles du partage." },
        { year: "1896", text: "L'Éthiopie bat une armée italienne à Adoua et garde son indépendance." },
        { year: "1897", text: "Les troupes britanniques prennent Bénin et emportent ses bronzes." },
        { year: "1905", text: "La révolte des Maji Maji commence en Afrique orientale allemande." },
        { year: "1907", text: "Les Herero et les Nama sont écrasés en Afrique du Sud-Ouest allemande." },
        { year: "1936", text: "L'Italie occupe l'Éthiopie, libérée de nouveau en 1941." },
      ],
      people: [
        { name: "Samori Touré", text: "Le chef mandingue qui a combattu les Français pendant vingt ans." },
        { name: "Ménélik II", text: "L'empereur d'Éthiopie dont l'armée a gagné à Adoua." },
        { name: "Kinjikitilé Ngwalé", text: "Le prophète de la révolte des Maji Maji." },
        { name: "Samuel Maharero", text: "Le chef des Herero contre la colonie allemande." },
      ],
      places: [
        { name: "Berlin", text: "La ville où les règles du partage ont été fixées." },
        { name: "Adoua", text: "Le champ de bataille des hauts plateaux éthiopiens où l'Italie a été battue." },
        { name: "Bénin", text: "La capitale prise par les troupes britanniques en 1897." },
        { name: "L'Afrique du Sud-Ouest allemande", text: "La colonie où les Herero et les Nama ont été détruits." },
      ],
      glossary: [
        { term: "partage", text: "La division du continent en colonies par les puissances européennes." },
        { term: "protectorat", text: "Un territoire gouverné par une puissance étrangère en vertu d'un accord avec un souverain local." },
        { term: "administration indirecte", text: "Gouverner par les chefs et les institutions existants plutôt que directement." },
        { term: "concession", text: "Une vaste étendue de terre accordée à une compagnie pour l'exploiter." },
        { term: "Maji", text: "L'eau, et le remède, qui ont donné son nom à la révolte de 1905." },
      ],
    },
  },

  19: {
    en: {
      essay: [
        "In 1948, South Africa turned racial separation into the law of the land. Every person was classified by race, and the classification decided where they could live, which school they could attend, what work they could do, and whether they could vote.",
        "Families were moved, passes were checked, schools were split. Millions were taken from land their families had held for generations and put in townships on the edge of the cities, and the education given to black children was deliberately made narrower than the rest.",
        "The answer came from Sharpeville in 1960 to Soweto in 1976, from the prison cells of Robben Island to the words of Steve Biko. Against it stood the ANC and its allies, the Pan Africanist Congress, the Black Consciousness movement, the churches and, from 1985, the trade unions of COSATU. Much of the world refused to trade or to play sport with South Africa.",
        "After decades of struggle and world pressure, Nelson Mandela walked free in 1990, and in 1994 South Africans of every colour voted in the same election. After 1994 the Truth and Reconciliation Commission heard the victims and the perpetrators, exchanging a full account of a crime for amnesty, and the country is still working out what it owes.",
      ],
      timeline: [
        { year: "1948", text: "The National Party wins and begins to write apartheid into law." },
        { year: "1956", text: "Twenty thousand women march on Pretoria against the pass laws." },
        { year: "1960", text: "Police fire on a protest at Sharpeville and sixty-nine people are killed." },
        { year: "1976", text: "Schoolchildren in Soweto rise against the language of instruction." },
        { year: "1990", text: "Nelson Mandela is released after twenty-seven years in prison." },
        { year: "1994", text: "The first election in which all South Africans may vote." },
      ],
      people: [
        { name: "Nelson Mandela", text: "The prisoner who became the first president of a free South Africa." },
        { name: "Steve Biko", text: "The leader of the Black Consciousness movement, who died in police custody." },
        { name: "Albertina Sisulu", text: "A leader of the women's march and of the liberation movement." },
        { name: "Desmond Tutu", text: "The archbishop who chaired the Truth and Reconciliation Commission." },
      ],
      places: [
        { name: "Sharpeville", text: "The township where the pass protest was fired on in 1960." },
        { name: "Soweto", text: "The township whose schoolchildren rose in 1976." },
        { name: "Robben Island", text: "The prison off Cape Town where Mandela was held." },
        { name: "The Union Buildings", text: "The seat of government in Pretoria and the goal of the women's march of 1956." },
      ],
      glossary: [
        { term: "apartheid", text: "The Afrikaans word for separateness, and the system of racial laws." },
        { term: "pass laws", text: "The rules that required black South Africans to carry a document at all times." },
        { term: "township", text: "The segregated area where black South Africans were forced to live." },
        { term: "bantustan", text: "A nominally self governing territory created to deny people their citizenship." },
        { term: "Truth and Reconciliation Commission", text: "The body that heard testimony in exchange for amnesty." },
      ],
    },
    fr: {
      essay: [
        "En 1948, l'Afrique du Sud a fait de la séparation raciale la loi du pays. Chaque personne était classée par race, et ce classement décidait où elle pouvait vivre, quelle école elle pouvait fréquenter, quel travail elle pouvait faire et si elle pouvait voter.",
        "Des familles ont été déplacées, les passes étaient contrôlées, les écoles séparées. Des millions de personnes ont été arrachées à des terres que leurs familles tenaient depuis des générations et installées dans des townships à la lisière des villes, et l'enseignement donné aux enfants noirs a été délibérément rendu plus étroit que le reste.",
        "La réponse est venue de Sharpeville en 1960 à Soweto en 1976, des cellules de Robben Island aux paroles de Steve Biko. Face à elle se tenaient l'ANC et ses alliés, le Congrès panafricaniste, le mouvement de conscience noire, les Églises et, à partir de 1985, les syndicats réunis dans la COSATU. Une grande partie du monde a refusé de commercer ou de jouer contre l'Afrique du Sud.",
        "Après des décennies de lutte et de pressions internationales, Nelson Mandela est sorti libre en 1990, et en 1994 les Sud-Africains de toutes les couleurs ont voté lors de la même élection. Après 1994, la Commission de la vérité et de la réconciliation a entendu les victimes et les auteurs des crimes, échangeant le récit complet d'un crime contre l'amnistie, et le pays cherche encore ce qu'il doit.",
      ],
      timeline: [
        { year: "1948", text: "Le Parti national gagne et commence à inscrire l'apartheid dans la loi." },
        { year: "1956", text: "Vingt mille femmes marchent sur Pretoria contre les lois sur les passes." },
        { year: "1960", text: "La police tire sur une manifestation à Sharpeville et soixante-neuf personnes sont tuées." },
        { year: "1976", text: "Les écoliers de Soweto se soulèvent contre la langue d'enseignement." },
        { year: "1990", text: "Nelson Mandela est libéré après vingt-sept ans de prison." },
        { year: "1994", text: "La première élection où tous les Sud-Africains peuvent voter." },
      ],
      people: [
        { name: "Nelson Mandela", text: "Le prisonnier devenu premier président d'une Afrique du Sud libre." },
        { name: "Steve Biko", text: "Le dirigeant du mouvement de conscience noire, mort en détention." },
        { name: "Albertina Sisulu", text: "Une dirigeante de la marche des femmes et du mouvement de libération." },
        { name: "Desmond Tutu", text: "L'archevêque qui a présidé la Commission de la vérité et de la réconciliation." },
      ],
      places: [
        { name: "Sharpeville", text: "Le township où la manifestation contre les passes a été prise sous le feu en 1960." },
        { name: "Soweto", text: "Le township dont les écoliers se sont soulevés en 1976." },
        { name: "Robben Island", text: "La prison au large du Cap où Mandela a été détenu." },
        { name: "Les Union Buildings", text: "Le siège du gouvernement à Pretoria et le but de la marche des femmes de 1956." },
      ],
      glossary: [
        { term: "apartheid", text: "Le mot afrikaans pour séparation, et le système de lois raciales." },
        { term: "lois sur les passes", text: "Les règles qui obligeaient les Sud-Africains noirs à porter un document en permanence." },
        { term: "township", text: "Le quartier séparé où les Sud-Africains noirs étaient contraints de vivre." },
        { term: "bantoustan", text: "Un territoire nominalement autonome, créé pour priver les gens de leur citoyenneté." },
        { term: "Commission de la vérité et de la réconciliation", text: "L'instance qui a recueilli les récits en échange de l'amnistie." },
      ],
    },
  },

  20: {
    en: {
      essay: [
        "Africa today is the continent of the African Union and of the largest free trade area in the world by number of countries. It is where mobile money was invented, where a quarter of the world's people will live by 2050, and where the median age is nineteen, which is a young continent by any measure.",
        "Fifty-four states belong to the African Union, and the free trade area agreed in 2018 began to be applied in 2021, which makes it the largest in the world by number of countries. The continent holds the world's largest reserves of cobalt and much of its platinum, and it is building the dams, the railways and the ports that it was not allowed to build for itself.",
        "Its cities are growing faster than any others on earth. Lagos, Kinshasa, Cairo and Dar es Salaam are each of them larger than most European capitals, and the engineers, the writers, the film makers and the musicians of the continent work in them and are read, watched and listened to far beyond Africa.",
        "It is also a continent of hard problems, from the wars of the Sahel to a warming climate, from the shrinking of Lake Chad to the debt that weighs on young economies. None of that is the whole story, and none of it is new to a continent that has carried the human story from the beginning. The history of Africa is not finished. It is being written now.",
      ],
      timeline: [
        { year: "1963", text: "The Organisation of African Unity is founded in Addis Ababa." },
        { year: "2002", text: "The African Union replaces the OAU, with a parliament and a court." },
        { year: "2007", text: "M-Pesa launches in Kenya and mobile money spreads across the continent." },
        { year: "2018", text: "The agreement on the African Continental Free Trade Area is signed." },
        { year: "2021", text: "The free trade area begins to be applied, the largest by number of countries." },
        { year: "2030", text: "The African Union aims to silence the guns and to end the conflicts." },
      ],
      people: [
        { name: "Haile Selassie", text: "The emperor of Ethiopia who called the founding meeting of the OAU." },
        { name: "Thabo Mbeki", text: "The president of South Africa who drove the African Union and its plan." },
        { name: "Wangari Maathai", text: "The Kenyan scientist whose tree planting won the Nobel peace prize." },
        { name: "Aliko Dangote", text: "The industrialist whose cement and refinery build across the continent." },
      ],
      places: [
        { name: "Addis Ababa", text: "The headquarters of the African Union." },
        { name: "Lagos", text: "The largest city of the continent and one of its fastest growing economies." },
        { name: "The Sahel", text: "The belt where drought, conflict and migration meet." },
        { name: "Lake Chad", text: "The lake that has shrunk to a fraction of its former size." },
      ],
      glossary: [
        { term: "African Union", text: "The continental body of fifty-four states, founded in 2002." },
        { term: "AfCFTA", text: "The African Continental Free Trade Area, agreed in 2018." },
        { term: "mobile money", text: "Money held and sent by phone rather than through a bank branch." },
        { term: "median age", text: "The age that divides a population into two equal halves." },
        { term: "diaspora", text: "The people of African descent living outside the continent." },
      ],
    },
    fr: {
      essay: [
        "L'Afrique d'aujourd'hui, c'est le continent de l'Union africaine et de la plus grande zone de libre-échange du monde par le nombre de pays. C'est là que l'argent mobile a été inventé, là où vivra un quart de l'humanité en 2050, et où l'âge médian est de dix-neuf ans : un continent jeune, à toutes les mesures.",
        "Cinquante-quatre États appartiennent à l'Union africaine, et la zone de libre-échange conclue en 2018 a commencé à s'appliquer en 2021 : c'est la plus grande du monde par le nombre de pays. Le continent détient les plus grandes réserves mondiales de cobalt et une grande partie du platine, et il construit les barrages, les chemins de fer et les ports qu'on ne l'a pas laissé bâtir pour lui-même.",
        "Ses villes grandissent plus vite que toutes les autres au monde. Lagos, Kinshasa, Le Caire et Dar es Salam dépassent chacune la plupart des capitales européennes, et les ingénieurs, les écrivains, les cinéastes et les musiciens du continent y travaillent et sont lus, vus et écoutés bien au-delà de l'Afrique.",
        "C'est aussi un continent aux problèmes difficiles, des guerres du Sahel au réchauffement climatique, du recul du lac Tchad à la dette qui pèse sur des économies jeunes. Rien de cela n'est toute l'histoire, et rien n'est nouveau pour un continent qui porte l'histoire humaine depuis le commencement. L'histoire de l'Afrique n'est pas terminée : elle s'écrit maintenant.",
      ],
      timeline: [
        { year: "1963", text: "L'Organisation de l'unité africaine est fondée à Addis-Abeba." },
        { year: "2002", text: "L'Union africaine remplace l'OUA, avec un parlement et une cour." },
        { year: "2007", text: "M-Pesa est lancé au Kenya et l'argent mobile se répand sur le continent." },
        { year: "2018", text: "L'accord sur la Zone de libre-échange continentale africaine est signé." },
        { year: "2021", text: "La zone de libre-échange commence à s'appliquer, la plus grande par le nombre de pays." },
        { year: "2030", text: "L'Union africaine vise à faire taire les armes et à mettre fin aux conflits." },
      ],
      people: [
        { name: "Hailé Sélassié", text: "L'empereur d'Éthiopie qui a convoqué la réunion fondatrice de l'OUA." },
        { name: "Thabo Mbeki", text: "Le président sud-africain qui a porté l'Union africaine et son programme." },
        { name: "Wangari Maathai", text: "La scientifique kényane dont les plantations d'arbres ont valu un prix Nobel de la paix." },
        { name: "Aliko Dangote", text: "L'industriel dont le ciment et la raffinerie se construisent à travers le continent." },
      ],
      places: [
        { name: "Addis-Abeba", text: "Le siège de l'Union africaine." },
        { name: "Lagos", text: "La plus grande ville du continent et l'une de ses économies les plus rapides." },
        { name: "Le Sahel", text: "La bande où se rencontrent la sécheresse, les conflits et les migrations." },
        { name: "Le lac Tchad", text: "Le lac qui s'est réduit à une fraction de sa taille ancienne." },
      ],
      glossary: [
        { term: "Union africaine", text: "L'organisation continentale de cinquante-quatre États, fondée en 2002." },
        { term: "ZLECAf", text: "La Zone de libre-échange continentale africaine, conclue en 2018." },
        { term: "argent mobile", text: "De l'argent conservé et envoyé par téléphone plutôt que par une agence bancaire." },
        { term: "âge médian", text: "L'âge qui partage une population en deux moitiés égales." },
        { term: "diaspora", text: "Les personnes d'origine africaine vivant hors du continent." },
      ],
    },
  },
};

/**
 * The study material of one level, in the requested language.
 *
 * An unknown language falls back to English, and a level with no material comes
 * back empty rather than as an error: a screen is what reads this, and a guard in
 * the data is a guard the screen does not need to repeat.
 *
 * @param {number} levelId
 * @param {string} [lang]
 * @returns {Study|null}
 */
export function getLevelStudy(levelId, lang = "en") {
  const entry = LEVEL_STUDY[levelId];
  if (!entry) return null;
  return entry[lang] || entry.en;
}
