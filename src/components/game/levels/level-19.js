/**
 * Apartheid: one level of the game, on its own.
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
import { Scale } from "lucide-react";

export default {
  id: 19,
  order: 24,
  era: "contemporary",
  from: 1948,
  title: "Apartheid",
  subtitle: "The long road to freedom in South Africa",
  region: "Southern Africa",
  color: "from-amber-700 to-stone-800",
  icon: Scale,
  gallery: {
    en: [
      {
        file: "/photos/level-19-1.jpg",
        caption: "The cell on Robben Island where Nelson Mandela was held for eighteen years.",
        credit: "Paul Mannix · CC BY-SA 2.0 · Wikimedia Commons",
        author: "Paul Mannix",
        licence: "CC BY-SA 2.0",
        source: "https://commons.wikimedia.org/wiki/File:Nelson_Mandela's_prison_cell%2C_Robben_Island%2C_South_Africa.jpg",
      },
      {
        file: "/photos/level-19-2.jpg",
        caption: "Nelson Mandela, after his release, beside Donald Card, a former policeman of the Eastern Cape.",
        credit: "Blossom Index · CC0 · Wikimedia Commons",
        author: "Blossom Index",
        licence: "CC0",
        source: "https://commons.wikimedia.org/wiki/File:President_Nelson_Mandela_and_The_Hon._Donald_Card.jpg",
      },
      {
        file: "/photos/level-19-3.jpg",
        caption: "The sign at the entrance of Soweto, the township of Johannesburg where the uprising of 1976 began.",
        credit: "Nolabob · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Nolabob",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Welcome_to_Soweto.jpg",
      },
    ],
    fr: [
      {
        file: "/photos/level-19-1.jpg",
        caption: "La cellule de l'île de Robben où Nelson Mandela fut détenu dix-huit ans.",
        credit: "Paul Mannix · CC BY-SA 2.0 · Wikimedia Commons",
        author: "Paul Mannix",
        licence: "CC BY-SA 2.0",
        source: "https://commons.wikimedia.org/wiki/File:Nelson_Mandela's_prison_cell%2C_Robben_Island%2C_South_Africa.jpg",
      },
      {
        file: "/photos/level-19-2.jpg",
        caption: "Nelson Mandela, après sa libération, aux côtés de Donald Card, un ancien policier du Cap-Oriental.",
        credit: "Blossom Index · CC0 · Wikimedia Commons",
        author: "Blossom Index",
        licence: "CC0",
        source: "https://commons.wikimedia.org/wiki/File:President_Nelson_Mandela_and_The_Hon._Donald_Card.jpg",
      },
      {
        file: "/photos/level-19-3.jpg",
        caption: "Le panneau à l'entrée de Soweto, le township de Johannesburg où débuta la révolte de 1976.",
        credit: "Nolabob · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Nolabob",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Welcome_to_Soweto.jpg",
      },
    ],
  },
  study: {
    en: {
      essay: ["In 1948, South Africa turned racial separation into the law of the land. Every person was classified by race, and the classification decided where they could live, which school they could attend, what work they could do, and whether they could vote.", "Families were moved, passes were checked, schools were split. Millions were taken from land their families had held for generations and put in townships on the edge of the cities, and the education given to black children was deliberately made narrower than the rest.", "The answer came from Sharpeville in 1960 to Soweto in 1976, from the prison cells of Robben Island to the words of Steve Biko. Against it stood the ANC and its allies, the Pan Africanist Congress, the Black Consciousness movement, the churches and, from 1985, the trade unions of COSATU. Much of the world refused to trade or to play sport with South Africa.", "After decades of struggle and world pressure, Nelson Mandela walked free in 1990, and in 1994 South Africans of every colour voted in the same election. After 1994 the Truth and Reconciliation Commission heard the victims and the perpetrators, exchanging a full account of a crime for amnesty, and the country is still working out what it owes."],
      timeline: [
        { year: "1948", text: "The National Party wins and begins to write apartheid into law." },
        { year: "1956", text: "Twenty thousand women march on Pretoria against the pass laws." },
        {
          year: "1960",
          text: "Police fire on a protest at Sharpeville and sixty-nine people are killed.",
        },
        { year: "1976", text: "Schoolchildren in Soweto rise against the language of instruction." },
        { year: "1990", text: "Nelson Mandela is released after twenty-seven years in prison." },
        { year: "1994", text: "The first election in which all South Africans may vote." },
      ],
      people: [
        {
          name: "Nelson Mandela",
          text: "The prisoner who became the first president of a free South Africa.",
        },
        {
          name: "Steve Biko",
          text: "The leader of the Black Consciousness movement, who died in police custody.",
        },
        {
          name: "Albertina Sisulu",
          text: "A leader of the women's march and of the liberation movement.",
        },
        {
          name: "Desmond Tutu",
          text: "The archbishop who chaired the Truth and Reconciliation Commission.",
        },
      ],
      places: [
        { name: "Sharpeville", text: "The township where the pass protest was fired on in 1960." },
        { name: "Soweto", text: "The township whose schoolchildren rose in 1976." },
        { name: "Robben Island", text: "The prison off Cape Town where Mandela was held." },
        {
          name: "The Union Buildings",
          text: "The seat of government in Pretoria and the goal of the women's march of 1956.",
        },
      ],
      glossary: [
        {
          term: "apartheid",
          text: "The Afrikaans word for separateness, and the system of racial laws.",
        },
        {
          term: "pass laws",
          text: "The rules that required black South Africans to carry a document at all times.",
        },
        {
          term: "township",
          text: "The segregated area where black South Africans were forced to live.",
        },
        {
          term: "bantustan",
          text: "A nominally self governing territory created to deny people their citizenship.",
        },
        {
          term: "Truth and Reconciliation Commission",
          text: "The body that heard testimony in exchange for amnesty.",
        },
      ],
    },
    fr: {
      essay: ["En 1948, l'Afrique du Sud a fait de la séparation raciale la loi du pays. Chaque personne était classée par race, et ce classement décidait où elle pouvait vivre, quelle école elle pouvait fréquenter, quel travail elle pouvait faire et si elle pouvait voter.", "Des familles ont été déplacées, les passes étaient contrôlées, les écoles séparées. Des millions de personnes ont été arrachées à des terres que leurs familles tenaient depuis des générations et installées dans des townships à la lisière des villes, et l'enseignement donné aux enfants noirs a été délibérément rendu plus étroit que le reste.", "La réponse est venue de Sharpeville en 1960 à Soweto en 1976, des cellules de Robben Island aux paroles de Steve Biko. Face à elle se tenaient l'ANC et ses alliés, le Congrès panafricaniste, le mouvement de conscience noire, les Églises et, à partir de 1985, les syndicats réunis dans la COSATU. Une grande partie du monde a refusé de commercer ou de jouer contre l'Afrique du Sud.", "Après des décennies de lutte et de pressions internationales, Nelson Mandela est sorti libre en 1990, et en 1994 les Sud-Africains de toutes les couleurs ont voté lors de la même élection. Après 1994, la Commission de la vérité et de la réconciliation a entendu les victimes et les auteurs des crimes, échangeant le récit complet d'un crime contre l'amnistie, et le pays cherche encore ce qu'il doit."],
      timeline: [
        {
          year: "1948",
          text: "Le Parti national gagne et commence à inscrire l'apartheid dans la loi.",
        },
        {
          year: "1956",
          text: "Vingt mille femmes marchent sur Pretoria contre les lois sur les passes.",
        },
        {
          year: "1960",
          text: "La police tire sur une manifestation à Sharpeville et soixante-neuf personnes sont tuées.",
        },
        { year: "1976", text: "Les écoliers de Soweto se soulèvent contre la langue d'enseignement." },
        { year: "1990", text: "Nelson Mandela est libéré après vingt-sept ans de prison." },
        { year: "1994", text: "La première élection où tous les Sud-Africains peuvent voter." },
      ],
      people: [
        {
          name: "Nelson Mandela",
          text: "Le prisonnier devenu premier président d'une Afrique du Sud libre.",
        },
        {
          name: "Steve Biko",
          text: "Le dirigeant du mouvement de conscience noire, mort en détention.",
        },
        {
          name: "Albertina Sisulu",
          text: "Une dirigeante de la marche des femmes et du mouvement de libération.",
        },
        {
          name: "Desmond Tutu",
          text: "L'archevêque qui a présidé la Commission de la vérité et de la réconciliation.",
        },
      ],
      places: [
        {
          name: "Sharpeville",
          text: "Le township où la manifestation contre les passes a été prise sous le feu en 1960.",
        },
        { name: "Soweto", text: "Le township dont les écoliers se sont soulevés en 1976." },
        { name: "Robben Island", text: "La prison au large du Cap où Mandela a été détenu." },
        {
          name: "Les Union Buildings",
          text: "Le siège du gouvernement à Pretoria et le but de la marche des femmes de 1956.",
        },
      ],
      glossary: [
        { term: "apartheid", text: "Le mot afrikaans pour séparation, et le système de lois raciales." },
        {
          term: "lois sur les passes",
          text: "Les règles qui obligeaient les Sud-Africains noirs à porter un document en permanence.",
        },
        {
          term: "township",
          text: "Le quartier séparé où les Sud-Africains noirs étaient contraints de vivre.",
        },
        {
          term: "bantoustan",
          text: "Un territoire nominalement autonome, créé pour priver les gens de leur citoyenneté.",
        },
        {
          term: "Commission de la vérité et de la réconciliation",
          text: "L'instance qui a recueilli les récits en échange de l'amnistie.",
        },
      ],
    },
  },
  questions: [
    {
      question: "Which party came to power in 1948 and turned racial separation into law?",
      options: ["The National Party", "The African National Congress", "The Inkatha movement", "The Communist Party"],
      correct: 0,
      fact: "Apartheid means apartness in Afrikaans, and the government built a whole legal system around it, from marriage to housing to schooling.",
      source: { label: "Encyclopaedia Britannica, \"apartheid\"" },
    },
    {
      question: "Which document did every Black South African have to carry at all times?",
      options: ["The pass book", "A school certificate", "A tax receipt", "A union card"],
      correct: 0,
      fact: "The pass laws controlled where people could live and work, and arrests under those laws filled the prisons.",
      source: { label: "Encyclopaedia Britannica, \"apartheid\"" },
    },
    {
      question: "Which township shooting of 1960, where 69 people were killed, was a turning point in the struggle?",
      options: ["Sharpeville", "Soweto", "Langa", "Alexandra"],
      correct: 0,
      fact: "The world reacted with shock, the ANC and the Pan Africanist Congress were banned, and the movement turned to armed struggle.",
      source: { label: "Encyclopaedia Britannica, \"Sharpeville massacre\"" },
    },
    {
      question: "Which trial in 1963 and 1964 sentenced Nelson Mandela and his companions to life in prison?",
      options: ["The Rivonia trial", "The Treason trial", "The Sharpeville trial", "The Nuremberg trial"],
      correct: 0,
      fact: "At the end of the trial Mandela told the court that he had dedicated his life to the struggle of the African people.",
      source: { label: "Encyclopaedia Britannica, \"Rivonia Trial\"" },
    },
    {
      question: "Which uprising began in June 1976 with pupils protesting against Afrikaans as a language of instruction?",
      options: ["The Soweto uprising", "The Bambatha rebellion", "The Rand strike", "The Durban riots"],
      correct: 0,
      fact: "Police opened fire on the pupils, and the photograph of Hector Pieterson carried through the streets went around the world.",
      source: { label: "Encyclopaedia Britannica, \"Soweto uprising\"" },
    },
    {
      question: "Which leader of Black Consciousness died in police custody in 1977?",
      options: ["Steve Biko", "Desmond Tutu", "Walter Sisulu", "Chris Hani"],
      correct: 0,
      fact: "Biko was beaten during interrogation and driven hundreds of kilometres injured, and his death made his name a symbol of resistance.",
      source: { label: "Encyclopaedia Britannica, \"Steve Biko\"" },
    },
    {
      question: "On which island near Cape Town was Mandela held for eighteen years?",
      options: ["Robben Island", "Goree", "Zanzibar", "Mauritius"],
      correct: 0,
      fact: "Prisoners on Robben Island worked in a limestone quarry and studied in secret, and the island is now a museum and a World Heritage site.",
      source: { label: "UNESCO World Heritage List, Robben Island", url: "https://whc.unesco.org/en/list/916/" },
    },
    {
      question: "In which year did South Africa hold its first election open to all races?",
      options: ["1994", "1976", "1990", "1999"],
      correct: 0,
      fact: "Mandela became president on 10 May 1994, and the Truth and Reconciliation Commission was set up two years later.",
      source: { label: "Encyclopaedia Britannica, \"Nelson Mandela\"" },
    },
    {
      question: "Which law of 1950 registered every South African by race?",
      options: ["The Population Registration Act", "The Group Areas Act", "The Bantu Education Act", "The Prohibition of Mixed Marriages Act"],
      correct: 0,
      fact: "The Population Registration Act fixed each person's race on paper, and every other apartheid law was built on that register.",
      source: { label: "Encyclopaedia Britannica, \"apartheid\"" },
    },
    {
      question: "Which 1955 gathering of the ANC and its allies adopted the Freedom Charter?",
      options: ["The Congress of the People", "The Rivonia trial", "The Defiance Campaign", "The Treason trial"],
      correct: 0,
      fact: "The Freedom Charter declared that South Africa belongs to all who live in it, and it guided the movement for the next forty years.",
      source: { label: "Encyclopaedia Britannica, \"Freedom Charter\"" },
    },
    {
      question: "What did the government call the territories it set aside for Black South Africans under apartheid?",
      options: ["Bantustans", "Townships", "Group areas", "Homesteads"],
      correct: 0,
      fact: "Ten Bantustans were carved out, and four of them were declared independent by South Africa, a decision no other country recognised.",
      source: { label: "Encyclopaedia Britannica, \"Bantustan\"" },
    },
    {
      question: "Which law of 1950 gave each racial group its own areas to live in?",
      options: ["The Group Areas Act", "The Population Registration Act", "The Bantu Education Act", "The Pass Laws Act"],
      correct: 0,
      fact: "The Group Areas Act forced families out of neighbourhoods the government had given to another group, often with no notice at all.",
      source: { label: "Encyclopaedia Britannica, \"apartheid\"" },
    },
    {
      question: "Which armed wing, founded in 1961, began the ANC campaign of sabotage against the state?",
      options: ["Umkhonto we Sizwe", "The Pan Africanist Congress", "The Black Consciousness Movement", "The Congress Alliance"],
      correct: 0,
      fact: "Umkhonto we Sizwe, the spear of the nation, attacked power stations and government buildings, and Mandela was imprisoned for leading it.",
      source: { label: "Encyclopaedia Britannica, \"Umkhonto we Sizwe\"" },
    },
    {
      question: "Which trade union federation, founded in 1985, brought organised workers into the struggle?",
      options: ["COSATU", "The ANC Youth League", "The United Democratic Front", "The Inkatha movement"],
      correct: 0,
      fact: "COSATU joined the democratic movement in 1987, and the strikes of its members became one of the strongest pressures on apartheid.",
      source: { label: "Encyclopaedia Britannica, \"COSATU\"" },
    },
    {
      question: "Which United Nations convention of 1973 declared apartheid a crime against humanity?",
      options: ["The Apartheid Convention", "The Geneva Convention", "The Genocide Convention", "The Refugee Convention"],
      correct: 0,
      fact: "The convention made the system itself unlawful under international law, and it pushed states to stop dealing with South Africa.",
      source: { label: "Encyclopaedia Britannica, \"apartheid\"" },
    },
    {
      question: "Which march of 1956, by twenty thousand women, went to the Union Buildings in Pretoria?",
      options: ["The Women's March", "The Defiance Campaign", "The Congress of the People", "The Sharpeville protest"],
      correct: 0,
      fact: "The women carried petitions against the pass laws, and their chant of 'you have tampered with the women, you have struck a rock' is still remembered.",
      source: { label: "Encyclopaedia Britannica, \"apartheid\"" },
    },
    {
      question: "Which campaign of 1952 deliberately broke the pass and curfew laws?",
      options: ["The Defiance Campaign", "The Congress of the People", "The Rivonia trial", "The Soweto uprising"],
      correct: 0,
      fact: "Volunteers went to prison by the thousand and refused to pay fines, and the campaign made the ANC the leading movement in the country.",
      source: {
        label: "UNESCO, General History of Africa, volume VIII",
        url: "https://www.unesco.org/en/general-history-africa",
      },
    },
    {
      question: "Which law of 1953 split schooling by race and cut the education of Black pupils?",
      options: ["The Bantu Education Act", "The Group Areas Act", "The Population Registration Act", "The Pass Laws Act"],
      correct: 0,
      fact: "The act said that Black pupils were to be taught for the work the state intended for them, and it packed classrooms far beyond capacity.",
      source: { label: "Encyclopaedia Britannica, \"apartheid\"" },
    },
    {
      question: "Which law of 1949 forbade marriage across the racial lines?",
      options: ["The Prohibition of Mixed Marriages Act", "The Group Areas Act", "The Population Registration Act", "The Immorality Act"],
      correct: 0,
      fact: "The law was the first of the apartheid statutes, and it made a family of two races into a criminal court case.",
      source: { label: "Encyclopaedia Britannica, \"apartheid\"" },
    },
    {
      question: "Which coalition of the 1980s brought churches, unions and civic groups into one campaign inside South Africa?",
      options: ["The United Democratic Front", "The Inkatha movement", "The Pan Africanist Congress", "The Black Sash"],
      correct: 0,
      fact: "The front was a thousand organisations strong at its height, and the government banned it in 1988, which is how it knew it was being felt.",
      source: { label: "Encyclopaedia Britannica, \"apartheid\"" },
    },
    {
      question: "Which commission, chaired by Desmond Tutu, heard testimony about apartheid's crimes after 1994?",
      options: ["The Truth and Reconciliation Commission", "The Rivonia Commission", "The Bantu Commission", "The Robben Commission"],
      correct: 0,
      fact: "The commission exchanged a full account of a crime for amnesty, and its hearings were broadcast to the whole country every evening.",
      source: { label: "Encyclopaedia Britannica, \"apartheid\"" },
    },
  ],
  fr: {
    title: "L'apartheid",
    subtitle: "La longue marche vers la liberté en Afrique du Sud",
    region: "Afrique australe",
    questions: [
      {
        question: "Quel parti est arrivé au pouvoir en 1948 et a fait de la séparation raciale une loi ?",
        options: ["Le Parti national", "Le Congrès national africain", "Le mouvement Inkatha", "Le Parti communiste"],
        fact: "Apartheid signifie séparation en afrikaans, et le gouvernement a bâti tout un système juridique autour : mariage, logement, école.",
        source: "Encyclopaedia Britannica, notice « apartheid »",
      },
      {
        question: "Quel document chaque Sud-Africain noir devait-il porter en permanence ?",
        options: ["Le livret de passe", "Un certificat scolaire", "Un reçu d'impôt", "Une carte syndicale"],
        fact: "Les lois sur les passes contrôlaient où les gens pouvaient vivre et travailler, et les arrestations pour infraction remplissaient les prisons.",
        source: "Encyclopaedia Britannica, notice « apartheid »",
      },
      {
        question: "Quelle fusillade de 1960, qui a tué 69 personnes, a marqué un tournant dans la lutte ?",
        options: ["Sharpeville", "Soweto", "Langa", "Alexandra"],
        fact: "Le monde a réagi avec stupeur, l'ANC et le Congrès panafricain ont été interdits, et le mouvement s'est tourné vers la lutte armée.",
        source: "Encyclopaedia Britannica, notice « Sharpeville massacre »",
      },
      {
        question: "Quel procès, en 1963 et 1964, a condamné Nelson Mandela et ses compagnons à la prison à vie ?",
        options: ["Le procès de Rivonia", "Le procès de Nuremberg", "Le procès pour trahison", "Le procès de Sharpeville"],
        fact: "À la fin du procès, Mandela a déclaré à la cour qu'il avait consacré sa vie à la lutte du peuple africain.",
        source: "Encyclopaedia Britannica, notice « Rivonia Trial »",
      },
      {
        question: "Quel soulèvement a commencé en juin 1976 avec des élèves protestant contre l'afrikaans comme langue d'enseignement ?",
        options: ["Le soulèvement de Soweto", "La rébellion de Bambatha", "La grève du Rand", "Les émeutes de Durban"],
        fact: "La police a tiré sur les élèves, et la photographie d'Hector Pieterson porté dans les rues a fait le tour du monde.",
        source: "Encyclopaedia Britannica, notice « Soweto uprising »",
      },
      {
        question: "Quel dirigeant de la conscience noire est mort en détention policière en 1977 ?",
        options: ["Steve Biko", "Desmond Tutu", "Walter Sisulu", "Chris Hani"],
        fact: "Biko a été frappé pendant son interrogatoire et transporté blessé sur des centaines de kilomètres, et sa mort a fait de son nom un symbole de résistance.",
        source: "Encyclopaedia Britannica, notice « Steve Biko »",
      },
      {
        question: "Sur quelle île près du Cap Mandela a-t-il été détenu pendant dix-huit ans ?",
        options: ["Robben Island", "Gorée", "Zanzibar", "L'île Maurice"],
        fact: "Les prisonniers de Robben Island travaillaient dans une carrière de calcaire et étudiaient en secret, et l'île est aujourd'hui un musée et un site du patrimoine mondial.",
        source: "Liste du patrimoine mondial de l'UNESCO, Robben Island",
      },
      {
        question: "En quelle année l'Afrique du Sud a-t-elle tenu sa première élection ouverte à toutes les races ?",
        options: ["1994", "1976", "1990", "1999"],
        fact: "Mandela est devenu président le 10 mai 1994, et la Commission de la vérité et de la réconciliation a été créée deux ans plus tard.",
        source: "Encyclopaedia Britannica, notice « Nelson Mandela »",
      },
      {
        question: "Quelle loi de 1950 a enregistré chaque Sud-Africain selon sa race ?",
        options: ["La loi d'enregistrement de la population", "La loi sur les zones réservées", "La loi sur l'éducation bantoue", "La loi interdisant les mariages mixtes"],
        fact: "La loi d'enregistrement de la population fixait la race de chacun sur le papier, et toutes les autres lois de l'apartheid reposaient sur ce registre.",
        source: "Encyclopaedia Britannica, notice « apartheid »",
      },
      {
        question: "Quel rassemblement de 1955 réunissant l'ANC et ses alliés a adopté la Charte de la liberté ?",
        options: ["Le Congrès du peuple", "Le procès de Rivonia", "La Campagne de désobéissance", "Le procès pour trahison"],
        fact: "La Charte de la liberté déclarait que l'Afrique du Sud appartient à tous ceux qui y vivent, et elle a guidé le mouvement pendant les quarante années suivantes.",
        source: "Encyclopaedia Britannica, notice « Freedom Charter »",
      },
      {
        question: "Comment le gouvernement appelait-il les territoires qu'il réservait aux Noirs d'Afrique du Sud sous l'apartheid ?",
        options: ["Les bantoustans", "Les townships", "Les zones de groupe", "Les fermes"],
        fact: "Dix bantoustans ont été découpés, et quatre d'entre eux ont été déclarés indépendants par l'Afrique du Sud, une décision qu'aucun autre pays n'a reconnue.",
        source: "Encyclopaedia Britannica, notice « Bantustan »",
      },
      {
        question: "Quelle loi de 1950 attribuait à chaque groupe racial ses propres quartiers d'habitation ?",
        options: ["Le Group Areas Act", "Le Population Registration Act", "Le Bantu Education Act", "La loi sur les laissez-passer"],
        fact: "Le Group Areas Act a chassé des familles de quartiers que le gouvernement avait attribués à un autre groupe, souvent sans aucun préavis.",
        source: "Encyclopaedia Britannica, notice « apartheid »",
      },
      {
        question: "Quelle branche armée, fondée en 1961, a commencé la campagne de sabotage de l'ANC contre l'État ?",
        options: ["Umkhonto we Sizwe", "Le Congrès panafricaniste", "Le mouvement de conscience noire", "L'Alliance du Congrès"],
        fact: "Umkhonto we Sizwe, la lance de la nation, attaquait les centrales électriques et les bâtiments officiels, et Mandela a été emprisonné pour l'avoir dirigée.",
        source: "Encyclopaedia Britannica, notice « Umkhonto we Sizwe »",
      },
      {
        question: "Quelle fédération syndicale, fondée en 1985, a amené les travailleurs organisés dans la lutte ?",
        options: ["La COSATU", "La ligue de jeunesse de l'ANC", "Le Front démocratique uni", "Le mouvement Inkatha"],
        fact: "La COSATU a rejoint le mouvement démocratique en 1987, et les grèves de ses membres sont devenues l'une des plus fortes pressions sur l'apartheid.",
        source: "Encyclopaedia Britannica, notice « COSATU »",
      },
      {
        question: "Quelle convention des Nations unies de 1973 a déclaré l'apartheid crime contre l'humanité ?",
        options: ["La convention sur l'apartheid", "La convention de Genève", "La convention sur le génocide", "La convention sur les réfugiés"],
        fact: "La convention a rendu le système lui-même illégal en droit international, et elle a poussé les États à cesser de traiter avec l'Afrique du Sud.",
        source: "Encyclopaedia Britannica, notice « apartheid »",
      },
      {
        question: "Quelle marche de 1956, menée par vingt mille femmes, est allée aux Union Buildings de Pretoria ?",
        options: ["La marche des femmes", "La Campagne de désobéissance", "Le Congrès du peuple", "La protestation de Sharpeville"],
        fact: "Les femmes portaient des pétitions contre les lois sur les laissez-passer, et leur chant « vous avez touché aux femmes, vous avez frappé un rocher » est encore repris aujourd'hui.",
        source: "Encyclopaedia Britannica, notice « apartheid »",
      },
      {
        question: "Quelle campagne de 1952 a délibérément bravé les lois sur les laissez-passer et le couvre-feu ?",
        options: ["La Campagne de désobéissance", "Le Congrès du peuple", "Le procès de Rivonia", "Le soulèvement de Soweto"],
        fact: "Des volontaires sont allés en prison par milliers en refusant de payer les amendes, et la campagne a fait de l'ANC le principal mouvement du pays.",
        source: "UNESCO, Histoire générale de l'Afrique, volume VIII",
      },
      {
        question: "Quelle loi de 1953 a séparé la scolarité par race et réduit l'éducation des élèves noirs ?",
        options: ["Le Bantu Education Act", "Le Group Areas Act", "Le Population Registration Act", "La loi sur les laissez-passer"],
        fact: "La loi disait que les élèves noirs seraient formés pour le travail que l'État leur destinait, et elle a rempli les classes bien au-delà de leur capacité.",
        source: "Encyclopaedia Britannica, notice « apartheid »",
      },
      {
        question: "Quelle loi de 1949 a interdit le mariage entre personnes de races différentes ?",
        options: ["Le Prohibition of Mixed Marriages Act", "Le Group Areas Act", "Le Population Registration Act", "L'Immorality Act"],
        fact: "La loi a été la première des lois d'apartheid, et elle a transformé une famille de deux races en affaire pénale.",
        source: "Encyclopaedia Britannica, notice « apartheid »",
      },
      {
        question: "Quelle coalition des années 1980 a réuni Églises, syndicats et associations civiques dans une même campagne en Afrique du Sud ?",
        options: ["Le Front démocratique uni", "Le mouvement Inkatha", "Le Congrès panafricaniste", "La Ceinture noire"],
        fact: "Le Front comptait un millier d'organisations à son apogée, et le gouvernement l'a interdit en 1988, ce qui montre qu'il se faisait sentir.",
        source: "Encyclopaedia Britannica, notice « apartheid »",
      },
      {
        question: "Quelle commission, présidée par Desmond Tutu, a recueilli les récits des crimes de l'apartheid après 1994 ?",
        options: ["La Commission de la vérité et de la réconciliation", "La commission de Rivonia", "La commission du Bantou", "La commission de Robben"],
        fact: "La commission échangeait le récit complet d'un crime contre l'amnistie, et ses audiences étaient diffusées chaque soir à tout le pays.",
        source: "Encyclopaedia Britannica, notice « apartheid »",
      },
    ],
  },
};
