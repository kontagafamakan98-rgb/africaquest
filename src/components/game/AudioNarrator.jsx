import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX, Loader2, Play, Pause } from "lucide-react";
import { getLang } from "../i18n";

// Short story/intro per level id
const LEVEL_STORIES = {
  1: {
    en: "Welcome to Ancient Egypt! Around 5,000 years ago, a great civilization was born along the banks of the Nile River in North Africa. The ancient Egyptians built towering pyramids, created a complex writing system called hieroglyphics, and were ruled by powerful kings called Pharaohs. Let's explore this incredible world together!",
    fr: "Bienvenue en Égypte Ancienne ! Il y a environ 5 000 ans, une grande civilisation est née le long du Nil en Afrique du Nord. Les anciens Égyptiens ont construit d'immenses pyramides, créé un système d'écriture appelé hiéroglyphes, et étaient gouvernés par de puissants rois appelés Pharaons. Explorons ce monde incroyable ensemble !"
  },
  2: {
    en: "Welcome to the Kingdom of Kush! South of Egypt, in what is today Sudan, rose a powerful empire known as Kush. The Kushites were master builders and traders who built their own magnificent pyramids. They were ruled by powerful queens called Kandakes and became famous for their iron-working and gold trade. Ready to discover this golden kingdom?",
    fr: "Bienvenue au Royaume de Koush ! Au sud de l'Égypte, dans ce qui est aujourd'hui le Soudan, s'est élevé un empire puissant appelé Koush. Les Koushites étaient de grands bâtisseurs et commerçants qui ont construit leurs propres pyramides. Dirigés par de puissantes reines appelées Kandakes, ils étaient célèbres pour leur travail du fer et leur commerce de l'or. Prêt à découvrir ce royaume doré ?"
  },
  3: {
    en: "Welcome to Great Zimbabwe! In the heart of southern Africa, a magnificent stone city rose between the 11th and 15th centuries. Built without a single drop of mortar, its walls of stacked granite blocks stand tall to this day. Great Zimbabwe was a thriving center of trade, connecting Africa to the rest of the world. Let's explore the City of Stone!",
    fr: "Bienvenue au Grand Zimbabwe ! Au cœur de l'Afrique australe, une magnifique cité de pierre s'est élevée entre le XIe et le XVe siècle. Construits sans une goutte de mortier, ses murs de granit s'élèvent encore aujourd'hui. Le Grand Zimbabwe était un centre commercial florissant reliant l'Afrique au reste du monde. Explorons la Cité de Pierre !"
  },
  4: {
    en: "Welcome to the Mali Empire! In the 13th century, one of the greatest empires the world has ever seen rose in West Africa. Founded by the legendary Sundiata Keita, the Mali Empire became a center of gold, salt, and knowledge. Its ruler Mansa Musa was the richest person in all of history! The great city of Timbuktu was a beacon of learning. Let's discover this golden age!",
    fr: "Bienvenue dans l'Empire du Mali ! Au XIIIe siècle, l'un des plus grands empires que le monde ait jamais connus s'est élevé en Afrique de l'Ouest. Fondé par le légendaire Soundjata Keïta, l'Empire du Mali était un centre d'or, de sel et de savoir. Son souverain Mansa Moussa était l'homme le plus riche de toute l'histoire ! La grande ville de Tombouctou était un phare du savoir. Découvrons cet âge d'or !"
  },
  5: {
    en: "Welcome to the Kingdom of Axum! In the highlands of modern-day Ethiopia and Eritrea, an ancient kingdom rose to become one of the most powerful in the world. Axum built towering stone obelisks, minted its own coins, and was one of the first kingdoms to adopt Christianity. Its merchants traded with Rome, India, and Arabia. Let's discover this incredible East African kingdom!",
    fr: "Bienvenue au Royaume d'Axoum ! Dans les hauts plateaux de l'actuelle Éthiopie et de l'Érythrée, un ancien royaume est devenu l'un des plus puissants du monde. Axoum a érigé d'immenses obélisques en pierre, frappé ses propres monnaies et fut l'un des premiers royaumes à adopter le christianisme. Ses marchands commerçaient avec Rome, l'Inde et l'Arabie. Découvrons cet incroyable royaume d'Afrique de l'Est !"
  },
  6: {
    en: "Welcome to the Songhai Empire! The largest empire in African history stretched across the great bend of the Niger River in West Africa. At its height, it covered over 1.4 million square kilometers! Timbuktu, its great city of learning, attracted scholars from around the world. Under the wise leadership of Askia Muhammad, the empire flourished with trade, justice, and education. Let's explore this mighty empire!",
    fr: "Bienvenue dans l'Empire Songhaï ! Le plus grand empire de l'histoire africaine s'étendait le long du grand méandre du fleuve Niger en Afrique de l'Ouest. À son apogée, il couvrait plus de 1,4 million de kilomètres carrés ! Tombouctou, sa grande cité du savoir, attirait des érudits du monde entier. Sous la sage direction d'Askia Muhammad, l'empire a prospéré grâce au commerce, à la justice et à l'éducation. Explorons ce puissant empire !"
  },
  7: {
    en: "Welcome to the Zulu Kingdom! In the rolling hills of southern Africa, a young warrior named Shaka transformed a small clan into one of the mightiest nations in the continent's history. Through brilliant military tactics and strong leadership, the Zulu Kingdom became a powerful force. The Zulu people showed the world what courage and unity could achieve, even against much stronger enemies. Let's dive into their story!",
    fr: "Bienvenue au Royaume Zoulou ! Dans les collines vallonnées d'Afrique australe, un jeune guerrier nommé Shaka transforma un petit clan en l'une des nations les plus puissantes de l'histoire du continent. Grâce à des tactiques militaires brillantes et un fort leadership, le Royaume Zoulou est devenu une force redoutable. Le peuple zoulou a montré au monde ce que le courage et l'unité pouvaient accomplir, même face à des ennemis bien plus puissants. Plongeons dans leur histoire !"
  },
  8: {
    en: "Welcome to African Independence! In the 20th century, after decades of colonial rule, the people of Africa rose up to reclaim their freedom, dignity, and land. From Kwame Nkrumah in Ghana to Nelson Mandela in South Africa, brave leaders inspired millions. This is the story of one of history's greatest movements for freedom and justice. Let's celebrate the heroes who changed the world!",
    fr: "Bienvenue dans l'Indépendance Africaine ! Au XXe siècle, après des décennies de domination coloniale, les peuples d'Afrique se sont levés pour reconquérir leur liberté, leur dignité et leurs terres. De Kwame Nkrumah au Ghana à Nelson Mandela en Afrique du Sud, des leaders courageux ont inspiré des millions de personnes. C'est l'histoire de l'un des plus grands mouvements pour la liberté et la justice de l'histoire. Célébrons les héros qui ont changé le monde !"
  }
};

export default function AudioNarrator({ levelId }) {
  const [state, setState] = useState("idle"); // idle | playing | paused | loading | unsupported
  const utteranceRef = useRef(null);
  const lang = getLang();

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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-violet-50 to-fuchsia-50 border border-violet-200 rounded-2xl p-4 mb-6 flex items-start gap-3"
    >
      <div className="flex flex-col gap-1 flex-1">
        <p className="text-xs font-bold text-violet-600 uppercase tracking-widest">
          🎙️ {lang === "fr" ? "Écouter l'histoire" : "Listen to the story"}
        </p>
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{story.substring(0, 80)}…</p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {isActive && (
          <button
            onClick={handleStop}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <VolumeX className="w-4 h-4 text-slate-500" />
          </button>
        )}
        <button
          onClick={handlePlay}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl font-bold text-sm transition-all ${
            state === "playing"
              ? "bg-fuchsia-500 text-white shadow-md shadow-fuchsia-200"
              : "bg-violet-500 text-white hover:bg-violet-600 shadow-md shadow-violet-200"
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
    </motion.div>
  );
}