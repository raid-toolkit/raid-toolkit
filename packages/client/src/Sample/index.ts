// eslint-disable-next-line import/no-extraneous-dependencies
import Cryptr from 'cryptr';
import path from 'path';
import fs from 'fs';
import {
  ApiError,
  assertApiError,
  AuthorizationRejectedError,
  InvalidApplicationCredentialsError,
  isErrorType,
  ScopeNotGrantedError,
} from '@raid-toolkit/app-shared';
import { Client } from '../Client';
import { StorageFunctions } from '../ClientOptions';

const storage: StorageFunctions = {
  fetch(key) {
    return fs.promises.readFile(path.join(__dirname, `.data-${key}`));
  },
  store(key, data) {
    return fs.promises.writeFile(path.join(__dirname, `.data-${key}`), data);
  },
};

const crypt = new Cryptr('foo');

async function runSample() {
  const client = new Client(
    {
      appId: 'test-app',
      name: 'My test app',
      description: 'My test app',
      scopes: {
        'read:heroes': 'Read hero data',
        'read:artifacts': 'Read artifact data',
      },
      author: 'someuser@example.com',
    },
    {
      storage,
      crypt,
    }
  );
  await client.requestAccess();
  try {
    await client.authorize();
  } catch (e) {
    if (e instanceof ApiError) {
      if (
        isErrorType(e, AuthorizationRejectedError) ||
        isErrorType(e, InvalidApplicationCredentialsError) ||
        isErrorType(e, ScopeNotGrantedError)
      ) {
        await client.requestAccess(/* force */ true);
      } else {
        throw e;
      }
    } else {
      throw e;
    }
  }
  // eslint-disable-next-line no-console
  console.log({ artifactSets: await client.getArtifactSets(), heroes: await client.getHeroes(true) });
  // eslint-disable-next-line no-console
  console.log('done');
}

runSample().catch((err) => {
  assertApiError(err);
  // eslint-disable-next-line no-console
  console.error(err.json());
});
