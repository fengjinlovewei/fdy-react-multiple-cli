const { getPackages, getChunkNames } = require('./common');

const packages = getPackages();

const entryCacheGroups = {};

function getEntryCacheGroups(name) {
  const { indexChunkName, modulesChunkName } = getChunkNames(name);

  entryCacheGroups[modulesChunkName] = {
    /**
     * 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块。
     * 这可能会影响 chunk 的结果文件名。
     * 默认值：boolean = true
     */
    reuseExistingChunk: false,
    /**
     * 告诉 webpack 忽略 splitChunks.minSize、splitChunks.minChunks、splitChunks.maxAsyncRequests
     * 和 splitChunks.maxInitialRequests 选项，并始终为此缓存组创建 chunk。
     * 默认值：boolean = false
     */
    enforce: true,
    /**
     * async: 只有异步加载的某块才会被分包
     * initial: 同步和异步导入的模块都会被选中分离出来。
     * all: 如果1.js被 a入口动态导入，被b入口静态导入，initial会打包2个包，一个存在于b中，另一个是单独的包，支持异步加载。
     * 使用all的话就还是打成一个包，就是一个单独的包
     */
    // chunks: 'initial', // 只提取初始化就能获取到的模块,不管异步的
    /**
     * 这个函数的返回值将决定是否包含每一个 chunk
     * ps：这个的意思应该就是，当前的分包，作用域是不是所有的chunk啊？
     * 比如现在的chunk有 ['news/index', 'search/index', 'shared/index']
     * 如果使用 all，async 和 initial 那么当前的包就会在 ['news/index', 'search/index', 'shared/index']里去抽离；
     * 如果是自定义，比如下面写的这段，那么就只在符合条件的chunk里去分包
     * 或者说如果chunks() { } 返回值为true，那么就应用当前分包规则，反之亦然。
     */
    chunks(chunk) {
      return chunk.name === indexChunkName;
    },
    // 提取node_modules代码
    test: /[\\/]node_modules[\\/]/,
    name: modulesChunkName, // 提取文件命名为vendors,js后缀和chunkhash会自动加
    minChunks: 1, // 只要使用一次就提取出来
    minSize: 0, // 提取代码体积大于0就提取出来
    priority: 1, // 提取优先级为1
  };
}

packages.forEach((name) => getEntryCacheGroups(name));

module.exports = entryCacheGroups;
