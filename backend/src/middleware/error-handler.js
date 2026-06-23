import { ProviderError } from '../providers/base-provider.js';
import { logger } from '../utils/logger.js';

export function errorHandler(err, _req, res, _next) {
  logger.error('Request error:', { message: err.message, stack: err.stack });

  if (err instanceof ProviderError) {
    return res.status(err.statusCode || 502).json({
      error: 'Provider Error',
      message: err.message,
      provider: err.provider,
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message,
    });
  }

  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred'
      : err.message,
  });
}
