import { ApiDefinition } from '@remote-ioc/runtime';

@ApiDefinition('app-server')
export class IAppServer {
  public getIsRunning(): Promise<boolean> {
    throw new Error('not implemented');
  }
  public start(hostname: string = 'localhost', port: number = 5656): Promise<void> {
    throw new Error('not implemented');
  }
  public stop(): Promise<void> {
    throw new Error('not implemented');
  }
}
