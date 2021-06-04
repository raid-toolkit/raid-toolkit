import type { SkillEffect, SkillUpgrade } from '../MessageTypes';
import type { SkillVisibility } from '../Enums';
import type { LocalizedText } from './LocalizedText';

export interface StaticSkillType {
  typeId: number;
  name: LocalizedText;
  cooldown: number;
  description: LocalizedText;
  doesDamage: boolean;
  visibility: SkillVisibility;
  effects: SkillEffect[];
  upgrades?: SkillUpgrade[];
}

export interface StaticSkillData {
  skillTypes: Record<number, StaticSkillType>;
}
