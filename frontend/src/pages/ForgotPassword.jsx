import { Row, Col, Typography } from 'antd';
import styles from './ForgotPassword.module.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Buttons';
import FormField from '../components/FormField';
import apiClient from '../api/apiClient';

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
      await apiClient.post('/auth/forgot-password', { email });
      setSuccess(true);
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
              Zapomniałeś hasła?
            </Title>
            <FormField
              label='Email'
              id='email'
              type='email'
              placeholder='Podaj swój adres email'
              onChange={(e) => setEmail(e.target.value)}
            />
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
                Powrót do logowania <Link to='/login'>Zaloguj się</Link>
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ForgotPassword;
