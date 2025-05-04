import type { ContentfulStatusCode } from "hono/utils/http-status";

export class BaseError extends Error {
  constructor(
    public readonly message: string,
    public readonly status: ContentfulStatusCode,
  ) {
    super();
  }
}

export class AppError extends BaseError {
  constructor(message: string, status: ContentfulStatusCode) {
    super(message, status);
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

export class SystemError extends AppError {
  constructor(message: string, status: ContentfulStatusCode) {
    super(message, status);
  }
}

export class EmptyIdError extends SystemError {
  constructor() {
    super("empty id", 500);
  }
}

export class NonEmptyIdError extends SystemError {
  constructor() {
    super("id must be null", 500);
  }
}

export class ValidationError extends SystemError {
  constructor(message: string) {
    super(message, 500);
  }
}
