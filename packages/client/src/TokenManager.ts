import { ApplicationGrant, handleResponse, OAuthAuthorizationRequest } from '@raid-toolkit/app-shared';
import { ClientOptions } from './ClientOptions';
import { PromiseSink } from './Util/PromiseSink';

export interface JWT {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export class TokenManager {
  private tokenExpiry: number = 0;
  private authToken: PromiseSink<JWT> = new PromiseSink();
  private grant: PromiseSink<ApplicationGrant> = new PromiseSink();
  constructor(private request: OAuthAuthorizationRequest, private opts: ClientOptions) {}

  async requestAccess(force: boolean): Promise<void> {
    const { storage, crypt, fetch, baseUrl } = this.opts;
    if (!force && storage && crypt) {
      try {
        const buf = await storage.fetch('grant');
        if (buf) {
          const json = crypt.decrypt(buf.toString('utf8'));
          this.grant.setValue(JSON.parse(json));
          return;
        }
      } catch {
        // do nothing
      }
    }

    const response = await fetch(`${baseUrl}/oauth/authorize`, {
      method: 'POST',
      body: JSON.stringify(this.request) as any,
      headers: {
        // @ts-ignore for some reason this header isn't included in the list
        'Content-Type': 'application/json',
      },
    });

    const grant = await handleResponse<ApplicationGrant>(response.status, response.json());

    if (storage && crypt) {
      try {
        const buf = Buffer.from(crypt.encrypt(JSON.stringify(grant)));
        await storage.store('grant', buf);
      } catch {
        // do nothing
      }
    }

    this.grant.setValue(grant);
  }

  async getToken(): Promise<JWT> {
    if (new Date().valueOf() > this.tokenExpiry) {
      return this.refreshToken();
    }
    const token = await this.authToken;
    return token;
  }

  async refreshToken(): Promise<JWT> {
    this.authToken = new PromiseSink();
    const grant = await this.grant;
    const tokenResponse = await this.opts.fetch(`${this.opts.baseUrl}/oauth/token`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        // @ts-ignore for some reason this header isn't included in the list
        'Content-Type': 'application/x-www-form-urlencoded',
        authorization: `Basic ${Buffer.from(`${grant.appId}:${grant.secret}`).toString('base64')}`,
      },
      body: encodeURI(`scope=${grant.scopes.join(' ')}`),
    });

    const token = await handleResponse<JWT>(tokenResponse.status, tokenResponse.json());

    this.tokenExpiry = new Date().valueOf() + token.expires_in;
    this.authToken.setValue(token);

    return this.authToken;
  }
}
