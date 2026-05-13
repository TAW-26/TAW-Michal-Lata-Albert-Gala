import { STATUS_MAP } from '../utils/constants';
import styles from './StatusBadge.module.css';

/**
 * Reservation status badge — extracted from AdminPanel to be
 * reusable across admin tabs (ClientsTab, ReservationsTab).
 */
const StatusBadge = ({ status }) => {
  const info = STATUS_MAP[status] || {
    label: status,
    className: 'statusCancelled',
  };

  return (
    <span className={`${styles.statusBadge} ${styles[info.className]}`}>
      {info.label}
    </span>
  );
};

export default StatusBadge;
