import { useState, useRef, useEffect } from "react";
import { VolumeX, Loader2, Play, Pause, Mic } from "lucide-react";
import { useLang, useT } from "../i18n";

// Short story/intro per level id
export const LEVEL_STORIES = {
  1: {
    en: "Around five thousand years ago, along the Nile in North Africa, a civilization rose that would last for three thousand years. Its people built the pyramids at Giza, wrote in hieroglyphs, and were ruled by kings called pharaohs. The river flooded every year and gave the fields their harvest, and the state that grew around it organised labour, writing and trade as few others had.",
    fr: "Il y a environ cinq mille ans, le long du Nil en Afrique du Nord, une civilisation est née qui allait durer trois mille ans. Ses habitants ont bâti les pyramides de Gizeh, écrit en hiéroglyphes, et étaient gouvernés par des rois appelés pharaons. Le fleuve débordait chaque année et donnait la récolte aux champs, et l'État qui s'est construit autour de lui a organisé le travail, l'écriture et le commerce comme peu d'autres."
  },
  2: {
    en: "South of Egypt, in what is today Sudan, the kingdom of Kush grew strong on the third cataract of the Nile. Its kings ruled Egypt for about a century as the twenty-fifth dynasty, and its queens, the Kandakes, led armies themselves. Kush built its own pyramids at Meroe, worked iron, and sent gold north along the river.",
    fr: "Au sud de l'Égypte, dans l'actuel Soudan, le royaume de Koush s'est renforcé sur la troisième cataracte du Nil. Ses rois ont gouverné l'Égypte pendant environ un siècle, comme vingt-cinquième dynastie, et ses reines, les Kandakés, commandaient elles-mêmes les armées. Koush a bâti ses propres pyramides à Méroé, travaillé le fer et fait remonter l'or par le fleuve."
  },
  3: {
    en: "Between the eleventh and fifteenth centuries, in the granite hills of southern Africa, a stone city rose that traded gold and ivory as far as the Swahili coast and beyond. Its walls were built of blocks cut to fit together without mortar, and the Great Enclosure still stands. Great Zimbabwe was the capital of a state that held the gold routes of the interior.",
    fr: "Entre le XIe et le XVe siècle, dans les collines de granite de l'Afrique australe, une cité de pierre s'est élevée, qui commerçait l'or et l'ivoire jusqu'à la côte swahili et au-delà. Ses murs sont faits de blocs taillés pour s'emboîter sans mortier, et la Grande Enceinte tient encore debout. Le Grand Zimbabwe était la capitale d'un État qui contrôlait les routes de l'or de l'intérieur."
  },
  4: {
    en: "In the thirteenth century, Sundiata Keita united the Mandinka kingdoms and founded an empire that reached from the Atlantic to the bend of the Niger. Its wealth came from gold and salt, and its cities, above all Timbuktu and Djenne, became centres of learning. Mansa Musa, who ruled in the fourteenth century, is remembered for his pilgrimage to Mecca and for the scholars who came with him on the way back.",
    fr: "Au XIIIe siècle, Soundjata Keïta a unifié les royaumes mandingues et fondé un empire qui allait de l'Atlantique à la boucle du Niger. Sa richesse venait de l'or et du sel, et ses villes, Tombouctou et Djenné au premier rang, sont devenues des centres de savoir. Mansa Moussa, qui a régné au XIVe siècle, reste connu pour son pèlerinage à La Mecque et pour les savants qui l'ont accompagné au retour."
  },
  5: {
    en: "In the highlands of what are now Ethiopia and Eritrea, the kingdom of Axum grew rich on the trade of the Red Sea. It minted its own coins, raised obelisks cut from single blocks of stone, and adopted Christianity in the fourth century, among the first states in the world to do so. Its ships carried ivory, gold and incense to Rome, India and Arabia.",
    fr: "Dans les hauts plateaux de l'actuelle Éthiopie et de l'Érythrée, le royaume d'Axoum s'est enrichi par le commerce de la mer Rouge. Il a frappé sa propre monnaie, dressé des obélisques taillés dans un seul bloc de pierre, et adopté le christianisme au IVe siècle, parmi les premiers États du monde à le faire. Ses navires portaient ivoire, or et encens vers Rome, l'Inde et l'Arabie."
  },
  6: {
    en: "The largest empire in African history grew along the great bend of the Niger. Under Askia Muhammad, who took the throne in 1493, Songhai held Timbuktu and Djenne, taxed the salt caravans of the Sahara, and kept courts where jurists wrote and argued. In 1591 a Moroccan army armed with firearms broke its cavalry at Tondibi, and the empire came apart within a generation.",
    fr: "Le plus grand empire de l'histoire africaine s'est développé le long de la boucle du Niger. Sous Askia Muhammad, monté sur le trône en 1493, l'Empire songhaï tenait Tombouctou et Djenné, taxait les caravanes de sel du Sahara et entretenait des cours où les juristes écrivaient et discutaient. En 1591, une armée marocaine armée de fusils a brisé sa cavalerie à Tondibi, et l'empire s'est disloqué en une génération."
  },
  7: {
    en: "In the hills of what is now KwaZulu-Natal, a young chief named Shaka turned a small clan into a kingdom in the early nineteenth century. He organised the army by age, shortened the spear for close fighting, and had the regiments live in royal towns. After his death in 1828 the kingdom held its ground against Boer trekkers and then British columns, and was conquered in 1879.",
    fr: "Dans les collines de l'actuel KwaZulu-Natal, un jeune chef nommé Shaka a transformé un petit clan en royaume au début du XIXe siècle. Il a organisé l'armée par classes d'âge, raccourci la lance pour le combat rapproché et installé les régiments dans des villes royales. Après sa mort en 1828, le royaume a tenu tête aux trekboers puis aux colonnes britanniques, avant d'être conquis en 1879."
  },
  8: {
    en: "After the Second World War, the demand for independence spread across the continent. Ghana won it in 1957, the first country in West Africa to do so, and seventeen African states became independent in 1960 alone. The decades that followed were not simple: the borders, the economies and the institutions all came out of colonial rule, and the new states had to build themselves from there.",
    fr: "Après la Seconde Guerre mondiale, l'exigence d'indépendance s'est répandue sur tout le continent. Le Ghana l'a obtenue en 1957, le premier pays d'Afrique de l'Ouest à y parvenir, et dix-sept États africains sont devenus indépendants en 1960 seulement. Les décennies qui ont suivi n'ont pas été simples : les frontières, les économies et les institutions venaient toutes de la domination coloniale, et les nouveaux États ont dû se construire à partir de là."
  },
  9: {
    en: "Every human being alive today belongs to a species that was born in Africa. More than 300,000 years ago, our ancestors lived across the whole continent, from the hills of Morocco to the Ethiopian rift valley. They knapped stone, painted on rock, and buried their dead with care. Long before any kingdom existed, Africa was already carrying the entire human story.",
    fr: "Tous les êtres humains vivants appartiennent à une espèce née en Afrique. Il y a plus de 300 000 ans, nos ancêtres vivaient sur tout le continent, des collines du Maroc à la vallée du Rift éthiopien. Ils taillaient la pierre, peignaient sur la roche et enterraient leurs morts avec soin. Bien avant le premier royaume, l'Afrique portait déjà toute l'histoire humaine."
  },
  10: {
    en: "On the coast of what is now Tunisia, Phoenician sailors founded a city that would challenge Rome for the mastery of the Mediterranean. Carthage built a trading empire, sent Hannibal over the Alps with elephants, and ruled the sea for centuries. Beyond it lay the Berber kingdoms of Numidia, whose kings and writers, and one emperor, left their mark on Rome itself. When Carthage fell, North Africa became one of the granaries of the ancient world.",
    fr: "Sur la côte de l'actuelle Tunisie, des marins phéniciens ont fondé une ville qui allait disputer à Rome la maîtrise de la Méditerranée. Carthage a bâti un empire commerçant, envoyé Hannibal franchir les Alpes avec des éléphants et régné sur la mer pendant des siècles. Au-delà s'étendaient les royaumes berbères de Numidie, dont les rois, les écrivains et un empereur ont marqué Rome elle-même. Quand Carthage est tombée, l'Afrique du Nord est devenue l'un des greniers du monde antique."
  },
  11: {
    en: "Around three thousand years ago, farmers in the borderlands of Nigeria and Cameroon began to move. They carried iron tools, seed crops and their languages, and over two thousand years their descendants settled from the Great Lakes to the Cape. In central Nigeria, the Nok artists modelled heads of astonishing size and detail in clay. This is the age when iron, farming and the Bantu languages reshaped the continent.",
    fr: "Il y a environ trois mille ans, des agriculteurs des confins du Nigeria et du Cameroun se sont mis en marche. Ils emportaient des outils de fer, des semences et leurs langues, et en deux mille ans leurs descendants se sont installés des Grands Lacs jusqu'au Cap. Au centre du Nigeria, les artistes nok ont modelé dans l'argile des têtes d'une taille et d'une finesse surprenantes. C'est l'époque où le fer, l'agriculture et les langues bantoues ont redessiné le continent."
  },
  12: {
    en: "While much of Europe was rebuilding, a Christian kingdom in the Ethiopian highlands was carving churches into solid rock. The Zagwe kings cut the eleven churches of Lalibela downwards, so that each one rises from the ground like a planted cathedral. Then the Solomonic dynasty took the throne in 1270 and ruled for more than six centuries. When an army from the sultanate of Adal almost destroyed the kingdom in the 1530s, Ethiopia fought back and kept its own script, its own church and its own history.",
    fr: "Alors qu'une grande partie de l'Europe se reconstruisait, un royaume chrétien des hauts plateaux éthiopiens creusait des églises dans la roche massive. Les rois zagwé ont taillé vers le bas les onze églises de Lalibela, si bien que chacune sort de terre comme une cathédrale plantée. Puis la dynastie salomonide a pris le trône en 1270 et a régné plus de six siècles. Quand une armée du sultanat d'Adal a failli détruire le royaume dans les années 1530, l'Éthiopie a résisté et a gardé son écriture, son Église et son histoire."
  },
  13: {
    en: "In the western Sahel, a kingdom grew rich on two things everybody needed: gold and salt. Caravans carried Saharan salt south and forest gold north, and Ghana taxed every load. Its capital, Koumbi Saleh, had a royal town and a merchant town, and Arab geographers described its court with wonder. When the Almoravids sacked the capital in 1076, the empire began to fade, and Mali rose in its place.",
    fr: "Dans le Sahel occidental, un royaume s'est enrichi grâce à deux produits dont tout le monde avait besoin : l'or et le sel. Les caravanes descendaient le sel du Sahara vers le sud et remontaient l'or des forêts vers le nord, et le Ghana taxait chaque charge. Sa capitale, Koumbi Saleh, comptait une ville royale et une ville marchande, et les géographes arabes décrivaient sa cour avec admiration. Quand les Almoravides ont pillé la capitale en 1076, l'empire a commencé à s'effacer, et le Mali a pris sa place."
  },
  14: {
    en: "South of the Sahara and west of the Nile, two worlds met: the grasslands around Lake Chad and the caravan routes to the Mediterranean. Kanem-Bornu ruled that meeting place for about a thousand years, from the Sayfawa dynasty to the musketeers of Idris Alooma. To the west, the walled cities of the Hausa traded cloth, leather, horses and books, and several of their markets still open today.",
    fr: "Au sud du Sahara et à l'ouest du Nil, deux mondes se rencontraient : les savanes autour du lac Tchad et les routes caravanières vers la Méditerranée. Kanem-Bornou a gouverné ce carrefour pendant environ mille ans, de la dynastie sayfawa aux mousquetaires d'Idris Alooma. À l'ouest, les cités fortifiées haoussa commerçaient tissus, cuir, chevaux et livres, et plusieurs de leurs marchés s'ouvrent encore aujourd'hui."
  },
  15: {
    en: "The monsoon blew the dhows south in one season and north in the other, and along that rhythm a string of ports grew on the East African coast. Kilwa traded the gold of the interior for Chinese porcelain and Persian pottery, and Ibn Battuta called it one of the finest towns in the world. The Swahili spoke a Bantu language, wrote it in Arabic script, and built a shared culture that still defines the coast.",
    fr: "La mousson poussait les boutres vers le sud pendant une saison et vers le nord pendant l'autre, et sur ce rythme une chaîne de ports a grandi sur la côte est-africaine. Kilwa échangeait l'or de l'intérieur contre de la porcelaine chinoise et de la poterie perse, et Ibn Battuta l'a décrite comme l'une des plus belles villes du monde. Les Swahili parlaient une langue bantoue, l'écrivaient en caractères arabes et ont bâti une culture commune qui définit encore la côte."
  },
  16: {
    en: "Behind the Atlantic coast, in the forests and the savannah beyond them, some of the most remarkable states of Africa took shape. The Kongo kings wrote to Lisbon as equals, and the prophetess Kimpa Vita called her people to unity. In Benin, brass casters produced the plaques and heads that British troops would loot in 1897. In Ife, artists modelled faces of a calm and startling realism, and the horsemen of Oyo held the savannah for centuries.",
    fr: "Derrière la côte atlantique, dans les forêts et les savanes qui les prolongent, quelques-uns des États les plus remarquables d'Afrique ont pris forme. Les rois du Kongo écrivaient à Lisbonne d'égal à égal, et la prophétesse Kimpa Vita appelait son peuple à l'unité. Au Bénin, les fondeurs de laiton ont produit les plaques et les têtes que les troupes britanniques allaient piller en 1897. À Ifé, les artistes modelaient des visages d'un réalisme calme et saisissant, et les cavaliers d'Oyo ont tenu la savane pendant des siècles."
  },
  17: {
    en: "For more than three centuries, ships carried Africans across the Atlantic against their will. Roughly 12.5 million people were put on board, and about 10.7 million reached the Americas alive. Behind them they left villages emptied, ahead of them slavery. Yet the trade was resisted at every step, by kings who wrote to Lisbon, by uprisings at sea and on land, by writers such as Olaudah Equiano, and finally by the abolitionists who ended it.",
    fr: "Pendant plus de trois siècles, des navires ont transporté des Africains à travers l'Atlantique contre leur volonté. Environ 12,5 millions de personnes ont été embarquées, et environ 10,7 millions ont atteint les Amériques vivantes. Derrière elles, des villages vidés ; devant elles, l'esclavage. Pourtant la traite a été combattue à chaque étape, par des rois qui écrivaient à Lisbonne, par des révoltes en mer et sur terre, par des auteurs comme Olaudah Equiano, et enfin par les abolitionnistes qui l'ont fait cesser."
  },
  18: {
    en: "In a few decades, European armies conquered almost the whole continent. Borders were drawn in Berlin in 1884 and 1885, with no African in the room. Resistance was immediate and often heroic: Samori Toure in the west, the Maji Maji rising in the east, the Herero and Nama in the south. Ethiopia alone won its war, at Adwa in 1896. And as empire spread, so did the idea that Africans should govern Africa.",
    fr: "En quelques décennies, les armées européennes ont conquis presque tout le continent. Les frontières ont été tracées à Berlin en 1884 et 1885, sans aucun Africain dans la salle. La résistance a été immédiate et souvent héroïque : Samori Touré à l'ouest, la révolte des Maji Maji à l'est, les Herero et les Nama au sud. Seule l'Éthiopie a gagné sa guerre, à Adoua en 1896. Et à mesure que l'empire avançait, l'idée que les Africains devaient gouverner l'Afrique se répandait."
  },
  19: {
    en: "In 1948, South Africa turned racial separation into the law of the land. Families were moved, passes were checked, schools were split. The answer came from Sharpeville in 1960 to Soweto in 1976, from the prison cells of Robben Island to the words of Steve Biko. After decades of struggle and world pressure, Nelson Mandela walked free in 1990, and in 1994 South Africans of every colour voted in the same election.",
    fr: "En 1948, l'Afrique du Sud a fait de la séparation raciale la loi du pays. Des familles ont été déplacées, les passes étaient contrôlées, les écoles séparées. La réponse est venue de Sharpeville en 1960 à Soweto en 1976, des cellules de Robben Island aux paroles de Steve Biko. Après des décennies de lutte et de pressions internationales, Nelson Mandela est sorti libre en 1990, et en 1994 les Sud-Africains de toutes les couleurs ont voté lors de la même élection."
  },
  20: {
    en: "Africa today is the continent of the African Union and of the largest free trade area in the world by number of countries. It is where mobile money was invented, where a quarter of the world's people will live by 2050, and where the median age is nineteen. It is also a continent of hard problems, from the wars of the Sahel to a warming climate. The history of Africa is not finished. It is being written now.",
    fr: "L'Afrique d'aujourd'hui, c'est le continent de l'Union africaine et de la plus grande zone de libre-échange du monde par le nombre de pays. C'est là que l'argent mobile a été inventé, là où vivra un quart de l'humanité en 2050, et où l'âge médian est de dix-neuf ans. C'est aussi un continent aux problèmes difficiles, des guerres du Sahel aux effets du réchauffement climatique. L'histoire de l'Afrique n'est pas terminée : elle s'écrit maintenant."
  }
};

export function getLevelStory(levelId, lang) {
  return LEVEL_STORIES[levelId]?.[lang] || LEVEL_STORIES[levelId]?.en || "";
}

export default function AudioNarrator({ levelId }) {
  const t = useT();
  const [state, setState] = useState("idle"); // idle | playing | paused | loading | unsupported
  const utteranceRef = useRef(null);
  const lang = useLang();

  const story = LEVEL_STORIES[levelId]?.[lang] || LEVEL_STORIES[levelId]?.en;

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  if (!story) return null;
  if (typeof window === "undefined" || !window.speechSynthesis) return null;

  const handlePlay = () => {
    const synth = window.speechSynthesis;

    if (state === "playing") {
      synth.pause();
      setState("paused");
      return;
    }

    if (state === "paused") {
      synth.resume();
      setState("playing");
      return;
    }

    // Fresh start
    synth.cancel();
    setState("loading");

    const utterance = new SpeechSynthesisUtterance(story);
    utterance.lang = lang === "fr" ? "fr-FR" : "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1.05;

    // Try to pick a nice voice
    const voices = synth.getVoices();
    const preferred = voices.find(v =>
      v.lang.startsWith(lang === "fr" ? "fr" : "en") && !v.name.includes("Google")
    ) || voices.find(v => v.lang.startsWith(lang === "fr" ? "fr" : "en"));
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => setState("playing");
    utterance.onend = () => setState("idle");
    utterance.onerror = () => setState("idle");

    utteranceRef.current = utterance;
    synth.speak(utterance);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setState("idle");
  };

  const isActive = state === "playing" || state === "paused";

  return (
    <div
      className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3"
    >
      <div className="flex flex-col gap-1 flex-1">
        <p className="flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-widest">
          <Mic className="w-3.5 h-3.5" aria-hidden="true" />
          {lang === "fr" ? "Écouter l'histoire" : "Listen to the story"}
        </p>
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{story.substring(0, 80)}…</p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {isActive && (
          <button
            onClick={handleStop}
            aria-label={t.stopAudio}
            className="p-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
          >
            <VolumeX className="w-4 h-4 text-slate-600" aria-hidden="true" />
          </button>
        )}
        <button
          onClick={handlePlay}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-sm transition-all ${
            state === "playing"
              ? "bg-orange-700 text-white shadow-md shadow-orange-200"
              : "bg-amber-700 text-white hover:bg-amber-800 shadow-md shadow-amber-200"
          }`}
        >
          {state === "loading" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : state === "playing" ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          {state === "playing"
            ? (lang === "fr" ? "Pause" : "Pause")
            : state === "paused"
            ? (lang === "fr" ? "Reprendre" : "Resume")
            : (lang === "fr" ? "Écouter" : "Listen")}
        </button>
      </div>
    </div>
  );
}