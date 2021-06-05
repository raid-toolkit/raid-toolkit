// eslint-disable-next-line import/no-extraneous-dependencies
import Cryptr from 'cryptr';
import path from 'path';
import fs from 'fs';
import {
  assertApiError,
  AuthorizationRejectedError,
  InvalidApplicationCredentialsError,
  isErrorType,
  OAuthAuthorizationRequest,
  ScopeNotGrantedError,
} from '@raid-toolkit/app-shared';
import { Client, StorageFunctions } from '@raid-toolkit/client';

/**
 * in order for the client to be able to reconnect without requesting the user to grant
 * permissions again, both storage and crypt implementations must be provided
 */
const storage: StorageFunctions = {
  fetch(key) {
    return fs.promises.readFile(path.join(__dirname, `.data-${key}`));
  },
  store(key, data) {
    return fs.promises.writeFile(path.join(__dirname, `.data-${key}`), data);
  },
};

/**
 * cryptr already implements the required contract (encrypt/decrypt)
 */
const crypt = new Cryptr('foo');

const clientManifest: OAuthAuthorizationRequest = {
  appId: 'test-app',
  name: 'My test app',
  description: 'My test app',
  scopes: {
    'read:heroes': 'Read hero data',
    'read:artifacts': 'Read artifact data',
  },
  author: 'someuser@example.com',
};

async function connect() {
  // create the client, providing storage/encryption implementations
  const client = new Client(clientManifest, { storage, crypt });

  // request access (will return without prompting the user in-app if we've stored a previous grant)
  await client.requestAccess();
  try {
    // make sure we can get a token
    await client.authorize();
  } catch (e) {
    // don't try to handle unknown errors:
    assertApiError(e);

    // if our token was not granted due to out of date credentials, or missing scopes (maybe we added one since the user granted access?)
    if (
      isErrorType(e, AuthorizationRejectedError) ||
      isErrorType(e, InvalidApplicationCredentialsError) ||
      isErrorType(e, ScopeNotGrantedError)
    ) {
      // re-request access, and force it to hit the service this time (user will be prompted)
      // !doing this will invalidate any previous access and tokens granted!
      await client.requestAccess(/* force */ true);
    } else {
      throw e;
    }
  }
  return client;
}

async function runSample() {
  const client = await connect();

  // find the fastest champion
  const heroSnapshots = await client.getHeroes(/* snapshot */ true);
  const fastest = heroSnapshots.sort((a, b) => b.stats.Speed - a.stats.Speed)[0];
  console.log(`Your fastest hero is '${fastest.name}' with ${fastest.stats.Speed} speed!`);
}

runSample().catch((err) => {
  assertApiError(err);
  console.error(err.json());
});
