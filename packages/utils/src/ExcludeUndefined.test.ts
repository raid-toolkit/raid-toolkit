import { excludeUndefined } from './ExcludeUndefined';

describe('excludeUndefined', () => {
  it('empty', () => {
    expect(excludeUndefined([])).toEqual([]);
  });
  it('false', () => {
    expect(excludeUndefined([0, 1, false, true])).toEqual([0, 1, true]);
  });
  it('undefined', () => {
    expect(excludeUndefined([0, 1, undefined, true])).toEqual([0, 1, true]);
  });
});
