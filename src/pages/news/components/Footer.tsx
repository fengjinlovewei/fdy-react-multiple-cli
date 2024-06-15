import LazyLoad from 'react-lazyload';

import * as styles from './Footer.module.less';

import './2.css';

console.log('styles', styles);

import f1 from '@/assets/images/f1.prefetch.png';
import f2 from '@/assets/images/f2.prefetch.png';
import f3 from '@/assets/images/f3.preload.png';
import f4 from '@/assets/images/f4.preload.png';

const Footer = () => {
  return (
    <>
      <div className={styles.footer}>
        <div className={styles.test}>footer</div>
        <div className='title'>title</div>
        <LazyLoad height={200} offset={100} once>
          <img src={f1} alt='' />
        </LazyLoad>
        <LazyLoad height={200} offset={100} once>
          <img src={f2} alt='' />
        </LazyLoad>
        <LazyLoad height={200} offset={100} once>
          <img src={f3} alt='' />
        </LazyLoad>
        <LazyLoad height={200} offset={100} once>
          <img src={f4} alt='' />
        </LazyLoad>
        <LazyLoad height={200} offset={100} once>
          <img src={f1} alt='' />
        </LazyLoad>
        <LazyLoad height={200} offset={100} once>
          <img src={f2} alt='' />
        </LazyLoad>
        <LazyLoad height={200} offset={100} once>
          <img src={f3} alt='' />
        </LazyLoad>
        <LazyLoad height={200} offset={100} once>
          <img src={f4} alt='' />
        </LazyLoad>
      </div>
    </>
  );
};

export default Footer;
