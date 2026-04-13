import { Router } from 'express';
import * as facilityController from '../controllers/facility.controller.js';
import * as availabilityController from '../controllers/availability.controller.js';
import * as reservationController from '../controllers/reservation.controller.js';
import { requireAuth, requireOwner, requireOwnerOfFacility } from '../middlewares/auth.middleware.js';

const router = Router();

// === Public endpoints ===

// GET /api/facilities – Search/filter facilities
router.get('/', facilityController.search);

// GET /api/facilities/:id – Get facility details
router.get('/:id', facilityController.getById);

// === Owner endpoints ===

// POST /api/facilities – Create a new facility
router.post('/', requireAuth, requireOwner, facilityController.create);

// PUT /api/facilities/:id – Update a facility
router.put('/:id', requireAuth, requireOwnerOfFacility, facilityController.update);

// DELETE /api/facilities/:id – Archive a facility
router.delete('/:id', requireAuth, requireOwnerOfFacility, facilityController.remove);

// === Availability endpoints ===

// GET /api/facilities/:id/availability – Get available time slots
router.get('/:id/availability', availabilityController.getAvailability);

// GET /api/facilities/:id/schedule – Get facility schedule
router.get('/:id/schedule', availabilityController.getSchedule);

// POST /api/facilities/:id/schedule – Set opening hours (owner only)
router.post('/:id/schedule', requireAuth, requireOwnerOfFacility, availabilityController.setSchedule);

// POST /api/facilities/:id/blocks – Block a time period (owner only)
router.post('/:id/blocks', requireAuth, requireOwnerOfFacility, availabilityController.createBlock);

// === Facility reservations (owner view) ===

// GET /api/facilities/:id/reservations – List all reservations for a facility
router.get('/:id/reservations', requireAuth, requireOwnerOfFacility, reservationController.getFacilityReservations);

export default router;
