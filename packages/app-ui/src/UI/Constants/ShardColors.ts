import { Colors } from '@blueprintjs/core';
import { Rarity } from '@raid-toolkit/types';

export const RarityColors: Record<Rarity, string> = {
  [Rarity.Common]: Colors.GRAY5,
  [Rarity.Uncommon]: Colors.FOREST5,
  [Rarity.Rare]: Colors.COBALT5,
  [Rarity.Epic]: Colors.VIOLET5,
  [Rarity.Legendary]: Colors.GOLD5,
};
