import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import Navbar from '../components/Navbar.jsx';
import styles from './Layout.module.css';

const MainLayout = () => {
  return (
    <div className={styles.layoutWrapper}>
      <Navbar />
      <div className={styles.contentArea}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
