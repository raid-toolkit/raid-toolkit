import * as React from 'react';
import { StaticHeroType } from '@raid-toolkit/types';
import { ResourceImage } from '../Components/ResourceImage';
import { ServiceHost } from '../../ServiceHost';

export const HeroIcon: React.FC<{ heroTypeId: number }> = ({ heroTypeId }: { heroTypeId: number }) => {
  const [heroInfo, setHeroInfo] = React.useState<StaticHeroType | undefined>();
  React.useEffect(() => {
    ServiceHost.appModel.getHeroType(heroTypeId).then(setHeroInfo);
  }, []);

  return React.useMemo(
    () =>
      heroInfo ? (
        <div style={{ display: 'inline-block' }}>
          <ResourceImage
            style={{ maxHeight: 48, paddingRight: 8, verticalAlign: 'middle' }}
            path={`HeroAvatars/${heroInfo.avatarKey}.png`}
          />
          <span className="bp3-text-large">{heroInfo.name}</span>
        </div>
      ) : null,
    [heroInfo]
  );
};
