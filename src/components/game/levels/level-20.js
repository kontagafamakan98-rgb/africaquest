/**
 * Africa Today: one level of the game, on its own.
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
import { Rocket } from "lucide-react";

export default {
  id: 20,
  order: 20,
  era: "contemporary",
  from: 1990,
  title: "Africa Today",
  subtitle: "Union, growth and new challenges",
  region: "Across the continent",
  color: "from-teal-500 to-green-700",
  icon: Rocket,
  gallery: {
    en: [
      {
        file: "/photos/level-20-1.jpg",
        caption: "The skyline of Lagos Island, in Nigeria, one of the cities growing fastest in the world.",
        credit: "Jamie Tubers · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Jamie Tubers",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Lagos_Island_City_Scape.jpg",
      },
      {
        file: "/photos/level-20-2.jpg",
        caption: "The headquarters of the African Union in Addis Ababa, where the member states meet.",
        credit: "Wang Guansen · Public domain · Wikimedia Commons",
        author: "Wang Guansen",
        licence: "Public domain",
        source: "https://commons.wikimedia.org/wiki/File:African_Union_Headquarters_Addis_Ababa.jpg",
      },
      {
        file: "/photos/level-20-3.jpg",
        caption: "A light rail train in Addis Ababa, the first line of its kind in East Africa.",
        credit: "Turtlewong · CC0 · Wikimedia Commons",
        author: "Turtlewong",
        licence: "CC0",
        source: "https://commons.wikimedia.org/wiki/File:Addis_Ababa_Light_Rail_vehicle%2C_March_2015.jpg",
      },
    ],
    fr: [
      {
        file: "/photos/level-20-1.jpg",
        caption: "Les tours de Lagos Island, au Nigeria, l'une des villes qui grandissent le plus vite au monde.",
        credit: "Jamie Tubers · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Jamie Tubers",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Lagos_Island_City_Scape.jpg",
      },
      {
        file: "/photos/level-20-2.jpg",
        caption: "Le siège de l'Union africaine à Addis-Abeba, où les États membres se réunissent.",
        credit: "Wang Guansen · domaine public · Wikimedia Commons",
        author: "Wang Guansen",
        licence: "domaine public",
        source: "https://commons.wikimedia.org/wiki/File:African_Union_Headquarters_Addis_Ababa.jpg",
      },
      {
        file: "/photos/level-20-3.jpg",
        caption: "Une rame du tramway d'Addis-Abeba, la première ligne de ce genre en Afrique de l'Est.",
        credit: "Turtlewong · CC0 · Wikimedia Commons",
        author: "Turtlewong",
        licence: "CC0",
        source: "https://commons.wikimedia.org/wiki/File:Addis_Ababa_Light_Rail_vehicle%2C_March_2015.jpg",
      },
    ],
  },
  study: {
    en: {
      essay: ["Africa today is the continent of the African Union and of the largest free trade area in the world by number of countries. It is where mobile money was invented, where a quarter of the world's people will live by 2050, and where the median age is nineteen, which is a young continent by any measure.", "Fifty-four states belong to the African Union, and the free trade area agreed in 2018 began to be applied in 2021, which makes it the largest in the world by number of countries. The continent holds the world's largest reserves of cobalt and much of its platinum, and it is building the dams, the railways and the ports that it was not allowed to build for itself.", "Its cities are growing faster than any others on earth. Lagos, Kinshasa, Cairo and Dar es Salaam are each of them larger than most European capitals, and the engineers, the writers, the film makers and the musicians of the continent work in them and are read, watched and listened to far beyond Africa.", "It is also a continent of hard problems, from the wars of the Sahel to a warming climate, from the shrinking of Lake Chad to the debt that weighs on young economies. None of that is the whole story, and none of it is new to a continent that has carried the human story from the beginning. The history of Africa is not finished. It is being written now."],
      timeline: [
        { year: "1963", text: "The Organisation of African Unity is founded in Addis Ababa." },
        { year: "2002", text: "The African Union replaces the OAU, with a parliament and a court." },
        {
          year: "2007",
          text: "M-Pesa launches in Kenya and mobile money spreads across the continent.",
        },
        { year: "2018", text: "The agreement on the African Continental Free Trade Area is signed." },
        {
          year: "2021",
          text: "The free trade area begins to be applied, the largest by number of countries.",
        },
        { year: "2030", text: "The African Union aims to silence the guns and to end the conflicts." },
      ],
      people: [
        {
          name: "Haile Selassie",
          text: "The emperor of Ethiopia who called the founding meeting of the OAU.",
        },
        {
          name: "Thabo Mbeki",
          text: "The president of South Africa who drove the African Union and its plan.",
        },
        {
          name: "Wangari Maathai",
          text: "The Kenyan scientist whose tree planting won the Nobel peace prize.",
        },
        {
          name: "Aliko Dangote",
          text: "The industrialist whose cement and refinery build across the continent.",
        },
      ],
      places: [
        { name: "Addis Ababa", text: "The headquarters of the African Union." },
        {
          name: "Lagos",
          text: "The largest city of the continent and one of its fastest growing economies.",
        },
        { name: "The Sahel", text: "The belt where drought, conflict and migration meet." },
        { name: "Lake Chad", text: "The lake that has shrunk to a fraction of its former size." },
      ],
      glossary: [
        { term: "African Union", text: "The continental body of fifty-four states, founded in 2002." },
        { term: "AfCFTA", text: "The African Continental Free Trade Area, agreed in 2018." },
        {
          term: "mobile money",
          text: "Money held and sent by phone rather than through a bank branch.",
        },
        { term: "median age", text: "The age that divides a population into two equal halves." },
        { term: "diaspora", text: "The people of African descent living outside the continent." },
      ],
    },
    fr: {
      essay: ["L'Afrique d'aujourd'hui, c'est le continent de l'Union africaine et de la plus grande zone de libre-échange du monde par le nombre de pays. C'est là que l'argent mobile a été inventé, là où vivra un quart de l'humanité en 2050, et où l'âge médian est de dix-neuf ans : un continent jeune, à toutes les mesures.", "Cinquante-quatre États appartiennent à l'Union africaine, et la zone de libre-échange conclue en 2018 a commencé à s'appliquer en 2021 : c'est la plus grande du monde par le nombre de pays. Le continent détient les plus grandes réserves mondiales de cobalt et une grande partie du platine, et il construit les barrages, les chemins de fer et les ports qu'on ne l'a pas laissé bâtir pour lui-même.", "Ses villes grandissent plus vite que toutes les autres au monde. Lagos, Kinshasa, Le Caire et Dar es Salam dépassent chacune la plupart des capitales européennes, et les ingénieurs, les écrivains, les cinéastes et les musiciens du continent y travaillent et sont lus, vus et écoutés bien au-delà de l'Afrique.", "C'est aussi un continent aux problèmes difficiles, des guerres du Sahel au réchauffement climatique, du recul du lac Tchad à la dette qui pèse sur des économies jeunes. Rien de cela n'est toute l'histoire, et rien n'est nouveau pour un continent qui porte l'histoire humaine depuis le commencement. L'histoire de l'Afrique n'est pas terminée : elle s'écrit maintenant."],
      timeline: [
        { year: "1963", text: "L'Organisation de l'unité africaine est fondée à Addis-Abeba." },
        { year: "2002", text: "L'Union africaine remplace l'OUA, avec un parlement et une cour." },
        {
          year: "2007",
          text: "M-Pesa est lancé au Kenya et l'argent mobile se répand sur le continent.",
        },
        {
          year: "2018",
          text: "L'accord sur la Zone de libre-échange continentale africaine est signé.",
        },
        {
          year: "2021",
          text: "La zone de libre-échange commence à s'appliquer, la plus grande par le nombre de pays.",
        },
        {
          year: "2030",
          text: "L'Union africaine vise à faire taire les armes et à mettre fin aux conflits.",
        },
      ],
      people: [
        {
          name: "Hailé Sélassié",
          text: "L'empereur d'Éthiopie qui a convoqué la réunion fondatrice de l'OUA.",
        },
        {
          name: "Thabo Mbeki",
          text: "Le président sud-africain qui a porté l'Union africaine et son programme.",
        },
        {
          name: "Wangari Maathai",
          text: "La scientifique kényane dont les plantations d'arbres ont valu un prix Nobel de la paix.",
        },
        {
          name: "Aliko Dangote",
          text: "L'industriel dont le ciment et la raffinerie se construisent à travers le continent.",
        },
      ],
      places: [
        { name: "Addis-Abeba", text: "Le siège de l'Union africaine." },
        {
          name: "Lagos",
          text: "La plus grande ville du continent et l'une de ses économies les plus rapides.",
        },
        {
          name: "Le Sahel",
          text: "La bande où se rencontrent la sécheresse, les conflits et les migrations.",
        },
        { name: "Le lac Tchad", text: "Le lac qui s'est réduit à une fraction de sa taille ancienne." },
      ],
      glossary: [
        {
          term: "Union africaine",
          text: "L'organisation continentale de cinquante-quatre États, fondée en 2002.",
        },
        { term: "ZLECAf", text: "La Zone de libre-échange continentale africaine, conclue en 2018." },
        {
          term: "argent mobile",
          text: "De l'argent conservé et envoyé par téléphone plutôt que par une agence bancaire.",
        },
        { term: "âge médian", text: "L'âge qui partage une population en deux moitiés égales." },
        { term: "diaspora", text: "Les personnes d'origine africaine vivant hors du continent." },
      ],
    },
  },
  questions: [
    {
      question: "Which organisation replaced the Organisation of African Unity in 2002?",
      options: ["The African Union", "The United Nations", "The Commonwealth", "The Arab League"],
      correct: 0,
      fact: "The African Union brings together all fifty five states of the continent and can suspend a member that takes power by force.",
      source: { label: "African Union, member states", url: "https://au.int/en/member_states/countryprofiles2" },
    },
    {
      question: "What is the name of the African Union plan that sets the continent's goals up to 2063?",
      options: ["Agenda 2063", "Vision 2030", "The Lagos Plan", "The Millennium Goals"],
      correct: 0,
      fact: "Agenda 2063 sets goals for trade, infrastructure, education and peace, and its first ten year plan ran to 2023.",
      source: { label: "African Union, Agenda 2063", url: "https://au.int/en/agenda2063" },
    },
    {
      question: "Which payment service launched in Kenya in 2007 turned mobile phones into wallets?",
      options: ["M-Pesa", "PayPal", "Visa", "Western Union"],
      correct: 0,
      fact: "Mobile money spread across East and West Africa, and millions of people now save, borrow and pay through a phone.",
      source: {
        label: "World Bank, Mobile payments go viral: M-PESA in Kenya",
        url: "https://documents.worldbank.org/en/publication/documents-reports/documentdetail/638851468048259219",
      },
    },
    {
      question: "In 1994, about how many people were killed in the genocide against the Tutsi in Rwanda?",
      options: ["About 800,000", "About 8,000", "About 8 million", "About 80,000"],
      correct: 0,
      fact: "The killing lasted about a hundred days, and the country has since removed ethnic labels from identity papers.",
      source: { label: "Encyclopaedia Britannica, \"Rwanda genocide of 1994\"" },
    },
    {
      question: "Which agreement, in force since 2021, creates a single market for the whole continent?",
      options: ["The African Continental Free Trade Area", "The European Single Market", "The Commonwealth trade agreement", "The Trans-Pacific Partnership"],
      correct: 0,
      fact: "African countries still trade little with each other, and the free trade area is meant to change that for more than a billion consumers.",
      source: { label: "Encyclopaedia Britannica, \"African Continental Free Trade Area\"" },
    },
    {
      question: "Which dam on the Blue Nile, built by Ethiopia since 2011, has been disputed by Egypt and Sudan?",
      options: ["The Grand Ethiopian Renaissance Dam", "The Aswan High Dam", "The Kariba Dam", "The Volta Dam"],
      correct: 0,
      fact: "The dam is meant to double Ethiopia's electricity supply, while Egypt fears for its share of the Nile, and the argument is over how fast the reservoir may be filled.",
      source: { label: "Encyclopaedia Britannica, \"Grand Ethiopian Renaissance Dam\"" },
    },
    {
      question: "Which country has the largest population in Africa?",
      options: ["Nigeria", "Egypt", "Ethiopia", "South Africa"],
      correct: 0,
      fact: "Nigeria has passed two hundred million inhabitants, and the United Nations expects Africa to hold a quarter of the world's people by 2050.",
      source: { label: "United Nations, World Population Prospects", url: "https://population.un.org/wpp/" },
    },
    {
      question: "About what share of Africa's population is under twenty years old?",
      options: ["About half", "About a quarter", "About a tenth", "Almost all"],
      correct: 0,
      fact: "The median age on the continent is around nineteen, the youngest of any region, which puts schools and jobs at the centre of every debate.",
      source: {
        label: "UNESCO, General History of Africa, volume VIII",
        url: "https://www.unesco.org/en/general-history-africa",
      },
    },
    {
      question: "In which city is the African Union headquartered?",
      options: ["Addis Ababa", "Cairo", "Nairobi", "Abuja"],
      correct: 0,
      fact: "The African Union is headquartered in Addis Ababa, the same city where its predecessor, the Organisation of African Unity, was founded in 1963.",
      source: { label: "African Union, member states", url: "https://au.int/en/member_states/countryprofiles2" },
    },
    {
      question: "In which city does the secretariat of the African Continental Free Trade Area sit?",
      options: ["Accra", "Addis Ababa", "Cairo", "Abuja"],
      correct: 0,
      fact: "The secretariat of the free trade area is in Accra, and its job is to run the single market the continent agreed to build.",
      source: { label: "African Union, African Continental Free Trade Area", url: "https://au.int/en/afcfta" },
    },
    {
      question: "Which Kenyan environmentalist won the Nobel Peace Prize in 2004?",
      options: ["Wangari Maathai", "Ellen Johnson Sirleaf", "Desmond Tutu", "Denis Mukwege"],
      correct: 0,
      fact: "Wangari Maathai founded the Green Belt Movement, which has planted tens of millions of trees and put the defence of the forest at the centre of politics.",
      source: { label: "Encyclopaedia Britannica, \"Wangari Maathai\"" },
    },
    {
      question: "Which Nigerian writer won the Nobel Prize in Literature in 1986?",
      options: ["Wole Soyinka", "Chinua Achebe", "Ngugi wa Thiong'o", "Chimamanda Ngozi Adichie"],
      correct: 0,
      fact: "Wole Soyinka was the first African to win the prize, and his plays and essays argue with power in a language drawn from Yoruba.",
      source: { label: "Encyclopaedia Britannica, \"Wole Soyinka\"" },
    },
    {
      question: "Which African Union project plants a band of trees across the Sahel to hold back the desert?",
      options: ["The Great Green Wall", "Agenda 2063", "The African Renaissance", "The Nouakchott Accord"],
      correct: 0,
      fact: "The Great Green Wall was meant to run for 8,000 kilometres from Senegal to Djibouti, and its aim has grown to restoring the land as well as the trees.",
      source: { label: "African Union, Great Green Wall Initiative", url: "https://au.int/en/ggwi" },
    },
    {
      question: "Which South African city hosted the final of the first football World Cup held in Africa?",
      options: ["Johannesburg", "Cape Town", "Durban", "Pretoria"],
      correct: 0,
      fact: "The 2010 final was played at Soccer City in Johannesburg, the first World Cup on African soil.",
      source: { label: "Encyclopaedia Britannica, \"2010 FIFA World Cup\"" },
    },
    {
      question: "Which lake, shared by four countries of the Sahel, has shrunk dramatically since the 1960s?",
      options: ["Lake Chad", "Lake Victoria", "Lake Tanganyika", "Lake Malawi"],
      correct: 0,
      fact: "Lake Chad has lost most of its surface since the 1960s, and the retreating water has pushed farmers and fishers into conflict.",
      source: { label: "Encyclopaedia Britannica, \"Lake Chad\"" },
    },
    {
      question: "Which country is the largest in Africa by area?",
      options: ["Algeria", "Nigeria", "Sudan", "South Africa"],
      correct: 0,
      fact: "Algeria is the largest country in Africa, and most of it is Sahara, so almost all of its people live on the northern coast.",
      source: { label: "Encyclopaedia Britannica, \"Algeria\"" },
    },
    {
      question: "Which lake is the largest in Africa, shared by three countries?",
      options: ["Lake Victoria", "Lake Tanganyika", "Lake Malawi", "Lake Chad"],
      correct: 0,
      fact: "Lake Victoria is shared by Kenya, Uganda and Tanzania, and its fishing grounds and its water are among the most contested in Africa.",
      source: { label: "Encyclopaedia Britannica, \"Lake Victoria\"" },
    },
    {
      question: "Which is the highest mountain in Africa?",
      options: ["Kilimanjaro", "Mount Kenya", "Ras Dashen", "Emi Koussi"],
      correct: 0,
      fact: "Kilimanjaro stands in Tanzania and carries a glacier on its summit, and it is climbed by tens of thousands of walkers every year.",
      source: { label: "Encyclopaedia Britannica, \"Kilimanjaro\"" },
    },
    {
      question: "Which waterfall on the Zambezi, called Mosi-oa-Tunya, is shared by Zambia and Zimbabwe?",
      options: ["Victoria Falls", "Boyoma Falls", "Inga Falls", "Augrabies Falls"],
      correct: 0,
      fact: "Victoria Falls sends the whole Zambezi over a cliff 108 metres high, and the spray can be seen from twenty kilometres away.",
      source: { label: "Encyclopaedia Britannica, \"Victoria Falls\"" },
    },
    {
      question: "Which country is the largest producer of cocoa in the world?",
      options: ["Cote d'Ivoire", "Ghana", "Nigeria", "Kenya"],
      correct: 0,
      fact: "Cote d'Ivoire grows about two fifths of the world's cocoa, and most of it leaves the continent as beans rather than as chocolate.",
      source: { label: "Encyclopaedia Britannica, \"Cote d'Ivoire\"" },
    },
    {
      question: "Which desert, the largest hot desert in the world, covers about a quarter of the continent?",
      options: ["The Sahara", "The Kalahari", "The Namib", "The Danakil"],
      correct: 0,
      fact: "The Sahara is nearly as large as the United States, and it is spreading southward into the Sahel, which is what the Great Green Wall is meant to slow.",
      source: { label: "Encyclopaedia Britannica, \"Sahara\"" },
    },
  ],
  fr: {
    title: "L'Afrique d'aujourd'hui",
    subtitle: "Union, croissance et nouveaux défis",
    region: "Sur tout le continent",
    questions: [
      {
        question: "Quelle organisation a remplacé l'Organisation de l'unité africaine en 2002 ?",
        options: ["L'Union africaine", "Les Nations unies", "Le Commonwealth", "La Ligue arabe"],
        fact: "L'Union africaine rassemble les cinquante-cinq États du continent et peut suspendre un membre arrivé au pouvoir par la force.",
        source: "Union africaine, États membres",
      },
      {
        question: "Comment s'appelle le plan de l'Union africaine qui fixe les objectifs du continent jusqu'en 2063 ?",
        options: ["L'Agenda 2063", "Vision 2030", "Le plan de Lagos", "Les objectifs du millénaire"],
        fact: "L'Agenda 2063 fixe des objectifs de commerce, d'infrastructures, d'éducation et de paix, et son premier plan décennal a couru jusqu'en 2023.",
        source: "Union africaine, Agenda 2063",
      },
      {
        question: "Quel service de paiement lancé au Kenya en 2007 a transformé les téléphones en portefeuilles ?",
        options: ["M-Pesa", "PayPal", "Visa", "Western Union"],
        fact: "L'argent mobile s'est répandu en Afrique de l'Est et de l'Ouest, et des millions de personnes épargnent, empruntent et paient avec un téléphone.",
        source: "Banque mondiale, Mobile payments go viral: M-PESA in Kenya",
      },
      {
        question: "En 1994, combien de personnes ont été tuées environ lors du génocide contre les Tutsi au Rwanda ?",
        options: ["Environ 800 000", "Environ 8 000", "Environ 8 millions", "Environ 80 000"],
        fact: "Les massacres ont duré environ cent jours, et le pays a depuis retiré les mentions ethniques des papiers d'identité.",
        source: "Encyclopaedia Britannica, notice « Rwanda genocide of 1994 »",
      },
      {
        question: "Quel accord, en vigueur depuis 2021, crée un marché unique pour tout le continent ?",
        options: ["La zone de libre-échange continentale africaine", "Le marché unique européen", "L'accord du Commonwealth", "Le partenariat transpacifique"],
        fact: "Les pays africains commercent encore peu entre eux, et la zone de libre-échange doit changer cela pour plus d'un milliard de consommateurs.",
        source: "Encyclopaedia Britannica, notice « African Continental Free Trade Area »",
      },
      {
        question: "Quel barrage sur le Nil bleu, construit par l'Éthiopie depuis 2011, est contesté par l'Égypte et le Soudan ?",
        options: ["Le grand barrage de la Renaissance", "Le haut barrage d'Assouan", "Le barrage de Kariba", "Le barrage de la Volta"],
        fact: "Le barrage doit doubler l'approvisionnement électrique de l'Éthiopie, tandis que l'Égypte craint pour sa part du Nil, et le débat porte sur la vitesse de remplissage du réservoir.",
        source: "Encyclopaedia Britannica, notice « Grand Ethiopian Renaissance Dam »",
      },
      {
        question: "Quel pays a la plus grande population d'Afrique ?",
        options: ["Le Nigeria", "L'Égypte", "L'Éthiopie", "L'Afrique du Sud"],
        fact: "Le Nigeria a dépassé deux cents millions d'habitants, et les Nations unies prévoient que l'Afrique réunira un quart de l'humanité en 2050.",
        source: "Nations unies, World Population Prospects",
      },
      {
        question: "Quelle part environ de la population africaine a moins de vingt ans ?",
        options: ["Environ la moitié", "Environ un quart", "Environ un dixième", "Presque la totalité"],
        fact: "L'âge médian du continent est d'environ dix-neuf ans, le plus jeune de toutes les régions, ce qui place l'école et l'emploi au centre de tous les débats.",
        source: "UNESCO, Histoire générale de l'Afrique, volume VIII",
      },
      {
        question: "Dans quelle ville se trouve le siège de l'Union africaine ?",
        options: ["Addis-Abeba", "Le Caire", "Nairobi", "Abuja"],
        fact: "L'Union africaine a son siège à Addis-Abeba, la même ville où son prédécesseur, l'Organisation de l'unité africaine, a été fondée en 1963.",
        source: "Union africaine, les États membres",
      },
      {
        question: "Dans quelle ville siège le secrétariat de la Zone de libre-échange continentale africaine ?",
        options: ["Accra", "Addis-Abeba", "Le Caire", "Abuja"],
        fact: "Le secrétariat de la zone de libre-échange se trouve à Accra, et il a pour tâche de faire fonctionner le marché unique que le continent a décidé de bâtir.",
        source: "Union africaine, Zone de libre-échange continentale africaine",
      },
      {
        question: "Quelle écologiste kényane a reçu le prix Nobel de la paix en 2004 ?",
        options: ["Wangari Maathai", "Ellen Johnson Sirleaf", "Desmond Tutu", "Denis Mukwege"],
        fact: "Wangari Maathai a fondé le mouvement de la ceinture verte, qui a planté des dizaines de millions d'arbres et placé la défense de la forêt au centre du débat politique.",
        source: "Encyclopaedia Britannica, notice « Wangari Maathai »",
      },
      {
        question: "Quel écrivain nigérian a reçu le prix Nobel de littérature en 1986 ?",
        options: ["Wole Soyinka", "Chinua Achebe", "Ngugi wa Thiong'o", "Chimamanda Ngozi Adichie"],
        fact: "Wole Soyinka a été le premier Africain à recevoir le prix, et ses pièces et ses essais discutent le pouvoir dans une langue nourrie du yoruba.",
        source: "Encyclopaedia Britannica, notice « Wole Soyinka »",
      },
      {
        question: "Quel projet de l'Union africaine plante une bande d'arbres à travers le Sahel pour retenir le désert ?",
        options: ["La Grande Muraille verte", "L'Agenda 2063", "La Renaissance africaine", "L'accord de Nouakchott"],
        fact: "La Grande Muraille verte devait courir sur 8 000 kilomètres du Sénégal à Djibouti, et son objectif s'est élargi à la restauration des terres autant qu'aux arbres.",
        source: "Union africaine, Initiative de la Grande Muraille verte",
      },
      {
        question: "Quelle ville d'Afrique du Sud a accueilli la finale de la première Coupe du monde de football organisée en Afrique ?",
        options: ["Johannesburg", "Le Cap", "Durban", "Pretoria"],
        fact: "La finale de 2010 s'est jouée à Soccer City, à Johannesburg, la première Coupe du monde sur le sol africain.",
        source: "Encyclopaedia Britannica, notice « 2010 FIFA World Cup »",
      },
      {
        question: "Quel lac, partagé par quatre pays du Sahel, a considérablement rétréci depuis les années 1960 ?",
        options: ["Le lac Tchad", "Le lac Victoria", "Le lac Tanganyika", "Le lac Malawi"],
        fact: "Le lac Tchad a perdu la plus grande partie de sa surface depuis les années 1960, et le recul de l'eau a poussé agriculteurs et pêcheurs au conflit.",
        source: "Encyclopaedia Britannica, notice « Lake Chad »",
      },
      {
        question: "Quel pays est le plus grand d'Afrique par sa superficie ?",
        options: ["L'Algérie", "Le Nigeria", "Le Soudan", "L'Afrique du Sud"],
        fact: "L'Algérie est le plus grand pays d'Afrique, et comme l'essentiel de son territoire est le Sahara, presque toute sa population vit sur la côte nord.",
        source: "Encyclopaedia Britannica, notice « Algeria »",
      },
      {
        question: "Quel lac est le plus grand d'Afrique, partagé par trois pays ?",
        options: ["Le lac Victoria", "Le lac Tanganyika", "Le lac Malawi", "Le lac Tchad"],
        fact: "Le lac Victoria est partagé par le Kenya, l'Ouganda et la Tanzanie, et ses pêcheries comme son eau comptent parmi les plus disputées d'Afrique.",
        source: "Encyclopaedia Britannica, notice « Lake Victoria »",
      },
      {
        question: "Quel est le plus haut sommet d'Afrique ?",
        options: ["Le Kilimandjaro", "Le mont Kenya", "Le Ras Dashan", "L'Emi Koussi"],
        fact: "Le Kilimandjaro se dresse en Tanzanie et porte un glacier à son sommet, et il est gravi par des dizaines de milliers de marcheurs chaque année.",
        source: "Encyclopaedia Britannica, notice « Kilimanjaro »",
      },
      {
        question: "Quelle chute du Zambèze, appelée Mosi-oa-Tunya, est partagée par la Zambie et le Zimbabwe ?",
        options: ["Les chutes Victoria", "Les chutes Boyoma", "Les chutes d'Inga", "Les chutes d'Augrabies"],
        fact: "Les chutes Victoria jettent tout le Zambèze du haut d'une falaise de 108 mètres, et leur embrun se voit à vingt kilomètres.",
        source: "Encyclopaedia Britannica, notice « Victoria Falls »",
      },
      {
        question: "Quel pays est le premier producteur mondial de cacao ?",
        options: ["La Côte d'Ivoire", "Le Ghana", "Le Nigeria", "Le Kenya"],
        fact: "La Côte d'Ivoire produit environ deux cinquièmes du cacao mondial, et l'essentiel quitte le continent en fèves plutôt qu'en chocolat.",
        source: "Encyclopaedia Britannica, notice « Cote d'Ivoire »",
      },
      {
        question: "Quel désert, le plus grand désert chaud du monde, couvre environ un quart du continent ?",
        options: ["Le Sahara", "Le Kalahari", "Le Namib", "Le Danakil"],
        fact: "Le Sahara est presque aussi grand que les États-Unis, et il gagne vers le sud dans le Sahel, ce que la Grande Muraille verte doit ralentir.",
        source: "Encyclopaedia Britannica, notice « Sahara »",
      },
    ],
  },
};
