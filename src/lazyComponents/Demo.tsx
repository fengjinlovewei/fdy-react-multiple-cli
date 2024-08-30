import './Demo.less';

import data from '@/assets/images/data.jpeg';
import f44 from '@/assets/images/f4.preload.png';

function LazyDemoCommon() {
  return (
    <>
      <img src={f44} alt='' />
      <img src={data} alt='' />
      <h3 className='demo-lazy'>我是懒加载组件组便便叨叨叨ddd</h3>;
    </>
  );
}
export default LazyDemoCommon;
