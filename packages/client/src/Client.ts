import { OAuthAuthorizationRequest } from '@raid-toolkit/app-shared';
import { PromiseSink } from './Util/PromiseSink';

export class Client {
  private authToken: PromiseSink<string> = new PromiseSink();
  constructor(private request: OAuthAuthorizationRequest) {}
}
