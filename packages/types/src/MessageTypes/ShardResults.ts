import type { Rarity, ShardType } from '../Enums';
import type { StaticHeroType } from '../StaticData';

export interface SummonRateInfo {
  lastHero: StaticHeroType;
  openedSinceRarity: number;
  summonChance: number;
  baseChance: number;
}

export interface MercyShardInfo extends SummonRateInfo {
  type: ShardType;
  rarity: Rarity;
}

export interface ShardStatistics {
  type: ShardType;
  rarity: Rarity;
  count: number;
}

/**
 * @deprecated
 */
export type ShardResults = Record<ShardType, Record<Rarity, SummonRateInfo>>;
