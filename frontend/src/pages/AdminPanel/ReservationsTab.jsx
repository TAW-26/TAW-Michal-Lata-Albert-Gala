import { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Button,
  Select,
  Modal,
  Input,
  Typography,
  Space,
  message,
} from 'antd';
import apiClient from '../../api/apiClient';
import StatusBadge from '../../components/StatusBadge';
import styles from './AdminPanel.module.css';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const ReservationsTab = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [rejectingReservationId, setRejectingReservationId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState({});

  const fetchReservations = useCallback(async (status) => {
    setLoading(true);
    try {
      const queryParam = status ? `?status=${status}` : '';
      const data = await apiClient.get(`/admin/reservations${queryParam}`);
      setReservations(data.reservations || []);
    } catch (err) {
      console.error('Reservations fetch error:', err);
      message.error(`Błąd ładowania rezerwacji: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations(statusFilter);
  }, [statusFilter, fetchReservations]);

  const handleApprove = async (reservationId) => {
    setActionLoading((prev) => ({ ...prev, [reservationId]: 'approve' }));
    try {
      await apiClient.patch(`/admin/reservations/${reservationId}/approve`);
      message.success('Rezerwacja zatwierdzona.');
      fetchReservations(statusFilter);
    } catch (err) {
      message.error(err.message);
    } finally {
      setActionLoading((prev) => ({ ...prev, [reservationId]: null }));
    }
  };

  const handleReject = async () => {
    const reservationId = rejectingReservationId;
    setActionLoading((prev) => ({ ...prev, [reservationId]: 'reject' }));
    try {
      await apiClient.patch(`/admin/reservations/${reservationId}/reject`, {
        reason: rejectReason || undefined,
      });
      message.success('Rezerwacja odrzucona.');
      setRejectingReservationId(null);
      setRejectReason('');
      fetchReservations(statusFilter);
    } catch (err) {
      message.error(err.message);
    } finally {
      setActionLoading((prev) => ({ ...prev, [reservationId]: null }));
    }
  };

  const columns = [
    {
      title: 'Klient',
      key: 'client',
      render: (_, record) =>
        `${record.user_first_name} ${record.user_last_name}`,
    },
    {
      title: 'Email',
      dataIndex: 'user_email',
      key: 'user_email',
    },
    {
      title: 'Obiekt',
      dataIndex: 'facility_name',
      key: 'facility_name',
    },
    {
      title: 'Data',
      dataIndex: 'start_time',
      key: 'date',
      render: (val) => new Date(val).toLocaleDateString('pl-PL'),
    },
    {
      title: 'Godziny',
      key: 'time',
      render: (_, record) => {
        const startFormatted = new Date(record.start_time).toLocaleTimeString(
          'pl-PL',
          { hour: '2-digit', minute: '2-digit' }
        );
        const endFormatted = new Date(record.end_time).toLocaleTimeString(
          'pl-PL',
          { hour: '2-digit', minute: '2-digit' }
        );
        return `${startFormatted} - ${endFormatted}`;
      },
    },
    {
      title: 'Kwota',
      dataIndex: 'total_price',
      key: 'total_price',
      render: (val) => `${Number(val).toFixed(2)} zł`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      title: 'Akcje',
      key: 'actions',
      render: (_, record) => {
        if (record.status !== 'pending') return '—';
        return (
          <Space>
            <Button
              className={styles.approveBtn}
              size='small'
              loading={actionLoading[record.id] === 'approve'}
              onClick={() => handleApprove(record.id)}
            >
              ✅ Zatwierdź
            </Button>
            <Button
              className={styles.rejectBtn}
              size='small'
              loading={actionLoading[record.id] === 'reject'}
              onClick={() => setRejectingReservationId(record.id)}
            >
              ❌ Odrzuć
            </Button>
          </Space>
        );
      },
    },
  ];

  const statusFilterOptions = [
    { label: 'Oczekujące', value: 'pending' },
    { label: 'Potwierdzone', value: 'confirmed' },
    { label: 'Odrzucone', value: 'rejected' },
    { label: 'Anulowane', value: 'cancelled' },
    { label: 'Zakończone', value: 'completed' },
    { label: 'Wszystkie', value: '' },
  ];

  return (
    <div className={styles.sectionCard}>
      <Title level={4} className={styles.sectionTitle}>
        📋 Zarządzanie wizytami
      </Title>

      <div className={styles.filterSection}>
        <span className={styles.filterLabel}>Filtruj wg statusu:</span>
        <Select
          value={statusFilter}
          onChange={(val) => setStatusFilter(val)}
          style={{ width: 200 }}
          options={statusFilterOptions}
        />
      </div>

      <div className={styles.adminTable}>
        <Table
          dataSource={reservations}
          columns={columns}
          rowKey='id'
          loading={loading}
          pagination={{ pageSize: 10 }}
          size='middle'
        />
      </div>

      <Modal
        title='Odrzucenie rezerwacji'
        open={rejectingReservationId !== null}
        onOk={handleReject}
        onCancel={() => {
          setRejectingReservationId(null);
          setRejectReason('');
        }}
        okText='Odrzuć rezerwację'
        okType='danger'
        cancelText='Anuluj'
        confirmLoading={actionLoading[rejectingReservationId] === 'reject'}
      >
        <Paragraph>
          Czy na pewno chcesz odrzucić tę rezerwację? Klient otrzyma email z
          powiadomieniem.
        </Paragraph>
        <TextArea
          placeholder='Powód odrzucenia (opcjonalnie)'
          rows={3}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default ReservationsTab;
