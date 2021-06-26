import { ApiDefinition, methodStub } from '@remote-ioc/runtime';

export type WindowEventName =
  | 'focus'
  | 'blur'
  | 'hide'
  | 'close'
  | 'show'
  | 'resized'
  | 'maximize'
  | 'minimize'
  | 'restore'
  | 'unmaximize';

@ApiDefinition('window-api')
export class IWindowApi {
  async register(): Promise<void> {
    methodStub(this);
  }
  async flash(enabled: boolean): Promise<void> {
    methodStub(this, enabled);
  }
  async unmaximize(): Promise<void> {
    methodStub(this);
  }
  async maximize(): Promise<void> {
    methodStub(this);
  }
  async minimize(): Promise<void> {
    methodStub(this);
  }
  async toggleMaximize(): Promise<void> {
    methodStub(this);
  }
  async restore(): Promise<void> {
    methodStub(this);
  }
  async hide(): Promise<void> {
    methodStub(this);
  }
  async show(): Promise<void> {
    methodStub(this);
  }
  async focus(): Promise<void> {
    methodStub(this);
  }
  async blur(): Promise<void> {
    methodStub(this);
  }
  async close(): Promise<void> {
    methodStub(this);
  }

  on(event: WindowEventName, callback: () => void): this;
  on(event: string, callback: (...args: any[]) => void): this {
    methodStub(this, event, callback);
  }

  off(event: WindowEventName, callback: () => void): this;
  off(event: string, callback: (...args: any[]) => void): this {
    methodStub(this, event, callback);
  }
}
