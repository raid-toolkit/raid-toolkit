import { StaticSkillType } from '../StaticData';

export interface SkillSnapshotData {
  name: string;
  description: string;
  level: number;
}

export type SkillSnapshot = Pick<StaticSkillType, Exclude<keyof StaticSkillType, keyof SkillSnapshotData>> &
  SkillSnapshotData;
