import { Rarity, ShardType } from '../Enums';

export const BaseShardChanceByRarity: Record<ShardType, Record<number, number>> = {
  [ShardType.Mystery]: {
    [Rarity.Common]: 0.742,
    [Rarity.Uncommon]: 0.244,
    [Rarity.Rare]: 0.014,
  },
  [ShardType.Ancient]: {
    [Rarity.Rare]: 0.915,
    [Rarity.Epic]: 0.08,
    [Rarity.Legendary]: 0.005,
  },
  [ShardType.Void]: {
    [Rarity.Rare]: 0.915,
    [Rarity.Epic]: 0.08,
    [Rarity.Legendary]: 0.005,
  },
  [ShardType.Sacred]: {
    [Rarity.Epic]: 0.94,
    [Rarity.Legendary]: 0.06,
  },
};
