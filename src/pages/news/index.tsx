import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initTheme } from '@/styles/theme';
import { enableMocking } from '@/api/mock/init';
import StoreContent from './store';
import '@/i18n';
import '@/styles/reset.css';
import 'amfe-flexible/index.js';

initTheme('light');

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <StoreContent>
      <App />
    </StoreContent>,
  );
});
