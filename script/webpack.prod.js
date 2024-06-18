const path = require('path');

const baseConfig = require('./webpack.base.js');
const { merge } = require('webpack-merge');
const globAll = require('glob-all');

// const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = merge(baseConfig, {
  mode: 'production', // 生产模式,会开启tree-shaking和压缩代码,以及其他优化
  optimization: {
    minimize: false, // 是否开启压缩，
    // 注意：minimize 不设置为true，minimizer 也不生效
    minimizer: [
      // minimize 压缩不会压缩css，所以需要自己找包解决
      new CssMinimizerPlugin(), // 压缩css
      // 使用了 minimizer，minimize的压缩js就失效了。。。，所以需要手动安装一个
      // 压缩js
      new TerserPlugin({
        parallel: true, // 开启多线程压缩
        extractComments: true, //是否将注释剥离到单独的文件中,默认值： true
        terserOptions: {
          compress: {
            pure_funcs: ['console.log'], // 删除console.log
          },
        },
      }),
    ],
  },
  plugins: [
    // 抽离css插件
    // 如果使用 chunkhash ，引入css的js文件代码改变了，css文件的chunkhash也一起改变，
    // 且js文件的 chunkhash 和 css 文件的 chunkhash 是一样的
    // 所以这里必须用 contenthash，他不会随js代码改变而改变hash值
    new MiniCssExtractPlugin({
      filename: '[name]/[name].[contenthash:8].css', // 抽离css的输出目录和名称
      chunkFilename: '[name]/[name].[chunkhash:8].css', // 异步包输出目录
    }),
    // 清理无用css
    new PurgeCSSPlugin({
      // 检测src下所有tsx文件和public下index.html中使用的类名和id和标签名称
      // 只打包这些文件中用到的样式
      paths: globAll.sync([
        path.join(__dirname, '../src/**/*.tsx'),
        path.join(__dirname, '../public/index.html'),
        path.join(__dirname, '../public/pages.html'),
      ]),
      safelist: {
        standard: [/^adm-/, /^module-/], // 过滤以adm-开头的类名，这是antd的前缀，哪怕没用到也不删除
      },
    }),
    new CompressionPlugin({
      test: /.(js|css)$/, // 只生成css,js压缩文件
      filename: '[path][base].gz', // 文件命名
      algorithm: 'gzip', // 压缩格式,默认是gzip
      threshold: 10240, // 只有大小大于该值的资源会被处理。默认值是 10k
      minRatio: 0.8, // 压缩率,默认值是 0.8
    }),
  ],
});
