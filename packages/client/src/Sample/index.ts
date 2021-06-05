// eslint-disable-next-line import/no-extraneous-dependencies
import Cryptr from 'cryptr';
import path from 'path';
import fs from 'fs';
import { ApiError, AuthorizationRejectedError, isErrorDetailsForType } from '@raid-toolkit/app-shared';
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
      const details = e.json();
      if (isErrorDetailsForType(details, AuthorizationRejectedError)) {
        await client.requestAccess();
      }
    }
    throw e;
  }
  const artifactSets = await client.getArtifactSets();
  for (const set of artifactSets) {
    // eslint-disable-next-line no-console
    console.log(set);
  }
}

runSample();
