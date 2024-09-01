// import uniqueId from 'lodash/uniqueId';
// import f2 from '@/assets/images/f2.prefetch.png';
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { LazyDemoCommon } from '@/lazyComponents/';
// import { LazyDemo, LazyNone } from '@/pages/news/lazyComponents';

import { Ds } from './cc';

// const fn = () => {
//   return uniqueId();
// };

// class a {}

// async function haha(params) {}

async function getValue() {
  return await 555;
}

getValue();

const arr = [1, 2, 3];
const newArr = arr.includes(3);
console.log(newArr);

console.log(Ds);

// function App() {
//   return (
//     <>
//       {/* <LazyDemoCommon></LazyDemoCommon> */}
//       {/* <LazyNone></LazyNone> */}
//     </>
//   );
// }

// ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
