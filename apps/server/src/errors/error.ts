export type ErrorStatusCode = 400 | 401 | 404 | 500;

export class BaseError extends Error {
  constructor(
    public readonly message: string,
    public readonly status: ErrorStatusCode,
  ) {
    super();
  }
}

export class AppError extends BaseError {
  constructor(message: string, status: ErrorStatusCode) {
    super(message, status);
  }
}

export class UnauthorizedError extends AppError {
  constructor() {
    super("unauthorized", 401);
  }
}

export class NotFoundError extends AppError {
  constructor() {
    super("not found", 404);
  }
}

export class InternalServerError extends AppError {
  constructor() {
    super("internal server error", 500);
  }
}

// TODO: logの取り方は余裕があれば改善する
export class SystemError extends InternalServerError {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(message: string) {
    // console.log(message);
    super();
  }
}

export class EmptyIdError extends SystemError {
  constructor() {
    super("empty id");
  }
}

export class NonEmptyIdError extends SystemError {
  constructor() {
    super("id must be null");
  }
}

export class ValidationError extends SystemError {
  constructor(message: string) {
    super(message);
  }
}
