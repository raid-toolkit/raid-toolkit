import { UserSettings } from '@raid-toolkit/app-shared';
import * as React from 'react';
import { ServiceHost } from '../ServiceHost';
import { LoadProgress } from './LoadProgress';
import { UserSettingsInput } from './UserSettingsInput';

export const FirstRun: React.FC = () => {
  const [userSettings, setUserSettings] = React.useState<UserSettings | undefined>();
  const onReady = React.useCallback(() => ServiceHost.appHost.closeWindow('splash'), []);

  const closeApp = React.useCallback(() => {
    ServiceHost.appHost.close();
  }, []);

  const onSaveSettings = React.useCallback(
    (settings: UserSettings) => {
      ServiceHost.appHost
        .setUserSettings(settings)
        .then(() => ServiceHost.appHost.getUserSettings().then(setUserSettings));
    },
    [setUserSettings]
  );

  React.useEffect(() => {
    if (userSettings?.initialized) {
      ServiceHost.appHost.resizeWindow('splash', { width: 650, height: 350 });
    }
  }, [userSettings]);

  React.useEffect(() => {
    let cancellationToken = false;
    ServiceHost.appHost.getUserSettings().then((settings) => {
      if (cancellationToken) {
        return;
      }
      setUserSettings(settings);
      if (!settings.initialized) {
        ServiceHost.appHost.resizeWindow('splash', { width: 650, height: 650 });
      }
    });
    return () => {
      cancellationToken = true;
    };
  }, []);

  return (
    <div style={{ minWidth: 650, minHeight: 350, padding: 50 }}>
      {!userSettings || userSettings?.initialized ? (
        <div
          className="nodragRegion"
          style={{
            width: 550,
            padding: 50,
            position: 'fixed',
            left: '50%',
            top: '50%',
            transform: 'translate( -50%, -50%)',
            textAlign: 'center',
          }}
        >
          <LoadProgress onReady={onReady} />
        </div>
      ) : (
        <UserSettingsInput onSaveSettings={onSaveSettings} onCancel={closeApp} firstRun />
      )}
    </div>
  );
};
