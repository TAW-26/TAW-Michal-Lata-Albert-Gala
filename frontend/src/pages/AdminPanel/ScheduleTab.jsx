import { useState, useEffect, useCallback } from 'react';
import {
  Select,
  Button,
  Switch,
  TimePicker,
  Typography,
  Spin,
  message,
} from 'antd';
import dayjs from 'dayjs';
import apiClient from '../../api/apiClient';
import { DAY_NAMES } from '../../utils/constants';
import styles from './AdminPanel.module.css';

const { Title } = Typography;

const ScheduleTab = () => {
  const [facilities, setFacilities] = useState([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadFacilities = async () => {
      try {
        const data = await apiClient.get('/admin/facilities');
        setFacilities(data.facilities || []);
      } catch (err) {
        console.error('Schedule fetchFacilities error:', err);
        message.error(`Błąd ładowania obiektów: ${err.message}`);
      }
    };
    loadFacilities();
  }, []);

  const fetchSchedule = useCallback(async (facilityId) => {
    setLoading(true);
    try {
      const data = await apiClient.get(
        `/admin/facilities/${facilityId}/schedule`
      );
      const existing = data.schedules || [];

      // Build full 7-day schedule
      const fullWeek = DAY_NAMES.map((_, dayIndex) => {
        const found = existing.find((s) => s.day_of_week === dayIndex);
        return {
          dayOfWeek: dayIndex,
          openTime: found ? found.open_time.substring(0, 5) : '',
          closeTime: found ? found.close_time.substring(0, 5) : '',
          enabled: !!found,
        };
      });
      setSchedules(fullWeek);
    } catch (err) {
      console.error('Schedule fetch error:', err);
      message.error(`Błąd ładowania harmonogramu: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFacilityChange = (facilityId) => {
    setSelectedFacilityId(facilityId);
    fetchSchedule(facilityId);
  };

  const handleScheduleChange = (dayIndex, field, value) => {
    setSchedules((prev) =>
      prev.map((s, i) => (i === dayIndex ? { ...s, [field]: value } : s))
    );
  };

  const handleSave = async () => {
    const enabledSchedules = schedules
      .filter((s) => s.enabled && s.openTime && s.closeTime)
      .map((s) => ({
        dayOfWeek: s.dayOfWeek,
        openTime: s.openTime,
        closeTime: s.closeTime,
      }));

    const disabledDays = schedules
      .filter((s) => !s.enabled)
      .map((s) => s.dayOfWeek);

    setSaving(true);
    try {
      await apiClient.put(`/admin/facilities/${selectedFacilityId}/schedule`, {
        schedules: enabledSchedules,
        disabledDays,
      });
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

      {selectedFacilityId && !loading && (
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
                  schedule.closeTime ? dayjs(schedule.closeTime, 'HH:mm') : null
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

export default ScheduleTab;
