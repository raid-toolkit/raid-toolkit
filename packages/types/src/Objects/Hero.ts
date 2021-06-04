import { StaticHeroType } from '../StaticData';
import { HeroInstance } from './HeroInstance';
import { HeroSnapshot } from './HeroSnapshot';

export type Hero = HeroSnapshot | StaticHeroType | HeroInstance;

export function isHeroType(value: Hero): value is StaticHeroType {
  return (
    !(value as HeroSnapshot).skills &&
    !(value as HeroInstance).typeId &&
    typeof (value as StaticHeroType).name === 'object'
  );
}

export function isHeroInstance(value: Hero): value is HeroInstance {
  return !!(value as HeroInstance).typeId;
}

export function isHeroSnapshot(value: Hero): value is HeroSnapshot {
  return !!(value as HeroSnapshot).skills;
}
