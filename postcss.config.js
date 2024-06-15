const postCssPxToRem = require('postcss-pxtorem');
const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [
    // 这个配置是使css兼容老板浏览器的，兼容到哪些浏览器根据 .browserslistrc 文件配置决定
    autoprefixer(),

    /**
     * 如果不是移动端，下面这一块postCssPxToRem配置可以不用
     */
    postCssPxToRem({
      rootValue: 72, // 设计图宽度是720的，这里就写72， 750的，就写75
      propList: ['*', '!--van-*'],
      unitPrecision: 5,
      selectorBlackList: [], // 某些元素不需要转rem时，可以在此定义,
      exclude: /vant/i,
    }),
    // https://github.com/cuth/postcss-pxtorem/issues/87
    postCssPxToRem({
      rootValue: 36,
      propList: ['--van-*'], // 这一部分是兼容vant组件库的尺寸适配
      unitPrecision: 5,
      selectorBlackList: [], // 某些元素不需要转rem时，可以在此定义,
    }),
  ],
};
