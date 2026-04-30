import styles from './Login.module.css';
import { Row, Col, Typography } from 'antd';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Buttons';

const { Title, Paragraph } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  if (isAuthenticated) {
    return <Navigate to='/choose' replace />;
  }

  const handleLogin = async (data) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(
          responseData.error || 'Wystapil blad podczas logowania'
        );
      }
      login(responseData.user);
      navigate('/choose');
    } catch (err) {
      console.error(err);
      setError('root', {
        message: err.message || 'Wystapil blad podczas polaczenia z serwerem',
      });
    }
  };
  return (
    <>
      <div className={styles.pageBackground}></div>
      <div className={styles.container}>
        <Row
          justify='center'
          align='middle'
          style={{ width: '100%', rowGap: '32px', columnGap: '64px' }}
        >
          <Col xs={0} sm={0} md={10} lg={8} xl={6}>
            <div className={styles.leftCard}>
              <Title level={2} className={styles.overlayTitle}>
                Technologie aplikacji <br /> webowych
              </Title>
              <Title level={3} className={styles.overlaySubtitle}>
                Rezerwacja obiektów
              </Title>
              <Paragraph className={styles.overlayAuthors}>
                Michał Łata, Albert Gała
              </Paragraph>
            </div>
          </Col>
          <Col xs={24} sm={16} md={12} lg={10} xl={8}>
            <div className={styles.rightCard}>
              <div className={styles.heading}>
                <Title level={1} className={styles.titleMain}>
                  Zaloguj się
                </Title>
                <Title level={4} className={styles.subtitleMain}>
                  Zaloguj się i rezerwuj obiekty <br />w dogodnym terminie
                </Title>
              </div>
              <form noValidate onSubmit={handleSubmit(handleLogin)}>
                <div className={styles.inputGroup}>
                  <label htmlFor='email'>Email</label>
                  <input
                    type='email'
                    {...register('email', {
                      required: 'Musisz podac email',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Nieprawidlowy format email',
                      },
                    })}
                  />
                  {errors.email && (
                    <div className={styles.errorMessage}>
                      {errors.email.message}
                    </div>
                  )}
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor='password'>Hasło</label>
                  <input
                    type='password'
                    {...register('password', {
                      required: 'Musisz wpisać hasło',
                      pattern: {
                        value: /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
                        message:
                          'Co najmniej 8 znaków, wielka litera, cyfra i znak specjalny',
                      },
                    })}
                  />
                  {errors.password && (
                    <div className={styles.errorMessage}>
                      {errors.password.message}
                    </div>
                  )}
                </div>
                <div className={styles.checkboxGroup}>
                  <input
                    type='checkbox'
                    id='rememberMe'
                    {...register('rememberMe')}
                  />
                  <label htmlFor='rememberMe'>Zapamiętaj mnie</label>
                </div>
                {errors.root && (
                  <div className={styles.errorMessage}>
                    {errors.root.message}
                  </div>
                )}
                <div style={{ marginTop: '16px' }}>
                  <Button
                    variant='signin'
                    type='submit'
                    disabled={isSubmitting}
                    style={{ width: '100%' }}
                  >
                    {isSubmitting ? 'Logowanie...' : 'Zaloguj się'}
                  </Button>
                </div>
              </form>
              <Paragraph className={styles.loginLink}>
                Nie posiadasz konta? <Link to='/register'>Zarejestruj się</Link>
              </Paragraph>
              <Paragraph className={styles.forgotPasswordLink}>
                Zapomniałeś hasła?{' '}
                <Link to='/forgot-password'>Zresetuj hasło</Link>
              </Paragraph>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Login;
