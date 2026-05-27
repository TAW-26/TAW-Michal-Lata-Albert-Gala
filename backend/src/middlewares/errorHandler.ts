import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { apiErrorsTotal } from '../monitoring/metrics.js';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ApiError) {
    if (err.statusCode === 404) {
      apiErrorsTotal.inc({ type: 'not_found' });
    } else if (err.statusCode === 400) {
      apiErrorsTotal.inc({ type: 'bad_request' });
    }

    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Wewnętrzny błąd serwera' });
}
