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

// const { isDev, isServerHttp, appSrc, pages, entry } = require('./common');

console.log('process.env.NODE_ENV', process.env.NODE_ENV);
console.log('process.env.SERVER_HTTP', process.env.SERVER_HTTP);

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
    // runtimeChunk: 'single',
    // splitChunks: {
    //   // 分隔代码
    //   cacheGroups: {
    //     default: false,
    //     'news/vendors': {
    //       // 提取node_modules代码
    //       test: (module) => {
    //         //console.log('module-----module', module.resource);
    //         if (module.resource && module.resource.indexOf(path.resolve(appSrc, `pages/news`)) !== -1) {
    //           // console.log('news-module-----module', module.resource);
    //           return true;
    //         }
    //         return false;
    //       }, // 只匹配node_modules里面的模块
    //       name: 'news-vendors', // 提取文件命名为vendors,js后缀和chunkhash会自动加
    //       minChunks: 1, // 只要使用一次就提取出来
    //       //filename: 'news/js/[name].[chunkhash:8].js',
    //       /**
    //        * async: 只有异步加载的某块才会被分包
    //        * initial: 同步和异步导入的模块都会被选中分离出来。
    //        * all: 如果1.js被 a入口动态导入，被b入口静态导入，initial会打包2个包，一个存在于b中，另一个是单独的包，支持异步加载。
    //        * 使用all的话就还是打成一个包，就是一个单独的包
    //        */
    //       chunks: 'initial', // 只提取初始化就能获取到的模块,不管异步的
    //       minSize: 0, // 提取代码体积大于0就提取出来
    //       priority: 1, // 提取优先级为1
    //     },
    //     // minChunks 2，表示 一个文件至少被2个入口文件引用，才会放在commons这个包里
    //     // 在单入口工程中，这个配置没用，因为不可能有2个入口
    //     // 'news/commons': {
    //     //   // 提取页面公共代码
    //     //   name: 'news/commons', // 提取文件命名为commons
    //     //   //filename: 'news/js/[name].[chunkhash:8].js',
    //     //   minChunks: 2, // 只要使用两次就提取出来
    //     //   chunks: 'initial', // 只提取初始化就能获取到的模块,不管异步的
    //     //   minSize: 0, // 提取代码体积大于0就提取出来
    //     // },
    //     'news/bundle': {
    //       test: (module) => {
    //         if (module.resource && module.resource.indexOf('node_modules') > -1) {
    //           //console.log('news-bundle-----module', module);
    //           return true;
    //         }
    //         return false;
    //       }, // 只匹配node_modules里面的模块, // 只匹配node_modules里面的模块
    //       name: 'search-bundle', // 提取文件命名为vendors,js后缀和chunkhash会自动加
    //       minChunks: 1, // 只要使用一次就提取出来
    //       chunks: 'initial', // 只提取初始化就能获取到的模块,不管异步的
    //       minSize: 0, // 提取代码体积大于0就提取出来
    //       priority: 1, // 提取优先级为1
    //     },
    //     'search/vendors': {
    //       test: (module) => {
    //         //console.log('module-----module', module.resource);
    //         if (module.resource && module.resource.indexOf(path.resolve(appSrc, `pages/search`)) !== -1) {
    //           // console.log('search-module-----module', module.resource);
    //           // console.log('search-module-----module-ha', module);
    //           return true;
    //         }
    //         return false;
    //       }, // 只匹配node_modules里面的模块, // 只匹配node_modules里面的模块
    //       name: 'search-vendors', // 提取文件命名为vendors,js后缀和chunkhash会自动加
    //       minChunks: 1, // 只要使用一次就提取出来
    //       chunks: 'initial', // 只提取初始化就能获取到的模块,不管异步的
    //       minSize: 0, // 提取代码体积大于0就提取出来
    //       priority: 1, // 提取优先级为1
    //     },
    //     'search/bundle': {
    //       test: (module) => {
    //         if (module.resource && module.resource.indexOf('node_modules') > -1) {
    //           debugger;
    //           console.log('search-bundle-----module', module);
    //           return true;
    //         }
    //         return false;
    //       }, // 只匹配node_modules里面的模块, // 只匹配node_modules里面的模块
    //       name: 'search-vendors', // 提取文件命名为vendors,js后缀和chunkhash会自动加
    //       minChunks: 1, // 只要使用一次就提取出来
    //       chunks: 'initial', // 只提取初始化就能获取到的模块,不管异步的
    //       minSize: 0, // 提取代码体积大于0就提取出来
    //       priority: 1, // 提取优先级为1
    //     },
    //   },
    // },
  },
  plugins: [
    // 复制文件插件
    // new CopyPlugin({
    //   patterns: [
    //     {
    //       from: path.resolve(__dirname, '../public'), // 复制public下文件
    //       to: path.resolve(__dirname, '../dist'), // 复制到dist目录中
    //       filter: (source) => !/(index|pages)\.html$/.test(source), // 忽略的文件
    //     },
    //   ],
    // }),
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
