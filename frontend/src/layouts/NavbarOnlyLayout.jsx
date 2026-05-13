import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import styles from './Layout.module.css';

const NavbarOnlyLayout = () => {
  return (
    <div className={styles.layoutWrapper}>
      <Navbar />
      <div className={styles.contentArea}>
        <Outlet />
      </div>
    </div>
  );
};

export default NavbarOnlyLayout;
