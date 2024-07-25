const path = require('path');
const { sources } = require('webpack');
const { isDev, staticName, outputPath } = require('../common');
const { deleteFolder } = require('../utils');

class SplitStaticResourcePlugin {
  constructor(options = {}) {}
  apply(compiler) {
    // 名字的参数 SplitStaticResourcePlugin 没用，就是注释的作用
    // 在这个方法里，替换了文件内使用的路径
    compiler.hooks.thisCompilation.tap('SplitStaticResourcePlugin', (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: 'SplitStaticResourcePlugin',
          stage: compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_COMPATIBILITY,
          additionalAssets: true,
        },
        (assets) => {
          // debugger;
          // console.log(assets);
          // console.log(compilation);

          const listFiles = Object.keys(compilation.assets);
          const reg = new RegExp(`${staticName}.*?\.(png|jpg|jpeg|gif|svg|webp)`, 'gi');

          /**
           * 这个for循环处理的问题是：一个chunk引入了css文件，但css文件中引入的图片路径并不会
           * 被 chunk 的 auxiliaryFiles 记录，所以需要手动添加一下。
           */
          for (const chunk of compilation.chunks) {
            for (const file of chunk.files) {
              if (/\.css$/.test(file)) {
                const asset = compilation.getAsset(file);
                if (!asset) return;
                const content = asset.source.source();
                if (typeof content === 'string') {
                  const listImg = content.match(reg) || [];
                  for (const img of listImg) {
                    if (listFiles.includes(img)) {
                      chunk.auxiliaryFiles.add(img);
                    }
                  }
                }
              }
            }
          }

          /**
           * 这个for循环处理的问题是：需要把js和css文件中涉及到路径的地方改成当前chunk自己的目录地址
           * 比如 news 这个 chunk 下的 __@static@__/images/data2.35f297be.webp 路径，要修改成
           * news/images/data2.35f297be.webp
           */
          for (let item in assets) {
            // console.log(compiler);
            const asset = compilation.getAsset(item); // <- standardized version of asset object
            const name = asset.name.split('/')[0];
            const content = asset.source.source(); // <- standardized way of getting asset source
            if (typeof content === 'string') {
              // standardized way of updating asset source
              const newContent = content.replaceAll(staticName, name);

              compilation.updateAsset(item, new sources.RawSource(newContent));
            }
          }
        },
      );
    });

    compiler.hooks.emit.tap('SplitStaticResourcePlugin', (compilation) => {
      // 开始复制图片等文件到各个chunk
      for (const chunk of compilation.chunks) {
        const name = chunk.name.split('/')[0];
        for (const auxiliaryFile of chunk.auxiliaryFiles) {
          const key = auxiliaryFile.replaceAll(staticName, name);
          compilation.assets[key] = compilation.assets[auxiliaryFile];
        }
        if (!isDev) {
          // 新的chunk输出文件前，先把对应的文件夹删除掉
          deleteFolder(path.resolve(outputPath, name));
        }
      }

      // debugger;

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
