import { LocalizedText } from './LocalizedText';

export interface NamedValue {
  name: LocalizedText;
}

export interface AreaData extends NamedValue {
  areaId: number;
}

export interface RegionData extends NamedValue {
  areaId: number;
  regionId: number;
}

export interface StageData extends NamedValue {
  stageId: number;
  areaId: number;
  regionId: number;
  difficulty: number;
  bossName?: LocalizedText;
}

export interface StaticStageData {
  areas: Record<number, AreaData>;
  regions: Record<number, RegionData>;
  stages: Record<number, StageData>;
}
