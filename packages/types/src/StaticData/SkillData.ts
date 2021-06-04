import { SkillEffect, SkillUpgrade } from '../MessageTypes';
import { SkillVisibility } from '../Enums';
import { LocalizedText } from './LocalizedText';

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
