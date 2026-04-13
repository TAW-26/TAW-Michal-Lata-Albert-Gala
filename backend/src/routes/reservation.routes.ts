import { Router } from 'express';
import * as reservationController from '../controllers/reservation.controller.js';
import { requireAuth, requireOwner } from '../middlewares/auth.middleware.js';

const router = Router();

// POST /api/reservations – Create a new reservation
router.post('/', requireAuth, reservationController.create);

// GET /api/reservations – Get current user's reservations
router.get('/', requireAuth, reservationController.getMyReservations);

// GET /api/reservations/:id – Get reservation details
router.get('/:id', requireAuth, reservationController.getById);

// PATCH /api/reservations/:id/cancel – Cancel a reservation (24h policy)
router.patch('/:id/cancel', requireAuth, reservationController.cancel);

// PATCH /api/reservations/:id/status – Update reservation status (owner only)
router.patch('/:id/status', requireAuth, requireOwner, reservationController.updateStatus);

export default router;
