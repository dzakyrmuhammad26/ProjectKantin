import { ZodError } from 'zod';

/**
 * Middleware untuk memvalidasi request body, params, dan query menggunakan Zod Schema
 * @param {import('zod').ZodSchema} schema
 */
export const validate = (schema) => async (req, res, next) => {
  try {
    const parsed = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    // Perbarui objek req dengan data yang sudah di-parse & di-sanitize
    if (parsed.body !== undefined) req.body = parsed.body;
    if (parsed.query !== undefined) req.query = parsed.query;
    if (parsed.params !== undefined) req.params = parsed.params;

    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.issues.map((issue) => {
        // Buang path pertama ('body', 'query', atau 'params') agar lebih bersih untuk client
        const path = issue.path.slice(1).join('.') || issue.path.join('.');
        return {
          field: path,
          location: issue.path[0] || 'body',
          message: issue.message,
        };
      });

      return res.status(400).json({
        success: false,
        message: 'Validasi input gagal',
        errors: formattedErrors,
      });
    }

    next(error);
  }
};
