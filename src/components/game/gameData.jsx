// Hero images per level (Unsplash)
export const LEVEL_IMAGES = {
  1: "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800&q=80", // Egypt pyramids
  2: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800&q=80",    // Sudan pyramids / desert
  3: "https://images.unsplash.com/photo-1504598318550-17eba1008a68?w=800&q=80", // Zimbabwe stone ruins
  4: "https://images.unsplash.com/photo-1590086782957-93c06ef21604?w=800&q=80", // West Africa landscape
  5: "https://images.unsplash.com/photo-1627816651201-d7eeecd75dd2?w=800&q=80", // Ethiopia obelisk
  6: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&q=80", // Niger river / Sahara
  7: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80", // South Africa savanna
  8: "https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=800&q=80", // Africa freedom / flag
};

export const LEVELS = [
  {
    id: 1,
    title: "Ancient Egypt",
    subtitle: "Land of the Pharaohs",
    icon: "🏛️",
    region: "North Africa",
    color: "from-amber-400 to-yellow-500",
    questions: [
      {
        question: "Which river was essential to Ancient Egyptian civilization?",
        options: ["Amazon River", "Nile River", "Congo River", "Niger River"],
        correct: 1,
        fact: "The Nile River is the longest river in Africa and was the lifeline of Ancient Egypt!"
      },
      {
        question: "What are the Great Pyramids of Giza?",
        options: ["Temples", "Tombs for Pharaohs", "Marketplaces", "Schools"],
        correct: 1,
        fact: "The pyramids were built as tombs for pharaohs and are over 4,500 years old!"
      },
      {
        question: "Who was the famous young pharaoh whose tomb was discovered in 1922?",
        options: ["Ramesses II", "Cleopatra", "Tutankhamun", "Khufu"],
        correct: 2,
        fact: "Tutankhamun became pharaoh at just 9 years old!"
      },
      {
        question: "What writing system did Ancient Egyptians use?",
        options: ["Alphabet", "Hieroglyphics", "Cuneiform", "Roman numerals"],
        correct: 1,
        fact: "Hieroglyphics used over 700 different symbols to write words and sounds!"
      },
      {
        question: "What was the Sphinx?",
        options: ["A type of boat", "A mythical creature statue", "A weapon", "A musical instrument"],
        correct: 1,
        fact: "The Great Sphinx has the body of a lion and the head of a human!"
      },
      {
        question: "Which pharaoh is believed to have commissioned the Great Sphinx of Giza?",
        options: ["Khufu", "Khafre", "Menkaure", "Ramesses II"],
        correct: 1,
        fact: "The Sphinx is widely believed to bear the face of Pharaoh Khafre, who built the second pyramid at Giza!"
      },
      {
        question: "What is the ancient Egyptian word for pharaoh, meaning 'Great House'?",
        options: ["Ankh", "Per-aa", "Maat", "Djed"],
        correct: 1,
        fact: "'Per-aa' originally referred to the royal palace, not the ruler — it later evolved to mean the king himself!"
      },
      {
        question: "In what year did the Rosetta Stone allow scholars to finally decode hieroglyphics?",
        options: ["1799", "1822", "1901", "1755"],
        correct: 1,
        fact: "Jean-François Champollion cracked the hieroglyphic code in 1822 using the Rosetta Stone, which had the same text in three scripts!"
      },
      {
        question: "Which goddess of Ancient Egypt was associated with magic, motherhood, and was the sister-wife of Osiris?",
        options: ["Hathor", "Sekhmet", "Isis", "Nephthys"],
        correct: 2,
        fact: "Isis was one of the most important goddesses — her cult spread beyond Egypt into the Roman Empire!"
      },
      {
        question: "The 'Book of the Dead' was a collection of magical spells used for what purpose?",
        options: ["Cursing enemies", "Guiding the soul through the afterlife", "Teaching children", "Predicting harvests"],
        correct: 1,
        fact: "The Book of the Dead contained over 200 spells to help the deceased navigate the dangers of the Duat (underworld)!"
      }
    ]
  },
  {
    id: 2,
    title: "Kingdom of Kush",
    subtitle: "Nubia's Golden Empire",
    icon: "👑",
    region: "Northeast Africa",
    color: "from-purple-400 to-indigo-500",
    questions: [
      {
        question: "Where was the Kingdom of Kush located?",
        options: ["West Africa", "Modern-day Sudan", "South Africa", "Madagascar"],
        correct: 1,
        fact: "Kush was located in modern-day Sudan, south of Egypt!"
      },
      {
        question: "What was the capital city of Kush?",
        options: ["Cairo", "Meroë", "Timbuktu", "Axum"],
        correct: 1,
        fact: "Meroë was famous for its iron-working and pyramids!"
      },
      {
        question: "Kush was known for trading which valuable material?",
        options: ["Diamonds", "Gold", "Silver", "Platinum"],
        correct: 1,
        fact: "Gold was so abundant that Kush was sometimes called the 'Land of Gold'!"
      },
      {
        question: "The Kushites built their own style of what famous structure?",
        options: ["Castles", "Pyramids", "Bridges", "Lighthouses"],
        correct: 1,
        fact: "Kush had more pyramids than Egypt — over 200 of them!"
      },
      {
        question: "What powerful group of women ruled parts of Kush?",
        options: ["Princesses", "Kandakes (Queens)", "Priestesses", "Warriors"],
        correct: 1,
        fact: "Kandakes were powerful queens who sometimes led armies into battle!"
      },
      {
        question: "Which Kandake of Kush famously fought against the Roman army around 24 BC?",
        options: ["Amanirenas", "Shanakdakhete", "Amanitore", "Nawidemak"],
        correct: 0,
        fact: "Kandake Amanirenas led her army against Rome after they tried to tax Nubian territory, and negotiated a favorable peace treaty!"
      },
      {
        question: "The Meroitic script used in Kush was deciphered in terms of its sounds, but what remains a mystery?",
        options: ["The alphabet", "The meaning of most words", "The direction of writing", "Who invented it"],
        correct: 1,
        fact: "Scholars can read Meroitic letters phonetically but still cannot fully understand the language — it remains largely undeciphered!"
      },
      {
        question: "Kush conquered and ruled Egypt for nearly a century. Which dynasty did Kushite pharaohs form?",
        options: ["24th Dynasty", "25th Dynasty", "26th Dynasty", "23rd Dynasty"],
        correct: 1,
        fact: "The Kushite 25th Dynasty, called the 'Black Pharaohs', ruled Egypt from around 747 to 656 BC!"
      },
      {
        question: "What was the primary fuel source for Kush's iron-smelting industry at Meroë?",
        options: ["Coal", "Charcoal from acacia trees", "Oil", "Wind power"],
        correct: 1,
        fact: "The forests around Meroë were so heavily used for iron smelting that the area eventually became deforested!"
      },
      {
        question: "Kush adopted the Egyptian system of writing hieroglyphics, then developed their own script. What was unique about Meroitic script structurally?",
        options: ["It was written in circles", "It used an alphabet with vowel signs", "It had no punctuation", "It was written vertically only"],
        correct: 1,
        fact: "Unlike Egyptian hieroglyphics, Meroitic was an alphabetic system with signs for vowels — a revolutionary linguistic development in Africa!"
      }
    ]
  },
  {
    id: 3,
    title: "Great Zimbabwe",
    subtitle: "City of Stone",
    icon: "🏰",
    region: "Southern Africa",
    color: "from-emerald-400 to-green-600",
    questions: [
      {
        question: "What does 'Zimbabwe' mean?",
        options: ["Big river", "Great stone houses", "Tall mountains", "Green land"],
        correct: 1,
        fact: "Zimbabwe comes from 'dzimba dza mabwe' meaning 'great stone houses'!"
      },
      {
        question: "Great Zimbabwe was a center for trading what?",
        options: ["Only food", "Gold, ivory, and cattle", "Only weapons", "Only cloth"],
        correct: 1,
        fact: "Great Zimbabwe was a wealthy trading center connected to trade routes reaching China and India!"
      },
      {
        question: "When was Great Zimbabwe at its peak?",
        options: ["100 BC", "500 AD", "1100-1450 AD", "1800 AD"],
        correct: 2,
        fact: "At its peak, over 18,000 people lived in and around Great Zimbabwe!"
      },
      {
        question: "What was special about Great Zimbabwe's walls?",
        options: ["Made of wood", "Built without mortar", "Made of clay", "Painted gold"],
        correct: 1,
        fact: "The walls were built from granite blocks fitted together without any mortar — amazing engineering!"
      },
      {
        question: "What famous bird sculpture was found at Great Zimbabwe?",
        options: ["Eagle", "Zimbabwe Bird", "Flamingo", "Parrot"],
        correct: 1,
        fact: "The Zimbabwe Bird is now the national emblem of Zimbabwe and appears on their flag!"
      },
      {
        question: "The people who built Great Zimbabwe belonged to which ethnic group?",
        options: ["Zulu", "Shona", "Xhosa", "Ndebele"],
        correct: 1,
        fact: "The Shona people built and inhabited Great Zimbabwe — their descendants still live in Zimbabwe today!"
      },
      {
        question: "Chinese porcelain was found at Great Zimbabwe. What does this tell us?",
        options: ["Chinese people built it", "Zimbabwe traded across the Indian Ocean", "It was a gift from Egypt", "Porcelain was made locally"],
        correct: 1,
        fact: "Chinese and Persian artifacts at Great Zimbabwe prove it was connected to vast Indian Ocean trade networks!"
      },
      {
        question: "The 'Great Enclosure' at Great Zimbabwe is the largest ancient structure south of the Sahara. What was its wall height?",
        options: ["3 metres", "6 metres", "11 metres", "20 metres"],
        correct: 2,
        fact: "The Great Enclosure's walls reach up to 11 metres high and stretch over 250 metres — built with over a million granite blocks!"
      },
      {
        question: "European colonizers in the 19th century falsely claimed Great Zimbabwe was built by which civilization?",
        options: ["Romans", "Phoenicians or Queen of Sheba's people", "Greeks", "Persians"],
        correct: 1,
        fact: "Racist colonial theories denied African authorship of Great Zimbabwe, claiming Phoenicians or the Queen of Sheba built it — all debunked by archaeology!"
      },
      {
        question: "What was the Mutapa state, which succeeded Great Zimbabwe's power?",
        options: ["A kingdom in West Africa", "A successor Shona kingdom controlling gold trade", "An Egyptian colony", "A Swahili city-state"],
        correct: 1,
        fact: "The Kingdom of Mutapa (or Mwene Mutapa) emerged after Great Zimbabwe's decline and controlled the gold-rich plateau until Portuguese interference in the 1600s!"
      }
    ]
  },
  {
    id: 4,
    title: "Mali Empire",
    subtitle: "Mansa Musa's Golden Age",
    icon: "💰",
    region: "West Africa",
    color: "from-yellow-500 to-orange-500",
    questions: [
      {
        question: "Who was the richest person in history from the Mali Empire?",
        options: ["Sundiata Keita", "Mansa Musa", "Askia Muhammad", "Shaka Zulu"],
        correct: 1,
        fact: "Mansa Musa was so rich that when he visited Cairo, he gave away so much gold it crashed the gold market for years!"
      },
      {
        question: "What famous city of learning was part of the Mali Empire?",
        options: ["Cairo", "Timbuktu", "Cape Town", "Nairobi"],
        correct: 1,
        fact: "Timbuktu had one of the world's oldest universities and housed hundreds of thousands of manuscripts!"
      },
      {
        question: "Who founded the Mali Empire?",
        options: ["Mansa Musa", "Sundiata Keita", "Ibn Battuta", "Askia the Great"],
        correct: 1,
        fact: "Sundiata Keita is known as the 'Lion King' of Mali and his story inspired many legends!"
      },
      {
        question: "What religion did Mansa Musa follow?",
        options: ["Christianity", "Islam", "Traditional African religions", "Buddhism"],
        correct: 1,
        fact: "Mansa Musa made a famous pilgrimage to Mecca in 1324 with thousands of followers!"
      },
      {
        question: "The Mali Empire was rich because of trade in what two things?",
        options: ["Fish and wood", "Gold and salt", "Iron and copper", "Silk and spices"],
        correct: 1,
        fact: "Salt was so valuable in West Africa that it was sometimes worth its weight in gold!"
      },
      {
        question: "Mansa Musa's pilgrimage to Mecca in 1324 included an enormous entourage. Approximately how many people accompanied him?",
        options: ["1,000", "10,000", "60,000", "500,000"],
        correct: 2,
        fact: "Mansa Musa traveled with an estimated 60,000 people including soldiers, servants, and 12,000 enslaved people carrying gold!"
      },
      {
        question: "The University of Sankore in Timbuktu could accommodate how many students at its peak?",
        options: ["500", "5,000", "25,000", "100,000"],
        correct: 2,
        fact: "Sankore University had up to 25,000 students — it was one of the largest universities in the medieval world!"
      },
      {
        question: "The epic of Sundiata Keita describes his childhood disability. What was it?",
        options: ["He was blind", "He could not walk until age 7", "He could not speak", "He was deaf"],
        correct: 1,
        fact: "According to legend, Sundiata could not walk until age 7, then rose to become the greatest warrior-king of West Africa!"
      },
      {
        question: "Which trans-Saharan trade route connected the Mali Empire to North Africa and the Mediterranean world?",
        options: ["The Silk Road", "The Gold Road through Sijilmasa", "The Incense Route", "The Amber Road"],
        correct: 1,
        fact: "The route through Sijilmasa (Morocco) was the main artery connecting Mali's gold fields to Mediterranean merchants!"
      },
      {
        question: "Ibn Battuta, who visited the Mali Empire in 1352, noted what unusual practice at the Malian court?",
        options: ["Everyone wore masks", "Subjects covered themselves in dust when greeting the king", "The king ate alone in public", "Women ran all the markets"],
        correct: 1,
        fact: "Ibn Battuta described subjects prostrating themselves and throwing dust on their heads as a sign of respect before the Mali king!"
      }
    ]
  },
  {
    id: 5,
    title: "Kingdom of Axum",
    subtitle: "Ethiopia's Ancient Power",
    icon: "⛪",
    region: "East Africa",
    color: "from-red-400 to-rose-500",
    questions: [
      {
        question: "Where was the Kingdom of Axum located?",
        options: ["West Africa", "Modern-day Ethiopia and Eritrea", "South Africa", "North Africa"],
        correct: 1,
        fact: "Axum was one of the most powerful kingdoms in the ancient world!"
      },
      {
        question: "What tall stone monuments did Axum build?",
        options: ["Pyramids", "Obelisks (Stelae)", "Castles", "Bridges"],
        correct: 1,
        fact: "The tallest Axumite stela was 33 meters tall — taller than most buildings!"
      },
      {
        question: "Axum was one of the first kingdoms to adopt which religion?",
        options: ["Islam", "Buddhism", "Christianity", "Hinduism"],
        correct: 2,
        fact: "Axum became Christian in the 4th century, making it one of the first Christian nations!"
      },
      {
        question: "What important trade item did Axum export?",
        options: ["Diamonds", "Ivory", "Silver", "Rubber"],
        correct: 1,
        fact: "Axum traded ivory, gold, and spices with Rome, India, and Arabia!"
      },
      {
        question: "Axum created its own system of what?",
        options: ["Coins", "Computers", "Cars", "Telephones"],
        correct: 0,
        fact: "Axum was one of the first African kingdoms to mint its own coins!"
      }
    ]
  },
  {
    id: 6,
    title: "Songhai Empire",
    subtitle: "Africa's Largest Empire",
    icon: "⚔️",
    region: "West Africa",
    color: "from-teal-400 to-cyan-600",
    questions: [
      {
        question: "The Songhai Empire was the largest empire in African history. Where was it?",
        options: ["East Africa", "West Africa", "Southern Africa", "North Africa"],
        correct: 1,
        fact: "The Songhai Empire covered over 1.4 million square kilometers!"
      },
      {
        question: "Who was the great leader who expanded the Songhai Empire?",
        options: ["Mansa Musa", "Shaka Zulu", "Askia Muhammad", "Haile Selassie"],
        correct: 2,
        fact: "Askia Muhammad created provinces, a tax system, and promoted education!"
      },
      {
        question: "Which city remained an important center of learning under Songhai?",
        options: ["Lagos", "Timbuktu", "Accra", "Dar es Salaam"],
        correct: 1,
        fact: "Under Songhai, Timbuktu's Sankore University attracted scholars from across the world!"
      },
      {
        question: "What river was vital to the Songhai Empire?",
        options: ["Nile", "Congo", "Niger", "Zambezi"],
        correct: 2,
        fact: "The Niger River provided water, food, and a highway for trade across the empire!"
      },
      {
        question: "How did the Songhai Empire fall?",
        options: ["Earthquake", "Moroccan invasion", "Flood", "Volcano"],
        correct: 1,
        fact: "In 1591, Morocco invaded with guns and cannons, which Songhai had never seen before!"
      }
    ]
  },
  {
    id: 7,
    title: "Zulu Kingdom",
    subtitle: "Warriors of the South",
    icon: "🛡️",
    region: "Southern Africa",
    color: "from-orange-400 to-red-500",
    questions: [
      {
        question: "Who was the famous leader who united the Zulu people?",
        options: ["Nelson Mandela", "Shaka Zulu", "Mansa Musa", "Haile Selassie"],
        correct: 1,
        fact: "Shaka Zulu transformed a small clan into one of the most powerful nations in southern Africa!"
      },
      {
        question: "What fighting formation did Shaka Zulu create?",
        options: ["Circle formation", "Bull horn formation", "Square formation", "Line formation"],
        correct: 1,
        fact: "The 'horns of the buffalo' formation surrounded enemies from both sides!"
      },
      {
        question: "Where was the Zulu Kingdom located?",
        options: ["Nigeria", "Kenya", "South Africa", "Egypt"],
        correct: 2,
        fact: "The Zulu Kingdom was in what is now KwaZulu-Natal province in South Africa!"
      },
      {
        question: "What weapon was most associated with Zulu warriors?",
        options: ["Bow and arrow", "Short stabbing spear (iklwa)", "Sword", "Cannon"],
        correct: 1,
        fact: "The iklwa spear was named after the sound it made — Shaka invented this close-combat weapon!"
      },
      {
        question: "The Zulu famously defeated the British in which 1879 battle?",
        options: ["Battle of Waterloo", "Battle of Isandlwana", "Battle of Hastings", "Battle of Adwa"],
        correct: 1,
        fact: "At Isandlwana, 20,000 Zulu warriors defeated a well-armed British force — a stunning victory!"
      }
    ]
  },
  {
    id: 8,
    title: "African Independence",
    subtitle: "Freedom Across the Continent",
    icon: "✊",
    region: "All of Africa",
    color: "from-green-500 to-emerald-600",
    questions: [
      {
        question: "Which African country was the first to gain independence from colonial rule in 1957?",
        options: ["Nigeria", "Kenya", "Ghana", "South Africa"],
        correct: 2,
        fact: "Ghana's leader Kwame Nkrumah said: 'The independence of Ghana is meaningless unless it is linked to the total liberation of Africa!'"
      },
      {
        question: "Who spent 27 years in prison fighting for freedom in South Africa?",
        options: ["Desmond Tutu", "Nelson Mandela", "Patrice Lumumba", "Jomo Kenyatta"],
        correct: 1,
        fact: "Nelson Mandela became South Africa's first Black president in 1994!"
      },
      {
        question: "What system of racial segregation existed in South Africa?",
        options: ["Democracy", "Apartheid", "Monarchy", "Federation"],
        correct: 1,
        fact: "Apartheid lasted from 1948 to 1994 and separated people based on race!"
      },
      {
        question: "Ethiopia is special because it was:",
        options: ["The smallest country", "Never colonized by Europeans", "An island", "Part of Asia"],
        correct: 1,
        fact: "Ethiopia defeated Italy at the Battle of Adwa in 1896, maintaining its independence!"
      },
      {
        question: "What organization was formed to unite African countries?",
        options: ["United Nations", "NATO", "African Union", "European Union"],
        correct: 2,
        fact: "The African Union, founded in 2002, works to promote unity and cooperation among all 55 African nations!"
      }
    ]
  }
];

export const BADGES = [
  { id: "first_step", name: "First Step", icon: "👣", description: "Complete your first level", requirement: { type: "levels", count: 1 } },
  { id: "rising_star", name: "Rising Star", icon: "⭐", description: "Earn 10 stars", requirement: { type: "stars", count: 10 } },
  { id: "knowledge_seeker", name: "Knowledge Seeker", icon: "📚", description: "Complete 4 levels", requirement: { type: "levels", count: 4 } },
  { id: "history_hero", name: "History Hero", icon: "🦁", description: "Complete all levels", requirement: { type: "levels", count: 8 } },
  { id: "perfect_score", name: "Perfect Score", icon: "💎", description: "Get all questions right in a level", requirement: { type: "perfect", count: 1 } },
  { id: "xp_master", name: "XP Master", icon: "🔥", description: "Earn 500 XP", requirement: { type: "xp", count: 500 } },
  { id: "streak_keeper", name: "Streak Keeper", icon: "🔥", description: "Play 3 days in a row", requirement: { type: "streak", count: 3 } },
  { id: "explorer", name: "Explorer", icon: "🗺️", description: "Try every region", requirement: { type: "levels", count: 6 } }
];

export const DIFFICULTIES = {
  easy: {
    id: "easy",
    label: "Easy",
    icon: "🌱",
    description: "No time limit · 1× XP",
    timeLimit: 0,
    xpMultiplier: 1,
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-300",
    textColor: "text-emerald-700",
  },
  medium: {
    id: "medium",
    label: "Medium",
    icon: "⚡",
    description: "30s per question · 1.5× XP",
    timeLimit: 30,
    xpMultiplier: 1.5,
    bgColor: "bg-amber-50",
    borderColor: "border-amber-300",
    textColor: "text-amber-700",
  },
  hard: {
    id: "hard",
    label: "Hard",
    icon: "🔥",
    description: "15s per question · 2× XP",
    timeLimit: 15,
    xpMultiplier: 2,
    bgColor: "bg-red-50",
    borderColor: "border-red-300",
    textColor: "text-red-700",
  },
};

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