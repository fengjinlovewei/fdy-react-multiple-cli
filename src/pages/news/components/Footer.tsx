import { useContext } from 'react';
import LazyLoad from 'react-lazyload';
import { useTranslation } from 'react-i18next';

import * as styles from './Footer.module.less';

import { GlobalContext } from '@/pages/news/store';

import './2.css';

import f1 from '@/assets/images/f1.prefetch.png';
import f2 from '@/assets/images/f2.prefetch.png';
import f3 from '@/assets/images/f3.preload.png';
import f4 from '@/assets/images/f4.preload.png';
import data from '@/assets/images/data.jpeg';

const Footer = () => {
  const { level, name, setName, setLevel } = useContext(GlobalContext)!;
  const { t } = useTranslation();

  return (
    <>
      <div className={styles.footer}>
        <div>{t('book.title')}</div>
        <div>{t('book.content')}</div>
        <div className={styles.test}>footer </div>
        <div>{level}</div>
        <div>{name}</div>
        <button onClick={() => setLevel(300)}>setLevel</button>
        <button onClick={() => setName('张三')}>setName</button>
        <div className='title'>title</div>
        <LazyLoad height={200} offset={100} once>
          <img src={'https://fengjinlovewei.com/aaa.png'} alt='' />
        </LazyLoad>
        <LazyLoad height={200} offset={100} once>
          <img src={data} alt='' />
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
