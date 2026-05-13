import { useState, useEffect, useCallback } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import dayjs from 'dayjs';
import styles from './FacilityId.module.css';
import { Row, Col, Typography, Calendar, Input, Button, message } from 'antd';
import { getFacilityMeta } from './facilityData';
import { useAuth } from '../../context/AuthContext';
import { DAY_NAMES_SHORT } from '../../utils/constants';
import apiClient from '../../api/apiClient';
import LoadingSpinner from '../../components/LoadingSpinner';

const { Title, Paragraph } = Typography;

const FacilityId = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();

  const [facility, setFacility] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loadingFacility, setLoadingFacility] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [selectedDate, setSelectedDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  // Fetch facility details + schedule from API
  useEffect(() => {
    const loadFacilityData = async () => {
      setLoadingFacility(true);
      try {
        const [facilityRes, scheduleRes] = await Promise.all([
          apiClient.raw.get(`/facilities/${id}`),
          apiClient.raw.get(`/facilities/${id}/schedule`),
        ]);

        if (!facilityRes.ok) {
          setNotFound(true);
          return;
        }

        const facilityData = await facilityRes.json();
        setFacility(facilityData.facility);

        if (scheduleRes.ok) {
          const scheduleData = await scheduleRes.json();
          setSchedules(scheduleData.schedules || []);
        }
      } catch (err) {
        console.error('Error fetching facility:', err);
        setNotFound(true);
      } finally {
        setLoadingFacility(false);
      }
    };
    loadFacilityData();
  }, [id]);

  // Pre-fill form when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const fetchSlots = useCallback(
    async (dateStr) => {
      setLoadingSlots(true);
      setSlots([]);
      setSelectedSlotIndex(null);
      try {
        const data = await apiClient.get(
          `/facilities/${id}/availability?date=${dateStr}`
        );
        setSlots(data.slots || []);
      } catch (err) {
        console.error('Error fetching slots:', err);
        setSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    },
    [id]
  );

  const onDateSelect = useCallback(
    (value) => {
      setSelectedDate(value);
      const dateStr = value.format('YYYY-MM-DD');
      fetchSlots(dateStr);
    },
    [fetchSlots]
  );

  if (notFound) {
    return <Navigate to='/choose' replace />;
  }

  if (loadingFacility) {
    return <LoadingSpinner />;
  }

  if (!facility) {
    return <Navigate to='/choose' replace />;
  }

  const meta = getFacilityMeta(facility.type);
  const slotDuration = meta.slotDuration || 1;

  // Build per-day schedule display
  const perDaySchedule = DAY_NAMES_SHORT.map((name, i) => {
    const scheduleEntry = schedules.find((sch) => sch.day_of_week === i);
    if (!scheduleEntry) return { day: name, hours: 'Zamknięte' };
    return {
      day: name,
      hours: `${scheduleEntry.open_time.substring(0, 5)}-${scheduleEntry.close_time.substring(0, 5)}`,
    };
  });

  const priceInfo = `${Number(facility.hourly_rate).toFixed(0)} zł / ${slotDuration}h`;

  const disabledDate = (current) => {
    return current && current < dayjs().startOf('day');
  };

  const canSelectSlot = (index) => {
    for (let i = 0; i < slotDuration; i++) {
      const slotIndex = index + i;
      if (slotIndex >= slots.length) return false;
      if (!slots[slotIndex].available) return false;
    }
    return true;
  };

  const isSlotPartOfSelection = (index) => {
    if (selectedSlotIndex === null) return false;
    return (
      index >= selectedSlotIndex && index < selectedSlotIndex + slotDuration
    );
  };

  const handleSlotClick = (index) => {
    if (!canSelectSlot(index)) return;
    setSelectedSlotIndex(selectedSlotIndex === index ? null : index);
  };

  const getSlotClassName = (slot, index) => {
    if (isSlotPartOfSelection(index)) return styles.slotSelected;
    if (!slot.available) return styles.slotUnavailable;
    if (!canSelectSlot(index)) return styles.slotUnavailable;
    return styles.slotAvailable;
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitReservation = async () => {
    if (selectedSlotIndex === null || !selectedDate) {
      message.error('Wybierz datę i godzinę.');
      return;
    }

    setPhoneError('');
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 9) {
      setPhoneError('Numer telefonu musi mieć co najmniej 9 cyfr.');
      return;
    }

    const startSlot = slots[selectedSlotIndex];
    const endSlot = slots[selectedSlotIndex + slotDuration - 1];
    const dateStr = selectedDate.format('YYYY-MM-DD');
    const startTime = `${dateStr}T${startSlot.startTime}:00`;
    const endTime = `${dateStr}T${endSlot.endTime}:00`;

    setSubmitting(true);
    try {
      await apiClient.post('/reservations', {
        facilityId: parseInt(id),
        startTime,
        endTime,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
      });
      message.success(
        'Rezerwacja została wysłana! Oczekuje na zatwierdzenie przez administratora.'
      );
      fetchSlots(dateStr);
      setSelectedSlotIndex(null);
    } catch (err) {
      message.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedTimeLabel =
    selectedSlotIndex !== null
      ? `${slots[selectedSlotIndex].startTime} - ${slots[selectedSlotIndex + slotDuration - 1].endTime}`
      : null;

  return (
    <div className={styles.container}>
      <Row gutter={[24, 24]} align='middle' justify='center'>
        <div className={styles.titlesInfo}>
          <Title className={styles.titleInfo} level={1}>
            {facility.name}
          </Title>
          <Title className={styles.titleInfo4} level={4}>
            Sprawdź ogólne informacje o tym obiekcie <br /> i zdecyduj czy to
            jest to czego szukasz
          </Title>
        </div>
      </Row>
      <Row gutter={[24, 24]}>
        <Col span={4} xs={24} md={12} xl={8}>
          <div
            className={styles.facilityCard}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${meta.image})`,
            }}
          >
            <div className={styles.facilityDescription}>
              <Title className={styles.cardTitle} level={3}>
                {facility.name}
              </Title>
              <Paragraph className={styles.cardParagraph}>
                {facility.description}
              </Paragraph>
              <div className={styles.aboutContainer}>
                <Paragraph className={styles.aboutLabel}>
                  <strong className={styles.strongDesc}>
                    Typ nawierzchni:
                  </strong>
                </Paragraph>
                <Paragraph className={styles.aboutValue}>
                  {meta.surfaceType}
                </Paragraph>
              </div>
              <div className={styles.aboutContainer}>
                <Paragraph className={styles.aboutLabel}>
                  <strong className={styles.strongDesc}>
                    Godziny wynajmu:
                  </strong>
                </Paragraph>
                {schedules.length > 0 ? (
                  <div className={styles.scheduleList}>
                    {perDaySchedule.map((day) => (
                      <div key={day.day} className={styles.scheduleRow}>
                        <span className={styles.scheduleDay}>{day.day}</span>
                        <span className={styles.scheduleHours}>
                          {day.hours}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Paragraph className={styles.aboutValue}>
                    Brak danych o godzinach
                  </Paragraph>
                )}
              </div>
              <div className={styles.aboutContainer}>
                <Paragraph className={styles.aboutLabel}>
                  <strong className={styles.strongDesc}>
                    Czas rezerwacji:
                  </strong>
                </Paragraph>
                <Paragraph className={styles.aboutValue}>
                  {slotDuration === 1 ? '1 godzina' : `${slotDuration} godziny`}
                </Paragraph>
              </div>
              <div className={styles.aboutContainer}>
                <Paragraph className={styles.aboutLabel}>
                  <strong className={styles.strongDesc}>
                    Cena za wynajem:
                  </strong>
                </Paragraph>
                <Paragraph className={styles.aboutValue}>{priceInfo}</Paragraph>
              </div>
            </div>
          </div>
        </Col>

        <Col span={4} xs={24} md={12} xl={8}>
          <div className={styles.calendarCard}>
            <Title className={styles.calendarTitle} level={3}>
              Wybierz datę z kalendarza
            </Title>
            <Paragraph className={styles.calendarSubtitle}>
              Sprawdź wolne godziny <br />
              wybierz termin i potwierdź wizytę
            </Paragraph>
            <div className={styles.calendarWrapper}>
              <Calendar
                fullscreen={false}
                onSelect={onDateSelect}
                disabledDate={disabledDate}
              />
            </div>
            {selectedDate && (
              <Paragraph className={styles.selectedDate}>
                Wybrana data:{' '}
                <strong>{selectedDate.format('DD.MM.YYYY')}</strong>
              </Paragraph>
            )}

            {selectedDate && (
              <div className={styles.slotsSection}>
                <Title level={5} className={styles.slotsTitle}>
                  Dostępne godziny:
                </Title>
                {loadingSlots ? (
                  <LoadingSpinner size='small' minHeight='60px' />
                ) : slots.length === 0 ? (
                  <Paragraph className={styles.noSlots}>
                    Brak dostępnych godzin w tym dniu.
                  </Paragraph>
                ) : (
                  <div className={styles.slotsGrid}>
                    {slots.map((slot, index) => (
                      <div
                        key={index}
                        className={getSlotClassName(slot, index)}
                        onClick={() =>
                          slot.available &&
                          canSelectSlot(index) &&
                          handleSlotClick(index)
                        }
                      >
                        {slot.startTime}
                      </div>
                    ))}
                  </div>
                )}
                {selectedTimeLabel && (
                  <Paragraph className={styles.selectedTime}>
                    Wybrany termin: <strong>{selectedTimeLabel}</strong>
                  </Paragraph>
                )}
              </div>
            )}
          </div>
        </Col>

        <Col span={4} xs={24} md={24} xl={8}>
          <div className={styles.formCard}>
            <Title className={styles.calendarTitle} level={3}>
              Formularz potwierdzający
            </Title>

            {isAuthenticated ? (
              <>
                <div className={styles.formFields}>
                  <Input
                    className={styles.formInput}
                    placeholder='Imię'
                    size='large'
                    value={formData.firstName}
                    onChange={(e) =>
                      handleFormChange('firstName', e.target.value)
                    }
                  />
                  <Input
                    className={styles.formInput}
                    placeholder='Nazwisko'
                    size='large'
                    value={formData.lastName}
                    onChange={(e) =>
                      handleFormChange('lastName', e.target.value)
                    }
                  />
                  <Input
                    className={styles.formInput}
                    placeholder='E-mail'
                    size='large'
                    value={formData.email}
                    onChange={(e) => handleFormChange('email', e.target.value)}
                  />
                  <Input
                    className={styles.formInput}
                    placeholder='Numer telefonu'
                    size='large'
                    value={formData.phone}
                    status={phoneError ? 'error' : ''}
                    onChange={(e) => {
                      handleFormChange('phone', e.target.value);
                      if (e.target.value.replace(/\D/g, '').length >= 9) {
                        setPhoneError('');
                      }
                    }}
                  />
                  {phoneError && (
                    <div style={{ color: '#ff4d4f', fontSize: '12px' }}>
                      {phoneError}
                    </div>
                  )}
                </div>
                <div className={styles.paymentSection}>
                  <Paragraph className={styles.paymentLabel}>
                    Forma płatności
                  </Paragraph>
                  <div className={styles.paymentOptions}>
                    <div className={styles.paymentOptionActive}>
                      Płatność na miejscu
                    </div>
                  </div>
                </div>
                <Paragraph className={styles.emailInfo}>
                  Po zatwierdzeniu rezerwacji przez administratora potwierdzenie
                  przyjdzie na podany adres e-mail.
                </Paragraph>
                <Button
                  type='primary'
                  size='large'
                  block
                  className={styles.submitButton}
                  onClick={handleSubmitReservation}
                  loading={submitting}
                  disabled={selectedSlotIndex === null || !selectedDate}
                >
                  Zarezerwuj
                </Button>
              </>
            ) : (
              <div className={styles.loginPrompt}>
                <Title level={4} className={styles.loginPromptTitle}>
                  Zaloguj się aby zarezerwować
                </Title>
                <Paragraph className={styles.loginPromptText}>
                  Aby dokonać rezerwacji tego obiektu, musisz posiadać konto i
                  być zalogowanym.
                </Paragraph>
                <Link to='/login' style={{ width: '100%' }}>
                  <Button
                    type='primary'
                    size='large'
                    block
                    className={styles.submitButton}
                  >
                    Zaloguj się
                  </Button>
                </Link>
                <Link to='/register' style={{ width: '100%', marginTop: 12 }}>
                  <Button size='large' block className={styles.registerButton}>
                    Załóż konto
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default FacilityId;
