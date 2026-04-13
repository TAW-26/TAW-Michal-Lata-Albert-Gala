import type { Request, Response, NextFunction } from 'express';
import * as reservationService from '../services/reservation.service.js';
import type { AuthRequest } from '../types/user.types.js';
import type {
  CreateReservationDTO,
  ReservationStatus,
} from '../types/reservation.types.js';
import { ApiError } from '../utils/ApiError.js';

export async function create(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApiError(401, 'Nieautoryzowany');
    }

    const data = req.body as CreateReservationDTO;
    if (!data.facilityId || !data.startTime || !data.endTime) {
      throw ApiError.badRequest(
        'Wymagane pola: facilityId, startTime, endTime.'
      );
    }

    const reservation = await reservationService.create(userId, data);

    res.status(201).json({
      message: 'Rezerwacja została utworzona pomyślnie.',
      reservation,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyReservations(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApiError(401, 'Nieautoryzowany');
    }

    const reservations = await reservationService.getByUser(userId);

    res.status(200).json({ reservations });
  } catch (error) {
    next(error);
  }
}

export async function getById(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) {
      throw ApiError.badRequest('Nieprawidłowe ID rezerwacji.');
    }

    const reservation = await reservationService.getById(id);

    // Check access: user can see their own, owner can see their facility's
    const userId = req.user?.userId;
    if (reservation.user_id !== userId) {
      // Check if user is the facility owner
      const facilityReservations = await reservationService.getByFacility(
        reservation.facility_id
      );
      const isOwnerOfFacility =
        facilityReservations.length >= 0 && req.user?.role === 'owner';
      if (!isOwnerOfFacility) {
        throw ApiError.forbidden('Nie masz dostępu do tej rezerwacji.');
      }
    }

    res.status(200).json({ reservation });
  } catch (error) {
    next(error);
  }
}

export async function cancel(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApiError(401, 'Nieautoryzowany');
    }

    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) {
      throw ApiError.badRequest('Nieprawidłowe ID rezerwacji.');
    }

    const reservation = await reservationService.cancel(id, userId);

    res.status(200).json({
      message: 'Rezerwacja została anulowana.',
      reservation,
    });
  } catch (error) {
    next(error);
  }
}

export async function getFacilityReservations(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const facilityId = parseInt(String(req.params.id), 10);
    if (isNaN(facilityId)) {
      throw ApiError.badRequest('Nieprawidłowe ID obiektu.');
    }

    const reservations = await reservationService.getByFacility(facilityId);

    res.status(200).json({ reservations });
  } catch (error) {
    next(error);
  }
}

export async function updateStatus(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) {
      throw ApiError.badRequest('Nieprawidłowe ID rezerwacji.');
    }

    const { status } = req.body as { status: ReservationStatus };
    if (!status) {
      throw ApiError.badRequest('Pole status jest wymagane.');
    }

    const reservation = await reservationService.updateStatus(id, status);

    res.status(200).json({
      message: 'Status rezerwacji został zaktualizowany.',
      reservation,
    });
  } catch (error) {
    next(error);
  }
}
