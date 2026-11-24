/**
 * Standard Success Response JSON Formatter
 */
export const successResponse = (res, message = 'Berhasil', data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Standard Error Response JSON Formatter
 */
export const errorResponse = (res, message = 'Terjadi kesalahan', errors = null, statusCode = 400) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
