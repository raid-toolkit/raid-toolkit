import * as React from 'react';
import { HeroInstanceInfo } from '@raid-toolkit/types';
import { ResourceImage } from '../Components/ResourceImage';

export const HeroInstance: React.FC<HeroInstanceInfo> = (props: HeroInstanceInfo) => (
  <div style={{ display: 'inline-block', textAlign: 'center' }}>
    <ResourceImage
      style={{ maxHeight: 128, paddingRight: 8, verticalAlign: 'middle' }}
      path={`HeroAvatars/${props.avatarKey}`}
    />
    <p className="bp3-text-small">{props.name}</p>
  </div>
  );
