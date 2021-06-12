export type Head<T extends any[]> = T[0];
export type FnWithArgs<T extends any[]> = (...args: T) => void;
export type TailArgs<T> = T extends (x: any, ...args: infer U) => any ? U : never;
export type Tail<T extends any[]> = TailArgs<FnWithArgs<T>>;
export type StaticAssert<T extends true | Message, Message extends string> = T & never;
export type Extends<T, U> = T extends U ? true : false;
export type Exact<T, U> = T extends U ? (U extends T ? true : false) : false;
export type Writeable<T> = { -readonly [P in keyof T]: T[P] };
export type ValueOf<T> = T[keyof T];

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type UnionToFunctions<U> = U extends unknown ? (k: U) => void : never;
export type IntersectionOfFunctionsToType<F> = F extends { (a: infer A): void; (b: infer B): void; (c: infer C): void }
  ? [A, B, C]
  : F extends { (a: infer A): void; (b: infer B): void }
  ? [A, B]
  : F extends { (a: infer A): void }
  ? [A]
  : never;
export type SplitType<T> = IntersectionOfFunctionsToType<UnionToIntersection<UnionToFunctions<T>>>;
