import { Request, Response, NextFunction } from 'express';
import { ValidationError, FieldError } from '../utils/appError';

export type ValidationSchema = {
  body?: Record<string, (val: any) => string | null>;
  query?: Record<string, (val: any) => string | null>;
  params?: Record<string, (val: any) => string | null>;
};

export function validate(schema: ValidationSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: FieldError[] = [];

    if (schema.body && req.body) {
      for (const [field, validator] of Object.entries(schema.body)) {
        const errorMsg = validator(req.body[field]);
        if (errorMsg) {
          errors.push({ field: `body.${field}`, message: errorMsg });
        }
      }
    }

    if (schema.query && req.query) {
      for (const [field, validator] of Object.entries(schema.query)) {
        const errorMsg = validator(req.query[field]);
        if (errorMsg) {
          errors.push({ field: `query.${field}`, message: errorMsg });
        }
      }
    }

    if (schema.params && req.params) {
      for (const [field, validator] of Object.entries(schema.params)) {
        const errorMsg = validator(req.params[field]);
        if (errorMsg) {
          errors.push({ field: `params.${field}`, message: errorMsg });
        }
      }
    }

    if (errors.length > 0) {
      return next(new ValidationError('Request validation failed', errors));
    }

    next();
  };
}

// Common validator helper functions
export const Validators = {
  required: (fieldName: string) => (val: any) => {
    if (val === undefined || val === null || (typeof val === 'string' && val.trim() === '')) {
      return `${fieldName} is required.`;
    }
    return null;
  },
  email: (val: any) => {
    if (!val) return 'Email is required.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(val))) {
      return 'Must be a valid email address.';
    }
    return null;
  },
  phone: (val: any) => {
    if (!val) return 'Phone number is required.';
    const clean = String(val).replace(/[\s\-\+\(\)]/g, '');
    if (clean.length < 10) {
      return 'Must be a valid phone number (minimum 10 digits).';
    }
    return null;
  },
  minLength: (min: number, fieldName: string) => (val: any) => {
    if (val && String(val).trim().length < min) {
      return `${fieldName} must be at least ${min} characters long.`;
    }
    return null;
  },
  positiveNumber: (fieldName: string) => (val: any) => {
    const num = Number(val);
    if (isNaN(num) || num <= 0) {
      return `${fieldName} must be a positive number.`;
    }
    return null;
  },
  oneOf: (allowed: any[], fieldName: string) => (val: any) => {
    if (val && !allowed.includes(val)) {
      return `${fieldName} must be one of: [${allowed.join(', ')}].`;
    }
    return null;
  },
};
