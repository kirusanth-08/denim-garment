import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AdminAuthProvider } from './app/context/AdminAuthContext';
import { AppRouter } from './app/router/AppRouter';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AdminAuthProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AdminAuthProvider>
  </React.StrictMode>,
);
