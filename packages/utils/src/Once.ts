export function once<T>(callback: (...args: any[]) => T): typeof callback {
  let fn: ((...args: any[]) => T) | undefined = callback;
  let value: T | undefined;
  return (...args: any[]): T => {
    if (value) {
      return value;
    }
    value = fn?.(args);
    fn = undefined;
    if (value === undefined) {
      throw new Error();
    }
    return value;
  };
}
