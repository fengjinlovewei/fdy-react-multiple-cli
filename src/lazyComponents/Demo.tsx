import './Demo.less';

import data from '@/assets/images/data.jpeg';

import(
  /* webpackPrefetch: true */
  '@/assets/images/data.jpeg'
);

function LazyDemo() {
  return (
    <>
      <img src={data} alt='' />
      <h3 className='demo-lazy'>我是懒加载组件组便便叨叨叨ddd</h3>;
    </>
  );
}
export default LazyDemo;
