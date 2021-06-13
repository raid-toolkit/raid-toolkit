import * as React from 'react';
import { Card } from '@blueprintjs/core';
import { EnumStrings } from '@raid-toolkit/app-shared';
import { Hero, HeroInfo, isHeroInstance, isHeroSnapshot, isHeroType } from '@raid-toolkit/types';
import { HeroAvatar } from './HeroAvatar';
import { HeroStats } from './HeroStats';

export const MIN_ITEM_WIDTH = 450;
export const ITEM_MARGIN = 5;
export const ITEM_HEIGHT = 128;
export const ITEM_OUTER_HEIGHT = ITEM_HEIGHT + 2 * ITEM_MARGIN;

export interface HeroCardProps {
  hero: Hero;
  onSelect?: (setup: Hero) => void;
}

export const HeroCard: React.FC<HeroCardProps> = ({ onSelect, hero }) => {
  const onClick = React.useCallback<React.MouseEventHandler<HTMLDivElement>>(() => {
    onSelect?.(hero);
  }, [hero, onSelect]);
  const heroType = React.useMemo(() => (isHeroInstance(hero) ? hero.type : hero), [hero]);
  const avatar = React.useMemo(() => {
    if (isHeroInstance(hero)) {
      return (
        <HeroAvatar
          ascended={hero.type.ascended}
          avatarKey={hero.type.avatarKey}
          height={ITEM_HEIGHT}
          level={hero.level}
          rank={hero.rank}
          rarity={hero.type.rarity}
          affinity={hero.type.affinity}
        />
      );
    } 
      return (
        <HeroAvatar
          ascended={hero.ascended}
          avatarKey={hero.avatarKey}
          height={ITEM_HEIGHT}
          level={60}
          rank={6}
          rarity={hero.rarity}
          affinity={hero.affinity}
        />
      );
    
  }, [hero]);

  return (
    <Card
      elevation={2}
      style={{ margin: ITEM_MARGIN, padding: 0, height: ITEM_HEIGHT, width: MIN_ITEM_WIDTH }}
      interactive
      onClick={onClick}
    >
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        {avatar}
        <div style={{ flex: 1 }}>
          <h3 style={{ marginBottom: 0 }}>{hero.name}</h3>
          <h5 style={{ marginTop: 0, opacity: 0.6 }}>{EnumStrings.role[heroType.role]}</h5>
          {
            // TODO: implement stats for hero types
            isHeroSnapshot(hero) ? <HeroStats stats={hero.stats} /> : null
          }
        </div>
      </div>
    </Card>
  );
};
