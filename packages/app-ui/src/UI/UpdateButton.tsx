import * as React from 'react';
import { Button, ButtonGroup } from '@blueprintjs/core';
import { Classes, Popover2 } from '@blueprintjs/popover2';
import { UpdateState, AutoUpdateState } from '@raid-toolkit/app-shared';
import { ServiceHost } from '../ServiceHost';

export interface UpdateButtonProps {
  showProgress?: boolean;
}

export const UpdateButton: React.FC<UpdateButtonProps> = ({ showProgress }: UpdateButtonProps) => {
  const [updateState, setUpdateState] = React.useState<UpdateState | undefined>();

  React.useEffect(() => {
    ServiceHost.appHost.getUpdateState().then(setUpdateState);
    ServiceHost.appHost.on('updater-state-changed', setUpdateState);
    return () => {
      ServiceHost.appHost.off('updater-state-changed', setUpdateState);
    };
  }, []);

  const installUpdate = React.useCallback(() => {
    ServiceHost.appHost.installUpdate();
  }, []);

  const checkForUpdates = React.useCallback(() => ServiceHost.appHost.checkForUpdates(), []);

  if (!updateState) {
    return <></>;
  }
  if (updateState.state !== AutoUpdateState.UpdateDownloaded) {
    if (!showProgress) {
      return <></>;
    }
    switch (updateState.state) {
      case AutoUpdateState.Initializing:
        return (
          <Button
            intent="primary"
            icon="refresh"
            text="Check for updates"
            className="nodragRegion"
            onClick={checkForUpdates}
          />
        );
      case AutoUpdateState.CheckingForUpdate:
        return (
          <Button intent="primary" icon="refresh" text="Checking for updates..." disabled className="nodragRegion" />
        );
      case AutoUpdateState.UpdateAvailable:
        return (
          <Button intent="success" icon="download" text="Downloading update..." disabled className="nodragRegion" />
        );
      case AutoUpdateState.Error:
        return (
          <Button intent="danger" icon="error" text="Error downloading update" disabled className="nodragRegion" />
        );
      default:
        return <></>;
    }
  }

  return (
    <Popover2
      interactionKind="click"
      popoverClassName={Classes.POPOVER2_CONTENT}
      placement="bottom-end"
      content={(
        <div style={{ width: 500, padding: 20, cursor: 'default' }} className="nodragRegion">
          <h2>
            Update available:
            {updateState.details.releaseName}
          </h2>
          <h5>Release notes</h5>
          <p>{updateState.details.releaseNotes}</p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 15 }}>
            <ButtonGroup>
              <Button
                className={Classes.POPOVER2_DISMISS}
                onClick={installUpdate}
                icon="import"
                intent="success"
                text="Install"
              />
              <Button className={Classes.POPOVER2_DISMISS} intent="primary" text="Later" />
            </ButtonGroup>
          </div>
        </div>
      )}
      renderTarget={({ isOpen, ref, ...targetProps }) => (
        <Button
          style={{ animation: 'pop 0.3s ease-in 1' }}
          icon="updated"
          intent="success"
          title="Update available!"
          text={showProgress ? 'Update available' : undefined}
          className="nodragRegion"
          elementRef={ref as any}
          {...targetProps}
        />
      )}
    />
  );
};
