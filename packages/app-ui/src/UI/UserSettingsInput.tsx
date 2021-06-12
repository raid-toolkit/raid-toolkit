import * as React from 'react';
import { Button, Callout, Switch } from '@blueprintjs/core';
import { Classes } from '@blueprintjs/popover2';
import { UserSettings } from '@raid-toolkit/app-shared';
import { ServiceHost } from '../ServiceHost';

export interface UserSettingsInputProps {
  firstRun?: boolean;
  onSaveSettings: (settings: UserSettings) => void;
  onCancel?: () => void;
}

export function handleBooleanChange(handler: (checked: boolean) => void) {
  return (event: React.FormEvent<HTMLElement>) => handler((event.target as HTMLInputElement).checked);
}

export function useSwitchSetting(
  defaultValue: boolean = false
): [boolean, React.Dispatch<React.SetStateAction<boolean>>, (event: React.FormEvent<HTMLElement>) => void] {
  const [value, setValue] = React.useState(defaultValue);
  const onValueChanged = React.useCallback(handleBooleanChange(setValue), []);
  return [value, setValue, onValueChanged];
}

export const UserSettingsInput: React.FC<UserSettingsInputProps> = ({ onSaveSettings, onCancel, firstRun }) => {
  const [initialSettings, setInitialSettings] = React.useState<UserSettings | undefined>();
  const [autoUpdate, setAutoUpdate, onAutoUpdateChanged] = useSwitchSetting();
  const [autoUpdateConsent, setAutoUpdateConsent, onAutoUpdateConsentChanged] = useSwitchSetting();
  const [alphaUser, setAlphaUser, onAlphaUserChanged] = useSwitchSetting();
  const [alphaUserConsent, setAlphaUserConsent, onAlphaUserConsentChanged] = useSwitchSetting();
  const [autoStartServer, setAutoStartServer, onAutoStartServerChanged] = useSwitchSetting();

  React.useEffect(() => {
    ServiceHost.appHost.getUserSettings().then((settings) => {
      setAutoUpdate(settings.autoUpdate ?? true);
      setAutoUpdateConsent(!!settings.autoUpdate);
      setAlphaUser(!!settings.alphaUser);
      setAlphaUserConsent(!!settings.alphaUser);
      setAutoStartServer(!!settings.autoStartServer);
      setInitialSettings(settings);
    });
  }, []);

  const validState = React.useMemo(() => {
    if (autoUpdate && !autoUpdateConsent) {
      return false;
    }
    if (alphaUser && !alphaUserConsent) {
      return false;
    }
    return true;
  }, [autoUpdate, autoUpdateConsent, alphaUser, alphaUserConsent]);

  const onSave = React.useCallback(() => {
    if (!validState) {
      return;
    }
    onSaveSettings({
      autoUpdate,
      alphaUser,
      autoStartServer,
    });
  }, [validState, autoUpdate, alphaUser, autoStartServer]);

  return (
    <div style={{ textAlign: 'left' }}>
      {!initialSettings?.initialized && (
        <div>
          <h2>First run</h2>
          <p>Before starting the toolkit, there's a few things we need to ask...</p>
        </div>
      )}
      {!firstRun && <Switch label="Auto-start server" checked={autoStartServer} onChange={onAutoStartServerChanged} />}
      <Switch label="Automatically check for updates" onChange={onAutoUpdateChanged} checked={autoUpdate} />
      {autoUpdate && (
        <Callout intent={autoUpdateConsent ? 'success' : 'warning'} style={{ marginBottom: 8 }}>
          <p>
            In order to check for updates automatically, requests will be made to
            {' '}
            <a href="#">http://raid-bot.eastus.azurecontainer.io/hazel</a>
            {' '}
            when the application starts in order to check
            for any new available updates, and will install them when they are ready. If you'd rather update manually,
            you can disable this feature and instead re-download the latest release and install it yourself.
          </p>
          <Switch
            label="I consent to automatically checking for updates"
            checked={autoUpdateConsent}
            onChange={onAutoUpdateConsentChanged}
          />
        </Callout>
      )}
      <Switch label="Alpha user" checked={alphaUser} onChange={onAlphaUserChanged} />
      {alphaUser && (
        <Callout intent={alphaUserConsent ? 'success' : 'warning'} style={{ marginBottom: 8 }}>
          <p>
            Alpha users must connect to the server to verify their access. If you consent to check for access, a request
            will be sent to
            {' '}
            <a href="#">
              http://raid-bot.eastus.azurecontainer.io/toolkit/user/
              {'<your user id>'}
              /roles
            </a>
            . No
            information will be stored from this request, and it is only used for returning the roles permitted to your
            account.
          </p>
          <Switch
            label="I consent to check for alpha-user access"
            checked={alphaUserConsent}
            onChange={onAlphaUserConsentChanged}
          />
        </Callout>
      )}
      <Button
        className={Classes.POPOVER2_DISMISS}
        disabled={!validState}
        text="Save"
        intent="success"
        onClick={onSave}
      />
      {' '}
      <Button className={Classes.POPOVER2_DISMISS} text="Cancel" intent="danger" onClick={onCancel} />
    </div>
  );
};
