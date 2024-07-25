import uniqueId from 'lodash/uniqueId';
import f2 from '@/assets/images/f2.prefetch.png';

const fn = () => {
  return uniqueId();
};

console.log(fn());
console.log(f2);
