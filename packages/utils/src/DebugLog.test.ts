import { debug, setDebugApi } from './DebugLog';

describe('debug logger', () => {
  let logFn: jest.Mock;
  beforeEach(() => {
    logFn = jest.fn();
    setDebugApi({ log: logFn });
  });
  it('category with message', () => {
    debug('category', 'message', 'arg1');
  });
});
