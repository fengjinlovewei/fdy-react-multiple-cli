// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';
// import { initTheme } from '@/styles/theme';
// import '@/styles/reset.css';
// import 'amfe-flexible/index.js';

// initTheme('light');

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
// );

import uniqueId from 'lodash/uniqueId';
import f2 from '@/assets/images/f2.prefetch.png';

const fn = () => {
  return uniqueId();
};

console.log(fn());
console.log(f2);
