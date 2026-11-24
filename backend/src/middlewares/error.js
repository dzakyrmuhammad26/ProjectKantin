import { AppError } from '../utils/appError.js';

export const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV === 'development' && statusCode === 500) {
    console.error('💥 Unhandled Error:', err);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || null,
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
};
