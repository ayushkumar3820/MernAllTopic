// AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));

  // Run on page load to validate or refresh token
  useEffect(() => {
    const verifyToken = async () => {
      if (accessToken) {
        try {
          const response = await api.get('/users/profile');
          setUser(response.data);
        } catch {
          if (refreshToken) {
            try {
              const response = await api.post('/auth/refresh-token', { refreshToken });
              setAccessToken(response.data.accessToken);
              setRefreshToken(response.data.refreshToken);
              localStorage.setItem('accessToken', response.data.accessToken);
              localStorage.setItem('refreshToken', response.data.refreshToken);

              const userResponse = await api.get('/users/profile');
              setUser(userResponse.data);
            } catch {
              logout();
            }
          } else {
            logout();
          }
        }
      }
    };

    verifyToken();
  }, [accessToken, refreshToken]);

  // Call after login API success
  const login = ({ accessToken, refreshToken, user }) => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setUser(user);

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  };

  // Clear all login info
  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
