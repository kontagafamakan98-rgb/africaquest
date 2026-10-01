/**
 * Colonial Conquest: one level of the game, on its own.
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
import { Map } from "lucide-react";

export default {
  id: 18,
  order: 23,
  era: "modern",
  from: 1884,
  title: "Colonial Conquest",
  subtitle: "Resistance, Adwa and pan-Africanism",
  region: "Across the continent",
  color: "from-rose-600 to-red-900",
  icon: Map,
  gallery: {
    en: [
      {
        file: "/photos/level-18-1.jpg",
        caption: "Emperor Menelik II at Adwa, as the French newspaper Le Petit Journal pictured the victory of 1896.",
        credit: "F. Méaulle · Public domain · Wikimedia Commons",
        author: "F. Méaulle",
        licence: "Public domain",
        source: "https://commons.wikimedia.org/wiki/File:Menelik_-_Adoua.jpg",
      },
      {
        file: "/photos/level-18-2.jpg",
        caption: "A French cartoon of 1884 showing the European powers carving up Africa at the Berlin Conference.",
        credit: "François Maréchal · Public domain · Wikimedia Commons",
        author: "François Maréchal",
        licence: "Public domain",
        source: "https://commons.wikimedia.org/wiki/File:Cartoon_depicting_Leopold_2_and_other_emperial_powers_at_Berlin_conference_1884.jpg",
      },
      {
        file: "/photos/level-18-3.jpg",
        caption: "Delegates of the fourth Pan-African Congress, held in New York in 1927.",
        credit: "Unknown author · Public domain · Wikimedia Commons",
        author: "Unknown author",
        licence: "Public domain",
        source: "https://commons.wikimedia.org/wiki/File:Delegates_for_4th_PAC_in_New_York_1927.jpg",
      },
    ],
    fr: [
      {
        file: "/photos/level-18-1.jpg",
        caption: "L'empereur Ménélik II à Adoua, tel que le journal français Le Petit Journal illustra la victoire de 1896.",
        credit: "F. Méaulle · domaine public · Wikimedia Commons",
        author: "F. Méaulle",
        licence: "domaine public",
        source: "https://commons.wikimedia.org/wiki/File:Menelik_-_Adoua.jpg",
      },
      {
        file: "/photos/level-18-2.jpg",
        caption: "Une caricature française de 1884 montrant les puissances européennes se partager l'Afrique à la conférence de Berlin.",
        credit: "François Maréchal · domaine public · Wikimedia Commons",
        author: "François Maréchal",
        licence: "domaine public",
        source: "https://commons.wikimedia.org/wiki/File:Cartoon_depicting_Leopold_2_and_other_emperial_powers_at_Berlin_conference_1884.jpg",
      },
      {
        file: "/photos/level-18-3.jpg",
        caption: "Les délégués du quatrième Congrès panafricain, tenu à New York en 1927.",
        credit: "Unknown author · domaine public · Wikimedia Commons",
        author: "Unknown author",
        licence: "domaine public",
        source: "https://commons.wikimedia.org/wiki/File:Delegates_for_4th_PAC_in_New_York_1927.jpg",
      },
    ],
  },
  study: {
    en: {
      essay: ["In a few decades, European armies conquered almost the whole continent. The machine gun, the railway and the steamboat made it possible, and the quarrels of Europe made it urgent: each power wanted to hold the ground before its neighbours could.", "Borders were drawn in Berlin in 1884 and 1885, with no African in the room. Lines were ruled across deserts, mountains and the territories of peoples who had never been at war with each other, and one people could be split between two colonies or two enemies pushed into one.", "Resistance was immediate and often heroic: Samori Toure in the west, the Maji Maji rising in the east, the Herero and Nama in the south. Ethiopia alone won its war, at Adwa in 1896, where an African army equipped with modern rifles defeated a European one in the field.", "The colonisers drew the borders they wanted, ruled through appointed chiefs, and laid railways from the mines and the plantations down to the sea. The land was taken, families were moved, and the schools taught the language of the conqueror. Ethiopia entered the twentieth century as the one country in Africa governed by its own rulers, until Italy occupied it from 1936 to 1941."],
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
        {
          name: "German South West Africa",
          text: "The colony where the Herero and Nama were destroyed.",
        },
      ],
      glossary: [
        {
          term: "partition",
          text: "The division of the continent into colonies by the European powers.",
        },
        {
          term: "protectorate",
          text: "A territory ruled by a foreign power under an agreement with a local ruler.",
        },
        {
          term: "indirect rule",
          text: "Governing through existing chiefs and institutions rather than directly.",
        },
        { term: "concession", text: "A large area of land granted to a company to exploit." },
        {
          term: "Maji",
          text: "The water, and the medicine, that the rising of 1905 took its name from.",
        },
      ],
    },
    fr: {
      essay: ["En quelques décennies, les armées européennes ont conquis presque tout le continent. La mitrailleuse, le chemin de fer et le vapeur l'ont rendu possible, et les querelles de l'Europe l'ont rendu urgent : chaque puissance voulait tenir le terrain avant ses voisins.", "Les frontières ont été tracées à Berlin en 1884 et 1885, sans aucun Africain dans la salle. On a tiré des lignes à travers les déserts, les montagnes et les territoires de peuples qui n'avaient jamais été en guerre les uns contre les autres, et un même peuple a pu être partagé entre deux colonies, ou deux ennemis réunis dans une seule.", "La résistance a été immédiate et souvent héroïque : Samori Touré à l'ouest, la révolte des Maji Maji à l'est, les Herero et les Nama au sud. Seule l'Éthiopie a gagné sa guerre, à Adoua en 1896, où une armée africaine équipée de fusils modernes a battu une armée européenne en rase campagne.", "Les colonisateurs ont tracé les frontières qu'ils voulaient, gouverné par des chefs nommés et bâti des chemins de fer des mines et des plantations jusqu'à la mer. La terre a été prise, des familles déplacées, et les écoles ont enseigné la langue du vainqueur. L'Éthiopie est entrée dans le XXe siècle comme le seul pays d'Afrique gouverné par ses propres souverains, jusqu'à l'occupation italienne de 1936 à 1941."],
      timeline: [
        { year: "1884", text: "La conférence de Berlin s'ouvre pour fixer les règles du partage." },
        { year: "1896", text: "L'Éthiopie bat une armée italienne à Adoua et garde son indépendance." },
        { year: "1897", text: "Les troupes britanniques prennent Bénin et emportent ses bronzes." },
        { year: "1905", text: "La révolte des Maji Maji commence en Afrique orientale allemande." },
        { year: "1907", text: "Les Herero et les Nama sont écrasés en Afrique du Sud-Ouest allemande." },
        { year: "1936", text: "L'Italie occupe l'Éthiopie, libérée de nouveau en 1941." },
      ],
      people: [
        {
          name: "Samori Touré",
          text: "Le chef mandingue qui a combattu les Français pendant vingt ans.",
        },
        { name: "Ménélik II", text: "L'empereur d'Éthiopie dont l'armée a gagné à Adoua." },
        { name: "Kinjikitilé Ngwalé", text: "Le prophète de la révolte des Maji Maji." },
        { name: "Samuel Maharero", text: "Le chef des Herero contre la colonie allemande." },
      ],
      places: [
        { name: "Berlin", text: "La ville où les règles du partage ont été fixées." },
        {
          name: "Adoua",
          text: "Le champ de bataille des hauts plateaux éthiopiens où l'Italie a été battue.",
        },
        { name: "Bénin", text: "La capitale prise par les troupes britanniques en 1897." },
        {
          name: "L'Afrique du Sud-Ouest allemande",
          text: "La colonie où les Herero et les Nama ont été détruits.",
        },
      ],
      glossary: [
        {
          term: "partage",
          text: "La division du continent en colonies par les puissances européennes.",
        },
        {
          term: "protectorat",
          text: "Un territoire gouverné par une puissance étrangère en vertu d'un accord avec un souverain local.",
        },
        {
          term: "administration indirecte",
          text: "Gouverner par les chefs et les institutions existants plutôt que directement.",
        },
        {
          term: "concession",
          text: "Une vaste étendue de terre accordée à une compagnie pour l'exploiter.",
        },
        { term: "Maji", text: "L'eau, et le remède, qui ont donné son nom à la révolte de 1905." },
      ],
    },
  },
  questions: [
    {
      question: "Which conference of 1884 and 1885 divided Africa between European powers, with no African representative present?",
      options: ["The Berlin Conference", "The Congress of Vienna", "The Peace of Westphalia", "The Yalta Conference"],
      correct: 0,
      fact: "Fourteen European states drew lines across the map, and many of those borders are still the borders of Africa today.",
      source: { label: "Encyclopaedia Britannica, \"Berlin West Africa Conference\"" },
    },
    {
      question: "Which Ethiopian emperor destroyed an Italian army at Adwa in 1896?",
      options: ["Menelik II", "Tewodros II", "Yohannes IV", "Haile Selassie"],
      correct: 0,
      fact: "With the empress Taytu and an army of well over 100,000, Menelik won the greatest victory of the colonial wars and Italy had to recognise Ethiopian independence.",
      source: { label: "Encyclopaedia Britannica, \"Battle of Adwa\"" },
    },
    {
      question: "Which Mandinka leader fought the French in West Africa until his capture in 1898?",
      options: ["Samori Toure", "Lat Dior", "Behanzin", "Mamadou Lamine"],
      correct: 0,
      fact: "Samori Toure built the Wassoulou empire and resisted for almost twenty years, mixing firearms, cavalry and diplomacy.",
      source: { label: "Encyclopaedia Britannica, \"Samory Touré\"" },
    },
    {
      question: "The Maji Maji rebellion of 1905 to 1907 took place in which colony?",
      options: ["German East Africa", "French Algeria", "Portuguese Angola", "Belgian Congo"],
      correct: 0,
      fact: "The rising began with a medicine believed to turn bullets into water, and the German repression killed hundreds of thousands through war and famine.",
      source: { label: "Encyclopaedia Britannica, \"Maji Maji rebellion\"" },
    },
    {
      question: "Which peoples of Namibia suffered a genocide by German troops between 1904 and 1908?",
      options: ["The Herero and the Nama", "The Zulu and the Xhosa", "The Tuareg and the Amazigh", "The Somali and the Oromo"],
      correct: 0,
      fact: "Tens of thousands were killed or driven into the desert, and historians and the United Nations now use the word genocide for what happened.",
      source: {
        label: "UNESCO, General History of Africa, volume VII",
        url: "https://www.unesco.org/en/general-history-africa",
      },
    },
    {
      question: "Which colonial policy offered French citizenship to a small group of Africans in the four communes of Senegal?",
      options: ["Assimilation", "Indirect rule", "Apartheid", "Protectorate"],
      correct: 0,
      fact: "Britain preferred indirect rule through local chiefs, while France spoke of assimilation but granted citizenship to very few people.",
      source: {
        label: "UNESCO, General History of Africa, volume VII",
        url: "https://www.unesco.org/en/general-history-africa",
      },
    },
    {
      question: "Which 1900 meeting in London was the first Pan-African conference?",
      options: ["The Pan-African Conference", "The Bandung Conference", "The Congress of Berlin", "The Dakar Congress"],
      correct: 0,
      fact: "W. E. B. Du Bois took part, and that meeting began a movement which would later demand independence for the whole continent.",
      source: { label: "Encyclopaedia Britannica, \"W. E. B. Du Bois\"" },
    },
    {
      question: "Which movement of the 1930s, led by writers such as Leopold Sedar Senghor and Aime Cesaire, asserted the value of Black cultures?",
      options: ["Negritude", "Modernism", "Pan-Arabism", "Abolitionism"],
      correct: 0,
      fact: "Negritude answered colonial contempt with poetry and essays, and it shaped the thinking of the leaders who took power after 1960.",
      source: { label: "Encyclopaedia Britannica, \"Négritude\"" },
    },
    {
      question: "Which Ethiopian emperor died fighting the Italians at Metemma in 1889?",
      options: ["Yohannes IV", "Tewodros II", "Menelik II", "Haile Selassie"],
      correct: 0,
      fact: "Yohannes IV defended Ethiopia's borders against Sudanese and Italian forces, and his death opened the way for Menelik II to take the throne.",
      source: { label: "Encyclopaedia Britannica, \"Yohannes IV\"" },
    },
    {
      question: "Which chartered company ruled much of south-central Africa for a British businessman after 1889?",
      options: ["The British South Africa Company", "The Royal Niger Company", "The Imperial British East Africa Company", "The German East Africa Company"],
      correct: 0,
      fact: "Cecil Rhodes's British South Africa Company was given a royal charter to govern and exploit a vast territory in the name of one company.",
      source: { label: "Encyclopaedia Britannica, \"British South Africa Company\"" },
    },
    {
      question: "Which king of the Belgians held the Congo Free State as his private property?",
      options: ["Leopold II", "William II", "Victoria", "Umberto I"],
      correct: 0,
      fact: "Leopold II ruled the Congo Free State as a private estate from 1885, and the quotas imposed there killed millions before Belgium took the territory over in 1908.",
      source: { label: "Encyclopaedia Britannica, \"Leopold II\"" },
    },
    {
      question: "Which protest by Igbo women in 1929 turned against colonial taxation in Nigeria?",
      options: ["The Aba Women's War", "The Maji Maji rebellion", "The Mau Mau uprising", "The Bambatha rebellion"],
      correct: 0,
      fact: "Thousands of women marched on the warrant chiefs and the British offices, and the war forced a change in the way the colony was run.",
      source: {
        label: "UNESCO, General History of Africa, volume VII",
        url: "https://www.unesco.org/en/general-history-africa",
      },
    },
    {
      question: "Which Egyptian leader led the delegation that demanded independence from Britain in 1919?",
      options: ["Saad Zaghlul", "Gamal Abdel Nasser", "Mohamed Ali", "Ahmed Urabi"],
      correct: 0,
      fact: "Saad Zaghlul led the delegation, was deported, and the protest that followed became the revolution of 1919.",
      source: { label: "Encyclopaedia Britannica, \"Saad Zaghlul\"" },
    },
    {
      question: "Which North African territory did Italy take from the Ottoman empire in 1911?",
      options: ["Libya", "Tunisia", "Egypt", "Morocco"],
      correct: 0,
      fact: "Italy seized Libya in a short war and spent the next twenty years fighting the resistance led by Omar al-Mukhtar.",
      source: { label: "Encyclopaedia Britannica, \"Libya\"" },
    },
    {
      question: "Which war of 1899 to 1902 between Britain and the Boer republics ended in a British victory?",
      options: ["The South African War", "The Zulu War", "The Crimean War", "The Matabele War"],
      correct: 0,
      fact: "The South African War ended with the annexation of the Boer republics, and the Union of South Africa was created eight years later.",
      source: { label: "Encyclopaedia Britannica, \"South African War\"" },
    },
    {
      question: "Which kingdom of Uganda rose against British rule in 1897?",
      options: ["Buganda", "Bunyoro", "Karague", "Rwanda"],
      correct: 0,
      fact: "The kabaka Mwanga fought the British and lost his throne, and Buganda was made a protectorate with its own administration inside it.",
      source: { label: "Encyclopaedia Britannica, \"Buganda\"" },
    },
    {
      question: "Which two Boer republics fought Britain in 1899?",
      options: ["The South African Republic and the Orange Free State", "Egypt and Sudan", "Natal and the Cape", "Rhodesia and Nyasaland"],
      correct: 0,
      fact: "The two republics had made an alliance in 1897, and the war began with their ultimatum rather than with a British advance.",
      source: { label: "Encyclopaedia Britannica, \"South African War\"" },
    },
    {
      question: "Which German colony of the south was occupied by South African troops in 1915?",
      options: ["German South West Africa", "German East Africa", "Kamerun", "Togoland"],
      correct: 0,
      fact: "South African troops took German South West Africa in a campaign of months, and the territory was held under a mandate until 1990.",
      source: { label: "Encyclopaedia Britannica, \"Namibia\"" },
    },
    {
      question: "Which railway, begun at Mombasa in 1896, reached Lake Victoria in 1901?",
      options: ["The Uganda Railway", "The Cape to Cairo Railway", "The Benguela Railway", "The Tazara Railway"],
      correct: 0,
      fact: "The Uganda Railway was built with labour brought from India and was paid for by taxes and by the land it opened to settlers.",
      source: {
        label: "UNESCO, General History of Africa, volume VII",
        url: "https://www.unesco.org/en/general-history-africa",
      },
    },
    {
      question: "Which Asante king was exiled to the Seychelles after refusing British rule in 1896?",
      options: ["Prempeh I", "Cetshwayo", "Samori Toure", "Menelik II"],
      correct: 0,
      fact: "Prempeh I was taken away to keep the gold trade under control, and he was allowed home only when the British had nothing left to fear.",
      source: { label: "Encyclopaedia Britannica, \"Asante empire\"" },
    },
    {
      question: "Which of these spread fastest in the colonies after the conquest?",
      options: ["Prophets and independent churches", "Trade unions", "Political parties", "Newspapers"],
      correct: 0,
      fact: "Preachers promised a coming justice and formed churches outside the missions, and the colonial officers watched them with more fear than they admitted.",
      source: {
        label: "UNESCO, General History of Africa, volume VII",
        url: "https://www.unesco.org/en/general-history-africa",
      },
    },
  ],
  fr: {
    title: "La conquête coloniale",
    subtitle: "Résistances, Adoua et panafricanisme",
    region: "Sur tout le continent",
    questions: [
      {
        question: "Quelle conférence de 1884 et 1885 a partagé l'Afrique entre puissances européennes, sans aucun représentant africain ?",
        options: ["La conférence de Berlin", "Le congrès de Vienne", "La paix de Westphalie", "La conférence de Yalta"],
        fact: "Quatorze États européens ont tracé des lignes sur la carte, et beaucoup de ces frontières sont encore celles de l'Afrique aujourd'hui.",
        source: "Encyclopaedia Britannica, notice « Berlin West Africa Conference »",
      },
      {
        question: "Quel empereur éthiopien a anéanti une armée italienne à Adoua en 1896 ?",
        options: ["Ménélik II", "Tewodros II", "Yohannes IV", "Haïlé Sélassié"],
        fact: "Avec l'impératrice Taytu et une armée de bien plus de 100 000 hommes, Ménélik a remporté la plus grande victoire des guerres coloniales et l'Italie a dû reconnaître l'indépendance de l'Éthiopie.",
        source: "Encyclopaedia Britannica, notice « Battle of Adwa »",
      },
      {
        question: "Quel chef mandingue a combattu les Français en Afrique de l'Ouest jusqu'à sa capture en 1898 ?",
        options: ["Samori Touré", "Lat Dior", "Béhanzin", "Mamadou Lamine"],
        fact: "Samori Touré a bâti l'empire du Wassoulou et résisté près de vingt ans, en mêlant armes à feu, cavalerie et diplomatie.",
        source: "Encyclopaedia Britannica, notice « Samory Touré »",
      },
      {
        question: "La révolte des Maji Maji, de 1905 à 1907, a eu lieu dans quelle colonie ?",
        options: ["L'Afrique orientale allemande", "L'Algérie française", "L'Angola portugais", "Le Congo belge"],
        fact: "Le soulèvement a commencé avec un remède censé transformer les balles en eau, et la répression allemande a tué des centaines de milliers de personnes par la guerre et la famine.",
        source: "Encyclopaedia Britannica, notice « Maji Maji rebellion »",
      },
      {
        question: "Quels peuples de Namibie ont subi un génocide commis par les troupes allemandes entre 1904 et 1908 ?",
        options: ["Les Herero et les Nama", "Les Zoulous et les Xhosas", "Les Touaregs et les Amazighs", "Les Somaliens et les Oromos"],
        fact: "Des dizaines de milliers de personnes ont été tuées ou chassées dans le désert, et les historiens comme les Nations unies emploient aujourd'hui le mot génocide.",
        source: "UNESCO, Histoire générale de l'Afrique, volume VII",
      },
      {
        question: "Quelle politique coloniale offrait la citoyenneté française à un petit groupe d'Africains dans les quatre communes du Sénégal ?",
        options: ["L'assimilation", "L'administration indirecte", "L'apartheid", "Le protectorat"],
        fact: "La Grande-Bretagne préférait gouverner par les chefs locaux, tandis que la France parlait d'assimilation mais n'accordait la citoyenneté qu'à très peu de gens.",
        source: "UNESCO, Histoire générale de l'Afrique, volume VII",
      },
      {
        question: "Quelle réunion de 1900 à Londres a été la première conférence panafricaine ?",
        options: ["La conférence panafricaine", "La conférence de Bandung", "Le congrès de Berlin", "Le congrès de Dakar"],
        fact: "W. E. B. Du Bois y a participé, et cette réunion a lancé un mouvement qui allait plus tard réclamer l'indépendance de tout le continent.",
        source: "Encyclopaedia Britannica, notice « W. E. B. Du Bois »",
      },
      {
        question: "Quel mouvement des années 1930, porté par des écrivains comme Léopold Sédar Senghor et Aimé Césaire, affirmait la valeur des cultures noires ?",
        options: ["La négritude", "Le modernisme", "Le panarabisme", "L'abolitionnisme"],
        fact: "La négritude a répondu au mépris colonial par la poésie et l'essai, et elle a marqué la pensée des dirigeants arrivés au pouvoir après 1960.",
        source: "Encyclopaedia Britannica, notice « Négritude »",
      },
      {
        question: "Quel empereur éthiopien est mort en combattant les Italiens à Metemma en 1889 ?",
        options: ["Yohannes IV", "Téwodros II", "Ménélik II", "Haïlé Sélassié"],
        fact: "Yohannes IV a défendu les frontières de l'Éthiopie face aux forces soudanaises et italiennes, et sa mort a ouvert à Ménélik II la voie du trône.",
        source: "Encyclopaedia Britannica, notice « Yohannes IV »",
      },
      {
        question: "Quelle compagnie à charte a gouverné une grande partie du centre-sud de l'Afrique pour le compte d'un homme d'affaires britannique après 1889 ?",
        options: ["La British South Africa Company", "La Royal Niger Company", "L'Imperial British East Africa Company", "La German East Africa Company"],
        fact: "La British South Africa Company de Cecil Rhodes a reçu une charte royale pour gouverner et exploiter un immense territoire au nom d'une seule entreprise.",
        source: "Encyclopaedia Britannica, notice « British South Africa Company »",
      },
      {
        question: "Quel roi des Belges détenait l'État indépendant du Congo comme sa propriété privée ?",
        options: ["Léopold II", "Guillaume II", "Victoria", "Humbert Ier"],
        fact: "Léopold II a gouverné l'État indépendant du Congo comme un domaine privé à partir de 1885, et les quotas imposés y ont tué des millions de personnes avant que la Belgique n'annexe le territoire en 1908.",
        source: "Encyclopaedia Britannica, notice « Leopold II »",
      },
      {
        question: "Quelle protestation de femmes igbo en 1929 s'est retournée contre l'impôt colonial au Nigeria ?",
        options: ["La guerre des femmes d'Aba", "La rébellion maji-maji", "La révolte des Mau Mau", "La rébellion de Bambatha"],
        fact: "Des milliers de femmes ont marché sur les chefs nommés par les Britanniques et sur leurs bureaux, et la guerre a forcé un changement dans l'administration de la colonie.",
        source: "UNESCO, Histoire générale de l'Afrique, volume VII",
      },
      {
        question: "Quel dirigeant égyptien a mené la délégation qui a réclamé l'indépendance au Royaume-Uni en 1919 ?",
        options: ["Saad Zaghloul", "Gamal Abdel Nasser", "Mohamed Ali", "Ahmed Orabi"],
        fact: "Saad Zaghloul a mené la délégation, a été déporté, et la protestation qui a suivi est devenue la révolution de 1919.",
        source: "Encyclopaedia Britannica, notice « Saad Zaghlul »",
      },
      {
        question: "Quel territoire d'Afrique du Nord l'Italie a-t-elle pris à l'Empire ottoman en 1911 ?",
        options: ["La Libye", "La Tunisie", "L'Égypte", "Le Maroc"],
        fact: "L'Italie s'est emparée de la Libye en une courte guerre, puis a passé vingt ans à combattre la résistance menée par Omar al-Mokhtar.",
        source: "Encyclopaedia Britannica, notice « Libya »",
      },
      {
        question: "Quelle guerre de 1899 à 1902 entre la Grande-Bretagne et les républiques boers s'est terminée par une victoire britannique ?",
        options: ["La guerre d'Afrique du Sud", "La guerre zouloue", "La guerre de Crimée", "La guerre du Matabeleland"],
        fact: "La guerre d'Afrique du Sud s'est achevée par l'annexion des républiques boers, et l'Union sud-africaine a été créée huit ans plus tard.",
        source: "Encyclopaedia Britannica, notice « South African War »",
      },
      {
        question: "Quel royaume d'Ouganda s'est soulevé contre la domination britannique en 1897 ?",
        options: ["Le Buganda", "Le Bunyoro", "Le Karague", "Le Rwanda"],
        fact: "Le kabaka Mwanga a combattu les Britanniques et perdu son trône, et le Buganda est devenu un protectorat avec sa propre administration à l'intérieur.",
        source: "Encyclopaedia Britannica, notice « Buganda »",
      },
      {
        question: "Quelles deux républiques boers ont combattu la Grande-Bretagne en 1899 ?",
        options: ["La République sud-africaine et l'État libre d'Orange", "L'Égypte et le Soudan", "Le Natal et Le Cap", "La Rhodésie et le Nyassaland"],
        fact: "Les deux républiques s'étaient alliées en 1897, et la guerre a commencé par leur ultimatum plutôt que par une avancée britannique.",
        source: "Encyclopaedia Britannica, notice « South African War »",
      },
      {
        question: "Quelle colonie allemande du sud a été occupée par les troupes sud-africaines en 1915 ?",
        options: ["Le Sud-Ouest africain allemand", "L'Afrique orientale allemande", "Le Kamerun", "Le Togo"],
        fact: "Les troupes sud-africaines ont pris le Sud-Ouest africain allemand en une campagne de quelques mois, et le territoire est resté sous mandat jusqu'en 1990.",
        source: "Encyclopaedia Britannica, notice « Namibia »",
      },
      {
        question: "Quel chemin de fer, parti de Mombasa en 1896, a atteint le lac Victoria en 1901 ?",
        options: ["Le chemin de fer d'Ouganda", "Le chemin de fer du Cap au Caire", "Le chemin de fer de Benguela", "Le chemin de fer de Tanzanie et de Zambie"],
        fact: "Le chemin de fer d'Ouganda a été construit avec de la main-d'œuvre venue d'Inde et payé par les impôts et par les terres qu'il ouvrait aux colons.",
        source: "UNESCO, Histoire générale de l'Afrique, volume VII",
      },
      {
        question: "Quel roi asante a été exilé aux Seychelles après avoir refusé la domination britannique en 1896 ?",
        options: ["Prempeh Ier", "Cetshwayo", "Samori Touré", "Ménélik II"],
        fact: "Prempeh Ier a été emmené pour garder le commerce de l'or sous contrôle, et il n'a été autorisé à rentrer que lorsque les Britanniques n'ont plus rien eu à craindre.",
        source: "Encyclopaedia Britannica, notice « Asante empire »",
      },
      {
        question: "Qu'est-ce qui s'est répandu le plus vite dans les colonies après la conquête ?",
        options: ["Les prophètes et les Églises indépendantes", "Les syndicats", "Les partis politiques", "Les journaux"],
        fact: "Des prêcheurs annonçaient une justice à venir et formaient des Églises hors des missions, et les administrateurs coloniaux les surveillaient avec plus de peur qu'ils ne l'avouaient.",
        source: "UNESCO, Histoire générale de l'Afrique, volume VII",
      },
    ],
  },
};
