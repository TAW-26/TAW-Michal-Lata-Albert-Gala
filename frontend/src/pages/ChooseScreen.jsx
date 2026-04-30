import { useState, useEffect } from 'react';
import styles from './ChooseScreen.module.css';
import { Row, Col, Typography, Spin } from 'antd';
import { Link } from 'react-router-dom';
import Button from '../components/Buttons';
import { getFacilityMeta } from './Facility/facilityData';

const { Title, Paragraph } = Typography;

const ChooseScreen = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/facilities', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setFacilities(data.facilities || []);
        }
      } catch (err) {
        console.error('Error fetching facilities:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFacilities();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <Spin size='large' />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Row gutter={[24, 24]} align='middle' justify='center'>
        <div className={styles.containerInner}>
          <Title className={styles.titleMain} level={1}>
            Sprawdź nasze obiekty i wybierz <br /> który Cię interesuje
          </Title>
          <Title className={styles.titleMainDescription} level={4}>
            Kliknij w jeden z obiektów i zobacz dostępne terminy, <br />
            wybierz na co masz ochotę i skorzystaj z naszej oferty
          </Title>
        </div>
      </Row>
      <Row gutter={[24, 24]} align='middle' justify='center'>
        {facilities.map((facility) => {
          const meta = getFacilityMeta(facility.type);
          return (
            <Col span={4} xs={24} md={12} xl={8} key={facility.id}>
              <Link to={`/facility/${facility.id}`} className={styles.cardLink}>
                <div className={styles[meta.cardClass] || styles.facilityCard}>
                  <div className={styles.facilityDescription}>
                    <Title className={styles.cardTitle} level={3}>
                      {facility.name}
                    </Title>
                    <Paragraph className={styles.cardParagrapgh}>
                      {facility.description}
                    </Paragraph>
                  </div>
                  <div className={styles.facilityButton}>
                    <Button style={{ width: '100%' }} variant='signup'>
                      Sprawdź terminy
                    </Button>
                  </div>
                </div>
              </Link>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default ChooseScreen;
