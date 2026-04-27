import { Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';

const AppWrapper = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

export default AppWrapper;
