import { now } from '@perf-tools/performance';
import prettyMs from 'pretty-ms';

export interface DebugLogApi {
  log(message: string, ...args: any[]): void;
  shouldLog(category: string): void;
  formatCategory: (category: string, hash: number) => string;
  formatDuration: (duration: number) => string;
}

const env = process.env;
const debugSettings = new Set(env.DEBUG ? env.DEBUG.split(',') : []);

const defaultDebugLogApi: DebugLogApi = {
  shouldLog(category) {
    return debugSettings.has(category);
  },
  log(message, ...args) {
    // eslint-disable-next-line no-console
    console.log(message, args);
  },
  formatCategory(category) {
    return `[${category}]`;
  },
  formatDuration(duration) {
    return prettyMs(duration);
  },
};

let debugLogApi = defaultDebugLogApi;
export function setDebugApi(api: Partial<DebugLogApi>) {
  debugLogApi = { ...defaultDebugLogApi, ...api };
}
function hashString(value: string) {
  let hash = 0;
  if (!value.length) {
    return hash;
  }
  for (let i = 0; i < value.length; ++i) {
    hash = ((hash << 5) - hash + value.charCodeAt(i)) | 0;
  }
  return hash;
}

let last: any;
export function debug(name: string): (message: string, ...args: any[]) => void;
export function debug(name: string, message: string, ...args: any[]): void;
export function debug(
  name: string,
  message?: string,
  ...args: any[]
): void | ((message: string, ..._args: any[]) => void) {
  if (message === undefined) {
    return debug.bind(undefined, name);
  }
  let delta = '';
  const current = now();
  if (last) {
    delta = debugLogApi.formatDuration(current - last);
  }
  last = current;
  if (debugSettings.has(name)) {
    const category = debugLogApi.formatCategory(name, hashString(name));
    debugLogApi.log(`${category} ${message}`, ...args, delta);
  }
  return undefined;
}
