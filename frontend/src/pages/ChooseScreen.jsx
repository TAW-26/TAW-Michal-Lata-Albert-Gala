import { useState, useEffect } from 'react';
import styles from './ChooseScreen.module.css';
import { Row, Col, Typography } from 'antd';
import { Link } from 'react-router-dom';
import Button from '../components/Buttons';
import LoadingSpinner from '../components/LoadingSpinner';
import apiClient from '../api/apiClient';
import { getFacilityMeta } from './Facility/facilityData';

const { Title, Paragraph } = Typography;

const ChooseScreen = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFacilities = async () => {
      try {
        const data = await apiClient.get('/facilities');
        setFacilities(data.facilities || []);
      } catch (err) {
        console.error('Error fetching facilities:', err);
      } finally {
        setLoading(false);
      }
    };
    loadFacilities();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
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
                    <Paragraph className={styles.cardParagraph}>
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
