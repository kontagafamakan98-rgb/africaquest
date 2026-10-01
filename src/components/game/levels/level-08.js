/**
 * African Independence: one level of the game, on its own.
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
import { Flag } from "lucide-react";

export default {
  id: 8,
  order: 25,
  era: "contemporary",
  from: 1951,
  title: "African Independence",
  subtitle: "Freedom Across the Continent",
  region: "All of Africa",
  color: "from-green-500 to-emerald-600",
  icon: Flag,
  gallery: {
    en: [
      {
        file: "/photos/level-8-1.jpg",
        caption: "Independence Square in Accra, Ghana, the first African colony to become free, in 1957.",
        credit: "George Appiah · CC BY 2.0 · Wikimedia Commons",
        author: "George Appiah",
        licence: "CC BY 2.0",
        source: "https://commons.wikimedia.org/wiki/File:Independence_Square_-_Accra%2C_Ghana1.jpg",
      },
      {
        file: "/photos/level-8-2.jpg",
        caption: "The monument to Kwame Nkrumah, who led Ghana to independence.",
        credit: "Nkansahrexford · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Nkansahrexford",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Kwame_Nkrumah_Monument_at_the_Kwame_Nkrumah_Mausoleum_and_Memorial_Park%2C_Accra_01.jpg",
      },
      {
        file: "/photos/level-8-3.jpg",
        caption: "Patrice Lumumba, who in 1960 became the first head of government of an independent Congo.",
        credit: "Harry Pot · CC BY 4.0 · Wikimedia Commons",
        author: "Harry Pot",
        licence: "CC BY 4.0",
        source: "https://commons.wikimedia.org/wiki/File:PatriceLumumba1960.jpg",
      },
    ],
    fr: [
      {
        file: "/photos/level-8-1.jpg",
        caption: "Independence Square à Accra, au Ghana, première colonie africaine devenue libre, en 1957.",
        credit: "George Appiah · CC BY 2.0 · Wikimedia Commons",
        author: "George Appiah",
        licence: "CC BY 2.0",
        source: "https://commons.wikimedia.org/wiki/File:Independence_Square_-_Accra%2C_Ghana1.jpg",
      },
      {
        file: "/photos/level-8-2.jpg",
        caption: "Le monument à Kwame Nkrumah, qui mena le Ghana à l'indépendance.",
        credit: "Nkansahrexford · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Nkansahrexford",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Kwame_Nkrumah_Monument_at_the_Kwame_Nkrumah_Mausoleum_and_Memorial_Park%2C_Accra_01.jpg",
      },
      {
        file: "/photos/level-8-3.jpg",
        caption: "Patrice Lumumba, devenu en 1960 le premier chef de gouvernement du Congo indépendant.",
        credit: "Harry Pot · CC BY 4.0 · Wikimedia Commons",
        author: "Harry Pot",
        licence: "CC BY 4.0",
        source: "https://commons.wikimedia.org/wiki/File:PatriceLumumba1960.jpg",
      },
    ],
  },
  study: {
    en: {
      essay: ["After the Second World War the demand for independence spread across the continent. African soldiers had fought for their rulers in Europe and Asia, and they came home to colonies that still had no vote, no flag and no say in their own affairs. What had been a hope became a programme, with parties, newspapers and rallies.", "Ghana won its independence in 1957, the first country in West Africa to do so, and seventeen African states became independent in 1960 alone. France and Britain gave way in most of their colonies, some quickly, some after long argument, and the new states took their seats at the United Nations.", "Where the settlers would not go, the road was a war. Algeria won its independence in 1962 after eight years of fighting, Kenya in 1963 after the Mau Mau rising, and the Portuguese colonies only in 1975, after long armed struggles in Angola, Mozambique and Guinea-Bissau.", "The process was not finished in 1975. Zimbabwe became independent in 1980, Namibia in 1990, and South Sudan in 2011, which is how long it took in all. The decades that followed were not simple: the borders, the economies and the institutions all came out of colonial rule, and each new state had to build itself from there."],
      timeline: [
        {
          year: "1951",
          text: "Libya becomes the first African country to win independence after the war.",
        },
        { year: "1957", text: "Ghana becomes independent, the first country in West Africa." },
        { year: "1960", text: "Seventeen African states become independent in a single year." },
        { year: "1962", text: "Algeria wins its independence after eight years of war." },
        { year: "1975", text: "The Portuguese colonies become independent after long armed struggles." },
        { year: "1994", text: "South Africa holds its first election in which everyone may vote." },
      ],
      people: [
        {
          name: "Kwame Nkrumah",
          text: "The leader of Ghana, the first country in West Africa to be free.",
        },
        {
          name: "Ahmed Ben Bella",
          text: "A leader of the Algerian war and the country's first president.",
        },
        { name: "Jomo Kenyatta", text: "The leader of Kenya at its independence in 1963." },
        {
          name: "Amilcar Cabral",
          text: "The thinker of the liberation of Guinea-Bissau and Cape Verde.",
        },
      ],
      places: [
        {
          name: "Accra",
          text: "The capital of Ghana, where the first flag of a free West Africa was raised.",
        },
        { name: "Algiers", text: "The capital of Algeria, the scene of the war of independence." },
        { name: "Nairobi", text: "The capital of Kenya, independent in 1963." },
        { name: "Windhoek", text: "The capital of Namibia, independent in 1990." },
      ],
      glossary: [
        {
          term: "independence",
          text: "Rule by a country's own government rather than by a foreign power.",
        },
        { term: "nationalism", text: "The belief that a people should govern themselves." },
        {
          term: "pan-Africanism",
          text: "The idea that the peoples of Africa share a cause and should act together.",
        },
        {
          term: "the OAU",
          text: "The Organisation of African Unity, founded in 1963 by the new states.",
        },
        { term: "transition", text: "The years in which a colony became a state." },
      ],
    },
    fr: {
      essay: ["Après la Seconde Guerre mondiale, l'exigence d'indépendance s'est répandue sur tout le continent. Des soldats africains avaient combattu pour leurs maîtres en Europe et en Asie, et ils sont rentrés dans des colonies qui n'avaient toujours ni vote, ni drapeau, ni voix dans leurs propres affaires. Ce qui était un espoir est devenu un programme, avec des partis, des journaux et des meetings.", "Le Ghana a obtenu l'indépendance en 1957, le premier pays d'Afrique de l'Ouest à y parvenir, et dix-sept États africains sont devenus indépendants en 1960 seulement. La France et la Grande-Bretagne ont cédé dans la plupart de leurs colonies, certaines vite, d'autres après de longs débats, et les nouveaux États ont pris leur siège aux Nations unies.", "Là où les colons ne voulaient pas partir, la route était la guerre. L'Algérie a gagné son indépendance en 1962 après huit ans de combats, le Kenya en 1963 après la révolte des Mau Mau, et les colonies portugaises seulement en 1975, après de longues luttes armées en Angola, au Mozambique et en Guinée-Bissau.", "Le processus ne s'est pas achevé en 1975. Le Zimbabwe est devenu indépendant en 1980, la Namibie en 1990, et le Soudan du Sud en 2011 : c'est le temps qu'il a fallu en tout. Les décennies qui ont suivi n'ont pas été simples : les frontières, les économies et les institutions venaient toutes de la domination coloniale, et chaque nouvel État a dû se construire à partir de là."],
      timeline: [
        { year: "1951", text: "La Libye devient le premier pays africain indépendant après la guerre." },
        { year: "1957", text: "Le Ghana devient indépendant, le premier d'Afrique de l'Ouest." },
        { year: "1960", text: "Dix-sept États africains deviennent indépendants en une seule année." },
        { year: "1962", text: "L'Algérie gagne son indépendance après huit ans de guerre." },
        {
          year: "1975",
          text: "Les colonies portugaises deviennent indépendantes après de longues luttes armées.",
        },
        { year: "1994", text: "L'Afrique du Sud tient sa première élection où tous peuvent voter." },
      ],
      people: [
        {
          name: "Kwame Nkrumah",
          text: "Le dirigeant du Ghana, premier pays libre d'Afrique de l'Ouest.",
        },
        {
          name: "Ahmed Ben Bella",
          text: "Un dirigeant de la guerre d'Algérie et le premier président du pays.",
        },
        { name: "Jomo Kenyatta", text: "Le dirigeant du Kenya à son indépendance en 1963." },
        {
          name: "Amilcar Cabral",
          text: "Le penseur de la libération de la Guinée-Bissau et du Cap-Vert.",
        },
      ],
      places: [
        {
          name: "Accra",
          text: "La capitale du Ghana, où le premier drapeau d'une Afrique de l'Ouest libre a été hissé.",
        },
        { name: "Alger", text: "La capitale de l'Algérie, théâtre de la guerre d'indépendance." },
        { name: "Nairobi", text: "La capitale du Kenya, indépendant en 1963." },
        { name: "Windhoek", text: "La capitale de la Namibie, indépendante en 1990." },
      ],
      glossary: [
        {
          term: "indépendance",
          text: "Le gouvernement d'un pays par ses propres institutions et non par une puissance étrangère.",
        },
        { term: "nationalisme", text: "L'idée qu'un peuple doit se gouverner lui-même." },
        {
          term: "panafricanisme",
          text: "L'idée que les peuples d'Afrique partagent une cause et doivent agir ensemble.",
        },
        {
          term: "l'OUA",
          text: "L'Organisation de l'unité africaine, fondée en 1963 par les nouveaux États.",
        },
        { term: "transition", text: "Les années où une colonie est devenue un État." },
      ],
    },
  },
  questions: [
    {
      question: "Which African country was the first to gain independence from colonial rule in 1957?",
      options: ["Nigeria", "Kenya", "Ghana", "South Africa"],
      correct: 2,
      fact: "Ghana's leader Kwame Nkrumah said: 'The independence of Ghana is meaningless unless it is linked to the total liberation of Africa!'",
      source: { label: "Encyclopaedia Britannica, \"Kwame Nkrumah\"" },
    },
    {
      question: "Who spent 27 years in prison fighting for freedom in South Africa?",
      options: ["Desmond Tutu", "Nelson Mandela", "Patrice Lumumba", "Jomo Kenyatta"],
      correct: 1,
      fact: "Nelson Mandela became South Africa's first Black president in 1994!",
      source: { label: "Encyclopaedia Britannica, \"Nelson Mandela\"" },
    },
    {
      question: "What system of racial segregation existed in South Africa?",
      options: ["Democracy", "Apartheid", "Monarchy", "Federation"],
      correct: 1,
      fact: "Apartheid lasted from 1948 to 1994 and separated people based on race!",
      source: { label: "Encyclopaedia Britannica, \"apartheid\"" },
    },
    {
      question: "Ethiopia is special because it was:",
      options: ["The smallest country", "Never colonized by Europeans", "An island", "Part of Asia"],
      correct: 1,
      fact: "Ethiopia defeated Italy at the Battle of Adwa in 1896, maintaining its independence!",
      source: { label: "Encyclopaedia Britannica, \"Battle of Adwa\"" },
    },
    {
      question: "What organization was formed to unite African countries?",
      options: ["United Nations", "NATO", "African Union", "European Union"],
      correct: 2,
      fact: "The African Union, founded in 2002, works to promote unity and cooperation among all 55 African nations!",
      source: { label: "African Union, member states", url: "https://au.int/en/member_states/countryprofiles2" },
    },
    {
      question: "Which African leader was assassinated in 1961, with the involvement of Belgium and the CIA, just months after his country's independence?",
      options: ["Kwame Nkrumah", "Patrice Lumumba", "Jomo Kenyatta", "Julius Nyerere"],
      correct: 1,
      fact: "Patrice Lumumba, Congo's first elected Prime Minister, was killed just 10 weeks after independence, his murder remains one of Africa's most tragic political assassinations!",
      source: { label: "Encyclopaedia Britannica, \"Patrice Lumumba\"" },
    },
    {
      question: "The 'Berlin Conference' of 1884-1885 is historically significant because it:",
      options: ["United African kingdoms", "European powers divided Africa among themselves with no African representation", "Ended the slave trade", "Established the first African currency"],
      correct: 1,
      fact: "14 European nations met in Berlin and drew Africa's borders arbitrarily, splitting tribes, uniting enemies, creating conflicts that still affect Africa today!",
      source: { label: "Encyclopaedia Britannica, \"Berlin West Africa Conference\"" },
    },
    {
      question: "The African National Congress (ANC) was founded in which year, making it one of the oldest liberation movements?",
      options: ["1948", "1960", "1912", "1990"],
      correct: 2,
      fact: "The ANC was founded in 1912, 82 years before Mandela became president, it fought apartheid for decades through non-violence and armed resistance!",
      source: { label: "Encyclopaedia Britannica, \"African National Congress\"" },
    },
    {
      question: "Which African country was ruled by a system called 'Ujamaa' (familyhood), a form of African socialism?",
      options: ["Kenya", "Tanzania", "Ghana", "Senegal"],
      correct: 1,
      fact: "Julius Nyerere's Ujamaa policy in Tanzania attempted to build an African socialist state, it had mixed results but became a model of pan-African thought!",
      source: { label: "Encyclopaedia Britannica, \"Julius Nyerere\"" },
    },
    {
      question: "The 'Year of Africa' in 1960 saw 17 African nations gain independence. Which former colonial power granted the most independence that year?",
      options: ["Britain", "France", "Belgium", "Portugal"],
      correct: 1,
      fact: "France granted independence to 14 of its African territories in 1960 alone, though many retained economic and political ties to France through 'Françafrique'!",
      source: {
        label: "UNESCO, General History of Africa, volume VIII",
        url: "https://www.unesco.org/en/general-history-africa",
      },
    },
    {
      question: "Which country gained independence from France in 1962 after an eight-year war of liberation?",
      options: ["Algeria", "Tunisia", "Morocco", "Senegal"],
      correct: 0,
      fact: "Algeria's war of independence lasted from 1954 to 1962; Tunisia and Morocco had already become independent in 1956!",
      source: { label: "Encyclopaedia Britannica, \"Algerian War\"" },
    },
    {
      question: "Who became the first president of independent Kenya in 1963?",
      options: ["Jomo Kenyatta", "Daniel arap Moi", "Julius Nyerere", "Patrice Lumumba"],
      correct: 0,
      fact: "Jomo Kenyatta led Kenya to independence on 12 December 1963 and served as its first president until his death in 1978!",
      source: { label: "Encyclopaedia Britannica, \"Jomo Kenyatta\"" },
    },
    {
      question: "The Swahili word 'Uhuru', a rallying cry of Kenyan independence, means what?",
      options: ["Freedom", "Unity", "Struggle", "Victory"],
      correct: 0,
      fact: "'Uhuru' means freedom in Swahili and became the central slogan of Kenya's independence movement!",
      source: { label: "Encyclopaedia Britannica, \"Jomo Kenyatta\"" },
    },
    {
      question: "Which large country won independence in 1960 and became Africa's most populous nation?",
      options: ["Nigeria", "Kenya", "Congo", "Senegal"],
      correct: 0,
      fact: "Nigeria became independent on 1 October 1960, with Nnamdi Azikiwe and Abubakar Tafawa Balewa among its first leaders.",
      source: { label: "Encyclopaedia Britannica, \"Nnamdi Azikiwe\"" },
    },
    {
      question: "Which organisation, founded in 1963, was the African Union's predecessor?",
      options: ["The Organisation of African Unity", "The League of African States", "The Pan-African Congress", "The Union of West Africa"],
      correct: 0,
      fact: "The Organisation of African Unity was founded by thirty-two states in Addis Ababa, and it became the African Union in 2002.",
      source: { label: "Encyclopaedia Britannica, \"Organization of African Unity\"" },
    },
    {
      question: "Which country won independence from Portugal in 1975 after a long war, with Agostinho Neto as its first president?",
      options: ["Angola", "Mozambique", "Guinea-Bissau", "Cape Verde"],
      correct: 0,
      fact: "Portugal recognised the independence of its African colonies only after its own revolution in 1974, and Angola was at war again within two years.",
      source: { label: "Encyclopaedia Britannica, \"Angola\"" },
    },
    {
      question: "Which poet of Negritude became the first president of Senegal in 1960?",
      options: ["Leopold Sedar Senghor", "Kwame Nkrumah", "Julius Nyerere", "Felix Houphouet-Boigny"],
      correct: 0,
      fact: "Senghor wrote the poems that made Negritude a movement and then governed Senegal for twenty years, and he left power by choice.",
      source: { label: "Encyclopaedia Britannica, \"Leopold Senghor\"" },
    },
    {
      question: "Which country's vote in 1958 said no to the French community and took independence at once?",
      options: ["Guinea", "Senegal", "Mali", "Niger"],
      correct: 0,
      fact: "Guinea refused the offer of autonomy inside a French union, and France withdrew its officials and its equipment overnight in reply.",
      source: { label: "Encyclopaedia Britannica, \"Guinea\"" },
    },
    {
      question: "Which colony's white minority declared unilateral independence in 1965 to keep power?",
      options: ["Southern Rhodesia", "Ghana", "Kenya", "Tanganyika"],
      correct: 0,
      fact: "Ian Smith's government declared independence rather than accept majority rule, and the country became Zimbabwe fifteen years later.",
      source: { label: "Encyclopaedia Britannica, \"Rhodesia\"" },
    },
    {
      question: "Which territory administered by South Africa became independent in 1990?",
      options: ["Namibia", "Botswana", "Zimbabwe", "Angola"],
      correct: 0,
      fact: "Namibia was the last colony in Africa to win its independence, after a long war and a United Nations plan that took decades to carry out.",
      source: { label: "Encyclopaedia Britannica, \"Namibia\"" },
    },
    {
      question: "Which country became independent in 2011, the youngest state in Africa?",
      options: ["South Sudan", "Eritrea", "Namibia", "Zimbabwe"],
      correct: 0,
      fact: "South Sudan separated from Sudan after a referendum, and it is the newest member state of both the United Nations and the African Union.",
      source: { label: "Encyclopaedia Britannica, \"South Sudan\"" },
    },
  ],
  fr: {
    title: "Indépendances africaines",
    subtitle: "La liberté sur tout le continent",
    region: "Toute l'Afrique",
    questions: [
      {
        question: "Quel pays africain a été le premier à obtenir son indépendance de la domination coloniale, en 1957 ?",
        options: ["Le Nigeria", "Le Kenya", "Le Ghana", "L'Afrique du Sud"],
        fact: "Kwame Nkrumah, le dirigeant du Ghana, disait que l'indépendance du Ghana n'a pas de sens si elle n'est pas liée à la libération totale de l'Afrique !",
        source: "Encyclopaedia Britannica, notice « Kwame Nkrumah »",
      },
      {
        question: "Qui a passé 27 ans en prison pour la liberté en Afrique du Sud ?",
        options: ["Desmond Tutu", "Nelson Mandela", "Patrice Lumumba", "Jomo Kenyatta"],
        fact: "Nelson Mandela est devenu le premier président noir d'Afrique du Sud en 1994 !",
        source: "Encyclopaedia Britannica, notice « Nelson Mandela »",
      },
      {
        question: "Quel système de ségrégation raciale a existé en Afrique du Sud ?",
        options: ["La démocratie", "L'apartheid", "La monarchie", "La fédération"],
        fact: "L'apartheid a duré de 1948 à 1994 et séparait les personnes selon leur race !",
        source: "Encyclopaedia Britannica, notice « apartheid »",
      },
      {
        question: "L'Éthiopie est un cas particulier parce qu'elle a été :",
        options: ["Le plus petit pays d'Afrique", "Jamais colonisée par les Européens", "Une île", "Une partie de l'Asie"],
        fact: "L'Éthiopie a vaincu l'Italie à la bataille d'Adoua en 1896 et a ainsi préservé son indépendance !",
        source: "Encyclopaedia Britannica, notice « Battle of Adwa »",
      },
      {
        question: "Quelle organisation a été créée pour unir les pays africains ?",
        options: ["L'Organisation des Nations unies", "L'OTAN", "L'Union africaine", "L'Union européenne"],
        fact: "L'Union africaine, fondée en 2002, travaille à l'unité et à la coopération entre les 55 nations africaines !",
        source: "Union africaine, États membres",
      },
      {
        question: "Quel dirigeant africain a été assassiné en 1961, avec l'implication de la Belgique et de la CIA, quelques mois seulement après l'indépendance de son pays ?",
        options: ["Kwame Nkrumah", "Patrice Lumumba", "Jomo Kenyatta", "Julius Nyerere"],
        fact: "Patrice Lumumba, premier Premier ministre élu du Congo, a été tué dix semaines seulement après l'indépendance ; son assassinat reste l'un des plus tragiques de l'histoire politique africaine !",
        source: "Encyclopaedia Britannica, notice « Patrice Lumumba »",
      },
      {
        question: "La conférence de Berlin de 1884-1885 est un moment décisif de l'histoire parce qu'elle :",
        options: ["A uni les royaumes africains", "A permis aux puissances européennes de se partager l'Afrique sans aucun représentant africain", "A mis fin à la traite des esclaves", "A créé la première monnaie africaine"],
        fact: "Quatorze nations européennes se sont réunies à Berlin et ont tracé arbitrairement les frontières de l'Afrique, séparant des peuples et réunissant des ennemis, créant des conflits qui pèsent encore aujourd'hui !",
        source: "Encyclopaedia Britannica, notice « Berlin West Africa Conference »",
      },
      {
        question: "En quelle année le Congrès national africain, l'ANC, a-t-il été fondé, ce qui en fait l'un des plus anciens mouvements de libération ?",
        options: ["1948", "1960", "1912", "1990"],
        fact: "L'ANC a été fondé en 1912, 82 ans avant que Mandela ne devienne président, et il a lutté des décennies contre l'apartheid, par la non-violence puis par la résistance armée !",
        source: "Encyclopaedia Britannica, notice « African National Congress »",
      },
      {
        question: "Quel pays africain a été gouverné selon l'Ujamaa, un socialisme africain fondé sur la famille élargie ?",
        options: ["Le Kenya", "La Tanzanie", "Le Ghana", "Le Sénégal"],
        fact: "La politique d'Ujamaa de Julius Nyerere en Tanzanie visait à bâtir un État socialiste africain ; elle a donné des résultats contrastés mais elle est devenue un modèle de la pensée panafricaine !",
        source: "Encyclopaedia Britannica, notice « Julius Nyerere »",
      },
      {
        question: "L'année 1960, appelée l'année de l'Afrique, a vu 17 nations africaines devenir indépendantes. Quelle puissance coloniale en a accordé le plus cette année-là ?",
        options: ["La Grande-Bretagne", "La France", "La Belgique", "Le Portugal"],
        fact: "La France a accordé l'indépendance à 14 de ses territoires africains en 1960 seulement, même si beaucoup ont gardé des liens économiques et politiques avec elle, la Françafrique !",
        source: "UNESCO, Histoire générale de l'Afrique, volume VIII",
      },
      {
        question: "Quel pays a obtenu son indépendance de la France en 1962, après huit ans de guerre de libération ?",
        options: ["L'Algérie", "La Tunisie", "Le Maroc", "Le Sénégal"],
        fact: "La guerre d'indépendance de l'Algérie a duré de 1954 à 1962, tandis que la Tunisie et le Maroc étaient déjà indépendants depuis 1956 !",
        source: "Encyclopaedia Britannica, notice « Algerian War »",
      },
      {
        question: "Qui est devenu le premier président du Kenya indépendant en 1963 ?",
        options: ["Jomo Kenyatta", "Daniel arap Moi", "Julius Nyerere", "Patrice Lumumba"],
        fact: "Jomo Kenyatta a mené le Kenya à l'indépendance le 12 décembre 1963 et en a été le premier président jusqu'à sa mort en 1978 !",
        source: "Encyclopaedia Britannica, notice « Jomo Kenyatta »",
      },
      {
        question: "Que signifie le mot swahili Uhuru, cri de ralliement de l'indépendance du Kenya ?",
        options: ["Liberté", "Unité", "Lutte", "Victoire"],
        fact: "Uhuru signifie liberté en swahili et il est devenu le slogan central du mouvement d'indépendance du Kenya !",
        source: "Encyclopaedia Britannica, notice « Jomo Kenyatta »",
      },
      {
        question: "Quel grand pays a obtenu son indépendance en 1960 et est devenu le pays le plus peuplé d'Afrique ?",
        options: ["Le Nigeria", "Le Kenya", "Le Congo", "Le Sénégal"],
        fact: "Le Nigeria est devenu indépendant le 1er octobre 1960, avec Nnamdi Azikiwe et Abubakar Tafawa Balewa parmi ses premiers dirigeants.",
        source: "Encyclopaedia Britannica, notice « Nnamdi Azikiwe »",
      },
      {
        question: "Quelle organisation, fondée en 1963, a précédé l'Union africaine ?",
        options: ["L'Organisation de l'unité africaine", "La Ligue des États africains", "Le Congrès panafricain", "L'Union de l'Afrique de l'Ouest"],
        fact: "L'Organisation de l'unité africaine a été fondée par trente-deux États à Addis-Abeba, et elle est devenue l'Union africaine en 2002.",
        source: "Encyclopaedia Britannica, notice « Organization of African Unity »",
      },
      {
        question: "Quel pays a obtenu son indépendance du Portugal en 1975 après une longue guerre, avec Agostinho Neto comme premier président ?",
        options: ["L'Angola", "Le Mozambique", "La Guinée-Bissau", "Le Cap-Vert"],
        fact: "Le Portugal n'a reconnu l'indépendance de ses colonies africaines qu'après sa propre révolution de 1974, et l'Angola était de nouveau en guerre deux ans plus tard.",
        source: "Encyclopaedia Britannica, notice « Angola »",
      },
      {
        question: "Quel poète de la négritude est devenu le premier président du Sénégal en 1960 ?",
        options: ["Léopold Sédar Senghor", "Kwame Nkrumah", "Julius Nyerere", "Félix Houphouët-Boigny"],
        fact: "Senghor a écrit les poèmes qui ont fait de la négritude un mouvement, puis a gouverné le Sénégal pendant vingt ans avant de quitter le pouvoir de lui-même.",
        source: "Encyclopaedia Britannica, notice « Leopold Senghor »",
      },
      {
        question: "Quel pays, par son vote de 1958, a dit non à la communauté française et obtenu aussitôt son indépendance ?",
        options: ["La Guinée", "Le Sénégal", "Le Mali", "Le Niger"],
        fact: "La Guinée a refusé l'autonomie dans une union française, et la France a retiré du jour au lendemain ses fonctionnaires et son matériel.",
        source: "Encyclopaedia Britannica, notice « Guinea »",
      },
      {
        question: "Quelle colonie a vu sa minorité blanche déclarer unilatéralement l'indépendance en 1965 pour garder le pouvoir ?",
        options: ["La Rhodésie du Sud", "Le Ghana", "Le Kenya", "Le Tanganyika"],
        fact: "Le gouvernement d'Ian Smith a déclaré l'indépendance plutôt que d'accepter la règle de la majorité, et le pays est devenu le Zimbabwe quinze ans plus tard.",
        source: "Encyclopaedia Britannica, notice « Rhodesia »",
      },
      {
        question: "Quel territoire administré par l'Afrique du Sud est devenu indépendant en 1990 ?",
        options: ["La Namibie", "Le Botswana", "Le Zimbabwe", "L'Angola"],
        fact: "La Namibie a été la dernière colonie d'Afrique à obtenir son indépendance, après une longue guerre et un plan des Nations unies qui a mis des décennies à s'appliquer.",
        source: "Encyclopaedia Britannica, notice « Namibia »",
      },
      {
        question: "Quel pays est devenu indépendant en 2011, le plus jeune État d'Afrique ?",
        options: ["Le Soudan du Sud", "L'Érythrée", "La Namibie", "Le Zimbabwe"],
        fact: "Le Soudan du Sud s'est séparé du Soudan après un référendum, et il est le plus récent État membre des Nations unies comme de l'Union africaine.",
        source: "Encyclopaedia Britannica, notice « South Sudan »",
      },
    ],
  },
};
