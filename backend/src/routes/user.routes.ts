import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import * as facilityController from '../controllers/facility.controller.js';
import { requireAuth, requireOwner } from '../middlewares/auth.middleware.js';

const router = Router();

// GET /api/users/me – Get current user profile
router.get('/me', requireAuth, userController.getMe);

// PUT /api/users/me – Update current user profile
router.put('/me', requireAuth, userController.updateMe);

// GET /api/users/me/facilities – Get facilities owned by current user
router.get('/me/facilities', requireAuth, requireOwner, facilityController.getMyFacilities);

export default router;
