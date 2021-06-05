import { PromiseSink } from './PromiseSink';

describe('PromiseSink', () => {
  it('init with value', async () => {
    const sink = new PromiseSink('foo');
    await expect(sink).resolves.toEqual('foo');
  });
  it('init with error', async () => {
    const sink = new PromiseSink(new Error('bar'));
    await expect(sink).rejects.toThrowError(new Error('bar'));
  });
  it('resolve', async () => {
    const sink = new PromiseSink();
    sink.setValue('foo');
    await expect(sink).resolves.toEqual('foo');
  });
  it('reject', async () => {
    const sink = new PromiseSink();
    sink.setValue(new Error('bar'));
    await expect(sink).rejects.toThrowError(new Error('bar'));
  });
  it('double-resolve, last one wins', async () => {
    const sink = new PromiseSink();
    sink.setValue('foo');
    await expect(sink).resolves.toEqual('foo');
    sink.setValue('baz');
    await expect(sink).resolves.toEqual('baz');
  });
  it('double-reject, last one wins', async () => {
    const sink = new PromiseSink();
    sink.setValue(new Error('bar'));
    await expect(sink).rejects.toThrowError(new Error('bar'));
    sink.setValue(new Error('baz'));
    await expect(sink).rejects.toThrowError(new Error('baz'));
  });
  it('catch', async () => {
    const sink = new PromiseSink();
    sink.setValue(new Error('bar'));
    await sink.catch((err) => {
      expect(err).toEqual(new Error('bar'));
    });
  });
  it('then', async () => {
    const sink = new PromiseSink();
    sink.setValue('foo');
    await sink.then((result) => {
      expect(result).toEqual('foo');
    });
  });
  it('finally', async () => {
    const sink = new PromiseSink();
    sink.setValue(new Error('bar'));
    const finallyFn = jest.fn();
    await expect(sink.finally(finallyFn)).rejects.toThrowError(new Error('bar'));
    expect(finallyFn).toBeCalledTimes(1);
  });
  it('Symbol.toStringTag', async () => {
    expect(`${new PromiseSink()}`).toEqual(`${new Promise(() => {})}`);
  });
});
