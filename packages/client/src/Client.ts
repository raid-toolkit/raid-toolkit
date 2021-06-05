import {
  ApiError,
  ClientApiError,
  isErrorDetailsForType,
  OAuthAuthorizationRequest,
  TokenExpiredError,
} from '@raid-toolkit/app-shared';
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

  async authorize(): Promise<void> {
    await this.tokenManager.refreshToken();
  }

  async getArtifactSets(): Promise<StaticArtifactSetKind[]> {
    try {
      return await this.fetchResource('artifacts/sets');
    } catch (e) {
      if (e instanceof ApiError) {
        if (isErrorDetailsForType(e.json(), TokenExpiredError)) {
          await this.tokenManager.refreshToken();
          return this.fetchResource('artifacts/sets');
        }
      }
      throw e;
    }
  }

  private async fetchResource<T>(path: string): Promise<T> {
    const token = await this.tokenManager.getToken();
    const response = await fetch(`${this.options.baseUrl}/${path}`, {
      headers: {
        // @ts-ignore
        authorization: `${token.token_type} ${token.access_token}`,
      },
    });

    if (response.status >= 400) {
      try {
        throw new ClientApiError(response.status, await response.json());
      } catch {
        throw new Error(`Server returned ${response.status}`);
      }
    }

    return response.json();
  }
}
