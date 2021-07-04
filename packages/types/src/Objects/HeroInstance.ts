import { ArtifactKind, HeroMarker, MasteryKindId } from '../Enums';
import { StaticHeroType } from '../StaticData';

export type EquippedArtifactsByKind = Partial<Record<ArtifactKind, number>>;

export interface HeroInstance {
  id: number;
  name: string;
  typeId: number;
  type: StaticHeroType;
  level: number;
  rank: number;
  exp: number;
  fullExp: number;
  deleted?: boolean;
  locked?: boolean;
  inVault?: boolean;
  marker: HeroMarker;
  masteries: MasteryKindId[];
  equippedArtifactIds: EquippedArtifactsByKind;
  skillLevelsByTypeId: Record<number, number>;
}
