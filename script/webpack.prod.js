const path = require('path');

const baseConfig = require('./webpack.config.js');
const { merge } = require('webpack-merge');
const globAll = require('glob-all');

// const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const WebpackBar = require('webpackbar');

module.exports = merge(baseConfig, {
  mode: 'production', // 生产模式,会开启tree-shaking和压缩代码,以及其他优化
  devtool: 'source-map',
  optimization: {
    minimize: true, // 是否开启压缩，
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
            drop_debugger: true, //移除自动断点功能；
            pure_funcs: ['console.log'], // 删除console.log
          },
          format: {
            comments: false, //删除注释
          },
        },
      }),
    ],
  },
  plugins: [
    // 不维护了这个插件，不使用了
    // new ScriptExtHtmlWebpackPlugin({
    //   inline: /runtime~.+.js$/, //正则匹配runtime文件名，然后打入html文件中。必须在HtmlWebpackPlugin之后使用。
    // }),
    new WebpackBar({
      name: 'production',
      // color: '#85d', // 默认green，进度条颜色支持HEX
      basic: true, // 默认true，启用一个简单的日志报告器
      profile: false, // 默认false，启用探查器。
    }),
    // 抽离css插件
    // 如果使用 chunkhash ，引入css的js文件代码改变了，css文件的chunkhash也一起改变，
    // 且js文件的 chunkhash 和 css 文件的 chunkhash 是一样的
    // 所以这里必须用 contenthash，他不会随js代码改变而改变hash值
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css', // 抽离css的输出目录和名称
      chunkFilename: '[name].[contenthash:8].css', // 异步包输出目录
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
      test: /^(?!runtime\~)(.*)\.(js|css)$/, // 只生成css,js压缩文件,但是runtime文件要排除掉
      filename: '[path][base].gz', // 文件命名
      algorithm: 'gzip', // 压缩格式,默认是gzip
      threshold: 10240, // 只有大小大于该值的资源会被处理。默认值是 10k
      minRatio: 0.8, // 压缩率,默认值是 0.8
    }),
  ],
});
