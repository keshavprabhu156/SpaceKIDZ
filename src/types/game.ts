export type GameCategory = "build" | "pilot" | "explore" | "puzzle";

export interface Game {
  id: string;
  title: string;
  description: string;
  category: GameCategory;
  difficulty: 1 | 2 | 3;
  xp: number;
  minGrade: number;
  /** Playable in-browser today; others ship with curriculum content */
  playable: boolean;
  icon: string;
}
