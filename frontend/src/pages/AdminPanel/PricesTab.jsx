import { useState, useEffect, useCallback } from 'react';
import { Table, InputNumber, Button, Switch, Typography, message } from 'antd';
import apiClient from '../../api/apiClient';
import styles from './AdminPanel.module.css';

const { Title } = Typography;

const PricesTab = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editPrices, setEditPrices] = useState({});
  const [saving, setSaving] = useState({});

  const fetchFacilities = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.get('/admin/facilities');
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

  const handleSavePrice = async (facilityId) => {
    const newPrice = editPrices[facilityId];
    if (newPrice === undefined || newPrice <= 0) {
      message.warning('Podaj prawidłową cenę.');
      return;
    }

    setSaving((prev) => ({ ...prev, [facilityId]: true }));
    try {
      await apiClient.put(`/admin/facilities/${facilityId}/price`, {
        hourlyRate: newPrice,
      });
      message.success('Cena zaktualizowana.');
      fetchFacilities();
      setEditPrices((prev) => {
        const updated = { ...prev };
        delete updated[facilityId];
        return updated;
      });
    } catch (err) {
      message.error(err.message);
    } finally {
      setSaving((prev) => ({ ...prev, [facilityId]: false }));
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
      render: (val) => <Switch checked={val} disabled size='small' />,
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

export default PricesTab;
