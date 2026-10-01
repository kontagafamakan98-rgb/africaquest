/**
 * Portuguese Africa: one level of the game, on its own.
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
import { Anchor } from "lucide-react";

export default {
  id: 24,
  order: 18,
  era: "earlyModern",
  from: 1482,
  title: "Portuguese Africa",
  subtitle: "Kongo, Angola and Mozambique",
  region: "Portuguese Africa",
  color: "from-blue-500 to-sky-700",
  icon: Anchor,
  gallery: {
    en: [
      {
        file: "/photos/level-24-1.jpg",
        caption: "The bay of Luanda, the port from which Portuguese Angola was ruled and supplied.",
        credit: "Paulo César Santos · CC0 · Wikimedia Commons",
        author: "Paulo César Santos",
        licence: "CC0",
        source: "https://commons.wikimedia.org/wiki/File:Bay_of_Luanda.jpg",
      },
      {
        file: "/photos/level-24-2.jpg",
        caption: "Fort Jesus at Mombasa, built by the Portuguese in 1593 on the route to India.",
        credit: "Mutisya Maingi · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Mutisya Maingi",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Fort_Jesus_Mombasa.jpg",
      },
      {
        file: "/photos/level-24-3.jpg",
        caption: "Boats off the Island of Mozambique, the seat of Portuguese East Africa.",
        credit: "Stig Nygaard · CC BY 2.0 · Wikimedia Commons",
        author: "Stig Nygaard",
        licence: "CC BY 2.0",
        source: "https://commons.wikimedia.org/wiki/File:Island_of_Mozambique_boats.jpg",
      },
    ],
    fr: [
      {
        file: "/photos/level-24-1.jpg",
        caption: "La baie de Luanda, le port d'où l'Angola portugais était gouverné et ravitaillé.",
        credit: "Paulo César Santos · CC0 · Wikimedia Commons",
        author: "Paulo César Santos",
        licence: "CC0",
        source: "https://commons.wikimedia.org/wiki/File:Bay_of_Luanda.jpg",
      },
      {
        file: "/photos/level-24-2.jpg",
        caption: "Fort Jesus à Mombasa, bâti par les Portugais en 1593 sur la route des Indes.",
        credit: "Mutisya Maingi · CC BY-SA 4.0 · Wikimedia Commons",
        author: "Mutisya Maingi",
        licence: "CC BY-SA 4.0",
        source: "https://commons.wikimedia.org/wiki/File:Fort_Jesus_Mombasa.jpg",
      },
      {
        file: "/photos/level-24-3.jpg",
        caption: "Des bateaux au large de l'île de Mozambique, siège de l'Afrique orientale portugaise.",
        credit: "Stig Nygaard · CC BY 2.0 · Wikimedia Commons",
        author: "Stig Nygaard",
        licence: "CC BY 2.0",
        source: "https://commons.wikimedia.org/wiki/File:Island_of_Mozambique_boats.jpg",
      },
    ],
  },
  study: {
    en: {
      essay: ["In 1482 a Portuguese fleet reached the mouth of the Congo, and Portuguese envoys soon stood at the court of the kingdom of Kongo. The king Afonso I wrote to Lisbon as an equal, asking for teachers and craftsmen and complaining about the slave trade that was emptying his country.", "South along the coast the Portuguese founded Luanda in 1575 and made Angola a colony built on the trade of captives, while Benguela became a second port for the same traffic. In the Indian Ocean the island of Mozambique became the seat of Portuguese East Africa, and Fort Jesus at Mombasa guarded the route to India.", "Further north they held on to Guinea-Bissau and settled the Atlantic islands of Cape Verde and Sao Tome, where sugar was grown by enslaved Africans. Along the Zambezi the prazos were large estates granted to settlers, and Portuguese, Africans and mesticos married and traded together.", "Portugal kept its colonies long after the other European empires had left, and armed struggles followed: the PAIGC in Guinea-Bissau, FRELIMO in Mozambique and the MPLA in Angola. After the fall of the Portuguese dictatorship in 1974, the colonies became independent in 1975."],
      timeline: [
        {
          year: "1482",
          text: "Diogo Cao reaches the mouth of the Congo and meets the kingdom of Kongo.",
        },
        { year: "1575", text: "Paulo Dias de Novais founds Luanda and the colony of Angola." },
        { year: "1593", text: "The Portuguese build Fort Jesus at Mombasa." },
        { year: "1648", text: "Portuguese forces retake Luanda after seven years of Dutch rule." },
        { year: "1960", text: "The Mueda massacre turns northern Mozambique towards revolt." },
        { year: "1975", text: "The Portuguese colonies in Africa become independent." },
      ],
      people: [
        {
          name: "Afonso I",
          text: "The king of Kongo who wrote to Lisbon for teachers and complained of the slave trade.",
        },
        {
          name: "Nzinga Mbande",
          text: "The queen of Ndongo and Matamba who fought and negotiated with the Portuguese.",
        },
        { name: "Diogo Cao", text: "The Portuguese navigator who reached the Congo in 1482." },
        {
          name: "Amilcar Cabral",
          text: "The leader of the PAIGC, which fought for Guinea-Bissau and Cape Verde.",
        },
        {
          name: "Samora Machel",
          text: "The leader of FRELIMO, the first president of independent Mozambique.",
        },
      ],
      places: [
        {
          name: "Luanda",
          text: "The capital and main port of Portuguese Angola, from which captives were shipped.",
        },
        {
          name: "The Island of Mozambique",
          text: "The seat of Portuguese East Africa, with its fort, church and hospital.",
        },
        {
          name: "Fort Jesus",
          text: "The Portuguese fort at Mombasa, a World Heritage Site of the Indian Ocean trade.",
        },
        {
          name: "Cape Verde",
          text: "The Atlantic archipelago settled by Portuguese and African families.",
        },
        {
          name: "Sao Tome",
          text: "The island where sugar was grown by enslaved Africans in the sixteenth century.",
        },
      ],
      glossary: [
        { term: "prazos", text: "The large estates along the Zambezi granted to Portuguese settlers." },
        {
          term: "mesticos",
          text: "People of African and Portuguese descent in the port towns of the empire.",
        },
        { term: "FRELIMO", text: "The movement that fought for the independence of Mozambique." },
        { term: "MPLA", text: "The movement that fought for the independence of Angola." },
        { term: "PAIGC", text: "The movement that fought for Guinea-Bissau and Cape Verde." },
      ],
    },
    fr: {
      essay: ["En 1482, une flotte portugaise a atteint l'embouchure du Congo, et des envoyés portugais se sont bientôt tenus à la cour du royaume du Kongo. Le roi Afonso Ier écrivait à Lisbonne d'égal à égal, demandant des maîtres et des artisans et se plaignant de la traite qui vidait son pays.", "Plus au sud, les Portugais ont fondé Luanda en 1575 et ont fait de l'Angola une colonie bâtie sur le commerce des captifs, tandis que Benguela devenait un second port pour le même trafic. Dans l'océan Indien, l'île de Mozambique est devenue le siège de l'Afrique orientale portugaise, et Fort Jesus à Mombasa gardait la route des Indes.", "Plus au nord, ils ont gardé la Guinée-Bissau et peuplé les îles atlantiques du Cap-Vert et de Sao Tome, où la canne à sucre était travaillée par des Africains réduits en esclavage. Le long du Zambèze, les prazos étaient de grands domaines accordés aux colons, et Portugais, Africains et mesticos se mariaient et commerçaient ensemble.", "Le Portugal a gardé ses colonies longtemps après le départ des autres empires européens, et des luttes armées ont suivi : le PAIGC en Guinée-Bissau, le FRELIMO au Mozambique et le MPLA en Angola. Après la chute de la dictature portugaise en 1974, les colonies sont devenues indépendantes en 1975."],
      timeline: [
        {
          year: "1482",
          text: "Diogo Cao atteint l'embouchure du Congo et rencontre le royaume du Kongo.",
        },
        { year: "1575", text: "Paulo Dias de Novais fonde Luanda et la colonie d'Angola." },
        { year: "1593", text: "Les Portugais bâtissent Fort Jesus à Mombasa." },
        {
          year: "1648",
          text: "Les forces portugaises reprennent Luanda après sept ans de domination néerlandaise.",
        },
        { year: "1960", text: "Le massacre de Mueda pousse le nord du Mozambique vers la révolte." },
        { year: "1975", text: "Les colonies portugaises d'Afrique deviennent indépendantes." },
      ],
      people: [
        {
          name: "Afonso Ier",
          text: "Le roi du Kongo qui a écrit à Lisbonne pour demander des maîtres et s'est plaint de la traite.",
        },
        {
          name: "Nzinga Mbande",
          text: "La reine du Ndongo et du Matamba qui a combattu et négocié avec les Portugais.",
        },
        { name: "Diogo Cao", text: "Le navigateur portugais qui a atteint le Congo en 1482." },
        {
          name: "Amilcar Cabral",
          text: "Le dirigeant du PAIGC, qui a combattu pour la Guinée-Bissau et le Cap-Vert.",
        },
        {
          name: "Samora Machel",
          text: "Le dirigeant du FRELIMO, premier président du Mozambique indépendant.",
        },
      ],
      places: [
        {
          name: "Luanda",
          text: "La capitale et le principal port de l'Angola portugais, d'où les captifs étaient embarqués.",
        },
        {
          name: "L'île de Mozambique",
          text: "Le siège de l'Afrique orientale portugaise, avec son fort, son église et son hôpital.",
        },
        {
          name: "Fort Jesus",
          text: "Le fort portugais de Mombasa, site du patrimoine mondial du commerce de l'océan Indien.",
        },
        {
          name: "Le Cap-Vert",
          text: "L'archipel atlantique peuplé par des familles portugaises et africaines.",
        },
        {
          name: "Sao Tome",
          text: "L'île ou la canne à sucre était travaillée par des Africains réduits en esclavage au XVIe siècle.",
        },
      ],
      glossary: [
        {
          term: "prazos",
          text: "Les grands domaines le long du Zambèze accordés aux colons portugais.",
        },
        {
          term: "mesticos",
          text: "Les personnes de descendance africaine et portugaise dans les villes portuaires de l'empire.",
        },
        { term: "FRELIMO", text: "Le mouvement qui a combattu pour l'indépendance du Mozambique." },
        { term: "MPLA", text: "Le mouvement qui a combattu pour l'indépendance de l'Angola." },
        { term: "PAIGC", text: "Le mouvement qui a combattu pour la Guinée-Bissau et le Cap-Vert." },
      ],
    },
  },
  questions: [
    {
      question: "Which Portuguese navigator reached the mouth of the Congo river in 1482?",
      options: ["Diogo Cao", "Vasco da Gama", "Bartolomeu Dias", "Ferdinand Magellan"],
      correct: 0,
      fact: "Diogo Cao reached the Congo in 1482 and opened a long exchange between the Kongo court and Lisbon.",
      source: { label: "Encyclopaedia Britannica, \"Diogo Cao\"" },
    },
    {
      question: "Which kingdom did the Portuguese envoys reach at the mouth of the Congo?",
      options: ["The kingdom of Kongo", "The kingdom of Ndongo", "The kingdom of Matamba", "The kingdom of Loango"],
      correct: 0,
      fact: "The kingdom of Kongo ruled the lower Congo, and its kings wrote to the Portuguese as equals.",
      source: { label: "Encyclopaedia Britannica, \"Kongo\"" },
    },
    {
      question: "Which Kongo king wrote to Portugal asking for teachers, priests and craftsmen?",
      options: ["Afonso I", "Nzinga a Nkuwu", "Alvaro I", "Garcia II"],
      correct: 0,
      fact: "Afonso I asked Lisbon for teachers and craftsmen and wrote of the harm the slave trade was doing to his kingdom.",
      source: { label: "Encyclopaedia Britannica, \"Afonso I\"" },
    },
    {
      question: "Which queen of Ndongo and Matamba resisted the Portuguese for decades?",
      options: ["Nzinga Mbande", "Kimpa Vita", "Mwadi", "Ndala"],
      correct: 0,
      fact: "Nzinga Mbande fought and negotiated with the Portuguese for nearly forty years, and her name was taken as a title by later rulers.",
      source: { label: "Encyclopaedia Britannica, \"Nzinga\"" },
    },
    {
      question: "In which year did the Portuguese found the colony of Angola at Luanda?",
      options: ["1575", "1482", "1622", "1750"],
      correct: 0,
      fact: "Paulo Dias de Novais founded Luanda in 1575, and Angola became a colony built on the slave trade.",
      source: { label: "Encyclopaedia Britannica, \"Angola\"" },
    },
    {
      question: "Which port city became the capital of Portuguese Angola?",
      options: ["Luanda", "Benguela", "Mbanza Kongo", "Lubango"],
      correct: 0,
      fact: "Luanda was the capital and the main port, and from it captives were shipped across the Atlantic.",
      source: { label: "Encyclopaedia Britannica, \"Luanda\"" },
    },
    {
      question: "Which island city in the Indian Ocean was the capital of Portuguese East Africa?",
      options: ["The Island of Mozambique", "Zanzibar", "Mombasa", "Sofala"],
      correct: 0,
      fact: "The Island of Mozambique became the seat of the Portuguese in East Africa, with its hospital, church and fort of Sao Sebastiao.",
      source: {
        label: "UNESCO World Heritage List, Island of Mozambique",
        url: "https://whc.unesco.org/en/list/599/",
      },
    },
    {
      question: "Which Portuguese fort in Mombasa is a World Heritage Site?",
      options: ["Fort Jesus", "Fort Sao Sebastiao", "Elmina Castle", "Fort Dauphin"],
      correct: 0,
      fact: "Fort Jesus was built by the Portuguese at Mombasa in 1593 and changed hands between them, the Omanis and the British.",
      source: {
        label: "UNESCO World Heritage List, Fort Jesus, Mombasa",
        url: "https://whc.unesco.org/en/list/1295/",
      },
    },
    {
      question: "Which European language is the official language of Angola and Mozambique today?",
      options: ["Portuguese", "French", "English", "Spanish"],
      correct: 0,
      fact: "Portuguese stayed the official language after independence, and it is now spoken as a first or second language by millions.",
      source: { label: "Encyclopaedia Britannica, \"Portuguese language\"" },
    },
    {
      question: "Which island in the Gulf of Guinea became a Portuguese sugar colony?",
      options: ["Sao Tome", "Cape Verde", "Bioko", "Principe"],
      correct: 0,
      fact: "Sao Tome was planted with sugar cane worked by enslaved Africans, one of the first plantation economies of the Atlantic.",
      source: { label: "Encyclopaedia Britannica, \"Sao Tome and Principe\"" },
    },
    {
      question: "Which Atlantic archipelago was settled by the Portuguese in the fifteenth century?",
      options: ["Cape Verde", "The Canary Islands", "The Comoros", "The Azores"],
      correct: 0,
      fact: "Cape Verde was settled by Portuguese and African families, and its creole culture grew from that meeting.",
      source: { label: "Encyclopaedia Britannica, \"Cape Verde\"" },
    },
    {
      question: "Which mainland colony in West Africa stayed Portuguese for five centuries?",
      options: ["Guinea-Bissau", "Ghana", "Senegal", "The Gambia"],
      correct: 0,
      fact: "Guinea-Bissau was claimed by Portugal from the fifteenth century and won its independence in 1974.",
      source: { label: "Encyclopaedia Britannica, \"Guinea-Bissau\"" },
    },
    {
      question: "What did the Portuguese call the people of mixed African and European descent in their colonies?",
      options: ["Mesticos", "Assimilados", "Prazeros", "Luso-Africans only"],
      correct: 0,
      fact: "The mesticos of the port towns spoke Portuguese, traded for the crown and often held land of their own.",
      source: { label: "Encyclopaedia Britannica, \"mestico\"" },
    },
    {
      question: "Which system of estates along the Zambezi was granted to Portuguese settlers?",
      options: ["The prazos", "The engenhos", "The fazendas", "The capitanias"],
      correct: 0,
      fact: "The prazos were large land grants along the Zambezi, held on condition of settlement and passed down through families.",
      source: { label: "Encyclopaedia Britannica, \"Mozambique\"" },
    },
    {
      question: "Which movement fought for the independence of Mozambique?",
      options: ["FRELIMO", "MPLA", "PAIGC", "UNITA"],
      correct: 0,
      fact: "FRELIMO began an armed struggle in 1964 and formed the first government of independent Mozambique in 1975.",
      source: { label: "Encyclopaedia Britannica, \"FRELIMO\"" },
    },
    {
      question: "Which movement fought for the independence of Angola?",
      options: ["MPLA", "FRELIMO", "PAIGC", "SWAPO"],
      correct: 0,
      fact: "The MPLA fought the Portuguese and took power at independence in 1975, and a long civil war followed.",
      source: { label: "Encyclopaedia Britannica, \"MPLA\"" },
    },
    {
      question: "Which leader founded the PAIGC, which fought for Guinea-Bissau and Cape Verde?",
      options: ["Amilcar Cabral", "Agostinho Neto", "Samora Machel", "Eduardo Mondlane"],
      correct: 0,
      fact: "Amilcar Cabral led the PAIGC until he was assassinated in 1973, a year before Guinea-Bissau became independent.",
      source: { label: "Encyclopaedia Britannica, \"Amilcar Cabral\"" },
    },
    {
      question: "In which year did the Portuguese colonies in Africa become independent?",
      options: ["1975", "1960", "1980", "1962"],
      correct: 0,
      fact: "After the fall of the Portuguese dictatorship in 1974, Angola, Mozambique, Cape Verde, Guinea-Bissau and Sao Tome all became independent.",
      source: { label: "Encyclopaedia Britannica, \"Mozambique\"" },
    },
    {
      question: "Who was the first president of Angola at independence?",
      options: ["Agostinho Neto", "Samora Machel", "Amilcar Cabral", "Jose Eduardo dos Santos"],
      correct: 0,
      fact: "Agostinho Neto led the MPLA and became the first president of Angola in 1975.",
      source: { label: "Encyclopaedia Britannica, \"Agostinho Neto\"" },
    },
    {
      question: "Who was the first president of Mozambique at independence?",
      options: ["Samora Machel", "Agostinho Neto", "Joaquim Chissano", "Amilcar Cabral"],
      correct: 0,
      fact: "Samora Machel led FRELIMO and became the first president of Mozambique in 1975.",
      source: { label: "Encyclopaedia Britannica, \"Samora Machel\"" },
    },
    {
      question: "Which killing of peaceful demonstrators in northern Mozambique in 1960 turned many towards armed struggle?",
      options: ["The Mueda massacre", "The Sharpeville massacre", "The Soweto uprising", "The Thiaroye mutiny"],
      correct: 0,
      fact: "At Mueda in 1960 Portuguese troops fired on a peaceful gathering, and the memory of it pushed the north towards revolt.",
      source: { label: "Encyclopaedia Britannica, \"Mozambique\"" },
    },
  ],
  fr: {
    title: "L'Afrique portugaise",
    subtitle: "Kongo, Angola et Mozambique",
    region: "Afrique portugaise",
    questions: [
      {
        question: "Quel navigateur portugais a atteint l'embouchure du fleuve Congo en 1482 ?",
        options: ["Diogo Cao", "Vasco de Gama", "Bartolomeu Dias", "Ferdinand Magellan"],
        fact: "Diogo Cao a atteint le Congo en 1482 et a ouvert un long échange entre la cour du Kongo et Lisbonne.",
        source: "Encyclopaedia Britannica, notice « Diogo Cao »",
      },
      {
        question: "Quel royaume les envoyés portugais ont-ils atteint à l'embouchure du Congo ?",
        options: ["Le royaume du Kongo", "Le royaume du Ndongo", "Le royaume du Matamba", "Le royaume du Loango"],
        fact: "Le royaume du Kongo régnait sur le bas-Congo, et ses rois écrivaient au Portugal d'égal à égal.",
        source: "Encyclopaedia Britannica, notice « Kongo »",
      },
      {
        question: "Quel roi du Kongo a écrit au Portugal pour demander des maîtres, des prêtres et des artisans ?",
        options: ["Afonso Ier", "Nzinga a Nkuwu", "Alvaro Ier", "Garcia II"],
        fact: "Afonso Ier a demandé à Lisbonne des maîtres et des artisans et a écrit les ravages que la traite faisait à son royaume.",
        source: "Encyclopaedia Britannica, notice « Afonso I »",
      },
      {
        question: "Quelle reine du Ndongo et du Matamba a résisté aux Portugais pendant des décennies ?",
        options: ["Nzinga Mbande", "Kimpa Vita", "Mwadi", "Ndala"],
        fact: "Nzinga Mbande a combattu et négocié avec les Portugais pendant près de quarante ans, et son nom est devenu un titre.",
        source: "Encyclopaedia Britannica, notice « Nzinga »",
      },
      {
        question: "En quelle année les Portugais ont-ils fondé la colonie d'Angola à Luanda ?",
        options: ["1575", "1482", "1622", "1750"],
        fact: "Paulo Dias de Novais a fondé Luanda en 1575, et l'Angola est devenue une colonie bâtie sur la traite des captifs.",
        source: "Encyclopaedia Britannica, notice « Angola »",
      },
      {
        question: "Quelle ville portuaire est devenue la capitale de l'Angola portugais ?",
        options: ["Luanda", "Benguela", "Mbanza Kongo", "Lubango"],
        fact: "Luanda était la capitale et le principal port, et c'est de là que les captifs étaient embarqués vers l'Atlantique.",
        source: "Encyclopaedia Britannica, notice « Luanda »",
      },
      {
        question: "Quelle ville insulaire de l'océan Indien était la capitale de l'Afrique orientale portugaise ?",
        options: ["L'île de Mozambique", "Zanzibar", "Mombasa", "Sofala"],
        fact: "L'île de Mozambique est devenue le siège des Portugais en Afrique de l'Est, avec son hôpital, son église et son fort Sao Sebastiao.",
        source: "Liste du patrimoine mondial de l'UNESCO, Île de Mozambique",
      },
      {
        question: "Quel fort portugais de Mombasa est un site du patrimoine mondial ?",
        options: ["Fort Jesus", "Fort Sao Sebastiao", "Le château d'Elmina", "Fort Dauphin"],
        fact: "Fort Jesus a été bâti par les Portugais à Mombasa en 1593 et a changé de mains entre eux, les Omanais et les Britanniques.",
        source: "Liste du patrimoine mondial de l'UNESCO, Fort Jesus, Mombasa",
      },
      {
        question: "Quelle langue européenne est aujourd'hui la langue officielle de l'Angola et du Mozambique ?",
        options: ["Le portugais", "Le français", "L'anglais", "L'espagnol"],
        fact: "Le portugais est resté la langue officielle après l'indépendance, et il est parlé par des millions de personnes.",
        source: "Encyclopaedia Britannica, notice « Portuguese language »",
      },
      {
        question: "Quelle île du golfe de Guinée est devenue une colonie sucrière portugaise ?",
        options: ["Sao Tome", "Le Cap-Vert", "Bioko", "Principe"],
        fact: "Sao Tome a été plantée de canne à sucre travaillée par des Africains réduits en esclavage, l'une des premières économies de plantation de l'Atlantique.",
        source: "Encyclopaedia Britannica, notice « Sao Tome and Principe »",
      },
      {
        question: "Quel archipel de l'Atlantique a été peuplé par les Portugais au XVe siècle ?",
        options: ["Le Cap-Vert", "Les Canaries", "Les Comores", "Les Açores"],
        fact: "Le Cap-Vert a été peuplé par des familles portugaises et africaines, et sa culture creole est née de cette rencontre.",
        source: "Encyclopaedia Britannica, notice « Cape Verde »",
      },
      {
        question: "Quelle colonie continentale d'Afrique de l'Ouest est restée portugaise pendant cinq siècles ?",
        options: ["La Guinée-Bissau", "Le Ghana", "Le Sénégal", "La Gambie"],
        fact: "La Guinée-Bissau a été revendiquée par le Portugal depuis le XVe siècle et a conquis son indépendance en 1974.",
        source: "Encyclopaedia Britannica, notice « Guinea-Bissau »",
      },
      {
        question: "Comment les Portugais nommaient-ils les personnes de descendance africaine et européenne dans leurs colonies ?",
        options: ["Les Mesticos", "Les Assimilados", "Les Prazeros", "Les seuls Luso-Africains"],
        fact: "Les mesticos des villes portuaires parlaient portugais, commerçaient pour la couronne et détenaient souvent des terres.",
        source: "Encyclopaedia Britannica, notice « mestico »",
      },
      {
        question: "Quel système de domaines le long du Zambèze était accordé aux colons portugais ?",
        options: ["Les prazos", "Les engenhos", "Les fazendas", "Les capitanias"],
        fact: "Les prazos étaient de vastes concessions le long du Zambèze, tenues à condition de les peupler et transmises en famille.",
        source: "Encyclopaedia Britannica, notice « Mozambique »",
      },
      {
        question: "Quel mouvement a combattu pour l'indépendance du Mozambique ?",
        options: ["Le FRELIMO", "Le MPLA", "Le PAIGC", "L'UNITA"],
        fact: "Le FRELIMO a commencé la lutte armée en 1964 et a formé le premier gouvernement du Mozambique indépendant en 1975.",
        source: "Encyclopaedia Britannica, notice « FRELIMO »",
      },
      {
        question: "Quel mouvement a combattu pour l'indépendance de l'Angola ?",
        options: ["Le MPLA", "Le FRELIMO", "Le PAIGC", "La SWAPO"],
        fact: "Le MPLA a combattu les Portugais et a pris le pouvoir à l'indépendance en 1975, suivie d'une longue guerre civile.",
        source: "Encyclopaedia Britannica, notice « MPLA »",
      },
      {
        question: "Quel dirigeant a fondé le PAIGC, qui a combattu pour la Guinée-Bissau et le Cap-Vert ?",
        options: ["Amilcar Cabral", "Agostinho Neto", "Samora Machel", "Eduardo Mondlane"],
        fact: "Amilcar Cabral a dirigé le PAIGC jusqu'à son assassinat en 1973, un an avant l'indépendance de la Guinée-Bissau.",
        source: "Encyclopaedia Britannica, notice « Amilcar Cabral »",
      },
      {
        question: "En quelle année les colonies portugaises d'Afrique sont-elles devenues indépendantes ?",
        options: ["1975", "1960", "1980", "1962"],
        fact: "Après la chute de la dictature portugaise en 1974, l'Angola, le Mozambique, le Cap-Vert, la Guinée-Bissau et Sao Tome ont tous accédé à l'indépendance.",
        source: "Encyclopaedia Britannica, notice « Mozambique »",
      },
      {
        question: "Qui a été le premier président de l'Angola à l'indépendance ?",
        options: ["Agostinho Neto", "Samora Machel", "Amilcar Cabral", "Jose Eduardo dos Santos"],
        fact: "Agostinho Neto a dirigé le MPLA et est devenu le premier président de l'Angola en 1975.",
        source: "Encyclopaedia Britannica, notice « Agostinho Neto »",
      },
      {
        question: "Qui a été le premier président du Mozambique à l'indépendance ?",
        options: ["Samora Machel", "Agostinho Neto", "Joaquim Chissano", "Amilcar Cabral"],
        fact: "Samora Machel a dirigé le FRELIMO et est devenu le premier président du Mozambique en 1975.",
        source: "Encyclopaedia Britannica, notice « Samora Machel »",
      },
      {
        question: "Quel massacre de manifestants pacifiques dans le nord du Mozambique en 1960 a poussé beaucoup de gens vers la lutte armée ?",
        options: ["Le massacre de Mueda", "Le massacre de Sharpeville", "La révolte de Soweto", "La mutinerie de Thiaroye"],
        fact: "À Mueda en 1960, les troupes portugaises ont tiré sur un rassemblement pacifique, et son souvenir a poussé le nord vers la révolte.",
        source: "Encyclopaedia Britannica, notice « Mozambique »",
      },
    ],
  },
};
