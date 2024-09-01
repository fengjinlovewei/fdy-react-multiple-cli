const { isDev } = require('./script/common');

/**
 * plugin 和 preset 是有顺序的，先 plugin 再 preset，plugin 从左到右，preset 从右到左。
 */
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
        // 使用 @babel/plugin-transform-runtime 后，useBuiltIns和corejs就不能设置了，否则会出现冲突问题
        // useBuiltIns: 'usage', // 根据配置的浏览器兼容,以及代码中使用到的api进行引入polyfill按需添加
        // corejs: 3, // 配置使用core-js低版本
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
    /**
     * 这个包还需要 @babel/runtime @babel/runtime-corejs3 支持
     * 他主要解决了api方法直接挂载到原型上的问题（array.prototype.fill = xxxx）
     *
     * 1.有些第三方插件可能就会判断当前环境的某个方法存不存在的方式判断兼容性，如果你挂在了原形上就会破坏原有逻辑判断。
     * 2. 不需要用的地方就导入垫片代码，而是require一个方法
     */
    ['@babel/plugin-transform-runtime', { corejs: 3 }],
  ].filter(Boolean), // 过滤空值
};
