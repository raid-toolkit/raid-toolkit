import { ApiDefinition } from '@remote-ioc/runtime';
import { UpdateState, UserSettings } from '../../Types';

@ApiDefinition('app-host')
export class IAppHost {
  init(_force?: boolean): Promise<void> {
    throw new Error('not implemented');
  }
  checkForUpdates(): Promise<void> {
    throw new Error('not implemented');
  }
  getUserSettings(): Promise<UserSettings> {
    throw new Error('not implemented');
  }
  setUserSettings(_settings: UserSettings): Promise<void> {
    throw new Error('not implemented');
  }
  getResourceHost(): Promise<string> {
    throw new Error('not implemented');
  }
  getUpdateState(): Promise<UpdateState> {
    throw new Error('not implemented');
  }
  onRender(): Promise<void> {
    throw new Error('not implemented');
  }
  close(): Promise<void> {
    throw new Error('not implemented');
  }
  closeWindow(_name: 'splash' | 'main'): Promise<void> {
    throw new Error('not implemented');
  }
  resizeWindow(_name: 'splash' | 'main', _size: { width?: number; height?: number }): Promise<void> {
    throw new Error('not implemented');
  }
  installUpdate(): Promise<void> {
    throw new Error('not implemented');
  }
  donate(): Promise<void> {
    throw new Error('not implemented');
  }
  openDiscord(): Promise<void> {
    throw new Error('not implemented');
  }
  getServerState(): Promise<boolean> {
    throw new Error('not implemented');
  }
  openServer(): Promise<void> {
    throw new Error('not implemented');
  }
  toggleServer(_enabled: boolean): Promise<void> {
    throw new Error('not implemented');
  }
  on(_event: 'updater-state-changed', _callback: (state: UpdateState) => void): this {
    throw new Error('not implemented');
  }
  off(_event: 'updater-state-changed', _callback: (state: UpdateState) => void): this {
    throw new Error('not implemented');
  }
}
