import * as React from 'react';
import { Overlay, Classes } from '@blueprintjs/core';
import { LoadProgress } from './LoadProgress';

export const ReloadOverlay: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const onBegin = React.useCallback(() => setIsLoading(true), []);
  const onReady = React.useCallback(() => setIsLoading(false), []);
  return (
    <Overlay
      className={Classes.OVERLAY_CONTAINER}
      isOpen={isLoading}
      canEscapeKeyClose={false}
      canOutsideClickClose={false}
      autoFocus
      enforceFocus
    >
      <div
        className={`${[Classes.CARD, Classes.ELEVATION_4].join(' ')}`}
        style={{ width: 400, left: 'calc(50vw - 200px)', marginTop: '10vh', textAlign: 'center' }}
      >
        <h1>Reconnecting...</h1>
        <LoadProgress onBegin={onBegin} onReady={onReady} />
      </div>
    </Overlay>
  );
};
