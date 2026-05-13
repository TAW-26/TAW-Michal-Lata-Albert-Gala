import styles from './Register.module.css';
import { useForm } from 'react-hook-form';
import { Typography, Row, Col } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Buttons';
import FormField from '../components/FormField';
import apiClient from '../api/apiClient';
import {
  PASSWORD_REGEX,
  PASSWORD_REQUIREMENTS_MESSAGE,
} from '../utils/constants';

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

  const handleRegister = async (formValues) => {
    try {
      await apiClient.post('/auth/register', formValues);
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
              <FormField
                label='Imię'
                id='firstName'
                error={errors.firstName?.message}
                register={register('firstName', {
                  required: 'Musisz podać imię',
                  minLength: {
                    value: 2,
                    message: 'Imię musi mieć co najmniej 2 znaki',
                  },
                })}
              />
              <FormField
                label='Nazwisko'
                id='lastName'
                error={errors.lastName?.message}
                register={register('lastName', {
                  required: 'Musisz podać nazwisko',
                  minLength: {
                    value: 2,
                    message: 'Nazwisko musi mieć co najmniej 2 znaki',
                  },
                })}
              />
              <FormField
                label='Email'
                id='email'
                type='email'
                error={errors.email?.message}
                register={register('email', {
                  required: 'Musisz podać email',
                  pattern: {
                    value: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
                    message: 'Nieprawidłowy format emaila',
                  },
                })}
              />
              <FormField
                label='Hasło'
                id='password'
                type='password'
                error={errors.password?.message}
                register={register('password', {
                  required: 'Musisz podać hasło',
                  pattern: {
                    value: PASSWORD_REGEX,
                    message: PASSWORD_REQUIREMENTS_MESSAGE,
                  },
                })}
              />

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
              Posiadasz już konto? <Link to='/login'>Zaloguj się</Link>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Register;
