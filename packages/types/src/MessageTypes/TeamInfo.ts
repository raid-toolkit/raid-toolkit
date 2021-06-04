import { HeroInstanceInfo } from './HeroInstanceInfo';

/**
 * @deprecated
 */
export interface TeamInfo {
  stageId: number;
  areaId: number;
  regionId: number;
  areaName: string;
  regionName: string;
  stageName: string;
  team: HeroInstanceInfo[];
}
