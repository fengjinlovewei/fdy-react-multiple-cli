import uniqueId from 'lodash/uniqueId';
import f2 from '@/assets/images/f2.prefetch.png';
import React from 'react';
import ReactDOM from 'react-dom/client';
//import { LazyDemoCommon } from '@/lazyComponents/';
// import { LazyDemo, LazyNone } from '@/pages/news/lazyComponents';

const fn = () => {
  return uniqueId();
};

console.log(fn());
console.log(f2);

function App() {
  return (
    <>
      {/* <LazyDemoCommon></LazyDemoCommon> */}
      {/* <LazyNone></LazyNone> */}
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
