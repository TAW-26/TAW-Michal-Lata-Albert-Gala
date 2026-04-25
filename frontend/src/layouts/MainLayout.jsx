import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer.jsx';

const MainLayout = () => {
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
    >
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
