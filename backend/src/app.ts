import express from 'express';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import facilityRoutes from './routes/facility.routes.js';
import reservationRoutes from './routes/reservation.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { metricsMiddleware } from './middlewares/metricsMiddleware.js';
import { register, apiErrorsTotal } from './monitoring/metrics.js';
import { errorHandler } from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(metricsMiddleware);

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get('/', (_req, res) => {
  res.json({ message: 'TAW Rezerwacje API' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/admin', adminRoutes);

app.use((req, res, next) => {
  if (apiErrorsTotal) {
      apiErrorsTotal.inc({ type: 'not_found' });
  }
  
  res.status(404).json({ message: 'Nie znaleziono takiej ścieżki' });
});

app.use(errorHandler);

export default app;

