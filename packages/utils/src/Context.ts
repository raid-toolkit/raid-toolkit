import { isPromise } from './IsPromise';

export class Context<T> {
  private stack: T[] = [];
  constructor(public readonly name: string) {}

  get current(): T {
    if (this.stack.length) {
      return this.stack[this.stack.length - 1];
    }
    throw new Error(`Context '${this.name}' is not currently set`);
  }

  get currentOrUndefined(): T | undefined {
    return this.stack.length ? this.stack[this.stack.length - 1] : undefined;
  }

  push<U>(value: T, runCode: () => U): U;
  push<U>(value: T, runCode: () => Promise<U>): Promise<U>;
  push<U>(value: T, runCode: () => U | Promise<U>): U | Promise<U> {
    this.stack.push(value);
    const epilogue = () => this.stack.pop();

    try {
      const result = runCode();
      if (!isPromise(result)) {
        epilogue();
        return result;
      }
      return result.finally(epilogue);
    } catch (e) {
      epilogue();
      throw e;
    }
  }
}
