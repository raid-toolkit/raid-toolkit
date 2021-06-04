import { StatKindId } from './StatKindId';

export interface StatBonus {
  kind: StatKindId;
  absolute: boolean;
  value: number;
}
