export enum ErrorTags {
  Fatal = 'fatal',
  Error = 'error',
  Internal = 'internal',
  NotSupported = 'not-supported',
  AccessDenied = 'access-denied',
  VersionMismatch = 'version-mismatch',
  NotRunning = 'not-running',
}

export class ApplicationError extends Error {
  constructor(message: string, readonly errorTag: string = 'error') {
    super(message);
  }
}

export function isApplicationError(e: any): e is ApplicationError {
  return !!e.errorTag;
}

export function getErrorTag(e: Error): string {
  if (isApplicationError(e)) {
    return e.errorTag;
  }
  return 'error';
}
