import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import * as facilityController from '../controllers/facility.controller.js';
import { requireAuth, requireOwner } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/me', requireAuth, userController.getMe);

router.put('/me', requireAuth, userController.updateMe);

router.put('/me/password', requireAuth, userController.changePassword);

router.delete('/me', requireAuth, userController.deleteMe);

router.get(
  '/me/facilities',
  requireAuth,
  requireOwner,
  facilityController.getMyFacilities
);

export default router;
