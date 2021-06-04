import type { Affinity, Faction, Rarity, HeroRole } from '../Enums';
import type { HeroStatsData } from '../HeroStats';
import type { Skill } from './Skill';

/**
 * @deprecated
 */
export interface HeroInfo {
  typeId: number;
  avatarKey: string;
  affinity: Affinity;
  level: number;
  rank: number;
  ascended: number;
  rarity: Rarity;
  role: HeroRole;
  faction: Faction;
  name: string;
  stats: HeroStatsData;
  skills: Skill[];
}
