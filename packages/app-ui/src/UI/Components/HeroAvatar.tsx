import * as React from 'react';
import { Affinity, Rarity } from '@raid-toolkit/types';
import { round } from '@raid-toolkit/utils';
import { RarityColors } from '../Constants/ShardColors';
import { ResourceImage } from './ResourceImage';
import { Stars } from './Stars';

export interface HeroAvatarProps {
  avatarKey: string;
  height?: number;
  rarity: Rarity;
  ascended: number;
  rank: number;
  level: number;
  affinity: Affinity;
}

const ratio = 0.765625;

export const HeroAvatar: React.FC<HeroAvatarProps> = ({
  avatarKey,
  height: h,
  rarity,
  ascended,
  rank,
  level,
  affinity,
}) => {
  const height = h || 182;
  return (
    <div
      style={{
        display: 'block',
        position: 'relative',
        height,
        width: height ? round(height * ratio, 0) : undefined,
        marginRight: 8,
        verticalAlign: 'middle',
        borderLeft: `4px solid ${RarityColors[rarity]}`,
      }}>
      <Stars stars={rank} ascended={ascended} />
      <ResourceImage
        style={{ height, width: height ? round(height * ratio, 0) : undefined }}
        path={`HeroAvatars/${avatarKey}.png`}
      />
      <div
        style={{
          display: 'inline-block',
          position: 'absolute',
          bottom: 0,
          right: 0,
          paddingBottom: 5,
          paddingRight: 2,
          fontWeight: 800,
          verticalAlign: 'center',
          textAlign: 'center',
          fontSize: 24,
          textShadow: '0px 0px 3px black',
          WebkitTextStrokeColor: 'black',
          WebkitTextStrokeWidth: 1,
        }}>
        {level}
      </div>
      <ResourceImage
        // hacky, but w/e
        path={`HeroElements/${Affinity[affinity].toLocaleLowerCase()}.png`}
        style={{
          display: 'inline-block',
          position: 'absolute',
          bottom: 0,
          left: 0,
          paddingBottom: 2,
          paddingLeft: 2,
          verticalAlign: 'center',
        }}
      />
    </div>
  );
};
