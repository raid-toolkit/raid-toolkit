import { Context } from './Context';

describe('Context', () => {
  it('No context', () => {
    const ctx = new Context('test');
    expect(ctx.currentOrUndefined).toBeUndefined();
  });
  it('One context', () => {
    const expectedValue = Symbol('contextValue');
    const ctx = new Context<typeof expectedValue>('test');
    const fn = jest.fn(() => {
      expect(ctx.currentOrUndefined).toEqual(expectedValue);
    });
    ctx.push(expectedValue, fn);
    expect(fn).toBeCalledTimes(1);
    expect(ctx.currentOrUndefined).toBeUndefined();
  });
  it('Async context', async () => {
    const expectedValue = Symbol('contextValue');
    const expectedResult = Symbol('expectedResult');
    const ctx = new Context<typeof expectedValue>('test');
    const fn = jest.fn(async () => {
      expect(ctx.currentOrUndefined).toEqual(expectedValue);
      return expectedResult;
    });
    const result = await ctx.push(expectedValue, fn);
    expect(result).toEqual(expectedResult);
    expect(fn).toBeCalledTimes(1);
    expect(ctx.currentOrUndefined).toBeUndefined();
  });
  it('Nested context', () => {
    const testValue1 = Symbol('someValue1');
    const testValue2 = Symbol('someValue2');
    const ctx = new Context<Symbol>('test');
    const innerFn = jest.fn(() => {
      expect(ctx.currentOrUndefined).toEqual(testValue2);
    });
    const outerFn = jest.fn(() => {
      expect(ctx.currentOrUndefined).toEqual(testValue1);
      ctx.push(testValue2, innerFn);
    });
    ctx.push(testValue1, outerFn);
    expect(innerFn).toBeCalledTimes(1);
    expect(outerFn).toBeCalledTimes(1);
    expect(ctx.currentOrUndefined).toBeUndefined();
  });
});
