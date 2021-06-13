import { excludeUndefined } from '@raid-toolkit/utils';
import { Skill, EffectKind, HeroStatsData, MasteryKindId, SkillBonusType, StatusEffect } from '@raid-toolkit/types';
import math from 'math-expression-evaluator';
import { damageMasteries } from './Masteries';

export enum CalculateDamageMode {
  Min,
  Max,
  Average,
}
export interface CalculateDamageOptions {
  mode: CalculateDamageMode;
}

export interface Token {
  token: string;
  show: string;
  type: 3;
  value: string;
  default?: number;
  visible?: boolean;
}

export const variableTokens: Token[] = [
  { token: 'ATK', show: 'ATK', type: 3, value: 'Attack' },
  { token: 'DEF', show: 'DEF', type: 3, value: 'Defense' },
  { token: 'HP', show: 'HP', type: 3, value: 'Health' },
  { token: 'SPD', show: 'SPD', type: 3, value: 'Speed' },
  { token: 'TRG_HP', type: 3, show: 'Target Max HP', value: 'TargetHealth', default: 50000 },
  { token: 'BUFF_COUNT', type: 3, show: 'Buff Count', value: 'BuffCount', default: 4 },
  { token: 'TRG_DEBUFF_COUNT', type: 3, show: 'Target Debuff Count', value: 'NumTargetDebuffs', default: 5 },
  { token: 'EXCESSIVE_DAMAGE', type: 3, show: 'Surplus Damage', value: 'SurplusDamage', visible: false, default: 0 },
  { token: 'DMG_MUL', type: 3, show: 'Total Damage', value: 'TotalDamage', visible: false },
  { token: 'DEALT_DMG', type: 3, show: 'Dealt Damage', value: 'TotalDamage', visible: false }, // TODO: Adjust this based on target stats when they are added
  { token: 'HP_PERC', type: 3, show: 'HP Percentage', value: 'HPPercent', default: 1 },
  { token: 'SKILL_USED_COUNT', type: 3, show: '# of Times Skill Used', value: 'SkillUsedCount', default: 0 },
  { token: 'REL_TRG_HP_PERC', type: 3, show: 'Target HP %', value: 'TargetHPPerc', default: 0.5 },
  { token: 'deadAlliesCount', type: 3, show: 'Allies Dead', value: 'AlliesDeadCount', default: 0, visible: true },
  { token: 'aliveAlliesCount', type: 3, show: 'Allies Alive', value: 'AlliesAliveCount', default: 4, visible: true },
  { token: 'producerIsDead', type: 3, show: 'Producer is dead', value: 'ProducerIsDead', default: 0, visible: false },
  {
    token: '!producerIsDead',
    type: 3,
    show: 'Producer is alive',
    value: 'ProducerIsAlive',
    default: 1,
    visible: false,
  },
];
math.addToken(variableTokens);

export const defaultVariableValues: any = {};
for (const token of variableTokens) {
  if (token.default !== undefined) {
    defaultVariableValues[token.value] = token.default;
  }
}

export function calculateDamage<T extends HeroStatsData>(
  skill: Skill,
  stats: T,
  buffs: StatusEffect[],
  masteries: MasteryKindId[],
  options: CalculateDamageOptions
): number {
  const values: any = { ...defaultVariableValues, ...stats, TotalDamage: 0 };
  values.CriticalChance = Math.min(values.CriticalChance, 100);
  let scale: number = 1;
  switch (options.mode) {
    case CalculateDamageMode.Min:
      break;
    case CalculateDamageMode.Max:
      scale = 1 + values.CriticalDamage / 100;
      break;
    case CalculateDamageMode.Average:
      scale = 1 + (values.CriticalChance / 100) * (values.CriticalDamage / 100);
      break;
  }
  for (const effect of skill.effects) {
    if (!effect.multiplier) {
      continue;
    }
    try {
      if (effect.kindId === EffectKind.Damage) {
        values.TotalDamage += parseFloat(math.eval(effect.multiplier, [], values)) * effect.count * scale;
      }
      if (effect.kindId === EffectKind.DamageMultiplier) {
        values.TotalDamage += parseFloat(math.eval(effect.multiplier, [], values)) * effect.count;
      }
    } catch (e) {
      console.warn(e);
    }
  }
  if (skill.upgrades) {
    for (let n = 0; n < skill.level - 2; ++n) {
      // lvl starts at 1, upgrades start at 2
      if (skill.upgrades[n] && skill.upgrades[n].type === SkillBonusType.Damage) {
        values.TotalDamage += values.TotalDamage * skill.upgrades[n].value;
      }
    }
  }
  if (buffs.includes(StatusEffect.IncreaseDamageTaken)) {
    values.TotalDamage *= 1.15;
  } else if (buffs.includes(StatusEffect.IncreaseDamageTaken2)) {
    values.TotalDamage *= 1.25;
  }
  const additionalDmg =
    1 +
    excludeUndefined(masteries.map((id) => damageMasteries.find((entry) => entry[0] === id)?.[1])).reduce(
      (sum, value) => sum + value,
      0
    );
  values.TotalDamage *= additionalDmg;
  return values.TotalDamage;
}
