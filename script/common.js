const path = require('path');
const fs = require('fs');

// 是否是开发模式
const isDev = process.env.NODE_ENV === 'development';

const isServerHttp = process.env.SERVER_HTTP === 'true';

// src的入口
const appSrc = path.resolve(__dirname, '../src');

// 所有pages的名字列表
const pages = fs.readdirSync(`${appSrc}/pages`);

// 入口文件的配置
const entry = pages.reduce((obj, name) => {
  obj[name] = `${appSrc}/pages/${name}/index.tsx`;
  return obj;
}, {});

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

module.exports = {
  isDev,
  isServerHttp,
  appSrc,
  pages,
  entry,
  dll,
};
