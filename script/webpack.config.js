const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const SplitStaticResourcePlugin = require('./plugins/split-static-resource-plugin');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');

const htmlTemplates = require('./getHtmlTemplates');
const entryCacheGroups = require('./getEntryCacheGroups');

const {
  isDev,
  staticName,
  publicPath,
  appSrc,
  outputPath,
  gloablLess,
  getEntry,
  dll,
} = require('./common');

const entry = getEntry();

// 必须自己定义添加 module- 前缀，然后在 standard: [/^adm-/, /^module-/] 配置这个前缀
// 因为这个css名称是动态生成的，所以 PurgeCSSPlugin 的treeshrking 会把这部分删除掉，
// 所以必须添加自定义前缀过滤一下
const myGetCSSModuleLocalIdent = (...arg) =>
  'module-' + getCSSModuleLocalIdent(...arg);

// style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;

console.log('process.env.NODE_ENV', process.env.NODE_ENV);

const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    //path.resolve(__dirname, './loaders/loader2'),
    isDev ? 'style-loader' : MiniCssExtractPlugin.loader, // 开发环境使用style-looader,打包模式抽离css
    // path.resolve(__dirname, './loaders/loader1'),
    {
      loader: 'css-loader',
      options: cssOptions,
    },
    'postcss-loader',
  ];
  if (preProcessor) {
    loaders.push(
      preProcessor, // 在这里引入要增加的全局less文件
      {
        loader: 'style-resources-loader',
        options: {
          patterns: [...gloablLess],
        },
      },
    );
  }
  return loaders;
};

// console.log('entry', entry);

module.exports = {
  entry, // 入口文件
  // 打包文件出口
  // 热更新模式下会导致chunkhash和contenthash计算错误，因此热更新下只能使用hash模式或者不使用hash
  output: {
    filename: isDev ? '[name].js' : '[name].[chunkhash:8].js', // 每个输出js的名称
    chunkFilename: isDev ? '[name].chunk.js' : '[name].[chunkhash:8].chunk.js', // 异步包输出目录
    path: outputPath, // 打包结果输出路径
    // clean: true, // webpack4需要配置clean-webpack-plugin来删除dist文件,webpack5内置了
    publicPath, // 打包后文件的公共前缀路径
  },
  /**
   * 
   在webpack5之前做缓存是使用babel-loader缓存解决js的解析结果,cache-loader缓存css等资源的解析结果,
   还有模块缓存插件hard-source-webpack-plugin,配置好缓存后第二次打包,通过对文件做哈希对比来验证文件
   前后是否一致,如果一致则采用上一次的缓存,可以极大地节省时间。
   webpack5 较于 webpack4,新增了持久化缓存、改进缓存算法等优化,通过配置 cache 持久化缓存,
   来缓存生成的 webpack 模块和 chunk,改善下一次打包的构建速度,可提速 90% 左右,

   第一次打包用了1061毫秒
   第二次打包用了 256毫秒

   缓存的存储位置在node_modules/.cache/webpack,里面又区分了development和production缓存
   * 
   */
  cache: {
    type: 'filesystem', // 使用文件缓存
  },
  module: {
    rules: [
      {
        /**
         * 如果引入了第三方包，比如antd，那么如果想要antd里的js代码也能按照本工程的.browserslistrc
         * 内容进行js代码降级处理的话，就不能排除 node_modules，因为antd是在 node_modules里的
         */

        include: [appSrc], // 只对项目src文件进行loader解析
        test: /\.(js|jsx|ts|tsx)$/,

        /**
         * 由于thread-loader不支持抽离css插件MiniCssExtractPlugin.loader,
         * 所以这里只配置了多进程解析js,开启多线程也是需要启动时间,大约600ms左右,所以适合规模比较大的项目。
         */
        use: ['thread-loader', 'babel-loader', 'replace-code-loader'],
      },
      {
        // 匹配到一个就不继续培培乐，顺序是从下到上
        oneOf: [
          {
            /**
             * 开始我以为添加了 path.resolve(__dirname, '../node_modules/antd-mobile')
             * 就可以解决css这个loader解析不到antd-mobile里css的问题，结果是没有解决，
             * 因为报错的css文件链接为
             * ./node_modules/.pnpm/antd-mobile@5.36.1_react-dom@18.3.1_react@18.3.1/node_modules/antd-mobile/es/global/global.css
             * 这个链接是 .pnpm 文件夹下的引用，所以配置路径为 ../node_modules/antd-mobile 肯定是不对的
             * 原因就是使用pnpm安装依赖引发的问题，具体细节要以后研究，暂时先注释吧
             */
            // include: [
            //   appSrc,
            //   path.resolve(__dirname, '../node_modules/antd-mobile'),
            // ],
            test: cssRegex, //匹配 css 文件
            exclude: cssModuleRegex,
            // 注意 postcss-loader 放的位置， postcss-loader 的配置放在了postcss.config.js 中
            use: getStyleLoaders({
              // importLoaders 的作用是(以下针对的都是生产环境，dev环境没有问题)：
              // 1.css 文件有内容： .title{ transform: scale(0.5) }
              // 2.css 文件有内容： @import './1.css'; .title { color: red }
              /**
               *首先2.css @import语句导入了1.css
               *2.css可以被匹配，当它被匹配到之后就是postcss-loader进行工作
               *基于当前的代码，postcss-loader 拿到了2.css当中的代码之后分析基于我们的筛选条件并不需做额外的处理
                最终就将代码直接教给了css-loader
               *此时 css-loader是可以处理@import './1.css'，这个时候它又拿到了1.css文件，但是loader 不会回头找postcss-loader处理兼容。
               *最终将处理好的css代码交给style-loader进行展示
               *造成的问题就是1.css的样式没有添加浏览器的兼容前缀，因为他没有经过postcss-loader!
               *所以importLoaders得作用就是遇到1.css时，可以向后找1个loader进行编译，也就是postcss-loader

               */
              importLoaders: 1,
              modules: {
                mode: 'icss',
              },
              // 表示当前文件是否含有副作用
              // 副作用（effect 或者 side effect）指在导入时会执行特殊行为的代码，而不是仅仅暴露一个或多个导出内容。
              // polyfill 就是一个例子，尽管其通常不提供导出，但是会影响全局作用域，因此 polyfill 将被视为一个副作用。
              // 所以，如果所有代码都不包含副作用，我们就可以简单地将该属性标记为 false 以告知 webpack 可以安全地删除未使用的导出内容。
              // http://webpack.docschina.org/guides/tree-shaking/#mark-the-file-as-side-effect-free
              // sideEffects: true,
            }),
          },
          {
            test: cssModuleRegex,
            use: getStyleLoaders({
              importLoaders: 1,
              modules: {
                mode: 'local',
                getLocalIdent: myGetCSSModuleLocalIdent,
              },
            }),
          },
          {
            include: [appSrc],
            test: lessRegex, //匹配sless 文件
            exclude: lessModuleRegex,
            // 注意 postcss-loader 放的位置， postcss-loader 的配置放在了postcss.config.js 中
            use: getStyleLoaders(
              {
                importLoaders: 2,
                modules: {
                  mode: 'icss',
                },
                // sideEffects: true,
              },
              'less-loader',
            ),
          },
          {
            include: [appSrc],
            test: lessModuleRegex, //匹配.module.less 文件
            use: getStyleLoaders(
              {
                importLoaders: 2,
                modules: {
                  mode: 'local',
                  getLocalIdent: myGetCSSModuleLocalIdent,
                },
              },
              'less-loader',
            ),
          },
        ],
      },

      // 对于图片文件,webpack4使用file-loader和url-loader来处理的,
      // 但webpack5不使用这两个loader了,而是采用自带的asset-module来处理
      // 这个也能处理css的背景url，但是无法处理行间属性的链接，比如
      // <img src='./assets/images/xiaoxiao.jpeg' alt='' />
      {
        include: [appSrc],
        test: /\.(png|jpg|jpeg|gif|svg|webp)$/, // 匹配图片文件
        type: 'asset', // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          },
        },
        // 图片为啥需要 contenthash？直接使用[name][ext]不行吗？
        // 比如一张图片叫 person.jpeg，打包碗也是这个名字，用户访问了这个图片缓存了
        // 第二天前端用一张新图片person.jpeg替换了老的person.jpeg，名字没变，
        // 那么用户就还在读取之前的缓存，新的图片加载不出来，或者很多天以后才加载出来
        generator: {
          filename: `${staticName}/images/[name].[contenthash:8][ext]`, // 文件输出目录和命名
        },
      },
      // 匹配字体
      {
        test: /\.(woff2?|eot|ttf|otf)$/, // 匹配字体图标文件
        type: 'asset', // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          },
        },
        generator: {
          filename: `${staticName}/fonts/[name][contenthash:8][ext]`, // 文件输出目录和命名
        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/, // 匹配媒体文件
        type: 'asset', // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          },
        },
        generator: {
          filename: `${staticName}/media/[name][contenthash:8][ext]`, // 文件输出目录和命名
        },
      },
    ],
  },
  resolveLoader: {
    modules: ['node_modules', path.resolve(__dirname, 'loaders')],
  },
  optimization: {
    // 添加动态的runtime文件，可以配合ScriptExtHtmlWebpackPlugin使用
    // 由于 ScriptExtHtmlWebpackPlugin 不再维护，还是放弃使用了
    // entrypoint.name 都是**/index的模式，所以要把/index排除掉
    runtimeChunk: {
      name: (entrypoint) => `${entrypoint.name.replace('/index', '')}/runtime`,
    },
    splitChunks: {
      cacheGroups: {
        default: false,
        ...entryCacheGroups,
      },
    },
  },
  /**
   * extensions是webpack的resolve解析配置下的选项，在引入模块时不带文件后缀时，
   * 会来该配置数组里面依次添加后缀查找文件，因为ts不支持引入以 .ts, tsx为后缀的文件，
   * 所以要在extensions中配置，而第三方库里面很多引入js文件没有带后缀，所以也要配置下js
   * 修改webpack.base.js，注意把高频出现的文件后缀放在前面
   */
  resolve: {
    extensions: ['.js', 'jsx', '.ts', '.tsx', '.less', '.json', '.mjs', '.cjs'],
    alias: {
      // 这个配置，在css里也生效
      '@': appSrc,
    },
  },
  plugins: [
    ...htmlTemplates,
    new webpack.DllReferencePlugin({
      manifest: dll.core.manifest,
      context: dll.context,
    }),
    // 复制文件插件
    new CopyPlugin({
      patterns: [
        {
          from: dll.core.path, // 复制public下文件
          to: dll.core.copyToPath, // 复制到dist目录中
          // filter: (source) => !/(index|pages)\.html$/.test(source), // 忽略的文件
        },
      ],
    }),

    new SplitStaticResourcePlugin(),

    //  现在不需要这个插件，就可以直接使用了
    // new webpack.DefinePlugin({
    //   'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    // }),
  ],
};
