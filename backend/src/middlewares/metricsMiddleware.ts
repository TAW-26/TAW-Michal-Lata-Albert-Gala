import { Request, Response, NextFunction } from 'express';
import { activeConnections, httpRequestsTotal, httpRequestDurationMs } from '../monitoring/metrics.js';

export function metricsMiddleware(req: Request, res: Response, next: NextFunction) {
  const startMs = Date.now();
  
  // Zwiększamy liczbę aktywnych połączeń
  activeConnections.inc();

  res.on('finish', () => {
    const durationMs = Date.now() - startMs;
    // req.route?.path zbiera wzorzec routy (np. /api/users/:id), a nie konkretny URL
    const route = req.route?.path ?? req.path; 
    
    const labels = { 
        method: req.method, 
        route: route, 
        status_code: String(res.statusCode) 
    };

    // Aktualizacja metryk po zakończeniu zapytania
    httpRequestsTotal.inc(labels);
    httpRequestDurationMs.observe(labels, durationMs);
    activeConnections.dec();
  });

  next();
}