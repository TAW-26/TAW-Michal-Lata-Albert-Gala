import styles from './ChooseScreen.module.css';
import { Row, Col, Typography } from 'antd';
import { Link } from 'react-router-dom';
import Button from '../components/Buttons';

const { Title, Paragraph } = Typography;

const ChooseScreen = () => {
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
        <Col span={4} xs={24} md={12} xl={8}>
          <Link to='/facility/1' className={styles.cardLink}>
            <div className={styles.facilityCard}>
              <div className={styles.facilityDescription}>
                <Title className={styles.cardTitle} level={3}>
                  Boisko do piłki nożnej
                </Title>
                <Paragraph className={styles.cardParagrapgh}>
                  Pełnowymiarowe boisko <br /> do z sztuczną nawierzchnią <br />{' '}
                  przeznaczone do prefesjonalnych <br />
                  treningów jak do <br /> amatorskich rozgrywek
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
        <Col span={4} xs={24} md={12} xl={8}>
          <Link to='/facility/2' className={styles.cardLink}>
            <div className={styles.facilityCard2}>
              <div className={styles.facilityDescription}>
                <Title className={styles.cardTitle} level={3}>
                  Kort do tenisa
                </Title>
                <Paragraph className={styles.cardParagrapgh}>
                  Pełnowymiarowy kort do tenisa <br /> z wysokiej jakości
                  sztuczną nawirzchnią, <br /> przystostowane zarówno do
                  profesjonalnych treningów, <br />
                  jak i rekreacyjych rozgrywek amatorskich <br /> amatorskich
                  rozgrywek
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
        <Col span={4} xs={24} md={12} xl={8}>
          <Link to='/facility/3' className={styles.cardLink}>
            <div className={styles.facilityCard3}>
              <div className={styles.facilityDescription}>
                <Title className={styles.cardTitle} level={3}>
                  Sala do squasha
                </Title>
                <Paragraph className={styles.cardParagrapgh}>
                  przeznaczona do gry w squasha <br /> w zamkniętej przestrzeni
                  z czterema ścianmi,
                  <br /> umożliwająca szybkie i dynamiczne zagrywki <br />
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
      </Row>
    </div>
  );
};

export default ChooseScreen;
