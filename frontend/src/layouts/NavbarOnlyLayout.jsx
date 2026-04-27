import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

const NavbarOnlyLayout = () => {
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
    >
      <Navbar />
      <div style={{ flex: 1, paddingTop: '68px' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default NavbarOnlyLayout;
