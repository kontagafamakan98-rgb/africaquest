import {
  Landmark, Crown, Castle, Coins, Church, Swords, Shield, Flag,
  Footprints, Gem, Anchor, Hammer, Mountain, Scroll, Ship, Building2, Globe,
  Map, Scale, Rocket,
} from "lucide-react";
// Explicit extension: the file is also loaded directly by the test runner.
import { LEVELS_FR } from "./content-fr.js";

// The photographs live in their own module: the offline build needs the exact
// list of files to cache, and the tests check it without loading the whole game.
// Authors and licences are credited in the terms of service, section 13, and in
// the credits screen, which reads them back from here.
import {
  LEVEL_IMAGE_URLS,
  LEVEL_GALLERIES,
  photoCredit,
  photoLicence,
  photoSourcePage,
} from "../../lib/level-images.js";
import { servedPath } from "../../lib/base-path.js";
export { LEVEL_IMAGE_URLS };

// The badges and the difficulties are tables of their own, which carry nothing
// else: they sit outside this file because the map screen draws both and must
// not download the whole content of the game to do it. Re-exported here so the
// quiz and the statistics screens keep finding them on this module.
// The brief of the game - the levels, their card pictures and the third format -
// lives in level-summary.js, which the first screen reads instead of this file.
export { BADGES } from "./badges.js";
export { DIFFICULTIES } from "./difficulties.js";

/**
 * The photographs of one level, captioned and credited in the requested
 * language. The files, the authors and the licences are the same everywhere;
 * only the caption under each picture is translated.
 *
 * The lesson gallery draws the caption and the credit line and nothing else, but
 * the credits screen lists every picture of the game with its author, its
 * licence and the page it was taken from, so those three travel with the same
 * row rather than being looked up a second time from a list kept beside it.
 */
export function getLevelGallery(levelId, lang = "en") {
  return (LEVEL_GALLERIES[levelId] || []).map((photo) => ({
    file: servedPath(photo.file),
    caption: lang === "fr" ? photo.caption.fr || photo.caption.en : photo.caption.en,
    credit: photoCredit(photo, lang),
    author: photo.author || photo.collection,
    licence: photoLicence(photo, lang),
    source: photoSourcePage(photo),
  }));
}

export const LEVELS = [
  {
    id: 1,
    order: 2,
    era: "ancient",
    from: -3100,
    title: "Ancient Egypt",
    subtitle: "Land of the Pharaohs",
    icon: Landmark,
    region: "North Africa",
    color: "from-amber-400 to-yellow-500",
    questions: [
      {
        question: "Which river was essential to Ancient Egyptian civilization?",
        options: ["Amazon River", "Nile River", "Congo River", "Niger River"],
        correct: 1,
        fact: "The Nile River is the longest river in Africa and was the lifeline of Ancient Egypt!",
        source: { label: "Encyclopaedia Britannica, \"Ancient Egypt\"" },
      },
      {
        question: "What are the Great Pyramids of Giza?",
        options: ["Temples", "Tombs for Pharaohs", "Marketplaces", "Schools"],
        correct: 1,
        fact: "The pyramids were built as tombs for pharaohs and are over 4,500 years old!",
        source: { label: "UNESCO World Heritage List, Memphis and its Necropolis", url: "https://whc.unesco.org/en/list/86/" },
      },
      {
        question: "Who was the famous young pharaoh whose tomb was discovered in 1922?",
        options: ["Ramesses II", "Cleopatra", "Tutankhamun", "Khufu"],
        correct: 2,
        fact: "Tutankhamun became pharaoh at just 9 years old!",
        source: { label: "Encyclopaedia Britannica, \"Tutankhamun\"" },
      },
      {
        question: "What writing system did Ancient Egyptians use?",
        options: ["Alphabet", "Hieroglyphics", "Cuneiform", "Roman numerals"],
        correct: 1,
        fact: "Hieroglyphics used over 700 different symbols to write words and sounds!",
        source: { label: "Encyclopaedia Britannica, \"Ancient Egypt\"" },
      },
      {
        question: "What was the Sphinx?",
        options: ["A type of boat", "A mythical creature statue", "A weapon", "A musical instrument"],
        correct: 1,
        fact: "The Great Sphinx has the body of a lion and the head of a human!",
        source: { label: "Encyclopaedia Britannica, \"Great Sphinx of Giza\"" },
      },
      {
        question: "Which pharaoh is believed to have commissioned the Great Sphinx of Giza?",
        options: ["Khufu", "Khafre", "Menkaure", "Ramesses II"],
        correct: 1,
        fact: "The Sphinx is widely believed to bear the face of Pharaoh Khafre, who built the second pyramid at Giza!",
        source: { label: "Encyclopaedia Britannica, \"Great Sphinx of Giza\"" },
      },
      {
        question: "What is the ancient Egyptian word for pharaoh, meaning 'Great House'?",
        options: ["Ankh", "Per-aa", "Maat", "Djed"],
        correct: 1,
        fact: "'Per-aa' originally referred to the royal palace, not the ruler, it later evolved to mean the king himself!",
        source: { label: "Encyclopaedia Britannica, \"Ancient Egypt\"" },
      },
      {
        question: "In what year did the Rosetta Stone allow scholars to finally decode hieroglyphics?",
        options: ["1799", "1822", "1901", "1755"],
        correct: 1,
        fact: "Jean-François Champollion cracked the hieroglyphic code in 1822 using the Rosetta Stone, which had the same text in three scripts!",
        source: { label: "Encyclopaedia Britannica, \"Rosetta Stone\"" },
      },
      {
        question: "Which goddess of Ancient Egypt was associated with magic, motherhood, and was the sister-wife of Osiris?",
        options: ["Hathor", "Sekhmet", "Isis", "Nephthys"],
        correct: 2,
        fact: "Isis was one of the most important goddesses, her cult spread beyond Egypt into the Roman Empire!",
        source: { label: "Encyclopaedia Britannica, \"Ancient Egypt\"" },
      },
      {
        question: "The 'Book of the Dead' was a collection of magical spells used for what purpose?",
        options: ["Cursing enemies", "Guiding the soul through the afterlife", "Teaching children", "Predicting harvests"],
        correct: 1,
        fact: "The Book of the Dead contained over 200 spells to help the deceased navigate the dangers of the Duat (underworld)!",
        source: { label: "Encyclopaedia Britannica, \"Ancient Egypt\"" },
      },
      {
        question: "Which pharaoh is credited with building the Great Pyramid at Giza?",
        options: ["Khufu", "Ramesses II", "Akhenaten", "Tutankhamun"],
        correct: 0,
        fact: "The Great Pyramid of Khufu was the tallest human-made structure in the world for about 3,800 years!",
        source: { label: "UNESCO World Heritage List, Memphis and its Necropolis", url: "https://whc.unesco.org/en/list/86/" },
      },
      {
        question: "What writing material did the ancient Egyptians make from the papyrus plant?",
        options: ["Parchment", "Papyrus", "Clay tablets", "Bamboo strips"],
        correct: 1,
        fact: "Papyrus sheets were made by pressing strips of the plant stem together, and the word 'paper' comes from the name of this plant!",
        source: { label: "Encyclopaedia Britannica, \"Ancient Egypt\"" },
      },
      {
        question: "Who was the last active pharaoh of Ancient Egypt before it became a Roman province?",
        options: ["Nefertiti", "Hatshepsut", "Cleopatra VII", "Nefertari"],
        correct: 2,
        fact: "Cleopatra VII ruled until 30 BC; after her death Egypt became a province of the Roman Empire, ending nearly 3,000 years of native rule!",
        source: { label: "Encyclopaedia Britannica, \"Cleopatra\"" },
      },
      {
        question: "Which temple in Nubia was moved block by block in the 1960s to save it from Lake Nasser?",
        options: ["Abu Simbel", "Karnak", "The Sphinx", "The pyramid of Menkaure"],
        correct: 0,
        fact: "The temples of Abu Simbel were cut apart and rebuilt higher up in a UNESCO campaign, the largest archaeological rescue ever mounted.",
        source: { label: "UNESCO World Heritage List, Nubian Monuments from Abu Simbel to Philae", url: "https://whc.unesco.org/en/list/88/" },
      },
      {
        question: "Which woman ruled Egypt as pharaoh and sent a trading expedition to the land of Punt?",
        options: ["Hatshepsut", "Nefertiti", "Cleopatra VII", "Nefertari"],
        correct: 0,
        fact: "Hatshepsut ruled in the 15th century BC, was shown with a pharaoh's beard, and recorded her Punt expedition on the walls of her temple.",
        source: { label: "Encyclopaedia Britannica, \"Hatshepsut\"" },
      }
    ]
  },
  {
    id: 2,
    order: 3,
    era: "ancient",
    from: -1070,
    title: "Kingdom of Kush",
    subtitle: "Nubia's Golden Empire",
    icon: Crown,
    region: "Northeast Africa",
    color: "from-amber-600 to-orange-800",
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
        source: { label: "UNESCO World Heritage List, Gebel Barkal and the Sites of the Napatan Region", url: "https://whc.unesco.org/en/list/1073/" },
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
        source: { label: "UNESCO World Heritage List, Gebel Barkal and the Sites of the Napatan Region", url: "https://whc.unesco.org/en/list/1073/" },
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
      }
    ]
  },
  {
    id: 3,
    order: 10,
    era: "medieval",
    from: 1100,
    title: "Great Zimbabwe",
    subtitle: "City of Stone",
    icon: Castle,
    region: "Southern Africa",
    color: "from-emerald-400 to-green-600",
    questions: [
      {
        question: "What does 'Zimbabwe' mean?",
        options: ["Big river", "Great stone houses", "Tall mountains", "Green land"],
        correct: 1,
        fact: "Zimbabwe comes from 'dzimba dza mabwe' meaning 'great stone houses'!",
        source: { label: "Encyclopaedia Britannica, \"Great Zimbabwe\"" },
      },
      {
        question: "Great Zimbabwe was a center for trading what?",
        options: ["Only food", "Gold, ivory, and cattle", "Only weapons", "Only cloth"],
        correct: 1,
        fact: "Great Zimbabwe was a wealthy trading center connected to trade routes reaching China and India!",
        source: { label: "UNESCO World Heritage List, Great Zimbabwe National Monument", url: "https://whc.unesco.org/en/list/364/" },
      },
      {
        question: "When was Great Zimbabwe at its peak?",
        options: ["100 BC", "500 AD", "1100-1450 AD", "1800 AD"],
        correct: 2,
        fact: "At its peak, over 18,000 people lived in and around Great Zimbabwe!",
        source: { label: "UNESCO World Heritage List, Great Zimbabwe National Monument", url: "https://whc.unesco.org/en/list/364/" },
      },
      {
        question: "What was special about Great Zimbabwe's walls?",
        options: ["Made of wood", "Built without mortar", "Made of clay", "Painted gold"],
        correct: 1,
        fact: "The walls were built from granite blocks fitted together without any mortar, amazing engineering!",
        source: { label: "UNESCO World Heritage List, Great Zimbabwe National Monument", url: "https://whc.unesco.org/en/list/364/" },
      },
      {
        question: "What famous bird sculpture was found at Great Zimbabwe?",
        options: ["Eagle", "Zimbabwe Bird", "Flamingo", "Parrot"],
        correct: 1,
        fact: "The Zimbabwe Bird is now the national emblem of Zimbabwe and appears on their flag!",
        source: { label: "UNESCO World Heritage List, Great Zimbabwe National Monument", url: "https://whc.unesco.org/en/list/364/" },
      },
      {
        question: "The people who built Great Zimbabwe belonged to which ethnic group?",
        options: ["Zulu", "Shona", "Xhosa", "Ndebele"],
        correct: 1,
        fact: "The Shona people built and inhabited Great Zimbabwe, their descendants still live in Zimbabwe today!",
        source: { label: "Encyclopaedia Britannica, \"Shona\"" },
      },
      {
        question: "Chinese porcelain was found at Great Zimbabwe. What does this tell us?",
        options: ["Chinese people built it", "Zimbabwe traded across the Indian Ocean", "It was a gift from Egypt", "Porcelain was made locally"],
        correct: 1,
        fact: "Chinese and Persian artifacts at Great Zimbabwe prove it was connected to vast Indian Ocean trade networks!",
        source: { label: "UNESCO World Heritage List, Great Zimbabwe National Monument", url: "https://whc.unesco.org/en/list/364/" },
      },
      {
        question: "The 'Great Enclosure' at Great Zimbabwe is the largest ancient structure south of the Sahara. What was its wall height?",
        options: ["3 metres", "6 metres", "11 metres", "20 metres"],
        correct: 2,
        fact: "The Great Enclosure's walls reach up to 11 metres high and stretch over 250 metres, built with over a million granite blocks!",
        source: { label: "UNESCO World Heritage List, Great Zimbabwe National Monument", url: "https://whc.unesco.org/en/list/364/" },
      },
      {
        question: "European colonizers in the 19th century falsely claimed Great Zimbabwe was built by which civilization?",
        options: ["Romans", "Phoenicians or Queen of Sheba's people", "Greeks", "Persians"],
        correct: 1,
        fact: "Racist colonial theories denied African authorship of Great Zimbabwe, claiming Phoenicians or the Queen of Sheba built it, all debunked by archaeology!",
        source: { label: "UNESCO World Heritage List, Great Zimbabwe National Monument", url: "https://whc.unesco.org/en/list/364/" },
      },
      {
        question: "What was the Mutapa state, which succeeded Great Zimbabwe's power?",
        options: ["A kingdom in West Africa", "A successor Shona kingdom controlling gold trade", "An Egyptian colony", "A Swahili city-state"],
        correct: 1,
        fact: "The Kingdom of Mutapa (or Mwene Mutapa) emerged after Great Zimbabwe's decline and controlled the gold-rich plateau until Portuguese interference in the 1600s!",
        source: { label: "UNESCO, General History of Africa, volume IV", url: "https://www.unesco.org/en/general-history-africa" },
      },
      {
        question: "Inside the Great Enclosure stands a tall solid structure with no entrance. What shape is it?",
        options: ["A conical tower", "An obelisk", "A pyramid", "A colonnade"],
        correct: 0,
        fact: "The Great Enclosure's solid conical tower is about 9 metres tall, and its exact purpose is still debated by archaeologists!",
        source: { label: "UNESCO World Heritage List, Great Zimbabwe National Monument", url: "https://whc.unesco.org/en/list/364/" },
      },
      {
        question: "Around which period was Great Zimbabwe largely abandoned?",
        options: ["The early 1200s", "The mid 1400s", "The late 1700s", "The early 1900s"],
        correct: 1,
        fact: "By around 1450 the city was mostly abandoned as trade routes shifted and the surrounding land was exhausted; power moved to the Mutapa state!",
        source: { label: "UNESCO, General History of Africa, volume IV", url: "https://www.unesco.org/en/general-history-africa" },
      },
      {
        question: "The Zimbabwe Bird sculptures were carved from what kind of stone?",
        options: ["Soapstone", "Marble", "Granite", "Sandstone"],
        correct: 0,
        fact: "Eight soapstone birds were found at Great Zimbabwe, and they are among the most celebrated works of art from pre-colonial southern Africa!",
        source: { label: "UNESCO World Heritage List, Great Zimbabwe National Monument", url: "https://whc.unesco.org/en/list/364/" },
      },
      {
        question: "Which kingdom on the Limpopo, dated to about 1075 to 1220, came before Great Zimbabwe?",
        options: ["Mapungubwe", "Kilwa", "Djenne", "Sofala"],
        correct: 0,
        fact: "Mapungubwe traded ivory and gold with the coast and is seen as the first kingdom of the region that Great Zimbabwe would inherit from.",
        source: { label: "UNESCO World Heritage List, Mapungubwe Cultural Landscape", url: "https://whc.unesco.org/en/list/1099/" },
      },
      {
        question: "On what did the kings of Great Zimbabwe build their main residence?",
        options: ["A rocky hill, the Hill Complex", "A river island", "An artificial lake", "A sand dune"],
        correct: 0,
        fact: "The Hill Complex was the royal and ritual centre, and the Great Enclosure below it held the king's wives and the community's most important ceremonies.",
        source: { label: "UNESCO World Heritage List, Great Zimbabwe National Monument", url: "https://whc.unesco.org/en/list/364/" },
      }
    ]
  },
  {
    id: 4,
    order: 12,
    era: "medieval",
    from: 1235,
    title: "Mali Empire",
    subtitle: "Mansa Musa's Golden Age",
    icon: Coins,
    region: "West Africa",
    color: "from-yellow-500 to-orange-500",
    questions: [
      {
        question: "Who was the richest person in history from the Mali Empire?",
        options: ["Sundiata Keita", "Mansa Musa", "Askia Muhammad", "Shaka Zulu"],
        correct: 1,
        fact: "Mansa Musa was so rich that when he visited Cairo, he gave away so much gold it crashed the gold market for years!",
        source: { label: "Encyclopaedia Britannica, \"Musa I of Mali\"" },
      },
      {
        question: "What famous city of learning was part of the Mali Empire?",
        options: ["Cairo", "Timbuktu", "Cape Town", "Nairobi"],
        correct: 1,
        fact: "Timbuktu had one of the world's oldest universities and housed hundreds of thousands of manuscripts!",
        source: { label: "UNESCO World Heritage List, Timbuktu", url: "https://whc.unesco.org/en/list/119/" },
      },
      {
        question: "Who founded the Mali Empire?",
        options: ["Mansa Musa", "Sundiata Keita", "Ibn Battuta", "Askia the Great"],
        correct: 1,
        fact: "Sundiata Keita is known as the 'Lion King' of Mali and his story inspired many legends!",
        source: { label: "Encyclopaedia Britannica, \"Sundiata Keita\"" },
      },
      {
        question: "What religion did Mansa Musa follow?",
        options: ["Christianity", "Islam", "Traditional African religions", "Buddhism"],
        correct: 1,
        fact: "Mansa Musa made a famous pilgrimage to Mecca in 1324 with thousands of followers!",
        source: { label: "Encyclopaedia Britannica, \"Musa I of Mali\"" },
      },
      {
        question: "The Mali Empire was rich because of trade in what two things?",
        options: ["Fish and wood", "Gold and salt", "Iron and copper", "Silk and spices"],
        correct: 1,
        fact: "Salt was so valuable in West Africa that it was sometimes worth its weight in gold!",
        source: { label: "Encyclopaedia Britannica, \"Mali empire\"" },
      },
      {
        question: "Mansa Musa's pilgrimage to Mecca in 1324 included an enormous entourage. Approximately how many people accompanied him?",
        options: ["1,000", "10,000", "60,000", "500,000"],
        correct: 2,
        fact: "Mansa Musa traveled with an estimated 60,000 people including soldiers, servants, and 12,000 enslaved people carrying gold!",
        source: { label: "Encyclopaedia Britannica, \"Musa I of Mali\"" },
      },
      {
        question: "The University of Sankore in Timbuktu could accommodate how many students at its peak?",
        options: ["500", "5,000", "25,000", "100,000"],
        correct: 2,
        fact: "Sankore University had up to 25,000 students, it was one of the largest universities in the medieval world!",
        source: { label: "UNESCO World Heritage List, Timbuktu", url: "https://whc.unesco.org/en/list/119/" },
      },
      {
        question: "The epic of Sundiata Keita describes his childhood disability. What was it?",
        options: ["He was blind", "He could not walk until age 7", "He could not speak", "He was deaf"],
        correct: 1,
        fact: "According to legend, Sundiata could not walk until age 7, then rose to become the greatest warrior-king of West Africa!",
        source: { label: "Encyclopaedia Britannica, \"Sundiata Keita\"" },
      },
      {
        question: "Which trans-Saharan trade route connected the Mali Empire to North Africa and the Mediterranean world?",
        options: ["The Silk Road", "The Gold Road through Sijilmasa", "The Incense Route", "The Amber Road"],
        correct: 1,
        fact: "The route through Sijilmasa (Morocco) was the main artery connecting Mali's gold fields to Mediterranean merchants!",
        source: { label: "Encyclopaedia Britannica, \"Mali empire\"" },
      },
      {
        question: "Ibn Battuta, who visited the Mali Empire in 1352, noted what unusual practice at the Malian court?",
        options: ["Everyone wore masks", "Subjects covered themselves in dust when greeting the king", "The king ate alone in public", "Women ran all the markets"],
        correct: 1,
        fact: "Ibn Battuta described subjects prostrating themselves and throwing dust on their heads as a sign of respect before the Mali king!",
        source: { label: "Encyclopaedia Britannica, \"Ibn Battuta\"" },
      },
      {
        question: "Which mosque, built in Timbuktu under Mali rule, is still standing and is a UNESCO World Heritage site?",
        options: ["Djinguereber Mosque", "Great Mosque of Kairouan", "Al-Azhar Mosque", "Blue Mosque"],
        correct: 0,
        fact: "The Djinguereber Mosque was built around 1327 and is one of Timbuktu's most famous landmarks, made largely of mud brick!",
        source: { label: "UNESCO World Heritage List, Timbuktu", url: "https://whc.unesco.org/en/list/119/" },
      },
      {
        question: "What royal title did the rulers of Mali use, meaning 'king of kings'?",
        options: ["Negus", "Mansa", "Sultan", "Pharaoh"],
        correct: 1,
        fact: "The Mali rulers were called Mansa, meaning king of kings; Mansa Musa is the most famous of them!",
        source: { label: "Encyclopaedia Britannica, \"Mali empire\"" },
      },
      {
        question: "Which Saharan settlement, famous for its salt mines, was a key trade partner of the Mali Empire?",
        options: ["Taghaza", "Axum", "Zanzibar", "Djenne"],
        correct: 0,
        fact: "Salt from the mines of Taghaza travelled south by camel caravan and was often traded weight for weight with gold!",
        source: { label: "Encyclopaedia Britannica, \"Mali empire\"" },
      },
      {
        question: "Which town was the capital of the Mali Empire, the seat of the mansa?",
        options: ["Niani", "Timbuktu", "Gao", "Djenne"],
        correct: 0,
        fact: "Niani, on the upper Niger, was the political capital, while Timbuktu grew into the empire's great centre of trade and scholarship.",
        source: { label: "Encyclopaedia Britannica, \"Mali empire\"" },
      },
      {
        question: "What did Mansa Musa's spending do to the price of gold in Cairo?",
        options: ["It lowered it for years", "It doubled it", "It changed nothing", "It made gold illegal"],
        correct: 0,
        fact: "Cairo's chroniclers complained that so much gold was given away in 1324 that its value fell and took more than a decade to recover.",
        source: { label: "Encyclopaedia Britannica, \"Musa I of Mali\"" },
      }
    ]
  },
  {
    id: 5,
    order: 6,
    era: "ancient",
    from: 100,
    title: "Kingdom of Axum",
    subtitle: "Ethiopia's Ancient Power",
    icon: Church,
    region: "East Africa",
    color: "from-red-500 to-orange-600",
    questions: [
      {
        question: "Where was the Kingdom of Axum located?",
        options: ["West Africa", "Modern-day Ethiopia and Eritrea", "South Africa", "North Africa"],
        correct: 1,
        fact: "Axum was one of the most powerful kingdoms in the ancient world!",
        source: { label: "Encyclopaedia Britannica, \"Aksum\"" },
      },
      {
        question: "What tall stone monuments did Axum build?",
        options: ["Pyramids", "Obelisks (Stelae)", "Castles", "Bridges"],
        correct: 1,
        fact: "The tallest Axumite stela was 33 meters tall, taller than most buildings!",
        source: { label: "UNESCO World Heritage List, Aksum", url: "https://whc.unesco.org/en/list/15/" },
      },
      {
        question: "Axum was one of the first kingdoms to adopt which religion?",
        options: ["Islam", "Buddhism", "Christianity", "Hinduism"],
        correct: 2,
        fact: "Axum became Christian in the 4th century, making it one of the first Christian nations!",
        source: { label: "Encyclopaedia Britannica, \"Ezana\"" },
      },
      {
        question: "What important trade item did Axum export?",
        options: ["Diamonds", "Ivory", "Silver", "Rubber"],
        correct: 1,
        fact: "Axum traded ivory, gold, and spices with Rome, India, and Arabia!",
        source: { label: "Encyclopaedia Britannica, \"Aksum\"" },
      },
      {
        question: "Axum created its own system of what?",
        options: ["Coins", "Computers", "Cars", "Telephones"],
        correct: 0,
        fact: "Axum was one of the first African kingdoms to mint its own coins!",
        source: { label: "Encyclopaedia Britannica, \"Aksum\"" },
      },
      {
        question: "The Axumite king who converted to Christianity in the 4th century was:",
        options: ["Ezana", "Kaleb", "Gadarat", "Zoscales"],
        correct: 0,
        fact: "King Ezana of Axum converted to Christianity around 330 AD and inscribed the cross on Axumite coins!",
        source: { label: "Encyclopaedia Britannica, \"Ezana\"" },
      },
      {
        question: "Axum's port city, essential for its Indian Ocean trade, was called:",
        options: ["Mogadishu", "Adulis", "Zanzibar", "Mombasa"],
        correct: 1,
        fact: "Adulis on the Red Sea was Axum's main port, making it a hub connecting Africa, Arabia, India, and the Roman Empire!",
        source: { label: "Encyclopaedia Britannica, \"Aksum\"" },
      },
      {
        question: "The Axumites are traditionally believed to have been the guardians of which famous religious relic?",
        options: ["The Holy Grail", "The Ark of the Covenant", "The Shroud of Turin", "The True Cross"],
        correct: 1,
        fact: "Ethiopian tradition holds that the Ark of the Covenant was brought to Axum by Menelik I, son of King Solomon and the Queen of Sheba!",
        source: { label: "UNESCO World Heritage List, Aksum", url: "https://whc.unesco.org/en/list/15/" },
      },
      {
        question: "Which ancient script used exclusively in Ethiopia and Eritrea was developed from the Axumite writing system?",
        options: ["Arabic", "Ge'ez (Ethiopic)", "Coptic", "Amharic alphabet"],
        correct: 1,
        fact: "Ge'ez is one of the oldest continuously used writing systems in the world, still used today in Ethiopian Orthodox Church liturgy!",
        source: { label: "Encyclopaedia Britannica, \"Ge'ez language\"" },
      },
      {
        question: "Axum's King Kaleb invaded the Arabian Peninsula in 525 AD to defend which persecuted group?",
        options: ["Muslims", "Jewish traders", "Christians in Yemen", "Buddhist monks"],
        correct: 2,
        fact: "King Kaleb crossed the Red Sea to defeat the Yemeni king Dhu Nuwas who was massacring Christians, an extraordinary projection of African military power!",
        source: { label: "Encyclopaedia Britannica, \"Aksum\"" },
      },
      {
        question: "The tallest and most famous Axumite stelae were carved from single blocks of what stone?",
        options: ["Granite", "Marble", "Limestone", "Basalt"],
        correct: 0,
        fact: "The Obelisk of Axum stands about 24 metres tall and was carved from a single block of granite, while a larger 33 metre stela lies broken on the ground!",
        source: { label: "UNESCO World Heritage List, Aksum", url: "https://whc.unesco.org/en/list/15/" },
      },
      {
        question: "What title did the kings of Axum use, meaning 'king' in Ge'ez?",
        options: ["Mansa", "Negus", "Sultan", "Pharaoh"],
        correct: 1,
        fact: "The Axumite kings were called Negus, and the expanded title 'Negusa Nagast' meant king of kings!",
        source: { label: "Encyclopaedia Britannica, \"Aksum\"" },
      },
      {
        question: "The rise of which religion in Arabia in the 7th century helped weaken Axum's control of Red Sea trade?",
        options: ["Islam", "Buddhism", "Hinduism", "Judaism"],
        correct: 0,
        fact: "The spread of Islam after the 7th century shifted trade networks across the Red Sea, and Axum's power declined as a result!",
        source: { label: "Encyclopaedia Britannica, \"Aksum\"" },
      },
      {
        question: "Whose kingdom did Axum defeat in the 4th century to open the Nile trade route?",
        options: ["Kush", "Rome", "Persia", "Kanem"],
        correct: 0,
        fact: "The Axumite army destroyed the kingdom of Kush at Meroe around 350, an event recorded on an inscription at Aksum.",
        source: { label: "Encyclopaedia Britannica, \"Aksum\"" },
      },
      {
        question: "From which script, used in southern Arabia, did the Ge'ez script of Axum develop?",
        options: ["The South Arabian script", "Latin", "Coptic", "Greek"],
        correct: 0,
        fact: "Ge'ez grew out of the South Arabian writing of the traders who crossed the Red Sea, and it is still read in Ethiopian churches today.",
        source: { label: "Encyclopaedia Britannica, \"Ge'ez language\"" },
      }
    ]
  },
  {
    id: 6,
    order: 14,
    era: "medieval",
    from: 1464,
    title: "Songhai Empire",
    subtitle: "Africa's Largest Empire",
    icon: Swords,
    region: "West Africa",
    color: "from-teal-400 to-cyan-600",
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
        source: { label: "UNESCO World Heritage List, Tomb of Askia", url: "https://whc.unesco.org/en/list/1139/" },
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
      }
    ]
  },
  {
    id: 7,
    order: 16,
    era: "modern",
    from: 1816,
    title: "Zulu Kingdom",
    subtitle: "Warriors of the South",
    icon: Shield,
    region: "Southern Africa",
    color: "from-orange-400 to-red-500",
    questions: [
      {
        question: "Who was the famous leader who united the Zulu people?",
        options: ["Nelson Mandela", "Shaka Zulu", "Mansa Musa", "Haile Selassie"],
        correct: 1,
        fact: "Shaka Zulu transformed a small clan into one of the most powerful nations in southern Africa!",
        source: { label: "Encyclopaedia Britannica, \"Shaka\"" },
      },
      {
        question: "What fighting formation did Shaka Zulu create?",
        options: ["Circle formation", "Bull horn formation", "Square formation", "Line formation"],
        correct: 1,
        fact: "The 'horns of the buffalo' formation surrounded enemies from both sides!",
        source: { label: "Encyclopaedia Britannica, \"Shaka\"" },
      },
      {
        question: "Where was the Zulu Kingdom located?",
        options: ["Nigeria", "Kenya", "South Africa", "Egypt"],
        correct: 2,
        fact: "The Zulu Kingdom was in what is now KwaZulu-Natal province in South Africa!",
        source: { label: "South African History Online, The Zulu Kingdom", url: "https://sahistory.org.za/article/zulu-kingdom-and-colony-natal" },
      },
      {
        question: "What weapon was most associated with Zulu warriors?",
        options: ["Bow and arrow", "Short stabbing spear (iklwa)", "Sword", "Cannon"],
        correct: 1,
        fact: "The iklwa spear was named after the sound it made, Shaka invented this close-combat weapon!",
        source: { label: "Encyclopaedia Britannica, \"Shaka\"" },
      },
      {
        question: "The Zulu famously defeated the British in which 1879 battle?",
        options: ["Battle of Waterloo", "Battle of Isandlwana", "Battle of Hastings", "Battle of Adwa"],
        correct: 1,
        fact: "At Isandlwana, 20,000 Zulu warriors defeated a well-armed British force, a stunning victory!",
        source: { label: "Encyclopaedia Britannica, \"Battle of Isandlwana\"" },
      },
      {
        question: "The same day as Isandlwana, the British successfully defended which small outpost against 4,000 Zulu warriors?",
        options: ["Ulundi", "Rorke's Drift", "Durban", "Pretoria"],
        correct: 1,
        fact: "At Rorke's Drift, just 150 British soldiers held off 4,000 Zulu warriors, 11 Victoria Crosses were awarded, the most for any single engagement!",
        source: { label: "Encyclopaedia Britannica, \"Battle of Rorke's Drift\"" },
      },
      {
        question: "Shaka Zulu abolished a traditional Zulu custom requiring warriors to do what before they could marry?",
        options: ["Build their own home", "Pay cattle to the bride's father", "Kill a lion", "Serve 10 years in the army"],
        correct: 3,
        fact: "Shaka reformed the age-regiment system, warriors could not marry until he gave permission, keeping them loyal to the state rather than families!",
        source: { label: "Encyclopaedia Britannica, \"Shaka\"" },
      },
      {
        question: "What was the name of the Zulu king who fought the British at the Anglo-Zulu War in 1879?",
        options: ["Shaka", "Dingane", "Cetshwayo", "Mpande"],
        correct: 2,
        fact: "King Cetshwayo kaMpande led the Zulu nation during the 1879 war, he was later captured, exiled to London, and met Queen Victoria!",
        source: { label: "Encyclopaedia Britannica, \"Cetshwayo\"" },
      },
      {
        question: "The 'Mfecane' (crushing/scattering) refers to a period of widespread chaos triggered partly by Zulu expansion. Which regions were most affected?",
        options: ["North Africa and Egypt", "Southern and Central Africa", "East Africa coast", "West Africa"],
        correct: 1,
        fact: "The Mfecane displaced millions across southern and central Africa in the 1820s-1830s, creating new kingdoms like the Sotho nation and Swazi kingdom!",
        source: { label: "Encyclopaedia Britannica, \"Mfecane\"" },
      },
      {
        question: "Shaka's assassination in 1828 was carried out by whom?",
        options: ["British soldiers", "His half-brothers Dingane and Mhlangana", "A rival Zulu chief", "His personal bodyguard"],
        correct: 1,
        fact: "Shaka was stabbed to death by his half-brothers Dingane and Mhlangana, with the help of his personal servant, ending his 12-year reign!",
        source: { label: "Encyclopaedia Britannica, \"Shaka\"" },
      },
      {
        question: "Shaka organized his warriors into age-based regiments. What were these regiments called?",
        options: ["Amabutho", "Induna", "Isibongo", "Kraal"],
        correct: 0,
        fact: "The amabutho system grouped young men by age and trained them as full-time soldiers loyal to the king rather than to local chiefs!",
        source: { label: "Encyclopaedia Britannica, \"Shaka\"" },
      },
      {
        question: "Who succeeded Shaka as king of the Zulu after his assassination in 1828?",
        options: ["Dingane", "Mpande", "Cetshwayo", "Senzangakhona"],
        correct: 0,
        fact: "Dingane ruled from 1828 until 1840, when he was defeated by his half-brother Mpande and the Boers!",
        source: { label: "South African History Online, The Zulu Kingdom", url: "https://sahistory.org.za/article/zulu-kingdom-and-colony-natal" },
      },
      {
        question: "What happened to Zululand after the Anglo-Zulu War of 1879?",
        options: ["It remained fully independent", "It was divided into chiefdoms and later annexed by Britain", "It became part of Mozambique", "It was returned to Shaka's heirs"],
        correct: 1,
        fact: "Britain split Zululand into thirteen chiefdoms after 1879 and finally annexed it in 1897, ending Zulu independence!",
        source: { label: "South African History Online, The Zulu Kingdom", url: "https://sahistory.org.za/article/zulu-kingdom-and-colony-natal" },
      },
      {
        question: "Who was Shaka's father, the chief of the small Zulu clan before him?",
        options: ["Senzangakhona", "Dingane", "Mpande", "Cetshwayo"],
        correct: 0,
        fact: "Shaka was the son of Senzangakhona, and it was from that single small clan that he built a kingdom that shook southern Africa.",
        source: { label: "Encyclopaedia Britannica, \"Shaka\"" },
      },
      {
        question: "Which battle in 1838 did the Boers win against the Zulu at the Ncome river?",
        options: ["The Battle of Blood River", "The Battle of Ulundi", "The Battle of Isandlwana", "The Battle of Adwa"],
        correct: 0,
        fact: "At Blood River, a Boer laager held off a far larger Zulu force, and the defeat led Dingane to lose his throne to Mpande.",
        source: { label: "Encyclopaedia Britannica, \"Battle of Blood River\"" },
      }
    ]
  },
  {
    id: 8,
    order: 19,
    era: "contemporary",
    from: 1951,
    title: "African Independence",
    subtitle: "Freedom Across the Continent",
    icon: Flag,
    region: "All of Africa",
    color: "from-green-500 to-emerald-600",
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
        source: { label: "UNESCO, General History of Africa, volume VIII", url: "https://www.unesco.org/en/general-history-africa" },
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
      }
    ]
  },
  // --- The timeline, oldest first: the order field drives the map, and the
  // from field is the year the period opens on (negative numbers are BC).
  {
    id: 9,
    order: 1,
    era: "origins",
    from: -300000,
    title: "Human Origins",
    subtitle: "Africa, cradle of humankind",
    icon: Footprints,
    region: "Whole of Africa",
    color: "from-stone-500 to-amber-800",
    questions: [
      {
        question: "In which country were some of the oldest fossils of our own species, Homo sapiens, found?",
        options: ["Egypt", "Ethiopia", "Kenya", "Morocco"],
        correct: 1,
        fact: "The Omo Kibish remains in Ethiopia are about 230,000 years old, which makes them among the oldest known fossils of our species.",
        source: { label: "Encyclopaedia Britannica, \"human evolution\"" },
      },
      {
        question: "Which site in Morocco has yielded Homo sapiens fossils around 300,000 years old?",
        options: ["Jebel Irhoud", "Olduvai Gorge", "Blombos Cave", "Sterkfontein"],
        correct: 0,
        fact: "Jebel Irhoud pushed the origin of our species back to about 300,000 years and showed that early Homo sapiens lived all over the continent, not in one corner.",
        source: { label: "Encyclopaedia Britannica, \"human evolution\"" },
      },
      {
        question: "Which gorge in Tanzania, explored by Louis and Mary Leakey, is famous for early human fossils and stone tools?",
        options: ["Olduvai Gorge", "The Kalahari Basin", "The Nile Delta", "Lake Chad"],
        correct: 0,
        fact: "Olduvai Gorge gave its name to some of the earliest stone tools and hominin fossils ever found.",
        source: { label: "Encyclopaedia Britannica, \"Olduvai Gorge\"" },
      },
      {
        question: "What is the name of the oldest known stone tool tradition, first identified at Olduvai Gorge?",
        options: ["Oldowan", "Acheulean", "Neolithic", "Iron age"],
        correct: 0,
        fact: "Oldowan tools were simple flakes struck from a stone core more than 2.5 million years ago, long before our own species appeared.",
        source: { label: "Encyclopaedia Britannica, \"Olduvai Gorge\"" },
      },
      {
        question: "What did archaeologists find in Blombos Cave in South Africa that shows early symbolic thinking?",
        options: ["A stone pyramid", "A block of ochre engraved with a deliberate pattern", "A written alphabet", "A bronze statue"],
        correct: 1,
        fact: "The engraved ochre of Blombos Cave is about 77,000 years old and counts as one of the oldest known abstract designs in the world.",
        source: { label: "Encyclopaedia Britannica, \"human evolution\"" },
      },
      {
        question: "The rock paintings of the San, such as those of Tsodilo in Botswana, mostly show what?",
        options: ["Cities and palaces", "Animals, hunters and dancers", "Kings and queens", "Ships and harbours"],
        correct: 1,
        fact: "Tsodilo holds more than 4,500 paintings, and people have used the site for at least 100,000 years.",
        source: { label: "UNESCO World Heritage List, Tsodilo", url: "https://whc.unesco.org/en/list/1021/" },
      },
      {
        question: "Which of these food plants was first domesticated by farmers in Africa?",
        options: ["Wheat", "Barley", "Pearl millet", "Maize"],
        correct: 2,
        fact: "Pearl millet, sorghum, yams, teff and African rice were all domesticated in Africa thousands of years before wheat or maize reached the continent.",
        source: { label: "UNESCO, General History of Africa, volume I", url: "https://www.unesco.org/en/general-history-africa" },
      },
      {
        question: "What had people in parts of Africa already mastered more than 2,000 years ago?",
        options: ["Smelting iron", "Printing books", "Building steam engines", "Navigating with compasses"],
        correct: 0,
        fact: "Iron furnaces were working in the Great Lakes region by about 2000 BC and in West Africa by 500 BC, and iron tools changed farming and warfare.",
        source: { label: "UNESCO, General History of Africa, volume I", url: "https://www.unesco.org/en/general-history-africa" },
      },
      {
        question: "Which early human, whose name means 'handy man', is linked to the first stone tools?",
        options: ["Homo habilis", "Homo erectus", "Australopithecus afarensis", "Homo neanderthalensis"],
        correct: 0,
        fact: "Homo habilis lived in East Africa between about 2.4 and 1.4 million years ago, and its name was given for the tools found near its bones.",
        source: { label: "Encyclopaedia Britannica, \"Homo habilis\"" },
      },
      {
        question: "Whose 3.2-million-year-old skeleton, found in Ethiopia in 1974, is known as Lucy?",
        options: ["Australopithecus afarensis", "Homo sapiens", "Homo erectus", "Paranthropus"],
        correct: 0,
        fact: "Lucy belongs to Australopithecus afarensis, and her bones show a creature that walked upright long before our own species appeared.",
        source: { label: "Encyclopaedia Britannica, \"Lucy\"" },
      }
    ]
  },
  {
    id: 10,
    order: 5,
    era: "ancient",
    from: -814,
    title: "Carthage and Ancient North Africa",
    subtitle: "Rome's rival across the sea",
    icon: Anchor,
    region: "North Africa",
    color: "from-sky-500 to-blue-700",
    questions: [
      {
        question: "Which people from the eastern Mediterranean founded Carthage in the 9th century BC?",
        options: ["Greeks", "Phoenicians", "Romans", "Persians"],
        correct: 1,
        fact: "Carthage was founded by traders from Tyre, in today's Lebanon, and grew into the greatest sea power of the western Mediterranean.",
        source: { label: "Encyclopaedia Britannica, \"Carthage\"" },
      },
      {
        question: "Which Carthaginian general crossed the Alps with war elephants to attack Rome in 218 BC?",
        options: ["Hannibal", "Scipio", "Hamilcar", "Masinissa"],
        correct: 0,
        fact: "Hannibal marched from Spain through the Alps and won battle after battle in Italy, but he never managed to take Rome itself.",
        source: { label: "Encyclopaedia Britannica, \"Hannibal\"" },
      },
      {
        question: "In which year did Rome destroy Carthage at the end of the Punic Wars?",
        options: ["146 BC", "100 BC", "44 BC", "476 AD"],
        correct: 0,
        fact: "Rome razed the city in 146 BC and sold its inhabitants into slavery, then rebuilt a Roman Carthage on the same site a century later.",
        source: { label: "UNESCO World Heritage List, Archaeological Site of Carthage", url: "https://whc.unesco.org/en/list/37/" },
      },
      {
        question: "Which king of Numidia united the Berber tribes and ruled for more than fifty years?",
        options: ["Masinissa", "Jugurtha", "Septimius Severus", "Augustine"],
        correct: 0,
        fact: "Masinissa first fought Carthage, then allied with Rome, and his kingdom produced much of the grain that fed the empire.",
        source: { label: "Encyclopaedia Britannica, \"Masinissa\"" },
      },
      {
        question: "Which Numidian king fought a long war against Rome between 111 and 105 BC?",
        options: ["Jugurtha", "Masinissa", "Hannibal", "Syphax"],
        correct: 0,
        fact: "Jugurtha's guerrilla war forced Rome to reform its army, and the historian Sallust wrote a famous book about the conflict.",
        source: { label: "Encyclopaedia Britannica, \"Jugurtha\"" },
      },
      {
        question: "Which Roman emperor, born in Leptis Magna in today's Libya, ruled from 193 to 211?",
        options: ["Septimius Severus", "Trajan", "Hadrian", "Augustus"],
        correct: 0,
        fact: "Septimius Severus was of Berber and Italian descent and remains the only African to have ruled the whole Roman Empire.",
        source: { label: "Encyclopaedia Britannica, \"Septimius Severus\"" },
      },
      {
        question: "Which Berber bishop of North Africa wrote The City of God and is one of the most influential Christian writers?",
        options: ["Augustine", "Tertullian", "Cyprian", "Athanasius"],
        correct: 0,
        fact: "Augustine was bishop of Hippo, in today's Algeria, and he died while the Vandals were besieging the city in 430.",
        source: { label: "Encyclopaedia Britannica, \"St. Augustine\"" },
      },
      {
        question: "What do we call the indigenous peoples of North Africa, whose languages are still spoken today?",
        options: ["The Amazigh, also called Berbers", "The Swahili", "The Bantu", "The Oromo"],
        correct: 0,
        fact: "Amazigh means free people, and Amazigh languages are spoken from the Siwa oasis in Egypt to the Atlas mountains and the Sahel.",
        source: { label: "Encyclopaedia Britannica, \"Berber\"" },
      },
      {
        question: "What was the main language of Carthage and its trading colonies?",
        options: ["Punic", "Latin", "Greek", "Coptic"],
        correct: 0,
        fact: "Punic was a Phoenician language, and it survived in North Africa for centuries after Rome destroyed the city.",
        source: { label: "Encyclopaedia Britannica, \"Punic language\"" },
      },
      {
        question: "Which queen of Carthage is remembered in Virgil's Aeneid as guiding the city's founding?",
        options: ["Dido", "Cleopatra", "Zenobia", "Amanirenas"],
        correct: 0,
        fact: "Dido, also called Elissa, was said to have led the founding of Carthage, and her story became one of the best known of the ancient world.",
        source: { label: "Encyclopaedia Britannica, \"Dido\"" },
      }
    ]
  },
  {
    id: 11,
    order: 4,
    era: "ancient",
    from: -1000,
    title: "The Iron Age",
    subtitle: "Nok terracottas and the Bantu expansion",
    icon: Hammer,
    region: "Central and Southern Africa",
    color: "from-orange-700 to-red-800",
    questions: [
      {
        question: "In which country were the Nok terracotta sculptures discovered?",
        options: ["Nigeria", "Kenya", "Ghana", "Sudan"],
        correct: 0,
        fact: "The Nok figures were found on the Jos Plateau in central Nigeria and are between 2,000 and 3,000 years old.",
        source: { label: "Encyclopaedia Britannica, \"Nok culture\"" },
      },
      {
        question: "What did the Nok artists model in clay?",
        options: ["Large human heads and figures", "Boats and oars", "Musical instruments", "Clay coins"],
        correct: 0,
        fact: "The heads wear elaborate hairstyles and jewellery, which tells us that Nok society already had rank and skilled craftsmen.",
        source: { label: "Encyclopaedia Britannica, \"Nok culture\"" },
      },
      {
        question: "What else were the Nok people among the first in West Africa to do?",
        options: ["Smelt iron", "Write books", "Build stone cities", "Sail to India"],
        correct: 0,
        fact: "An iron furnace found at Taruga, on the Jos Plateau, was working around 500 BC, one of the oldest known in West Africa.",
        source: { label: "Encyclopaedia Britannica, \"Nok culture\"" },
      },
      {
        question: "From where did the Bantu-speaking peoples begin to spread about 3,000 years ago?",
        options: ["The borderlands of Nigeria and Cameroon", "The Sahara Desert", "The Nile Delta", "The Ethiopian highlands"],
        correct: 0,
        fact: "From that homeland, farming communities moved south and east for nearly two thousand years, carrying their languages with them.",
        source: { label: "Encyclopaedia Britannica, \"Bantu peoples\"" },
      },
      {
        question: "Which two innovations helped Bantu-speaking farmers spread across the continent?",
        options: ["Iron tools and farming", "Gunpowder and horses", "Sailing ships and writing", "Coins and paved roads"],
        correct: 0,
        fact: "Iron axes cleared the forest and iron hoes fed more people, so villages grew, split, and settled further away.",
        source: { label: "Encyclopaedia Britannica, \"Bantu peoples\"" },
      },
      {
        question: "About how many people speak a Bantu language today?",
        options: ["About three million", "About thirty million", "More than three hundred million", "More than three billion"],
        correct: 2,
        fact: "Swahili, Zulu, Shona, Lingala and Kikuyu are all Bantu languages, spoken from Cameroon to South Africa.",
        source: { label: "Encyclopaedia Britannica, \"Bantu peoples\"" },
      },
      {
        question: "By about which date had farming communities speaking Bantu languages reached southern Africa?",
        options: ["300 AD", "1500 AD", "500 BC", "1900 AD"],
        correct: 0,
        fact: "Iron-using farmers were settling south of the Limpopo by about 300 AD, more than a thousand years before the first European ships arrived.",
        source: { label: "UNESCO, General History of Africa, volume II", url: "https://www.unesco.org/en/general-history-africa" },
      },
      {
        question: "Which hunter-gatherer peoples were already living in southern Africa when the farmers arrived?",
        options: ["The San and the Khoikhoi", "The Zulu and the Xhosa", "The Oromo and the Somali", "The Tuareg and the Fulani"],
        correct: 0,
        fact: "The San and the Khoikhoi speak non-Bantu languages, and their rock art and place names are part of the oldest heritage of the region.",
        source: { label: "Encyclopaedia Britannica, \"San\"" },
      },
      {
        question: "Which language family do most languages of central and southern Africa belong to?",
        options: ["Niger-Congo", "Afroasiatic", "Khoisan", "Indo-European"],
        correct: 0,
        fact: "The Bantu languages are one branch of the Niger-Congo family, and the expansion of their speakers spread them across half the continent.",
        source: { label: "Encyclopaedia Britannica, \"Bantu peoples\"" },
      },
      {
        question: "Which food crop, carried across the Indian Ocean, became a staple of Bantu farming?",
        options: ["Bananas", "Olives", "Dates", "Grapes"],
        correct: 0,
        fact: "Bananas reached Africa from Southeast Asia through Madagascar and the East African coast, and they fed farming villages as they spread.",
        source: { label: "UNESCO, General History of Africa, volume II", url: "https://www.unesco.org/en/general-history-africa" },
      }
    ]
  },
  {
    id: 12,
    order: 11,
    era: "medieval",
    from: 1137,
    title: "Medieval Ethiopia",
    subtitle: "Lalibela and the Solomonic dynasty",
    icon: Mountain,
    region: "Horn of Africa",
    color: "from-yellow-600 to-red-700",
    questions: [
      {
        question: "Which dynasty ruled Ethiopia from 1137 and built the churches of Lalibela?",
        options: ["The Zagwe", "The Solomonic", "The Aksumite", "The Omani"],
        correct: 0,
        fact: "The Zagwe kings ruled from Roha, a town later renamed Lalibela after the most famous of them.",
        source: { label: "Encyclopaedia Britannica, \"Zagwe dynasty\"" },
      },
      {
        question: "How were the eleven churches of Lalibela built?",
        options: ["Carved downwards out of solid rock", "Built with bricks and cement", "Assembled from wood", "Dug as underground tunnels only"],
        correct: 0,
        fact: "Each church was cut from a single block of volcanic rock, so the roof, the walls and the floor all come from the same stone.",
        source: { label: "UNESCO World Heritage List, Rock-Hewn Churches, Lalibela", url: "https://whc.unesco.org/en/list/18/" },
      },
      {
        question: "Which dynasty took power in 1270 and claimed descent from Solomon and the Queen of Sheba?",
        options: ["The Solomonic dynasty", "The Zagwe dynasty", "The Askia dynasty", "The Sayfawa dynasty"],
        correct: 0,
        fact: "The claim to Solomon was written into the Kebra Nagast, the national epic of Ethiopia, and the dynasty lasted until 1974.",
        source: { label: "Encyclopaedia Britannica, \"Solomonic dynasty\"" },
      },
      {
        question: "Which Muslim sultanate, led by Ahmad ibn Ibrahim, almost conquered the Christian kingdom in the 1530s?",
        options: ["Adal", "Kilwa", "Mogadishu", "Kanem"],
        correct: 0,
        fact: "Ahmad ibn Ibrahim was called Gragn, meaning the left handed, and his army fought with firearms brought through the Red Sea trade.",
        source: { label: "UNESCO, General History of Africa, volume IV", url: "https://www.unesco.org/en/general-history-africa" },
      },
      {
        question: "In 1543, with a small Portuguese force, which Ethiopian emperor defeated and killed Ahmad Gragn?",
        options: ["Gelawdewos", "Lalibela", "Fasilides", "Menelik II"],
        correct: 0,
        fact: "The battle of Wayna Daga ended the war, and both Arabic and Portuguese chronicles describe it.",
        source: { label: "UNESCO, General History of Africa, volume IV", url: "https://www.unesco.org/en/general-history-africa" },
      },
      {
        question: "Which emperor made Gondar his capital in 1636 and started its line of castles?",
        options: ["Fasilides", "Gelawdewos", "Tewodros II", "Haile Selassie"],
        correct: 0,
        fact: "The castles of Gondar still stand, a reminder of a court that also produced poetry, painting and church music.",
        source: { label: "UNESCO World Heritage List, Fasil Ghebbi, Gondar Region", url: "https://whc.unesco.org/en/list/19/" },
      },
      {
        question: "In which script, still used today, is a large part of Ethiopian literature written?",
        options: ["Ge'ez", "Arabic", "Latin", "Coptic"],
        correct: 0,
        fact: "The Ge'ez script has been used in Ethiopia for over two thousand years, and each character stands for a syllable rather than a single sound.",
        source: { label: "Encyclopaedia Britannica, \"Ge'ez language\"" },
      },
      {
        question: "Which people moved into the Ethiopian highlands from the south in the 16th century and became a large part of the empire?",
        options: ["The Oromo", "The Somali", "The Nubians", "The Zulu"],
        correct: 0,
        fact: "The Oromo expansion followed the wars of the 16th century, and Oromo is today the most widely spoken first language of Ethiopia.",
        source: { label: "Encyclopaedia Britannica, \"Oromo\"" },
      },
      {
        question: "Which emperor, reigning from 1855 to 1868, tried to reunite and modernise Ethiopia?",
        options: ["Tewodros II", "Fasilides", "Menelik II", "Gelawdewos"],
        correct: 0,
        fact: "Tewodros II ended the era of princes and tried to build a national army, and he died at Magdala rather than surrender to a British expedition.",
        source: { label: "Encyclopaedia Britannica, \"Tewodros II\"" },
      },
      {
        question: "Which language, written in the Ge'ez script, is the working language of Ethiopia?",
        options: ["Amharic", "Oromo", "Tigrinya", "Somali"],
        correct: 0,
        fact: "Amharic is written with the Ge'ez script, whose characters stand for syllables, and it is one of the most widely spoken languages of the Horn.",
        source: { label: "Encyclopaedia Britannica, \"Amharic language\"" },
      }
    ]
  },
  {
    id: 13,
    order: 7,
    era: "medieval",
    from: 700,
    title: "The Ghana Empire",
    subtitle: "Wagadu, land of gold",
    icon: Gem,
    region: "West Africa",
    color: "from-yellow-400 to-amber-600",
    questions: [
      {
        question: "What did the people of the empire call their own land?",
        options: ["Wagadu", "Mali", "Songhay", "Bornu"],
        correct: 0,
        fact: "Ghana was the title of the king, and Arab writers used it to name the whole kingdom, while its own people said Wagadu.",
        source: { label: "Encyclopaedia Britannica, \"Ghana, historical empire\"" },
      },
      {
        question: "What was the capital city of the Ghana Empire?",
        options: ["Koumbi Saleh", "Timbuktu", "Gao", "Djenne"],
        correct: 0,
        fact: "Koumbi Saleh stood in today's southern Mauritania, and archaeologists have found both a royal town and a merchant town there.",
        source: { label: "UNESCO, General History of Africa, volume III", url: "https://www.unesco.org/en/general-history-africa" },
      },
      {
        question: "Which two goods made the Ghana Empire rich?",
        options: ["Gold and salt", "Cotton and tea", "Ivory and glass", "Copper and silk"],
        correct: 0,
        fact: "Gold came from the forests to the south and salt from the Sahara to the north, and Ghana taxed every load that crossed its land.",
        source: { label: "Encyclopaedia Britannica, \"Ghana, historical empire\"" },
      },
      {
        question: "In which part of the empire was the salt mined?",
        options: ["In the Sahara to the north", "On the coast to the south", "In the rainforest", "Along the Niger river"],
        correct: 0,
        fact: "The salt mines of Taghaza were so valuable that salt was sometimes traded weight for weight against gold.",
        source: { label: "UNESCO, General History of Africa, volume III", url: "https://www.unesco.org/en/general-history-africa" },
      },
      {
        question: "The title Ghana belonged to whom?",
        options: ["The king", "The capital", "The gold", "The army"],
        correct: 0,
        fact: "Arab geographers explained that Ghana meant the ruler, the man who guarded the trade routes and collected the taxes.",
        source: { label: "Encyclopaedia Britannica, \"Ghana, historical empire\"" },
      },
      {
        question: "Which Arab writer described the court, the gold and the taxes of Ghana in the 11th century?",
        options: ["Al-Bakri", "Ibn Battuta", "Al-Idrisi", "Leo Africanus"],
        correct: 0,
        fact: "Al-Bakri wrote in Cordoba from the reports of travellers, and his account remains the best description of medieval Ghana.",
        source: { label: "Encyclopaedia Britannica, \"al-Bakri\"" },
      },
      {
        question: "Which movement from the Sahara attacked and sacked Koumbi Saleh in 1076?",
        options: ["The Almoravids", "The Ottomans", "The Portuguese", "The Zulu"],
        correct: 0,
        fact: "The Almoravids came out of the desert preaching a strict reading of Islam, and the empire never fully recovered from the attack.",
        source: { label: "Encyclopaedia Britannica, \"Almoravids\"" },
      },
      {
        question: "Which empire took over the remains of Ghana in the 13th century?",
        options: ["Mali", "Songhay", "Kanem", "Benin"],
        correct: 0,
        fact: "After the short lived kingdom of Sosso, the Mali of Sundiata Keita took control of the gold and salt routes and built an empire of its own.",
        source: { label: "UNESCO, General History of Africa, volume III", url: "https://www.unesco.org/en/general-history-africa" },
      },
      {
        question: "In which centuries did the Ghana Empire reach the height of its power?",
        options: ["The 9th to 11th centuries", "The 15th century", "The 3rd century BC", "The 18th century"],
        correct: 0,
        fact: "Arab writers of the 9th to 11th centuries describe a rich kingdom whose king taxed every load of gold and salt that crossed it.",
        source: { label: "Encyclopaedia Britannica, \"Ghana, historical empire\"" },
      },
      {
        question: "What did the king of Ghana tax as goods crossed the empire?",
        options: ["Every load of gold and salt", "Only boats on the Niger", "Only foreign houses", "Nothing at all"],
        correct: 0,
        fact: "Gold came north from the forests and salt came south from the Sahara, and each load paid a duty at the frontier and again at the capital.",
        source: { label: "UNESCO, General History of Africa, volume III", url: "https://www.unesco.org/en/general-history-africa" },
      }
    ]
  },
  {
    id: 14,
    order: 8,
    era: "medieval",
    from: 800,
    title: "Kanem-Bornu and the Hausa Cities",
    subtitle: "Riders, scholars and city walls",
    icon: Scroll,
    region: "Central Sahel",
    color: "from-lime-600 to-emerald-800",
    questions: [
      {
        question: "Which empire dominated the lands around Lake Chad for about a thousand years?",
        options: ["Kanem-Bornu", "Ghana", "Kongo", "Kilwa"],
        correct: 0,
        fact: "Kanem, north of the lake, and Bornu, to its west, were ruled by the Sayfawa dynasty for roughly a thousand years.",
        source: { label: "Encyclopaedia Britannica, \"Kanem-Bornu\"" },
      },
      {
        question: "Which religion did the kings of Kanem adopt in the 11th century?",
        options: ["Islam", "Christianity", "Hinduism", "Buddhism"],
        correct: 0,
        fact: "Muslim scholars, judges and traders were welcomed at court, and Kanem became a centre of learning in the Sahel.",
        source: { label: "Encyclopaedia Britannica, \"Kanem-Bornu\"" },
      },
      {
        question: "Which ruler of Bornu, reigning from 1580 to 1617, is famous for his wars and his reforms?",
        options: ["Idris Alooma", "Dunama", "Sonni Ali", "Askia Muhammad"],
        correct: 0,
        fact: "Idris Alooma reorganised the army, set the law in writing and kept records, and his reign is remembered as the golden age of Bornu.",
        source: { label: "Encyclopaedia Britannica, \"Kanem-Bornu\"" },
      },
      {
        question: "What new weapon did Idris Alooma obtain through the Ottoman empire?",
        options: ["Muskets and a corps of riflemen", "Steel swords", "Cannons mounted on ships", "War elephants"],
        correct: 0,
        fact: "A Turkish military mission helped train his musketeers, which made Bornu one of the first Sahelian states to use firearms.",
        source: { label: "Encyclopaedia Britannica, \"Kanem-Bornu\"" },
      },
      {
        question: "Which of these was a great Hausa city-state, famous for its walls and its market?",
        options: ["Kano", "Kilwa", "Loango", "Mapungubwe"],
        correct: 0,
        fact: "Kano, Katsina, Zaria, Gobir and Daura were the main Hausa states, each with its own king and its own walled capital.",
        source: { label: "Encyclopaedia Britannica, \"Hausa states\"" },
      },
      {
        question: "What surrounded the Hausa cities to protect them?",
        options: ["Earthen walls with gates", "Moats filled with sea water", "Stone mountains", "Wooden towers"],
        correct: 0,
        fact: "The wall of Kano, the ganuwar Kano, was begun in the 11th century and later stretched for dozens of kilometres.",
        source: { label: "Encyclopaedia Britannica, \"Kano\"" },
      },
      {
        question: "Which market in Kano has been trading since the 15th century?",
        options: ["The Kurmi market", "The gold souk of Taghaza", "The ivory quay of Sofala", "The salt market of Bilma"],
        correct: 0,
        fact: "The Kurmi market was founded in the 15th century under Muhammad Rumfa and it still opens every morning.",
        source: { label: "Encyclopaedia Britannica, \"Kano\"" },
      },
      {
        question: "Which routes carried salt, cloth, horses and books between the Sahel and the Mediterranean?",
        options: ["The trans-Saharan caravan routes", "The monsoon sea routes", "The river boats of the Congo", "The Atlantic sea route"],
        correct: 0,
        fact: "Camels crossed the desert for the best part of two thousand years, and the Hausa cities grew rich on that traffic.",
        source: { label: "UNESCO, General History of Africa, volume III", url: "https://www.unesco.org/en/general-history-africa" },
      },
      {
        question: "Which title did the rulers of Kanem-Bornu carry?",
        options: ["Mai", "Mansa", "Negus", "Oba"],
        correct: 0,
        fact: "The kings of Kanem-Bornu were called mai, and their Sayfawa dynasty ruled the lands around Lake Chad for about a thousand years.",
        source: { label: "Encyclopaedia Britannica, \"Kanem-Bornu\"" },
      },
      {
        question: "In which century did the Sayfawa dynasty begin to rule Kanem?",
        options: ["The 11th century", "The 5th century", "The 16th century", "The 19th century"],
        correct: 0,
        fact: "The Sayfawa kings of Kanem adopted Islam in the 11th century, and their dynasty lasted longer than almost any other in African history.",
        source: { label: "Encyclopaedia Britannica, \"Kanem-Bornu\"" },
      }
    ]
  },
  {
    id: 15,
    order: 9,
    era: "medieval",
    from: 900,
    title: "The Swahili Coast",
    subtitle: "Kilwa, Zanzibar and the monsoon trade",
    icon: Ship,
    region: "East African coast",
    color: "from-cyan-500 to-teal-700",
    questions: [
      {
        question: "Which language developed along the East African coast and was long written in Arabic script?",
        options: ["Swahili", "Amharic", "Ge'ez", "Zulu"],
        correct: 0,
        fact: "Swahili is a Bantu language with many Arabic loan words, born from the meeting of African farmers, fishermen and Muslim traders.",
        source: { label: "Encyclopaedia Britannica, \"Swahili language\"" },
      },
      {
        question: "Which island port, in today's Tanzania, was famous for its great mosque and its gold trade?",
        options: ["Kilwa", "Lamu", "Mombasa", "Sofala"],
        correct: 0,
        fact: "From the 13th to the 16th century, much of the gold and ivory of the interior passed through the port of Kilwa.",
        source: { label: "UNESCO World Heritage List, Ruins of Kilwa Kisiwani and Ruins of Songo Mnara", url: "https://whc.unesco.org/en/list/144/" },
      },
      {
        question: "Which traveller from Tangier described Kilwa in 1331?",
        options: ["Ibn Battuta", "Al-Bakri", "Marco Polo", "Ibn Khaldun"],
        correct: 0,
        fact: "Ibn Battuta called Kilwa one of the most beautiful and best built towns he had seen.",
        source: { label: "Encyclopaedia Britannica, \"Ibn Battuta\"" },
      },
      {
        question: "What did the merchants of the coast buy from the African interior?",
        options: ["Gold, ivory and enslaved people", "Porcelain and silk", "Wheat and olive oil", "Books and horses"],
        correct: 0,
        fact: "Caravans from as far away as the copper belt and the goldfields brought metal, ivory and enslaved people down to the ports.",
        source: { label: "UNESCO, General History of Africa, volume IV", url: "https://www.unesco.org/en/general-history-africa" },
      },
      {
        question: "Which goods from Asia were found in the houses of Swahili merchants?",
        options: ["Chinese porcelain and Persian pottery", "Salt and copper", "Cattle and hides", "Gold and iron"],
        correct: 0,
        fact: "Archaeologists still find Chinese porcelain and Persian earthenware in the ruins of Swahili houses, proof of trade across the Indian Ocean.",
        source: { label: "UNESCO World Heritage List, Ruins of Kilwa Kisiwani and Ruins of Songo Mnara", url: "https://whc.unesco.org/en/list/144/" },
      },
      {
        question: "Which Portuguese navigator reached the East African coast in 1498 on his way to India?",
        options: ["Vasco da Gama", "Christopher Columbus", "Ferdinand Magellan", "James Cook"],
        correct: 0,
        fact: "Vasco da Gama's ships were guided along the coast by a Swahili pilot who knew the monsoon winds.",
        source: { label: "Encyclopaedia Britannica, \"Vasco da Gama\"" },
      },
      {
        question: "What happened to Kilwa in 1505?",
        options: ["It was sacked by the Portuguese", "It was destroyed by an earthquake", "It became the capital of Mali", "It was abandoned by its people"],
        correct: 0,
        fact: "The Portuguese took the town to control the Indian Ocean trade, and the great days of Kilwa came to an end.",
        source: { label: "UNESCO World Heritage List, Ruins of Kilwa Kisiwani and Ruins of Songo Mnara", url: "https://whc.unesco.org/en/list/144/" },
      },
      {
        question: "Which Omani sultan moved his capital to Zanzibar in 1840?",
        options: ["Sayyid Said", "Idris Alooma", "Ewuare", "Fasilides"],
        correct: 0,
        fact: "Zanzibar became the hub of the clove trade and of the caravan routes into the interior, with its own diplomatic relations with Europe.",
        source: { label: "Encyclopaedia Britannica, \"Zanzibar\"" },
      },
      {
        question: "What were the houses of the Swahili trading towns built from?",
        options: ["Coral stone and lime", "Mud brick", "Timber", "Cut granite"],
        correct: 0,
        fact: "Coral rag and lime mortar gave the coastal towns their tall, cool houses, and many of them still stand as ruins along the coast.",
        source: { label: "UNESCO World Heritage List, Ruins of Kilwa Kisiwani and Ruins of Songo Mnara", url: "https://whc.unesco.org/en/list/144/" },
      },
      {
        question: "Which Portuguese fort, built after 1593, still stands on the island of Mombasa?",
        options: ["Fort Jesus", "Elmina Castle", "Cape Coast Castle", "Fort Sao Sebastiao"],
        correct: 0,
        fact: "Fort Jesus guarded the East African coast for Portugal, then for Oman, and it is now a UNESCO World Heritage site.",
        source: { label: "UNESCO World Heritage List, Fort Jesus, Mombasa", url: "https://whc.unesco.org/en/list/1295/" },
      }
    ]
  },
  {
    id: 16,
    order: 13,
    era: "medieval",
    from: 1390,
    title: "Forest Kingdoms",
    subtitle: "Kongo, Benin, Ife and Oyo",
    icon: Building2,
    region: "Central and West Africa",
    color: "from-green-600 to-emerald-800",
    questions: [
      {
        question: "Which kingdom was founded around 1390 with its capital at Mbanza Kongo?",
        options: ["The Kingdom of Kongo", "The Kingdom of Benin", "The Kingdom of Ife", "The Empire of Oyo"],
        correct: 0,
        fact: "Nimi a Lukeni built the kingdom by uniting several small states on the plateau of northern Angola.",
        source: { label: "UNESCO World Heritage List, Mbanza Kongo", url: "https://whc.unesco.org/en/list/1511/" },
      },
      {
        question: "Which Kongo king made Christianity a state religion and wrote to the king of Portugal?",
        options: ["Afonso I", "Nimi a Lukeni", "Kimpa Vita", "Ewuare"],
        correct: 0,
        fact: "Afonso I, born Nzinga a Mvemba, learned Portuguese, opened schools, and wrote to Lisbon to protest against the slave trade.",
        source: { label: "Encyclopaedia Britannica, \"Afonso I\"" },
      },
      {
        question: "Which prophetess preached a reform of the church in Kongo and was executed in 1706?",
        options: ["Kimpa Vita", "Nzinga Mbandi", "Yaa Asantewaa", "Amina"],
        correct: 0,
        fact: "Kimpa Vita said that Saint Anthony spoke through her, called on the Kongolese to unite, and was burned with her companion.",
        source: { label: "The Metropolitan Museum of Art, Dona Beatriz, Kongo Prophet", url: "https://www.metmuseum.org/essays/dona-beatriz-kongo-prophet" },
      },
      {
        question: "In which kingdom did British troops loot the royal palace in 1897?",
        options: ["Benin", "Kongo", "Ife", "Kanem-Bornu"],
        correct: 0,
        fact: "The punitive expedition of 1897 took thousands of brass plaques, heads and ivory carvings, now scattered among museums in Europe and America.",
        source: { label: "Encyclopaedia Britannica, \"Benin\"" },
      },
      {
        question: "Which oba of Benin, ruling from 1440 to 1473, built up the palace and the city?",
        options: ["Ewuare the Great", "Ovonramwen", "Oduduwa", "Alaafin Sango"],
        correct: 0,
        fact: "Ewuare rebuilt the capital, dug moats and earthworks, and turned Benin into one of the best organised states of West Africa.",
        source: { label: "Encyclopaedia Britannica, \"Benin\"" },
      },
      {
        question: "Which Yoruba city is seen as the cradle of the Yoruba and is famous for its brass heads?",
        options: ["Ife", "Kano", "Oyo", "Abomey"],
        correct: 0,
        fact: "The naturalistic brass heads of Ile-Ife date from the 13th to the 15th century and count among the great works of world art.",
        source: { label: "Encyclopaedia Britannica, \"Ife\"" },
      },
      {
        question: "Which Yoruba empire of cavalrymen dominated the savannah north of the forest for centuries?",
        options: ["Oyo", "Benin", "Kongo", "Dahomey"],
        correct: 0,
        fact: "Oyo's horsemen controlled the trade with the Sahel, and the empire only broke up in the 19th century under civil wars and outside pressure.",
        source: { label: "Encyclopaedia Britannica, \"Oyo empire\"" },
      },
      {
        question: "Which guild of craftsmen in Benin cast the commemorative heads of the obas?",
        options: ["The brass casters of Igun Street", "The wood carvers of Ife", "The weavers of Kano", "The boat builders of Lamu"],
        correct: 0,
        fact: "The craft guilds of Benin lived in their own quarters of the city and passed their skills from father to son.",
        source: { label: "Encyclopaedia Britannica, \"Benin\"" },
      },
      {
        question: "Which queen ruled Ndongo and Matamba in today's Angola and fought the Portuguese for decades?",
        options: ["Njinga Mbandi", "Kimpa Vita", "Yaa Asantewaa", "Amina"],
        correct: 0,
        fact: "Njinga Mbandi negotiated with the Portuguese as an equal, then fought them for years, and she is remembered as a symbol of resistance.",
        source: { label: "Encyclopaedia Britannica, \"Nzinga\"" },
      },
      {
        question: "Which forest kingdom of today's Ghana is famous for its Golden Stool?",
        options: ["Asante", "Kongo", "Ife", "Kanem"],
        correct: 0,
        fact: "The Golden Stool stands for the soul of the Asante nation, and the kingdom grew rich on gold and on the trade routes to the coast.",
        source: { label: "Encyclopaedia Britannica, \"Asante empire\"" },
      }
    ]
  },
  {
    id: 17,
    order: 15,
    era: "earlyModern",
    from: 1500,
    title: "The Atlantic Slave Trade",
    subtitle: "Exile, resistance and abolition",
    icon: Globe,
    region: "Atlantic Africa",
    color: "from-slate-500 to-slate-800",
    questions: [
      {
        question: "According to the Slave Voyages database, how many Africans were forced onto ships across the Atlantic?",
        options: ["About 1.2 million", "About 12.5 million", "About 125 million", "About 500,000"],
        correct: 1,
        fact: "The database counts more than 36,000 voyages between 1514 and 1866, and roughly 12.5 million people were put on board.",
        source: { label: "Slave Voyages, the Trans-Atlantic Slave Trade Database", url: "https://www.slavevoyages.org/" },
      },
      {
        question: "How many of those forced onto the ships reached the Americas alive?",
        options: ["About 10.7 million", "About 2 million", "About 12.5 million", "About 50 million"],
        correct: 0,
        fact: "Roughly one person in six died during the crossing, a loss rate the database documents voyage by voyage.",
        source: { label: "Slave Voyages, the Trans-Atlantic Slave Trade Database", url: "https://www.slavevoyages.org/" },
      },
      {
        question: "Which small island off Senegal, long used as a trading post, is today a place of memory of the trade?",
        options: ["Goree", "Zanzibar", "Robben Island", "Kilwa"],
        correct: 0,
        fact: "Goree was one of many departure points, and it is preserved today so that the scale of the trade is not forgotten.",
        source: { label: "UNESCO World Heritage List, Island of Gorée", url: "https://whc.unesco.org/en/list/26/" },
      },
      {
        question: "Which country made the slave trade illegal for its ships and subjects in 1807?",
        options: ["Britain", "Portugal", "Spain", "Brazil"],
        correct: 0,
        fact: "The Abolition of the Slave Trade Act was followed by naval patrols, though slavery itself was only abolished in the British colonies in 1833.",
        source: { label: "Encyclopaedia Britannica, \"Slavery Abolition Act\"" },
      },
      {
        question: "Which formerly enslaved African wrote an autobiography published in London in 1789?",
        options: ["Olaudah Equiano", "Toussaint Louverture", "Frederick Douglass", "Phillis Wheatley"],
        correct: 0,
        fact: "Equiano bought his freedom, campaigned with the abolitionists, and his book helped turn British opinion against the trade.",
        source: { label: "Encyclopaedia Britannica, \"Olaudah Equiano\"" },
      },
      {
        question: "Which Caribbean country was born from an uprising of enslaved people and declared independence in 1804?",
        options: ["Haiti", "Jamaica", "Cuba", "Barbados"],
        correct: 0,
        fact: "The revolution led by Toussaint Louverture and then Jean-Jacques Dessalines created the first Black republic, and it frightened slave owners across the Atlantic world.",
        source: { label: "Encyclopaedia Britannica, \"Haiti\"" },
      },
      {
        question: "Which country in the Americas was the last to abolish slavery, in 1888?",
        options: ["Brazil", "Cuba", "The United States", "Britain"],
        correct: 0,
        fact: "The Golden Law of 1888 freed the last enslaved people in the Americas, almost four centuries after the first slave ships crossed the ocean.",
        source: { label: "UNESCO, General History of Africa, volume V", url: "https://www.unesco.org/en/general-history-africa" },
      },
      {
        question: "Which town, settled in 1792 for freed slaves on the coast of Sierra Leone, became a centre of African education?",
        options: ["Freetown", "Monrovia", "Accra", "Lagos"],
        correct: 0,
        fact: "Freetown was founded by Black Loyalists from Nova Scotia, joined later by Maroons and by Africans freed from slave ships.",
        source: { label: "UNESCO, General History of Africa, volume V", url: "https://www.unesco.org/en/general-history-africa" },
      },
      {
        question: "Which castle on the coast of today's Ghana was the seat of the British slave trade there?",
        options: ["Cape Coast Castle", "Goree", "Kilwa", "Lamu"],
        correct: 0,
        fact: "Cape Coast Castle held enslaved people in its dungeons before they were carried across the Atlantic, and it is a UNESCO World Heritage site.",
        source: { label: "UNESCO World Heritage List, Forts and Castles, Volta, Greater Accra, Central and Western Regions", url: "https://whc.unesco.org/en/list/34/" },
      },
      {
        question: "Which revolt of enslaved Africans aboard a ship in 1839 became a famous court case in the United States?",
        options: ["The Amistad revolt", "The Zong massacre", "The Nat Turner rebellion", "The Haitian revolution"],
        correct: 0,
        fact: "Led by Joseph Cinque, the captives of the Amistad seized the ship, and a court ruled they had been illegally enslaved and set them free.",
        source: { label: "Encyclopaedia Britannica, \"Amistad\"" },
      }
    ]
  },
  {
    id: 18,
    order: 17,
    era: "modern",
    from: 1884,
    title: "Colonial Conquest",
    subtitle: "Resistance, Adwa and pan-Africanism",
    icon: Map,
    region: "Across the continent",
    color: "from-rose-600 to-red-900",
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
        source: { label: "UNESCO, General History of Africa, volume VII", url: "https://www.unesco.org/en/general-history-africa" },
      },
      {
        question: "Which colonial policy offered French citizenship to a small group of Africans in the four communes of Senegal?",
        options: ["Assimilation", "Indirect rule", "Apartheid", "Protectorate"],
        correct: 0,
        fact: "Britain preferred indirect rule through local chiefs, while France spoke of assimilation but granted citizenship to very few people.",
        source: { label: "UNESCO, General History of Africa, volume VII", url: "https://www.unesco.org/en/general-history-africa" },
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
      }
    ]
  },
  {
    id: 19,
    order: 18,
    era: "contemporary",
    from: 1948,
    title: "Apartheid",
    subtitle: "The long road to freedom in South Africa",
    icon: Scale,
    region: "Southern Africa",
    color: "from-amber-700 to-stone-800",
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
      }
    ]
  },
  {
    id: 20,
    order: 20,
    era: "contemporary",
    from: 1990,
    title: "Africa Today",
    subtitle: "Union, growth and new challenges",
    icon: Rocket,
    region: "Across the continent",
    color: "from-teal-500 to-green-700",
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
        source: { label: "World Bank, Mobile payments go viral: M-PESA in Kenya", url: "https://documents.worldbank.org/en/publication/documents-reports/documentdetail/638851468048259219" },
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
        source: { label: "UNESCO, General History of Africa, volume VIII", url: "https://www.unesco.org/en/general-history-africa" },
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
      }
    ]
  }
];

// The levels above are authored in English and optionally translated. Only the
// wording is swapped: icon, colour, order and the correct answer index always
// come from the English data, so the quiz can never mark a different answer.
// A missing translation falls back to English rather than showing a blank.
export function localizeLevel(level, lang) {
  if (lang !== "fr") return level;
  const translated = LEVELS_FR[level.id];
  if (!translated) return level;
  // Question for question, otherwise we keep the English set rather than risk
  // pairing a question with another question's answers.
  if (!Array.isArray(translated.questions) || translated.questions.length !== level.questions.length) {
    return level;
  }

  return {
    ...level,
    title: translated.title || level.title,
    subtitle: translated.subtitle || level.subtitle,
    region: translated.region || level.region,
    questions: level.questions.map((question, index) => {
      const fr = translated.questions[index] || {};
      const options =
        Array.isArray(fr.options) && fr.options.length === question.options.length
          ? fr.options
          : question.options;
      return {
        ...question,
        question: fr.question || question.question,
        options,
        fact: fr.fact || question.fact,
        // Only the reference wording is translated; the link stays the one
        // verified for the English entry, so a translation can never point at
        // a page nobody checked.
        source: question.source
          ? { ...question.source, label: fr.source || question.source.label }
          : question.source,
      };
    }),
  };
}

/**
 * Every level in the requested language, oldest first. The array order is the
 * timeline: the map, the lesson list, the statistics and the teacher page all
 * read it, so a level's place in history is decided once, here, by `order` and
 * never depends on the order the levels happen to be written in.
 */
export function getLevels(lang) {
  return [...LEVELS]
    .sort((a, b) => a.order - b.order)
    .map((level) => ({
      ...localizeLevel(level, lang),
      // Attached here rather than in localizeLevel, so that both languages carry
      // it and the translation logic stays about text only.
      gallery: getLevelGallery(level.id, lang),
    }));
}

export function calculateStars(score, total) {
  const pct = score / total;
  if (pct >= 0.9) return 3;
  if (pct >= 0.7) return 2;
  if (pct >= 0.5) return 1;
  return 0;
}

export function getXPForScore(score, total) {
  const base = score * 20;
  const bonus = score === total ? 50 : 0;
  return base + bonus;
}