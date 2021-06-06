import type {
  AppModelStrings,
  GameNodeObject,
  StaticHeroType,
  HeroSnapshot,
  MercyShardInfo,
  ShardStatistics,
} from '@raid-toolkit/types';
import { ApiDefinition, methodStub } from '@remote-ioc/runtime';
import type { ApplicationGrant, OAuthAuthorizationRequest, UserRole } from '../../Types';
import type { AppModelOptions } from './AppModelOptions';

@ApiDefinition('app-model')
export class IAppModel {
  init(options: AppModelOptions): Promise<void> {
    methodStub(this, options);
  }
  getStrings(): Promise<AppModelStrings> {
    methodStub(this);
  }
  getUserRoles(): Promise<UserRole[]> {
    methodStub(this);
  }
  accessCheck(): Promise<void> {
    methodStub(this);
  }
  getHeroIndex(): Promise<HeroSnapshot[]> {
    methodStub(this);
  }
  getHeroes(): Promise<HeroSnapshot[]> {
    methodStub(this);
  }
  getHeroType(heroId: number): Promise<StaticHeroType> {
    methodStub(this, heroId);
  }
  getHero(heroId: number): Promise<HeroSnapshot> {
    methodStub(this, heroId);
  }
  getMercyRule(): Promise<MercyShardInfo[]> {
    methodStub(this);
  }
  getSummonStats(): Promise<ShardStatistics[]> {
    methodStub(this);
  }
  getObject(id?: number): Promise<GameNodeObject> {
    methodStub(this, id);
  }

  getPersonalAccessToken(): Promise<string> {
    methodStub(this);
  }
  getApplicationGrants(): Promise<Record<string, ApplicationGrant>> {
    methodStub(this);
  }
  grantAccess(grant: ApplicationGrant): Promise<void> {
    methodStub(this, grant);
  }
  denyAccess(appId: string): Promise<void> {
    methodStub(this, appId);
  }
  revokeAccess(appId: string): Promise<void> {
    methodStub(this, appId);
  }
  on(event: 'request-access', callback: (request: OAuthAuthorizationRequest) => void): this {
    methodStub(this, event, callback);
  }
  off(event: 'request-access', callback: (request: OAuthAuthorizationRequest) => void): this {
    methodStub(this, event, callback);
  }
}
