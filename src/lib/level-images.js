/**
 * The photographs of the game: three per level, served by the application
 * itself.
 *
 * The files live in public/photos and are downloaded once, from their original
 * free licence source, by scripts/fetch-photos.mjs. Nothing is fetched from a
 * third party at play time: no CDN, no hotlink, nothing to go down or to slow
 * the game down on a school connection.
 *
 * This table is the single source of truth, and everything else is derived from
 * it: the download script, the picture on each level card, the gallery shown in
 * the lesson, and the credits in the terms of service, which a test keeps in
 * step with the authors and licences written here.
 *
 * The first entry of a level is its main picture, the one used on the home
 * screen and above the quiz. The two others only appear in the lesson gallery.
 *
 * For a Wikimedia Commons file, `commonsTitle` is the file name as Commons
 * writes it: the script asks the API for it, refuses to download anything whose
 * licence does not match `licence`, and takes the image at the requested width.
 * That way an author can never be credited for something they did not publish,
 * and a swapped picture cannot slip in unnoticed.
 *
 * Each row also carries the fingerprints of its files, written by
 * scripts/stamp-photos.mjs after the pictures are prepared: `sha256` for the
 * JPEG in public/photos, `webpSha256` for the light WebP drawn beside it,
 * `avifSha256` for the third format in front of that one on the pictures that
 * earned one, and `thumbSha256` for the small copy the list of credits draws.
 * A file name survives a swap and a re-encode does not change it, so the
 * fingerprints are what tie a credit line to the exact bytes a player
 * receives; a test reads them back from the files on disk.
 *
 * `caption` is the text shown under the picture, in both languages. It lives
 * next to the photograph rather than in content-fr.js because a photograph and
 * its two captions are one thing: adding a picture has to mean touching one
 * place only.
 */
export const LEVEL_PHOTOS = [
  // 1. Ancient Egypt
  {
    level: 1,
    file: "/photos/level-1-1.jpg",
    sha256: "b569a360adcfd3ca3e32f730a8a87b0175a8ec2ef6cc32437fbcfe4510f3f2f0",
    webpSha256: "3324105a6f54e3b98522e2a1f5f5f8610c04eedb10f7654ce3c2e632c78e00b3",
    thumbSha256: "cf19e64ad8294a11545a07be342d930e71ce5406236e16e02d2df3eab3a1718d",
    width: 960,
    origin: "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800&q=80",
    author: null,
    licence: "Unsplash",
    collection: "Unsplash",
    caption: {
      en: "The pyramids of Giza, built as royal tombs more than 4,500 years ago.",
      fr: "Les pyramides de Gizeh, construites comme tombeaux royaux il y a plus de 4 500 ans.",
    },
  },
  {
    level: 1,
    file: "/photos/level-1-2.jpg",
    sha256: "49873b688155c4ab84e5bb59210f403e82449edd1c694014c8610450c15d7bb7",
    webpSha256: "4ec1a43192be806c4a3930aa22a508e0d5257f6231627c2466cde2ded76867cd",
    avifSha256: "2e7d23b732cc5d07657f27e450cd8da4fb581e6fd72eee206917ab789dae8e3d",
    thumbSha256: "139e28a51ae7270dcbd25d0ad8fe65dacc84dbd82ef8ba19d6f3cf0e1b859a8d",
    width: 480,
    commonsTitle: "Great Sphinx of Giza (أبو الهول).jpg",
    author: "Petar Milošević",
    licence: "CC BY-SA 4.0",
    collection: "Wikimedia Commons",
    caption: {
      en: "The Great Sphinx, carved from a single block of limestone.",
      fr: "Le grand Sphinx, taillé dans un seul bloc de calcaire.",
    },
  },
  {
    level: 1,
    file: "/photos/level-1-3.jpg",
    sha256: "481fba6236155a32818b5645d16136561944d687cd14a87148f694fb26f62a80",
    webpSha256: "7b43e519ac661caa1799d0dd6bad5bc4f64ecd3afb9f62359e40fc294179238c",
    avifSha256: "4171f7315df34584a5717d3f7c6729c1ffd16fd81cc50f867872db4b5b2a0f52",
    thumbSha256: "629f14dafd80b283a61abd9a35ec8d1d8082f23fc5ace18da37763fb0db84bc9",
    width: 480,
    commonsTitle: "Mask of Tutankhamun in 2025.jpg",
    author: "Dawid Wdowczyk",
    licence: "CC BY 4.0",
    collection: "Wikimedia Commons",
    caption: {
      en: "The funeral mask of Tutankhamun, found in his tomb in 1922.",
      fr: "Le masque funéraire de Toutânkhamon, retrouvé dans sa tombe en 1922.",
    },
  },

  // 2. Kingdom of Kush
  {
    level: 2,
    file: "/photos/level-2-1.jpg",
    sha256: "e421faf8cdca59808d18bbeb967823198314e1fdcd522a2f3a29819b6ffa7ca6",
    webpSha256: "6f7d71aced078a506c8d27153913857cab2937771115114656d735903c6a0a76",
    thumbSha256: "f57d9036b0d6fdf9fd6a24957cd20acd2d5ab00eacaf969072dbe4e599fead6a",
    width: 960,
    commonsTitle: "Sudan Meroe Pyramids 2001.JPG",
    author: "B N Chagny",
    licence: "CC BY-SA 1.0",
    collection: "Wikimedia Commons",
    caption: {
      en: "The Nubian pyramids of Meroe, seen from the air.",
      fr: "Les pyramides nubiennes de Méroé, vues du ciel.",
    },
  },
  {
    level: 2,
    file: "/photos/level-2-2.jpg",
    sha256: "65a42bc4d6c74b0e9e5181747c98310fba6d8f33de3baf2c836bf1554c5c21c1",
    webpSha256: "477c5e8c03bfd8682e9d90e96de70a8ac28adeea14d6719b7931c946d51139aa",
    avifSha256: "1b030849da59d0bcb1b66f5fa94f11035d3c1cd5cf151ec8c0e122b05b8042ca",
    thumbSha256: "48491a570014cf6856a189872e61d13b831a64d1ec873ee8e7d4ed7743cb2826",
    width: 480,
    commonsTitle: "Anlamani's pyramid, Nuri, Sudan, North-east Africa.jpg",
    author: "Sue Fleckney",
    licence: "CC BY-SA 2.0",
    collection: "Wikimedia Commons",
    caption: {
      en: "A royal pyramid at Nuri, one of the burial places of the kings of Kush.",
      fr: "Une pyramide royale à Nuri, l'un des lieux de sépulture des rois de Kouch.",
    },
  },
  {
    level: 2,
    file: "/photos/level-2-3.jpg",
    sha256: "18e30f84598ddb89462cfc0c1e55bf411657ff60ac11badf3eebde00da36e078",
    webpSha256: "bee619db4f1258eb3fb2fc0ab4aafb130d721c7f1af7c0fc9cb4be85a081fee9",
    thumbSha256: "9299b4f7c9b230f6d412bc9c420f2177d8d5bd30909f8323e17dfbc3a871a63e",
    width: 480,
    commonsTitle:
      "0690-0664 302 PHARAOHS OF EGYPT – Bronze Statuette of Pharaoh TAHARQA. From Gebel Barkal (Nubia), Napata Period.jpg",
    author: "Hans Ollermann",
    licence: "CC BY-SA 2.0",
    collection: "Wikimedia Commons",
    caption: {
      en: "A bronze of King Taharqa, who also ruled Egypt as a pharaoh.",
      fr: "Un bronze du roi Taharqa, qui régna aussi sur l'Égypte comme pharaon.",
    },
  },

  // 3. Great Zimbabwe
  {
    level: 3,
    file: "/photos/level-3-1.jpg",
    sha256: "b12c8a2a99f66dde9b5dfb93661d48bb586fb336f29245e85312c0179ee1fa54",
    webpSha256: "a7a746edbd2d6c70c705d510fb9ed380cf686e8fc35491c3d49fc1f8140386f1",
    thumbSha256: "9c799719b36713c8531f2ee43343829c23745ef622c5f5d2e269d237c489e3b0",
    width: 960,
    commonsTitle: "Great-zim-aerial-looking-West.JPG",
    author: "Janice Bell",
    licence: "CC BY-SA 4.0",
    collection: "Wikimedia Commons",
    caption: {
      en: "The Great Enclosure of Great Zimbabwe, seen from the air.",
      fr: "La Grande Enceinte de Grand Zimbabwe, vue du ciel.",
    },
  },
  {
    level: 3,
    file: "/photos/level-3-2.jpg",
    sha256: "bbcc73a24f4b8f62d3225f0d298009b93492797f15b6077f435ffdcddf42e3a4",
    webpSha256: "d51415a42c82bdb96ff2773abb5bb0a126cb23e674b0030bfebc82f6f21edb51",
    avifSha256: "265e6649e2e2d7f2759d9fca83fff38151ce059307c72f5cbf354d71ac5af9d4",
    thumbSha256: "8e8839c1c0771bc91f835dfe0fcf67d510419416bba5cd43fd99fc26b78e84cb",
    width: 480,
    commonsTitle: "Conical tower – Great Zimbabwe.jpg",
    author: "Fanny Schertzer",
    licence: "CC BY 3.0",
    collection: "Wikimedia Commons",
    caption: {
      en: "The conical tower of the Great Enclosure, built without any mortar.",
      fr: "La tour conique de la Grande Enceinte, montée sans aucun mortier.",
    },
  },
  {
    level: 3,
    file: "/photos/level-3-3.jpg",
    sha256: "eb3fdaa3a6f486ec0b368182fbb20db55c0745f5d8f24b86a724499ea1e4110a",
    webpSha256: "3923ccfdea9e58059d0479b7b69692b1e004389722f62bbaa92c6dc6f90f1c9f",
    avifSha256: "2e55cbe06a4681385d509380b8fc8ce8a6302438ca32c005d3c75c09d91bc78a",
    thumbSha256: "5d832a5cac1a5de56362266495a39af10aff13806ecf74f7d3d31e107c7a3a7f",
    width: 480,
    commonsTitle: "Figure, Possibly Shona peoples, possibly Zimbabwe, Date unknown, Stone (2923620556).jpg",
    author: "Cliff",
    licence: "CC BY 2.0",
    collection: "Wikimedia Commons",
    caption: {
      en: "A soapstone bird, the emblem of Great Zimbabwe.",
      fr: "Un oiseau de stéatite, l'emblème de Grand Zimbabwe.",
    },
  },

  // 4. Mali Empire
  {
    level: 4,
    file: "/photos/level-4-1.jpg",
    sha256: "2324dde60a10b09fa11c4efa46b13b1fa8061a9844f57be7be6635a4e4142f9d",
    webpSha256: "3fbdc49176a453700477a65392b92bd63b73b0085d9ce039b5d3534f0a83c2bf",
    thumbSha256: "a1df514a596b6cda44fe79ad2562df3aa3a3d0d5921de79fff83db03e1636f2d",
    width: 960,
    commonsTitle: "Great Mosque of Djenné 1.jpg",
    author: "Andy Gilham",
    licence: "CC BY-SA 3.0",
    collection: "Wikimedia Commons",
    caption: {
      en: "The Great Mosque of Djenne, rebuilt in 1907 and repaired by hand every year.",
      fr: "La grande mosquée de Djenné, reconstruite en 1907 et réparée à la main chaque année.",
    },
  },
  {
    level: 4,
    file: "/photos/level-4-2.jpg",
    sha256: "617d37bd4436a690ef56e72b849fc43f54739fdf74534e71da8ab97bff8cabbf",
    webpSha256: "228579bb9ba52a00156ec948b1a412eaca66a013bcc71a71091ceacf1c3697c3",
    avifSha256: "dc39b39447325a1aae574ae1b5750e1003c67ab2c3e6bab501fa00b7acff2d67",
    thumbSha256: "4af5fdd17b2ae36362d432cab2c206caa3e700c94504597e5363ef01f58152a6",
    width: 480,
    commonsTitle: "Sankore Madrasah.jpg",
    author: "Ondřej Havelka",
    licence: "CC BY-SA 4.0",
    collection: "Wikimedia Commons",
    caption: {
      en: "The Sankore mosque in Timbuktu, at the heart of its university.",
      fr: "La mosquée Sankoré à Tombouctou, au cœur de son université.",
    },
  },
  {
    level: 4,
    file: "/photos/level-4-3.jpg",
    sha256: "8656ce04b9372169b0e5414f3529ccf499e465683ce4dc74f302226a4a71f657",
    webpSha256: "90d32352b6e348a22d8f3b0b01aea717622eb870fe44cf400211f95f06bad0d6",
    thumbSha256: "e9f06a76d9df914fc17ecb822a96fc8c2a77843790a7d8deb9ebf389baed2c6f",
    width: 480,
    commonsTitle: "Timbuktu Manuscript (48522180467).jpg",
    author: "Mark Fischer",
    licence: "CC BY-SA 2.0",
    collection: "Wikimedia Commons",
    caption: {
      en: "A manuscript of Timbuktu, one of thousands kept by local families.",
      fr: "Un manuscrit de Tombouctou, l'un des milliers conservés par les familles.",
    },
  },

  // 5. Kingdom of Axum
  {
    level: 5,
    file: "/photos/level-5-1.jpg",
    sha256: "1fad3765049a394534e9e23f8bce48f18ea51e7e4f2926c62d20a07a77ff365e",
    webpSha256: "f8ee89c351a979448755f0644002bb4f401be03657b91d1d585f2e2772f0c875",
    thumbSha256: "fb889edf0c70cb6ac94a1992d633f235dbf7747d12f48731d515f275f5a7330d",
    width: 960,
    commonsTitle: "Rome Stele.jpg",
    author: "Ondřej Žváček",
    licence: "CC BY 2.5",
    collection: "Wikimedia Commons",
    caption: {
      en: "The Rome Stele, one of the obelisks of Axum, carved from a single block of granite.",
      fr: "La stèle de Rome, l'un des obélisques d'Axoum, taillée dans un seul bloc de granit.",
    },
  },
  {
    level: 5,
    file: "/photos/level-5-2.jpg",
    sha256: "f388ae0a6f2a03efd309f504783a7e002d2e5ced5dedb46a3da8dfc85fa94347",
    webpSha256: "d6c7d8c95626a0f7e844cb4553d869d3671541bfe67030862b54babae5efd1e5",
    avifSha256: "6640dfa22d00f991d9e8ba8e3fa76d2737cfe715e59f1d26d80bb60b50e65237",
    thumbSha256: "7cab60f8f23e080b0aaf9dd10d96f1b10143ab7c69f9bea0926dc52ef243eeec",
    width: 480,
    commonsTitle: "Aksum, resti della chiesa più antica di re ezana presso santa maria di zion, 00.jpg",
    author: "Sailko",
    licence: "CC BY 3.0",
    collection: "Wikimedia Commons",
    caption: {
      en: "The ruins of the oldest church at St Mary of Zion, where Ethiopian Christianity began.",
      fr: "Les ruines de la plus ancienne église de Sainte-Marie-de-Sion, où naquit le christianisme éthiopien.",
    },
  },
  {
    level: 5,
    file: "/photos/level-5-3.jpg",
    sha256: "18dab1ec211603c673394e098c7464b53d920febcbf9bd451e501a19d17151cb",
    webpSha256: "7fad749b4cdbe4ad842a56af13ba2cc8e7a45634dafec2128e58328161e898d3",
    avifSha256: "dacdf27b2bf5a231bdbcfe1a3177e231f621955f91aaf0306d2400ba3683158d",
    thumbSha256: "c921a0ff9c6eae6cbf8dc976457c881173b0bf7095709474bafb959b002514ec",
    width: 480,
    commonsTitle: "Ezana gold coin with cross. British Museum. 1921,0316.1.jpg",
    author: "Ismoon",
    licence: "CC BY-SA 4.0",
    collection: "Wikimedia Commons",
    caption: {
      en: "A gold coin of King Ezana, the first Aksumite ruler to strike the cross.",
      fr: "Une pièce d'or du roi Ezana, premier souverain d'Axoum à frapper la croix.",
    },
  },

  // 6. Songhai Empire
  {
    level: 6,
    file: "/photos/level-6-1.jpg",
    sha256: "bd6430fae7f1b7f9e8b2eebece4af19a4c6000cd16c127e6ca918347919b1b15",
    webpSha256: "343d4c9ab3fe39ca6391710c3eb251a3377000e943a81d1aa334e2c79aa99509",
    thumbSha256: "ec087b0ef664192a3d451b2c0c3ef92da3d822600aa50b67cf0f89a041b47351",
    width: 960,
    commonsTitle: "FISHERMEN RIVER WEST AFRICA.jpg",
    author: "T.K. Naliaka",
    licence: "CC BY-SA 4.0",
    collection: "Wikimedia Commons",
    caption: {
      en: "Fishermen on the Niger River, the artery of the Songhai Empire.",
      fr: "Des pêcheurs sur le fleuve Niger, l'artère de l'empire songhaï.",
    },
  },
  {
    level: 6,
    file: "/photos/level-6-2.jpg",
    sha256: "2ca3123c2bb965e2b002e3e162b12b026aacc4ec543b69221803332e6e2ffafd",
    webpSha256: "3c9dc1c3edb6325fcfcac3eaffae0685d679d9c58e05f6b9dc0bbe9b6e1dcd2b",
    avifSha256: "ae618dceeb94f10981e5fb764ba4ef4a29044644fca289eae1b7fd2b85b4e81f",
    thumbSha256: "ab90045675d2360c3979f48604668ed20ad34c28ced3cd472f900e1f1a7155d8",
    width: 480,
    commonsTitle: "Tombeau askia.jpg",
    author: "Gio53",
    licence: "CC BY-SA 4.0",
    collection: "Wikimedia Commons",
    caption: {
      en: "The Tomb of Askia in Gao, the pyramid tomb of a Songhai emperor.",
      fr: "Le tombeau d'Askia à Gao, la tombe pyramidale d'un empereur songhaï.",
    },
  },
  {
    level: 6,
    file: "/photos/level-6-3.jpg",
    sha256: "c410ec30e5882ab109ef5881c50c93c178ea7c3580b4898e50f7499aea256d29",
    webpSha256: "b142d8996dc677bc546e6524aa0228c2be3086ccd845bc5e72c25b21981a9d5e",
    thumbSha256: "f5e9d5c1cef2761e1ed408dee10a65e09753f6d5dd3f4e57734b5ccd6345327e",
    width: 480,
    commonsTitle: "Djinguereber Mosque, Timbuktu.jpg",
    author: "upyernoz",
    licence: "CC BY 2.0",
    collection: "Wikimedia Commons",
    caption: {
      en: "The Djinguereber mosque in Timbuktu, built under Mali and enlarged under Songhai.",
      fr: "La mosquée Djingareyber à Tombouctou, bâtie sous le Mali et agrandie sous les Songhaï.",
    },
  },

  // 7. Zulu Kingdom
  {
    level: 7,
    file: "/photos/level-7-1.jpg",
    sha256: "b8f4041e146277826c85490d13d19662c1674ebd3645641e78946bb3e6b33b79",
    webpSha256: "614863647ddde22b774fbf7f74d370f7b280e3089fdbb9b849c2d278bc858d69",
    avifSha256: "75f6b26dd6c1d3da8f4f948b0cb4298baa3276a94f78df4f0612abe5b123573e",
    thumbSha256: "fa4df9888cda6e1aa1aa25aaaf030cab12d8a2e1c6fad478976947dd29982404",
    width: 960,
    commonsTitle: "Isandlwana Battlefield.JPG",
    author: "RedNovember82",
    licence: "CC BY-SA 3.0",
    collection: "Wikimedia Commons",
    caption: {
      en: "The battlefield of Isandlwana, where the Zulu army won in 1879.",
      fr: "Le champ de bataille d'Isandlwana, où l'armée zouloue l'emporta en 1879.",
    },
  },
  {
    level: 7,
    file: "/photos/level-7-2.jpg",
    sha256: "5ea92e021aa9b8aa386ddcb85a7a0f69aa0c6d4dcd35b0ff288133c58e073d8e",
    webpSha256: "f80dd7d15a57fc905d3ec844b583c02c7d592f6ef9dbb702d4e97199b5179c65",
    avifSha256: "33c291e4c06fe762b6d8ebcd8bd6ff2cdb3442138c207caceae3525d8856843a",
    thumbSha256: "c773214f5ad7882dc0a15c7a62fab1010bccac55f6b51adf52e98e13fae4369d",
    width: 480,
    commonsTitle: "Cetshwayo, King of the Zulus (d. 1884), Carl Rudolph Sohn, 1882.jpg",
    author: "Carl Rudolph Sohn",
    licence: "Public domain",
    licenceFr: "domaine public",
    collection: "Wikimedia Commons",
    caption: {
      en: "King Cetshwayo, who led the Zulu kingdom during the war of 1879.",
      fr: "Le roi Cetshwayo, qui mena le royaume zoulou pendant la guerre de 1879.",
    },
  },
  {
    level: 7,
    file: "/photos/level-7-3.jpg",
    sha256: "cb5dd6230697b6b06e0a78c8b15d574a06aa6d91bff7f972af334038e8b8e110",
    webpSha256: "ff09fa983c0adc66edd43968b59f84ac5469e18ada2b74f5623b6017977452d0",
    avifSha256: "af0189136c019b6a6d9503221ac7bd21bb7705980d7dc483949d80be49c04ce2",
    thumbSha256: "c6406e3752e260a67841467149876fc54a0c2c3461fe222a2eb688da15ef94a7",
    width: 480,
    commonsTitle: "Shield, Zulu, Southern Africa, cow hide - Peabody Museum, Harvard University - DSC05996.jpg",
    author: "Daderot",
    licence: "Public domain",
    licenceFr: "domaine public",
    collection: "Wikimedia Commons",
    caption: {
      en: "A Zulu shield of cowhide, carried with the spear of the royal regiments.",
      fr: "Un bouclier zoulou en cuir de vache, porté avec la sagaie des régiments royaux.",
    },
  },

  // 8. African independence
  {
    level: 8,
    file: "/photos/level-8-1.jpg",
    sha256: "cf7bea1aeb15004ba953511d896a87d2010b7e9c3c11e8d1a8267771d95179bc",
    webpSha256: "662cf1c2540278c510c0771161dac6fd9fa0ce548a7f769d0c0c7f09a9630183",
    thumbSha256: "072d08a608cc4250015f25159c197298d3a32d67b121f70469d86c450c513795",
    width: 960,
    commonsTitle: "Independence Square - Accra, Ghana1.jpg",
    author: "George Appiah",
    licence: "CC BY 2.0",
    collection: "Wikimedia Commons",
    caption: {
      en: "Independence Square in Accra, Ghana, the first African colony to become free, in 1957.",
      fr: "Independence Square à Accra, au Ghana, première colonie africaine devenue libre, en 1957.",
    },
  },
  {
    level: 8,
    file: "/photos/level-8-2.jpg",
    sha256: "d51bfe30f71bc48e67289cbb46e2959208135a7943904a53592fea60f57f14b1",
    webpSha256: "bfd88386d758bd51441e38c3a5629858a1c0659df79f205950d72ffbe23052fe",
    thumbSha256: "ffe786615dded329053125f156b7b8df2f1c5f733f890c3880c6fababf265d08",
    width: 480,
    commonsTitle: "Kwame Nkrumah Monument at the Kwame Nkrumah Mausoleum and Memorial Park, Accra 01.jpg",
    author: "Nkansahrexford",
    licence: "CC BY-SA 4.0",
    collection: "Wikimedia Commons",
    caption: {
      en: "The monument to Kwame Nkrumah, who led Ghana to independence.",
      fr: "Le monument à Kwame Nkrumah, qui mena le Ghana à l'indépendance.",
    },
  },
  {
    level: 8,
    file: "/photos/level-8-3.jpg",
    sha256: "19437e0685b75d85bba153bc56b1c3afd9dfe848a3c3afbdc2ea43b71669cd79",
    webpSha256: "bd43ae6fb2baa5f31da9f5f671838185e7a6b09fd1288f6d1473284969f384bf",
    avifSha256: "c0848a3743bb94db07a5d38af7d0195a67c16df8507b52dc101463520324b2d2",
    thumbSha256: "37b494efbea49bc0a3ce8fb1b4c1924cb74062bdb5d4a595c60f9236cf2eb063",
    width: 480,
    commonsTitle: "PatriceLumumba1960.jpg",
    author: "Harry Pot",
    licence: "CC BY 4.0",
    collection: "Wikimedia Commons",
    caption: {
      en: "Patrice Lumumba, who in 1960 became the first head of government of an independent Congo.",
      fr: "Patrice Lumumba, devenu en 1960 le premier chef de gouvernement du Congo indépendant.",
    },
  },

  // 9. Human Origins
  {
    level: 9,
    file: "/photos/level-9-1.jpg",
    sha256: "c62ae584ad5f72385a390d25c9fd0c36d298c8b4c0fe4e4e9faed97ac6cee003",
    webpSha256: "399eb170faeb521e76e6b24838b84fbe864721dcdbe6a743e6edc6f1ff04a11e",
    thumbSha256: "4f92b99f8262fa714f84f27287dbecb89edd35765591dce13b4422eac1bc5e02",
    width: 960,
    commonsTitle: "Olduvai-Schlucht Mike Krüger 110126 1.jpg",
    author: "Mike Krüger",
    licence: "CC BY-SA 4.0",
    collection: "Wikimedia Commons",
    caption: {
      en: "The Olduvai Gorge in Tanzania, where some of the oldest stone tools of humankind were found.",
      fr: "La gorge d'Olduvai, en Tanzanie, où furent retrouvés certains des plus anciens outils de pierre de l'humanité.",
    },
  },
  {
    level: 9,
    file: "/photos/level-9-2.jpg",
    sha256: "b652ec599b6a121cabb08fc38efde6ee4584f09002ae1b1077972adf57c43185",
    webpSha256: "01a5377fbe15ed85c7ef0b2b0533c7ef3143f47d14f1520370065523f5317032",
    avifSha256: "c7e50229e8d1c2f462fb66791a6b5f9c662b5ec684f90bd67526cccb4cef0de2",
    thumbSha256: "06410b0c3ad45a94845ffd1ba3886829ca87cdfdbc62b624bc56ff1dd663feb3",
    width: 480,
    commonsTitle: "Sterkfontein Caves 23.jpg",
    author: "Mike Peel",
    licence: "CC BY-SA 4.0",
    collection: "Wikimedia Commons",
    caption: {
      en: "Inside the Sterkfontein caves in South Africa, where many hominin fossils have been dug out of the rock.",
      fr: "À l'intérieur des grottes de Sterkfontein, en Afrique du Sud, d'où de nombreux fossiles d'hominidés ont été extraits de la roche.",
    },
  },
  {
    level: 9,
    file: "/photos/level-9-3.jpg",
    sha256: "b76f7e1de8c8e05c8fc36c958b1d5be0c02d1fb60833e5d3b813824bd17a5c52",
    webpSha256: "7fdd62a6e73ec052de6def32d829f04f6cd68bb53780e4d5fc394eeacdc8fe18",
    thumbSha256: "5e3b7c4e14aaa43e303c9e9cddb12b95629fc002c1496acc790761fcb9ba6f1a",
    width: 480,
    commonsTitle: "Taung child (Frankfurt am Main) 1-EditMylius.jpg",
    author: "Gerbil",
    licence: "CC BY-SA 3.0",
    collection: "Wikimedia Commons",
    caption: {
      en: "A cast of the Taung Child, the skull of a young Australopithecus found in South Africa in 1924.",
      fr: "Le moulage de l'enfant de Taung, le crâne d'un jeune australopithèque découvert en Afrique du Sud en 1924.",
    },
  },

  // 10. Carthage and Ancient North Africa
  {
    level: 10,
    file: "/photos/level-10-1.jpg",
    sha256: "5e1aff19f28431c9654f0a1111ebaf48729cd3337fe20976065d99fcce126431",
    webpSha256: "bc7f5aa7f312b234c2da830fdbfc6236bca943dc50c84b19016ab9c6ee747a1c",
    thumbSha256: "152d69d1e6cb819c072ff0d35d1f48abfb35e16f57f6d3c382242d749ce75063",
    width: 960,
    commonsTitle: "01996 Ruins of Antonine Baths at Carthage.jpg",
    author: "Silar",
    licence: "CC BY-SA 4.0",
    collection: "Wikimedia Commons",
    caption: {
      en: "The Baths of Antoninus at Carthage, the largest Roman baths ever raised on African soil.",
      fr: "Les thermes d'Antonin à Carthage, les plus grands thermes romains jamais élevés sur le sol africain.",
    },
  },
  {
    level: 10,
    file: "/photos/level-10-2.jpg",
    sha256: "6442086b1b8cde4c828767945e33f4f0d00cf2362478837afed30f1b2b7044d4",
    webpSha256: "3cb7905b8f2a853a99d3285a92381610e489504b884aeed6c91512ec431d024e",
    avifSha256: "7e621cbabfac271822ead90f150822bf205452488b87cebe57d8dcec4298e56f",
    thumbSha256: "3a4de44af679d40704d65d2ff1bf6a9d03488a8153b6fadbe78069f15ecfb02f",
    width: 480,
    commonsTitle: "A Punic stela with a symbol of Tanit, Carthage, Tunisia.JPG",
    author: "Shoestring",
    licence: "CC BY-SA 4.0",
    collection: "Wikimedia Commons",
    caption: {
      en: "A Punic stela from the tophet of Carthage, marked with the sign of the goddess Tanit.",
      fr: "Une stèle punique du tophet de Carthage, marquée du signe de la déesse Tanit.",
    },
  },
  {
    level: 10,
    file: "/photos/level-10-3.jpg",
    sha256: "a62a78ca1e5bc6243ee60976aaba40913434c92018051182bdcb6ca3058d52e3",
    webpSha256: "1fc4c1162bd751587382c37d85095f1f587555fa841fc50368be6a3cf5ddaad2",
    avifSha256: "b7434a6e927b32675ce03b95ad557f77f53c3b29265ca300f578ca588ae9eeab",
    thumbSha256: "d4653fcd64114ff17801fca40856ca6b9627beefe374c027af836172f6cd8f6d",
    width: 480,
    commonsTitle: "Carthage Museum punic ruins.jpg",
    author: "damian entwistle",
    licence: "CC BY-SA 2.0",
    collection: "Wikimedia Commons",
    caption: {
      en: "Punic stonework kept in the museum of Carthage, the city Rome destroyed in 146 BC.",
      fr: "Des pierres puniques conservées au musée de Carthage, la ville que Rome détruisit en 146 avant notre ère.",
    },
  },

  // 11. The Iron Age
  {
    level: 11,
    file: "/photos/level-11-1.jpg",
    sha256: "affcfd638a651210a498426c6ccadb5ba3fb95d89e101e8235b13fbbb39dc596",
    webpSha256: "d29ad79ad200fb638988c1e398ff440e1c3a2f282196c8aea2379bc6c7201ab7",
    thumbSha256: "8e59108382230b21d89f14e815b49163ed2eec3b0870f1cf2612342bc041cee1",
    width: 960,
    commonsTitle: "Erected Nok Terracotta.jpg",
    author: "Zbobai",
    licence: "CC BY-SA 4.0",
    collection: "Wikimedia Commons",
    caption: {
      en: "A Nok terracotta standing near the village of Nok, in central Nigeria, where this culture was first recognised.",
      fr: "Une terre cuite nok dressée près du village de Nok, dans le centre du Nigeria, où cette culture fut identifiée.",
    },
  },
  {
    level: 11,
    file: "/photos/level-11-2.jpg",
    sha256: "7cf62ae2cf7d445de33c4da740ecfb87cbbea373765facdd243b0add8d35b809",
    webpSha256: "555f544ba58da271b7468197acb5922fd1d5256738c77ef648c9a7ab6ca379ec",
    thumbSha256: "e051d0ec26ca7096c2dff7b6b4d3b522fa533b8baa680d6554475bca4d29ae2e",
    width: 480,
    commonsTitle: "Head, Nok culture, terracotta, Honolulu Museum of Art, 8349.1.JPG",
    author: "Hiart",
    licence: "CC0",
    collection: "Wikimedia Commons",
    caption: {
      en: "A head of fired clay of the Nok culture, shaped by hand more than two thousand years ago.",
      fr: "Une tête de terre cuite de la culture nok, façonnée à la main il y a plus de deux mille ans.",
    },
  },
  {
    level: 11,
    file: "/photos/level-11-3.jpg",
    sha256: "bb225a083e36c48f19a33eb6022253cac3aac206a556066527f19b549574c329",
    webpSha256: "0d87cb01d55cc16bf65f8980c7c3d780ac09bb5aa1a6551bba210d9efe9995e4",
    thumbSha256: "e3ac393d51e68e3be57f26b9b4d1e119d624194b24f31ca4ba7f07402e0c18d6",
    width: 480,
    commonsTitle: "A double headed reptile terracotta.jpg",
    author: "Friday musa",
    licence: "CC BY-SA 4.0",
    collection: "Wikimedia Commons",
    caption: {
      en: "A two-headed reptile of fired clay, dug up at a Nok site in Nigeria.",
      fr: "Un reptile à deux têtes de terre cuite, mis au jour sur un site nok du Nigeria.",
    },
  },

  // 12. Medieval Ethiopia
  {
    level: 12,
    file: "/photos/level-12-1.jpg",
    sha256: "c467c285576991be782f2dcccaf334877d2f95a722a8987abd22b61cd76ac4e4",
    webpSha256: "10e29d40d75fa0576f5fade444845c524a73c6c468d146716d044e47a4320648",
    thumbSha256: "d7e05596eaf05dde0789a90c9736eca51128e0191d96049576eea61bd2d90bb7",
    width: 960,
    commonsTitle: "Ethiopia - sunset at Church of Saint George, Lalibela 01.jpg",
    author: "Thomas Fuhrmann",
    licence: "CC BY-SA 4.0",
    collection: "Wikimedia Commons",
    caption: {
      en: "The church of Saint George at Lalibela, cut downwards into the rock in the 13th century.",
      fr: "L'église Saint-Georges de Lalibela, taillée vers le bas dans la roche au XIIIe siècle.",
    },
  },
  {
    level: 12,
    file: "/photos/level-12-2.jpg",
    sha256: "73c690e34265f60c398eb2d85c0925dfa04a9b65b18551b231e0aa71d2b1a8a2",
    webpSha256: "110124d504a75a3d2957025c7f2b4c5472f1443e1c806428052aa3982c2a49f4",
    avifSha256: "1c65812ebc7998be6517d409326ecb87bed763715a456a724f7f828ff78f27f1",
    thumbSha256: "16676ca75707d7d75782da8edd45c5e611d5c2453ac4e14f82d740aee7a7357c",
    width: 480,
    commonsTitle:
      "Outside Bet Gebriel-Rafael Rock-Hewn Church - Southeastern Cluster - Lalibela - Ethiopia - 01 (8729946249).jpg",
    author: "Adam Jones",
    licence: "CC BY-SA 2.0",
    collection: "Wikimedia Commons",
    caption: {
      en: "Another of the churches of Lalibela, one of eleven hewn from the same rocky ground.",
      fr: "Une autre des églises de Lalibela, l'une des onze taillées dans le même sol de pierre.",
    },
  },
  {
    level: 12,
    file: "/photos/level-12-3.jpg",
    sha256: "80ab77d9e95c9b39b8807bed360f32a5d30c3123f4ccdcceaf9a47941abdd4d6",
    webpSha256: "3a000ef835bd5c0859730859670ca3518ec84af7ffe2f2885ce66fcc8322eadf",
    thumbSha256: "8d904810d90ebdfa90b301fd78148568afabac628473b91d52d96b03262b8576",
    width: 480,
    commonsTitle: "Äthiopien Gebetbuch mit Futteral Linden-Museum 62509.jpg",
    author: "KarlHeinrich",
    licence: "Public domain",
    licenceFr: "domaine public",
    collection: "Wikimedia Commons",
    caption: {
      en: "An Ethiopian prayer book and its leather case, copied by hand in the Ge'ez script.",
      fr: "Un livre de prières éthiopien et son étui de cuir, copié à la main en écriture guèze.",
    },
  },

  // 13. The Ghana Empire
  {
    level: 13,
    file: "/photos/level-13-1.jpg",
    sha256: "144abd1f9f4d8e88663551ea4c964117952a697b8d83e2ca474c7f9f9c196316",
    webpSha256: "08ca1562a1630728917b54e84a0c50052e3e6c84880e342fa1550d8f6e5f6a9a",
    avifSha256: "67d2cb76b0ebddb3391e6089d64350e25796c668e6aa0a00abc69e92d0d86c05",
    thumbSha256: "47401976afb0027844414440cd13ca344418deea3a99ff6a968de84acf79f36e",
    width: 960,
    commonsTitle: "Salt selling Mopti Mali.jpg",
    author: "Robin Taylor",
    licence: "CC BY 2.0",
    collection: "Wikimedia Commons",
    caption: {
      en: "Blocks of salt for sale at Mopti, in Mali, the same load the caravans of the Sahara carried south.",
      fr: "Des blocs de sel en vente à Mopti, au Mali, la même charge que les caravanes du Sahara descendaient vers le sud.",
    },
  },
  {
    level: 13,
    file: "/photos/level-13-2.jpg",
    sha256: "c458e5cf99683ef987192d0682e1343ba94b34ff8a240b1e1f632b4cc34f255b",
    webpSha256: "c85a5e981881cb6da0b355c0446a28f6f55095fa535c1ad5f52cce092afdb916",
    avifSha256: "efb14747233e6dae8394ed865d2eafb2c3e862fc85938b9516e5ae921dbc2630",
    thumbSha256: "3e23b4c373d0b09bba59e20d1158dd6f8be588ad160efb13b4c2e1fbc29004d1",
    width: 480,
    commonsTitle: "Meule sur un site du Baten de Tichitt.jpg",
    author: "Sylvie Amblard-Pison",
    licence: "CC BY 4.0",
    collection: "Wikimedia Commons",
    caption: {
      en: "A grinding stone on a site of Dhar Tichitt, where farmers settled long before the empire of Ghana.",
      fr: "Une meule sur un site du Dhar Tichitt, où des agriculteurs s'installèrent bien avant l'empire du Ghana.",
    },
  },
  {
    level: 13,
    file: "/photos/level-13-3.jpg",
    sha256: "8bbf017a53260c4153925ef7143a9f478824cd6cef46bdb70c76d8441f418c0a",
    webpSha256: "85306c73e9b8e457290edea9aadeed55395716b33c0317eefe22aac145401f8b",
    avifSha256: "7dbd4703dc0c73aedccf7a95cd1b34544753b9f6045cc05d431153754ffedeb4",
    thumbSha256: "871e4530a7a9315fdc20c592ec28ffc9a1b8e162b25fe0f51b31b5ba7aac6c83",
    width: 480,
    commonsTitle:
      "Satellite view of part of the western necropolis of Koumbi Saleh showing the density of funerary structures.jpg",
    author: "Chloé Capel",
    licence: "CC BY-SA 4.0",
    collection: "Wikimedia Commons",
    caption: {
      en: "The burial ground of Koumbi Saleh, capital of the empire of Ghana, seen from a satellite.",
      fr: "Le cimetière de Koumbi Saleh, capitale de l'empire du Ghana, vu depuis un satellite.",
    },
  },

  // 14. Kanem-Bornu and the Hausa Cities
  {
    level: 14,
    file: "/photos/level-14-1.jpg",
    sha256: "e4aa524c9d8077890c55710bc79588dcd13a054522f908c1caadb88a244b89b4",
    webpSha256: "2556812051d8f6eb0928438c13ad3492e41ed8eaf4cacccf4729a0f65237870f",
    thumbSha256: "9fb108fbe5fb95a6c1ae3d18ae1421ffe0577f6ed791e4c7aceae7955fa35842",
    width: 960,
    commonsTitle: "Emir's Palace Gate, Kano.jpg",
    author: "Uncle Bash007",
    licence: "CC BY-SA 4.0",
    collection: "Wikimedia Commons",
    caption: {
      en: "The gate of the palace of the emir of Kano, in a Hausa city whose walls and palace date from the 15th century.",
      fr: "La porte du palais de l'émir de Kano, dans une cité haoussa dont les murs et le palais remontent au XVe siècle.",
    },
  },
  {
    level: 14,
    file: "/photos/level-14-2.jpg",
    sha256: "b22d166fcaa54ba0b3c8636907616a34593f92ae62256a4a3f0c8e8f62322655",
    webpSha256: "6682be97fed5aa41e94315d1c062ec43c77617de7ed4930633ef798b23543586",
    thumbSha256: "7692d856facc011c62a705e254199d1232bb09bc5c996505c7bf534b13322d4f",
    width: 480,
    commonsTitle: "Ancient Walls of Kano Emirate 02.jpg",
    author: "Anasskoko",
    licence: "CC BY-SA 4.0",
    collection: "Wikimedia Commons",
    caption: {
      en: "One of the old walls that ringed Kano, raised to shelter the city and its markets.",
      fr: "L'un des vieux murs qui ceinturaient Kano, élevés pour abriter la ville et ses marchés.",
    },
  },
  {
    level: 14,
    file: "/photos/level-14-3.jpg",
    sha256: "50f3b68a27e3497058d1d5cd5b1080bd1022a67ae15881c62efe378e3677a125",
    webpSha256: "db58cd43e5e506e657222814a21018d6ac93faf4017a5a1d3dd9862eec8a5c6a",
    avifSha256: "0c42d77ae667122cbf9f9b98469c76ff72e075809ce724ae84162e0e585ffa45",
    thumbSha256: "93305ec3bfe617a6613abf849bb2109ac7514fe484ab2056e660dd83d856a03e",
    width: 480,
    commonsTitle: "Gate to the palace of Sarkin Kano.jpg",
    author: "Monteil, P.-L.",
    licence: "Public domain",
    licenceFr: "domaine public",
    collection: "Wikimedia Commons",
    caption: {
      en: "The same palace gate as the explorer Parfait-Louis Monteil drew it in 1890.",
      fr: "La même porte de palais, telle que l'explorateur Parfait-Louis Monteil la dessina en 1890.",
    },
  },

  // 15. The Swahili Coast
  {
    level: 15,
    file: "/photos/level-15-1.jpg",
    sha256: "a051214219f9430f5d9ac207acc4f0d2d1a9ad4bb9012ab9b6471e2cd47b7528",
    webpSha256: "8141b556fcaa96bf0d8f878fee003b2245846b2ae2d27a0a502076da80b28d60",
    thumbSha256: "db992f55ddc1933b534242dae37b8facce54aea2c5b3c4f6fed58537bfcc7a26",
    width: 960,
    commonsTitle: "Great Mosque of Kilwa Kisiwani, 11th - 18th cents (20) (28781091310).jpg",
    author: "Richard Mortel",
    licence: "CC BY 2.0",
    collection: "Wikimedia Commons",
    caption: {
      en: "The great mosque of Kilwa Kisiwani, built and rebuilt between the 11th and the 18th century.",
      fr: "La grande mosquée de Kilwa Kisiwani, bâtie et rebâtie entre le XIe et le XVIIIe siècle.",
    },
  },
  {
    level: 15,
    file: "/photos/level-15-2.jpg",
    sha256: "91679fd2efd27828f6404c1c52e77296021610aa80a77ba2728ba01971996157",
    webpSha256: "7805262b24731f5755b6752f9718c7283a30ede77b767079707cb5f5a0d7091b",
    avifSha256: "caf147e9feff5685cb696989f6b36d0c85a02580ce5e0404fd818517ae103697",
    thumbSha256: "a85b94c55aa7538b25daf5c2212cee8ef854878eeeb1c8a86aba8234fb7d9e22",
    width: 480,
    commonsTitle: "Ornate Carved Door in Zanzibar.jpg",
    author: "Eric Kilby",
    licence: "CC BY-SA 2.0",
    collection: "Wikimedia Commons",
    caption: {
      en: "A carved wooden door of Stone Town, in Zanzibar, studded with brass like those of the monsoon traders.",
      fr: "Une porte de bois sculptée de Stone Town, à Zanzibar, cloutée de laiton comme celles des marchands de la mousson.",
    },
  },
  {
    level: 15,
    file: "/photos/level-15-3.jpg",
    sha256: "5302c093999763b679347b2d0f33a095ae01964e8ccabc393849cc795d2b0421",
    webpSha256: "ceba2a297989dd6f3a3995a02d0902d8d96339c764496d87918bec94b4edc817",
    avifSha256: "6ad33b7dd57bab1a30e49d43fce783ae6745aef833e8ac1fb462d07a75eb922a",
    thumbSha256: "bf7ab9175094de07f9021ca4ea3f9af49f4312cd452613d989aa0b7106be1657",
    width: 480,
    commonsTitle: "Kilwa Kisiwani Palace (33433637294).jpg",
    author: "David Stanley",
    licence: "CC BY 2.0",
    collection: "Wikimedia Commons",
    caption: {
      en: "The ruined palace of the sultans of Kilwa, which travellers compared to a great city of stone.",
      fr: "Le palais en ruine des sultans de Kilwa, que des voyageurs comparaient à une grande cité de pierre.",
    },
  },

  // 16. Forest Kingdoms
  {
    level: 16,
    file: "/photos/level-16-1.jpg",
    sha256: "4f66daa9b649c6bf842039adb2f7c8877fa1d81785c60a7c2c1bf20aa483982e",
    webpSha256: "9852a0e8b97005df19d02fbf8ed1bdefdc88f92bfceab4d26da0ebf508b00b2b",
    thumbSha256: "71aa445b8b56f557838851d8fa0ee30a2b2f817560dac48ab725548e0b7e1b37",
    width: 960,
    commonsTitle: "Benin Bronzes.jpg",
    author: "Warofdreams",
    licence: "CC BY-SA 3.0",
    collection: "Wikimedia Commons",
    caption: {
      en: "Brass plaques of Benin, cast for the palace of the oba and shown today in the British Museum.",
      fr: "Des plaques de laiton du Bénin, fondues pour le palais de l'oba et exposées aujourd'hui au British Museum.",
    },
  },
  {
    level: 16,
    file: "/photos/level-16-2.jpg",
    sha256: "336022bfa9162b372eb95bf1a457b9301c8ed3e600c88064cd64ed4947e0049e",
    webpSha256: "2a064e32f055f88abbf0d1214334ec0886f0ffb6c61aa0afa7e5e0117ffa7f4d",
    thumbSha256: "7cf431fc7b29a0b6eadfeb9c22fa2653316f1bfc0e6623a71eb266011aa8e548",
    width: 480,
    commonsTitle: "Africa Ife Head 1 Kimbell.jpg",
    author: "FA2010",
    licence: "Public domain",
    licenceFr: "domaine public",
    collection: "Wikimedia Commons",
    caption: {
      en: "A brass head of Ife, in what is now Nigeria, cast with a face close to life.",
      fr: "Une tête de laiton d'Ifé, dans l'actuel Nigeria, coulée avec un visage tout proche du vivant.",
    },
  },
  {
    level: 16,
    file: "/photos/level-16-3.jpg",
    sha256: "4b9a30861d4958c3b58a25b1f2501156e35032564af206bd21a0e391c209ac03",
    webpSha256: "202e318b86f46f365285d2e5f9ad430c816fd16838b6167baa62eda70971dab1",
    avifSha256: "a36534204fa2cda34fc3808b41b5df08ff69c2d5ec50e3c9e2b72e688e055427",
    thumbSha256: "c6902e19825c54a690d4263e7bb13eccbe711cc2e99fbe3ac6cfee0439963a24",
    width: 480,
    commonsTitle:
      "The Bansa, or residence of the King of Kongo, called St. Salvador (M'Banza Kongo), Astley 1745.jpg",
    author: "Thomas Astley",
    licence: "Public domain",
    licenceFr: "domaine public",
    collection: "Wikimedia Commons",
    caption: {
      en: "The royal enclosure of the king of Kongo at Mbanza Kongo, drawn for an atlas of 1745.",
      fr: "L'enceinte royale du roi du Kongo à Mbanza Kongo, dessinée pour un atlas de 1745.",
    },
  },

  // 17. The Atlantic Slave Trade
  {
    level: 17,
    file: "/photos/level-17-1.jpg",
    sha256: "2f63b7d8d55bb9dcfd1f21f074effa42937f19ee66a9c7a6b7bfe03e036da289",
    webpSha256: "203591ea39cdc3efe20de768841eb9f88fa5f536451a351f1768ee9de6b7431f",
    thumbSha256: "98adbc85a17c908e45b56ab2baca12f1d2e714cd9df8c4ff1254834ca1536d96",
    width: 960,
    commonsTitle: "Ghana Elmina Castle Slave Export Gate.JPG",
    author: "Kurt Dundy",
    licence: "CC BY-SA 3.0",
    collection: "Wikimedia Commons",
    caption: {
      en: "The gate of Elmina Castle in Ghana, through which captive Africans were led down to the ships.",
      fr: "La porte du château d'Elmina, au Ghana, par laquelle les Africains captifs étaient conduits vers les navires.",
    },
  },
  {
    level: 17,
    file: "/photos/level-17-2.jpg",
    sha256: "44f726c0da081327ab64e6399738eaf234dbcb737a9f881eac354fa713fbf8c6",
    webpSha256: "b399b29ea7124b598c4eaef84f13e6139dc4096efe33659b739d71871495239c",
    avifSha256: "3e4f48cd86a632628ee2adbaf42c015747d920e0e80be39f38dc5093b7447187",
    thumbSha256: "7bcadf67e23afdeb1d93c5a98f2e13db2fd4df78349472706d2d34d64b10d500",
    width: 480,
    commonsTitle: "Castle, Cape Coast (P1100221).jpg",
    author: "Matti Blume",
    licence: "CC BY-SA 4.0",
    collection: "Wikimedia Commons",
    caption: {
      en: "Cape Coast Castle, another of the forts built on the Gold Coast for the trade in human beings.",
      fr: "Le château de Cape Coast, un autre des forts bâtis sur la Côte de l'Or pour le commerce des êtres humains.",
    },
  },
  {
    level: 17,
    file: "/photos/level-17-3.jpg",
    sha256: "8a88228eca83c1616325232d2b31df14117f5210d36b38be33c9e050ddb4fa98",
    webpSha256: "fefb7d00e52fe66484d0d26c95ff25738fcac6a4cb93099b84bc850edc91fbbf",
    avifSha256: "4f5b2d8d348779440939514efb979944669edd94126150fa79913ed3709267a7",
    thumbSha256: "d4c3788a16f61138bccfff93f32bcabed3cedd69d27d41b8387fdb166eab5495",
    width: 480,
    commonsTitle: "Ile de Gorée Sénégal.jpg",
    author: "Focale Emotions",
    licence: "CC BY-SA 4.0",
    collection: "Wikimedia Commons",
    caption: {
      en: "The island of Goree, off Dakar in Senegal, kept today as a place of remembrance.",
      fr: "L'île de Gorée, au large de Dakar au Sénégal, conservée aujourd'hui comme un lieu de mémoire.",
    },
  },

  // 18. Colonial Conquest
  {
    level: 18,
    file: "/photos/level-18-1.jpg",
    sha256: "9e28c4b2b4da8d64cc3ea85b33cfe2164ff66afe5d4a5c209c51ade1ef8355ae",
    webpSha256: "69afc3a4433808ed49acbd82bc19c36fbd48a3755ee32a2f4b0c96c02e84411c",
    thumbSha256: "ace222398ccc6ef09d6dee5a386cdcfcc86ec8cd217e6653be1355f14094110f",
    width: 960,
    commonsTitle: "Menelik - Adoua.jpg",
    author: "F. Méaulle",
    licence: "Public domain",
    licenceFr: "domaine public",
    collection: "Wikimedia Commons",
    caption: {
      en: "Emperor Menelik II at Adwa, as the French newspaper Le Petit Journal pictured the victory of 1896.",
      fr: "L'empereur Ménélik II à Adoua, tel que le journal français Le Petit Journal illustra la victoire de 1896.",
    },
  },
  {
    level: 18,
    file: "/photos/level-18-2.jpg",
    sha256: "3c12a1f2fa0c8993c70cff0b97c7304f1fc39bf23513bee65b8066c3124e1a79",
    webpSha256: "03c72143598d2ae72d66c4b840c129ce3fdebd6c585f4df42eaf04e5128af272",
    thumbSha256: "657997400d044c1ee7b5c33301b03973ee708b0a9ceaaadc40801c61ca607d6c",
    width: 480,
    commonsTitle: "Cartoon depicting Leopold 2 and other emperial powers at Berlin conference 1884.jpg",
    author: "François Maréchal",
    licence: "Public domain",
    licenceFr: "domaine public",
    collection: "Wikimedia Commons",
    caption: {
      en: "A French cartoon of 1884 showing the European powers carving up Africa at the Berlin Conference.",
      fr: "Une caricature française de 1884 montrant les puissances européennes se partager l'Afrique à la conférence de Berlin.",
    },
  },
  {
    level: 18,
    file: "/photos/level-18-3.jpg",
    sha256: "c3eb13ca0edde0e796d94f558ec94f45ca93f6ad93e0be1a0e9cb1cce16aee3e",
    webpSha256: "0411802547652bb6459b3694d7e165773a49a7755b876dc8875e1aff6987c452",
    avifSha256: "6d6f9d9e0a6b8766b93c22c6da826c735aab3b4ff73cba6ac6443a8b8e7d6c47",
    thumbSha256: "ef7794f568f766bc51945c952b12b0168fd282b1ebbe230d550fd296883dccc5",
    width: 480,
    commonsTitle: "Delegates for 4th PAC in New York 1927.jpg",
    author: "Unknown author",
    licence: "Public domain",
    licenceFr: "domaine public",
    collection: "Wikimedia Commons",
    caption: {
      en: "Delegates of the fourth Pan-African Congress, held in New York in 1927.",
      fr: "Les délégués du quatrième Congrès panafricain, tenu à New York en 1927.",
    },
  },

  // 19. Apartheid
  {
    level: 19,
    file: "/photos/level-19-1.jpg",
    sha256: "73c0d05540a4a594e259ca34d81e7515c92da439ceaa5d3f7f77713276dde813",
    webpSha256: "3e20606d87f605b6f2bac6673e56fd511e35644d67e5b83c928111e336d13083",
    thumbSha256: "34243284d6b373a00440ccdb41e90ffc7a8c13471fc0dc66bb36044fe05ab907",
    width: 960,
    commonsTitle: "Nelson Mandela's prison cell, Robben Island, South Africa.jpg",
    author: "Paul Mannix",
    licence: "CC BY-SA 2.0",
    collection: "Wikimedia Commons",
    caption: {
      en: "The cell on Robben Island where Nelson Mandela was held for eighteen years.",
      fr: "La cellule de l'île de Robben où Nelson Mandela fut détenu dix-huit ans.",
    },
  },
  {
    level: 19,
    file: "/photos/level-19-2.jpg",
    sha256: "a573a64557d7baaa4972c141b3b562ba49943f41a9f22b8ac0bbb101144b1913",
    webpSha256: "c995ee3f318cfc5f3419530caa03f90d67e4cf45e8d9521964a1d92909166fb2",
    thumbSha256: "fd955414f9c68c554b4bd074a7424107e6f2eb50bf87d0a0d20df324ecf0171a",
    width: 480,
    commonsTitle: "President Nelson Mandela and The Hon. Donald Card.jpg",
    author: "Blossom Index",
    licence: "CC0",
    collection: "Wikimedia Commons",
    caption: {
      en: "Nelson Mandela, after his release, beside Donald Card, a former policeman of the Eastern Cape.",
      fr: "Nelson Mandela, après sa libération, aux côtés de Donald Card, un ancien policier du Cap-Oriental.",
    },
  },
  {
    level: 19,
    file: "/photos/level-19-3.jpg",
    sha256: "7fd1208d8d87fa15ca627a8cfc6e719368d35d1325a8d49ed9ce79e05198d9ad",
    webpSha256: "9362f10729a8b89aa7784e88bdea95b91d207ab5efc4c236ae98f78273363d51",
    thumbSha256: "d06afe84e5af76f1f52a346c29227919d0a81c34b33a67fe72bf4a5346a490d1",
    width: 480,
    commonsTitle: "Welcome to Soweto.jpg",
    author: "Nolabob",
    licence: "CC BY-SA 4.0",
    collection: "Wikimedia Commons",
    caption: {
      en: "The sign at the entrance of Soweto, the township of Johannesburg where the uprising of 1976 began.",
      fr: "Le panneau à l'entrée de Soweto, le township de Johannesburg où débuta la révolte de 1976.",
    },
  },

  // 20. Africa Today
  {
    level: 20,
    file: "/photos/level-20-1.jpg",
    sha256: "1fbc7eabc78a6cd33b4fa47e923faaf01b23f6a2218fe6b47757dce327b7e61d",
    webpSha256: "95fdae51bff80517661ce598839de8010ba872a1c10024005a2c74663e03428b",
    thumbSha256: "73f7cf5c94cc1488026913d13d7eefc85e499dbca8a4e2ecac5f49785ff18a40",
    width: 960,
    commonsTitle: "Lagos Island City Scape.jpg",
    author: "Jamie Tubers",
    licence: "CC BY-SA 4.0",
    collection: "Wikimedia Commons",
    caption: {
      en: "The skyline of Lagos Island, in Nigeria, one of the cities growing fastest in the world.",
      fr: "Les tours de Lagos Island, au Nigeria, l'une des villes qui grandissent le plus vite au monde.",
    },
  },
  {
    level: 20,
    file: "/photos/level-20-2.jpg",
    sha256: "b48aa0d651a273cf4080d597447c2f0258192d18331a932c75fdb48c5724d807",
    webpSha256: "e383651272adb85abf6096edad93710156f209c513bacb07099214039a791bdd",
    avifSha256: "91def1f2dbda36f77212e826c40407957b0dc4e9b3a6e528b99edfe577dae3bc",
    thumbSha256: "40f8781c1fd75b5759dc1290810193d8cf99fa27feeaf009f566f262f09f1462",
    width: 480,
    commonsTitle: "African Union Headquarters Addis Ababa.jpg",
    author: "Wang Guansen",
    licence: "Public domain",
    licenceFr: "domaine public",
    collection: "Wikimedia Commons",
    caption: {
      en: "The headquarters of the African Union in Addis Ababa, where the member states meet.",
      fr: "Le siège de l'Union africaine à Addis-Abeba, où les États membres se réunissent.",
    },
  },
  {
    level: 20,
    file: "/photos/level-20-3.jpg",
    sha256: "8cf93e2a226fa610c38e21f5cd728fb70e46add7b2aaf392d6fc8d9f7f981980",
    webpSha256: "cc74946140125d7e4d177879927a8b38bcef428151b23baf05d668fed4553e7b",
    thumbSha256: "feb145277f7f5aaec6bfddcf8278cbf67ca4a80d425d0ba4e64e10e623ddccd6",
    width: 480,
    commonsTitle: "Addis Ababa Light Rail vehicle, March 2015.jpg",
    author: "Turtlewong",
    licence: "CC0",
    collection: "Wikimedia Commons",
    caption: {
      en: "A light rail train in Addis Ababa, the first line of its kind in East Africa.",
      fr: "Une rame du tramway d'Addis-Abeba, la première ligne de ce genre en Afrique de l'Est.",
    },
  },
];

/** The photographs of one level, in the order they are shown. */
export const LEVEL_GALLERIES = LEVEL_PHOTOS.reduce((all, photo) => {
  (all[photo.level] ||= []).push(photo);
  return all;
}, {});

/** The main picture of each level, the one shown on the cards and the quiz. */
export const LEVEL_IMAGES = Object.fromEntries(
  Object.entries(LEVEL_GALLERIES).map(([level, photos]) => [level, photos[0].file])
);

/** Every photograph of the game, in level order. */
export const LEVEL_IMAGE_URLS = LEVEL_PHOTOS.map((photo) => photo.file);

/**
 * Photographs still fetched from a third party host. Empty on purpose: keeping
 * it empty is what makes the game independent of any external CDN.
 */
export const REMOTE_IMAGE_URLS = LEVEL_IMAGE_URLS.filter((url) => /^https?:/i.test(url));

/**
 * The name of the licence, in the language on screen.
 *
 * "Public domain" is the only one whose name is not already international,
 * hence `licenceFr`; everything else - CC BY 4.0, CC0, Unsplash - is written
 * the same way in both languages. It is read here alone, so the credit line and
 * the credits screen cannot end up naming two different licences for one
 * picture.
 */
export function photoLicence(photo, lang = "en") {
  return lang === "fr" && photo.licenceFr ? photo.licenceFr : photo.licence;
}

/**
 * The line shown under a photograph: who made it, and under which licence,
 * in the language on screen.
 */
export function photoCredit(photo, lang = "en") {
  const holder = photo.author || photo.collection;
  return [...new Set([holder, photoLicence(photo, lang), photo.collection].filter(Boolean))].join(" · ");
}

/** The page a Commons photograph was taken from, for anyone checking it. */
export function photoSourcePage(photo) {
  if (!photo.commonsTitle) return photo.origin;
  return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(photo.commonsTitle.replace(/ /g, "_"))}`;
}
