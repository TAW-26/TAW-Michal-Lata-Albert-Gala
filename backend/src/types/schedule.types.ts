export interface FacilitySchedule {
  id: number;
  facility_id: number;
  day_of_week: number; // 0=Monday, 6=Sunday
  open_time: string;   // HH:MM format
  close_time: string;  // HH:MM format
}

export interface CreateScheduleDTO {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
}

export interface FacilityBlock {
  id: number;
  facility_id: number;
  start_time: Date;
  end_time: Date;
  reason: string | null;
}

export interface CreateBlockDTO {
  startTime: string; // ISO datetime
  endTime: string;   // ISO datetime
  reason?: string;
}

export interface TimeSlot {
  startTime: string; // HH:MM
  endTime: string;   // HH:MM
  available: boolean;
}
