import type fetch from 'isomorphic-fetch';

export interface StorageFunctions {
  store(key: string, data: Buffer): Promise<void>;
  fetch(key: string): Promise<Buffer>;
}

export interface CryptFunctions {
  encrypt(value: string): string;
  decrypt(value: string): string;
}

export interface ClientOptions {
  fetch: typeof fetch;
  baseUrl: string;
  storage?: StorageFunctions;
  crypt?: CryptFunctions;
}
