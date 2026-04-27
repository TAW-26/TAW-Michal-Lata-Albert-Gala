import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Row, Col, Modal } from 'antd';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Buttons';
import styles from './Profile.module.css';

const { Title, Paragraph } = Typography;

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');

    if (!currentPassword || !newPassword) {
      setPasswordError('Wypełnij oba pola.');
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setPasswordError(
        'Nieprawidłowy format hasła (wymagane 8 znaków, wielka litera, cyfra i znak specjalny)'
      );
      return;
    }

    setChangingPassword(true);
    try {
      const response = await fetch(
        'http://localhost:3000/api/users/me/password',
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ currentPassword, newPassword }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Błąd zmiany hasła');
      }
      setPasswordSuccess('Hasło zostało zmienione pomyślnie.');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = () => {
    Modal.confirm({
      title: 'Czy na pewno chcesz usunąć swoje konto?',
      content:
        'Ta operacja jest nieodwracalna. Wszystkie Twoje dane zostaną trwale usunięte.',
      okText: 'Tak, usuń konto',
      okType: 'danger',
      cancelText: 'Anuluj',
      onOk: async () => {
        setDeleting(true);
        setDeleteError('');
        try {
          const response = await fetch('http://localhost:3000/api/users/me', {
            method: 'DELETE',
            credentials: 'include',
          });
          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || 'Błąd usuwania konta');
          }
          await logout();
          navigate('/');
        } catch (err) {
          setDeleteError(err.message);
          setDeleting(false);
        }
      },
    });
  };

  if (!user) return null;

  return (
    <div className={styles.container}>
      <Title level={1} className={styles.titleMain}>
        Mój profil
      </Title>

      <Row gutter={[48, 24]} align='top'>
        <Col xs={24} md={14}>
          <div className={styles.profileCard}>
            <div className={styles.section}>
              <Title level={4} className={styles.sectionTitle}>
                Dane osobowe
              </Title>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Imię</span>
                <span className={styles.infoValue}>{user.first_name}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Nazwisko</span>
                <span className={styles.infoValue}>{user.last_name}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Email</span>
                <span className={styles.infoValue}>{user.email}</span>
              </div>
            </div>

            <div className={styles.section}>
              <Title level={4} className={styles.sectionTitle}>
                Zmiana hasła
              </Title>
              <form onSubmit={handleChangePassword}>
                <div className={styles.inputGroup}>
                  <label htmlFor='currentPassword'>Obecne hasło</label>
                  <input
                    type='password'
                    id='currentPassword'
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label htmlFor='newPassword'>Nowe hasło</label>
                  <input
                    type='password'
                    id='newPassword'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                {passwordSuccess && (
                  <div className={styles.successMessage}>{passwordSuccess}</div>
                )}
                {passwordError && (
                  <div className={styles.errorMessage}>{passwordError}</div>
                )}
                <Button
                  variant='signup'
                  type='submit'
                  disabled={changingPassword}
                  style={{ width: '100%' }}
                >
                  {changingPassword ? 'Zmieniam...' : 'Zmień hasło'}
                </Button>
              </form>
            </div>
          </div>
        </Col>

        <Col xs={24} md={10}>
          <div className={styles.dangerSection}>
            <Title level={4} className={styles.dangerTitle}>
              Strefa niebezpieczna
            </Title>
            <Paragraph className={styles.dangerText}>
              Usunięcie konta jest nieodwracalne. Wszystkie Twoje dane zostaną
              trwale usunięte.
            </Paragraph>
            {deleteError && (
              <div className={styles.errorMessage}>{deleteError}</div>
            )}
            <button
              onClick={handleDeleteAccount}
              disabled={deleting}
              className={styles.dangerButton}
              style={{ width: '100%' }}
            >
              {deleting ? 'Usuwam...' : 'Usuń konto'}
            </button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
