import { ApiDefinition, methodStub } from '@remote-ioc/runtime';

@ApiDefinition('resource-worker')
export class IResourceWorker {
  async cacheResource(name: string): Promise<void> {
    methodStub(this, name);
  }
}
