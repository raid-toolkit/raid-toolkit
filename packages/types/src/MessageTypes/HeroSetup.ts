import type { HeroMarker, MasteryKindId } from '../Enums';
import type { HeroInfo } from './HeroInfo';
import type { Skill } from './Skill';

/**
 * @deprecated
 */
export interface HeroSetup extends HeroInfo {
  id: number;
  marker: HeroMarker;
  skills: Skill[];
  masteries: MasteryKindId[];
  teams: string[];
}

/**
 * @deprecated
 */
export function isHeroSetup(heroInfo: HeroInfo): heroInfo is HeroSetup {
  return !!(heroInfo as HeroSetup).skills;
}
