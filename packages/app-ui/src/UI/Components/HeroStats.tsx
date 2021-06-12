import * as React from 'react';
import { HTMLTable } from '@blueprintjs/core';
import { round } from '@raid-toolkit/utils';
import { StatKindId, AppModelStrings, HeroStatsData, StatSource } from '@raid-toolkit/types';
import { useStrings } from '../GetStrings';

export interface HeroStatsProps {
  stats: HeroStatsData;
  showDetails?: boolean;
}

const roundBy: Record<StatKindId, number> = {
  [StatKindId.Accuracy]: 0,
  [StatKindId.Attack]: 0,
  [StatKindId.CriticalChance]: 2,
  [StatKindId.CriticalDamage]: 2,
  [StatKindId.CriticalHeal]: 2,
  [StatKindId.Defense]: 0,
  [StatKindId.Health]: 0,
  [StatKindId.Resistance]: 0,
  [StatKindId.Speed]: 2,
};

const StatDetailRow: React.FC<{ stats: HeroStatsData; stat: StatKindId; appStrings: AppModelStrings }> = React.memo(
  ({ stats, stat, appStrings }) => {
    const statName = StatKindId[stat] as keyof typeof StatKindId;
    const statDisplayName = appStrings.statNames[stat].long;
    const roundValue = roundBy[stat];
    return (
      <tr>
        <td>
          <h3 style={{ marginBlockEnd: 0 }}>{statDisplayName}</h3>
        </td>
        <td style={{ fontSize: '1.17em' }}>{round(stats.StatSources.Base[statName], roundValue).toLocaleString()}</td>
        <td style={{ fontSize: '1.17em' }}>{round(stats.StatSources.Gear[statName], roundValue).toLocaleString()}</td>
        <td style={{ fontSize: '1.17em' }}>
          {round(stats.StatSources.GearSets[statName], roundValue).toLocaleString()}
        </td>
        <td style={{ fontSize: '1.17em' }}>
          {round(stats.StatSources.GreatHall[statName], roundValue).toLocaleString()}
        </td>
        <td style={{ fontSize: '1.17em' }}>{round(stats.StatSources.Arena[statName], roundValue).toLocaleString()}</td>
        <td style={{ fontSize: '1.17em' }}>{round(stats.StatSources.Clan[statName], roundValue).toLocaleString()}</td>
        <td style={{ fontSize: '1.17em' }}>{round(stats[statName], roundValue).toLocaleString()}</td>
      </tr>
    );
  }
);

const StatCellPair: React.FC<{ stats: HeroStatsData; stat: StatKindId; appStrings: AppModelStrings }> = React.memo(
  ({ stats, stat, appStrings }) => {
    const statName = StatKindId[stat] as keyof typeof StatKindId;
    const statDisplayName = appStrings.statNames[stat].short;
    const roundValue = roundBy[stat];
    return (
      <>
        <td>
          <h5>{statDisplayName}</h5>
        </td>
        <td style={{ fontSize: '0.83em' }}>{round(stats[statName], roundValue).toLocaleString()}</td>
      </>
    );
  }
);

export const HeroStats: React.FC<HeroStatsProps> = ({ stats, showDetails }) => {
  const appStrings = useStrings();
  if (!appStrings) {
    return null;
  }
  return !showDetails ? (
    <HTMLTable small striped>
      <tbody>
        <tr>
          <StatCellPair stats={stats} stat={StatKindId.Health} appStrings={appStrings} />
          <StatCellPair stats={stats} stat={StatKindId.Attack} appStrings={appStrings} />
          <StatCellPair stats={stats} stat={StatKindId.Defense} appStrings={appStrings} />
        </tr>
        <tr>
          <StatCellPair stats={stats} stat={StatKindId.Speed} appStrings={appStrings} />
          <StatCellPair stats={stats} stat={StatKindId.CriticalChance} appStrings={appStrings} />
          <StatCellPair stats={stats} stat={StatKindId.CriticalDamage} appStrings={appStrings} />
        </tr>
        <tr>
          <StatCellPair stats={stats} stat={StatKindId.Resistance} appStrings={appStrings} />
          <StatCellPair stats={stats} stat={StatKindId.Accuracy} appStrings={appStrings} />
        </tr>
      </tbody>
    </HTMLTable>
  ) : (
    <HTMLTable small striped>
      <thead>
        <tr>
          <th>
            <h3 style={{ marginBlockEnd: 0 }}>Stat</h3>
          </th>
          <th>
            <h3 style={{ marginBlockEnd: 0 }}>{appStrings.statSources.Base}</h3>
          </th>
          <th>
            <h3 style={{ marginBlockEnd: 0 }}>{appStrings.statSources.Gear}</h3>
          </th>
          <th>
            <h3 style={{ marginBlockEnd: 0 }}>{appStrings.statSources.GearSets}</h3>
          </th>
          <th>
            <h3 style={{ marginBlockEnd: 0 }}>{appStrings.statSources.GreatHall}</h3>
          </th>
          <th>
            <h3 style={{ marginBlockEnd: 0 }}>{appStrings.statSources.Arena}</h3>
          </th>
          <th>
            <h3 style={{ marginBlockEnd: 0 }}>{appStrings.statSources.Clan}</h3>
          </th>
          <th>
            <h3 style={{ marginBlockEnd: 0 }}>{appStrings.total}</h3>
          </th>
        </tr>
      </thead>
      <tbody>
        <StatDetailRow appStrings={appStrings} stats={stats} stat={StatKindId.Health} />
        <StatDetailRow appStrings={appStrings} stats={stats} stat={StatKindId.Attack} />
        <StatDetailRow appStrings={appStrings} stats={stats} stat={StatKindId.Defense} />
        <StatDetailRow appStrings={appStrings} stats={stats} stat={StatKindId.Speed} />
        <StatDetailRow appStrings={appStrings} stats={stats} stat={StatKindId.CriticalChance} />
        <StatDetailRow appStrings={appStrings} stats={stats} stat={StatKindId.CriticalDamage} />
        <StatDetailRow appStrings={appStrings} stats={stats} stat={StatKindId.Resistance} />
        <StatDetailRow appStrings={appStrings} stats={stats} stat={StatKindId.Accuracy} />
      </tbody>
    </HTMLTable>
  );
};
