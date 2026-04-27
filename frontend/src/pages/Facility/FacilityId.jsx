import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import styles from './FacilityId.module.css';
import { Row, Col, Typography, Calendar, Input, Button } from 'antd';
import facilityData from './facilityData';

const { Title, Paragraph } = Typography;

const FacilityId = () => {
  const { id } = useParams();
  const facility = facilityData[id];
  const [selectedDate, setSelectedDate] = useState(null);

  if (!facility) {
    return <Navigate to='/choose' replace />;
  }

  const onDateSelect = (value) => {
    setSelectedDate(value);
  };

  return (
    <div className={styles.container}>
      <Row gutter={[24, 24]} align='middle' justify='center'>
        <div className={styles.titlesInfo}>
          <Title className={styles.titleInfo} level={1}>
            {facility.name}
          </Title>
          <Title className={styles.titleInfo4} level={4}>
            {facility.subtitle} <br />
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
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${facility.image})`,
            }}
          >
            <div className={styles.facilityDescription}>
              <Title className={styles.cardTitle} level={3}>
                {facility.name}
              </Title>
              <Paragraph className={styles.cardParagrapgh}>
                {facility.description}
              </Paragraph>
              <div className={styles.aboutContainer}>
                <Paragraph className={styles.aboutLabel}>
                  <strong className={styles.strongDesc}>
                    Typ nawierzchni:
                  </strong>
                </Paragraph>
                <Paragraph className={styles.aboutValue}>
                  {facility.surfaceType}
                </Paragraph>
              </div>
              <div className={styles.aboutContainer}>
                <Paragraph className={styles.aboutLabel}>
                  <strong className={styles.strongDesc}>
                    Godziny wynajmu:
                  </strong>
                </Paragraph>
                <Paragraph className={styles.aboutValue}>
                  <strong>Pon-Pt </strong>
                  {facility.hoursWeekday}
                </Paragraph>
                <Paragraph className={styles.aboutValue}>
                  <strong>Sob-Nd </strong>
                  {facility.hoursWeekend}
                </Paragraph>
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
              wybierz formę płatności <br />
              i potwierdź wizytę <br />w formularzu
            </Paragraph>
            <div className={styles.calendarWrapper}>
              <Calendar fullscreen={false} onSelect={onDateSelect} />
            </div>
            {selectedDate && (
              <Paragraph className={styles.selectedDate}>
                Wybrana data:{' '}
                <strong>{selectedDate.format('DD.MM.YYYY')}</strong>
              </Paragraph>
            )}
          </div>
        </Col>

        <Col span={4} xs={24} md={24} xl={8}>
          <div className={styles.formCard}>
            <Title className={styles.calendarTitle} level={3}>
              Formularz potwierdzający
            </Title>
            <div className={styles.formFields}>
              <Input
                className={styles.formInput}
                placeholder='Imię'
                size='large'
              />
              <Input
                className={styles.formInput}
                placeholder='Nazwisko'
                size='large'
              />
              <Input
                className={styles.formInput}
                placeholder='E-mail'
                size='large'
              />
              <Input
                className={styles.formInput}
                placeholder='Numer telefonu'
                size='large'
              />
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
              Po zatwierdzeniu rezerwacji potwierdzenie przyjdzie na podany
              adres e-mail.
            </Paragraph>
            <Button
              type='primary'
              size='large'
              block
              className={styles.submitButton}
            >
              Zarezerwuj
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default FacilityId;
