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
            stage: compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_COUNT,
            // stage: compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
            additionalAssets: true,
          },
          (assets) => {
            //debugger;
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
            // debugger;

            /**
             * 插件生成新的代码时，sourcemap文件不能生成了，原因在这
             * https://stackoverflow.com/questions/65896008/webpack-problem-generating-sourcemaps-only-generated-when-a-particular-plugin
             */

            const { devtool } = compiler.options;

            for (let item in assets) {
              // console.log(compiler);
              const asset = compilation.getAsset(item); // <- standardized version of asset object
              const nameList = asset.name.split('/');

              let name = nameList[0];
              // if (name === 'none') {
              //   debugger;
              // }
              // length=1，说明这个chunk没有目录名称，比如分离异步包时，没有**/**(**/**.b6131d87.chunk.js)这种命名方式，
              // 只是写了一个名字**(**.b6131d87.chunk.js)或者什么也没写(213.b6131d87.chunk.js)，
              // 会被打包到根目录，那么这时需要把这些包里的 image 放到 根目录的 assets 目录里
              // 这么做的弊端就是老的图片没法被删除掉，因为不知道哪个有用那个没用，不敢删
              // 所以异步包必须使用 **/** 的格式定义名字！，这里容错处理只是兜底
              if (nameList.length <= 1) {
                name = 'assets';
              }
              // debugger;
              const content = asset.source.source(); // <- standardized way of getting asset source

              if (
                typeof content === 'string' &&
                content.indexOf(staticName) > -1
              ) {
                // standardized way of updating asset source
                const newContent = content.replaceAll(staticName, name);

                const { map } = asset.source.sourceAndMap();

                const updateData = devtool
                  ? // for devtool we have to pass map file but this the original one
                    // it would be wrong since you have already changed the content
                    new sources.SourceMapSource(newContent, asset.name, map)
                  : new sources.RawSource(newContent);

                compilation.updateAsset(item, updateData);
              }
            }
          },
        );

        // 2. 优化已有 asset 数量，例如，通过将 asset 内联到其他 asset 中。
        compilation.hooks.processAssets.tap(
          {
            name: 'SplitStaticResourcePlugin',
            stage: compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_COMPATIBILITY,
            // PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE
            additionalAssets: true,
          },
          (assets) => {
            // debugger;

            // console.log(compilation);
            // console.log(assets);

            // 开始复制图片等文件到各个chunk
            for (const chunk of compilation.chunks) {
              let name = 'assets';
              if (chunk.name) {
                const namelist = chunk.name.split('/');
                if (namelist.length > 1) {
                  name = namelist[0];
                }
              }
              // if (!chunk.name) continue;
              // const name = chunk.name.split('/')[0];

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

            // debugger;

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
