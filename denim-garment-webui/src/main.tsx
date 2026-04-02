import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './app/context/AuthContext';
import { CartProvider } from './app/context/CartContext';
import { StorefrontDataProvider } from './app/context/StorefrontDataContext';
import { AppRouter } from './app/router/AppRouter';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <StorefrontDataProvider>
          <CartProvider>
            <AppRouter />
          </CartProvider>
        </StorefrontDataProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
