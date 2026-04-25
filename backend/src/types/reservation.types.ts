export type ReservationStatus =
  | 'confirmed'
  | 'cancelled'
  | 'completed'
  | 'no_show';

export interface Reservation {
  id: number;
  user_id: number;
  facility_id: number;
  start_time: Date;
  end_time: Date;
  status: ReservationStatus;
  total_price: number;
  created_at: Date;
}

export interface CreateReservationDTO {
  facilityId: number;
  startTime: string; // ISO datetime
  endTime: string; // ISO datetime
}

export interface ReservationWithDetails extends Reservation {
  facility_name?: string;
  facility_type?: string;
  user_first_name?: string;
  user_last_name?: string;
  user_email?: string;
}
