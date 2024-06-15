export const isDev = () => process.env.NODE_ENV === 'development';

// 时间序列化
export function DateFormat({ format = `y年m月d日 H:M:S`, date = new Date() } = {}) {
  const formatNumber = (n: number) => (n >= 10 ? n : '0' + n);
  return format
    .replace('y', date.getFullYear().toString())
    .replace('m', formatNumber(date.getMonth() + 1).toString())
    .replace('d', formatNumber(date.getDate()).toString())
    .replace('H', formatNumber(date.getHours()).toString())
    .replace('M', formatNumber(date.getMinutes()).toString())
    .replace('S', formatNumber(date.getSeconds()).toString());
}
