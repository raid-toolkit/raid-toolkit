import { Stats } from '../Enums';

export interface ArenaLeague {
  id: number;
  statBonus: Stats;
}

export interface StaticArenaData {
  leagues: Record<number, ArenaLeague>;
}
