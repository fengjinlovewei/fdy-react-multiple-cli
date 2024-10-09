const path = require('path');
const urlRegex = require('url-regex');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const {
  isServerHttp,
  pages,
  getPackages,
  dll,
  getChunkNames,
} = require('./common');

const packages = getPackages();

function getLinkData(compilation, indexChunkName) {
  const urlPattern = /(https?:\/\/[^/]*)/i;

  const chunks = compilation.entrypoints.get(indexChunkName).chunks;

  const fileList = [];

  const cndList = new Set();

  for (const chunk of chunks) {
    fileList.push(...chunk.auxiliaryFiles);
    // modules的第三方的包就不抽离dns了，因为东西实在太多了，好多都是报错处理的链接
    if (chunk.name !== indexChunkName) continue;

    for (const file of chunk.files) {
      if (/\.(css|js)$/.test(file)) {
        const asset = compilation.getAsset(file);
        if (!asset) return;
        const content = asset.source.source();
        if (typeof content === 'string') {
          const urls = content.match(urlRegex({ strict: true }));

          if (urls) {
            urls.forEach((url) => {
              const match = url.match(urlPattern);
              if (match && match[1]) {
                cndList.add(match[1]);
              }
            });
          }
        }
      }
    }
  }

  return {
    fileList,
    cndList: [...cndList],
  };
}

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
      let { fileList, cndList } = getLinkData(compilation, indexChunkName);

      fileList = fileList.map((item) => path.join(assets.publicPath, item));

      const cdnLinks = cndList.map((item) => {
        return {
          rel: 'dns-prefetch',
          href: item,
        };
      });

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
            metaList: [...cdnLinks, ...prefetchLinks, ...preloadLinks],
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
