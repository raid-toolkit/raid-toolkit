export enum AuthScopes {
  ReadHeroes = 'read:heroes',
  ReadArtifacts = 'read:artifacts',
  ReadShards = 'read:shards',
}

export interface OAuthAuthorizationRequest {
  appId: string;
  name: string;
  description: string;
  scopes: { [key in AuthScopes]?: string };
}

export interface ApplicationGrant {
  appId: string;
  secret: string;
  name: string;
  description: string;
  scopes: string[];
}
