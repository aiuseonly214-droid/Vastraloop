type LogLevel = 'info' | 'warn' | 'error' | 'debug';

function sanitize(data: any): any {
  if (!data || typeof data !== 'object') return data;
  const sanitized = Array.isArray(data) ? [...data] : { ...data };
  const sensitiveKeys = ['password', 'passwordHash', 'token', 'jwt', 'secret', 'apiKey', 'authorization'];
  for (const key of Object.keys(sanitized)) {
    if (sensitiveKeys.some((s) => key.toLowerCase().includes(s))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof sanitized[key] === 'object') {
      sanitized[key] = sanitize(sanitized[key]);
    }
  }
  return sanitized;
}

export const logger = {
  info: (message: string, meta?: any) => {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` ${JSON.stringify(sanitize(meta))}` : '';
    console.log(`[${timestamp}] [INFO]: ${message}${metaStr}`);
  },
  warn: (message: string, meta?: any) => {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` ${JSON.stringify(sanitize(meta))}` : '';
    console.warn(`[${timestamp}] [WARN]: ${message}${metaStr}`);
  },
  error: (message: string, meta?: any) => {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` ${JSON.stringify(sanitize(meta))}` : '';
    console.error(`[${timestamp}] [ERROR]: ${message}${metaStr}`);
  },
  debug: (message: string, meta?: any) => {
    if (process.env.NODE_ENV !== 'production') {
      const timestamp = new Date().toISOString();
      const metaStr = meta ? ` ${JSON.stringify(sanitize(meta))}` : '';
      console.debug(`[${timestamp}] [DEBUG]: ${message}${metaStr}`);
    }
  }
};
