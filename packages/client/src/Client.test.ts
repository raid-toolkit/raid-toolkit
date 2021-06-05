import { Client } from './Client';
import { JWT } from './TokenManager';

describe('Client', () => {
  const appRequest = {
    appId: 'test-app',
    name: 'My test app',
    description: 'My test app',
    scopes: {
      'read:artifacts': 'Read artifact data',
    },
    author: 'someuser@example.com',
  };
  it('authentication', async () => {
    const fetch = jest.fn();
    fetch.mockReturnValueOnce(
      Promise.resolve({
        status: 201,
        json: async () =>
          <JWT>{
            access_token: 'foo',
            token_type: 'Bearer',
            expires_in: 5000,
          },
      })
    );
    const client = new Client(appRequest, { fetch });
    await client.requestAccess();
    expect(fetch).toHaveBeenCalledWith(`http://localhost:5656/v1/oauth/authorize`, {
      method: 'POST',
      body: JSON.stringify(appRequest),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });
});
