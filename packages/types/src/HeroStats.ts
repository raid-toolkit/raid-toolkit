import type { StatKindId, Stats, StatSource } from './Enums';

export interface HeroStatsData extends Stats {
  BaseStats: Record<keyof typeof StatKindId, number>;
  StatSources: Record<keyof typeof StatSource, Stats>;
}
