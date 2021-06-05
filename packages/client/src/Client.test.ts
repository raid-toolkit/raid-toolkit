import { Client } from './Client';

describe('Client', () => {
  it('authentication', () => {
    const client = new Client({
      appId: 'test-app',
      name: 'My test app',
      description: 'My test app',
      scopes: {
        'read:artifacts': 'Read artifact data',
      },
      author: 'someuser@example.com',
    });
  });
});
