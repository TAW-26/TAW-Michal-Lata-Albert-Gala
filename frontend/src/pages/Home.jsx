import styles from './Home.module.css';
import { Link } from 'react-router-dom';
import { Typography, Row, Col } from 'antd';
import {
  ArrowsAltOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  FieldTimeOutlined,
} from '@ant-design/icons';
import Button from '../components/Buttons';

const { Title, Paragraph, Text } = Typography;

const stepsData = [
  {
    icon: <EnvironmentOutlined />,
    number: '1',
    title: 'Wybierz obiekt',
    desc: 'Kliknij obiekt który Cię interesuje',
  },
  {
    icon: <CalendarOutlined />,
    number: '2',
    title: 'Wybierz datę',
    desc: 'Sprawdź dostępność w kalendarzu',
  },
  {
    icon: <FieldTimeOutlined />,
    number: '3',
    title: 'Zarezerwuj termin',
    desc: 'Wybierz godzinę i potwierdź',
  },
];

const Home = () => {
  return (
    <div className={styles.container}>
      <Row gutter={[24, 24]} justify='center' align='middle'>
        <Col xs={24} lg={16}>
          <Title className={styles.titleStart} level={1}>
            Zarezerwuj swój ulubiony obiekt sportowy
          </Title>
          <Paragraph className={styles.titleStartParagraph}>
            Najłatwiejszy sposób na rezerwację boiska, korta do tenisa i
            squasha.
            <br />
            Sprawdź dostępność obiektów i zarezerwuj to co Cie interesuje
          </Paragraph>
        </Col>
      </Row>
      <div className={styles.cardsWrapper}>
        <Row gutter={[24, 24]} justify='center' align='stretch'>
          <Col xs={24} md={8}>
            <div className={styles.authInfo}>
              <div className={styles.titleInfo}>
                <Title className={styles.textTitle} level={4}>
                  Zaloguj się lub zarejestruj jeśli chcesz posiadać
                  natychmiastowy dostęp do rezerwacji obiektów
                </Title>
              </div>
              <div className={styles.linkButtons}>
                <Link to='/login' style={{ width: '100%' }}>
                  <Button
                    variant='signin'
                    type='button'
                    style={{ width: '100%' }}
                  >
                    Zaloguj się
                  </Button>
                </Link>
                <Link to='/register' style={{ width: '100%' }}>
                  <Button
                    variant='signup'
                    type='button'
                    style={{ width: '100%' }}
                  >
                    Zarejestruj się
                  </Button>
                </Link>
              </div>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className={styles.offersContainer}>
              <Title className={styles.offersTitle} level={4}>
                Wybierz sposób
                <br />
                przeglądania
                <br />
                naszej oferty
              </Title>
              <div className={styles.offersArrows}>
                <ArrowsAltOutlined className={styles.offersIconLeft} />
              </div>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className={styles.authInfo}>
              <div className={styles.titleInfo}>
                <Title className={styles.textTitle} level={4}>
                  Przeglądaj jako gość żeby zobaczyć czy znajdziesz u nas to
                  czego szukasz
                </Title>
              </div>
              <div className={styles.linkButtons}>
                <Button
                  style={{ width: '200px' }}
                  variant='signup'
                  type='button'
                >
                  Przeglądaj jako gość
                </Button>
              </div>
              <div className={styles.bottomInfo}>
                <Title className={styles.textTitleSmall} level={5}>
                  W razie zmiany zdania, możesz założyc konto w trakcie
                  wybierania obkietu
                </Title>
              </div>
            </div>
          </Col>
        </Row>
      </div>
      <Row gutter={[24, 24]} justify='center' align='middle'>
        <Col span={24}>
          <div className={styles.howItWorksSection}>
            <Title className={styles.howItWorksTitle} level={2}>
              Jak to działa?
            </Title>
            <Paragraph className={styles.howItWorksPar}>
              Trzy kroki do rezerwacji obiektu
            </Paragraph>
          </div>
        </Col>
      </Row>
      <Row gutter={[24, 24]} justify='center' align='stretch'>
        {stepsData.map((step, index) => (
          <Col xs={24} md={8} lg={8} key={index}>
            <div className={styles.stepCard}>
              <div className={styles.stepIcon}>{step.icon}</div>
              <Title className={styles.stepNumber} level={2}>
                {step.number}
              </Title>
              <Title className={styles.stepTitle} level={4}>
                {step.title}
              </Title>
              <Paragraph className={styles.stepDesc}>{step.desc}</Paragraph>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Home;
