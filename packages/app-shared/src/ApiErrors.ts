/* eslint-disable max-classes-per-file */
export type ErrorDetails<TProperties extends {} = {}> = {
  message: string;
  type: string;
  details: TProperties;
};

export abstract class ApiError<TProperties extends {} = {}> extends Error {
  abstract get status(): number;
  abstract get type(): string;

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
  }
}

export interface ApiErrorType<T extends ApiError = ApiError> {
  new (...args: any[]): ApiError<T>;
  readonly typeName: string;
}

export class ClientApiError<TProperties extends {} = {}> extends ApiError<TProperties> {
  public readonly type: string;
  constructor(readonly status: number, details: ErrorDetails<TProperties>) {
    // @ts-ignore
    super(details.message, details.details);
    this.type = details.type;
  }
}

export class InvalidApplicationCredentialsError extends ApiError {
  static readonly typeName = 'InvalidApplicationCredentialsError';
  public readonly type = 'InvalidApplicationCredentialsError';
  readonly status = 401;
}

export class AuthorizationRequiredError extends ApiError {
  static readonly typeName = 'AuthorizationRequiredError';
  public readonly type = 'AuthorizationRequiredError';
  readonly status = 401;
  constructor() {
    super('Authorization required');
  }
}

export class AuthorizationRejectedError extends ApiError {
  static readonly typeName = 'AuthorizationRejectedError';
  public readonly type = 'AuthorizationRejectedError';
  readonly status = 403;
}

export class TokenExpiredError extends ApiError {
  static readonly typeName = 'TokenExpiredError';
  public readonly type = 'TokenExpiredError';
  readonly status = 403;
}

export class ApplicationNotGrantedError extends ApiError<{ appId: string }> {
  static readonly typeName = 'ApplicationNotGrantedError';
  public readonly type = 'ApplicationNotGrantedError';
  readonly status = 403;
}

export class ScopeNotGrantedError extends ApiError<{ scope: string[] }> {
  static readonly typeName = 'ScopeNotGrantedError';
  public readonly type = 'ScopeNotGrantedError';
  readonly status = 403;
}

export class ResourceNotFoundError extends ApiError<{ resourceType?: string; id?: string }> {
  static readonly typeName = 'ResourceNotFoundError';
  public readonly type = 'ResourceNotFoundError';
  readonly status = 404;
}

export class ConflictError extends ApiError {
  static readonly typeName = 'ConflictError';
  public readonly type = 'ConflictError';
  readonly status = 409;
}

export function isErrorType<T extends ApiErrorType>(error: ApiError, errorType: T): error is InstanceType<T> {
  return error.type === errorType.typeName;
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

export function assertApiError<T extends ApiErrorType>(e: unknown, errorType?: T): asserts e is ApiError {
  if (!(e instanceof ApiError)) {
    throw e;
  }
  if (errorType && !isErrorType(e, errorType)) {
    throw e;
  }
}
