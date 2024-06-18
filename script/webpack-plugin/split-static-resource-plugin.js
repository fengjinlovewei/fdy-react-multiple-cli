const path = require('path');
const { sources } = require('webpack');
const { isDev, staticName, outputPath } = require('../common');
const { deleteFolder } = require('../utils');

class SplitStaticResourcePlugin {
  constructor(options = {}) {
    // console.log('myoptions', options);
  }
  apply(compiler) {
    // compiler.hooks.done.tap('Hello World Plugin', (compilation) => {
    //   // debugger;
    //   console.log('Hello World!', compilation);
    // });

    // compiler.hooks.normalModuleFactory.tap('SplitStaticResourcePlugin', (nmf) => {
    //   nmf.hooks.beforeResolve.tap('SplitStaticResourcePlugin', (result) => {
    //     // debugger;

    //     console.log('result.request', result.request);
    //     if (result.request.includes('static/images/')) {
    //       result.request = result.request.replace('static/images/', 'cococ/images/');
    //     }
    //   });
    // });

    // 名字的参数 SplitStaticResourcePlugin 没用，就是注释的作用
    // 在这个方法里，替换了文件内使用的路径
    compiler.hooks.thisCompilation.tap('SplitStaticResourcePlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'SplitStaticResourcePlugin',
          stage: compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE,
          additionalAssets: true,
        },
        (assets) => {
          for (let i in assets) {
            //debugger;
            const asset = compilation.getAsset(i); // <- standardized version of asset object
            const name = asset.name.split('/')[0];
            const content = asset.source.source(); // <- standardized way of getting asset source
            if (typeof content === 'string') {
              // standardized way of updating asset source
              const newContent = content.replaceAll(staticName, name);
              compilation.updateAsset(i, new sources.RawSource(newContent));
            }
          }
        },
      );
    });

    compiler.hooks.emit.tap('SplitStaticResourcePlugin', (compilation) => {
      // 开始复制文件到各个chunk
      for (const chunk of compilation.chunks) {
        const name = chunk.name;
        for (const auxiliaryFile of chunk.auxiliaryFiles) {
          const key = auxiliaryFile.replaceAll(staticName, name);
          compilation.assets[key] = compilation.assets[auxiliaryFile];
        }
        if (!isDev) {
          // 新的chunk输出文件前，先把对应的文件夹删除掉
          deleteFolder(path.resolve(outputPath, name));
        }
      }

      debugger;

      // 删除 staticName 文件夹内内容
      for (const key in compilation.assets) {
        if (key.indexOf(staticName) > -1) {
          compilation.deleteAsset(key);
        }
      }
    });
  }
}

module.exports = SplitStaticResourcePlugin;
