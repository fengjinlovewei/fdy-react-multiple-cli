// @ts-ignore
import { isMock } from '../../script/package-readonly.js';

export const isDev = () => process.env.NODE_ENV === 'development';

export const isProd = () => process.env.NODE_ENV === 'production';

export const isTest = () => process.env.NODE_ENV === 'test';

// 时间序列化
export function DateFormat({
  format = `y年m月d日 H:M:S`,
  date = new Date(),
} = {}) {
  const formatNumber = (n: number) => (n >= 10 ? n : '0' + n);
  return format
    .replace('y', date.getFullYear().toString())
    .replace('m', formatNumber(date.getMonth() + 1).toString())
    .replace('d', formatNumber(date.getDate()).toString())
    .replace('H', formatNumber(date.getHours()).toString())
    .replace('M', formatNumber(date.getMinutes()).toString())
    .replace('S', formatNumber(date.getSeconds()).toString());
}

export const getTime = function (time: number, bool: boolean = true) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      bool ? resolve(time) : reject(`${time}报错了`);
    }, time);
  });
};

export async function enableMocking() {
  if (isDev() && isMock) {
    const { worker } = await import('@/api/mock/index.browser.mock');
    return worker.start();
  }
}
