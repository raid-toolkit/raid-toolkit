import type { Affinity, Faction, HeroRole, Rarity, Stats } from '../Enums';
import { LocalizedText } from './LocalizedText';

export interface StaticHeroType {
  typeId: number;
  name: LocalizedText;
  affinity: Affinity;
  faction: Faction;
  role: HeroRole;
  rarity: Rarity;
  ascended: number;
  modelName: string;
  avatarKey: string;
  skillTypeIds: number[];
  unscaledStats: Stats;
}

export interface StaticHeroData {
  heroTypes: Record<number, StaticHeroType>;
}
