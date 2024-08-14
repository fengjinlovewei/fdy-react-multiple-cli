const path = require('path');
const fs = require('fs');

const { getDirFiles } = require('./utils');

// 是否是开发模式
const isDev = process.env.NODE_ENV === 'development';

const isProd = process.env.NODE_ENV === 'production';

const isTest = process.env.NODE_ENV === 'test';

const isServerHttp = process.env.SERVER_HTTP === 'true';

const staticName = '__@static@__';

const publicPath = '/';

// src的入口
const appSrc = path.resolve(__dirname, '../src');

const outputPath = path.resolve(__dirname, '../dist');

// 所有pages的名字列表
const pages = fs.readdirSync(`${appSrc}/pages`);

// 所有less文件都会引入的less文件
const gloablLess = [path.resolve(__dirname, '../src/styles/common.less')];

// vendors
const vendorPath = path.resolve(__dirname, '../assets');

const dll_core_path = path.join(
  vendorPath,
  'dll_core',
  process.env.NODE_ENV || '',
);

const dll = {
  core: {
    path: dll_core_path,
    jsPath: path.join(
      publicPath,
      'vendors',
      getDirFiles(dll_core_path).filter((item) => /\.js$/.test(item))[0] || '',
    ),
    copyToPath: path.resolve(outputPath, 'vendors'),
    context: __dirname,
    name: 'dll_library_core',
    filename: 'vendor-core.[chunkhash:8].js', // 不能配成变量形式-> dist.js 文件中在使用
    manifest: path.resolve(
      dll_core_path,
      './manifest/vendor-core-manifest.json',
    ),
  },
};

function getPackages() {
  const packageReadonly = require('./package-readonly.js');
  return packageReadonly.packages || [];
}

function getChunkNames(name) {
  return {
    indexChunkName: `${name}/index`,
    modulesChunkName: `${name}/modules`,
  };
}

// 入口文件的配置
function getEntry() {
  const packages = getPackages();
  // 入口文件的配置
  return packages.reduce((obj, name) => {
    const { indexChunkName } = getChunkNames(name);
    obj[indexChunkName] = {
      import: `${appSrc}/pages/${name}/index.tsx`,

      // 这里的设置和在optimization里设置是一样的，所以就在optimization里统一处理了
      // runtime: `${name}-runtime`,
    };
    return obj;
  }, {});
}

module.exports = {
  isDev,
  isProd,
  isTest,
  isServerHttp,
  staticName,
  publicPath,
  appSrc,
  outputPath,
  pages,
  gloablLess,
  dll,
  getPackages,
  getEntry,
  vendorPath,
  getChunkNames,
};
