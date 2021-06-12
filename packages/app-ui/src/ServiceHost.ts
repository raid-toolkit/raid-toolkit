import { IAppHost, IAppModel } from '@raid-toolkit/app-shared';

export class ServiceHost {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}
  static get appHost(): IAppHost {
    return (window as any).appHost;
  }
  static get appModel(): IAppModel {
    return (window as any).appModel;
  }
}
