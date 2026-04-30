import { useState, useEffect, useCallback } from 'react';
import {
  Tabs,
  Table,
  InputNumber,
  Button,
  Select,
  Modal,
  Input,
  TimePicker,
  Typography,
  Spin,
  message,
  Switch,
  Space,
} from 'antd';
import dayjs from 'dayjs';
import styles from './AdminPanel.module.css';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const API = 'http://localhost:3000/api/admin';

const DAY_NAMES = [
  'Poniedziałek',
  'Wtorek',
  'Środa',
  'Czwartek',
  'Piątek',
  'Sobota',
  'Niedziela',
];

// ============================================
// Tab 1: Zarządzanie cenami
// ============================================
const PricesTab = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editPrices, setEditPrices] = useState({});
  const [saving, setSaving] = useState({});

  const fetchFacilities = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/facilities`, { credentials: 'include' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setFacilities(data.facilities || []);
    } catch (err) {
      console.error('Admin fetchFacilities error:', err);
      message.error(`Błąd ładowania obiektów: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFacilities();
  }, [fetchFacilities]);

  const handleSavePrice = async (id) => {
    const newPrice = editPrices[id];
    if (newPrice === undefined || newPrice <= 0) {
      message.warning('Podaj prawidłową cenę.');
      return;
    }

    setSaving((prev) => ({ ...prev, [id]: true }));
    try {
      const res = await fetch(`${API}/facilities/${id}/price`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ hourlyRate: newPrice }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      message.success('Cena zaktualizowana.');
      fetchFacilities();
      setEditPrices((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    } catch (err) {
      message.error(err.message);
    } finally {
      setSaving((prev) => ({ ...prev, [id]: false }));
    }
  };

  const columns = [
    {
      title: 'Nazwa',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Typ',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Obecna cena (zł/h)',
      dataIndex: 'hourly_rate',
      key: 'hourly_rate',
      render: (val) => `${Number(val).toFixed(2)} zł`,
    },
    {
      title: 'Nowa cena',
      key: 'edit_price',
      render: (_, record) => (
        <InputNumber
          className={styles.priceInput}
          min={1}
          step={10}
          value={editPrices[record.id] ?? Number(record.hourly_rate)}
          onChange={(val) =>
            setEditPrices((prev) => ({ ...prev, [record.id]: val }))
          }
          addonAfter='zł'
        />
      ),
    },
    {
      title: 'Aktywny',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (val) => (
        <Switch checked={val} disabled size='small' />
      ),
    },
    {
      title: 'Akcja',
      key: 'action',
      render: (_, record) => (
        <Button
          className={styles.saveBtn}
          onClick={() => handleSavePrice(record.id)}
          loading={saving[record.id]}
          disabled={editPrices[record.id] === undefined}
        >
          Zapisz
        </Button>
      ),
    },
  ];

  return (
    <div className={styles.sectionCard}>
      <Title level={4} className={styles.sectionTitle}>
        💰 Zarządzanie cenami obiektów
      </Title>
      <div className={styles.adminTable}>
        <Table
          dataSource={facilities}
          columns={columns}
          rowKey='id'
          loading={loading}
          pagination={false}
          size='middle'
        />
      </div>
    </div>
  );
};

// ============================================
// Tab 2: Godziny otwarcia
// ============================================
const ScheduleTab = () => {
  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const res = await fetch(`${API}/facilities`, {
          credentials: 'include',
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || `HTTP ${res.status}`);
        }
        const data = await res.json();
        setFacilities(data.facilities || []);
      } catch (err) {
        console.error('Schedule fetchFacilities error:', err);
        message.error(`Błąd ładowania obiektów: ${err.message}`);
      }
    };
    fetchFacilities();
  }, []);

  const fetchSchedule = useCallback(async (facilityId) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/facilities/${facilityId}/schedule`, {
        credentials: 'include',
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      const existing = data.schedules || [];

      // Build full 7-day schedule
      const full = DAY_NAMES.map((_, i) => {
        const found = existing.find((s) => s.day_of_week === i);
        return {
          dayOfWeek: i,
          openTime: found ? found.open_time.substring(0, 5) : '',
          closeTime: found ? found.close_time.substring(0, 5) : '',
          enabled: !!found,
        };
      });
      setSchedules(full);
    } catch (err) {
      console.error('Schedule fetch error:', err);
      message.error(`Błąd ładowania harmonogramu: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFacilityChange = (facilityId) => {
    setSelectedFacility(facilityId);
    fetchSchedule(facilityId);
  };

  const handleScheduleChange = (dayIndex, field, value) => {
    setSchedules((prev) =>
      prev.map((s, i) => (i === dayIndex ? { ...s, [field]: value } : s))
    );
  };

  const handleSave = async () => {
    const toSend = schedules
      .filter((s) => s.enabled && s.openTime && s.closeTime)
      .map((s) => ({
        dayOfWeek: s.dayOfWeek,
        openTime: s.openTime,
        closeTime: s.closeTime,
      }));

    if (toSend.length === 0) {
      message.warning('Zaznacz przynajmniej jeden dzień.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(
        `${API}/facilities/${selectedFacility}/schedule`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ schedules: toSend }),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      message.success('Harmonogram zapisany.');
    } catch (err) {
      message.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.sectionCard}>
      <Title level={4} className={styles.sectionTitle}>
        🕐 Godziny otwarcia
      </Title>
      <div style={{ marginBottom: 20 }}>
        <Select
          placeholder='Wybierz obiekt'
          style={{ width: 300 }}
          onChange={handleFacilityChange}
          options={facilities.map((f) => ({ label: f.name, value: f.id }))}
        />
      </div>

      {loading && (
        <div className={styles.loadingContainer}>
          <Spin />
        </div>
      )}

      {selectedFacility && !loading && (
        <div className={styles.scheduleSection}>
          {schedules.map((schedule, index) => (
            <div key={index} className={styles.scheduleGrid}>
              <div className={styles.dayLabel}>
                <Switch
                  size='small'
                  checked={schedule.enabled}
                  onChange={(val) =>
                    handleScheduleChange(index, 'enabled', val)
                  }
                  style={{ marginRight: 8 }}
                />
                {DAY_NAMES[index]}
              </div>
              <TimePicker
                format='HH:mm'
                minuteStep={30}
                placeholder='Otwarcie'
                disabled={!schedule.enabled}
                value={
                  schedule.openTime ? dayjs(schedule.openTime, 'HH:mm') : null
                }
                onChange={(_, timeStr) =>
                  handleScheduleChange(index, 'openTime', timeStr)
                }
              />
              <TimePicker
                format='HH:mm'
                minuteStep={30}
                placeholder='Zamknięcie'
                disabled={!schedule.enabled}
                value={
                  schedule.closeTime
                    ? dayjs(schedule.closeTime, 'HH:mm')
                    : null
                }
                onChange={(_, timeStr) =>
                  handleScheduleChange(index, 'closeTime', timeStr)
                }
              />
            </div>
          ))}
          <div className={styles.scheduleActions}>
            <Button
              className={styles.saveBtn}
              onClick={handleSave}
              loading={saving}
              size='large'
            >
              Zapisz harmonogram
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// Tab 3: Klienci
// ============================================
const ClientsTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailModal, setDetailModal] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [userDetail, setUserDetail] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/users`, { credentials: 'include' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error('Users fetch error:', err);
      message.error(`Błąd ładowania użytkowników: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const showUserDetails = async (userId) => {
    setDetailModal(userId);
    setDetailLoading(true);
    try {
      const res = await fetch(`${API}/users/${userId}`, {
        credentials: 'include',
      });
      const data = await res.json();
      setUserDetail(data);
    } catch {
      message.error('Błąd ładowania szczegółów.');
    } finally {
      setDetailLoading(false);
    }
  };

  const columns = [
    {
      title: 'Imię',
      dataIndex: 'first_name',
      key: 'first_name',
    },
    {
      title: 'Nazwisko',
      dataIndex: 'last_name',
      key: 'last_name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Telefon',
      dataIndex: 'phone',
      key: 'phone',
      render: (val) => val || '—',
    },
    {
      title: 'Rola',
      dataIndex: 'role',
      key: 'role',
      render: (val) => (
        <span
          className={styles.statusBadge}
          style={{
            background:
              val === 'admin'
                ? 'rgba(124, 127, 255, 0.15)'
                : 'rgba(255, 255, 255, 0.08)',
            color: val === 'admin' ? '#7c7fff' : 'rgba(255,255,255,0.6)',
            border:
              val === 'admin'
                ? '1px solid rgba(124, 127, 255, 0.3)'
                : '1px solid rgba(255,255,255,0.12)',
          }}
        >
          {val}
        </span>
      ),
    },
    {
      title: 'Data rejestracji',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (val) => new Date(val).toLocaleDateString('pl-PL'),
    },
    {
      title: 'Akcja',
      key: 'action',
      render: (_, record) => (
        <Button
          className={styles.saveBtn}
          size='small'
          onClick={() => showUserDetails(record.id)}
        >
          Szczegóły
        </Button>
      ),
    },
  ];

  const reservationColumns = [
    {
      title: 'Obiekt',
      dataIndex: 'facility_name',
      key: 'facility_name',
    },
    {
      title: 'Data',
      dataIndex: 'start_time',
      key: 'start_time',
      render: (val) => new Date(val).toLocaleDateString('pl-PL'),
    },
    {
      title: 'Godziny',
      key: 'time',
      render: (_, r) => {
        const start = new Date(r.start_time).toLocaleTimeString('pl-PL', {
          hour: '2-digit',
          minute: '2-digit',
        });
        const end = new Date(r.end_time).toLocaleTimeString('pl-PL', {
          hour: '2-digit',
          minute: '2-digit',
        });
        return `${start} - ${end}`;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      title: 'Kwota',
      dataIndex: 'total_price',
      key: 'total_price',
      render: (val) => `${Number(val).toFixed(2)} zł`,
    },
  ];

  return (
    <div className={styles.sectionCard}>
      <Title level={4} className={styles.sectionTitle}>
        👥 Zarządzanie klientami
      </Title>
      <div className={styles.adminTable}>
        <Table
          dataSource={users}
          columns={columns}
          rowKey='id'
          loading={loading}
          pagination={{ pageSize: 10 }}
          size='middle'
        />
      </div>

      <Modal
        title={
          userDetail
            ? `${userDetail.user.first_name} ${userDetail.user.last_name}`
            : 'Szczegóły użytkownika'
        }
        open={detailModal !== null}
        onCancel={() => {
          setDetailModal(null);
          setUserDetail(null);
        }}
        footer={null}
        width={700}
      >
        {detailLoading ? (
          <div className={styles.loadingContainer}>
            <Spin />
          </div>
        ) : userDetail ? (
          <>
            <div style={{ marginBottom: 24 }}>
              <div className={styles.userDetailRow}>
                <span className={styles.userDetailLabel}>Email:</span>
                <span className={styles.userDetailValue}>
                  {userDetail.user.email}
                </span>
              </div>
              <div className={styles.userDetailRow}>
                <span className={styles.userDetailLabel}>Telefon:</span>
                <span className={styles.userDetailValue}>
                  {userDetail.user.phone || '—'}
                </span>
              </div>
              <div className={styles.userDetailRow}>
                <span className={styles.userDetailLabel}>Rola:</span>
                <span className={styles.userDetailValue}>
                  {userDetail.user.role}
                </span>
              </div>
              <div className={styles.userDetailRow}>
                <span className={styles.userDetailLabel}>Konto aktywne:</span>
                <span className={styles.userDetailValue}>
                  {userDetail.user.is_activated ? 'Tak' : 'Nie'}
                </span>
              </div>
              <div className={styles.userDetailRow}>
                <span className={styles.userDetailLabel}>
                  Data rejestracji:
                </span>
                <span className={styles.userDetailValue}>
                  {new Date(userDetail.user.created_at).toLocaleDateString(
                    'pl-PL'
                  )}
                </span>
              </div>
            </div>
            <Title level={5}>Historia wizyt ({userDetail.reservations.length})</Title>
            <Table
              dataSource={userDetail.reservations}
              columns={reservationColumns}
              rowKey='id'
              size='small'
              pagination={{ pageSize: 5 }}
            />
          </>
        ) : null}
      </Modal>
    </div>
  );
};

// ============================================
// Status Badge Component
// ============================================
const STATUS_MAP = {
  pending: { label: 'Oczekująca', className: 'statusPending' },
  confirmed: { label: 'Potwierdzona', className: 'statusConfirmed' },
  rejected: { label: 'Odrzucona', className: 'statusRejected' },
  cancelled: { label: 'Anulowana', className: 'statusCancelled' },
  completed: { label: 'Zakończona', className: 'statusCompleted' },
  no_show: { label: 'Niestawienie', className: 'statusCancelled' },
};

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

// ============================================
// Tab 4: Wizyty (Rezerwacje)
// ============================================
const ReservationsTab = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState({});

  const fetchReservations = useCallback(async (status) => {
    setLoading(true);
    try {
      const url = status ? `${API}/reservations?status=${status}` : `${API}/reservations`;
      const res = await fetch(url, { credentials: 'include' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
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

  const handleApprove = async (id) => {
    setActionLoading((prev) => ({ ...prev, [id]: 'approve' }));
    try {
      const res = await fetch(`${API}/reservations/${id}/approve`, {
        method: 'PATCH',
        credentials: 'include',
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      message.success('Rezerwacja zatwierdzona.');
      fetchReservations(statusFilter);
    } catch (err) {
      message.error(err.message);
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: null }));
    }
  };

  const handleReject = async () => {
    const id = rejectModal;
    setActionLoading((prev) => ({ ...prev, [id]: 'reject' }));
    try {
      const res = await fetch(`${API}/reservations/${id}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ reason: rejectReason || undefined }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error);
      }
      message.success('Rezerwacja odrzucona.');
      setRejectModal(null);
      setRejectReason('');
      fetchReservations(statusFilter);
    } catch (err) {
      message.error(err.message);
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: null }));
    }
  };

  const columns = [
    {
      title: 'Klient',
      key: 'client',
      render: (_, r) => `${r.user_first_name} ${r.user_last_name}`,
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
      render: (_, r) => {
        const start = new Date(r.start_time).toLocaleTimeString('pl-PL', {
          hour: '2-digit',
          minute: '2-digit',
        });
        const end = new Date(r.end_time).toLocaleTimeString('pl-PL', {
          hour: '2-digit',
          minute: '2-digit',
        });
        return `${start} - ${end}`;
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
              onClick={() => setRejectModal(record.id)}
            >
              ❌ Odrzuć
            </Button>
          </Space>
        );
      },
    },
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
          options={[
            { label: 'Oczekujące', value: 'pending' },
            { label: 'Potwierdzone', value: 'confirmed' },
            { label: 'Odrzucone', value: 'rejected' },
            { label: 'Anulowane', value: 'cancelled' },
            { label: 'Zakończone', value: 'completed' },
            { label: 'Wszystkie', value: '' },
          ]}
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
        open={rejectModal !== null}
        onOk={handleReject}
        onCancel={() => {
          setRejectModal(null);
          setRejectReason('');
        }}
        okText='Odrzuć rezerwację'
        okType='danger'
        cancelText='Anuluj'
        confirmLoading={actionLoading[rejectModal] === 'reject'}
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

// ============================================
// Main AdminPanel
// ============================================
const AdminPanel = () => {
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
