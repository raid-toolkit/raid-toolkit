import { Icon, IconName, Intent, ProgressBar, Button } from '@blueprintjs/core';

import { ErrorTags, isApplicationError } from '@raid-toolkit/utils';
import * as React from 'react';
import { ServiceHost } from '../ServiceHost';
import { UpdateButton } from './UpdateButton';

interface Progress {
  n: number;
  m: number;
  step: string;
}

export interface LoadProgressProps {
  onBegin?(): void;
  onReady?(): void;
}

export const LoadProgress: React.FC<LoadProgressProps> = (props) => {
  const [progress, setProgress] = React.useState<Progress | undefined>();
  const [error, setError] = React.useState<string | undefined>();
  const [errorIcon, setErrorIcon] = React.useState<IconName>('error');

  const closeApp = React.useCallback(() => {
    ServiceHost.appHost.close();
  }, []);

  const reinitialize = React.useCallback(() => {
    setError(undefined);
    setErrorIcon('error');
  }, []);

  React.useEffect(() => {
    function onLoadProgress(n: number, m: number, step: string) {
      setProgress({ n, m, step });
      props.onBegin?.();
    }
    function onReady() {
      setProgress(undefined);
      props.onReady?.();
    }
    function onError(e: Error) {
      if (isApplicationError(e)) {
        setError(e.message ?? 'An error occurred');
        if (e.errorTag === ErrorTags.VersionMismatch) {
          setErrorIcon('outdated');
        } else if (e.errorTag === ErrorTags.AccessDenied) {
          setErrorIcon('blocked-person');
        } else {
          setErrorIcon('error');
        }
      } else {
        setError(e.message ?? 'An error occurred');
        setErrorIcon('error');
      }
    }

    // TODO: clean up initialization
    onReady();
    // ServiceHost.appModel.on('load-progress', onLoadProgress);
    // ServiceHost.appModel.on('ready', onReady);
    // ServiceHost.appModel.on('load-error', onError);
    // return () => {
    //   ServiceHost.appModel.off('load-progress', onLoadProgress);
    //   ServiceHost.appModel.off('ready', onReady);
    //   ServiceHost.appModel.on('load-error', onError);
    // };
  }, []);

  const contents = React.useMemo(() => {
    if (error) {
      return (
        <>
          <Icon icon={errorIcon} iconSize={100} intent={Intent.DANGER} style={{ paddingBottom: 10 }} />
          <h4>{error}</h4>
          <Button icon="cross" text="Close" intent={Intent.DANGER} onClick={closeApp} />
          <Button icon="refresh" text="Retry" intent={Intent.PRIMARY} onClick={reinitialize} />
          {errorIcon !== 'blocked-person' ? <UpdateButton showProgress /> : null}
        </>
      );
    }
    return (
      <div style={{ textAlign: 'left' }}>
        <ProgressBar value={progress ? progress.n / progress.m : undefined} intent={Intent.PRIMARY} />
        <h4>{progress?.step}</h4>
      </div>
    );
  }, [error, errorIcon, progress]);
  return contents;
};
