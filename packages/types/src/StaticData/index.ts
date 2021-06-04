import type { StaticArenaData } from './ArenaData';
import type { StaticArtifactData } from './ArtifactData';
import type { StaticHeroData } from './HeroData';
import type { StaticSkillData } from './SkillData';
import type { StaticStageData } from './StageData';

export * from './LocalizedText';

export * from './ArenaData';
export * from './ArtifactData';
export * from './StageData';
export * from './SkillData';
export * from './HeroData';

export interface StaticData {
  arenaData: StaticArenaData;
  stageData: StaticStageData;
  skillData: StaticSkillData;
  artifactData: StaticArtifactData;
  heroData: StaticHeroData;
}
