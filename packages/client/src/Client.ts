import { OAuthAuthorizationRequest } from '@raid-toolkit/app-shared';
import { StaticArtifactSetKind } from '@raid-toolkit/types';
import fetch from 'isomorphic-fetch';
import { ClientOptions } from './ClientOptions';
import { TokenManager } from './TokenManager';

const defaultOptions: ClientOptions = {
  fetch,
  baseUrl: 'http://localhost:5656/v1',
};

export class Client {
  private tokenManager: TokenManager;
  private options: ClientOptions;
  constructor(request: OAuthAuthorizationRequest, opts?: Partial<ClientOptions>) {
    this.options = { ...defaultOptions, ...(opts || {}) };
    this.tokenManager = new TokenManager(request, this.options);
  }

  requestAccess(): Promise<void> {
    return this.tokenManager.requestAccess();
  }

  getArtifactSets(): Promise<StaticArtifactSetKind[]> {
    return this.fetchResource('artifacts/sets');
  }

  private async fetchResource<T>(path: string): Promise<T> {
    const token = await this.tokenManager.getToken();
    const response = await fetch(`${this.options.baseUrl}/${path}`, {
      headers: {
        // @ts-ignore
        authorization: `${token.token_type} ${token.access_token}`,
      },
    });
    if (response.status !== 200) {
      // TODO plumb error info
      throw new Error('Server responded with an error');
    }
    return response.json();
  }
}
