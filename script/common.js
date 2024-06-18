const path = require('path');
const fs = require('fs');

// 是否是开发模式
const isDev = process.env.NODE_ENV === 'development';

const isServerHttp = process.env.SERVER_HTTP === 'true';

const staticName = '__@static@__';

// src的入口
const appSrc = path.resolve(__dirname, '../src');

const outputPath = path.resolve(__dirname, '../dist');

// 所有pages的名字列表
const pages = fs.readdirSync(`${appSrc}/pages`);

// 所有less文件都会引入的less文件
const gloablLess = [path.resolve(__dirname, '../src/styles/common.less')];

// vendors
const vendorPath = path.resolve(__dirname, '../assets/vendors');

const dll = {
  path: vendorPath,
  context: __dirname,
  core: {
    name: 'dll_library_core',
    filename: 'vendor-core.js', // 不能配成变量形式-> dist.js 文件中在使用
    manifest: path.resolve(vendorPath, './manifest/core-manifest.json'),
  },
};

function getPackages() {
  const packageReadonly = require('./package-readonly.js');
  return packageReadonly.packages || [];
}

// 入口文件的配置
function getEntry() {
  const packages = getPackages();
  // 入口文件的配置
  return packages.reduce((obj, name) => {
    obj[name] = `${appSrc}/pages/${name}/index.tsx`;
    return obj;
  }, {});
}

module.exports = {
  isDev,
  isServerHttp,
  staticName,
  appSrc,
  outputPath,
  pages,
  gloablLess,
  dll,
  getPackages,
  getEntry,
};
