import type { StatSource, StatKindId } from '../Enums';

export interface AppModelStrings {
  total: string;
  statNames: Record<StatKindId, { long: string; short: string }>;
  statSources: Record<keyof typeof StatSource, string>;
}
