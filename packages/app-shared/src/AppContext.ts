export interface AppContext {
  appDataDir: string;
}

let appContext: AppContext;

export function setAppContext(value: AppContext): void {
  appContext = value;
}

export function getAppContext(): AppContext {
  if (!appContext) {
    throw new ReferenceError('AppContext not configured!');
  }
  return appContext;
}
