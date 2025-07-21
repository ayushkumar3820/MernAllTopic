import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';

import PrivateRoute from './components/Common/PrivateRoute';
import AdminRoute from './components/Common/AdminRoute';
import Layout from './components/Common/Layout'; // includes Navbar

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, 
    children: [
      { index: true, element: <Home /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'dashboard', element: <PrivateRoute><Dashboard /></PrivateRoute> },
      { path: 'profile', element: <PrivateRoute><ProfilePage /></PrivateRoute> },
      { path: 'admin', element: <AdminRoute><Dashboard /></AdminRoute> }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
