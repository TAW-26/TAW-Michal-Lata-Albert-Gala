export interface EmailDTO {
  to: string;
  subject: string;
  text: string;
}

export interface VerificationEmailDTO {
  to: string;
  verificationLink: string;
}

export interface ForgotPasswordEmailDTO {
  to: string;
  resetLink: string;
}

export interface ReservationEmailDTO {
  to: string;
  userName: string;
  facilityName: string;
  date: string;
  time: string;
  userPhone: string;
  userEmail: string;
}

export interface ReservationStatusEmailDTO {
  to: string;
  userName: string;
  facilityName: string;
  date: string;
  time: string;
  status: 'approved' | 'rejected';
  reason?: string;
}
