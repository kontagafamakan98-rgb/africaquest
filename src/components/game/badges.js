import {
  BookOpen, CalendarCheck, Compass, Flame, Footprints, Gem, Star, Trophy,
} from "lucide-react";

/**
 * The badges a player can earn, and what each one asks for.
 *
 * The map's badges tab lists them, so the entry file needs the list to draw the
 * tab; the names and descriptions a reader sees are in the translation file, in
 * both languages, while what is written here is only what a badge is worth.
 *
 * It sits outside gameData.js on purpose: that file carries the whole content of
 * the game, and a player waiting for the map should not download two hundred
 * questions to be shown eight badges. Re-exported from there so the screens that
 * already read it keep working.
 */
export const BADGES = [
  { id: "first_step", name: "First Step", icon: Footprints, description: "Complete your first level", requirement: { type: "levels", count: 1 } },
  { id: "rising_star", name: "Rising Star", icon: Star, description: "Earn 10 stars", requirement: { type: "stars", count: 10 } },
  { id: "knowledge_seeker", name: "Knowledge Seeker", icon: BookOpen, description: "Complete 4 levels", requirement: { type: "levels", count: 4 } },
  { id: "history_hero", name: "History Hero", icon: Trophy, description: "Complete all levels", requirement: { type: "levels", count: 20 } },
  { id: "perfect_score", name: "Perfect Score", icon: Gem, description: "Get all questions right in a level", requirement: { type: "perfect", count: 1 } },
  { id: "xp_master", name: "XP Master", icon: Flame, description: "Earn 500 XP", requirement: { type: "xp", count: 500 } },
  { id: "streak_keeper", name: "Streak Keeper", icon: CalendarCheck, description: "Play 3 days in a row", requirement: { type: "streak", count: 3 } },
  { id: "explorer", name: "Explorer", icon: Compass, description: "Complete a level in 6 different regions", requirement: { type: "regions", count: 6 } },
];
