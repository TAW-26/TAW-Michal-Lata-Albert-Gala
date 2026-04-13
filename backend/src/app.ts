import express from 'express';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import facilityRoutes from './routes/facility.routes.js';
import reservationRoutes from './routes/reservation.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';

const app = express();

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

app.use(errorHandler);

export default app;
