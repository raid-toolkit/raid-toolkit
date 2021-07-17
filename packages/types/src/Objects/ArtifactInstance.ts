import { ArtifactKind, ArtifactSetKind, Faction, Rarity, StatBonus } from '../Enums';

export interface ArtifactStatBonus extends StatBonus {
  glyphPower: number;
  level: number;
}

export interface ArtifactInstance {
  id: number;
  kindId: ArtifactKind;
  setKindId: ArtifactSetKind;
  rank: 1 | 2 | 3 | 4 | 5 | 6;
  rarity: Rarity;
  level: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16;
  faction?: Faction;
  seen: boolean;
  failedUpgrades: number;
  revision: number;
  primaryBonus: ArtifactStatBonus;
  secondaryBonuses: ArtifactStatBonus[];
}
