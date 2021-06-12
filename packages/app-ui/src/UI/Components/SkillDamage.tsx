import * as React from 'react';
import {
  Skill,
  EffectKind,
  MasteryKindId,
  HeroSetup,
  StatusEffect,
  Hero,
  HeroSnapshot,
  SkillSnapshot,
} from '@raid-toolkit/types';
import math from 'math-expression-evaluator';
import { Button, Label, NumericInput } from '@blueprintjs/core';
import { round } from '@raid-toolkit/utils';
import { Classes, Popover2 } from '@blueprintjs/popover2';
import { calculateDamage, CalculateDamageMode, defaultVariableValues, Token, variableTokens } from './CalculateDamage';
import { StatusEffects } from './StatusEffects';
import { damageMasteries, Masteries } from './Masteries';

export interface SkillDamageProps {
  skill: SkillSnapshot;
  hero: HeroSnapshot;
}

const statusEffects: StatusEffect[] = [
  StatusEffect.IncreaseDamageTaken,
  StatusEffect.IncreaseDamageTaken2,
  StatusEffect.StatusIncreaseAttack,
  StatusEffect.StatusIncreaseAttack2,
  StatusEffect.StatusIncreaseCriticalChance,
  StatusEffect.StatusIncreaseCriticalChance2,
  StatusEffect.StatusIncreaseCriticalDamage,
  StatusEffect.StatusIncreaseCriticalDamage2,
  StatusEffect.StatusIncreaseDefence,
  StatusEffect.StatusIncreaseDefence2,
];

const DamageRange: React.FC<{ min: number; avg: number; max: number; style?: React.CSSProperties }> = ({
  min,
  avg,
  max,
  style,
}) => (
  <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', ...style }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h4>Normal</h4>
      <div
        style={{
          width: 0,
          height: 0,
          border: '10px solid transparent',
          borderTopColor: 'red',
        }}
      />
      <div style={{ fontSize: 16 }}>{round(min, 0).toLocaleString()}</div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h4>Average</h4>
      <div
        style={{
          width: 0,
          height: 0,
          border: '10px solid transparent',
          borderTopColor: 'yellow',
        }}
      />
      <div style={{ fontSize: 16 }}>{round(avg, 0).toLocaleString()}</div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h4>Max</h4>
      <div
        style={{
          width: 0,
          height: 0,
          border: '10px solid transparent',
          borderTopColor: 'lime',
        }}
      />
      <div style={{ fontSize: 16 }}>{round(max, 0).toLocaleString()}</div>
    </div>
  </div>
);

export const SkillDamage: React.FC<SkillDamageProps> = ({ skill, hero }) => {
  const [tokens, setTokens] = React.useState<Token[]>([]);
  const [inputValues, setInputValues] = React.useState<Record<string, number>>({});
  const [buffs, setBuffs] = React.useState<StatusEffect[]>([]);
  const [masteries, setMasteries] = React.useState<MasteryKindId[]>([]);
  const masteryOptions = React.useMemo(
    () => damageMasteries.map((entry) => entry[0]).filter((id) => hero.masteries.includes(id)),
    [hero]
  );
  const stats = React.useMemo(() => {
    const adjustedStats = { ...hero.stats };
    for (const buff of buffs) {
      switch (buff) {
        case StatusEffect.StatusIncreaseAttack:
          adjustedStats.Attack += adjustedStats.BaseStats.Attack * 0.25;
          break;
        case StatusEffect.StatusIncreaseAttack2:
          adjustedStats.Attack += adjustedStats.BaseStats.Attack * 0.5;
          break;
        case StatusEffect.StatusIncreaseDefence:
          adjustedStats.Defense += adjustedStats.BaseStats.Defense * 0.25;
          break;
        case StatusEffect.StatusIncreaseDefence2:
          adjustedStats.Defense += adjustedStats.BaseStats.Defense * 0.5;
          break;
        case StatusEffect.StatusIncreaseCriticalChance:
          adjustedStats.CriticalChance += adjustedStats.BaseStats.CriticalChance * 0.15;
          break;
        case StatusEffect.StatusIncreaseCriticalChance2:
          adjustedStats.CriticalChance += adjustedStats.BaseStats.CriticalChance * 0.3;
          break;
        case StatusEffect.StatusIncreaseCriticalDamage:
          adjustedStats.CriticalDamage += adjustedStats.BaseStats.CriticalDamage * 0.15;
          break;
        case StatusEffect.StatusIncreaseCriticalDamage2:
          adjustedStats.CriticalDamage += adjustedStats.BaseStats.CriticalDamage * 0.3;
          break;
      }
    }
    return adjustedStats;
  }, [hero.stats, buffs]);

  React.useEffect(() => {
    const varsUsed: Token[] = [];
    const inputValueDefaults: Record<string, number> = {};
    const variableProxy = new Proxy(hero.stats, {
      get(target, key: string, receiver) {
        if (Reflect.has(target, key)) {
          return Reflect.get(target, key, receiver);
        }

        const token = variableTokens.find(({ value }) => value === key);
        if (token) {
          token.visible !== false && varsUsed.push(token);
          inputValueDefaults[token.value] = token.default ?? 0;
        }
        return inputValues[key] ?? defaultVariableValues[key];
      },
    });
    skill.effects
      .filter((effect) => [EffectKind.Damage, EffectKind.DamageMultiplier].includes(effect.kindId))
      .map((effect) => {
        try {
          if (!effect.multiplier) {
            return 0;
          }
          return math.eval(effect.multiplier, [], variableProxy);
        } catch (e) {
          console.warn(e);
          return 0;
        }
      });
    setTokens(varsUsed);
    setInputValues(inputValueDefaults);
  }, [skill]);

  const onValueChange = React.useCallback(
    (valueAsNumber: number, _valueAsString: string, inputElement: HTMLInputElement | null) => {
      if (!inputElement) {
        return;
      }
      const token = inputElement.placeholder;
      if (!token) {
        return;
      }
      setInputValues((state) => ({ ...state, [token]: valueAsNumber }));
    },
    [setInputValues]
  );

  const inputs = React.useMemo(() => {
    const result: JSX.Element[] = [];
    for (const token of tokens) {
      result.push(
        <Label key={`input_${token.token}`}>
          {token.show}
          :
          <NumericInput
            placeholder={token.value}
            key={`${skill.typeId}_${token.value}`}
            defaultValue={inputValues[token.value] ?? token.default ?? 0}
            onValueChange={onValueChange}
          />
        </Label>
      );
    }
    return result;
  }, [tokens, inputValues]);

  const detailsCallout = React.useMemo(
    () => (
      <div style={{ padding: 10, width: 300 }}>
        {inputs ? (
          <>
            <h2>Damage Parameters</h2>
            <div>
              <Masteries items={masteryOptions} enabled={masteries} onChanged={setMasteries} />
            </div>
            <div>
              <StatusEffects items={statusEffects} enabled={buffs} onChanged={setBuffs} />
            </div>
            {inputs}
          </>
        ) : null}
        <h3>Multipliers</h3>
        {skill.effects
          .filter((effect) => [EffectKind.Damage, EffectKind.DamageMultiplier].includes(effect.kindId))
          .map((effect, idx) => (
            <div key={`effect_${effect.id}_${idx}`}>{effect.multiplier}</div>
          ))}
      </div>
    ),
    [inputs, buffs, setBuffs, masteries, setMasteries, masteryOptions]
  );

  const [damageMin, damageAvg, damageMax] = React.useMemo(() => {
    const values = { ...stats, ...inputValues, TotalDamage: 0 };
    return [
      calculateDamage(skill, values, buffs, masteries, { mode: CalculateDamageMode.Min }),
      calculateDamage(skill, values, buffs, masteries, { mode: CalculateDamageMode.Average }),
      calculateDamage(skill, values, buffs, masteries, { mode: CalculateDamageMode.Max }),
    ];
  }, [inputValues, stats, buffs, masteries]);

  return (
    <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
      <DamageRange style={{ width: 400 }} min={damageMin} avg={damageAvg} max={damageMax} />
      <Popover2
        interactionKind="click"
        autoFocus
        usePortal={false}
        placement="bottom"
        popoverClassName={Classes.POPOVER2_CONTENT}
        content={detailsCallout}>
        <Button icon="calculator" />
      </Popover2>
    </div>
  );
};
