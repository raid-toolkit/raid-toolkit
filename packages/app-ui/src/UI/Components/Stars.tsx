import * as React from 'react';
import { ResourceImage } from './ResourceImage';

export const Stars: React.FC<{ stars: number; ascended: number }> = ({ stars, ascended }) => {
  const items: JSX.Element[] = [];
  const starStyle: React.CSSProperties = {
    height: 22,
    marginLeft: -12,
  };
  for (let n = 1; n <= stars; ++n) {
    items.push(
      <ResourceImage
        style={starStyle}
        key={`star_${n}`}
        path={n <= ascended ? 'UIShared/awaken_star.png' : 'UIShared/regular_star.png'}
      />
    );
  }
  return <div style={{ position: 'absolute', left: 12, top: 0 }}>{...items}</div>;
};
