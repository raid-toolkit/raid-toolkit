/* eslint-disable max-classes-per-file */
export type ErrorDetails<TProperties extends {} = {}> = {
  message: string;
  type: string;
  details: TProperties;
};

export abstract class ApiError<TProperties extends {} = {}> extends Error {
  abstract get status(): number;

  public type: string;

  public json(): ErrorDetails<TProperties> {
    const details = this.additionalProperties as TProperties;
    const result: ErrorDetails<TProperties> = {
      message: this.message,
      type: this.type,
      details,
    };
    return result;
  }

  constructor(
    ...args: {} extends TProperties
      ? [message: string, additionalProperties?: TProperties]
      : [message: string, additionalProperties: TProperties]
  );
  constructor(message: string, private readonly additionalProperties?: TProperties) {
    super(message);
    this.type = this.constructor.name;
  }
}

export class ClientApiError<TProperties extends {} = {}> extends ApiError<TProperties> {
  constructor(readonly status: number, details: ErrorDetails<TProperties>) {
    // @ts-ignore
    super(details.message, details.details);
    this.type = details.type;
  }
}

export class InvalidApplicationCredentialsError extends ApiError {
  readonly status = 401;
}

export class AuthorizationRequiredError extends ApiError {
  readonly status = 401;
  constructor() {
    super('Authorization required');
  }
}

export class AuthorizationRejectedError extends ApiError {
  readonly status = 403;
}

export class TokenExpiredError extends ApiError {
  readonly status = 403;
}

export class ApplicationNotGrantedError extends ApiError<{ appId: string }> {
  readonly status = 403;
}

export class ScopeNotGrantedError extends ApiError<{ scope: string[] }> {
  readonly status = 403;
}

export class ResourceNotFoundError extends ApiError<{ resourceType?: string; id?: string }> {
  readonly status = 404;
}

export class ConflictError extends ApiError {
  readonly status = 409;
}

export function isErrorType<T extends { new (...args: any[]): ApiError }>(
  error: ApiError,
  errorType: T
): error is InstanceType<T> {
  return error.type === errorType.name;
}

export function isErrorDetails(data: unknown): data is ErrorDetails {
  return !!(data as any).message && !!(data as any).type;
}

export function handleResponseError(status: number, details: unknown): never {
  if (isErrorDetails(details)) {
    throw new ClientApiError(status, details);
  }
  throw new Error(`Server responded with status ${status}`);
}

export async function handleResponse<T>(status: number, data: Promise<any>): Promise<T> {
  let details: unknown;
  try {
    details = await data;
  } catch (e) {
    throw new Error(`Server responded with status ${status}`);
  }
  if (status >= 400) {
    handleResponseError(status, details);
  }
  return details as T;
}

export function assertApiError<T extends { new (...args: any[]): ApiError }>(
  e: unknown,
  errorType?: T
): asserts e is ApiError {
  if (!(e instanceof ApiError)) {
    throw e;
  }
  if (errorType && !isErrorType(e, errorType)) {
    throw e;
  }
}
