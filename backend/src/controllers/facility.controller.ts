import type { Request, Response, NextFunction } from 'express';
import * as facilityService from '../services/facility.service.js';
import type { AuthRequest } from '../types/user.types.js';
import type {
  CreateFacilityDTO,
  UpdateFacilityDTO,
  FacilityQuery,
} from '../types/facility.types.js';
import { ApiError } from '../utils/ApiError.js';

export async function search(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const filters: FacilityQuery = {
      city: req.query.city as string | undefined,
      type: req.query.type as string | undefined,
      maxPrice: req.query.maxPrice
        ? parseFloat(req.query.maxPrice as string)
        : undefined,
      minPrice: req.query.minPrice
        ? parseFloat(req.query.minPrice as string)
        : undefined,
      search: req.query.search as string | undefined,
    };

    const facilities = await facilityService.search(filters);

    res.status(200).json({ facilities });
  } catch (error) {
    next(error);
  }
}

export async function getById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) {
      throw ApiError.badRequest('Nieprawidłowe ID obiektu.');
    }

    const facility = await facilityService.getById(id);

    res.status(200).json({ facility });
  } catch (error) {
    next(error);
  }
}

export async function create(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const ownerId = req.user?.userId;
    if (!ownerId) {
      throw new ApiError(401, 'Nieautoryzowany');
    }

    const data = req.body as CreateFacilityDTO;
    const facility = await facilityService.create(ownerId, data);

    res.status(201).json({
      message: 'Obiekt sportowy utworzony pomyślnie.',
      facility,
    });
  } catch (error) {
    next(error);
  }
}

export async function update(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) {
      throw ApiError.badRequest('Nieprawidłowe ID obiektu.');
    }

    const data = req.body as UpdateFacilityDTO;
    const facility = await facilityService.update(id, data);

    res.status(200).json({
      message: 'Obiekt sportowy zaktualizowany pomyślnie.',
      facility,
    });
  } catch (error) {
    next(error);
  }
}

export async function remove(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(String(req.params.id), 10);
    if (isNaN(id)) {
      throw ApiError.badRequest('Nieprawidłowe ID obiektu.');
    }

    await facilityService.remove(id);

    res.status(200).json({
      message: 'Obiekt sportowy został zarchiwizowany.',
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyFacilities(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const ownerId = req.user?.userId;
    if (!ownerId) {
      throw new ApiError(401, 'Nieautoryzowany');
    }

    const facilities = await facilityService.getByOwner(ownerId);

    res.status(200).json({ facilities });
  } catch (error) {
    next(error);
  }
}
