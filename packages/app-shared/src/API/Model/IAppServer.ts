import { ApiDefinition, methodStub } from '@remote-ioc/runtime';

@ApiDefinition('app-server')
export class IAppServer {
  public getIsRunning(): Promise<boolean> {
    methodStub(this);
  }
  public start(hostname: string = 'localhost', port: number = 5656): Promise<void> {
    methodStub(this, hostname, port);
  }
  public stop(): Promise<void> {
    methodStub(this);
  }
}
