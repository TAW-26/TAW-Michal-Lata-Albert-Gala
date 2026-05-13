import { Tabs, Typography } from 'antd';
import PricesTab from './PricesTab';
import ScheduleTab from './ScheduleTab';
import ClientsTab from './ClientsTab';
import ReservationsTab from './ReservationsTab';
import styles from './AdminPanel.module.css';

const { Title, Paragraph } = Typography;

const tabItems = [
  {
    key: 'prices',
    label: '💰 Ceny',
    children: <PricesTab />,
  },
  {
    key: 'schedule',
    label: '🕐 Godziny otwarcia',
    children: <ScheduleTab />,
  },
  {
    key: 'clients',
    label: '👥 Klienci',
    children: <ClientsTab />,
  },
  {
    key: 'reservations',
    label: '📋 Wizyty',
    children: <ReservationsTab />,
  },
];

const AdminPanel = () => {
  return (
    <div className={styles.adminContainer}>
      <Title className={styles.adminTitle}>Panel Administratora</Title>
      <Paragraph className={styles.adminSubtitle}>
        Zarządzaj obiektami, cenami, harmonogramami i rezerwacjami
      </Paragraph>
      <Tabs
        className={styles.adminTabs}
        defaultActiveKey='reservations'
        items={tabItems}
        size='large'
      />
    </div>
  );
};

export default AdminPanel;
