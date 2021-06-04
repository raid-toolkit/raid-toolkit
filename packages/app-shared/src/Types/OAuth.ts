export enum AuthScopes {
  ReadHeroes = 'read:heroes',
  ReadArtifacts = 'read:artifacts',
  ReadShards = 'read:shards',
}

/**
 * @example {
 *  "appId": "raid-team-optimizer",
 *  "name": "Team Optimizer",
 *  "author": "Some dude <somedude@example.com>"
 *  "description": "Makes recommendations on what teams will work best in different content of the game",
 *  "scopes": {
 *    "read:heroes": "Read available heroes to suggest teams from",
 *    "read:artifacts": "Read gear settings for current heroes to make damage estimates"
 *  }
 * }
 */
export interface OAuthAuthorizationRequest {
  appId: string;
  name: string;
  author?: string;
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
