import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initTheme } from '@/styles/theme';
import '@/styles/reset.css';
import 'amfe-flexible/index.js';

initTheme('light');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
