export function excludeUndefined<T>(arrayValue: (T | undefined | false)[]): T[] {
  return arrayValue.filter((e) => e !== undefined && e !== false) as T[];
}
