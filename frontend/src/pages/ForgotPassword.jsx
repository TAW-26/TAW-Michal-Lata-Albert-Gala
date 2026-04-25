import { Row, Col, Typography } from 'antd';
import styles from './ForgotPassword.module.css';
import { useState } from 'react';
import Button from '../components/Buttons';

const { Title } = Typography;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!email) {
      setError('Proszę wpisać email');
      setIsSubmitting(false);
      return;
    }
    try {
      const response = await fetch(
        'http://localhost:3000/api/auth/forgot-password',
        {
          method: 'POST',
          body: JSON.stringify({ email }),
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Coś poszło nie tak');
      }
      setSuccess(true);
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
              Zapomniałeś hasła?
            </Title>
            <div className={styles.inputGroup}>
              <label htmlFor='email'>Email</label>
              <input
                type='email'
                placeholder='Podaj swój adres email'
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {error && <p className={styles.errorText}>{error}</p>}
            {success && (
              <p className={styles.successText}>
                Wysłano link na podany adres e-mail, proszę go sprawdzić.
              </p>
            )}
            <Button
              onClick={handleResetPassword}
              variant='signup'
              type='submit'
              style={{ width: '100%' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Wysyłanie...' : 'Wyślij link resetujący'}
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

export default ForgotPassword;
