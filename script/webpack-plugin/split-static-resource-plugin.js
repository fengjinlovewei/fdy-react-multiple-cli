const path = require('path');
const { sources } = require('webpack');
const { isDev, staticName, outputPath } = require('../common');
const { deleteFolder } = require('../utils');

class SplitStaticResourcePlugin {
  apply(compiler) {
    // 名字的参数 SplitStaticResourcePlugin 没用，就是注释的作用

    compiler.hooks.thisCompilation.tap(
      'SplitStaticResourcePlugin',
      (compilation) => {
        // 1. 在这个方法里，替换了文件内使用的路径
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
            const reg = new RegExp(
              `${staticName}.*?\.(png|jpg|jpeg|gif|svg|webp)`,
              'gi',
            );

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

                compilation.updateAsset(
                  item,
                  new sources.RawSource(newContent),
                );
              }
            }
          },
        );

        // 2. 优化已有 asset 数量，例如，通过将 asset 内联到其他 asset 中。
        compilation.hooks.processAssets.tap(
          {
            name: 'SplitStaticResourcePlugin',
            stage: compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE,
            additionalAssets: true,
          },
          (assets) => {
            // debugger;

            // console.log(compilation);
            // console.log(assets);

            // 开始复制图片等文件到各个chunk
            for (const chunk of compilation.chunks) {
              if (!chunk.name) continue;
              const name = chunk.name.split('/')[0];

              const newAuxiliaryFiles = new Set();

              // name = 'news'
              // chunk.auxiliaryFiles = ['__@static@__/images/data2.35f297be.webp']
              // staticName = '__@static@__'
              // 把
              for (const auxiliaryFile of chunk.auxiliaryFiles) {
                // 把 __@static@__/images/data2.35f297be.webp 替换为 news/images/data2.35f297be.webp
                const key = auxiliaryFile.replaceAll(staticName, name);
                // 复制图片真实资源
                compilation.assets[key] = compilation.assets[auxiliaryFile];
                newAuxiliaryFiles.add(key);
              }

              chunk.auxiliaryFiles = newAuxiliaryFiles;

              // 先清空原来的 auxiliaryFiles
              // chunk.auxiliaryFiles.clear();
              // // 然后把新的图片路径添加进去
              // for (const newAuxiliaryFile of newAuxiliaryFiles) {
              //   chunk.auxiliaryFiles.add(newAuxiliaryFile);
              // }
            }

            // 删除与 staticName 名称相关的 asset 文件
            for (const asset in compilation.assets) {
              if (asset.indexOf(staticName) > -1) {
                compilation.deleteAsset(asset);
              }
            }
          },
        );
      },
    );

    compiler.hooks.emit.tap('SplitStaticResourcePlugin', (compilation) => {
      // 删除与输出的 chunk 相关的文件夹目录，以防止hash文件累加，占用空间。
      for (const chunk of compilation.chunks) {
        if (!chunk.name) continue;
        const name = chunk.name.split('/')[0];
        if (!isDev) {
          // 新的chunk输出文件前，先把对应的文件夹删除掉
          deleteFolder(path.resolve(outputPath, name));
        }
      }
    });
  }
}

module.exports = SplitStaticResourcePlugin;
