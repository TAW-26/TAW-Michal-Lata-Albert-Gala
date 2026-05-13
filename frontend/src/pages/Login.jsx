import styles from './Login.module.css';
import { Row, Col, Typography } from 'antd';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Buttons';
import FormField from '../components/FormField';

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

  const handleLogin = async (formValues) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(formValues),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(
          responseData.error || 'Wystąpił błąd podczas logowania'
        );
      }
      login(responseData.user);
      navigate('/choose');
    } catch (err) {
      console.error(err);
      setError('root', {
        message: err.message || 'Wystąpił błąd podczas połączenia z serwerem',
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
                Technologie aplikacji <br />
                webowych
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
                <FormField
                  label='Email'
                  id='email'
                  type='email'
                  error={errors.email?.message}
                  register={register('email', {
                    required: 'Musisz podać email',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Nieprawidłowy format email',
                    },
                  })}
                />
                <FormField
                  label='Hasło'
                  id='password'
                  type='password'
                  error={errors.password?.message}
                  register={register('password', {
                    required: 'Musisz wpisać hasło',
                    pattern: {
                      value: /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
                      message:
                        'Co najmniej 8 znaków, wielka litera, cyfra i znak specjalny',
                    },
                  })}
                />
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
