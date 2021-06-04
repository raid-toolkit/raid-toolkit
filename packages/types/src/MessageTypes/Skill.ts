import type { EffectKind, SkillBonusType, SkillVisibility } from '../Enums';

export interface SkillEffect {
  count: number;
  multiplier?: string;
  id: number;
  kindId: EffectKind;
  stack: number;
}

export interface SkillUpgrade {
  type: SkillBonusType;
  value: number;
}

/**
 * @deprecated
 */
export interface Skill {
  typeId: number;
  name: string;
  cooldown: number;
  description: string;
  level: number;
  doesDamage: boolean;
  visibility: SkillVisibility;
  effects: SkillEffect[];
  upgrades?: SkillUpgrade[];
}
