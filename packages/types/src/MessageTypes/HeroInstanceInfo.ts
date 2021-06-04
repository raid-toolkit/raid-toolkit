import type { HeroMarker } from '../Enums';
import type { HeroInfo } from './HeroInfo';

/**
 * @deprecated
 */
export interface HeroInstanceInfo extends HeroInfo {
  id: number;
  name: string;
  level: number;
  ascended: number;
  marker: HeroMarker;
}
