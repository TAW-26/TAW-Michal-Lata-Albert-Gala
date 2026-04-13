import * as reservationRepository from '../repositories/reservation.repository.js';
import * as facilityRepository from '../repositories/facility.repository.js';
import * as scheduleRepository from '../repositories/schedule.repository.js';
import * as blockRepository from '../repositories/block.repository.js';
import { ApiError } from '../utils/ApiError.js';
import type { Reservation, CreateReservationDTO, ReservationStatus, ReservationWithDetails } from '../types/reservation.types.js';

export async function create(
  userId: number,
  data: CreateReservationDTO,
): Promise<Reservation> {
  // Validate facility exists and is active
  const facility = await facilityRepository.findById(data.facilityId);
  if (!facility) {
    throw ApiError.notFound('Obiekt sportowy nie został znaleziony.');
  }
  if (!facility.is_active) {
    throw ApiError.badRequest('Ten obiekt sportowy jest obecnie nieaktywny.');
  }

  const startTime = new Date(data.startTime);
  const endTime = new Date(data.endTime);

  if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
    throw ApiError.badRequest('Nieprawidłowy format daty. Użyj formatu ISO 8601.');
  }

  if (startTime >= endTime) {
    throw ApiError.badRequest('Czas rozpoczęcia musi być wcześniej niż czas zakończenia.');
  }

  if (startTime < new Date()) {
    throw ApiError.badRequest('Nie można zarezerwować terminu w przeszłości.');
  }

  // Check if the slot fits within the facility's schedule
  const jsDay = startTime.getDay();
  const dayOfWeek = jsDay === 0 ? 6 : jsDay - 1;
  const schedule = await scheduleRepository.findByFacilityIdAndDay(data.facilityId, dayOfWeek);

  if (!schedule) {
    throw ApiError.badRequest('Obiekt jest zamknięty w wybranym dniu.');
  }

  const startHour = startTime.getHours();
  const endHour = endTime.getHours();
  const scheduleOpenHour = parseInt(schedule.open_time.split(':')[0], 10);
  const scheduleCloseHour = parseInt(schedule.close_time.split(':')[0], 10);

  if (startHour < scheduleOpenHour || endHour > scheduleCloseHour) {
    throw ApiError.badRequest(
      `Rezerwacja musi mieścić się w godzinach otwarcia: ${schedule.open_time} - ${schedule.close_time}.`,
    );
  }

  // Check for blocks
  const blocks = await blockRepository.findByFacilityIdAndDateRange(
    data.facilityId,
    startTime,
    endTime,
  );
  if (blocks.length > 0) {
    throw ApiError.badRequest('Wybrany termin jest zablokowany przez właściciela obiektu.');
  }

  // Check for conflicting reservations
  const conflicts = await reservationRepository.findConflicting(
    data.facilityId,
    startTime,
    endTime,
  );
  if (conflicts.length > 0) {
    throw ApiError.conflict('Wybrany termin jest już zarezerwowany.');
  }

  // Calculate total price
  const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
  const totalPrice = parseFloat((hours * Number(facility.hourly_rate)).toFixed(2));

  return reservationRepository.create(userId, data.facilityId, startTime, endTime, totalPrice);
}

export async function getByUser(userId: number): Promise<ReservationWithDetails[]> {
  return reservationRepository.findByUserId(userId);
}

export async function getById(id: number): Promise<ReservationWithDetails> {
  const reservation = await reservationRepository.findById(id);
  if (!reservation) {
    throw ApiError.notFound('Rezerwacja nie została znaleziona.');
  }
  return reservation;
}

export async function cancel(id: number, userId: number): Promise<Reservation> {
  const reservation = await reservationRepository.findById(id);
  if (!reservation) {
    throw ApiError.notFound('Rezerwacja nie została znaleziona.');
  }

  if (reservation.user_id !== userId) {
    throw ApiError.forbidden('Nie możesz anulować cudzej rezerwacji.');
  }

  if (reservation.status === 'cancelled') {
    throw ApiError.badRequest('Rezerwacja jest już anulowana.');
  }

  if (reservation.status === 'completed') {
    throw ApiError.badRequest('Nie można anulować zakończonej rezerwacji.');
  }

  // Check 24-hour cancellation policy
  const now = new Date();
  const startTime = new Date(reservation.start_time);
  const hoursUntilStart = (startTime.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursUntilStart < 24) {
    throw ApiError.badRequest(
      'Rezerwację można anulować najpóźniej 24 godziny przed terminem.',
    );
  }

  return reservationRepository.updateStatus(id, 'cancelled');
}

export async function getByFacility(facilityId: number): Promise<ReservationWithDetails[]> {
  return reservationRepository.findByFacilityId(facilityId);
}

export async function updateStatus(
  id: number,
  status: ReservationStatus,
): Promise<Reservation> {
  const validStatuses: ReservationStatus[] = ['confirmed', 'cancelled', 'completed', 'no_show'];
  if (!validStatuses.includes(status)) {
    throw ApiError.badRequest(
      `Nieprawidłowy status. Dozwolone wartości: ${validStatuses.join(', ')}.`,
    );
  }

  const reservation = await reservationRepository.findById(id);
  if (!reservation) {
    throw ApiError.notFound('Rezerwacja nie została znaleziona.');
  }

  return reservationRepository.updateStatus(id, status);
}
