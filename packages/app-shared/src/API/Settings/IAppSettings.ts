import { ApiDefinition, methodStub } from '@remote-ioc/runtime';
import type { UserSettings } from '../../Types';

@ApiDefinition('app-settings')
export class IAppSettings {
  getUserSettings(): Promise<UserSettings> {
    methodStub(this);
  }
  setUserSettings(settings: UserSettings): Promise<void> {
    methodStub(this, settings);
  }
  on(event: 'settings-changed', callback: (state: UserSettings) => void): this {
    methodStub(this, event, callback);
  }
  off(event: 'settings-changed', callback: (state: UserSettings) => void): this {
    methodStub(this, event, callback);
  }
}
