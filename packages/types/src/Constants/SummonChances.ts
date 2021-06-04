import { Rarity, ShardType } from '../Enums';

export interface SummonRule {
  rate: number;
  mercyActivation?: number;
  mercyIncrement?: number;
}

export const SummonChances: Record<ShardType, Partial<Record<Rarity, SummonRule>>> = {
  [ShardType.Mystery]: {
    [Rarity.Common]: { rate: 0.742 },
    [Rarity.Uncommon]: { rate: 0.244 },
    [Rarity.Rare]: { rate: 0.014 },
  },
  [ShardType.Ancient]: {
    [Rarity.Rare]: { rate: 0.915 },
    [Rarity.Epic]: { rate: 0.08, mercyActivation: 20, mercyIncrement: 0.02 },
    [Rarity.Legendary]: { rate: 0.005, mercyActivation: 200, mercyIncrement: 0.05 },
  },
  [ShardType.Void]: {
    [Rarity.Rare]: { rate: 0.915 },
    [Rarity.Epic]: { rate: 0.08, mercyActivation: 20, mercyIncrement: 0.02 },
    [Rarity.Legendary]: { rate: 0.005, mercyActivation: 200, mercyIncrement: 0.05 },
  },
  [ShardType.Sacred]: {
    [Rarity.Epic]: { rate: 0.94 },
    [Rarity.Legendary]: { rate: 0.06, mercyActivation: 12, mercyIncrement: 0.02 },
  },
};
