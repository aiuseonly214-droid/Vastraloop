import { HTTP_STATUS, ERROR_CODES } from '../constants/statusCodes';

export interface FieldError {
  field: string;
  message: string;
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly errors?: FieldError[];

  constructor(
    message: string,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    code: string = ERROR_CODES.INTERNAL_ERROR,
    errors?: FieldError[]
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    this.errors = errors;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = 'Bad request', code: string = ERROR_CODES.BAD_REQUEST, errors?: FieldError[]) {
    super(message, HTTP_STATUS.BAD_REQUEST, code, errors);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized access', code: string = ERROR_CODES.UNAUTHORIZED) {
    super(message, HTTP_STATUS.UNAUTHORIZED, code);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden - Insufficient permissions', code: string = ERROR_CODES.FORBIDDEN) {
    super(message, HTTP_STATUS.FORBIDDEN, code);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found', code: string = ERROR_CODES.NOT_FOUND) {
    super(message, HTTP_STATUS.NOT_FOUND, code);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Conflict with existing resource', code: string = ERROR_CODES.CONFLICT) {
    super(message, HTTP_STATUS.CONFLICT, code);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed', errors?: FieldError[]) {
    super(message, HTTP_STATUS.UNPROCESSABLE_ENTITY, ERROR_CODES.VALIDATION_ERROR, errors);
  }
}
