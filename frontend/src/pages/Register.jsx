import styles from './Register.module.css';
import { useForm } from 'react-hook-form';
import { Typography, Row, Col } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Buttons';

const { Title, Paragraph } = Typography;

const Register = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const handleRegister = async (data) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
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
          responseData.error || 'Wystąpił błąd podczas rejestracji'
        );
      }
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 6000);
    } catch (error) {
      console.error(error);
      setError('root', {
        message: error.message || 'Wystąpił błąd podczas połączenia z serwerem',
      });
    }
  };

  return (
    <div className={styles.container}>
      <Row style={{ margin: 0, minHeight: '100vh' }} align='stretch'>
        <Col xs={24} md={12} className={styles.leftSide}>
          <div className={styles.overlayBox}>
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

        <Col xs={24} md={12} className={styles.rightSide}>
          <div className={styles.formWrapper}>
            <Title level={1} className={styles.titleMain}>
              Załóż konto
            </Title>
            <Title level={4} className={styles.subtitleMain}>
              Zarejestruj się na naszej stronie aby mieć <br /> możliwość
              rezerwowania dostępnych obiektów
            </Title>

            <form noValidate onSubmit={handleSubmit(handleRegister)}>
              <div className={styles.inputGroup}>
                <label htmlFor='firstName'>Imię</label>
                <input
                  type='text'
                  id='firstName'
                  {...register('firstName', {
                    required: 'Musisz podać imię',
                    minLength: {
                      value: 2,
                      message: 'Imie musi miec co najmniej 2 znaki',
                    },
                  })}
                />
                {errors.firstName && (
                  <div className={styles.errorMessage}>
                    {errors.firstName.message}
                  </div>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor='lastName'>Nazwisko</label>
                <input
                  type='text'
                  id='lastName'
                  {...register('lastName', {
                    required: 'Musisz podać nazwisko',
                    minLength: {
                      value: 2,
                      message: 'Nazwisko musi miec co najmniej 2 znaki',
                    },
                  })}
                />
                {errors.lastName && (
                  <div className={styles.errorMessage}>
                    {errors.lastName.message}
                  </div>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor='email'>Email</label>
                <input
                  type='email'
                  id='email'
                  {...register('email', {
                    required: 'Musisz podać email',
                    pattern: {
                      value: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
                      message: 'Nieprawidłowy format emaila',
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
                  id='password'
                  {...register('password', {
                    required: 'Musisz podać hasło',
                    pattern: {
                      value: /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
                      message:
                        'Nieprawidłowy format hasła (wymagane 8 znaków, wielka litera, cyfra i znak specjalny)',
                    },
                  })}
                />
                {errors.password && (
                  <div className={styles.errorMessage}>
                    {errors.password.message}
                  </div>
                )}
              </div>

              {errors.root && (
                <div className={styles.errorMessage}>{errors.root.message}</div>
              )}
              {success && (
                <div className={styles.successMessage}>
                  Rejestracja zakończona sukcesem! Sprawdź swoją skrzynkę
                  mailową aby dokończyć proces aktywacji konta.
                </div>
              )}
              <Button
                variant='signup'
                type='submit'
                style={{ width: '100%' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Trwa rejestracja...' : 'Zarejestruj się'}
              </Button>
            </form>

            <div className={styles.loginLink}>
              Posiadasz już konto? <a href='/login'>Zaloguj się</a>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Register;
