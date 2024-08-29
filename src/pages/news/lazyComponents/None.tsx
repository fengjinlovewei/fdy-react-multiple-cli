import './None.less';

import data from '@/assets/images/data.jpeg';

import f446 from '@/assets/images/f4.preload.png';

function LazyNone() {
  return (
    <>
      <img src={data} alt='' />
      <img src={f446} alt='' />
      <h3 className='demo-lazy'>我是懒加载组件组件LazyNone哈哈</h3>;
    </>
  );
}
export default LazyNone;
