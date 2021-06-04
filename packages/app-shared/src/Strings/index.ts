import { Faction, HeroRole, Rarity, ShardType, StatKindId } from '@raid-toolkit/types';

/**
 * TODO: Move this to static-data
 */

/**
 * @deprecated
 */
const rarity: { [key in Rarity]: string } = {
  [Rarity.Common]: 'Common',
  [Rarity.Uncommon]: 'Uncommon',
  [Rarity.Rare]: 'Rare',
  [Rarity.Epic]: 'Epic',
  [Rarity.Legendary]: 'Legendary',
};

/**
 * @deprecated
 */
const shardType: { [key in ShardType]: string } = {
  [ShardType.Mystery]: 'Mystery',
  [ShardType.Ancient]: 'Ancient',
  [ShardType.Void]: 'Void',
  [ShardType.Sacred]: 'Sacred',
};

/**
 * @deprecated
 */
const faction: { [key in Faction]: string } = {
  [Faction.BannerLords]: 'Banner Lords',
  [Faction.Barbarians]: 'Barbarians',
  [Faction.DarkElves]: 'Dark Elves',
  [Faction.Demonspawn]: 'Demonspawn',
  [Faction.Dwarves]: 'Dwarves',
  [Faction.HighElves]: 'High Elves',
  [Faction.KnightRevenant]: 'Knight Revenant',
  [Faction.Lizardmen]: 'Lizardmen',
  [Faction.OgrynTribes]: 'Ogryn Tribes',
  [Faction.Orcs]: 'Orcs',
  [Faction.SacredOrder]: 'Sacred Order',
  [Faction.ShadowKin]: 'Shadow Kin',
  [Faction.Skinwalkers]: 'Skinwalkers',
  [Faction.UndeadHordes]: 'Undead Hordes',
};

/**
 * @deprecated
 */
const stat: { [key in StatKindId]: string } = {
  [StatKindId.Accuracy]: 'Accuracy',
  [StatKindId.Attack]: 'Attack',
  [StatKindId.CriticalChance]: 'Critical Chance',
  [StatKindId.CriticalDamage]: 'Critical Damage',
  [StatKindId.CriticalHeal]: 'Critical Heal',
  [StatKindId.Defense]: 'Defense',
  [StatKindId.Health]: 'Health',
  [StatKindId.Resistance]: 'Resistance',
  [StatKindId.Speed]: 'Speed',
};

/**
 * @deprecated
 */
const role: { [key in HeroRole]: string } = {
  [HeroRole.Attack]: 'Attack',
  [HeroRole.Defense]: 'Defense',
  [HeroRole.HP]: 'HP',
  [HeroRole.Support]: 'Support',
};

/**
 * @deprecated
 */
export const EnumStrings = {
  rarity,
  faction,
  shardType,
  stat,
  role,
};
