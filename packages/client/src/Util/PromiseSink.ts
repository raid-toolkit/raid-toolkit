export class PromiseSink<T> implements Promise<T> {
  private promise: Promise<void>;
  private resolve?: () => void;
  constructor();
  constructor(value: T);
  constructor(error: Error);
  constructor(private value?: T | Error) {
    this.promise = new Promise((resolve) => {
      if (arguments.length === 1) {
        resolve();
      } else {
        this.resolve = resolve;
      }
    });
  }

  get [Symbol.toStringTag](): string {
    return this.promise[Symbol.toStringTag];
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): Promise<TResult1 | TResult2> {
    return this.getValue().then(onfulfilled, onrejected);
  }

  catch<TResult = never>(
    onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null
  ): Promise<T | TResult> {
    return this.getValue().catch(onrejected);
  }

  finally(onfinally?: (() => void) | undefined | null): Promise<T> {
    return this.getValue().finally(onfinally);
  }

  private async getValue(): Promise<T> {
    await this.promise;
    if (this.value instanceof Error) {
      return Promise.reject(this.value);
    }
    return Promise.resolve(this.value!);
  }

  setValue(value: T | Error): void {
    this.value = value;
    this.resolve?.();
    delete this.resolve;
  }
}
