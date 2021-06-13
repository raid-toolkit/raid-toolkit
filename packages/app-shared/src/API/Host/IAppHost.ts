import { ApiDefinition, methodStub } from '@remote-ioc/runtime';
import type { UpdateState, UserSettings } from '../../Types';

@ApiDefinition('app-host')
export class IAppHost {
  init(force?: boolean): Promise<void> {
    methodStub(this, force);
  }
  checkForUpdates(): Promise<void> {
    methodStub(this);
  }
  getUserSettings(): Promise<UserSettings> {
    methodStub(this);
  }
  setUserSettings(settings: UserSettings): Promise<void> {
    methodStub(this, settings);
  }
  getResourceHost(): Promise<string> {
    methodStub(this);
  }
  getUpdateState(): Promise<UpdateState> {
    methodStub(this);
  }
  onRender(): Promise<void> {
    methodStub(this);
  }
  close(): Promise<void> {
    methodStub(this);
  }
  closeWindow(name: 'splash' | 'main' | 'firstrun'): Promise<void> {
    methodStub(this, name);
  }
  resizeWindow(name: 'splash' | 'main' | 'firstrun', size: { width?: number; height?: number }): Promise<void> {
    methodStub(this, name, size);
  }
  installUpdate(): Promise<void> {
    methodStub(this);
  }
  donate(): Promise<void> {
    methodStub(this);
  }
  openDiscord(): Promise<void> {
    methodStub(this);
  }
  getServerState(): Promise<boolean> {
    methodStub(this);
  }
  openServer(): Promise<void> {
    methodStub(this);
  }
  toggleServer(enabled: boolean): Promise<void> {
    methodStub(this, enabled);
  }
  on(event: 'updater-state-changed', callback: (state: UpdateState) => void): this {
    methodStub(this, event, callback);
  }
  off(event: 'updater-state-changed', callback: (state: UpdateState) => void): this {
    methodStub(this, event, callback);
  }
}
