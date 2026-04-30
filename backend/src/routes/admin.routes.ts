import { Router } from 'express';
import * as adminController from '../controllers/admin.controller.js';
import { requireAuth, requireAdmin } from '../middlewares/auth.middleware.js';

const router = Router();

// All admin routes require authentication + admin role
router.use(requireAuth, requireAdmin);

// ===== Facilities =====

// GET /api/admin/facilities – List all facilities (active + inactive)
router.get('/facilities', adminController.getAllFacilities);

// PUT /api/admin/facilities/:id/price – Update facility price
router.put('/facilities/:id/price', adminController.updateFacilityPrice);

// GET /api/admin/facilities/:id/schedule – Get facility schedule
router.get('/facilities/:id/schedule', adminController.getFacilitySchedule);

// PUT /api/admin/facilities/:id/schedule – Update facility schedule
router.put('/facilities/:id/schedule', adminController.updateFacilitySchedule);

// ===== Users =====

// GET /api/admin/users – List all users
router.get('/users', adminController.getAllUsers);

// GET /api/admin/users/:id – Get user details with reservation history
router.get('/users/:id', adminController.getUserDetails);

// ===== Reservations =====

// GET /api/admin/reservations – List reservations (optional ?status=pending)
router.get('/reservations', adminController.getReservations);

// PATCH /api/admin/reservations/:id/approve – Approve a pending reservation
router.patch('/reservations/:id/approve', adminController.approveReservation);

// PATCH /api/admin/reservations/:id/reject – Reject a pending reservation
router.patch('/reservations/:id/reject', adminController.rejectReservation);

export default router;
