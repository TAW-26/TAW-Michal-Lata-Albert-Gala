import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    navigate('/');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className={styles.navbar}>
      <Link to='/choose' className={styles.logo} onClick={closeMenu}>
        TAW
      </Link>

      <button
        className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label='Menu'
      >
        <span className={styles.burgerLine} />
        <span className={styles.burgerLine} />
        <span className={styles.burgerLine} />
      </button>

      <div
        className={`${styles.navActions} ${menuOpen ? styles.navActionsOpen : ''}`}
      >
        {isAuthenticated ? (
          <>
            {user?.role === 'admin' && (
              <Link
                to='/admin'
                className={`${styles.navButton} ${styles.navButtonOutline}`}
                onClick={closeMenu}
                style={{ borderColor: '#7c7fff', color: '#7c7fff' }}
              >
                Panel Admin
              </Link>
            )}
            <Link
              to='/profile'
              className={`${styles.navButton} ${styles.navButtonFilled}`}
              onClick={closeMenu}
            >
              Profil
            </Link>
            <button
              onClick={handleLogout}
              className={`${styles.navButton} ${styles.navButtonDanger}`}
            >
              Wyloguj
            </button>
          </>
        ) : (
          <>
            <Link
              to='/login'
              className={`${styles.navButton} ${styles.navButtonOutline}`}
              onClick={closeMenu}
            >
              Zaloguj
            </Link>
            <Link
              to='/register'
              className={`${styles.navButton} ${styles.navButtonFilled}`}
              onClick={closeMenu}
            >
              Załóż konto
            </Link>
          </>
        )}
      </div>

      {menuOpen && <div className={styles.overlay} onClick={closeMenu} />}
    </nav>
  );
};

export default Navbar;
