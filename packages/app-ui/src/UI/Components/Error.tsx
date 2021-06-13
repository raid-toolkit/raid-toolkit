import * as React from 'react';
import { Icon, IconName, Intent, ProgressBar, Button } from '@blueprintjs/core';

import { ErrorTags, isApplicationError } from '@raid-toolkit/utils';
import { UpdateButton } from '../UpdateButton';
import { ServiceHost } from '../../ServiceHost';

export const ErrorMessage: React.FC<{ error: Error }> = ({ error }) => {
  const closeApp = React.useCallback(() => {
    ServiceHost.appHost.close();
  }, []);

  const reinitialize = React.useCallback(() => {
    ServiceHost.appHost
      .init(true)
      .then(() => {
        window.location.reload();
      })
      .catch((e) => {
        console.error(e);
      });
  }, []);

  const [errorIcon, errorMessage] = React.useMemo(() => {
    let errorIcon: IconName = 'error';
    const errorMessage = error.message ?? 'An error occurred';
    if (isApplicationError(error)) {
      if (error.errorTag === ErrorTags.VersionMismatch) {
        errorIcon = 'outdated';
      } else if (error.errorTag === ErrorTags.AccessDenied) {
        errorIcon = 'blocked-person';
      } else {
        errorIcon = 'error';
      }
    }
    return [errorIcon, errorMessage];
  }, [error]) as [IconName, string];
  return (
    <div style={{ textAlign: 'center' }}>
      <Icon icon={errorIcon} iconSize={100} intent={Intent.DANGER} style={{ paddingBottom: 10 }} />
      <h4>{errorMessage}</h4>
      <Button icon="cross" text="Close" intent={Intent.DANGER} onClick={closeApp} />{' '}
      <Button icon="refresh" text="Reload" intent={Intent.PRIMARY} onClick={reinitialize} />{' '}
      {errorIcon !== 'blocked-person' ? <UpdateButton showProgress /> : null}
    </div>
  );
};
