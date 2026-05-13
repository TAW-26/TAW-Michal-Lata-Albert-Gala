import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AuthProvider, useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminRoute from '../components/AdminRoute';
import Navbar from '../components/Navbar';
import Login from '../pages/Login';
import Register from '../pages/Register';
import { getFacilityMeta } from '../pages/Facility/facilityData';

let originalFetch;
beforeEach(() => {
  originalFetch = global.fetch;
});
afterEach(() => {
  global.fetch = originalFetch;
});

const unauthFetch = () =>
  vi.fn(() => Promise.resolve({ ok: false, json: () => Promise.resolve({}) }));

const authFetch = (user) =>
  vi.fn(() =>
    Promise.resolve({ ok: true, json: () => Promise.resolve({ user }) })
  );

const mockUser = {
  id: 1,
  first_name: 'Jan',
  last_name: 'Kowalski',
  email: 'jan@test.pl',
  role: 'user',
};
const mockAdmin = {
  id: 2,
  first_name: 'Admin',
  last_name: 'Root',
  email: 'admin@test.pl',
  role: 'admin',
};

function wrap(ui, fetchMock, route = '/') {
  global.fetch = fetchMock;
  return render(
    <ConfigProvider>
      <MemoryRouter initialEntries={[route]}>
        <AuthProvider>{ui}</AuthProvider>
      </MemoryRouter>
    </ConfigProvider>
  );
}

// 1.AuthContext – sesja ustawia użytkownika

function AuthConsumer() {
  const { user, isAuthenticated, loading } = useAuth();
  return (
    <div>
      <span data-testid='loading'>{String(loading)}</span>
      <span data-testid='auth'>{String(isAuthenticated)}</span>
      <span data-testid='name'>{user?.first_name || 'none'}</span>
    </div>
  );
}

describe('Kluczowe testy aplikacji', () => {
  it('1. AuthContext – poprawna sesja ustawia użytkownika', async () => {
    wrap(<AuthConsumer />, authFetch(mockUser));
    await waitFor(() =>
      expect(screen.getByTestId('loading').textContent).toBe('false')
    );
    expect(screen.getByTestId('auth').textContent).toBe('true');
    expect(screen.getByTestId('name').textContent).toBe('Jan');
  });

  // 2.AuthContext – brak sesji oznacza niezalogowany

  it('2. AuthContext – brak sesji oznacza brak użytkownika', async () => {
    wrap(<AuthConsumer />, unauthFetch());
    await waitFor(() =>
      expect(screen.getByTestId('loading').textContent).toBe('false')
    );
    expect(screen.getByTestId('auth').textContent).toBe('false');
    expect(screen.getByTestId('name').textContent).toBe('none');
  });

  //3.ProtectedRoute – redirect bez logowania

  it('3. ProtectedRoute – przekierowuje na /login bez autoryzacji', async () => {
    global.fetch = unauthFetch();
    render(
      <ConfigProvider>
        <MemoryRouter initialEntries={['/protected']}>
          <AuthProvider>
            <Routes>
              <Route
                path='/login'
                element={<div data-testid='login-page'>Login</div>}
              />
              <Route
                path='/protected'
                element={
                  <ProtectedRoute>
                    <div data-testid='secret'>Secret</div>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      </ConfigProvider>
    );
    await waitFor(() =>
      expect(screen.getByTestId('login-page')).toBeInTheDocument()
    );
    expect(screen.queryByTestId('secret')).not.toBeInTheDocument();
  });

  //4. AdminRoute – blok zwyklego uzytkownika

  it('4. AdminRoute – blokuje użytkownika bez roli admin', async () => {
    global.fetch = authFetch(mockUser);
    render(
      <ConfigProvider>
        <MemoryRouter initialEntries={['/admin']}>
          <AuthProvider>
            <Routes>
              <Route path='/' element={<div data-testid='home'>Home</div>} />
              <Route
                path='/admin'
                element={
                  <AdminRoute>
                    <div data-testid='admin'>Admin</div>
                  </AdminRoute>
                }
              />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      </ConfigProvider>
    );
    await waitFor(() => expect(screen.getByTestId('home')).toBeInTheDocument());
    expect(screen.queryByTestId('admin')).not.toBeInTheDocument();
  });

  //5. AdminRoute – przepuszcza admina

  it('5. AdminRoute – pozwala adminowi wejść', async () => {
    global.fetch = authFetch(mockAdmin);
    render(
      <ConfigProvider>
        <MemoryRouter initialEntries={['/admin']}>
          <AuthProvider>
            <Routes>
              <Route path='/' element={<div data-testid='home'>Home</div>} />
              <Route
                path='/admin'
                element={
                  <AdminRoute>
                    <div data-testid='admin'>Admin</div>
                  </AdminRoute>
                }
              />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      </ConfigProvider>
    );
    await waitFor(() =>
      expect(screen.getByTestId('admin')).toBeInTheDocument()
    );
  });

  //6.Navbar – linki zależne od stanu auth

  it('6. Navbar – pokazuje Zaloguj/Załóż konto gdy niezalogowany', async () => {
    wrap(
      <Routes>
        <Route path='*' element={<Navbar />} />
      </Routes>,
      unauthFetch(),
      '/choose'
    );
    await waitFor(() =>
      expect(screen.getByText('Zaloguj')).toBeInTheDocument()
    );
    expect(screen.getByText('Załóż konto')).toBeInTheDocument();
    expect(screen.queryByText('Wyloguj')).not.toBeInTheDocument();
  });

  //7. Login – walidacja formularza

  it('7. Login – walidacja pustego emaila', async () => {
    const user = userEvent.setup();
    global.fetch = unauthFetch();
    render(
      <ConfigProvider>
        <MemoryRouter initialEntries={['/login']}>
          <AuthProvider>
            <Routes>
              <Route path='/login' element={<Login />} />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      </ConfigProvider>
    );
    await waitFor(() => expect(screen.getByText('Email')).toBeInTheDocument());
    const emailInput = document.querySelector('input[name="email"]');
    await user.click(emailInput);
    await user.tab();
    await waitFor(() =>
      expect(screen.getByText('Musisz podac email')).toBeInTheDocument()
    );
  });

  // 8. Login – błąd serwera

  it('8. Login – wyświetla błąd serwera przy nieudanym logowaniu', async () => {
    const user = userEvent.setup();
    global.fetch = vi.fn((url) => {
      if (url.includes('/api/users/me'))
        return Promise.resolve({ ok: false, json: () => Promise.resolve({}) });
      if (url.includes('/api/auth/login'))
        return Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ error: 'Nieprawidłowe dane' }),
        });
      return Promise.resolve({ ok: false, json: () => Promise.resolve({}) });
    });
    render(
      <ConfigProvider>
        <MemoryRouter initialEntries={['/login']}>
          <AuthProvider>
            <Routes>
              <Route path='/login' element={<Login />} />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      </ConfigProvider>
    );
    await waitFor(() => expect(screen.getByText('Email')).toBeInTheDocument());
    await user.type(
      document.querySelector('input[name="email"]'),
      'test@example.com'
    );
    await user.type(
      document.querySelector('input[name="password"]'),
      'Password1!'
    );
    await user.click(screen.getByRole('button', { name: /zaloguj się/i }));
    await waitFor(() =>
      expect(screen.getByText('Nieprawidłowe dane')).toBeInTheDocument()
    );
  });

  //9. Register – sukces rejestracji

  it('9. Register – wyświetla sukces po poprawnej rejestracji', async () => {
    const user = userEvent.setup();
    global.fetch = vi.fn((url) => {
      if (url.includes('/api/users/me'))
        return Promise.resolve({ ok: false, json: () => Promise.resolve({}) });
      if (url.includes('/api/auth/register'))
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: 'OK' }),
        });
      return Promise.resolve({ ok: false, json: () => Promise.resolve({}) });
    });
    render(
      <ConfigProvider>
        <MemoryRouter initialEntries={['/register']}>
          <AuthProvider>
            <Routes>
              <Route path='/register' element={<Register />} />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      </ConfigProvider>
    );
    await waitFor(() =>
      expect(screen.getByLabelText('Imię')).toBeInTheDocument()
    );
    await user.type(screen.getByLabelText('Imię'), 'Jan');
    await user.type(screen.getByLabelText('Nazwisko'), 'Kowalski');
    await user.type(screen.getByLabelText('Email'), 'jan@example.com');
    await user.type(screen.getByLabelText('Hasło'), 'Password1!');
    await user.click(screen.getByRole('button', { name: /zarejestruj się/i }));
    await waitFor(() =>
      expect(
        screen.getByText(/rejestracja zakończona sukcesem/i)
      ).toBeInTheDocument()
    );
  });

  //10. facilityData – metadata i fallback

  it('10. getFacilityMeta – zwraca poprawne dane i fallback', () => {
    const football = getFacilityMeta('football');
    expect(football.surfaceType).toBe('Sztuczna');
    expect(football.slotDuration).toBe(2);

    const tennis = getFacilityMeta('tennis');
    expect(tennis.surfaceType).toBe('Mączka ceglana');
    expect(tennis.slotDuration).toBe(1);

    const unknown = getFacilityMeta('basketball');
    expect(unknown.surfaceType).toBe('Standardowa');
    expect(unknown.slotDuration).toBe(1);
  });
});
