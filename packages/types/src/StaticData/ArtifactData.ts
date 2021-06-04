import type { StatBonus } from '../Enums';
import type { LocalizedText } from './LocalizedText';

export interface StaticArtifactSetSkillBonus {
  skillTypeId: number;
}

export interface StaticArtifactSetKind {
  setKindId: number;
  artifactCount: number;
  name: LocalizedText;
  statBonuses: StatBonus[];
  skillBonus?: StaticArtifactSetSkillBonus;
  shortDescription: LocalizedText;
  longDescription: LocalizedText;
}

export interface StaticArtifactData {
  setKinds: Record<number, StaticArtifactSetKind>;
}
