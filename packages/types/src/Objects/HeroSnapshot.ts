import { HeroStatsData } from '../HeroStats';
import { HeroInstance } from './HeroInstance';
import { SkillSnapshot } from './SkillSnapshot';

export interface HeroSnapshot extends HeroInstance {
  name: string;
  skills: SkillSnapshot[];
  stats: HeroStatsData;
  teams: string[];
}
