import { app } from './app';
import { ENV } from './config/env';
import { logger } from './config/logger';

const server = app.listen(ENV.PORT, () => {
  logger.info(`==================================================`);
  logger.info(`🚀 Vastraloop Backend API Server running on port ${ENV.PORT}`);
  logger.info(`🌐 Environment: ${ENV.NODE_ENV}`);
  logger.info(`🔗 Base URL: http://localhost:${ENV.PORT}/api/v1`);
  logger.info(`❤️ Health Check: http://localhost:${ENV.PORT}/api/v1/health`);
  logger.info(`==================================================`);
});

// Graceful shutdown handling
function handleShutdown(signal: string) {
  logger.info(`Received ${signal}. Gracefully shutting down Vastraloop server...`);
  server.close(() => {
    logger.info('Server connection pool closed. Exiting process.');
    process.exit(0);
  });

  // Force shutdown if hung
  setTimeout(() => {
    logger.error('Forced shutdown after timeout.');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

export default server;
