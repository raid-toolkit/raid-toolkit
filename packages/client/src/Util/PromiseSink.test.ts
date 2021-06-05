import { PromiseSink } from './PromiseSink';

describe('PromiseSink', () => {
  it('init with value', async () => {
    const sink = new PromiseSink('foo');
    expect(sink.getValue()).resolves.toEqual('foo');
  });
  it('init with error', async () => {
    const sink = new PromiseSink(new Error('bar'));
    expect(sink.getValue()).rejects.toThrowError(new Error('bar'));
  });
  it('resolve', async () => {
    const sink = new PromiseSink();
    sink.setValue('foo');
    expect(sink.getValue()).resolves.toEqual('foo');
  });
  it('reject', async () => {
    const sink = new PromiseSink();
    sink.setValue(new Error('bar'));
    expect(sink.getValue()).rejects.toThrowError(new Error('bar'));
  });
  it('double-resolve', async () => {
    const sink = new PromiseSink();
    sink.setValue('foo');
    sink.setValue('baz');
    expect(sink.getValue()).resolves.toEqual('foo');
  });
  it('double-reject', async () => {
    const sink = new PromiseSink();
    sink.setValue(new Error('bar'));
    sink.setValue(new Error('baz'));
    expect(sink.getValue()).rejects.toThrowError(new Error('bar'));
  });
});
