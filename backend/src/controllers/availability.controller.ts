import type { Request, Response, NextFunction } from 'express';
import * as availabilityService from '../services/availability.service.js';
import type { AuthRequest } from '../types/user.types.js';
import type { CreateScheduleDTO, CreateBlockDTO } from '../types/schedule.types.js';
import { ApiError } from '../utils/ApiError.js';

export async function getAvailability(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const facilityId = parseInt(String(req.params.id), 10);
    if (isNaN(facilityId)) {
      throw ApiError.badRequest('Nieprawidłowe ID obiektu.');
    }

    const date = req.query.date as string;
    if (!date) {
      throw ApiError.badRequest('Parametr date jest wymagany (format: YYYY-MM-DD).');
    }

    const slots = await availabilityService.getAvailableSlots(facilityId, date);

    res.status(200).json({ date, facilityId, slots });
  } catch (error) {
    next(error);
  }
}

export async function setSchedule(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const facilityId = parseInt(String(req.params.id), 10);
    if (isNaN(facilityId)) {
      throw ApiError.badRequest('Nieprawidłowe ID obiektu.');
    }

    const schedules = req.body.schedules as CreateScheduleDTO[];
    if (!schedules || !Array.isArray(schedules) || schedules.length === 0) {
      throw ApiError.badRequest('Wymagana jest tablica schedules w ciele zapytania.');
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

export async function createBlock(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const facilityId = parseInt(String(req.params.id), 10);
    if (isNaN(facilityId)) {
      throw ApiError.badRequest('Nieprawidłowe ID obiektu.');
    }

    const data = req.body as CreateBlockDTO;
    if (!data.startTime || !data.endTime) {
      throw ApiError.badRequest('startTime i endTime są wymagane.');
    }

    const block = await availabilityService.createBlock(facilityId, data);

    res.status(201).json({
      message: 'Blokada terminu została utworzona.',
      block,
    });
  } catch (error) {
    next(error);
  }
}

export async function getSchedule(
  req: Request,
  res: Response,
  next: NextFunction,
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
