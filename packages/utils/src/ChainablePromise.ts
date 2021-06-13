export type PromiseValue<T> = T extends Promise<infer U> ? U : T;
export type EnsurePromise<T> = T extends Promise<any> ? T : Promise<T>;
export type ChainablePromise<T> = Promise<T> &
  (T extends object
    ? {
        [key in keyof T]: PromiseValue<T[key]> extends (...args: infer U) => infer P
          ? (...args: U) => ChainablePromise<PromiseValue<P>>
          : EnsurePromise<T[key]>;
      }
    : Promise<T>);

/**
 * Wraps a promise such that you can access "chained" async functions
 * without having to await/.then() on each step of the chain, and it will
 * roll-up the final promise result up to the final return of your expression.
 */
export function chainablePromise<T>(value: Promise<T>): ChainablePromise<T> {
  function callable() {}
  return new Proxy(callable, {
    get(_target, key, receiver) {
      if (key === 'then' || key === 'catch' || key === 'finally' || Object.prototype[key as keyof Object]) {
        return Reflect.get(value, key, receiver).bind(value);
      }
      return chainablePromise(value.then((resolved) => (resolved as any)[key]));
    },
    apply(_target, thisArg, argArray) {
      return chainablePromise(
        value.then((fn) => {
          if (typeof fn !== 'function') {
            throw new Error(`${fn} is not a function`);
          }
          return fn.apply(thisArg, argArray);
        })
      );
    },
  }) as unknown as ChainablePromise<T>;
}
