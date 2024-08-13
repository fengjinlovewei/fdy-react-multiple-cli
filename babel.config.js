const { isDev } = require('./script/common');

console.log('isDev', isDev);

module.exports = {
  // ...
  // 预设执行顺序由右往左,所以先处理ts,再处理jsx
  presets: [
    [
      /*
      core-js 是一个库，它包含了JavaScript的新特性的Polyfill，也就是说，如果你使用了某个新的JavaScript特性，
      但是这个特性在旧的浏览器上不被支持，core-js 可以帮你“补充”这个特性。例如，如果你想要在一个不支持Promise的
      环境中使用Promise，你就需要引入core-js中关于Promise的Polyfill。

      @babel/preset-env 是Babel的一个插件，它能够根据配置的目标环境，自动帮你引入需要的core-js Polyfill。
      这样，你就不需要手动去引入各种Polyfill了，可以节省代码，并且更加方便管理。

      总结一下，core-js 是一个包含了许多Polyfill的库，而 @babel/preset-env 是一个Babel插件，
      它可以帮你自动引入需要的core-js Polyfill。

      但是注意，core.js只是添加方法（比如ES5数组没有find方法，core.js 就在全局添加一个find方法），
      ES6语法编译成ES5还是使用@babel/preset-env
      */

      '@babel/preset-env',
      {
        // 设置兼容目标浏览器版本,这里可以不写,babel-loader会自动寻找上面配置好的文件.browserslistrc
        // "targets": {
        //  "chrome": 35,
        //  "ie": 9
        // },
        useBuiltIns: 'usage', // 根据配置的浏览器兼容,以及代码中使用到的api进行引入polyfill按需添加
        corejs: 3, // 配置使用core-js低版本
      },
    ],
    [
      '@babel/preset-react',
      {
        // 这里配置默认使用react.creatElement，配置了automatic后，使用_jsx解析
        runtime: 'automatic',
      },
    ],
    // 先经过ts编译
    '@babel/preset-typescript',
  ],
  plugins: [
    // 如果是开发模式,就启动react热更新插件
    isDev && require.resolve('react-refresh/babel'),
    // 这个插件支持class使用修饰符
    ['@babel/plugin-proposal-decorators', { legacy: true }],
  ].filter(Boolean), // 过滤空值
};
