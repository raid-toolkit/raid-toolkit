import { ApiDefinition } from '@remote-ioc/runtime';

@ApiDefinition('resource-worker')
export class IResourceWorker {
  async cacheResource(name: string): Promise<void> {
    throw new Error('not implemented');
  }
}
