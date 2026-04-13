import * as scheduleRepository from '../repositories/schedule.repository.js';
import * as blockRepository from '../repositories/block.repository.js';
import * as reservationRepository from '../repositories/reservation.repository.js';
import * as facilityRepository from '../repositories/facility.repository.js';
import { ApiError } from '../utils/ApiError.js';
import type { CreateScheduleDTO, CreateBlockDTO, FacilitySchedule, FacilityBlock, TimeSlot } from '../types/schedule.types.js';

export async function getAvailableSlots(
  facilityId: number,
  dateStr: string,
): Promise<TimeSlot[]> {
  const facility = await facilityRepository.findById(facilityId);
  if (!facility) {
    throw ApiError.notFound('Obiekt sportowy nie został znaleziony.');
  }

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    throw ApiError.badRequest('Nieprawidłowy format daty. Użyj formatu YYYY-MM-DD.');
  }

  // Get day of week (0=Monday, 6=Sunday) - JS getDay() returns 0=Sunday
  const jsDay = date.getDay();
  const dayOfWeek = jsDay === 0 ? 6 : jsDay - 1;

  // Get schedule for this day
  const schedule = await scheduleRepository.findByFacilityIdAndDay(facilityId, dayOfWeek);
  if (!schedule) {
    return []; // Facility is closed on this day
  }

  // Parse opening hours
  const openHour = parseInt(schedule.open_time.split(':')[0], 10);
  const closeHour = parseInt(schedule.close_time.split(':')[0], 10);

  // Get day boundaries for querying blocks and reservations
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  // Get blocks and reservations for this day
  const blocks = await blockRepository.findByFacilityIdAndDateRange(facilityId, dayStart, dayEnd);
  const reservations = await reservationRepository.findByFacilityIdAndDateRange(
    facilityId,
    dayStart,
    dayEnd,
  );

  // Generate 1-hour slots from open to close
  const slots: TimeSlot[] = [];

  for (let hour = openHour; hour < closeHour; hour++) {
    const slotStart = new Date(date);
    slotStart.setHours(hour, 0, 0, 0);
    const slotEnd = new Date(date);
    slotEnd.setHours(hour + 1, 0, 0, 0);

    // Check if slot is blocked
    const isBlocked = blocks.some(
      (block) => new Date(block.start_time) < slotEnd && new Date(block.end_time) > slotStart,
    );

    // Check if slot is reserved
    const isReserved = reservations.some(
      (res) => new Date(res.start_time) < slotEnd && new Date(res.end_time) > slotStart,
    );

    const startTimeStr = `${hour.toString().padStart(2, '0')}:00`;
    const endTimeStr = `${(hour + 1).toString().padStart(2, '0')}:00`;

    slots.push({
      startTime: startTimeStr,
      endTime: endTimeStr,
      available: !isBlocked && !isReserved,
    });
  }

  return slots;
}

export async function setSchedule(
  facilityId: number,
  schedules: CreateScheduleDTO[],
): Promise<FacilitySchedule[]> {
  const facility = await facilityRepository.findById(facilityId);
  if (!facility) {
    throw ApiError.notFound('Obiekt sportowy nie został znaleziony.');
  }

  // Validate each schedule entry
  for (const s of schedules) {
    if (s.dayOfWeek < 0 || s.dayOfWeek > 6) {
      throw ApiError.badRequest('dayOfWeek musi być w zakresie 0-6 (0=Poniedziałek, 6=Niedziela).');
    }
    if (!s.openTime || !s.closeTime) {
      throw ApiError.badRequest('openTime i closeTime są wymagane.');
    }
    if (s.openTime >= s.closeTime) {
      throw ApiError.badRequest('openTime musi być wcześniej niż closeTime.');
    }
  }

  // Upsert each schedule entry
  const results: FacilitySchedule[] = [];
  for (const s of schedules) {
    const schedule = await scheduleRepository.upsert(
      facilityId,
      s.dayOfWeek,
      s.openTime,
      s.closeTime,
    );
    results.push(schedule);
  }

  return results;
}

export async function createBlock(
  facilityId: number,
  data: CreateBlockDTO,
): Promise<FacilityBlock> {
  const facility = await facilityRepository.findById(facilityId);
  if (!facility) {
    throw ApiError.notFound('Obiekt sportowy nie został znaleziony.');
  }

  const startTime = new Date(data.startTime);
  const endTime = new Date(data.endTime);

  if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
    throw ApiError.badRequest('Nieprawidłowy format daty. Użyj formatu ISO 8601.');
  }

  if (startTime >= endTime) {
    throw ApiError.badRequest('Czas rozpoczęcia musi być wcześniej niż czas zakończenia.');
  }

  return blockRepository.create(facilityId, startTime, endTime, data.reason);
}

export async function getSchedule(facilityId: number): Promise<FacilitySchedule[]> {
  return scheduleRepository.findByFacilityId(facilityId);
}
