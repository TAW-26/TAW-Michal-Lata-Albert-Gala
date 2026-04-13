import * as facilityRepository from '../repositories/facility.repository.js';
import { ApiError } from '../utils/ApiError.js';
import type { Facility, CreateFacilityDTO, UpdateFacilityDTO, FacilityQuery } from '../types/facility.types.js';

export async function search(filters: FacilityQuery): Promise<Facility[]> {
  return facilityRepository.findAll(filters);
}

export async function getById(id: number): Promise<Facility> {
  const facility = await facilityRepository.findById(id);
  if (!facility) {
    throw ApiError.notFound('Obiekt sportowy nie został znaleziony.');
  }
  return facility;
}

export async function create(ownerId: number, data: CreateFacilityDTO): Promise<Facility> {
  if (!data.name || !data.type || data.hourlyRate === undefined) {
    throw ApiError.badRequest('Wymagane pola: name, type, hourlyRate.');
  }

  if (data.hourlyRate <= 0) {
    throw ApiError.badRequest('Cena za godzinę musi być większa od 0.');
  }

  return facilityRepository.create(ownerId, data);
}

export async function update(id: number, data: UpdateFacilityDTO): Promise<Facility> {
  const facility = await facilityRepository.findById(id);
  if (!facility) {
    throw ApiError.notFound('Obiekt sportowy nie został znaleziony.');
  }

  if (data.hourlyRate !== undefined && data.hourlyRate <= 0) {
    throw ApiError.badRequest('Cena za godzinę musi być większa od 0.');
  }

  return facilityRepository.update(id, data);
}

export async function remove(id: number): Promise<void> {
  const facility = await facilityRepository.findById(id);
  if (!facility) {
    throw ApiError.notFound('Obiekt sportowy nie został znaleziony.');
  }

  await facilityRepository.remove(id);
}

export async function getByOwner(ownerId: number): Promise<Facility[]> {
  return facilityRepository.findByOwnerId(ownerId);
}
