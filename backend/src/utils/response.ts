import { Response } from 'express';
import { HTTP_STATUS } from '../constants/statusCodes';
import { FieldError } from './appError';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  code?: string;
  errors?: FieldError[];
}

export function sendSuccess<T>(
  res: Response,
  data?: T,
  message: string = 'Operation successful',
  statusCode: number = HTTP_STATUS.OK
): Response {
  const responseBody: ApiResponse<T> = {
    success: true,
    message,
    ...(data !== undefined ? { data } : {}),
  };
  return res.status(statusCode).json(responseBody);
}

export function sendCreated<T>(
  res: Response,
  data: T,
  message: string = 'Resource created successfully'
): Response {
  return sendSuccess(res, data, message, HTTP_STATUS.CREATED);
}

export function sendError(
  res: Response,
  message: string,
  statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  code: string = 'INTERNAL_ERROR',
  errors?: FieldError[]
): Response {
  const responseBody: ApiResponse = {
    success: false,
    message,
    code,
    ...(errors && errors.length > 0 ? { errors } : {}),
  };
  return res.status(statusCode).json(responseBody);
}
