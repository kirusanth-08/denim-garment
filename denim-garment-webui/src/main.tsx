import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { PortalDataProvider } from './app/context/PortalDataContext';
import { AppRouter } from './app/router/AppRouter';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PortalDataProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </PortalDataProvider>
  </React.StrictMode>,
);

