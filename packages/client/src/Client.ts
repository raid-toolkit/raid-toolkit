import { assertApiError, handleResponse, OAuthAuthorizationRequest, TokenExpiredError } from '@raid-toolkit/app-shared';
import {
  ArtifactInstance,
  HeroInstance,
  HeroSnapshot,
  ShardStatistics,
  StaticArtifactSetKind,
  StaticHeroType,
  StaticSkillType,
} from '@raid-toolkit/types';
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

  async getArtifactSets(): Promise<StaticArtifactSetKind[]> {
    return this.fetchResourceWithRetry('artifacts/sets');
  }

  async getArtifactSet(setKindId: number): Promise<StaticArtifactSetKind> {
    return this.fetchResourceWithRetry(`artifacts/sets/${setKindId}`);
  }

  async getArtifacts(): Promise<ArtifactInstance[]> {
    return this.fetchResourceWithRetry(`artifacts`);
  }

  async getArtifact(artifactId: number): Promise<ArtifactInstance> {
    return this.fetchResourceWithRetry(`artifacts/${artifactId}`);
  }

  async getHeroType(heroTypeId: number): Promise<StaticHeroType> {
    return this.fetchResourceWithRetry(`heroes/types/${heroTypeId}`);
  }

  async getHeroes(): Promise<HeroInstance[]>;
  async getHeroes(snapshot: true): Promise<HeroSnapshot[]>;
  async getHeroes(snapshot: false): Promise<HeroSnapshot[]>;
  async getHeroes(snapshot?: boolean): Promise<HeroInstance | HeroInstance[]> {
    return this.fetchResourceWithRetry(snapshot ? 'snapshot/heroes' : 'heroes');
  }

  async getHero(heroId: number): Promise<HeroInstance>;
  async getHero(heroId: number, snapshot: true): Promise<HeroSnapshot>;
  async getHero(heroId: number, snapshot: false): Promise<HeroSnapshot>;
  async getHero(heroId: number, snapshot?: boolean): Promise<HeroInstance | HeroSnapshot> {
    return this.fetchResourceWithRetry(snapshot ? `snapshot/heroes/${heroId}` : `heroes/${heroId}`);
  }

  getShardStats(): Promise<ShardStatistics[]> {
    return this.fetchResourceWithRetry('shards/stats');
  }

  getSkill(skillId: number): Promise<StaticSkillType> {
    return this.fetchResourceWithRetry(`skills/${skillId}`);
  }

  // #region auth
  requestAccess(force: boolean = false): Promise<void> {
    return this.tokenManager.requestAccess(force);
  }

  async authorize(): Promise<void> {
    await this.tokenManager.refreshToken();
  }
  // #endregion auth

  // #region impl
  private async fetchResourceWithRetry<T>(path: string): Promise<T> {
    try {
      return await this.fetchResource(path);
    } catch (e) {
      assertApiError(e, TokenExpiredError);
      await this.tokenManager.refreshToken();
      return this.fetchResource(path);
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

    return handleResponse(response.status, response.json());
  }
  // #endregion impl
}
