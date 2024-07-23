const path = require('path');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.config.js');

console.log('process.env.NODE_ENV', process.env.NODE_ENV);

const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

// 合并公共配置,并添加开发环境配置
module.exports = merge(baseConfig, {
  mode: 'development', // 开发模式,打包更加快速,省了代码优化步骤
  devtool: 'eval-cheap-module-source-map', // 源码调试模式
  devServer: {
    port: 1992, // 服务端口号
    compress: false, // gzip压缩,开发环境不开启,提升热更新速度
    hot: true, // 开启热更新，后面会讲react模块热替换具体配置
    historyApiFallback: true, // 解决history路由404问题
    static: [{ directory: path.join(__dirname, '../public') }],
    open: true,
  },
  plugins: [
    /**
     * 
     *热更新上面已经在devServer中配置hot为true, 在webpack4中,还需要在插件中添加了HotModuleReplacementPlugin,
      在webpack5中,只要devServer.hot为true了,该插件就已经内置了。
      现在开发模式下修改css和less文件，页面样式可以在不刷新浏览器的情况实时生效，因为此时样式都在style标签里面，
      style-loader做了替换样式的热替换功能。但是修改App.tsx,浏览器会自动刷新后再显示修改后的内容,但我们想要的
      不是刷新浏览器,而是在不需要刷新浏览器的前提下模块热更新,并且能够保留react组件的状态。

      可以借助@pmmmwh/react-refresh-webpack-plugin插件来实现,该插件又依赖于react-refresh, 
     */
    new ReactRefreshWebpackPlugin(), // 添加热更新插件,这个是解决css可以热更新，但是jsx文件只能刷新页面
  ],
});
