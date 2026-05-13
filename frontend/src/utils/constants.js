/** Full day names (Polish) — Mon(0) through Sun(6) */
export const DAY_NAMES = [
  'Poniedziałek',
  'Wtorek',
  'Środa',
  'Czwartek',
  'Piątek',
  'Sobota',
  'Niedziela',
];

/** Short day names (Polish) — Mon(0) through Sun(6) */
export const DAY_NAMES_SHORT = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nd'];

/**
 * Password validation regex:
 * - minimum 8 characters
 * - at least one uppercase letter
 * - at least one digit
 * - at least one special character
 */
export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export const PASSWORD_REQUIREMENTS_MESSAGE =
  'Co najmniej 8 znaków, wielka litera, cyfra i znak specjalny';

/** Reservation status map — label + CSS className mapping */
export const STATUS_MAP = {
  pending: { label: 'Oczekująca', className: 'statusPending' },
  confirmed: { label: 'Potwierdzona', className: 'statusConfirmed' },
  rejected: { label: 'Odrzucona', className: 'statusRejected' },
  cancelled: { label: 'Anulowana', className: 'statusCancelled' },
  completed: { label: 'Zakończona', className: 'statusCompleted' },
  no_show: { label: 'Niestawienie', className: 'statusCancelled' },
};
