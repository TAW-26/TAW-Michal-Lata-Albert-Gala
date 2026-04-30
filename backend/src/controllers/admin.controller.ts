import type { Response, NextFunction } from 'express';
import * as facilityService from '../services/facility.service.js';
import * as facilityRepository from '../repositories/facility.repository.js';
import * as availabilityService from '../services/availability.service.js';
import * as userService from '../services/user.service.js';
import * as reservationService from '../services/reservation.service.js';
import type { AuthRequest } from '../types/user.types.js';
import type { ReservationStatus } from '../types/reservation.types.js';
import { ApiError } from '../utils/ApiError.js';

// ===== Facilities =====

export async function getAllFacilities(
  _req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const facilities = await facilityRepository.findAllAdmin();
    res.status(200).json({ facilities });
  } catch (error) {
    next(error);
  }
}

export async function updateFacilityPrice(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) {
      throw ApiError.badRequest('Nieprawidłowe ID obiektu.');
    }

    const { hourlyRate } = req.body;
    if (hourlyRate === undefined || hourlyRate <= 0) {
      throw ApiError.badRequest(
        'Cena za godzinę jest wymagana i musi być większa od 0.'
      );
    }

    const facility = await facilityService.update(id, { hourlyRate });

    res.status(200).json({
      message: 'Cena została zaktualizowana.',
      facility,
    });
  } catch (error) {
    next(error);
  }
}

// ===== Schedules =====

export async function getFacilitySchedule(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const facilityId = parseInt(String(req.params.id), 10);
    if (isNaN(facilityId)) {
      throw ApiError.badRequest('Nieprawidłowe ID obiektu.');
    }

    const schedules = await availabilityService.getSchedule(facilityId);
    res.status(200).json({ facilityId, schedules });
  } catch (error) {
    next(error);
  }
}

export async function updateFacilitySchedule(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const facilityId = parseInt(String(req.params.id), 10);
    if (isNaN(facilityId)) {
      throw ApiError.badRequest('Nieprawidłowe ID obiektu.');
    }

    const schedules = req.body.schedules;
    if (!schedules || !Array.isArray(schedules) || schedules.length === 0) {
      throw ApiError.badRequest(
        'Wymagana jest tablica schedules w ciele zapytania.'
      );
    }

    const result = await availabilityService.setSchedule(facilityId, schedules);

    res.status(200).json({
      message: 'Harmonogram został zaktualizowany.',
      schedules: result,
    });
  } catch (error) {
    next(error);
  }
}

// ===== Users =====

export async function getAllUsers(
  _req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
}

export async function getUserDetails(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) {
      throw ApiError.badRequest('Nieprawidłowe ID użytkownika.');
    }

    const data = await userService.getUserWithReservations(id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
}

// ===== Reservations =====

export async function getReservations(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const status = req.query.status as ReservationStatus | undefined;
    const reservations = await reservationService.getAllReservations(status);
    res.status(200).json({ reservations });
  } catch (error) {
    next(error);
  }
}

export async function approveReservation(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) {
      throw ApiError.badRequest('Nieprawidłowe ID rezerwacji.');
    }

    const reservation = await reservationService.approveReservation(id);

    res.status(200).json({
      message: 'Rezerwacja została zatwierdzona.',
      reservation,
    });
  } catch (error) {
    next(error);
  }
}

export async function rejectReservation(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) {
      throw ApiError.badRequest('Nieprawidłowe ID rezerwacji.');
    }

    const { reason } = req.body as { reason?: string };
    const reservation = await reservationService.rejectReservation(id, reason);

    res.status(200).json({
      message: 'Rezerwacja została odrzucona.',
      reservation,
    });
  } catch (error) {
    next(error);
  }
}
