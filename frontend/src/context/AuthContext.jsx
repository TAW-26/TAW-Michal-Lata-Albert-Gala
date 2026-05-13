import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import apiClient from '../api/apiClient';

const AuthContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * Verify session against the API — shared between initial load
   * and manual re-checks. Previously duplicated as checkSession + checkAuth.
   */
  const verifySession = useCallback(async () => {
    try {
      const response = await apiClient.raw.get('/users/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const initSession = async () => {
      await verifySession();
      setLoading(false);
    };
    initSession();
  }, [verifySession]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await apiClient.raw.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        checkAuth: verifySession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
