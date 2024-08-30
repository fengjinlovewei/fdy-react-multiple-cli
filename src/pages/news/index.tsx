import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initTheme } from '@/styles/theme';
import { enableMocking } from '@/utils';
import Store from './store';
import '@/styles/reset.css';
import 'amfe-flexible/index.js';

initTheme('light');

enableMocking().then(() => {
  console.log('ReactDOM.createRoot');
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <Store>
      <App />
    </Store>,
  );
});
