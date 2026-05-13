import { useState, useEffect, useCallback } from 'react';
import { Table, Button, Modal, Typography, Spin, message } from 'antd';
import apiClient from '../../api/apiClient';
import StatusBadge from '../../components/StatusBadge';
import styles from './AdminPanel.module.css';

const { Title } = Typography;

const ClientsTab = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [userDetail, setUserDetail] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.get('/admin/users');
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
    setSelectedUserId(userId);
    setDetailLoading(true);
    try {
      const data = await apiClient.get(`/admin/users/${userId}`);
      setUserDetail(data);
    } catch {
      message.error('Błąd ładowania szczegółów.');
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetailModal = () => {
    setSelectedUserId(null);
    setUserDetail(null);
  };

  const userColumns = [
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
          style={{
            padding: '4px 14px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            background:
              val === 'admin'
                ? 'rgba(124, 127, 255, 0.15)'
                : 'rgba(0, 0, 0, 0.04)',
            color: val === 'admin' ? '#7c7fff' : '#8c8c8c',
            border:
              val === 'admin'
                ? '1px solid rgba(124, 127, 255, 0.3)'
                : '1px solid rgba(0, 0, 0, 0.08)',
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
          columns={userColumns}
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
        open={selectedUserId !== null}
        onCancel={closeDetailModal}
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
            <Title level={5}>
              Historia wizyt ({userDetail.reservations.length})
            </Title>
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

export default ClientsTab;
