import express from 'express';
import authRoutes from './routes/auth.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get('/', (_req, res) => {
  res.json({ message: 'TAW Rezerwacje API' });
});

app.use('/api/auth', authRoutes);

app.use(errorHandler);

export default app;
