import { ApiDefinition } from '@remote-ioc/runtime';
import type { UserSettings } from '../../Types';

@ApiDefinition('app-settings')
export class IAppSettings {
  getUserSettings(): Promise<UserSettings> {
    throw new Error('not implemented');
  }
  setUserSettings(_settings: UserSettings): Promise<void> {
    throw new Error('not implemented');
  }
  on(_event: 'settings-changed', _callback: (state: UserSettings) => void): this {
    throw new Error('not implemented');
  }
  off(_event: 'settings-changed', _callback: (state: UserSettings) => void): this {
    throw new Error('not implemented');
  }
}
