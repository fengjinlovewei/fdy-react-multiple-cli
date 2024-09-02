const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const {
  isServerHttp,
  pages,
  getPackages,
  dll,
  getChunkNames,
} = require('./common');

const packages = getPackages();

// console.log('packages', packages);

const getHtmlWebpackPlugin = (name) => {
  const { indexChunkName, modulesChunkName } = getChunkNames(name);

  return new HtmlWebpackPlugin({
    title: name,
    template: path.resolve(__dirname, '../public/pages.html'), // 模板取定义root节点的模板
    favicon: path.resolve(__dirname, '../public/favicon.ico'),
    filename: `${name}/index.html`, // 注意，这里使用`[name]/index.html` 报错
    chunks: [indexChunkName, modulesChunkName],
    inject: true, // 自动注入静态资源
    // https://github.com/jantimon/html-webpack-plugin/blob/main/examples/template-parameters/webpack.config.js
    templateParameters: (compilation, assets, assetTags, options) => {
      const chunks = compilation.entrypoints.get(indexChunkName).chunks;

      // debugger;
      // console.log(indexChunkName);
      // console.log(compilation, assets, assetTags, options);

      let fileList = [];

      for (const chunk of chunks) {
        for (const auxiliaryFile of chunk.auxiliaryFiles) {
          fileList.push(auxiliaryFile);
        }
      }

      fileList = fileList.map((item) => path.join(assets.publicPath, item));

      const preloadLinks = fileList
        .filter((item) => item.indexOf('.preload.') > -1)
        .map((item) => {
          return {
            rel: 'preload',
            as: 'image',
            href: item,
          };
        });

      const prefetchLinks = fileList
        .filter((item) => item.indexOf('.prefetch.') > -1)
        .map((item) => {
          return {
            rel: 'prefetch',
            as: 'image',
            href: item,
          };
        });

      return {
        compilation,
        webpackConfig: compilation.options,
        htmlWebpackPlugin: {
          tags: assetTags,
          files: assets,
          options: {
            ...options,
            preloadLinks,
            prefetchLinks,
            dllPaths: [dll.core.jsPath],
          },
        },
      };
    },
  });
};

const htmlTemplates = packages.map((name) => getHtmlWebpackPlugin(name));

const packagesData = pages.map((name) => {
  return {
    name,
    show: packages.includes(name),
  };
});

packagesData.sort((a, b) => b.show - a.show);

console.log(packagesData);

// 注入测试主页面
isServerHttp &&
  htmlTemplates.push(
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'), // 模板取定义root节点的模板
      filename: `./index.html`,
      inject: false, // 自动注入静态资源
      templateParameters: (compilation, assets, assetTags, options) => {
        return {
          compilation,
          webpackConfig: compilation.options,
          htmlWebpackPlugin: {
            tags: assetTags,
            files: assets,
            options: {
              ...options,
              packagesData,
            },
          },
        };
      },
    }),
  );

module.exports = htmlTemplates;
