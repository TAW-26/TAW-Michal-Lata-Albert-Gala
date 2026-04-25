import { Row, Col, Typography } from 'antd';
import styles from './ForgotPassword.module.css';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/Buttons';

const { Title } = Typography;

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('Proszę wypełnić oba pola hasła');
      return;
    }

    if (password !== confirmPassword) {
      setError('Hasła nie są identyczne');
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('Co najmniej 8 znaków, wielka litera, cyfra i znak specjalny');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/auth/reset-password/${token}`,
        {
          method: 'POST',
          body: JSON.stringify({ password }),
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Nieprawidłowy lub wygasły link');
      }
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 5000);
    } catch (err) {
      console.log(err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <Row style={{ margin: 0, minHeight: '100vh' }} align='stretch'>
        <Col xs={0} md={12} className={styles.leftSide}></Col>
        <Col xs={24} md={12} className={styles.rightSide}>
          <div className={styles.formWrapper}>
            <Title level={1} className={styles.titleMain}>
              Utwórz nowe hasło
            </Title>
            <div className={styles.inputGroup}>
              <label htmlFor='password'>Nowe hasło</label>
              <input
                type='password'
                id='password'
                placeholder='Wpisz nowe hasło'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor='confirmPassword'>Potwierdź hasło</label>
              <input
                type='password'
                id='confirmPassword'
                placeholder='Wpisz ponownie nowe hasło'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {error && <p className={styles.errorText}>{error}</p>}
            {success && (
              <p className={styles.successText}>
                Hasło zostało pomyślnie zmienione. Za chwilę nastąpi
                przekierowanie...
              </p>
            )}
            <Button
              onClick={handleResetPassword}
              variant='signup'
              type='submit'
              style={{ width: '100%' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Zapisywanie...' : 'Zapisz'}
            </Button>
            <div className={styles.actionLinks}>
              <p>
                Powrót do logowania <a href='/login'>Zaloguj się</a>
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ResetPassword;
