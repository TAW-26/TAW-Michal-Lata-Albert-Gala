import { Row, Col, Typography } from 'antd';
import styles from './ForgotPassword.module.css';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../components/Buttons';
import FormField from '../components/FormField';
import apiClient from '../api/apiClient';
import {
  PASSWORD_REGEX,
  PASSWORD_REQUIREMENTS_MESSAGE,
} from '../utils/constants';

const { Title } = Typography;

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
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

    if (!PASSWORD_REGEX.test(password)) {
      setError(PASSWORD_REQUIREMENTS_MESSAGE);
      return;
    }

    setIsSubmitting(true);
    try {
      await apiClient.post(`/auth/reset-password/${token}`, { password });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 5000);
    } catch (err) {
      console.error(err);
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
            <FormField
              label='Nowe hasło'
              id='password'
              type='password'
              placeholder='Wpisz nowe hasło'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormField
              label='Potwierdź hasło'
              id='confirmPassword'
              type='password'
              placeholder='Wpisz ponownie nowe hasło'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
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
                Powrót do logowania <Link to='/login'>Zaloguj się</Link>
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ResetPassword;
